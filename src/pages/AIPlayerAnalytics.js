import React, { useState, useEffect } from 'react';
import { Brain, Award, TrendingUp, BarChart3, Users, Zap, GameController, ArrowUpCircle, ArrowDownCircle, Clock, Target, Bot, User, Activity, ThumbsUp, ThumbsDown } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// Mock data for the AI analytics dashboard
const mockPlayerData = {
  // Player performance data
  playerName: "Alex_GamerPro",
  playerLevel: 32,
  totalGamesPlayed: 897,
  winRate: 68.4,
  aiAnalysis: {
    strongGames: ["Chess", "Poker", "Blackjack"],
    weakGames: ["2048", "Snake", "Connect Four"],
    recentWinRate: 58.7, // Last 30 games
    previousWinRate: 63.5, // 30 games before that
    recentProfit: -120, // USDT profit/loss in last 30 games
    suggestedTraining: ["Snake", "Connect Four", "2048"],
    skillImprovements: [
      { month: 'Sep 24', improvement: 62 },
      { month: 'Oct 24', improvement: 68 },
      { month: 'Nov 24', improvement: 64 },
      { month: 'Dec 24', improvement: 72 },
      { month: 'Jan 25', improvement: 75 },
      { month: 'Feb 25', improvement: 81 },
      { month: 'Mar 25', improvement: 85 },
    ],
    gamePerformance: [
      { game: "Chess", winRate: 87, profit: 245, gamesPlayed: 78 },
      { game: "Poker", winRate: 72, profit: 180, gamesPlayed: 92 },
      { game: "Blackjack", winRate: 68, profit: 120, gamesPlayed: 65 },
      { game: "Monopoly", winRate: 62, profit: 75, gamesPlayed: 41 },
      { game: "Tetris", winRate: 59, profit: 30, gamesPlayed: 87 },
      { game: "Connect Four", winRate: 48, profit: -45, gamesPlayed: 52 },
      { game: "Snake", winRate: 42, profit: -80, gamesPlayed: 43 },
      { game: "2048", winRate: 39, profit: -125, gamesPlayed: 38 },
    ],
    skillRadar: [
      { subject: 'Strategy', A: 85, fullMark: 100 },
      { subject: 'Reaction Time', A: 62, fullMark: 100 },
      { subject: 'Pattern Recognition', A: 78, fullMark: 100 },
      { subject: 'Risk Assessment', A: 82, fullMark: 100 },
      { subject: 'Resource Management', A: 65, fullMark: 100 },
      { subject: 'Adaptability', A: 73, fullMark: 100 },
    ],
    recentMatches: [
      { game: "Chess", result: "win", profit: 45, date: "09.03.2025 18:42" },
      { game: "Poker", result: "win", profit: 65, date: "09.03.2025 16:30" },
      { game: "Snake", result: "loss", profit: -20, date: "09.03.2025 14:15" },
      { game: "2048", result: "loss", profit: -30, date: "08.03.2025 21:10" },
      { game: "Chess", result: "win", profit: 35, date: "08.03.2025 19:45" },
    ]
  },
  // Practice recommendations
  practiceRecommendations: [
    {
      id: 201,
      name: "Snake Training",
      difficulty: "Medium",
      playersPerMatch: 1,
      botOpponent: true,
      image: "/snake-training.jpg",
      type: "Snake",
      isFree: true,
      weakness: true,
      aiNotes: "Your reaction time in Snake is 15% below average. This training focuses on improving quick decision making."
    },
    {
      id: 202,
      name: "2048 Practice",
      difficulty: "Hard",
      playersPerMatch: 1,
      botOpponent: false,
      image: "/2048-practice.jpg",
      type: "2048",
      isFree: true,
      weakness: true,
      aiNotes: "You struggle with long-term planning in 2048. Our analysis shows you prioritize immediate merges over strategic positioning."
    },
    {
      id: 203,
      name: "Connect Four Bot Challenge",
      difficulty: "Medium",
      playersPerMatch: 1,
      botOpponent: true,
      image: "/connect-four.jpg",
      type: "Connect Four",
      isFree: true,
      weakness: true,
      aiNotes: "Pattern recognition is your main weakness here. This training will help you identify common winning patterns."
    },
    {
      id: 204,
      name: "Chess Mastery",
      difficulty: "Expert",
      playersPerMatch: 1,
      botOpponent: true,
      image: "/chess-practice.jpg",
      type: "Chess",
      isFree: true,
      weakness: false,
      aiNotes: "You excel at Chess! This advanced session will help you maintain your high performance and master new strategies."
    }
  ]
};

