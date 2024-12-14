import { useState, useEffect } from 'react';
import socket from '../lib/socket'; // Ensure socket is connected to the correct server

const GamePage = () => {
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [playerId, setPlayerId] = useState(null); // To store player ID dynamically

  useEffect(() => {
    // Assuming player ID is stored somewhere, for example in localStorage
    const storedPlayerId = localStorage.getItem('playerId');
    if (storedPlayerId) {
      setPlayerId(storedPlayerId);
    }

    // Listen for leaderboard updates from the server
    socket.on('update-leaderboard', (updatedLeaderboard) => {
      setLeaderboard(updatedLeaderboard);
    });

    // Clean up the socket listener when the component unmounts
    return () => {
      socket.off('update-leaderboard');
    };
  }, []);

  const handleEnterGame = () => {
    // Redirect to Flappy Bird game
    window.location.href = 'https://flappybird.io/';
  };

  const handleGameEnd = () => {
    if (playerId) {
      // Submit score to the server
      socket.emit('submit-score', { playerId, score });
    }
  };

  return (
    <div>
      <div>Score: {score}</div>
      <div>
        <h3>Leaderboard:</h3>
        <ul>
          {leaderboard.map((player, idx) => (
            <li key={idx}>
              <strong>{player.name}:</strong> {player.score}
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleEnterGame}>Enter Game</button>
      <button onClick={handleGameEnd}>End Game</button>
    </div>
  );
};

export default GamePage;
