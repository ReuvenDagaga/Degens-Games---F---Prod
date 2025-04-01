import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Brain, Award, TrendingUp, BarChart3, Users, Zap, GameController, ArrowUpCircle, ArrowDownCircle, Clock, Target, Bot, User, Activity, ThumbsUp, ThumbsDown
} from 'lucide-react';
import {
  LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const getWinRate = (wins, losses) => {
  const total = wins + losses;
  return total ? ((wins / total) * 100).toFixed(1) : "0.0";
};

const getSkillImprovements = (scoreAsArray) => {
  return scoreAsArray.map((val, idx) => ({
    month: `Month ${idx + 1}`,
    improvement: val,
  }));
};

const analyzeWeaknesses = (scoreAsArray) => {
  const recent = scoreAsArray.slice(-6);
  const decreasingStreak = recent.filter((val, i, arr) => i > 0 && val < arr[i - 1]).length;
  return decreasingStreak >= 3;
};

const recommendTrainings = (user) => {
  const baseGames = [
    { type: "Snake", skill: "Reaction Time", diff: "Medium" },
    { type: "2048", skill: "Planning", diff: "Hard" },
    { type: "Connect Four", skill: "Pattern Recognition", diff: "Medium" },
    { type: "Chess", skill: "Strategy", diff: "Expert" }
  ];

  const weaknessDetected = analyzeWeaknesses(user.scoreAsArrey || []);
  return baseGames.map((game, idx) => ({
    id: 200 + idx,
    name: `${game.type} Training`,
    difficulty: game.diff,
    playersPerMatch: 1,
    botOpponent: true,
    image: `/${game.type.toLowerCase()}-practice.jpg`,
    type: game.type,
    isFree: true,
    weakness: weaknessDetected && game.type !== "Chess",
    aiNotes: weaknessDetected
      ? `מומלץ לעבוד על ${game.skill} שלך במשחק מסוג ${game.type}`
      : `הביצועים שלך במשחק ${game.type} טובים מאוד! המשך כך.`
  }));
};

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

const formatProfit = (profit) => {
  if (profit > 0) {
    return `+$${profit}`;
  } else if (profit < 0) {
    return `-$${Math.abs(profit)}`;
  }
  return `$${profit}`;
};

const AIPlayerAnalytics = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (user) {
      const winRate = getWinRate(user.wins, user.losses);
      const improvements = getSkillImprovements(user.scoreAsArrey || []);
      const trainings = recommendTrainings(user);

      const playerData = {
        playerName: user.username,
        playerLevel: Math.floor((user.score || 0) / 100),
        totalGamesPlayed: user.wins + user.losses,
        winRate: parseFloat(winRate),
        aiAnalysis: {
          strongGames: user.wins > user.losses ? ["Chess", "Tetris"] : [],
          weakGames: user.losses > user.wins ? ["2048", "Snake"] : [],
          recentWinRate: winRate,
          previousWinRate: 60,
          recentProfit: user.profit,
          skillImprovements: improvements,
          skillRadar: [
            { subject: 'Strategy', A: Math.min(100, (user.score || 0) * 0.8), fullMark: 100 },
            { subject: 'Reaction Time', A: 60, fullMark: 100 },
            { subject: 'Pattern Recognition', A: 70, fullMark: 100 },
            { subject: 'Risk Assessment', A: 75, fullMark: 100 },
            { subject: 'Resource Management', A: 65, fullMark: 100 },
            { subject: 'Adaptability', A: 68, fullMark: 100 },
          ],
          recentMatches: [] // ניתן להוסיף בהמשך לפי נתונים אמיתיים
        },
        practiceRecommendations: trainings
      };

      setData(playerData);
    }
  }, [user]);

  if (!user || !data) {
    return (
      <div className="p-8 text-center text-gray-400">
        <h1 className="text-2xl font-bold text-white mb-4">AI Player Analytics</h1>
        <p>ברוכים הבאים למערכת ניתוח הביצועים האישית שלך 🎯</p>
        <p className="mt-2">אנא שחק בכמה משחקים כדי שנוכל להציג לך ניתוחים מותאמים אישית.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">AI Player Analytics</h1>
        <p className="text-gray-400">Personalized gameplay analysis and performance optimization powered by AI</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-cyan-900 flex items-center justify-center mr-4">
              <Brain size={24} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">AI Analysis Status</h3>
              <div className="text-white text-xl font-bold">{data.totalGamesPlayed ? 'Active' : 'Pending'}</div>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            {data.totalGamesPlayed ? 'AI analyzes your performance every game you play.' : 'You need to play a few games to activate AI insights.'}
          </div>
        </div>

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
          <div className="flex flex-wrap gap-1">
            {data.aiAnalysis.strongGames.map((game, i) => (
              <span key={i} className="px-2 py-1 bg-green-900/40 text-green-400 rounded-md text-xs">{game}</span>
            ))}
          </div>
        </div>

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
          <div className="flex flex-wrap gap-1">
            {data.aiAnalysis.weakGames.map((game, i) => (
              <span key={i} className="px-2 py-1 bg-red-900/40 text-red-400 rounded-md text-xs">{game}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <TrendingUp size={22} className="text-cyan-400 mr-2" />
          Performance Trend and Skill Improvement
        </h2>
        {data.aiAnalysis.skillImprovements.length > 1 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.aiAnalysis.skillImprovements}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#8884d8" domain={[0, 100]} />
                <Tooltip />
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
        ) : (
          <p className="text-gray-400 text-sm">שחק במספר משחקים כדי שנוכל להציג מגמות שיפור לאורך זמן.</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Target size={22} className="text-blue-400 mr-2" />
            Skill Breakdown Analysis
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={data.aiAnalysis.skillRadar}>
                <PolarGrid stroke="#555" />
                <PolarAngleAxis dataKey="subject" stroke="#888" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#888" />
                <Radar name="Skills" dataKey="A" stroke="#36B9CC" fill="#36B9CC" fillOpacity={0.5} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-bold text-white flex items-center mb-5">
          <Bot size={22} className="text-cyan-400 mr-2" />
          AI-Recommended Practice Sessions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {data.practiceRecommendations.map((room) => (
            <div
              key={room.id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:border-cyan-500 transition-colors duration-200 group cursor-pointer"
            >
              <div className="relative h-48">
                <img
                  src={room.image || "/default-room.jpg"}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                <div className="absolute top-3 right-3 bg-cyan-900 bg-opacity-80 px-2 py-1 rounded-md text-sm font-medium text-cyan-300">
                  Free Training
                </div>
                <div className="absolute top-3 left-3 bg-blue-600 px-2 py-1 rounded-md text-sm font-medium text-white">
                  {room.type}
                </div>
                <div
                  className="absolute top-14 left-3 px-2 py-1 rounded-md text-xs font-medium"
                  style={{
                    backgroundColor: room.weakness ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)',
                    color: room.weakness ? 'rgb(252,165,165)' : 'rgb(134,239,172)'
                  }}
                >
                  {room.weakness ? 'Needs Improvement' : 'Strength'}
                </div>
              </div>
              <div className="p-4">
                <div className="text-white text-lg font-semibold mb-1">{room.name}</div>
                <p className="text-sm text-gray-400 mb-2">{room.aiNotes}</p>
                <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1.5 rounded-md text-sm transition-colors">
                  Start Training
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIPlayerAnalytics;