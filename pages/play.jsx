import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaGamepad, FaTrophy, FaCoins, FaUserAlt } from 'react-icons/fa';
import { useRouter } from 'next/router'; // Importing Next.js router for navigation

const PlayPage = () => {
  const [playerStats, setPlayerStats] = useState({
    score: 0,
    rank: 1,
    prize: 10,
  });

  const router = useRouter(); // Using router for navigation

  // Separate functions for each game
  const goToFlappy = () => {
    router.push('/floppy');
  };

  const goToXO = () => {
    router.push('/XO');
  };

  const goTo2048 = () => {
    router.push('/2048');
  };

  const goToDino = () => {
    router.push('/Dino');
  };

  useEffect(() => {
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(
      `
      @keyframes gradientBackground {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `,
      styleSheet.cssRules.length
    );
  }, []);

  return (
    <div style={styles.background}>
      <div className="flex flex-col items-center justify-start space-y-8 w-full h-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 5 }}
          className="text-center mb-8"
        >
          <FaGamepad className="mx-auto text-7xl mb-3 text-pink-500 animate-bounce" />
          <h2 className="text-5xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Play Game
          </h2>
          <p className="text-gray-300 text-lg mt-2">Ready to start? Get your game on!</p>
        </motion.div>

        {/* Main Content */}
        <div
          className="flex items-center justify-center w-11/12 h-full"
          style={{ gap: '6rem' }}
        >
          {/* Player Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-r from-gray-800 to-gray-900 backdrop-blur-md rounded-lg p-6 border border-gray-700 shadow-xl w-72"
          >
            <h3 className="text-2xl font-bold mb-6 text-pink-300">Player Stats</h3>
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400 flex items-center gap-2 text-lg">
                <FaUserAlt /> Rank
              </span>
              <span className="text-white font-bold text-2xl">{playerStats.rank}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400 flex items-center gap-2 text-lg">
                <FaCoins /> Prize 
              </span>
              <span className="text-yellow-400 font-bold text-2xl">{playerStats.prize}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 flex items-center gap-2 text-lg">
                <FaTrophy /> Score
              </span>
              <span className="text-green-400 font-bold text-2xl">{playerStats.score}</span>
            </div>
          </motion.div>

          {/* Game Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid grid-cols-2 gap-6"
          >
            {['Flappy', 'XO', '2048', 'Dino'].map((game, index) => (
              <div
                key={index}
                onClick={
                  game === 'flappy'
                    ? goToFlappy
                    : game === 'XO'
                    ? goToXO
                    : game === '2048'
                    ? goTo2048
                    : goToDino
                }
                className={`bg-gradient-to-r ${
                  index === 0
                    ? 'from-pink-500 to-purple-500'
                    : index === 1
                    ? 'from-blue-500 to-indigo-500'
                    : index === 2
                    ? 'from-green-500 to-teal-500'
                    : 'from-yellow-500 to-red-500'
                } text-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer`}
              >
                <img
                  src={`/images/game${index + 1}-logo.png`} // Updated image paths
                  alt={game}
                  className="w-16 h-16 mx-auto mb-8"
                />
                <p className="text-lg font-bold text-center">{game}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  background: {
    background: 'linear-gradient(135deg, #1e3a8a, #9333ea, #ec4899)',
    backgroundSize: '100% 200%',
    animation: 'gradientBackground 6s ease infinite',
    height: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default PlayPage;
