// src/Play1.tsx

import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { scoreAtom } from './game';
import { Canvas } from './Canvas';
import { HandTracking } from './HandTracking';
import { Score } from './Score';

export function Play1() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useRecoilState(scoreAtom);
  const [highScore, setHighScore] = useState(() => {
    return Number(localStorage.getItem('highScore')) || 0; // Load high score from localStorage
  });

  // Start or restart the game
  const handleStartGame = () => {
    setScore(0); // Reset the score
    setIsPlaying(true); // Start the game
  };

  // Handle game over and update the high score
  const handleGameOver = (currentScore: number) => {
    if (currentScore > highScore) {
      setHighScore(currentScore); // Update high score if new high
      localStorage.setItem('highScore', String(currentScore)); // Save to localStorage
    }
    setIsPlaying(false); // Stop the game
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-800 via-gray-900 to-black">
      <div className="absolute top-4 left-4">
        <Score high={highScore} />
      </div>

      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Hand Tracking Component */}
        <HandTracking />

        {/* Game Canvas */}
        <Canvas isPlaying={isPlaying} onGameOver={handleGameOver} />

        {/* Start Game Button */}
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
