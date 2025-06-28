import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    if (authService.isAuthenticated()) {
      setUser(authService.getUser());
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const userData = await authService.login(username, password);
      setUser(authService.getUser());
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: authService.isAuthenticated(),
    canEdit: () => authService.canEdit(),
    canView: () => authService.canView(),
  };

  if (loading) {
    return <LoadingSpinner message="Initializing application..." />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
