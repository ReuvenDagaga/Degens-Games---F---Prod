import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("https://degensgamesprod.onrender.com");

const AuthContext = createContext({
  user: null,
  setUser: (user) => {},
  token: null,
  isLoading: false,
  error: null,
  login: async (walletAddress, signature, message) => {},
  loginWithGoogle: async (googleToken) => {},
  register: async () => {},
  logout: () => {},
  clearError: () => {},
  updateUserBalance: (newBalance) => {},
  getCurrentAPY: () => 0,
});

export const useAuth = () => useContext(AuthContext);

const BASE_URL = "https://degensgamesprod.onrender.com";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastBalanceUpdate, setLastBalanceUpdate] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedLastBalanceUpdate = localStorage.getItem("lastBalanceUpdate");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));

      if (storedLastBalanceUpdate) {
        setLastBalanceUpdate(parseInt(storedLastBalanceUpdate));
      } else {
        setLastBalanceUpdate(Date.now());
        localStorage.setItem("lastBalanceUpdate", Date.now().toString());
      }
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const calculateInterest = () => {
      if (!user) return 0;
      const currentAPY = getCurrentAPY();
      const quarterSecondAsYearFraction = 0.25 / (365 * 24 * 60 * 60);
      const interest =
        user.ePvpBalance * (currentAPY / 100) * quarterSecondAsYearFraction;
      return interest;
    };

    const updateBalanceBasedOnTime = () => {
      if (!lastBalanceUpdate || !user) return;
      const currentTime = Date.now();
      const timeDiff = currentTime - lastBalanceUpdate;

      if (timeDiff >= 250) {
        const secondsElapsed = timeDiff / 1000;
        const yearFraction = secondsElapsed / (365 * 24 * 60 * 60);
        const currentAPY = getCurrentAPY();
        const interest = user.ePvpBalance * (currentAPY / 100) * yearFraction;
        const newBalance = user.ePvpBalance + interest;
        updateUserBalance(newBalance);
        setLastBalanceUpdate(currentTime);
        localStorage.setItem("lastBalanceUpdate", currentTime.toString());
      }
    };

    updateBalanceBasedOnTime();

    const intervalId = setInterval(() => {
      if (user) {
        const interest = calculateInterest();
        const newBalance = user.ePvpBalance + interest;
        updateUserBalance(newBalance);
        const currentTime = Date.now();
        setLastBalanceUpdate(currentTime);
        localStorage.setItem("lastBalanceUpdate", currentTime.toString());
      }
    }, 250);

    return () => clearInterval(intervalId);
  }, [user, lastBalanceUpdate]);

  const getCurrentAPY = () => {
    if (!user) return 0;

    let totalAPY = 0;
    totalAPY += 30;
    totalAPY += 20;
    const referralCount = user.refferedUsers?.length || 0;
    totalAPY += Math.min(referralCount, 50);
    const hasEnoughUSDT = true;
    if (hasEnoughUSDT) {
      totalAPY += 20;
    }
    return totalAPY;
  };

  const updateUserBalance = async (newBalance) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      ePvpBalance: newBalance,
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    socket.emit("updateBalance", {
      userId: user._id,
      ePvpBalance: newBalance,
    });
  };

  const login = async (walletAddress, signature, message) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${BASE_URL}/api/login`, {
        walletAddress,
        signature,
        message,
      });
      const { user, token } = response.data.data;
      setUser(user);
      setToken(token);
      const currentTime = Date.now();
      setLastBalanceUpdate(currentTime);
      localStorage.setItem("lastBalanceUpdate", currentTime.toString());
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (err) {
      const errorMessage = err.message || "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (googleToken) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/login`,
        { googleToken },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Login response:", response.data);
      const { user, token } = response.data.data;
      setUser(user);
      setToken(token);
      const currentTime = Date.now();
      setLastBalanceUpdate(currentTime);
      localStorage.setItem("lastBalanceUpdate", currentTime.toString());
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (err) {
      const errorMessage =
        err.message || "Google login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setLastBalanceUpdate(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("lastBalanceUpdate");
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    setUser,
    token,
    isLoading,
    error,
    login,
    loginWithGoogle,
    logout,
    clearError,
    updateUserBalance,
    getCurrentAPY,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
