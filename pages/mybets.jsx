    import React from 'react';
    import { atom, useAtom } from 'jotai';
    import { syncedWalletAddressAtom } from '../lib/state';
    import CardSlider from "../components/Card/CardSlider";
    
    // Helper functions
    const getRandomDate = () => {
      const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0'); // Random month (01-12)
      const day = String(Math.floor(Math.random() * 5) + 1).padStart(2, '0'); // Random day (1-5)
      return `2024-${month}-${day}`; // Return formatted date
    };
    const randomBetAmounts = [10, 20, 50, 100]; // Possible bet amounts
      const getRandomBetAmount = () => randomBetAmounts[Math.floor(Math.random() * randomBetAmounts.length)];
      
    const randomLossAddress = () => "0x" + Math.random().toString(16).substring(2, 42).padStart(40, '0'); // Generate random address
    
    const BetsHistory = () => {
      const betsData = [
        { 
          tournamentId: "T-2024-001",
          matchId: "M-468",
          stake: 190,
          rank: 3,
          score: 57,
          highestScore: 62,
          profit: 150,
          status: "won"
        },
        {
          tournamentId: "T-2024-002", 
          matchId: "M-461",
          stake: 300,
          rank: 5,
          score: 76,
          highestScore: 95,
          profit: - getRandomBetAmount(),
          status: "lost"
        },
        {
          tournamentId: "T-2024-016",
          matchId: "M-459", 
          stake: 250,
          rank: 1,
          score: 98,
          highestScore: 98,
          profit: 250,
          status: "won"
        },
        {
          tournamentId: "T-2024-020",
          matchId: "M-455", 
          stake: 250,
          rank: 2,
          score: 96,
          highestScore: 98,
          profit: 225,
          status: "won"
        },
        {
          tournamentId: "T-2024-023",
          matchId: "M-449", 
          stake: 400,
          rank: 4,
          score: 82,
          highestScore: 90,
          profit: 270,
          status: "won"
        },
        {
          tournamentId: "T-2024-032",
          matchId: "M-427", 
          stake: 170,
          rank: 2,
          score: 97,
          highestScore: 98,
          profit: 140,
          status: "won"
        },
        {
          tournamentId: "T-2024-082", 
          matchId: "M-401",
          stake: 30,
          rank: 5,
          score: 75,
          highestScore: 95,
          profit: -getRandomBetAmount(),
          status: "lost"
        },
      ];
      const [walletAddress] = useAtom(syncedWalletAddressAtom);
      
      // Attach additional fields to the betsData dynamically
      const enhancedBetsData = betsData.map((bet) => ({
        ...bet,
        date: getRandomDate(), // Assign random date
        wallet: bet.status === "won" ?walletAddress : randomLossAddress(), // Wallet based on status
      }));
    
      return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
          <CardSlider />
          <h1 className="text-4xl font-bold text-white mb-8 text-left">Your Bets</h1>
    
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enhancedBetsData.map((bet, index) => (
              <div
                key={index}
                className={`
                  group rounded-lg p-6 shadow-xl transition-all duration-300 
                  transform hover:scale-105 hover:h-auto
                  ${bet.status === "won"
                    ? "bg-gradient-to-br from-green-900/40 to-green-600/40 border-2 border-green-500/50"
                    : "bg-gradient-to-br from-red-900/40 to-red-600/40 border-2 border-red-500/50"}
                `}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-300">Tournament ID</span>
                  <span className="text-white font-mono">{bet.tournamentId}</span>
                </div>
    
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-300">Match ID</span>
                  <span className="text-white font-mono">{bet.matchId}</span>
                </div>
    
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-300">Stake</span>
                  <span className="text-white font-bold">${bet.stake}</span>
                </div>
    
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-300">Your Rank</span>
                  <span className="text-2xl font-bold text-yellow-400">#{bet.rank}</span>
                </div>
    
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-300">Your Score</span>
                  <div className="flex items-center">
                    <span className="text-white font-bold">{bet.score}</span>
                    <span className="text-gray-400 text-sm ml-2">/ {bet.highestScore}</span>
                  </div>
                </div>
    
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-600">
                  <span className="text-gray-300">Profit/Loss</span>
                  <span className={`text-xl font-bold ${bet.profit > 0 ? "text-green-400" : "text-red-400"}`}>
                    {bet.profit > 0 ? "+" : ""}{bet.profit}$
                  </span>
                </div>
    
                <div
                  className={`mt-4 text-center py-2 rounded-full font-bold
                  ${bet.status === "won" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                >
                  {bet.status.toUpperCase()}
                </div>
    
                {/* Additional hover data */}
                <div className="hidden group-hover:block mt-6 text-sm text-gray-300 space-y-2">
                  <div className="flex justify-between">
                    <span>Date Sent:</span>
                    <span className="font-mono text-white">{bet.date}</span>
                  </div>
                  <div className="flex justify-between">
                <span>My Bet Amount:</span>
                <span className="font-bold text-white">${getRandomBetAmount()}</span>
              </div>
              <div className="flex justify-between">
                    <span>Winner Amount:</span>
                       <span className={`font-bold ${bet.status === "won" ? "text-green-400" : "text-red-400"}`}>
                         ${bet.status === "won" ? bet.profit : bet.stake}
                        </span>
              </div>
                   <div className="flex justify-between">
                    <span>Wallet Address:</span>
                    <span className="font-mono text-white">{bet.wallet}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };
    
    export default BetsHistory;
    