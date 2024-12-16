import { useEffect, useRef } from 'react';
import { Bird } from './Bird';
import { Pipe } from './Pipe';
import { gameConfig } from './gameConfig';
import { useRecoilState } from 'recoil';
import { scoreAtom } from './game';
import React from 'react';

interface CanvasProps {
  isPlaying: boolean;
  onGameOver: (score: number) => void;
}

export function Canvas({ isPlaying, onGameOver }: CanvasProps) {
  const [score, setScore] = useRecoilState(scoreAtom); // Get and set score from Recoil
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<{
    bird: Bird;
    pipes: Pipe[];
    animationFrame: number;
  }>( {
    bird: new Bird(),
    pipes: [],
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

        // Update score if bird passes pipe
        if (!pipe.passed && pipe.x + pipe.width < game.bird.x) {
          pipe.passed = true;
          setScore(prevScore => prevScore + 1); // Increment the score using Recoil state
        }

        return pipe.x + pipe.width > 0;
      });

      // Update and draw bird
      game.bird.update();
      game.bird.draw(ctx);

      // Check for collisions
      const collision = game.pipes.some(pipe => pipe.checkCollision(game.bird));
      if (collision || game.bird.y > canvas.height || game.bird.y < 0) {
        // Make sure to pass the current score at the moment of game over
        onGameOver(score);
        setScore(0); // Reset the score
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
  }, [isPlaying, onGameOver, score, setScore]); // Ensure dependencies are accurate

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-lg shadow-lg"
      style={{ aspectRatio: `${gameConfig.width}/${gameConfig.height}` }}
    />
  );
}
