import React from 'react';
import { atom, useAtom } from 'jotai'
import {walletAddressAtom} from '../lib/state';
import CardSlider from "../components/Card/CardSlider";


const BetsHistory = () => {
  const betsData = [
    { 
      tournamentId: "T-2024-001",
      matchId: "M-458",
      stake: 50,
      rank: 3,
      score: 57,
      highestScore: 62,
      profit: 60,
      status: "won"
    },
    {
      tournamentId: "T-2024-002", 
      matchId: "M-461",
      stake: 30,
      rank: 15,
      score: 25,
      highestScore: 95,
      profit: -30,
      status: "lost"
    },
    {
      tournamentId: "T-2024-016",
      matchId: "M-459", 
      stake: 45,
      rank: 1,
      score: 98,
      highestScore: 98,
      profit: 250,
      status: "won"
    },
    {
      tournamentId: "T-2024-020",
      matchId: "M-459", 
      stake: 45,
      rank: 1,
      score: 98,
      highestScore: 98,
      profit: 225,
      status: "won"
    },
    {
      tournamentId: "T-2024-023",
      matchId: "M-459", 
      stake: 45,
      rank: 1,
      score: 90,
      highestScore: 90,
      profit: 270,
      status: "won"
    },
    {
      tournamentId: "T-2024-032",
      matchId: "M-459", 
      stake: 70,
      rank: 2,
      score: 97,
      highestScore: 98,
      profit: 200,
      status: "won"
    },
    {
      tournamentId: "T-2024-082", 
      matchId: "M-461",
      stake: 30,
      rank: 5,
      score: 75,
      highestScore: 95,
      profit: -30,
      status: "lost"
    },
  ];

  const [walletAddress] = useAtom(walletAddressAtom);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
      <CardSlider />
      <h1 className="text-4xl font-bold text-white mb-8 text-left">Your Bets</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {betsData.map((bet, index) => (
          <div key={index} className={`
            rounded-lg p-6 shadow-xl transform hover:scale-105 transition-all duration-300
            ${bet.status === 'won' ? 'bg-gradient-to-br from-green-900/40 to-green-600/40 border-2 border-green-500/50' : 
            'bg-gradient-to-br from-red-900/40 to-red-600/40 border-2 border-red-500/50'}
          `}>
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
              <span className={`text-xl font-bold ${bet.profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {bet.profit > 0 ? '+' : ''}{bet.profit}$
              </span>
            </div>

            <div className={`
              mt-4 text-center py-2 rounded-full font-bold
              ${bet.status === 'won' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
            `}>
              {bet.status.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BetsHistory;
