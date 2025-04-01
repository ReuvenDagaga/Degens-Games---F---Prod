import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("https://degensgamesprod.onrender.com");
const BASE_URL = "https://degensgamesprod.onrender.com";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastBalanceUpdate, setLastBalanceUpdate] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedLastUpdate = localStorage.getItem("lastBalanceUpdate");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setLastBalanceUpdate(parseInt(storedLastUpdate || Date.now()));
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const apy = getCurrentAPY();
      const interest = user.ePvpBalance * (apy / 100) * (0.25 / (365 * 24 * 60 * 60));
      const newBalance = user.ePvpBalance + interest;
      updateUserBalance(newBalance);
    }, 250);

    return () => clearInterval(interval);
  }, [user]);

  const getCurrentAPY = () => {
    if (!user) return 0;
    let apy = 50; // base + bonuses
    const referrals = user.refferedUsers?.length || 0;
    if (referrals > 0) apy += Math.min(referrals, 50);
    return apy;
  };

  const updateUserBalance = (newBalance) => {
    if (!user) return;
    const updatedUser = { ...user, ePvpBalance: newBalance };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    socket.emit("updateBalance", { userId: user._id, ePvpBalance: newBalance });
  };

  const login = async (walletAddress, signature, message) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/login`, { walletAddress, signature, message });
      const { user, token } = res.data.data;
      setUser(user);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      console.log("[LOGIN] Phantom login success");
    } catch (err) {
      console.error("[LOGIN] Phantom error:", err);
      setError("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (googleToken) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/login`, { googleToken });
      const { user, token } = res.data.data;
      setUser(user);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      console.log("[LOGIN] Google login success");
    } catch (err) {
      console.error("[LOGIN] Google error:", err);
      setError("Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    console.log("[LOGOUT] Logged out");
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, error, login, loginWithGoogle, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;  