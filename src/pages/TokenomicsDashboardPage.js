// TokenomicsDashboard.tsx
import React, { useEffect, useState } from 'react';
import {
  Flame, DollarSign, TrendingUp, BarChart3, Users, ArrowDownCircle, Clock, Wallet, PieChart, Zap, Link as LinkIcon
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const INITIAL_SUPPLY = 100_000_000;

const mockData = {
  token: {
    initialSupply: INITIAL_SUPPLY,
    currentSupply: INITIAL_SUPPLY,
    burned: {
      total: 0,
      lastBurn: 0,
      lastBurnDate: "-"
    },
    buyback: {
      totalUSDT: 0,
      lastAmount: 0,
      lastDate: "-",
      tokensBought: 0
    },
    circulation: {
      available: INITIAL_SUPPLY,
      staking: 0,
      stakingWallets: 0
    },
    projectedValueGrowth: [
      { month: 'Apr 25', tokenPrice: 0.0001, supplyLeft: 100, burned: 0 },
      { month: 'Jul 25', tokenPrice: 0.00011, supplyLeft: 95, burned: 5 },
      { month: 'Oct 25', tokenPrice: 0.00013, supplyLeft: 90, burned: 10 },
      { month: 'Jan 26', tokenPrice: 0.00016, supplyLeft: 85, burned: 15 },
      { month: 'Apr 26', tokenPrice: 0.0002, supplyLeft: 80, burned: 20 },
      { month: 'Jul 26', tokenPrice: 0.00026, supplyLeft: 74, burned: 26 },
      { month: 'Oct 26', tokenPrice: 0.00034, supplyLeft: 67, burned: 33 },
      { month: 'Jan 27', tokenPrice: 0.00044, supplyLeft: 59, burned: 41 },
      { month: 'Apr 27', tokenPrice: 0.00058, supplyLeft: 50, burned: 50 },
    ]
  },
  platform: {
    dailyUsers: 0,
    dailyGames: 0,
    usdtVolume: 0,
    epvpVolume: 0
  },
  txList: []
};

const formatNumber = (num) => {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(2) + 'K';
  return num.toString();
};

const calculatePercentage = (part, whole) => {
  if (!whole) return '0%';
  return ((part / whole) * 100).toFixed(2) + '%';
};

const TokenomicsDashboard = () => {
  const [data, setData] = useState(mockData);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const nextBurn = new Date(now);
      nextBurn.setDate(now.getDate() + 3);
      nextBurn.setHours(14, 0, 0, 0);
      const diff = nextBurn.getTime() - now.getTime();

      if (diff <= 0) return clearInterval(timer);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setCountdown({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold text-white mb-6">ePVP Tokenomics Dashboard</h1>

      {/* Projected Value & Burn Overview Chart */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <TrendingUp size={22} className="text-green-400 mr-2" />
          Token Burn & Price Projection
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data.token.projectedValueGrowth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="month" stroke="#888" />
            <YAxis yAxisId="left" orientation="left" stroke="#ff4d4d" />
            <YAxis yAxisId="right" orientation="right" stroke="#36d399" domain={[0, 0.001]} />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="burned" name="Burned Supply" stroke="#ff4d4d" strokeWidth={2} />
            <Line yAxisId="left" type="monotone" dataKey="supplyLeft" name="Remaining Supply" stroke="#facc15" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="tokenPrice" name="Projected Price (USDT)" stroke="#36d399" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Platform Activity */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <Zap size={22} className="text-yellow-400 mr-2" /> Platform Activity
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Daily Active Users</div>
            <div className="text-2xl font-bold text-white">{formatNumber(data.platform.dailyUsers)}</div>
          </div>
          <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Daily Games Played</div>
            <div className="text-2xl font-bold text-white">{formatNumber(data.platform.dailyGames)}</div>
          </div>
          <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Daily USDT Volume</div>
            <div className="text-2xl font-bold text-white">${formatNumber(data.platform.usdtVolume)}</div>
          </div>
          <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Daily ePVP Volume</div>
            <div className="text-2xl font-bold text-white">{formatNumber(data.platform.epvpVolume)}</div>
          </div>
        </div>
      </div>

      {/* Burn Transactions */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <BarChart3 size={22} className="text-red-400 mr-2" /> Burn Transactions
        </h2>
        {data.txList.length === 0 ? (
          <p className="text-gray-400 text-sm">No burn transactions yet. Once tokens are burned, they will appear here with Solscan links.</p>
        ) : (
          <table className="min-w-full text-sm text-left text-gray-300">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-2">Date</th>
                <th className="py-2">Amount Burned</th>
                <th className="py-2">Transaction</th>
              </tr>
            </thead>
            <tbody>
              {data.txList.map((tx, i) => (
                <tr key={i} className="border-b border-gray-700/50">
                  <td className="py-2">{tx.date}</td>
                  <td className="py-2 text-red-400 font-medium">{formatNumber(tx.burnedAmount)} ePVP</td>
                  <td className="py-2">
                    <a
                      href={`https://solscan.io/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline flex items-center"
                    >
                      <LinkIcon size={14} className="mr-1" /> View on Solscan
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="text-sm text-gray-400 border-t border-gray-700 pt-4">
        <p>This dashboard reflects token performance, deflation mechanisms and platform usage. All values are placeholders for now.</p>
      </div>
    </div>
  );
};

export default TokenomicsDashboard;
