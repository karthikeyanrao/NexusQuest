import { useEffect, useRef, useState } from 'react';
import { Hands } from '@mediapipe/hands';
import * as tf from '@tensorflow/tfjs';

const HandTrackingGame = () => {
  const [score, setScore] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const runHandTracking = async () => {
      await tf.ready();
      const hands = new Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      hands.onResults((results) => {
        if (results.multiHandLandmarks) {
          // Use hand landmarks to detect gestures and move the bird
          console.log(results.multiHandLandmarks[0]); // Hand landmarks
          setScore((prevScore) => prevScore + 1); // Example: Increment score based on hand movement
        }
      });

      const videoElement = videoRef.current;
      const camera = new Camera(videoElement, {
        onFrame: async () => {
          await hands.send({ image: videoElement });
        },
        width: 640,
        height: 480,
      });

      camera.start();
    };

    runHandTracking();
  }, []);

  return (
    <div>
      <video ref={videoRef} width="640" height="480" autoPlay></video>
      <canvas ref={canvasRef} width="640" height="480"></canvas>
      <div>Score: {score}</div>
    </div>
  );
};

export default HandTrackingGame;
