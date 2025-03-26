import React, { useState, useEffect, useRef } from 'react';
import { Wallet, LogOut, User, TrendingUp, Trophy, BarChart, StarsIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import loginWithPhantom from '../services/solanaWallet';

const Navbar = () => {
  const { user, login, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Helper function to format large numbers nicely
  const formatBalance = (balance) => {
    if (balance === undefined || balance === null) return '0';
    
    // Convert to number if it's a string
    const numBalance = typeof balance === 'string' ? parseFloat(balance) : balance;
    
    // For numbers larger than 1 million
    if (numBalance >= 1000000) {
      if (numBalance >= 1000000000) {
        // For billions
        return `${(numBalance / 1000000000).toFixed(2)}B`;
      }
      // For millions
      return `${(numBalance / 1000000).toFixed(2)}M`;
    }
    
    // For large numbers but less than a million
    if (numBalance >= 10000) {
      return numBalance.toLocaleString();
    }
    
    // For small numbers, show up to 2 decimal places
    return numBalance.toFixed(2);
  };
  
  const handleNavigation = (path) => {
    navigate(`/${path}`);
    setShowProfileMenu(false);
  };
  
  const handleConnectWallet = async () => {
    const { success, walletAddress, message, signature } = await loginWithPhantom();
    if (success) {
      await login(walletAddress, signature, message);
    }
  };
  
  // Check if a navigation item is active
  const isActive = (path) => {
    return location.pathname === `/${path}`;
  };
  
  // Handle clicks outside the profile menu to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  return (
    <nav className="bg-gray-900 text-white shadow-md w-full px-4 md:px-6 py-3 flex items-center justify-between border-b border-gray-800">
      {/* Logo on the left - Responsive adjustments */}
      <div className="flex items-center flex-shrink-0">
        <img 
          src="/LOGO.png" 
          alt="Logo" 
          className="h-10 md:h-14 object-contain"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        />
      </div>
      
      {/* Navigation buttons in center - Hidden on small screens */}
      <div className="hidden md:flex space-x-6 lg:space-x-10">
        <button 
          className={`font-medium tracking-wide transition duration-300 relative group ${
            isActive('leaderboard') ? 'text-red-600' : 'hover:text-red-600'
          }`}
          onClick={() => handleNavigation('leaderboard')}
        >
          <span className="flex items-center">
            <Trophy size={18} className="mr-2" />
            Leaderboard
          </span>
          <span className={`absolute bottom-0 left-0 h-0.5 bg-red-600 transition-all duration-300 ${
            isActive('leaderboard') ? 'w-full' : 'w-0 group-hover:w-full'
          }`}></span>
        </button>
        
        <button 
          className={`font-medium tracking-wide transition duration-300 relative group ${
            isActive('staking') ? 'text-red-600' : 'hover:text-red-600'
          }`}
          onClick={() => handleNavigation('staking')}
        >
          <span className="flex items-center">
            <TrendingUp size={18} className="mr-2" />
            Staking
          </span>
          <span className={`absolute bottom-0 left-0 h-0.5 bg-red-600 transition-all duration-300 ${
            isActive('staking') ? 'w-full' : 'w-0 group-hover:w-full'
          }`}></span>
        </button>
        
        <button 
          className={`font-medium tracking-wide transition duration-300 relative group ${
            isActive('profile') ? 'text-red-600' : 'hover:text-red-600'
          }`}
          onClick={() => handleNavigation('profile')}
        >
          <span className="flex items-center">
            <User size={18} className="mr-2" />
            Profile
          </span>
          <span className={`absolute bottom-0 left-0 h-0.5 bg-red-600 transition-all duration-300 ${
            isActive('profile') ? 'w-full' : 'w-0 group-hover:w-full'
          }`}></span>
        </button>
        <button 
          className={`font-medium tracking-wide transition duration-300 relative group ${
            isActive('Statistics') ? 'text-red-600' : 'hover:text-red-600'
          }`}
          onClick={() => handleNavigation('Statistics')}
        >
          <span className="flex items-center">
            <BarChart size={18} className="mr-2" />
            Statistics
          </span>
          <span className={`absolute bottom-0 left-0 h-0.5 bg-red-600 transition-all duration-300 ${
            isActive('Statistics') ? 'w-full' : 'w-0 group-hover:w-full'
          }`}></span>
        </button>
        <button 
          className={`font-medium tracking-wide transition duration-300 relative group ${
            isActive('AI') ? 'text-red-600' : 'hover:text-red-600'
          }`}
          onClick={() => handleNavigation('AI')}
        >
          <span className="flex items-center">
            <StarsIcon size={18} className="mr-2" />
            AI
          </span>
          <span className={`absolute bottom-0 left-0 h-0.5 bg-red-600 transition-all duration-300 ${
            isActive('AI') ? 'w-full' : 'w-0 group-hover:w-full'
          }`}></span>
        </button>
      </div>
      
      {/* Profile or button on the right */}
      <div className="relative">
        {user ? (
          <div className="flex items-center">
            {/* USDT Balance - Hidden on small screens */}
            <div className="hidden md:flex items-center mr-4 bg-gray-800 px-3 py-1.5 rounded-md border border-gray-700">
              <img 
                src="/USDT.png" 
                alt="USDT" 
                className="w-5 h-5 mr-2"
              />
              <span className="text-green-400 font-medium">
                {user.usdtBalance}
              </span>
            </div>
            
            {/* ePVP Balance - Hidden on small screens */}
            <div className="hidden md:flex items-center mr-4 bg-gray-800 px-3 py-1.5 rounded-md border border-gray-700 group relative">
              <div className="flex items-center">
                <img 
                  src="/favi.png" 
                  alt="ePVP" 
                  className="w-5 h-5 mr-2"
                />
                <span className="font-medium text-yellow-400 truncate max-w-[120px]" title={user.balance}>
                  {formatBalance(user.ePvpBalance)}
                </span>
              </div>
              
              {/* תג ה-APY שמופיע בעת מעבר עכבר */}
              <div className="absolute -bottom-8 left-0 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap">
                <div className="flex items-center">
                  <TrendingUp size={12} className="text-green-400 mr-1" />
                  <span className="text-green-400">70% APY</span>
                </div>
              </div>
            </div>
            
            {/* Profile Button - Always visible */}
            <div 
              className="w-10 h-10 rounded-full bg-gradient-to-r from-red-700 to-red-500 flex items-center justify-center font-bold cursor-pointer"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              {user.username?.substring(0, 2).toUpperCase() || user.walletAddress?.slice(0, 2).toUpperCase() || "U"}
            </div>
            
            {/* Profile Popup Menu */}
            {showProfileMenu && (
              <div 
                ref={profileMenuRef}
                className="absolute top-12 right-0 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-2 w-48 z-10"
              >
                {/* On mobile, show navigation options in the dropdown */}
                <div className="md:hidden border-b border-gray-700 pb-2 mb-2">
                  <button 
                    onClick={() => handleNavigation('leaderboard')} 
                    className="flex items-center px-4 py-2 text-white hover:bg-gray-700 transition w-full text-left"
                  >
                    <Trophy size={16} className="mr-2" />
                    <span>Leaderboard</span>
                  </button>
                  <button 
                    onClick={() => handleNavigation('staking')} 
                    className="flex items-center px-4 py-2 text-white hover:bg-gray-700 transition w-full text-left"
                  >
                    <TrendingUp size={16} className="mr-2" />
                    <span>Staking</span>
                  </button>
                  <button 
                    onClick={() => handleNavigation('profile')} 
                    className="flex items-center px-4 py-2 text-white hover:bg-gray-700 transition w-full text-left"
                  >
                    <User size={16} className="mr-2" />
                    <span>Profile</span>
                  </button>
                </div>
                
                {/* Balance info on mobile */}
                <div className="md:hidden border-b border-gray-700 pb-2 mb-2">
                  <div className="px-4 py-2 flex justify-between items-center">
                    <div className="flex items-center">
                      <img src="/USDT.png" alt="USDT" className="w-4 h-4 mr-2" />
                      <span className="text-xs">USDT:</span>
                    </div>
                    <span className="text-green-400 text-sm">{user.usdtBalance}</span>
                  </div>
                  <div className="px-4 py-2 flex justify-between items-center">
                    <div className="flex items-center">
                      <img src="/favi.png" alt="ePVP" className="w-4 h-4 mr-2" />
                      <span className="text-xs">ePVP:</span>
                    </div>
                    <span className="text-yellow-400 text-sm">{formatBalance(user.ePvpBalance)}</span>
                  </div>
                </div>
                
                {/* Logout button */}
                <button 
                  onClick={logout} 
                  className="flex items-center px-4 py-2 text-white hover:bg-gray-700 transition w-full text-left"
                >
                  <LogOut size={16} className="mr-2" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleConnectWallet}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-300"
          >
            <Wallet size={20} />
            <span className="hidden sm:inline">Connect Wallet</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;