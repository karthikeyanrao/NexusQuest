import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { walletAddressAtom } from "../lib/state";
import { motion } from 'framer-motion';
import { FaTrophy, FaGamepad, FaClock, FaUsers, FaCoins, FaRegClock } from 'react-icons/fa';
import detectEthereumProvider from '@metamask/detect-provider';


const GamePage = () => {
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useAtom(walletAddressAtom);
  const [nextGameTime, setNextGameTime] = useState(180); // 3 minutes in seconds
  const [currentEvents, setCurrentEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [futureEvents, setFutureEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMode, setSelectedMode] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const connectWallet = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        // Check if MetaMask is installed
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]); // Update the wallet address atom
        console.log("Connected account:", accounts[0]);
      } else {
        console.error("MetaMask not detected");
      }
    };
    connectWallet();
  }, [setWalletAddress]);

  // Generate mock events data
  useEffect(() => {
    const generateEvents = () => {
      const now = new Date();
      const past = [];
      const current = [];
      const future = [];

      // Generate past events
      for (let i = 1; i <= 3; i++) {
        const startTime = new Date(now.getTime() - i * 5 * 60 * 1000);
        past.push({
          id: `past-${i}`,
          startTime,
          players: Math.floor(Math.random() * 50) + 20,
          prizePool: Math.floor(Math.random() * 1000) + 500,
          winner: `Player${Math.floor(Math.random() * 100)}`,
          highScore: Math.floor(Math.random() * 200) + 100,
        });
      }

      // Generate current event
      current.push({
        id: 'current-1',
        startTime: now,
        players: Math.floor(Math.random() * 50) + 20,
        prizePool: Math.floor(Math.random() * 1000) + 500,
        timeRemaining: Math.floor(Math.random() * 300),
      });

      // Generate future events
      for (let i = 1; i <= 3; i++) {
        const startTime = new Date(now.getTime() + i * 5 * 60 * 1000);
        future.push({
          id: `future-${i}`,
          startTime,
          players: Math.floor(Math.random() * 50) + 20,
          prizePool: Math.floor(Math.random() * 1000) + 500,
          registeredPlayers: Math.floor(Math.random() * 30),
        });
      }

      setPastEvents(past);
      setCurrentEvents(current);
      setFutureEvents(future);
    };

    generateEvents();
  }, []);

  // Countdown timer for next game
  useEffect(() => {
    const timer = setInterval(() => {
      setNextGameTime((prev) => {
        if (prev <= 0) {
          return 180; // Reset to 3 minutes
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handlePayment = async (amount) => {
    if (!walletAddress) {
      alert("Please connect your MetaMask wallet.");
      return;
    }
    setProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setProcessing(false);
    setShowModal(false);

    // Placeholder for actual transaction handling
    try {
      console.log("Processing payment:", amount, "from wallet:", walletAddress);
      window.location.href='./play';
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  const handleGameEnter = (event) => {
    setSelectedMode('Tournament');
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-gray-900 to-black text-white p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Next Game Countdown */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 backdrop-blur-sm rounded-2xl p-8 mb-8 text-center border border-indigo-500/20 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 animate-pulse"></div>
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-700"></div>
          <FaGamepad className="mx-auto text-6xl mb-4 text-indigo-400 animate-bounce" />
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Next Game Starts In</h2>
          <div className="text-7xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4 font-mono relative">
            <span className="animate-pulse text-white">{formatTime(nextGameTime)}</span>
          </div>
          <p className="text-indigo-300 flex items-center justify-center gap-2">
            <FaRegClock className="animate-spin-slow" />
            Games start every 3 minutes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Past Events */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-red-800/50 via-red-900/50 to-red-950/50 backdrop-blur-sm rounded-2xl p-6 border-2 border-red-500/30 shadow-[0_0_15px_rgba(220,38,38,0.3)] relative overflow-hidden group hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] transition-all duration-500"
          >
            <div className="absolute inset-0 bg-red-500/10 group-hover:bg-red-500/20 transition-colors duration-500"></div>
            <div className="absolute -right-16 -top-16 w-32 h-32 bg-red-500/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-red-500/20 rounded-full blur-2xl animate-pulse delay-700"></div>
            <FaTrophy className="absolute top-4 right-4 text-3xl text-red-400/50 group-hover:text-red-400 transition-colors duration-500" />
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Past Events</h3>
            <div className="space-y-4">
              {pastEvents.map(event => (
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  key={event.id} 
                  className="bg-gradient-to-r from-red-900/40 to-red-800/40 rounded-xl p-4 border border-red-500/30 hover:border-red-400/50 transition-all duration-300 relative overflow-hidden group shadow-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div className="flex justify-between mb-2">
                    <span className="text-red-300 flex items-center gap-2"><FaClock className="text-red-400" /> Time</span>
                    <span className="text-red-200">{formatDateTime(event.startTime)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-red-300 flex items-center gap-2"><FaTrophy className="text-yellow-400" /> Winner</span>
                    <span className="text-emerald-400 font-semibold">{event.winner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-300 flex items-center gap-2"><FaGamepad className="text-purple-400" /> High Score</span>
                    <span className="text-amber-400 font-semibold">{event.highScore}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Current Event */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-indigo-800/50 via-indigo-900/50 to-indigo-950/50 backdrop-blur-sm rounded-2xl p-6 border-2 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)] relative overflow-hidden group hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all duration-500"
          >
            <div className="absolute inset-0 bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors duration-500"></div>
            <div className="absolute -right-16 -top-16 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl animate-pulse delay-700"></div>
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">Live Now</h3>
            {currentEvents.map(event => (
              <motion.div 
                whileHover={{ scale: 1.02   }}
                key={event.id} 
                className="bg-gradient-to-r from-indigo-900/40 to-indigo-800/40 rounded-xl p-6 border-2 border-indigo-500/30 shadow-lg backdrop-blur-sm relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="flex justify-between mb-3">
                  <span className="text-indigo-300 flex items-center gap-2"><FaClock /> Started</span>
                  <span className="text-white font-semibold">{formatDateTime(event.startTime)}</span>
                </div>
                <div className="flex justify-between mb-3">
                  <span className="text-indigo-300 flex items-center gap-2"><FaUsers /> Players</span>
                  <span className="text-amber-400 font-bold text-lg">{event.players}</span>
                </div>
                <div className="flex justify-between mb-6">
                  <span className="text-indigo-300 flex items-center gap-2"><FaCoins /> Prize Pool</span>
                  <span className="text-emerald-400 font-bold text-lg">${event.prizePool}</span>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02, cursor: 'not-allowed' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-indigo-600/20 text-indigo-300 py-3 rounded-xl border border-indigo-500/30 backdrop-blur-sm font-semibold relative overflow-hidden group hover:bg-indigo-600/30 transition-colors duration-300"
                >
                  <div className="absolute inset-0 bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors duration-500"></div>
                  In Progress
                </motion.button>
              </motion.div>
            ))}
          </motion.div>

          {/* Future Events */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-emerald-800/50 via-emerald-900/50 to-emerald-950/50 backdrop-blur-sm rounded-2xl p-6 border-2 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)] relative overflow-hidden group hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all duration-500"
          >
            <div className="absolute inset-0 bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors duration-500"></div>
            <div className="absolute -right-16 -top-16 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl animate-pulse delay-700"></div>
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">Upcoming Events</h3>
            <div className="space-y-4">
              {futureEvents.map(event => (
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  key={event.id} 
                  className="bg-gradient-to-r from-emerald-900/40 to-emerald-800/40 rounded-xl p-6 border border-emerald-500/30 backdrop-blur-sm relative overflow-hidden group shadow-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div className="flex justify-between mb-3">
                    <span className="text-emerald-300 flex items-center gap-2"><FaClock /> Starts At</span>
                    <span className="text-white font-semibold">{formatDateTime(event.startTime)}</span>
                  </div>
                  <div className="flex justify-between mb-3">
                    <span className="text-emerald-300 flex items-center gap-2"><FaUsers /> Registered</span>
                    <span className="text-amber-400 font-bold">{event.registeredPlayers}/50</span>
                  </div>
                  <div className="flex justify-between mb-6">
                    <span className="text-emerald-300 flex items-center gap-2"><FaCoins /> Prize Pool</span>
                    <span className="text-emerald-400 font-bold text-lg">${event.prizePool}</span>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleGameEnter()}
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-white/10 translate-y-[100%] group-hover:translate-y-[-100%] transition-transform duration-500"></div>
                    Enter Now
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white/90 backdrop-blur rounded-2xl p-8 max-w-md w-full mx-4 transform transition-all shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Entry Fee for {selectedMode} Mode</h2>
            <div className="grid grid-cols-2 gap-4">
              {[10, 20, 50, 100].map((amount) => (
                <motion.button
                  key={amount}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePayment(amount)}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  ${amount}
                </motion.button>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(false)}
              className="mt-6 w-full py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {/* Processing Modal */}
      {processing && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-800">Processing Payment...</h3>
            <p className="text-gray-600 mt-2">Please wait while we confirm your transaction</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default GamePage;
