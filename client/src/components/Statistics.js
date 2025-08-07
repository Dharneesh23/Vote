import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../config/api';

const Statistics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVotes: 0,
    turnoutPercentage: 0,
    leadingCandidate: null,
    votingTrend: []
  });

  useEffect(() => {
    fetchStatistics();
    const interval = setInterval(fetchStatistics, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStatistics = async () => {
    try {
      const [resultsResponse, usersResponse] = await Promise.all([
        axios.get(`${API_URL}/results`),
        axios.get(`${API_URL}/users-count`)
      ]);

      const { candidates, totalVotes } = resultsResponse.data;
      const totalUsers = usersResponse.data.count - 1; // Exclude admin

      const leadingCandidate = candidates.reduce((prev, curr) => 
        (prev.vote_count > curr.vote_count) ? prev : curr, candidates[0]);

      setStats({
        totalUsers,
        totalVotes,
        turnoutPercentage: totalUsers > 0 ? ((totalVotes / totalUsers) * 100).toFixed(1) : 0,
        leadingCandidate,
        votingTrend: candidates
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
      <motion.div
        className="card"
        style={{
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))',
          border: '2px solid rgba(102, 126, 234, 0.3)'
        }}
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>👥</div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
          {stats.totalUsers}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.8)' }}>Registered Voters</div>
      </motion.div>

      <motion.div
        className="card"
        style={{
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(17, 153, 142, 0.2), rgba(56, 239, 125, 0.2))',
          border: '2px solid rgba(17, 153, 142, 0.3)'
        }}
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🗳️</div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#11998e' }}>
          {stats.totalVotes}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.8)' }}>Votes Cast</div>
      </motion.div>

      <motion.div
        className="card"
        style={{
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(245, 87, 108, 0.2), rgba(255, 75, 43, 0.2))',
          border: '2px solid rgba(245, 87, 108, 0.3)'
        }}
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📊</div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f5576c' }}>
          {stats.turnoutPercentage}%
        </div>
        <div style={{ color: 'rgba(255,255,255,0.8)' }}>Voter Turnout</div>
      </motion.div>

      {stats.leadingCandidate && (
        <motion.div
          className="card"
          style={{
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.2), rgba(0, 242, 254, 0.2))',
            border: '2px solid rgba(79, 172, 254, 0.3)'
          }}
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>👑</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#4facfe' }}>
            {stats.leadingCandidate.name}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
            Leading with {stats.leadingCandidate.vote_count} votes
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Statistics;
