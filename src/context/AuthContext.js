import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context with default values and additional balance-related functions
const AuthContext = createContext({
  user: null,
  setUser: (user) => {},
  token: null,
  isLoading: false,
  error: null,
  login: async (walletAddress, signature, message) => {},
  register: async () => {},
  logout: () => {},
  clearError: () => {},
  updateUserBalance: (newBalance) => {},
  getCurrentAPY: () => 0,
});

// הוספנו את useAuth שהיה חסר - זה ה-hook שמשתמש בקונטקסט
export const useAuth = () => useContext(AuthContext);

const BASE_URL = "https://nb5wb7tn-3456.euw.devtunnels.ms";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastBalanceUpdate, setLastBalanceUpdate] = useState(null);
 
  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedLastBalanceUpdate = localStorage.getItem('lastBalanceUpdate');
   
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      
      if (storedLastBalanceUpdate) {
        setLastBalanceUpdate(parseInt(storedLastBalanceUpdate));
      } else {
        // אם אין תאריך עדכון בלאנס, נשתמש בזמן הנוכחי
        setLastBalanceUpdate(Date.now());
        localStorage.setItem('lastBalanceUpdate', Date.now().toString());
      }
    }
  }, []);

  // עדכון הבלאנס בזמן אמת כל רבע שנייה
  useEffect(() => {
    if (!user) return;

    // פונקציה שמחשבת את הריבית לפי הAPY
    const calculateInterest = () => {
      if (!user) return 0;
      
      const currentAPY = getCurrentAPY();
      
      // חישוב ריבית לרבע שנייה לפי APY שנתי
      const quarterSecondAsYearFraction = 0.25 / (365 * 24 * 60 * 60);
      const interest = user.ePvpBalance * (currentAPY / 100) * quarterSecondAsYearFraction;
      
      return interest;
    };

    // עדכון הבלאנס על סמך הזמן שעבר מאז העדכון האחרון
    const updateBalanceBasedOnTime = () => {
      if (!lastBalanceUpdate || !user) return;
      
      const currentTime = Date.now();
      const timeDiff = currentTime - lastBalanceUpdate;
      
      if (timeDiff >= 250) { // יותר מרבע שנייה
        const secondsElapsed = timeDiff / 1000;
        const yearFraction = secondsElapsed / (365 * 24 * 60 * 60);
        const currentAPY = getCurrentAPY();
        const interest = user.ePvpBalance * (currentAPY / 100) * yearFraction;
        
        // עדכון הבלאנס
        const newBalance = user.ePvpBalance + interest;
        updateUserBalance(newBalance);
        
        // עדכון זמן העדכון האחרון
        setLastBalanceUpdate(currentTime);
        localStorage.setItem('lastBalanceUpdate', currentTime.toString());
      }
    };

    // קריאה לפונקציית עדכון בלאנס על סמך זמן בטעינה ראשונית
    updateBalanceBasedOnTime();    

    // קביעת אינטרוול לעדכון בלאנס כל רבע שנייה
    const intervalId = setInterval(() => {
      if (user) {
        const interest = calculateInterest();
        const newBalance = user.ePvpBalance + interest;
        updateUserBalance(newBalance);
        
        const currentTime = Date.now();
        setLastBalanceUpdate(currentTime);
        localStorage.setItem('lastBalanceUpdate', currentTime.toString());
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
      ePvpBalance: newBalance
    };
    setUser(updatedUser);
    
    localStorage.setItem('user', JSON.stringify(updatedUser));

    const response = await axios.put(`${BASE_URL}/api/${user._id}`, updatedUser);
    console.log(response);
    
    
  };

  const login = async (walletAddress, signature, message) => {
    setIsLoading(true);
    setError(null);
   
    try {      
      const response = await axios.post(`${BASE_URL}/api/login`, { walletAddress, signature, message });
      const { user, token } = response.data.data;
      setUser(user);
      setToken(token);
      
      // הגדרת זמן העדכון האחרון לזמן הנוכחי
      const currentTime = Date.now();
      setLastBalanceUpdate(currentTime);
      localStorage.setItem('lastBalanceUpdate', currentTime.toString());
     
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
     
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
 
  const logout = () => {
    // Remove user data from state
    setUser(null);
    setToken(null);
    setLastBalanceUpdate(null);
   
    // Remove from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('lastBalanceUpdate');
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
    logout,
    clearError,
    updateUserBalance,
    getCurrentAPY
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;