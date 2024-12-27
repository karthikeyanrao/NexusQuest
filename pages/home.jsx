import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import CardSlider from "../components/Card/CardSlider";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaGamepad, FaTrophy, FaFire, FaUsers, FaBolt, FaBullseye,FaAngleDoubleUp,FaAngleDoubleDown } from "react-icons/fa";

export default function Home() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedMode, setSelectedMode] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleGameSelect = (mode) => {
    router.push('/game');
  };

  const cardVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <main className={styles.main}>
        <div className="mx-5 max-w-7xl w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative" >
            <CardSlider />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
          >
            {/* Beginner Card */}
            <motion.div 
              variants={cardVariants}
              whileHover="hover"
              className="bg-gradient-to-br from-green-500/90 to-lime-700/90 rounded-2xl shadow-lg p-8 cursor-pointer border-2 border-green-400/50 backdrop-blur-sm hover:shadow-lime-500/30 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <FaGamepad className="text-3xl text-emerald-200" />
                  <h3 className="text-2xl font-bold text-white">Begin</h3>
                </div>
                <p className="text-emerald-100 leading-relaxed flex-grow">Prefect for those just starting out.Learn the basics of betting in a risk-free environment</p>
                <button onClick={() => handleGameSelect('Beginner')} className="mt-4 bg-white/90 text-emerald-600 font-bold py-3 px-6 rounded-xl hover:bg-white transition-colors duration-200 group flex items-center justify-center gap-2">
                  Choose Mode <FaGamepad className="group-hover:rotate-12 transition-transform duration-300" />
                </button>
              </div>
            </motion.div>

            {/* Challenge Card */}
            <motion.div 
              variants={cardVariants}
              whileHover="hover"
              className="bg-gradient-to-br from-green-400/90 to-teal-600/90 rounded-2xl shadow-lg p-8 cursor-pointer border-2 border-teal-400/50 backdrop-blur-sm hover:shadow-emerald-600/30 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <FaTrophy className="text-3xl text-blue-200" />
                  <h3 className="text-2xl font-bold text-white">Challenge</h3>
                </div>
                <p className="text-blue-100 leading-relaxed flex-grow">Ready for more challenge? Test your improved skills with moderate difficulty.</p>
                <button onClick={() => handleGameSelect('Intermediate')} className="mt-4 bg-white/90 text-indigo-600 font-bold py-3 px-6 rounded-xl hover:bg-white transition-colors duration-200 group flex items-center justify-center gap-2">
                Accept Challenge <FaTrophy className="group-hover:scale-110 transition-transform duration-300" />
                </button>
              </div>
            </motion.div>

            {/* Season Card */}
            <motion.div 
              variants={cardVariants}
              whileHover="hover"
              className="bg-gradient-to-br from-purple-500/90 to-indigo-700/90 rounded-2xl shadow-lg p-8 cursor-pointer border-2 border-indigo-400/50 backdrop-blur-sm hover:shadow-purple-600/30 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <FaFire className="text-3xl text-purple-200" />
                  <h3 className="text-2xl font-bold text-white">Season </h3>
                </div>
                <p className="text-purple-100 leading-relaxed flex-grow">For experienced players. Face tough opponents and complex betting scenarios.</p>
                <button onClick={() => handleGameSelect('Advanced')} className="mt-4 bg-white/90 text-fuchsia-600 font-bold py-3 px-6 rounded-xl hover:bg-white transition-colors duration-200 group flex items-center justify-center gap-2">
                 Level Up  <FaFire className="group-hover:scale-110 transition-transform duration-300" />
                </button>
              </div>
            </motion.div>

            {/* Play with Squad Card */}
            <motion.div 
              variants={cardVariants}
              whileHover="hover"
              className="bg-gradient-to-br from-orange-500/90 to-crimson-700/90 rounded-2xl shadow-lg p-8 cursor-pointer border-2 border-red-400/50 backdrop-blur-sm hover:shadow-orange-600/30 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <FaUsers className="text-3xl text-orange-200" />
                  <h3 className="text-2xl font-bold text-white">Play with Squad</h3>
                </div>
                <p className="text-orange-100 leading-relaxed flex-grow">Challenge your friends and compete in friendly matches.</p>
                <button onClick={() => handleGameSelect('Friends')} className="mt-4 bg-white/90 text-red-600 font-bold py-3 px-6 rounded-xl hover:bg-white transition-colors duration-200 group flex items-center justify-center gap-2">
                  Invite Squad <FaUsers className="group-hover:scale-110 transition-transform duration-300" />
                </button>
              </div>
            </motion.div>

            {/* Quick Card */}
            <motion.div 
              variants={cardVariants}
              whileHover="hover"
              className="bg-gradient-to-br from-yellow-500/90 to-gold-600/90 rounded-2xl shadow-lg p-8 cursor-pointer border-2 border-yellow-400/50 backdrop-blur-sm hover:shadow-amber-500/30 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <FaBolt className="text-3xl text-yellow-200" />
                  <h3 className="text-2xl font-bold text-white">Quick Match</h3>
                </div>
                <p className="text-yellow-100 leading-relaxed flex-grow">Jump into games with random players from around the world.</p>
                <button onClick={() => handleGameSelect('Random')} className="mt-4 bg-white/90 text-amber-600 font-bold py-3 px-6 rounded-xl hover:bg-white transition-colors duration-200 group flex items-center justify-center gap-2">
                  Quick Play <FaBolt className="group-hover:rotate-12 transition-transform duration-300" />
                </button>
              </div>
            </motion.div>

            {/* Practice Mode Card */}
            <motion.div 
              variants={cardVariants}
              whileHover="hover"
              className="bg-gradient-to-br from-teal-500/90 to-blue-700/90 rounded-2xl shadow-lg p-8 cursor-pointer border-2 border-cyan-400/50 backdrop-blur-sm hover:shadow-blue-500/30 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <FaBullseye className="text-3xl text-teal-200" />
                  <h3 className="text-2xl font-bold text-white">Trainning Mode</h3>
                </div>
                <p className="text-teal-100 leading-relaxed flex-grow">Hone your skills in a pressure-free environment with AI opponents.</p>
                <button onClick={() => handleGameSelect('Practice')} className="mt-4 bg-white/90 text-cyan-600 font-bold py-3 px-6 rounded-xl hover:bg-white transition-colors duration-200 group flex items-center justify-center gap-2">
                  Train Now <FaBullseye className="group-hover:scale-110 transition-transform duration-300" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
