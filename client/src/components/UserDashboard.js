import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { playSound, triggerHaptic, createConfetti } from '../utils/effects';
import { API_URL, UPLOADS_URL } from '../config/api';

const UserDashboard = ({ user, onLogout }) => {
  const [candidates, setCandidates] = useState([]);
  const [voteStatus, setVoteStatus] = useState({ hasVoted: false, vote: null });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    fetchCandidates();
    checkVoteStatus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(`${API_URL}/candidates`);
      setCandidates(response.data);
    } catch (error) {
      showMessage('Error fetching candidates', 'error');
    }
  };

  const checkVoteStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/vote-status/${user.id}`);
      setVoteStatus(response.data);
    } catch (error) {
      showMessage('Error checking vote status', 'error');
    }
  };

  const handleVote = async (candidateId) => {
    if (voteStatus.hasVoted) {
      showMessage('You have already voted!', 'error');
      playSound('error');
      triggerHaptic('error');
      return;
    }

    const candidate = candidates.find(c => c.id === candidateId);
    if (!window.confirm(`Are you sure you want to vote for ${candidate.name}? You can only vote once.`)) {
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/vote`, {
        userId: user.id,
        candidateId: candidateId
      });
      
      // Success effects
      playSound('vote');
      triggerHaptic('success');
      createConfetti();
      
      showMessage('Your vote has been recorded successfully!', 'success');
      checkVoteStatus();
      fetchCandidates(); // Refresh to show updated vote counts
    } catch (error) {
      playSound('error');
      triggerHaptic('error');
      showMessage(error.response?.data?.error || 'Error casting vote', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  return (
    <motion.div
      className="user-dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="card" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '5px' }}>🗳️ Voting Portal</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Welcome, {user.username}</p>
          </div>
          <button onClick={onLogout} className="btn btn-secondary">
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Messages */}
      <AnimatePresence>
        {message && (
          <motion.div
            className={`alert alert-${messageType}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voting Status */}
      {voteStatus.hasVoted ? (
        <motion.div
          className="card"
          style={{
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(17, 153, 142, 0.2), rgba(56, 239, 125, 0.2))',
            border: '2px solid rgba(17, 153, 142, 0.5)',
            marginBottom: '30px'
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '15px', color: '#11998e' }}>
            Thank You for Voting!
          </h3>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.8)' }}>
            You have successfully voted for{' '}
            <strong style={{ color: '#11998e' }}>
              {voteStatus.vote?.candidate_name || 'your candidate'}
            </strong>
          </p>
          <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '10px' }}>
            You can only vote once. Thank you for participating in the democratic process!
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="card"
          style={{ marginBottom: '30px' }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 style={{ 
            textAlign: 'center', 
            fontSize: '1.5rem', 
            marginBottom: '10px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🎯 Select Your Candidate
          </h3>
          <p style={{ 
            textAlign: 'center', 
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '1rem'
          }}>
            Choose wisely - you can only vote once!
          </p>
        </motion.div>
      )}

      {/* Candidates Grid */}
      <div className="card">
        {candidates.length === 0 ? (
          <motion.div
            style={{ textAlign: 'center', padding: '40px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📋</div>
            <h3 style={{ marginBottom: '10px' }}>No Candidates Available</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Please wait for the admin to add candidates.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-3">
            {candidates.map((candidate, index) => (
              <motion.div
                key={candidate.id}
                className="card"
                style={{
                  textAlign: 'center',
                  background: voteStatus.hasVoted 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  opacity: voteStatus.hasVoted ? 0.7 : 1,
                  cursor: voteStatus.hasVoted ? 'not-allowed' : 'pointer'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: voteStatus.hasVoted ? 0.7 : 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={!voteStatus.hasVoted ? { 
                  scale: 1.05,
                  boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)'
                } : {}}
              >
                <motion.img
                  src={candidate.photo_path ? `${UPLOADS_URL}/${candidate.photo_path}` : '/default-avatar.png'}
                  alt={candidate.name}
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    margin: '0 auto 20px',
                    border: '4px solid rgba(255, 255, 255, 0.3)'
                  }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                />
                
                <h4 style={{ 
                  fontSize: '1.3rem', 
                  marginBottom: '8px',
                  background: 'linear-gradient(135deg, #ffffff, #e0e7ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {candidate.name}
                </h4>
                
                <p style={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  marginBottom: '20px',
                  fontSize: '1rem'
                }}>
                  📍 {candidate.position}
                </p>

                <div style={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  display: 'inline-block',
                  marginBottom: '20px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  🗳️ {candidate.votes} votes
                </div>

                {!voteStatus.hasVoted && (
                  <motion.button
                    onClick={() => handleVote(candidate.id)}
                    className="btn btn-success"
                    style={{ 
                      width: '100%',
                      fontSize: '1rem',
                      padding: '12px'
                    }}
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner"></span>
                        Voting...
                      </>
                    ) : (
                      <>
                        ✅ Vote for {candidate.name}
                      </>
                    )}
                  </motion.button>
                )}

                {voteStatus.hasVoted && voteStatus.vote?.candidate_id === candidate.id && (
                  <motion.div
                    style={{
                      background: 'linear-gradient(135deg, #11998e, #38ef7d)',
                      padding: '12px',
                      borderRadius: '8px',
                      fontWeight: 'bold'
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    ✅ Your Vote
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <motion.div
        className="card"
        style={{ 
          marginTop: '30px',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.05)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
          🔒 Your vote is secure and anonymous • 🗳️ One vote per user • ✨ Results updated in real-time
        </p>
      </motion.div>
    </motion.div>
  );
};

export default UserDashboard;
