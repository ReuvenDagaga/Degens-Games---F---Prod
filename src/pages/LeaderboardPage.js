import React from 'react';
import DailyLeaderboard from '../components/DailyLeaderboard';
import WeeklyLeaderboard from '../components/WeeklyLeaderboard';

const LeaderboardPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DailyLeaderboard />
        <WeeklyLeaderboard />
      </div>
    </div>
  );
};

export default LeaderboardPage;