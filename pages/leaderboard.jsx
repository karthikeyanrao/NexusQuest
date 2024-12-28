import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CardSlider from "../components/Card/CardSlider";
import { FaTrophy, FaUsers, FaCoins, FaMedal, FaGamepad, FaChartLine } from 'react-icons/fa';

export default function Leaderboard() {
  const [yourScore, setYourScore] = useState(0); // Initialize score state
    const [leaderboardData, setLeaderboardData] = useState({
    matchId: '#127',
    totalParticipants: 15,
    prizePool: '5 ETH',
    yourScore: 0, // Initialize to 0 for dynamic updates
    yourRank: 0,  // Initialize to 0 for dynamic updates
    topPlayers: [
      { rank: 1, username: 'Karthikeyan', score: 20, prize: '10 ETH' },
      { rank: 2, username: 'Padmaja', score: 3, prize: '7 ETH' },
      { rank: 3, username: 'Harsha', score: 2, prize: '5 ETH' },
      { rank: 4, username: 'Rakshika', score: 1, prize: '2 ETH' },
      
    ],
  });
  
  useEffect(() => {
    // Fetch the score from localStorage in the leaderboard page
    const storedScore = localStorage.getItem('score');
    if (storedScore) {
      console.log('Updated score from localStorage:', storedScore);
      setYourScore(parseInt(storedScore, 10));  // Update score state
    } else {
      console.log('No score found in localStorage.');
    }
  }, []);

  useEffect(() => {
    // Fetch the score from localStorage
    const storedScore = localStorage.getItem('score');
    if (storedScore) {
      const newScore = parseInt(storedScore, 10) || 0;

      setLeaderboardData((prevData) => {
        const updatedTopPlayers = [...prevData.topPlayers];

        // Find 'You' in the leaderboard
        const playerIndex = updatedTopPlayers.findIndex(player => player.username === 'Karthikeyan');

        if (playerIndex !== -1) {
          // Update 'You' score
          updatedTopPlayers[playerIndex].score += newScore;
        } else {
          // Add 'You' to the leaderboard if not present
          updatedTopPlayers.push({
            rank: 0, // Recalculated later
            username: 'Karthikeyan',
            score: newScore,
            prize: '5 ETH',
          });
        }

        // Remove duplicates (if any) and sort by score
        const uniquePlayers = updatedTopPlayers.filter(
          (player, index, self) =>
            index === self.findIndex((p) => p.username === player.username)
        );

        uniquePlayers.sort((a, b) => b.score - a.score);

        // Recalculate ranks
        const recalculatedPlayers = uniquePlayers.map((player, index) => ({
          ...player,
          rank: index + 1,
        }));

        return {
          ...prevData,
          yourScore: recalculatedPlayers.find(player => player.username === 'Karthikeyan')?.score || 0,
          yourRank: recalculatedPlayers.findIndex(player => player.username === 'Karthikeyan') + 1,
          topPlayers: recalculatedPlayers.slice(0, 8),
        };
      });
    } else {
      console.log('No score found in localStorage.');
    }
  }, []);
  
  
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-gray-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Card Slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardSlider />
        </motion.div>

        {/* Match Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-2xl p-6 backdrop-blur-sm border border-purple-500/20">
            <div className="flex items-center gap-3 mb-2">
              <FaGamepad className="text-2xl text-purple-400" />
              <h3 className="text-lg font-semibold">Match ID</h3>
            </div>
            <p className="text-3xl font-bold text-purple-300">{leaderboardData.matchId}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 rounded-2xl p-6 backdrop-blur-sm border border-blue-500/20">
            <div className="flex items-center gap-3 mb-2">
              <FaUsers className="text-2xl text-blue-400" />
              <h3 className="text-lg font-semibold">Participants</h3>
            </div>
            <p className="text-3xl font-bold text-blue-300">{leaderboardData.totalParticipants}</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-900/50 to-green-900/50 rounded-2xl p-6 backdrop-blur-sm border border-emerald-500/20">
            <div className="flex items-center gap-3 mb-2">
              <FaCoins className="text-2xl text-emerald-400" />
              <h3 className="text-lg font-semibold">Prize Pool</h3>
            </div>
            <p className="text-3xl font-bold text-emerald-300">{leaderboardData.prizePool}</p>
          </div>

          <div className="bg-gradient-to-br from-amber-900/50 to-yellow-900/50 rounded-2xl p-6 backdrop-blur-sm border border-amber-500/20">
            <div className="flex items-center gap-3 mb-2">
              <FaChartLine className="text-2xl text-amber-400" />
              <h3 className="text-lg font-semibold">Your Score</h3>
            </div>
            <p className="text-3xl font-bold text-amber-300">{leaderboardData.yourScore}</p>
          </div>
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-br from-gray-900/50 to-slate-900/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-500/20"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <FaTrophy className="text-yellow-500" />
            Leaderboard
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-6 py-4 text-left">Rank</th>
                  <th className="px-6 py-4 text-left">Player</th>
                  <th className="px-6 py-4 text-right">Score</th>
                  <th className="px-6 py-4 text-right">Prize</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.topPlayers.map((player) => (
                  <motion.tr
                    key={player.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: player.rank * 0.1 }}
                    className={`border-b border-gray-800 ${player.username === 'You' ? 'bg-purple-500/10' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {player.rank === 1 && <FaMedal className="text-yellow-500" />}
                        {player.rank === 2 && <FaMedal className="text-gray-400" />}
                        {player.rank === 3 && <FaMedal className="text-amber-600" />}
                        {player.rank}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{player.username}</td>
                    <td className="px-6 py-4 text-right">{player.score}</td>
                    <td className="px-6 py-4 text-right text-emerald-400">{player.prize}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
