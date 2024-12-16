import { useEffect, useState } from 'react';
import socket from '../lib/socket';

const GamePage = () => {
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Listen for leaderboard updates from server
    socket.on('leaderboard-update', (data) => {
      setLeaderboard(data);
    });

    return () => {
      socket.off('leaderboard-update');
    };
  }, []);

  const handleGameEnd = () => {
    socket.emit('submit-score', { playerId: 1, score }); // Send the player's score to the server
  };

  return (
    <div>
      <div>Score: {score}</div>
      <div>
        <h3>Leaderboard:</h3>
        {leaderboard.map((player, idx) => (
          <div key={idx}>
            {player.name}: {player.score}
          </div>
        ))}
      </div>
      <button onClick={handleGameEnd}>End Game</button>
    </div>
  );
};

export default GamePage;