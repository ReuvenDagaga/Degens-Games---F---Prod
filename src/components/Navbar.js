// ===== frontend/components/Navbar.js =====
import React, { useState, useEffect, useRef } from "react";
import {
  Wallet,
  LogOut,
  User,
  TrendingUp,
  Trophy,
  BarChart,
  Star,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import loginWithPhantom from "../services/solanaWallet";
import { GoogleLogin } from "@react-oauth/google";

const Navbar = () => {
  const { user, login, loginWithGoogle, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(`/${path}`);
    setShowProfileMenu(false);
  };

  const handleConnectWallet = async () => {
    const { success, walletAddress, message, signature } =
      await loginWithPhantom();
    if (success) {
      console.log("[NAVBAR] Phantom wallet connected:", walletAddress);
      await login(walletAddress, signature, message);
    }
  };

  const formatBalance = (balance) => {
    if (!balance) return "0";
    if (balance >= 1_000_000_000)
      return `${(balance / 1_000_000_000).toFixed(2)}B`;
    if (balance >= 1_000_000)
      return `${(balance / 1_000_000).toFixed(2)}M`;
    if (balance >= 10_000) return balance.toLocaleString();
    return balance.toFixed(2);
  };

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

  const navItems = [
    { label: "Leaderboard", icon: <Trophy size={16} />, path: "leaderboard" },
    { label: "Staking", icon: <TrendingUp size={16} />, path: "staking" },
    { label: "Statistics", icon: <BarChart size={16} />, path: "statistics" },
    { label: "AI", icon: <Star size={16} />, path: "ai" },
  ];

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 flex justify-between items-center border-b border-gray-700">
      {/* Logo */}
      <img
        src="/LOGO.png"
        alt="Logo"
        className="h-10 cursor-pointer"
        onClick={() => navigate("/")}
      />

      {/* Desktop nav buttons */}
      <div className="hidden md:flex space-x-6">
        {navItems.map(({ label, icon, path }) => (
          <button
            key={path}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all ${
              isActive(path) ? "text-red-500 bg-gray-800" : "hover:text-red-500"
            }`}
            onClick={() => handleNavigation(path)}
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Right section: user/auth */}
      <div className="relative ml-4">
        {user ? (
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Balances – desktop only */}
            <div className="hidden md:flex items-center bg-gray-800 px-3 py-1.5 rounded-md border border-gray-700">
              <img src="/USDT.png" alt="USDT" className="w-5 h-5 mr-2" />
              <span className="text-green-400 font-medium">
                {user.usdtBalance}
              </span>
            </div>
            <div className="hidden md:flex items-center bg-gray-800 px-3 py-1.5 rounded-md border border-gray-700">
              <img src="/favi.png" alt="ePVP" className="w-5 h-5 mr-2" />
              <span className="text-yellow-400 font-medium">
                {formatBalance(user.ePvpBalance)}
              </span>
            </div>

            {/* Profile icon */}
            <div
              className="w-10 h-10 rounded-full bg-gradient-to-r from-red-700 to-red-500 flex items-center justify-center font-bold cursor-pointer"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              {user.username?.slice(0, 2).toUpperCase() || "U"}
            </div>

            {/* Profile Menu */}
            {showProfileMenu && (
              <div
                ref={profileMenuRef}
                className="absolute right-0 top-12 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-2 z-50"
              >
                {/* Nav links for small screen */}
                <div className="md:hidden">
                  {navItems.map(({ label, icon, path }) => (
                    <button
                      key={path}
                      onClick={() => handleNavigation(path)}
                      className="flex items-center px-4 py-2 text-white hover:bg-gray-700 w-full text-left"
                    >
                      {icon}
                      <span className="ml-2">{label}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleNavigation("profile")}
                  className="flex items-center px-4 py-2 text-white hover:bg-gray-700 w-full text-left"
                >
                  <User size={16} className="mr-2" /> Profile
                </button>
                <button
                  onClick={logout}
                  className="flex items-center px-4 py-2 text-white hover:bg-gray-700 w-full text-left"
                >
                  <LogOut size={16} className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            {/* Connect Wallet button */}
            <button
              onClick={handleConnectWallet}
              className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-md p-2 sm:px-4 sm:py-2"
            >
              <Wallet size={20} />
              <span className="hidden sm:inline ml-2">Connect Wallet</span>
            </button>

            {/* Google button mimic – same style */}
            <div className="flex items-center justify-center bg-white text-black rounded-md p-2 sm:px-4 sm:py-2">
              <GoogleLogin
                onSuccess={({ credential }) => {
                  if (credential) {
                    console.log("[NAVBAR] Google token received");
                    loginWithGoogle(credential);
                  }
                }}
                onError={() => console.error("[NAVBAR] Google login failed")}
                useOneTap={false}
                theme="outline"
                shape="circle"
                size="medium"
                text="signin_with"
                width="100"
                logo_alignment="center"
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
