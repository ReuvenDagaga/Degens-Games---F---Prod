import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trophy, X, Copy, Users, Wallet, BarChart3, CreditCard, ExternalLink, ChevronRight, DollarSign } from 'lucide-react';
import Loading from '../components/Loading';

const UserProfile = () => {
  const { user } = useAuth();
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const copyReferralCode = () => {
    if (user?.refferalCode) {
      navigator.clipboard.writeText(user.refferalCode);
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    }
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const formatBalance = (balance) => {
    if (balance === undefined || balance === null) return '0';
    
    const numBalance = typeof balance === 'string' ? parseFloat(balance) : balance;
    
    if (numBalance >= 1000000) {
      if (numBalance >= 1000000000) {
        return `${(numBalance / 1000000000).toFixed(2)}B`;
      }
      return `${(numBalance / 1000000).toFixed(2)}M`;
    }
    
    if (numBalance >= 10000) {
      return numBalance.toLocaleString();
    }
    
    return numBalance.toFixed(2);
  };

  if (!user) {
    return (
      <Loading/>
    );
  }
  
  return (
    <div className="bg-gray-900 text-gray-200 w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-red-700 to-red-500 flex items-center justify-center text-xl font-bold text-white ring-4 ring-gray-800">
                  {user.username?.substring(0, 2).toUpperCase() || user.walletAddress?.substring(0, 2).toUpperCase() || "?"}
                </div>
                {user.status === 'ACTIVE' && (
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-800"></div>
                )}
              </div>
              
              <div className="mt-6 flex flex-col items-center gap-2 w-full">
                <div className="flex items-center bg-gray-750 border border-gray-700 rounded-lg px-3 py-2 w-full justify-between">
                  <div className="flex items-center">
                    <img 
                      src="/USDT.png" 
                      alt="USDT" 
                      className="w-6 h-6 mr-2"
                    />
                    <span className="text-sm text-gray-400">USDT</span>
                  </div>
                  <span className={`font-medium ${user.usdtBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${user.usdtBalance.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex items-center bg-gray-750 border border-gray-700 rounded-lg px-3 py-2 w-full justify-between">
                  <div className="flex items-center">
                    <img 
                      src="/favi.png" 
                      alt="ePVP" 
                      className="w-6 h-6 mr-2"
                    />
                    <span className="text-sm text-gray-400">ePVP</span>
                  </div>
                  <span className="font-medium text-yellow-400 truncate max-w-[150px]" title={user.ePvpBalance}>
                    {formatBalance(user.ePvpBalance)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 md:ml-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-100">{user.username || "User"}</h1>
                {user.isAdmin && (
                  <span className="mt-2 sm:mt-0 px-3 py-1 text-xs font-semibold bg-purple-900 text-purple-200 rounded-full">
                    Administrator
                  </span>
                )}
              </div>
              
              <div className="flex items-center text-sm text-gray-400 mb-4">
                <Wallet size={16} className="mr-2" />
                <span className="mr-2">{truncateAddress(user.walletAddress)}</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(user.walletAddress)}
                  className="text-gray-500 hover:text-gray-300"
                >
                  <Copy size={14} />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <Trophy size={16} className="text-green-400" />
                  </div>
                  <div className="ml-2">
                    <div className="text-xs text-gray-400">Wins</div>
                    <div className="font-medium">{user.wins}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <X size={16} className="text-red-400" />
                  </div>
                  <div className="ml-2">
                    <div className="text-xs text-gray-400">Losses</div>
                    <div className="font-medium">{user.losses}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <BarChart3 size={16} className="text-blue-400" />
                  </div>
                  <div className="ml-2">
                    <div className="text-xs text-gray-400">Profit</div>
                    <div className={`font-medium ${user.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {user.profit} USDT
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'overview' 
                    ? 'border-b-2 border-red-500 text-red-400' 
                    : 'text-gray-400 hover:text-gray-200 hover:border-gray-600'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('referrals')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'referrals' 
                    ? 'border-b-2 border-red-500 text-red-400' 
                    : 'text-gray-400 hover:text-gray-200 hover:border-gray-600'
                }`}
              >
                Referrals
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'transactions' 
                    ? 'border-b-2 border-red-500 text-red-400' 
                    : 'text-gray-400 hover:text-gray-200 hover:border-gray-600'
                }`}
              >
                Transactions
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gray-750 border border-gray-700 rounded-lg p-5 shadow-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-400">USDT Balance</p>
                        <h3 className={`text-2xl font-semibold mt-1 ${user.usdtBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ${user.usdtBalance.toFixed(2)}
                        </h3>
                      </div>
                      <div className="p-2 bg-gray-700 rounded-lg">
                        <img src="/USDT.png" alt="USDT" className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-750 border border-gray-700 rounded-lg p-5 shadow-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-400">ePVP Balance</p>
                        <h3 className="text-2xl font-semibold mt-1 text-yellow-400 truncate max-w-[180px]" title={user.ePvpBalance}>
                          {formatBalance(user.ePvpBalance)}
                        </h3>
                      </div>
                      <div className="p-2 bg-gray-700 rounded-lg">
                        <img src="/favi.png" alt="ePVP" className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-750 border border-gray-700 rounded-lg p-5 shadow-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-400">Win Rate</p>
                        <h3 className="text-2xl font-semibold mt-1 text-gray-100">
                          {user.wins + user.losses > 0 
                            ? `${Math.round((user.wins / (user.wins + user.losses)) * 100)}%` 
                            : '0%'}
                        </h3>
                      </div>
                      <div className="p-2 bg-gray-700 rounded-lg">
                        <Trophy size={20} className="text-yellow-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-750 border border-gray-700 rounded-lg p-5 shadow-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-400">Total Profit</p>
                        <h3 className={`text-2xl font-semibold mt-1 truncate max-w-[180px] ${user.profit >= 0 ? 'text-green-400' : 'text-red-400'}`} title={`${user.profit} ePVP`}>
                          {user.profit > 0 ? '+' : ''}{formatBalance(user.profit)} USDT
                        </h3>
                      </div>
                      <div className="p-2 bg-gray-700 rounded-lg">
                        <BarChart3 size={20} className="text-green-400" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-750 border border-gray-700 rounded-lg p-5 shadow-md mb-8">
                  <h3 className="text-lg font-medium text-gray-200 mb-3">Referral Program</h3>
                  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Your Referral Code</p>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-200 mr-2">{user.refferalCode}</span>
                          <button 
                            onClick={copyReferralCode}
                            className="text-gray-500 hover:text-gray-300 relative"
                          >
                            <Copy size={16} />
                            {showCopiedMessage && (
                              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                                Copied!
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-400">Referred Users:</span>
                        <span className="ml-2 font-medium text-gray-200">{user.refferedUsers?.length || 0}</span>
                      </div>
                      <button 
                        onClick={() => setActiveTab('referrals')}
                        className="text-sm bg-gray-700 border border-gray-600 rounded-md px-4 py-2 hover:bg-gray-600 text-gray-200 flex items-center"
                      >
                        View Details
                        <ChevronRight size={16} className="ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <button className="flex items-center bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-2.5 transition-colors">
                    <CreditCard size={18} className="mr-2" />
                    Deposit
                  </button>
                  <button className="flex items-center bg-gray-700 border border-gray-600 text-gray-200 hover:bg-gray-600 rounded-md px-4 py-2.5 transition-colors">
                    <Wallet size={18} className="mr-2" />
                    Withdraw
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'referrals' && (
              <div>
                <div className="mb-6 bg-gray-750 rounded-lg p-4 border border-gray-700 shadow-md">
                  <h3 className="text-lg font-medium text-gray-200 mb-2">Referral Program</h3>
                  <p className="text-gray-400 mb-3">Share your unique referral code with friends to earn rewards.</p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={user.refferalCode}
                        readOnly
                        className="bg-gray-700 border border-gray-600 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-200"
                      />
                      <button 
                        onClick={copyReferralCode}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                    <button className="bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-2 transition-colors">
                      Share
                    </button>
                  </div>
                  
                  {showCopiedMessage && (
                    <div className="mt-2 text-sm text-green-400">Code copied to clipboard!</div>
                  )}
                </div>
                
                {user.refferedBy && (
                  <div className="mb-6 p-4 border border-gray-700 bg-gray-750 rounded-lg shadow-md">
                    <h4 className="text-sm font-medium text-gray-400 mb-1">You were referred by</h4>
                    <div className="font-medium text-gray-200">{user.refferedBy}</div>
                  </div>
                )}
                
                <h3 className="text-lg font-medium text-gray-200 mb-4">Your Referrals</h3>
                
                {user.refferedUsers && user.refferedUsers.length > 0 ? (
                  <div className="bg-gray-750 border border-gray-700 rounded-lg overflow-hidden shadow-md">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gray-800">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            User ID
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-750 divide-y divide-gray-700">
                        {user.refferedUsers.map((userId, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                              {userId.toString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-900 text-green-300">
                                Active
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button className="text-red-400 hover:text-red-300 font-medium">View</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-gray-750 border border-gray-700 rounded-lg p-8 text-center shadow-md">
                    <Users size={40} className="text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-200 mb-1">No referrals yet</h3>
                    <p className="text-gray-400 mb-4">
                      Share your referral code with friends to start earning rewards.
                    </p>
                    <button className="bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-2 transition-colors">
                      Share Your Code
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'transactions' && (
              <div className="text-center p-8 bg-gray-750 border border-gray-700 rounded-lg shadow-md">
                <BarChart3 size={40} className="text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-200 mb-1">Transaction History</h3>
                <p className="text-gray-400">
                  Your transaction history will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;