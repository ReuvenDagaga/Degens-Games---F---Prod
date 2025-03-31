import React, { useState, useEffect, useRef } from "react";
import {
  Wallet,
  LogOut,
  User,
  TrendingUp,
  Trophy,
  BarChart,
  StarsIcon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import loginWithPhantom from "../services/solanaWallet";
import { useGoogleLogin } from "@react-oauth/google";

const Navbar = () => {
  const { user, login, loginWithGoogle, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const formatBalance = (balance) => {
    if (balance === undefined || balance === null) return "0";
    const numBalance =
      typeof balance === "string" ? parseFloat(balance) : balance;
    if (numBalance >= 1000000000)
      return `${(numBalance / 1000000000).toFixed(2)}B`;
    if (numBalance >= 1000000) return `${(numBalance / 1000000).toFixed(2)}M`;
    if (numBalance >= 10000) return numBalance.toLocaleString();
    return numBalance.toFixed(2);
  };

  const handleNavigation = (path) => {
    navigate(`/${path}`);
    setShowProfileMenu(false);
  };

  const handleConnectWallet = async () => {
    const { success, walletAddress, message, signature } =
      await loginWithPhantom();
    if (success) {
      await login(walletAddress, signature, message);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log("Google token response", tokenResponse);
        await loginWithGoogle(tokenResponse.credential);
      } catch (err) {
        console.error("Google login failed", err);
      }
    },
    onError: () => {
      alert("Google login failed");
    },
  });

  const isActive = (path) => location.pathname === `/${path}`;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-gray-900 text-white shadow-md w-full px-4 md:px-6 py-3 flex items-center justify-between border-b border-gray-800">
      <div className="flex items-center flex-shrink-0">
        <img
          src="/LOGO.png"
          alt="Logo"
          className="h-10 md:h-14 object-contain"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        />
      </div>

      <div className="hidden md:flex space-x-6 lg:space-x-10">
        {["leaderboard", "staking", "profile", "Statistics", "AI"].map(
          (path, index) => (
            <button
              key={index}
              className={`font-medium tracking-wide transition duration-300 relative group ${
                isActive(path) ? "text-red-600" : "hover:text-red-600"
              }`}
              onClick={() => handleNavigation(path)}
            >
              <span className="flex items-center">
                {path === "leaderboard" && (
                  <Trophy size={18} className="mr-2" />
                )}
                {path === "staking" && (
                  <TrendingUp size={18} className="mr-2" />
                )}
                {path === "profile" && <User size={18} className="mr-2" />}
                {path === "Statistics" && (
                  <BarChart size={18} className="mr-2" />
                )}
                {path === "AI" && <StarsIcon size={18} className="mr-2" />}
                {path.charAt(0).toUpperCase() + path.slice(1)}
              </span>
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-red-600 transition-all duration-300 ${
                  isActive(path) ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </button>
          )
        )}
      </div>

      <div className="relative">
        {user ? (
          <div className="flex items-center">
            <div className="hidden md:flex items-center mr-4 bg-gray-800 px-3 py-1.5 rounded-md border border-gray-700">
              <img src="/USDT.png" alt="USDT" className="w-5 h-5 mr-2" />
              <span className="text-green-400 font-medium">
                {user.usdtBalance}
              </span>
            </div>
            <div className="hidden md:flex items-center mr-4 bg-gray-800 px-3 py-1.5 rounded-md border border-gray-700 group relative">
              <div className="flex items-center">
                <img src="/favi.png" alt="ePVP" className="w-5 h-5 mr-2" />
                <span
                  className="font-medium text-yellow-400 truncate max-w-[120px]"
                  title={user.balance}
                >
                  {formatBalance(user.ePvpBalance)}
                </span>
              </div>
              <div className="absolute -bottom-8 left-0 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap">
                <div className="flex items-center">
                  <TrendingUp size={12} className="text-green-400 mr-1" />
                  <span className="text-green-400">70% APY</span>
                </div>
              </div>
            </div>
            <div
              className="w-10 h-10 rounded-full bg-gradient-to-r from-red-700 to-red-500 flex items-center justify-center font-bold cursor-pointer"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              {user.username?.substring(0, 2).toUpperCase() ||
                user.walletAddress?.slice(0, 2).toUpperCase() ||
                "U"}
            </div>
            {showProfileMenu && (
              <div
                ref={profileMenuRef}
                className="absolute top-12 right-0 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-2 w-48 z-10"
              >
                <div className="md:hidden border-b border-gray-700 pb-2 mb-2">
                  {["leaderboard", "staking", "profile"].map((path, index) => (
                    <button
                      key={index}
                      onClick={() => handleNavigation(path)}
                      className="flex items-center px-4 py-2 text-white hover:bg-gray-700 transition w-full text-left"
                    >
                      {path === "leaderboard" && (
                        <Trophy size={16} className="mr-2" />
                      )}
                      {path === "staking" && (
                        <TrendingUp size={16} className="mr-2" />
                      )}
                      {path === "profile" && (
                        <User size={16} className="mr-2" />
                      )}
                      <span>
                        {path.charAt(0).toUpperCase() + path.slice(1)}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="md:hidden border-b border-gray-700 pb-2 mb-2">
                  <div className="px-4 py-2 flex justify-between items-center">
                    <div className="flex items-center">
                      <img
                        src="/USDT.png"
                        alt="USDT"
                        className="w-4 h-4 mr-2"
                      />
                      <span className="text-xs">USDT:</span>
                    </div>
                    <span className="text-green-400 text-sm">
                      {user.usdtBalance}
                    </span>
                  </div>
                  <div className="px-4 py-2 flex justify-between items-center">
                    <div className="flex items-center">
                      <img
                        src="/favi.png"
                        alt="ePVP"
                        className="w-4 h-4 mr-2"
                      />
                      <span className="text-xs">ePVP:</span>
                    </div>
                    <span className="text-yellow-400 text-sm">
                      {formatBalance(user.ePvpBalance)}
                    </span>
                  </div>
                </div>
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
            <button
              onClick={handleConnectWallet}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-300"
            >
              <Wallet size={20} />
              <span className="hidden sm:inline">Connect Wallet</span>
            </button>
            <button
              onClick={googleLogin}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
            >
              <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
              <span className="hidden sm:inline">Sign in with Google</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
