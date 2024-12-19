import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAtomValue } from 'jotai';
import { walletAddressAtom } from '../lib/state';

const Profile = () => {
    const router = useRouter();
    const walletAddress = useAtomValue(walletAddressAtom);

    const [userProfile, setUserProfile] = useState({
        username: 'Karthikeyan',
        walletAddress: walletAddress || "0x...loading",
        avatar: <Image
            src={'image/esports.png'}
            alt="Profile"
            width={120}
            height={120}
            className="rounded-full ring-4 ring-yellow-500 object-cover" // Changed to golden yellow
        />,
        stats: {
            TotalGames: 23,
            WinRate: "69%",
            TotalEarnings: "8.5 ETH",
            HighScore: "297"
        },
        recentActivity: [
            {
                type: "Game Won",
                event: "Flappy Bird Tournament #127",
                amount: "+0.5 ETH",
                date: "2h ago",
                matchDetails: {
                    matchId: "#127",
                    score: 186,
                    participants: 50,
                    poolSize: "25 ETH"
                }
            },
            {
                type: "Game Played",
                event: "Cricket #126",
                amount: "-0.1 ETH",
                date: "5h ago",
                matchDetails: {
                    matchId: "#126",
                    score: 142,
                    participants: 75,
                    poolSize: "37.5 ETH"
                }
            },
            {
                type: "Game Won",
                event: "Basketball #125",
                amount: "+0.8 ETH",
                date: "1d ago",
                matchDetails: {
                    matchId: "#125",
                    score: 201,
                    participants: 100,
                    poolSize: "50 ETH"
                }
            },
            {
                type: "Game Played",
                event: "Flappy Bird Tournament #124",
                amount: "-0.1 ETH",
                date: "2d ago",
                matchDetails: {
                    matchId: "#124",
                    score: 167,
                    participants: 60,
                    poolSize: "30 ETH"
                }
            }
        ]
    });

    const [tempProfile, setTempProfile] = useState(userProfile);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        if (walletAddress) {
            setUserProfile((prev) => ({ ...prev, walletAddress }));
        }
    }, [walletAddress]);

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
                            className="rounded-full ring-4 ring-yellow-500" // Changed to golden yellow
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
                        <div className="flex gap-4">
                            <button
                                className="bg-yellow-600 px-6 py-2 rounded-lg hover:bg-yellow-700 transition" // Changed to golden yellow
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
