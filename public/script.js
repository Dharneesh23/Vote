// Voting System JavaScript - Database Version

// Global variables
let currentUser = null;
let candidates = [];

// API Base URL
const API_BASE = '/api';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    showLoginForm();
    loadCandidates();
}

function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Logout buttons
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('userLogoutBtn').addEventListener('click', logout);
    
    // Candidate form
    document.getElementById('candidateForm').addEventListener('submit', handleAddCandidate);
}

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.user;
            
            if (currentUser.role === 'admin') {
                showAdminDashboard();
            } else {
                showUserDashboard();
            }
            
            // Clear login form
            document.getElementById('loginForm').reset();
            clearMessages();
        } else {
            showError(data.error || 'Invalid credentials');
        }
    } catch (error) {
        showError('Connection error. Please try again.');
        console.error('Login error:', error);
    }
}

function logout() {
    currentUser = null;
    showLoginForm();
    clearMessages();
}

function showLoginForm() {
    hideAllContainers();
    document.getElementById('loginContainer').classList.remove('hidden');
}

async function showAdminDashboard() {
    hideAllContainers();
    document.getElementById('adminDashboard').classList.remove('hidden');
    showTab('candidates');
    await loadCandidates();
    displayCandidatesForAdmin();
    displayResults();
}

async function showUserDashboard() {
    hideAllContainers();
    document.getElementById('userDashboard').classList.remove('hidden');
    document.getElementById('userInfo').textContent = `Welcome, ${currentUser.username}`;
    await loadCandidates();
    displayCandidatesForUser();
}

function hideAllContainers() {
    document.getElementById('loginContainer').classList.add('hidden');
    document.getElementById('adminDashboard').classList.add('hidden');
    document.getElementById('userDashboard').classList.add('hidden');
}

function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    if (tabName === 'results') {
        displayResults();
    }
}

async function handleAddCandidate(e) {
    e.preventDefault();
    
    const name = document.getElementById('candidateName').value;
    const position = document.getElementById('candidatePosition').value;
    const photoFile = document.getElementById('candidatePhoto').files[0];
    
    if (!photoFile) {
        showError('Please select a photo for the candidate.');
        return;
    }
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('position', position);
    formData.append('photo', photoFile);
    
    try {
        const response = await fetch(`${API_BASE}/candidates`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Reset form
            document.getElementById('candidateForm').reset();
            
            // Refresh displays
            await loadCandidates();
            displayCandidatesForAdmin();
            displayResults();
            
            showSuccess('Candidate added successfully!');
        } else {
            showError(data.error || 'Failed to add candidate');
        }
    } catch (error) {
        showError('Connection error. Please try again.');
        console.error('Add candidate error:', error);
    }
}

