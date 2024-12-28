import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAtomValue } from 'jotai';
import { syncedWalletAddressAtom } from '../lib/state';
import { FaTrophy, FaMedal, FaStar } from 'react-icons/fa';

const Profile = () => {
    const router = useRouter();
    const walletAddress = useAtomValue(syncedWalletAddressAtom);
    const [ipfsData, setIpfsData] = useState(null);
    const [userProfile, setUserProfile] = useState({
        username: 'Karthikeyan',
        walletAddress: walletAddress || "0x...loading",
        avatar: <Image
            src="./images/logo-bet.png"  // Add the leading slash
            alt="Profile"
            width={120}
            height={120}
            className="rounded-full ring-4 ring-yellow-500 object-cover"
        />,
        stats: {
            TotalGames: 15,
            WinRate: "69%",
            TotalEarnings: "0 ETH",
            HighScore: "20"
        },
        recentActivity: [
            {
                
                type: "Game Played",
                event: "2048 #127",
                amount: "-1.1 ETH",
                date: "1d ago",
                matchDetails: {
                    matchId: "#126",
                    score: 186,
                    participants: 50,
                    poolSize: "3 ETH"
                }
            },
            {
                
                type: "Game Won",
                event: "Dino #127",
                amount: "+0.5 ETH",
                date: "2d ago",
                matchDetails: {
                    matchId: "#123",
                    score: 186,
                    participants: 50,
                    poolSize: "3 ETH"
                }
            },
            {
                type: "Game Played",
                event: "Flappy Bird #99",
                amount: "-0.1 ETH",
                date: "5d ago",
                matchDetails: {
                    matchId: "#126",
                    score: 142,
                    participants: 75,
                    poolSize: "7 ETH"
                }
            },
            {
                type: "Game Won",
                event: "2048 #98",
                amount: "+0.8 ETH",
                date: "1m ago",
                matchDetails: {
                    matchId: "#125",
                    score: 201,
                    participants: 100,
                    poolSize: "5 ETH"
                }
            },
            {
                type: "Game Played",
                event: "XO #84",
                amount: "-0.1 ETH",
                date: "2m ago",
                matchDetails: {
                    matchId: "#124",
                    score: 167,
                    participants: 60,
                    poolSize: "10 ETH"
                }
            }
        ]
    });

    const [tempProfile, setTempProfile] = useState(userProfile);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isMinting, setIsMinting] = useState(false);  // Track minting state
    const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Replace with your contract address
    const contractABI = [ /* Your contract ABI */ ];

    useEffect(() => {
        const fetchIPFSData = async () => {
            try {
                const response = await fetch('/nft1.json'); // Update path to your json file
                const data = await response.json();
                setIpfsData(data); // Store the fetched data
            } catch (error) {
                console.error('Error fetching IPFS data:', error);
            }
        };

        fetchIPFSData();
    }, []);

    useEffect(() => {
        if (walletAddress) {
            setUserProfile((prev) => ({ ...prev, walletAddress }));
        }
    }, [walletAddress]);

    const [badges, setBadges] = useState([
        { icon: <FaTrophy size={40} color="#ffd700" />, name: "Champion", ipfsLink: ipfsData?.Champion?.ipfsLink },
        { icon: <FaMedal size={40} color="#c0c0c0" />, name: "Runner-up", ipfsLink: ipfsData?.RunnerUp?.ipfsLink },
        { icon: <FaStar size={40} color="#ffcc00" />, name: "Top Player", ipfsLink: ipfsData?.TopPlayer?.ipfsLink },
    ]);

    const handleMint = async () => {
        try {
            setIsMinting(true); // Set minting state to true
            const contract = await connectEthereum();
            const tokenURI = "bafkreicek3u3hrmc5alnsnfqcqx6odyknpavehqwfqtysn6oqwh3gbw66u";
            const tx = await contract.createNFT(walletAddress, tokenURI);
            await tx.wait();
            setIsMinting(false); // Reset minting state
            alert('NFT minted successfully!');
        } catch (error) {
            setIsMinting(false); // Reset minting state on error
            console.error(error);
            alert('Error minting NFT');
        }
    };

    useEffect(() => {
        if (isSettingsOpen) {
            setTempProfile(userProfile); // Sync tempProfile with userProfile
        }
    }, [isSettingsOpen, userProfile]);

    const handleFileChange = (file) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setTempProfile({ ...tempProfile, avatar: reader.result });
            reader.readAsDataURL(file);
        }
    };

    const openIPFSLink = (link) => {
        window.open('https://gateway.pinata.cloud/ipfs/bafkreif4yk2p6yduwvzppown7jxgvbntgsi7gwih63jefru2wd3rnqgrai', '_blank');
    };

    return (
        <div className="bg-black text-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Profile Header */}
                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <div className="flex items-center space-x-6">
                        <Image
                            src={userProfile.avatar}
                            alt="Profile"
                            width={80}
                            height={120}
                            className="rounded-full ring-4 ring-yellow-500"
                        />
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold">{userProfile.username}</h1>
                            <p className="text-gray-400 mt-1">{userProfile.walletAddress}</p>
                            <div className="flex items-center mt-3">
                                <span className="bg-yellow-500 text-black text-sm font-semibold px-3 py-1 rounded-full">
                                    High Score: {userProfile.stats.HighScore}
                                </span>
                            </div>
                        </div>
                        {/* Badge Section */}
                        <div className="flex gap-4 mt-6">
                            {badges.map((badge, index) => (
                                <div key={index} className="relative group">
                                    <div
                                        className="bg-black-600 text-white px-4 py-2 rounded-lg cursor-pointer"
                                        onClick={() => openIPFSLink(badge.ipfsLink)} // Open IPFS link on click
                                    >
                                        {badge.icon}
                                        <p>{badge.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mb-0">
                            <button
                                className={`bg-green-500 px-6 py-2 rounded-lg ${isMinting ? 'bg-gray-500 cursor-not-allowed' : 'hover:bg-green-400'} transition`}
                                onClick={handleMint}
                                disabled={isMinting}
                            >
                                {isMinting ? 'Minting...' : 'Mint NFT'}
                            </button>
                        </div>
                        <div className="flex gap-4">
                            <button
                                className="bg-yellow-600 px-6 py-2 rounded-lg hover:bg-yellow-700 transition"
                                onClick={() => router.push('https://global-stg.transak.com/?apiKey=4aae77ea-df1a-4a88-9095-89625873c08e')}
                            >
                                Buy ETH
                            </button>
                            <button
                                className="bg-gray-700 px-6 py-2 rounded-lg hover:bg-gray-600 transition"
                                onClick={() => setIsSettingsOpen(true)}
                            >
                                Settings
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    {Object.entries(userProfile.stats).map(([key, value]) => (
                        <div key={key} className="bg-gray-800 p-6 rounded-lg">
                            <p className="text-gray-400 text-sm">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                            <p className="text-2xl font-bold mt-2">{value}</p>
                        </div>
                    ))}
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-6">Recent Games History</h2>
                    <div className="space-y-4">
                        {userProfile.recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-700">
                                <div>
                                    <p className="font-medium">{activity.type}</p>
                                    <p className="text-sm text-gray-400">{activity.event}</p>
                                    <div className="mt-1 text-xs text-gray-500">
                                        <p>Score: {activity.matchDetails.score} | Players: {activity.matchDetails.participants}</p>
                                        <p>Pool Size: {activity.matchDetails.poolSize}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`${activity.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'} font-semibold`}>
                                        {activity.amount}
                                    </p>
                                    <p className="text-sm text-gray-400">{activity.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Settings Modal */}
            {isSettingsOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 w-96">
                        <h2 className="text-xl font-semibold mb-4">Settings</h2>
                        <div className="space-y-4">
                            {/* Username Edit */}
                            <div>
                                <label className="block text-sm">Username:</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-700 px-4 py-2 rounded-lg"
                                    value={tempProfile.username}
                                    onChange={(e) =>
                                        setTempProfile({ ...tempProfile, username: e.target.value })
                                    }
                                />
                            </div>

                            {/* Profile Picture Edit */}
                            <div>
                                <label className="block text-sm">Profile Picture:</label>
                                <div
                                    className="w-full bg-gray-700 px-4 py-8 rounded-lg text-center border-2 border-dashed border-gray-500 cursor-pointer hover:border-gray-400"
                                    onClick={() => document.getElementById("fileInput").click()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        handleFileChange(e.dataTransfer.files[0]);
                                    }}
                                    onDragOver={(e) => e.preventDefault()}
                                >
                                    <p className="text-sm text-gray-400">
                                        {tempProfile.avatar ? (
                                            <img
                                                src={tempProfile.avatar}
                                                alt="Preview"
                                                className="h-20 w-20 object-cover mx-auto rounded-full"
                                            />
                                        ) : (
                                            "Click to upload or drag & drop your new profile picture here"
                                        )}
                                    </p>
                                    <input
                                        id="fileInput"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e.target.files[0])}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Save and Close Buttons */}
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500 transition"
                                onClick={() => setIsSettingsOpen(false)}
                            >
                                Close
                            </button>
                            <button
                                className="bg-green-500 px-4 py-2 rounded hover:bg-green-400 transition"
                                onClick={() => {
                                    setUserProfile(tempProfile); // Apply changes
                                    setIsSettingsOpen(false);   // Close modal
                                }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
