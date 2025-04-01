import React, { useState, useEffect } from 'react';
import { Flame, DollarSign, TrendingUp, BarChart3, Users, Calendar, ArrowDownCircle, Clock, Wallet, PieChart, Zap } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const mockTokenomicsData = {
  initialSupply: 100000000, 
  currentSupply: 100000000, 
  burned: {
    total: 0, 
    lastBurn: 0, 
    lastBurnDate: "Soon", 
  },
  buyback: {
    totalUSDT: 0, 
    lastAmount: 0, 
    lastDate: "Soon",
    tokensBought: 0, 
  },
  circulation: {
    available: 0, 
    staking: 0, 
    stakingWallets: 0, 
  },
  platform: {
    dailyUsers: 0, // Daily active users
    dailyGames: 0, // Games played daily
    usdtVolume: 0, // Daily USDT volume
    epvpVolume: 0, // Daily ePVP volume
  },
  // Projected token value data (for the chart)
  projectedValueGrowth: [
    { month: 'Mar 25', tokenPrice: 0.0001, supplyLeft: 99.7 },
    { month: 'Jun 25', tokenPrice: 0.00013, supplyLeft: 96.3 },
    { month: 'Sep 25', tokenPrice: 0.00018, supplyLeft: 95.1 },
    { month: 'Dec 25', tokenPrice: 0.00020, supplyLeft: 92.8 },
    { month: 'Mar 26', tokenPrice: 0.00025, supplyLeft: 89.2 },
    { month: 'Jun 26', tokenPrice: 0.00028, supplyLeft: 87.7 },
    { month: 'Sep 26', tokenPrice: 0.00032, supplyLeft: 82.1 },
    { month: 'Dec 26', tokenPrice: 0.00033, supplyLeft: 81.5 },
    { month: 'Mar 27', tokenPrice: 0.00036, supplyLeft: 80.0 },
    { month: 'Jun 27', tokenPrice: 0.00045, supplyLeft: 75.5 },
    { month: 'Sep 27', tokenPrice: 0.00049, supplyLeft: 74.0 },
    { month: 'Dec 27', tokenPrice: 0.00054, supplyLeft: 71.5 },
  ],
  // Burn history data (for the burn chart)
  burnHistory: [
    { month: 'Mar 25', amount: 0.087 },
    { month: 'Feb 25', amount: 0.075 },
    { month: 'Jan 25', amount: 0.012 },
    { month: 'Dec 24', amount: 0.011 },
    { month: 'Nov 24', amount: 0.075 }, 
    { month: 'Oct 24', amount: 0.028 },
    { month: 'Sep 24', amount: 0.092 },
    { month: 'Aug 24', amount: 0.051 },
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

// Calculate percentages
const calculatePercentage = (part, whole) => {
  return ((part / whole) * 100).toFixed(2) + '%';
};

const TokenomicsDashboard = () => {
  const [data, setData] = useState(mockTokenomicsData);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // Simulate countdown to next token burn
  useEffect(() => {
    const timer = setInterval(() => {
      // Set next burn to be 3 days from now
      const now = new Date();
      const nextBurn = new Date(now);
      nextBurn.setDate(nextBurn.getDate() + 3);
      nextBurn.setHours(14, 0, 0, 0);
      
      const diff = nextBurn - now;
      
      if (diff <= 0) {
        clearInterval(timer);
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setCountdown({ days, hours, minutes, seconds });
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
              {entry.name}: {entry.value} {entry.name === 'Token Price' ? 'USDT' : 'Million'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">ePVP Tokenomics Dashboard</h1>
        <p className="text-gray-400">Real-time statistics about our deflationary token mechanism and platform activity</p>
      </div>
      
      {/* Main stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Total Supply */}
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-900 flex items-center justify-center mr-4">
              <Wallet size={24} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">Total Supply</h3>
              <div className="text-white text-xl font-bold">{formatNumber(data.initialSupply)}</div>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <div>
              <div className="text-gray-400">Current Supply</div>
              <div className="text-white font-medium">{formatNumber(data.currentSupply)}</div>
              <div className="text-purple-400 text-xs">
                {calculatePercentage(data.currentSupply, data.initialSupply)} of initial
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-400">Total Burned</div>
              <div className="text-red-400 font-medium">{formatNumber(data.burned.total)}</div>
              <div className="text-red-400 text-xs">
                {calculatePercentage(data.burned.total, data.initialSupply)} of initial
              </div>
            </div>
          </div>
        </div>
        
        {/* Card 2: Latest Burn */}
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-red-900 flex items-center justify-center mr-4">
              <Flame size={24} className="text-red-400" />
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">Latest Token Burn</h3>
              <div className="text-white text-xl font-bold">{formatNumber(data.burned.lastBurn)}</div>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <div>
              <div className="text-gray-400">Burn Date</div>
              <div className="text-white font-medium">{data.burned.lastBurnDate}</div>
            </div>
            <div className="text-right">
              <div className="text-gray-400">Next Burn</div>
              <div className="flex items-center justify-end text-yellow-400 font-medium">
                <Clock size={14} className="mr-1" />
                <span>
                  {countdown.days}d {countdown.hours}h {countdown.minutes}m
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Card 3: Buyback Program */}
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-green-900 flex items-center justify-center mr-4">
              <DollarSign size={24} className="text-green-400" />
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">Total Buyback</h3>
              <div className="text-white text-xl font-bold">${formatNumber(data.buyback.totalUSDT)}</div>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <div>
              <div className="text-gray-400">Last Buyback</div>
              <div className="text-green-400 font-medium">${formatNumber(data.buyback.lastAmount)}</div>
              <div className="text-gray-400 text-xs">{data.buyback.lastDate}</div>
            </div>
            <div className="text-right">
              <div className="text-gray-400">Tokens Bought</div>
              <div className="text-white font-medium">{formatNumber(data.buyback.tokensBought)}</div>
              <div className="text-red-400 text-xs">Then Burned 🔥</div>
            </div>
          </div>
        </div>
        
        {/* Card 4: Platform Activity */}
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center mr-4">
              <Zap size={24} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">Platform Activity</h3>
              <div className="text-white text-xl font-bold">{formatNumber(data.platform.dailyUsers)} Users</div>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <div>
              <div className="text-gray-400">Daily Games</div>
              <div className="text-white font-medium">{formatNumber(data.platform.dailyGames)}</div>
            </div>
            <div className="text-right">
              <div className="text-gray-400">Daily Volume</div>
              <div className="text-green-400 font-medium">${formatNumber(data.platform.usdtVolume)}</div>
              <div className="text-yellow-400 text-xs">
                {formatNumber(data.platform.epvpVolume)} ePVP
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Token value projection chart */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <TrendingUp size={22} className="text-purple-400 mr-2" />
          Projected Token Value vs. Supply Reduction
        </h2>
        <p className="text-gray-400 mb-6">
          As our burn mechanism reduces the total token supply, the value of each remaining token is projected to increase over time.
        </p>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data.projectedValueGrowth}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis yAxisId="left" stroke="#8884d8" domain={[0, 'auto']} />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" domain={[0, 0.004]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="tokenPrice"
                name="Token Price"
                stroke="#82ca9d"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="supplyLeft"
                name="Supply (Millions)"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-between mt-6 text-sm text-gray-400">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            <span>Token Supply - Millions of $PVP (decreasing over time due to burns)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Token Price - USDT (projected to increase with decreased supply)</span>
          </div>
        </div>
      </div>
      
      {/* Token Circulation and Burn History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Circulation Pie Chart */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <PieChart size={22} className="text-yellow-400 mr-2" />
            Token Circulation Status
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-750 rounded-lg p-3 border border-gray-700">
              <div className="text-sm text-gray-400">Available Supply</div>
              <div className="text-lg font-bold text-white">{formatNumber(data.circulation.available)}</div>
              <div className="text-xs text-yellow-400">
                {calculatePercentage(data.circulation.available, data.currentSupply)} of current
              </div>
            </div>
            
            <div className="bg-gray-750 rounded-lg p-3 border border-gray-700">
              <div className="text-sm text-gray-400">In Staking</div>
              <div className="text-lg font-bold text-white">{formatNumber(data.circulation.staking)}</div>
              <div className="text-xs text-purple-400">
                {calculatePercentage(data.circulation.staking, data.currentSupply)} of current
              </div>
            </div>
            
            <div className="bg-gray-750 rounded-lg p-3 border border-gray-700">
              <div className="text-sm text-gray-400">Staking Wallets</div>
              <div className="text-lg font-bold text-white">{formatNumber(data.circulation.stakingWallets)}</div>
              <div className="text-xs text-purple-400">
                AVG: {formatNumber(data.circulation.staking / data.circulation.stakingWallets)} per wallet
              </div>
            </div>
          </div>
          
          <div className="flex items-center mb-4">
            <div className="h-5 rounded-l-full bg-yellow-500" style={{ width: `${(data.circulation.available / data.currentSupply) * 100}%` }}></div>
            <div className="h-5 rounded-r-full bg-purple-500" style={{ width: `${(data.circulation.staking / data.currentSupply) * 100}%` }}></div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-400">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span>Available: {calculatePercentage(data.circulation.available, data.currentSupply)}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span>Staked: {calculatePercentage(data.circulation.staking, data.currentSupply)}</span>
            </div>
          </div>
        </div>
        
        {/* Burn History Chart */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <BarChart3 size={22} className="text-red-400 mr-2" />
            Monthly Burn History (Millions)
          </h2>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data.burnHistory}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#ff4d4d" 
                  fill="url(#colorUv)" 
                />
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff4d4d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ff4d4d" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-between mt-4">
            <div className="text-sm text-gray-400">
              <div className="font-medium">Total Burned: {formatNumber(data.burned.total)}</div>
              <div className="text-red-400 text-xs">
                {calculatePercentage(data.burned.total, data.initialSupply)} of initial supply
              </div>
            </div>
            <div className="text-sm text-gray-400 text-right">
              <div className="font-medium">Average Monthly Burn</div>
              <div className="text-red-400">
                {formatNumber(data.burnHistory.reduce((acc, curr) => acc + curr.amount, 0) * 10000000 / data.burnHistory.length)}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* More detailed stats in a grid */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <Users size={22} className="text-blue-400 mr-2" />
          Platform Activity Statistics
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Daily Users */}
          <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div className="text-gray-400">Daily Active Users</div>
              <Users size={18} className="text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">{formatNumber(data.platform.dailyUsers)}</div>
            <div className="mt-2 text-xs text-green-400 flex items-center">
              <ArrowDownCircle size={14} className="mr-1 transform rotate-180" />
              <span>+0% from last week</span>
            </div>
          </div>
          
          {/* Daily Games */}
          <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div className="text-gray-400">Daily Games Played</div>
              <Zap size={18} className="text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-white">{formatNumber(data.platform.dailyGames)}</div>
            <div className="mt-2 text-xs text-green-400 flex items-center">
              <ArrowDownCircle size={14} className="mr-1 transform rotate-180" />
              <span>+0% from last week</span>
            </div>
          </div>
          
          {/* USDT Volume */}
          <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div className="text-gray-400">Daily USDT Volume</div>
              <DollarSign size={18} className="text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white">${formatNumber(data.platform.usdtVolume)}</div>
            <div className="mt-2 text-xs text-green-400 flex items-center">
              <ArrowDownCircle size={14} className="mr-1 transform rotate-180" />
              <span>+0% from last week</span>
            </div>
          </div>
          
          {/* ePVP Volume */}
          <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div className="text-gray-400">Daily ePVP Volume</div>
              <img src="/favi.png" alt="ePVP" className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold text-white">{formatNumber(data.platform.epvpVolume)}</div>
            <div className="mt-2 text-xs text-green-400 flex items-center">
              <ArrowDownCircle size={14} className="mr-1 transform rotate-180" />
              <span>+0% from last week</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer with info about burns */}
      <div className="mt-8 bg-gray-750 rounded-lg p-2 border border-gray-700 text-sm text-gray-400">
        <h3 className="font-medium text-white mb-1 flex items-center">
          <Flame size={16} className="text-red-400 mr-2" />
          About Our Token Burn Mechanism
        </h3>
        <p className="mb-1">
          Our platform implements a systematic token burn mechanism where we regularly remove $PVP from circulation, 
          reducing the total supply. Additionally, we conduct regular buybacks using platform revenue to purchase 
          $PVP from the market and burn them permanently.
        </p>
        <p>
          This deflationary model is designed to reward long-term holders as the decreased supply typically leads 
          to increased token value over time. Burns occur automatically based on platform activity, with larger 
          burns happening during periods of higher platform engagement.
        </p>
      </div>
    </div>
  );
};

export default TokenomicsDashboard;