async function deleteCandidate(candidateId) {
    if (confirm('Are you sure you want to delete this candidate?')) {
        try {
            const response = await fetch(`${API_BASE}/candidates/${candidateId}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (data.success) {
                await loadCandidates();
                displayCandidatesForAdmin();
                displayResults();
                showSuccess('Candidate deleted successfully!');
            } else {
                showError(data.error || 'Failed to delete candidate');
            }
        } catch (error) {
            showError('Connection error. Please try again.');
            console.error('Delete candidate error:', error);
        }
    }
}

async function loadCandidates() {
    try {
        const response = await fetch(`${API_BASE}/candidates`);
        candidates = await response.json();
    } catch (error) {
        console.error('Error loading candidates:', error);
        candidates = [];
    }
}

function displayCandidatesForAdmin() {
    const container = document.getElementById('candidatesList');
    
    if (candidates.length === 0) {
        container.innerHTML = '<p class="text-center">No candidates added yet.</p>';
        return;
    }
    
    const candidatesHTML = candidates.map(candidate => {
        const photoSrc = candidate.photo_path 
            ? `/uploads/${candidate.photo_path}` 
            : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face';
        
        return `
            <div class="candidate-card">
                <img src="${photoSrc}" alt="${candidate.name}" class="candidate-photo" 
                     onerror="this.src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'">
                <div class="candidate-name">${candidate.name}</div>
                <div class="candidate-position">${candidate.position}</div>
                <div class="vote-count">Votes: ${candidate.votes}</div>
                <button class="delete-btn" onclick="deleteCandidate(${candidate.id})">Delete</button>
            </div>
        `;
    }).join('');
    
    container.innerHTML = `<div class="candidates-grid">${candidatesHTML}</div>`;
}

async function displayCandidatesForUser() {
    const container = document.getElementById('votingCandidates');
    
    // Check if user has already voted
    try {
        const response = await fetch(`${API_BASE}/vote-status/${currentUser.id}`);
        const voteStatus = await response.json();
        
        if (voteStatus.hasVoted) {
            container.innerHTML = `
                <div class="voted-message">
                    <h3>✅ Thank you for voting!</h3>
                    <p>You have already voted for <strong>${voteStatus.vote.candidate_name}</strong></p>
                    <p>You can only vote once.</p>
                </div>
            `;
            return;
        }
    } catch (error) {
        console.error('Error checking vote status:', error);
    }
    
    if (candidates.length === 0) {
        container.innerHTML = '<p class="text-center">No candidates available for voting.</p>';
        return;
    }
    
    const candidatesHTML = candidates.map(candidate => {
        const photoSrc = candidate.photo_path 
            ? `/uploads/${candidate.photo_path}` 
            : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face';
        
        return `
            <div class="candidate-card">
                <img src="${photoSrc}" alt="${candidate.name}" class="candidate-photo"
                     onerror="this.src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'">
                <div class="candidate-name">${candidate.name}</div>
                <div class="candidate-position">${candidate.position}</div>
                <button class="vote-btn" onclick="castVote(${candidate.id})">Vote for ${candidate.name}</button>
            </div>
        `;
    }).join('');
    
    container.innerHTML = `<div class="candidates-grid">${candidatesHTML}</div>`;
}

async function castVote(candidateId) {
    if (confirm('Are you sure you want to vote for this candidate? You can only vote once.')) {
        try {
            const response = await fetch(`${API_BASE}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: currentUser.id,
                    candidateId: candidateId
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Refresh candidates display
                await loadCandidates();
                displayCandidatesForUser();
                showSuccess('Your vote has been recorded successfully!');
            } else {
                showError(data.error || 'Failed to record vote');
            }
        } catch (error) {
            showError('Connection error. Please try again.');
            console.error('Vote error:', error);
        }
    }
}

async function displayResults() {
    const container = document.getElementById('resultsList');
    
    try {
        const response = await fetch(`${API_BASE}/results`);
        const data = await response.json();
        
        if (data.candidates.length === 0) {
            container.innerHTML = '<p class="text-center">No candidates to show results for.</p>';
            return;
        }
        
        const resultsHTML = data.candidates.map(candidate => {
            const percentage = data.totalVotes > 0 ? ((candidate.vote_count / data.totalVotes) * 100).toFixed(1) : 0;
            
            return `
                <div class="result-item">
                    <div>
                        <strong>${candidate.name}</strong> (${candidate.position})
                        <br>
                        <small>${candidate.vote_count} votes (${percentage}%)</small>
                    </div>
                    <div class="result-bar">
                        <div class="result-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h4>Total Votes Cast: ${data.totalVotes}</h4>
            </div>
            ${resultsHTML}
        `;
    } catch (error) {
        console.error('Error loading results:', error);
        container.innerHTML = '<p class="text-center">Error loading results.</p>';
    }
}

function showError(message) {
    clearMessages();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const loginForm = document.querySelector('.login-form');
    if (loginForm && !document.getElementById('loginContainer').classList.contains('hidden')) {
        loginForm.appendChild(errorDiv);
    }
}

function showSuccess(message) {
    clearMessages();
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    const activeContainer = document.querySelector('.admin-dashboard:not(.hidden), .user-dashboard:not(.hidden)');
    if (activeContainer) {
        activeContainer.appendChild(successDiv);
        setTimeout(() => successDiv.remove(), 3000);
    }
}

function clearMessages() {
    const messages = document.querySelectorAll('.error-message, .success-message');
    messages.forEach(msg => msg.remove());
}
