import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './components/LoginForm';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import NotificationSystem from './components/NotificationSystem';
import { useNotifications } from './hooks/useRealTime';
import { API_URL } from './config/api';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { notifications, addNotification, removeNotification } = useNotifications();

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('votingUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = async (credentials) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('votingUser', JSON.stringify(response.data.user));
        
        addNotification(
          'Welcome!', 
          `Successfully logged in as ${response.data.user.role}`, 
          'success'
        );
      }
    } catch (error) {
      addNotification(
        'Login Failed', 
        error.response?.data?.error || 'Login failed', 
        'error'
      );
      throw new Error(error.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('votingUser');
    addNotification('Goodbye!', 'Successfully logged out', 'info');
  };

  return (
    <div className="app">
      <div className="background-gradient"></div>
      <div className="app-container">
        <motion.header 
          className="app-header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="app-title">
            🗳️ Modern Voting System
          </h1>
          <p className="app-subtitle">Secure • Transparent • Democratic</p>
        </motion.header>

        <AnimatePresence mode="wait">
          {!user ? (
            <LoginForm 
              key="login"
              onLogin={handleLogin} 
              isLoading={isLoading} 
            />
          ) : user.role === 'admin' ? (
            <AdminDashboard 
              key="admin"
              user={user} 
              onLogout={handleLogout} 
            />
          ) : (
            <UserDashboard 
              key="user"
              user={user} 
              onLogout={handleLogout} 
            />
          )}
        </AnimatePresence>
      </div>
      
      <NotificationSystem 
        notifications={notifications} 
        onDismiss={removeNotification} 
      />
    </div>
  );
}

export default App;