// Format large numbers to be readable
const formatNumber = (num) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + 'B';
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  return num.toString();
};

// Format profit with +/- sign
const formatProfit = (profit) => {
  if (profit > 0) {
    return `+$${profit}`;
  } else if (profit < 0) {
    return `-$${Math.abs(profit)}`;
  }
  return `$${profit}`;
};

// Pulsing animation for dots
const pulsingDotAnimation = `
@keyframes pulse {
  0% {
    opacity: 0.6;
    transform: scale(0.9);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 0.6;
    transform: scale(0.9);
  }
}

.pulse-dot {
  animation: pulse 1.5s infinite;
}
`;

const AIPlayerAnalytics = () => {
  const [data, setData] = useState(mockPlayerData);
  const [nextTrainingTime, setNextTrainingTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // Simulate countdown to next AI training session
  useEffect(() => {
    const timer = setInterval(() => {
      // Set next training to be 2 hours from now
      const now = new Date();
      const nextTraining = new Date(now);
      nextTraining.setHours(now.getHours() + 2);
      
      const diff = nextTraining - now;
      
      if (diff <= 0) {
        clearInterval(timer);
        return;
      }
      
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setNextTrainingTime({ hours, minutes, seconds });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Custom tooltip for the charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 border border-gray-700 rounded-md">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="flex items-center text-sm">
              <span className="w-3 h-3 inline-block mr-1" style={{ backgroundColor: entry.color }}></span>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <style>{pulsingDotAnimation}</style>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">AI Player Analytics</h1>
        <p className="text-gray-400">Personalized gameplay analysis and performance optimization powered by AI</p>
      </div>
      
      {/* Main stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Player Stats */}
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center mr-4">
              <User size={24} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">Player Profile</h3>
              <div className="text-white text-xl font-bold">{data.playerName}</div>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <div>
              <div className="text-gray-400">Games Played</div>
              <div className="text-white font-medium">{formatNumber(data.totalGamesPlayed)}</div>
            </div>
            <div className="text-right">
              <div className="text-gray-400">Win Rate</div>
              <div className="text-cyan-400 font-medium">{data.winRate}%</div>
            </div>
          </div>
        </div>
        
        {/* Card 2: AI Analysis Status */}
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-cyan-900 flex items-center justify-center mr-4">
              <Brain size={24} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">AI Analysis Status</h3>
              <div className="text-white text-xl font-bold">Active</div>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <div>
              <div className="text-gray-400">Last Updated</div>
              <div className="text-white font-medium">Today, 14:30</div>
            </div>
            <div className="text-right">
              <div className="text-gray-400">Next Update</div>
              <div className="flex items-center justify-end text-blue-400 font-medium">
                <Clock size={14} className="mr-1" />
                <span>
                  {nextTrainingTime.hours}h {nextTrainingTime.minutes}m
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Card 3: Strengths */}
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-green-900 flex items-center justify-center mr-4">
              <ThumbsUp size={24} className="text-green-400" />
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">Your Strengths</h3>
              <div className="text-white text-xl font-bold">{data.aiAnalysis.strongGames.length} Games</div>
            </div>
          </div>
          <div className="flex flex-col text-sm">
            <div className="text-gray-400 mb-2">Best Performance In:</div>
            <div className="flex flex-wrap gap-1">
              {data.aiAnalysis.strongGames.map((game, index) => (
                <span key={index} className="px-2 py-1 bg-green-900/40 text-green-400 rounded-md text-xs">
                  {game}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Card 4: Weaknesses */}
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-red-900 flex items-center justify-center mr-4">
              <ThumbsDown size={24} className="text-red-400" />
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">Areas to Improve</h3>
              <div className="text-white text-xl font-bold">{data.aiAnalysis.weakGames.length} Games</div>
            </div>
          </div>
          <div className="flex flex-col text-sm">
            <div className="text-gray-400 mb-2">Practice Recommended For:</div>
            <div className="flex flex-wrap gap-1">
              {data.aiAnalysis.weakGames.map((game, index) => (
                <span key={index} className="px-2 py-1 bg-red-900/40 text-red-400 rounded-md text-xs">
                  {game}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Performance trend chart */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <TrendingUp size={22} className="text-cyan-400 mr-2" />
          Performance Trend and Skill Improvement
        </h2>
        <p className="text-gray-400 mb-6">
          Our AI tracks your gameplay patterns to identify improvement over time and suggest personalized training strategies.
        </p>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data.aiAnalysis.skillImprovements}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#8884d8" domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="improvement"
                name="Skill Rating"
                stroke="#36B9CC"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-between mt-6 text-sm text-gray-400">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
            <span>Skill improvement based on AI analysis of gameplay patterns, decision making, and outcomes</span>
          </div>
          <div className="px-3 py-1 bg-blue-900/50 text-blue-400 rounded-md text-xs">
            Current skill level: Advanced
          </div>
        </div>
      </div>
      
      {/* Skill radar and game performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Skill Radar Chart */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Target size={22} className="text-blue-400 mr-2" />
            Skill Breakdown Analysis
          </h2>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart 
                outerRadius={90} 
                data={data.aiAnalysis.skillRadar}
              >
                <PolarGrid stroke="#555" />
                <PolarAngleAxis dataKey="subject" stroke="#888" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#888" />
                <Radar 
                  name="Skills" 
                  dataKey="A" 
                  stroke="#36B9CC" 
                  fill="#36B9CC" 
                  fillOpacity={0.5} 
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 text-sm text-gray-400">
            <p className="mb-2">AI has identified your key strengths in <span className="text-cyan-400">Strategy</span> and <span className="text-cyan-400">Risk Assessment</span>.</p>
            <p>Consider improving your <span className="text-red-400">Reaction Time</span> for better performance in fast-paced games.</p>
          </div>
        </div>
        
        {/* Game Performance Chart */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <BarChart3 size={22} className="text-blue-400 mr-2" />
            Game Performance Analytics
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-750 rounded-lg p-3 border border-gray-700">
              <div className="text-sm text-gray-400">Recent Win Rate</div>
              <div className="text-lg font-bold text-white">{data.aiAnalysis.recentWinRate}%</div>
              <div className="text-xs text-red-400 flex items-center">
                <ArrowDownCircle size={14} className="mr-1" />
                <span>-{(data.aiAnalysis.previousWinRate - data.aiAnalysis.recentWinRate).toFixed(1)}% from previous</span>
              </div>
            </div>
            
            <div className="bg-gray-750 rounded-lg p-3 border border-gray-700">
              <div className="text-sm text-gray-400">Recent Profit</div>
              <div className="text-lg font-bold text-red-400">-$120</div>
              <div className="text-xs text-blue-400">
                AI recommends focusing on training to improve profit
              </div>
            </div>
          </div>
          
          <div className="overflow-hidden overflow-x-auto thin-scrollbar">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 text-gray-400">Game</th>
                  <th className="text-center py-2 text-gray-400">Win Rate</th>
                  <th className="text-center py-2 text-gray-400">Profit</th>
                  <th className="text-right py-2 text-gray-400">Played</th>
                </tr>
              </thead>
              <tbody>
                {data.aiAnalysis.gamePerformance.slice(0, 5).map((game, index) => (
                  <tr key={index} className="border-b border-gray-700/50">
                    <td className="py-2 font-medium">{game.game}</td>
                    <td className="py-2 text-center">
                      <span className={game.winRate > 60 ? 'text-cyan-400' : 'text-red-400'}>
                        {game.winRate}%
                      </span>
                    </td>
                    <td className="py-2 text-center">
                      <span className={game.profit >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {formatProfit(game.profit)}
                      </span>
                    </td>
                    <td className="py-2 text-right text-gray-400">{game.gamesPlayed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* AI Practice Recommendations */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Bot size={22} className="text-cyan-400 mr-2" />
            AI-Recommended Practice Sessions
          </h2>
          <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">
            View all recommendations &gt;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {data.practiceRecommendations.map((room) => (
            <div 
              key={room.id} 
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:border-cyan-500 transition-colors duration-200 group cursor-pointer transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-48">
                <img
                  src={room.image || "/default-room.jpg"}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                
                {/* Free Badge */}
                <div className="absolute top-3 right-3 bg-cyan-900 bg-opacity-80 px-2 py-1 rounded-md text-sm font-medium">
                  <span className="text-cyan-300">Free Training</span>
                </div>
                
                {/* Game Type Badge */}
                <div className="absolute top-3 left-3 bg-blue-600 px-2 py-1 rounded-md text-sm font-medium">
                  {room.type}
                </div>
                
                {/* Weakness/Strength Badge */}
                <div 
                  className="absolute top-14 left-3 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1"
                  style={{ 
                    backgroundColor: room.weakness ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)',
                    color: room.weakness ? 'rgb(252,165,165)' : 'rgb(134,239,172)'
                  }}
                >
                  {room.weakness ? (
                    <>
                      <ThumbsDown size={12} />
                      <span>Needs Improvement</span>
                    </>
                  ) : (
                    <>
                      <ThumbsUp size={12} />
                      <span>Strength</span>
                    </>
                  )}
                </div>
                
                <div className="absolute bottom-0 right-0 left-0 p-3">
                  <div className="flex justify-between items-end">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{room.name}</h3>
                    <div className="bg-gray-900 bg-opacity-70 rounded px-2 py-1">
                      <div className="flex items-center text-sm">
                        {room.botOpponent ? (
                          <>
                            <Bot size={16} className="text-blue-300 mr-1" />
                            <span className="text-blue-300">Bot Opponent</span>
                          </>
                        ) : (
                          <>
                            <User size={16} className="text-gray-300 mr-1" />
                            <span>Solo Practice</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm">
                    <span className="text-gray-400 mr-1">Difficulty:</span>
                    <span className={
                      room.difficulty === "Easy" ? "text-green-400" :
                      room.difficulty === "Medium" ? "text-yellow-400" :
                      "text-red-400"
                    }>
                      {room.difficulty}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 bg-gray-750 px-2 py-1 rounded">
                    {room.botOpponent ? 'AI Opponent' : 'Self-paced'}
                  </div>
                </div>
                
                <div className="border-t border-gray-700 pt-3 mt-2">
                  <div className="text-xs text-gray-300 mb-2">
                    <span className="text-cyan-400 font-medium">AI Analysis:</span>
                  </div>
                  <p className="text-xs text-gray-400 bg-gray-750 p-2 rounded">
                    {room.aiNotes}
                  </p>
                </div>
                
                <div className="mt-3 flex justify-end">
                  <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1.5 rounded-md text-sm transition-colors">
                    Start Training
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent matches */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <Activity size={22} className="text-blue-400 mr-2" />
          Recent Match Analysis
        </h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Game</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Result</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Profit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">AI Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {data.aiAnalysis.recentMatches.map((match, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-750' : 'bg-gray-800'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{match.game}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      match.result === 'win' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                    }`}>
                      {match.result.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={match.profit > 0 ? 'text-green-400' : 'text-red-400'}>
                      {formatProfit(match.profit)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{match.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {match.result === 'win' 
                      ? "Strong strategic decisions. Capitalized on opponent mistakes."
                      : "Missed key patterns. AI recommends pattern recognition practice."}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Footer with info about AI analytics */}
      <div className="mt-8 bg-gray-750 rounded-lg p-4 border border-gray-700 text-sm text-gray-400">
        <h3 className="font-medium text-white mb-2 flex items-center">
          <Brain size={16} className="text-cyan-400 mr-2" />
          About Our AI Analytics System
        </h3>
        <p className="mb-2">
          Our platform uses advanced AI algorithms to analyze your gameplay patterns, decision-making processes, 
          and outcomes across all games. This personalized analysis helps identify your strengths and weaknesses, 
          allowing us to recommend targeted practice sessions to improve your skills.
        </p>
        <p>
          The free training sessions are designed specifically based on your performance history. Playing these
          training games regularly will help you develop the specific skills needed to increase your win rate
          and profitability in competitive matches. Our AI continuously learns from your progress to refine its
          recommendations.
        </p>
      </div>
    </div>
  );
};

export default AIPlayerAnalytics;