import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [direction, setDirection] = useState(1);
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
      <div className="relative flex flex-col-reverse md:flex-col">
        {/* Text Section */}
        <div className="p-4 md:p-6 z-20 bg-gray-900/80 md:bg-transparent md:absolute md:bottom-0 md:left-0 md:right-0">
          <AnimatePresence>
            <motion.div
              key={`text-${currentAnnouncement}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-xs text-red-400 mb-1 block">
                {announcements[currentAnnouncement].date}
              </span>
              <h2 className="text-xl md:text-3xl font-bold text-white mb-2">
                {announcements[currentAnnouncement].title}
              </h2>
              <p className="text-gray-300 text-sm md:text-base max-w-2xl">
                {announcements[currentAnnouncement].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Image Section with Animation */}
        <div className="h-60 md:h-80 w-full relative">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80 z-10 pointer-events-none" />
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentAnnouncement}
              custom={direction}
              variants={{
                enter: (dir) => ({
                  x: dir > 0 ? '100%' : '-100%',
                  opacity: 0,
                  scale: 1.1
                }),
                center: {
                  x: 0,
                  opacity: 1,
                  scale: 1
                },
                exit: (dir) => ({
                  x: dir > 0 ? '-100%' : '100%',
                  opacity: 0,
                  scale: 0.9
                })
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
                scale: { duration: 0.4 }
              }}
              className="absolute inset-0"
            >
              <img
                src={announcements[currentAnnouncement].image}
                alt={announcements[currentAnnouncement].title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Arrows with proper positioning using flex */}
        <div className="hidden md:flex absolute inset-0 items-center justify-between px-4 z-30">
          <motion.button
            onClick={prevAnnouncement}
            className="bg-gray-900 bg-opacity-70 hover:bg-opacity-90 hover:bg-red-900 text-white p-3 rounded-full shadow-md transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={24} />
          </motion.button>

          <motion.button
            onClick={nextAnnouncement}
            className="bg-gray-900 bg-opacity-70 hover:bg-opacity-90 hover:bg-red-900 text-white p-3 rounded-full shadow-md transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight size={24} />
          </motion.button>
        </div>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
          {announcements.map((_, index) => (
            <motion.button
              key={index}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentAnnouncement
                  ? 'bg-red-500 w-6'
                  : 'bg-gray-400 w-3 hover:bg-gray-300'
              }`}
              onClick={() => {
                setDirection(index > currentAnnouncement ? 1 : -1);
                setCurrentAnnouncement(index);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        {/* Auto-play indicator */}
        {isAutoPlaying && (
          <motion.div
            className="absolute top-4 right-4 z-30 bg-gray-900 bg-opacity-70 px-2 py-1 rounded-md text-xs text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
          >
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsCarousel;
