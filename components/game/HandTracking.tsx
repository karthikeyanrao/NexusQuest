import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { gameConfig } from '../../lib/game';

declare global {
  interface Window {
    Hands: new (config?: {
      locateFile?: (file: string) => string;
    }) => {
      setOptions: (options: {
        maxNumHands?: number;
        modelComplexity?: number;
        minDetectionConfidence?: number;
        minTrackingConfidence?: number;
      }) => Promise<void>;
      onResults: (callback: (results: {
        multiHandLandmarks?: Array<Array<{
          x: number;
          y: number;
          z: number;
        }>>;
      }) => void) => void;
      initialize: () => Promise<void>;
      send: (config: { image: HTMLVideoElement }) => Promise<void>;
      close: () => void;
    };
  }
}

export function HandTracking() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeHandTracking = async () => {
      if (!videoRef.current || !isMounted) return;

      try {
        console.log('Starting hand tracking initialization...');
        setIsLoading(true);

        // Load MediaPipe scripts
        const handsScript = document.createElement('script');
        handsScript.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';
        await new Promise((resolve) => {
          handsScript.onload = resolve;
          document.body.appendChild(handsScript);
        });

        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 640,
            height: 480,
            facingMode: 'user'
          }
        });

        if (!isMounted) return;
        
        videoRef.current.srcObject = stream;
        await new Promise<void>((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => resolve();
          }
        });

        // Initialize MediaPipe Hands
        const hands = new window.Hands({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
          }
        });

        handsRef.current = hands;

        await hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 0,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        hands.onResults((results: any) => {
          if (results.multiHandLandmarks?.[0]) {
            const indexFinger = results.multiHandLandmarks[0][8];
            if (indexFinger) {
              const y = indexFinger.y * gameConfig.height;
              window.dispatchEvent(
                new CustomEvent('handMove', { detail: { y } })
              );
            }
          }
        });

        await hands.initialize();
        console.log('Hands model initialized successfully');

        // Initialize camera after hands are ready
        const { Camera } = await import('@mediapipe/camera_utils');
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (!videoRef.current || !handsRef.current) return;
            try {
              await handsRef.current.send({ image: videoRef.current });
            } catch (error) {
              console.error('Frame processing error:', error);
            }
          },
          width: 640,
          height: 480
        });

        cameraRef.current = camera;
        await camera.start();
        console.log('Camera started successfully');

        if (isMounted) {
          setIsInitialized(true);
          setIsLoading(false);
          toast({
            title: "Hand tracking ready",
            description: "Move your index finger to control the bird",
          });
        }

      } catch (error) {
        console.error('Hand tracking initialization error:', error);
        if (isMounted) {
          setIsLoading(false);
          setIsInitialized(false);
          toast({
            title: "Hand tracking failed",
            description: "Please ensure camera permissions are granted and refresh the page",
            variant: "destructive",
          });
        }
      }
    };

    initializeHandTracking();

    return () => {
      isMounted = false;
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (handsRef.current) {
        handsRef.current.close();
      }
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="fixed bottom-4 left-4 w-32 h-24 overflow-hidden rounded-lg bg-black/20 backdrop-blur-sm border border-primary/20">
      <video
        ref={videoRef}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isInitialized ? "opacity-50" : "opacity-25"
        )}
        playsInline
        autoPlay
        muted
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-primary animate-pulse">
          Starting camera...
        </div>
      )}
      {!isInitialized && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-destructive">
          Camera needed
        </div>
      )}
    </div>
  );
}
