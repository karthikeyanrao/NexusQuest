import { useEffect, useRef } from 'react';
import { Bird } from './Bird';
import { Pipe } from './Pipe';
import { gameConfig } from '../../lib/game';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { scoreAtom } from '@/store/atoms/game';

interface CanvasProps {
  isPlaying: boolean;
  onGameOver: (score: number) => void;
}

export function Canvas({ isPlaying, onGameOver }: CanvasProps) {
  const [score, setScore] = useRecoilState(scoreAtom);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<{
    bird: Bird;
    pipes: Pipe[];
    score: number;
    animationFrame: number;
  }>({
    bird: new Bird(),
    pipes: [],
    score: 0,
    animationFrame: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = gameConfig.width;
    canvas.height = gameConfig.height;

    const game = gameRef.current;
    game.bird = new Bird();
    game.pipes = [];
    game.score = 0;

    let lastPipeSpawn = 0;

    const gameLoop = (timestamp: number) => {
      if (!isPlaying) return;

      // Clear canvas
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Spawn pipes
      if (timestamp - lastPipeSpawn > gameConfig.pipeSpawnInterval) {
        game.pipes.push(new Pipe());
        lastPipeSpawn = timestamp;
      }

      // Update and draw pipes
      game.pipes = game.pipes.filter(pipe => {
        pipe.update();
        pipe.draw(ctx);

        // Score point if bird passes pipe
        if (!pipe.passed && pipe.x + pipe.width < game.bird.x) {
          pipe.passed = true;
          game.score++;
          setScore(game.score);
        }

        return pipe.x + pipe.width > 0;
      });

      // Update and draw bird
      game.bird.update();
      game.bird.draw(ctx);

      // Check collisions
      const collision = game.pipes.some(pipe => pipe.checkCollision(game.bird));
      if (collision || game.bird.y > canvas.height || game.bird.y < 0) {
        onGameOver(game.score);
        setScore(0);
        return;
      }

      game.animationFrame = requestAnimationFrame(gameLoop);
    };

    if (isPlaying) {
      game.animationFrame = requestAnimationFrame(gameLoop);
    }

    return () => {
      cancelAnimationFrame(game.animationFrame);
    };
  }, [isPlaying, onGameOver]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-lg shadow-lg"
      style={{ aspectRatio: `${gameConfig.width}/${gameConfig.height}` }}
    />
  );
}
