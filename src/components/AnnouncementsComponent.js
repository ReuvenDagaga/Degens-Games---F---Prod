import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Updated sample data - System announcements with ePVP references
const announcements = [
  {
    id: 1,
    title: "Solana Network Support!",
    description: "We're excited to announce that our platform now supports Solana blockchain! Deposit and bet using your Phantom wallet and get a 10 ePVP bonus for new users.",
    image: "/solana-announcement.jpg",
    date: "08.03.2025"
  },
  {
    id: 2,
    title: "Apes vs. Penguins NFT Community Tournament!",
    description: "Epic showdown! The NFT Apes Community battles the Penguins in our biggest tournament yet. Represent your NFT collection and compete for exclusive rewards and bragging rights.",
    image: "/nft-tournament-announcement.jpg",
    date: "05.03.2025"
  },
  {
    id: 3,
    title: "Welcome Bonus for New Players",
    description: "New to the platform? Get an exclusive welcome package including 50 ePVP tokens, free tournament entry, and bonus multipliers on your first 5 games!",
    image: "/welcome-bonus-announcement.jpg",
    date: "01.03.2025"
  }
];

const AnnouncementsCarousel = () => {
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setDirection(1);
        setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
      }, 7000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Pause auto-play when hovering
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const nextAnnouncement = () => {
    setDirection(1);
    setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
  };

  const prevAnnouncement = () => {
    setDirection(-1);
    setCurrentAnnouncement((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  return (
    <div 
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 mb-8"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative">
        {/* Background Image with Animation */}
        <div className="h-80 bg-gray-700 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80 z-10"></div>
          
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentAnnouncement}
              custom={direction}
              variants={{
                enter: (direction) => ({
                  x: direction > 0 ? '100%' : '-100%',
                  opacity: 0,
                  scale: 1.1
                }),
                center: {
                  x: 0,
                  opacity: 1,
                  scale: 1,
                  transition: {
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.3 },
                    scale: { duration: 0.4 }
                  }
                },
                exit: (direction) => ({
                  x: direction > 0 ? '-100%' : '100%',
                  opacity: 0,
                  scale: 0.9,
                  transition: {
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.3 },
                    scale: { duration: 0.4 }
                  }
                })
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 }
              }}
              className="absolute inset-0"
            >
              <img
                src={announcements[currentAnnouncement].image || "/default-announcement.jpg"}
                alt={announcements[currentAnnouncement].title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
          
          {/* Announcement Text with Animation */}
          <AnimatePresence>
            <motion.div 
              key={`text-${currentAnnouncement}`}
              className="absolute bottom-0 left-0 right-0 p-6 z-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.span 
                className="text-sm text-red-400 mb-1 block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {announcements[currentAnnouncement].date}
              </motion.span>
              <motion.h2 
                className="text-3xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {announcements[currentAnnouncement].title}
              </motion.h2>
              <motion.p 
                className="text-gray-200 text-lg max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {announcements[currentAnnouncement].description}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Navigation Buttons with Animation */}
        <motion.div 
          className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <button 
            onClick={prevAnnouncement}
            className="bg-gray-900 bg-opacity-70 hover:bg-opacity-90 hover:bg-red-900 text-white p-3 rounded-full transition-colors duration-300 shadow-lg"
          >
            <ChevronLeft size={24} />
          </button>
        </motion.div>
        <motion.div 
          className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <button 
            onClick={nextAnnouncement}
            className="bg-gray-900 bg-opacity-70 hover:bg-opacity-90 hover:bg-red-900 text-white p-3 rounded-full transition-colors duration-300 shadow-lg"
          >
            <ChevronRight size={24} />
          </button>
        </motion.div>
        
        {/* Navigation Dots with Animation */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {announcements.map((_, index) => (
            <motion.button
              key={index}
              className={`h-3 rounded-full shadow-md transition-all duration-300 ${
                index === currentAnnouncement 
                  ? 'bg-red-500 w-8' 
                  : 'bg-gray-400 w-3 hover:bg-gray-300'
              }`}
              onClick={() => {
                setDirection(index > currentAnnouncement ? 1 : -1);
                setCurrentAnnouncement(index);
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
            </motion.button>
          ))}
        </div>
        
        {/* Auto-play indicator */}
        <motion.div 
          className="absolute top-4 right-4 z-20 bg-gray-900 bg-opacity-70 px-2 py-1 rounded-md text-xs text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: isAutoPlaying ? 0.8 : 0 }}
          exit={{ opacity: 0 }}
        >
          Auto-playing
        </motion.div>
      </div>
    </div>
  );
};

export default AnnouncementsCarousel;