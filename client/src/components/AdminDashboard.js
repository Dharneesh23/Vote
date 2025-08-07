import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Statistics from './Statistics';
import { API_URL, UPLOADS_URL } from '../config/api';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('candidates');
  const [candidates, setCandidates] = useState([]);
  const [results, setResults] = useState({ candidates: [], totalVotes: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Form states
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    position: '',
    photo: null
  });
  const [photoPreview, setPhotoPreview] = useState('');

  useEffect(() => {
    fetchCandidates();
    fetchResults();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(`${API_URL}/candidates`);
      setCandidates(response.data);
    } catch (error) {
      showMessage('Error fetching candidates', 'error');
    }
  };

  const fetchResults = async () => {
    try {
      const response = await axios.get(`${API_URL}/results`);
      setResults(response.data);
    } catch (error) {
      showMessage('Error fetching results', 'error');
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    
    if (!newCandidate.name || !newCandidate.position || !newCandidate.photo) {
      showMessage('Please fill in all fields and select a photo', 'error');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('name', newCandidate.name);
    formData.append('position', newCandidate.position);
    formData.append('photo', newCandidate.photo);

    try {
      await axios.post(`${API_URL}/candidates`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setNewCandidate({ name: '', position: '', photo: null });
      setPhotoPreview('');
      showMessage('Candidate added successfully!', 'success');
      fetchCandidates();
      fetchResults();
    } catch (error) {
      showMessage(error.response?.data?.error || 'Error adding candidate', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await axios.delete(`${API_URL}/candidates/${candidateId}`);
        showMessage('Candidate deleted successfully!', 'success');
        fetchCandidates();
        fetchResults();
      } catch (error) {
        showMessage('Error deleting candidate', 'error');
      }
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCandidate({ ...newCandidate, photo: file });
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target.result);
      reader.readAsDataURL(file);
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
      className="admin-dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="card" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '5px' }}>👨‍💼 Admin Dashboard</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Welcome, {user.username}</p>
          </div>
          <button onClick={onLogout} className="btn btn-secondary">
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`btn ${activeTab === 'candidates' ? 'btn-primary' : 'btn-secondary'}`}
          >
            👥 Manage Candidates
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`btn ${activeTab === 'results' ? 'btn-primary' : 'btn-secondary'}`}
          >
            � Vote Results
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`btn ${activeTab === 'analytics' ? 'btn-primary' : 'btn-secondary'}`}
          >
            🔍 Analytics
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

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="card">
              <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>📊 Real-time Dashboard</h3>
              <Statistics />
            </div>
          </motion.div>
        )}

        {activeTab === 'candidates' && (
          <motion.div
            key="candidates"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Add Candidate Form */}
            <div className="card" style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>➕ Add New Candidate</h3>
              <form onSubmit={handleAddCandidate}>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Candidate Name</label>
                    <input
                      type="text"
                      value={newCandidate.name}
                      onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                      className="form-input"
                      placeholder="Enter candidate name"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Position</label>
                    <input
                      type="text"
                      value={newCandidate.position}
                      onChange={(e) => setNewCandidate({ ...newCandidate, position: e.target.value })}
                      className="form-input"
                      placeholder="e.g., President, Vice President"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Candidate Photo</label>
                  <div className="file-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      disabled={isLoading}
                    />
                    <div className="file-upload-label">
                      📷 Click to upload photo (JPG, PNG, GIF)
                    </div>
                  </div>
                  {photoPreview && (
                    <div className="file-preview">
                      <img src={photoPreview} alt="Preview" />
                    </div>
                  )}
                </div>
                <button type="submit" className="btn btn-success" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="spinner"></span>
                      Adding...
                    </>
                  ) : (
                    '✅ Add Candidate'
                  )}
                </button>
              </form>
            </div>

            {/* Candidates List */}
            <div className="card">
              <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>📋 Current Candidates</h3>
              {candidates.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
                  No candidates added yet.
                </p>
              ) : (
                <div className="grid grid-3">
                  {candidates.map((candidate) => (
                    <motion.div
                      key={candidate.id}
                      className="card"
                      whileHover={{ scale: 1.02 }}
                      style={{ textAlign: 'center' }}
                    >
                      <img
                        src={candidate.photo_path ? `${UPLOADS_URL}/${candidate.photo_path}` : '/default-avatar.png'}
                        alt={candidate.name}
                        style={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          margin: '0 auto 15px',
                          border: '3px solid rgba(255, 255, 255, 0.3)'
                        }}
                      />
                      <h4 style={{ marginBottom: '5px' }}>{candidate.name}</h4>
                      <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '10px' }}>
                        {candidate.position}
                      </p>
                      <div style={{ 
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        padding: '5px 15px',
                        borderRadius: '20px',
                        display: 'inline-block',
                        marginBottom: '15px'
                      }}>
                        Votes: {candidate.votes}
                      </div>
                      <br />
                      <button
                        onClick={() => handleDeleteCandidate(candidate.id)}
                        className="btn btn-danger"
                        style={{ width: '100%' }}
                      >
                        🗑️ Delete
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="card">
              <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>📊 Voting Results</h3>
              <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                <h4 style={{ fontSize: '1.8rem', color: '#667eea' }}>
                  Total Votes Cast: {results.totalVotes}
                </h4>
              </div>
              
              {results.candidates.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
                  No voting data available.
                </p>
              ) : (
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                  {results.candidates.map((candidate, index) => {
                    const percentage = results.totalVotes > 0 
                      ? ((candidate.vote_count / results.totalVotes) * 100).toFixed(1) 
                      : 0;
                    
                    return (
                      <motion.div
                        key={candidate.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '20px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '12px',
                          marginBottom: '15px',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <img
                            src={candidate.photo_path ? `${UPLOADS_URL}/${candidate.photo_path}` : '/default-avatar.png'}
                            alt={candidate.name}
                            style={{
                              width: '50px',
                              height: '50px',
                              borderRadius: '50%',
                              objectFit: 'cover'
                            }}
                          />
                          <div>
                            <h4>{candidate.name}</h4>
                            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                              {candidate.position}
                            </p>
                          </div>
                        </div>
                        
                        <div style={{ textAlign: 'right', minWidth: '200px' }}>
                          <div style={{ marginBottom: '10px' }}>
                            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                              {candidate.vote_count} votes ({percentage}%)
                            </span>
                          </div>
                          <div style={{
                            width: '200px',
                            height: '8px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.8, delay: index * 0.1 }}
                              style={{
                                height: '100%',
                                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                borderRadius: '4px'
                              }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="card">
              <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>🔍 Advanced Analytics</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h4 style={{ marginBottom: '15px' }}>📈 Voting Trends</h4>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Monitor real-time voting patterns and candidate performance over time.
                  </p>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h4 style={{ marginBottom: '15px' }}>👤 User Engagement</h4>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Track voter participation rates and engagement metrics.
                  </p>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h4 style={{ marginBottom: '15px' }}>🏆 Performance Metrics</h4>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Analyze candidate performance and voting distribution.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminDashboard;
