import React from 'react';
import AnnouncementsCarousel from '../components/AnnouncementsComponent';
import RecentGames from '../components/RecentGames';
import GameRooms from './GameRooms';


const HomePage = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* System Announcements Section */}
        <AnnouncementsCarousel />
        
        {/* Open Game Rooms Section */}
        <GameRooms />
        
        {/* Recent Games Section */}
        <RecentGames />
      </div>
    </div>
  );
};

export default HomePage;