import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";
import Web3 from 'web3';
import { InjectedConnector } from "@web3-react/injected-connector";
import { ethers } from "ethers"; // Import ethers.js
import Image from "next/image";
import { Web3ReactProvider } from "@web3-react/core";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";

// Define the injected connector (MetaMask)
const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42], // Ethereum mainnet and testnets
});

const Navbar = () => {
  const { activate, deactivate, account, active, library } = useWeb3React();
  const router = useRouter();
  const [balance, setBalance] = useState(null); // State for balance
  const [error, setError] = useState("");
  console.log("Library:", library);
  console.log("Library Provider:", library?.provider);
  
  // MetaMask installation check
  useEffect(() => {
    if (typeof window !== "undefined" && !window.ethereum) {
      alert("MetaMask is not installed. Please install it.");
    }
  }, []);

  // Fetch wallet balance when account changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (active && account) {
        try {
          // Initialize Web3 with MetaMask's provider
          const web3 = new Web3(window.ethereum);
          
          // Fetch balance
          const rawBalance = await web3.eth.getBalance(account);

          // Convert balance to Ether
          const formattedBalance = web3.utils.fromWei(rawBalance, "ether");
          setBalance(formattedBalance);
        } catch (err) {
          console.error("Failed to fetch balance:", err);
        }
      }
    };

    fetchBalance();
  }, [active, account]);
  

  const connectWallet = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        await activate(injected);
        setError(""); // Clear any previous errors
      } catch (error) {
        console.error("Connection failed:", error);
        setError("Failed to connect wallet.");
      }
    } else {
      alert("MetaMask is not installed. Please install it.");
    }
  };

  const disconnectWallet = () => {
    deactivate();
    setBalance(null); // Clear balance on disconnect
  };

  return (
    <div className="p-4 flex justify-between items-center bg-black text-white h-24">
      {/* Logo Section */}
      <Link href="/home">
        <div className="flex items-center cursor-pointer">
          <Image
            src="/images/logo-betting.png"
            height={85}
            width={220}
            alt="Logo"
            className="object-contain"
          />
        </div>
      </Link>

      {/* Navigation Links */}
      <div className="flex space-x-12">
        <div
          className="cursor-pointer text-lg font-semibold hover:text-[#F3BA2F] transition-colors"
          onClick={() => router.push("/home")}
        >
          Explore
        </div>
        <div
          className="cursor-pointer text-lg font-semibold hover:text-[#F3BA2F] transition-colors"
          onClick={() => router.push("/mybets")}
        >
          MyBets
        </div>
        <div
          className="cursor-pointer text-lg font-semibold hover:text-[#F3BA2F] transition-colors"
          onClick={() => router.push("/leaderboard")}
        >
          Leaderboard
        </div>
        <div
          className="cursor-pointer text-lg font-semibold hover:text-[#F3BA2F] transition-colors flex items-center"
          onClick={() => router.push("/profile")}
        >
          <CgProfile size={28} className="mr-2" />
          Profile
        </div>
      </div>

      {/* Wallet Connection Section */}
      <div>
        {!active ? (
          <button
            className="px-6 py-3 bg-[#F3BA2F] text-black font-bold rounded-full hover:scale-105 transition-transform"
            onClick={connectWallet}
          >
            Connect MetaMask
          </button>
        ) : (
          <div className="flex items-center">
            <p className="mr-4 font-semibold text-sm">
              Connected: {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
            </p>
            {balance && (
              <p className="mr-4 font-semibold text-sm">Balance: {balance} ETH</p>
              
            )}
            <button
              onClick={disconnectWallet}
              className="px-6 py-3 bg-red-500 text-white font-bold rounded-full hover:scale-105 transition-transform"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
};

export default Navbar;
