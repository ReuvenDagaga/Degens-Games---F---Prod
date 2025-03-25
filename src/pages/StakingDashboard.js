import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Clock, Wallet, PlusCircle, TrendingUp, Shield, Info } from 'lucide-react';

const StakingDashboard = () => {
  const { user, getCurrentAPY } = useAuth();
  const [displayBalance, setDisplayBalance] = useState(user?.balance || 0);
  
  // עדכון הבלאנס המוצג כל רבע שנייה לאנימציה חלקה
  useEffect(() => {
    if (!user) return;
    
    // עדכון ראשוני של הבלאנס המוצג
    setDisplayBalance(user.ePvpBalance);
    
    // אינטרוול לעדכון תצוגת הבלאנס
    const interval = setInterval(() => {
      setDisplayBalance(user.ePvpBalance);
    }, 250);
    
    return () => clearInterval(interval);
  }, [user]);
  
  // חישוב רכיבי ה-APY
  const baseAPY = 30; // בסיסי
  const onlineAPY = 20; // מחובר
  const referralAPY = Math.min(user?.refferedUsers?.length || 0, 50); // הפניות, מוגבל ל-50
  const usdtAPY = 20; // נניח שיש מספיק USDT
  const currentAPY = getCurrentAPY();
  
  // פורמט מספרים עם 2 ספרות אחרי הנקודה
  const formatNumber = (num) => {
    return num.toLocaleString(undefined, { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  // פורמט אחוזי APY
  const formatAPY = (apy) => {
    return `${apy}%`;
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-900">
        <div className="text-xl text-gray-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden border border-gray-800">
      <div className="p-6 bg-gradient-to-r from-gray-800 to-gray-900">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">ePVP Staking</h2>
        <p className="text-gray-400">Earn rewards on your ePVP tokens automatically</p>
      </div>
      
      {/* תצוגת בלאנס ראשי */}
      <div className="p-6 bg-gradient-to-b from-gray-800 to-gray-900 border-t border-b border-gray-800">
        <div className="flex flex-col items-center justify-center py-6">
          <div className="relative mb-2">
            <div className="text-sm text-gray-400 mb-1 text-center">Your ePVP Balance</div>
            <div className="flex items-center justify-center">
              <img src="/favi.png" alt="ePVP" className="w-14 h-14 mr-4" />
              <div className="text-4xl font-bold text-yellow-400 tracking-tight">
                {formatNumber(displayBalance)}
              </div>
            </div>
            <div className="absolute -top-1 -right-1">
              <div className="animate-pulse flex">
                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-green-400 flex items-center mt-1 bg-gray-800 px-3 py-1 rounded-full">
            <TrendingUp size={14} className="mr-1" />
            <span>APY: {formatAPY(currentAPY)}</span>
          </div>
          
          <div className="w-full mt-8">
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-yellow-400" 
                style={{ width: `${Math.min(100, currentAPY / 2)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* פירוט רכיבי ה-APY */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-100 mb-4">Your APY Breakdown</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* APY בסיסי */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center">
            <div className="w-10 h-10 rounded-full bg-red-900 flex items-center justify-center mr-4">
              <Shield size={20} className="text-red-400" />
            </div>
            <div className="flex-1">
              <div className="text-gray-400 text-sm">Base APY</div>
              <div className="flex justify-between items-center">
                <div className="text-lg font-medium text-gray-100">{formatAPY(baseAPY)}</div>
                <div className="text-xs text-gray-500">Always active</div>
              </div>
            </div>
          </div>
          
          {/* APY להיות מחובר */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-900 flex items-center justify-center mr-4">
              <Clock size={20} className="text-green-400" />
            </div>
            <div className="flex-1">
              <div className="text-gray-400 text-sm">Online Bonus</div>
              <div className="flex justify-between items-center">
                <div className="text-lg font-medium text-gray-100">{formatAPY(onlineAPY)}</div>
                <div className="text-xs px-2 py-1 bg-green-900 text-green-400 rounded-full">
                  Active
                </div>
              </div>
            </div>
          </div>
          
          {/* APY מהפניות */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center mr-4">
              <Users size={20} className="text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="text-gray-400 text-sm">Referral APY</div>
              <div className="flex justify-between items-center">
                <div className="text-lg font-medium text-gray-100">{formatAPY(referralAPY)}</div>
                <div className="text-xs text-gray-500">
                  {user.refferedUsers?.length || 0}/50 referrals
                </div>
              </div>
              <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500" 
                  style={{ width: `${((user.refferedUsers?.length || 0) / 50) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* APY מבלאנס USDT */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-900 flex items-center justify-center mr-4">
              <Wallet size={20} className="text-green-400" />
            </div>
            <div className="flex-1">
              <div className="text-gray-400 text-sm">USDT Balance Bonus</div>
              <div className="flex justify-between items-center">
                <div className="text-lg font-medium text-gray-100">{formatAPY(usdtAPY)}</div>
                <div className="text-xs px-2 py-1 bg-green-900 text-green-400 rounded-full">
                  Active
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* תצוגת APY כולל */}
        <div className="bg-gray-750 rounded-lg p-4 border border-gray-700 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-gray-400 text-sm">Total APY</div>
              <div className="text-2xl font-bold text-yellow-400">{formatAPY(currentAPY)}</div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-sm text-gray-400">Estimated Daily</div>
              <div className="text-lg font-medium text-green-400">
                +{formatNumber((displayBalance * (currentAPY / 100)) / 365)} ePVP
              </div>
            </div>
          </div>
        </div>
        
        {/* הגדלת ה-APY */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-750 rounded-lg p-5 border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100 mb-3">Boost Your APY</h3>
          
          <div className="space-y-4">
            {(user.refferedUsers?.length || 0) < 50 && (
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-red-500 cursor-pointer transition-colors">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center mr-3">
                    <Users size={18} className="text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-200">Invite Friends</div>
                    <div className="text-xs text-gray-400">+1% APY per referral</div>
                  </div>
                </div>
                <button className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition-colors flex items-center">
                  <PlusCircle size={14} className="mr-1" />
                  Invite
                </button>
              </div>
            )}
            
            {/* נניח שאין מספיק USDT, נוכל להפעיל את הבלוק הבא */}
            {/* אם יש כבר מספיק USDT, נסתיר אותו */}
            {false && (
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-red-500 cursor-pointer transition-colors">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-900 flex items-center justify-center mr-3">
                    <Wallet size={18} className="text-green-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-200">Deposit USDT</div>
                    <div className="text-xs text-gray-400">+20% APY with 10+ USDT balance</div>
                  </div>
                </div>
                <button className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition-colors flex items-center">
                  <PlusCircle size={14} className="mr-1" />
                  Deposit
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* מידע */}
        <div className="mt-6 text-sm text-gray-400 flex items-start p-4 bg-gray-800 rounded-lg border border-gray-700">
          <Info size={18} className="text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
          <p>
            Your ePVP balance is automatically staked and generates rewards in real-time. 
            The more you participate in the platform, the higher your APY. Rewards are 
            calculated and added to your balance every quarter second.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StakingDashboard;