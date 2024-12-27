import React, { useState, useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { scoreAtom } from './Game/game';

const gameConfig = {
  width: 800,
  height: 600,
  gravity: 0.5,
  flapStrength: 8,
  pipeSpawnInterval: 2000, // milliseconds
};

export const calculateScore = (distance) => {
  return Math.floor(distance / 100);
};

// Bird component
const Bird = () => {
  const [bird, setBird] = useState({
    x: gameConfig.width * 0.2,
    y: gameConfig.height / 2,
    velocity: 0,
    radius: 15,
    color: '#ff4d4d',
    targetY: gameConfig.height / 2,
  });

  // Handler for the custom 'handMove' event
  const handleHandMove = (e) => {
    setBird((prevBird) => ({
      ...prevBird,
      targetY: e.detail.y,
    }));
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleMove = (e) => {
        const customEvent = e;
        handleHandMove(customEvent);
      };

      window.addEventListener('handMove', handleMove);

      return () => {
        window.removeEventListener('handMove', handleMove);
      };
    }
  }, []);

  const update = () => {
    const diff = bird.targetY - bird.y;
    const velocity = diff * 0.15;
    const newY = Math.max(0, Math.min(gameConfig.height, bird.y + velocity));
    setBird({ ...bird, y: newY });
  };

  const flap = () => {
    setBird({ ...bird, velocity: -gameConfig.flapStrength });
  };

  const draw = (ctx) => {
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fillStyle = bird.color;
    ctx.fill();
    ctx.closePath();
  };

  return { bird, update, flap, draw };
};

// Pipe component
const Pipe = () => {
  const [pipe, setPipe] = useState({
    x: gameConfig.width,
    gapY: Math.random() * (gameConfig.height - 150) + 50,
    width: 60,
    gapHeight: 150,
    speed: 3,
    passed: false,
    color: '#4CAF50',
  });

  const update = () => {
    setPipe((prevPipe) => ({ ...prevPipe, x: prevPipe.x - prevPipe.speed }));
  };

  const draw = (ctx) => {
    ctx.fillStyle = pipe.color;
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.gapY);
    ctx.fillRect(pipe.x, pipe.gapY + pipe.gapHeight, pipe.width, gameConfig.height - (pipe.gapY + pipe.gapHeight));
  };

  const checkCollision = (bird) => {
    const birdRight = bird.x + bird.radius;
    const birdLeft = bird.x - bird.radius;
    const birdTop = bird.y - bird.radius;
    const birdBottom = bird.y + bird.radius;

    return birdRight > pipe.x && birdLeft < pipe.x + pipe.width &&
           (birdTop < pipe.gapY || birdBottom > pipe.gapY + pipe.gapHeight);
  };

  return { pipe, update, draw, checkCollision };
};

// Canvas component
const Canvas = ({ isPlaying, onGameOver }) => {
  const [score, setScore] = useRecoilState(scoreAtom);
  const canvasRef = useRef(null);
  const gameRef = useRef({
    bird: Bird(),
    pipes: [Pipe()],
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
    game.bird = Bird();
    game.pipes = [Pipe()];
    let lastPipeSpawn = 0;

    const gameLoop = (timestamp) => {
      if (!isPlaying) return;

      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (timestamp - lastPipeSpawn > gameConfig.pipeSpawnInterval) {
        game.pipes.push(Pipe());
        lastPipeSpawn = timestamp;
      }

      game.pipes = game.pipes.filter((pipe) => {
        pipe.update();
        pipe.draw(ctx);

        if (!pipe.passed && pipe.x + pipe.width < game.bird.bird.x) {
          pipe.passed = true;
          setScore((prevScore) => prevScore + 1);
        }

        return pipe.x + pipe.width > 0;
      });

      game.bird.update();
      game.bird.draw(ctx);

      const collision = game.pipes.some((pipe) => pipe.checkCollision(game.bird.bird));
      if (collision || game.bird.bird.y > canvas.height || game.bird.bird.y < 0) {
        onGameOver(score);
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
  }, [isPlaying, onGameOver, score, setScore]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-lg shadow-lg"
      style={{ aspectRatio: `${gameConfig.width}/${gameConfig.height}` }}
    />
  );
};

// Score component
const Score = ({ high }) => {
  return (
    <div className="text-white text-2xl font-semibold">
      High Score: {high}
    </div>
  );
};

// HandTracking component
const HandTracking = () => {
  return <div className="hand-tracking">Hand Tracking Component</div>;
};

// Play1 Component (Main Game)
export function Play1() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useRecoilState(scoreAtom);
  const [highScore, setHighScore] = useState(() => {
    return Number(localStorage.getItem('highScore')) || 0;
  });

  const handleStartGame = () => {
    setScore(0);
    setIsPlaying(true);
  };

  const handleGameOver = (currentScore) => {
    if (currentScore > highScore) {
      setHighScore(currentScore);
      localStorage.setItem('highScore', String(currentScore));
    }
    setIsPlaying(false);
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-800 via-gray-900 to-black">
      <div className="absolute top-4 left-4">
        <Score high={highScore} />
      </div>

      <div className="flex flex-col items-center justify-center space-y-4">
        <HandTracking />
        <Canvas isPlaying={isPlaying} onGameOver={handleGameOver} />
        {!isPlaying && (
          <button
            onClick={handleStartGame}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform"
            aria-label="Start the game"
          >
            Start Game
          </button>
        )}
      </div>
    </div>
  );
}
