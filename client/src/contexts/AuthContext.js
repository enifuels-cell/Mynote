import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import syncService from '../services/syncService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      const userData = JSON.parse(storedUser);
      syncService.startAutoSync(userData.userId);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      // Simple hash for demo (use proper hashing in production)
      const passwordHash = btoa(password);
      const response = await authAPI.login({ username, passwordHash });
      const userData = response.data;
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      syncService.startAutoSync(userData.userId);
      
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  };

  const register = async (email, username, password) => {
    try {
      const passwordHash = btoa(password);
      const response = await authAPI.register({ email, username, passwordHash });
      const userData = response.data;
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      syncService.startAutoSync(userData.userId);
      
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    syncService.stopAutoSync();
  };

  const updatePreferences = async (preferences) => {
    try {
      const response = await authAPI.updatePreferences(user.userId, preferences);
      const updatedUser = { ...user, preferences: response.data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updatePreferences }}>
      {children}
    </AuthContext.Provider>
  );
};
