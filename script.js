// Voting System JavaScript

// User accounts - Admin and 20 Users
const users = {
    admin: { password: 'admin123', role: 'admin' },
    user1: { password: 'password123', role: 'user' },
    user2: { password: 'password123', role: 'user' },
    user3: { password: 'password123', role: 'user' },
    user4: { password: 'password123', role: 'user' },
    user5: { password: 'password123', role: 'user' },
    user6: { password: 'password123', role: 'user' },
    user7: { password: 'password123', role: 'user' },
    user8: { password: 'password123', role: 'user' },
    user9: { password: 'password123', role: 'user' },
    user10: { password: 'password123', role: 'user' },
    user11: { password: 'password123', role: 'user' },
    user12: { password: 'password123', role: 'user' },
    user13: { password: 'password123', role: 'user' },
    user14: { password: 'password123', role: 'user' },
    user15: { password: 'password123', role: 'user' },
    user16: { password: 'password123', role: 'user' },
    user17: { password: 'password123', role: 'user' },
    user18: { password: 'password123', role: 'user' },
    user19: { password: 'password123', role: 'user' },
    user20: { password: 'password123', role: 'user' }
};

// Global variables
let currentUser = null;
let candidates = JSON.parse(localStorage.getItem('candidates')) || [];
let votes = JSON.parse(localStorage.getItem('votes')) || {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Add sample candidates if none exist
    if (candidates.length === 0) {
        candidates = [
            {
                id: 1,
                name: 'John Smith',
                position: 'President',
                photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
                votes: 0
            },
            {
                id: 2,
                name: 'Sarah Johnson',
                position: 'Vice President',
                photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
                votes: 0
            }
        ];
        saveCandidates();
    }

    setupEventListeners();
    showLoginForm();
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

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (users[username] && users[username].password === password) {
        currentUser = { username, role: users[username].role };
        
        if (currentUser.role === 'admin') {
            showAdminDashboard();
        } else {
            showUserDashboard();
        }
        
        // Clear login form
        document.getElementById('loginForm').reset();
        clearMessages();
    } else {
        showError('Invalid username or password!');
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

function showAdminDashboard() {
    hideAllContainers();
    document.getElementById('adminDashboard').classList.remove('hidden');
    showTab('candidates');
    displayCandidatesForAdmin();
    displayResults();
}

function showUserDashboard() {
    hideAllContainers();
    document.getElementById('userDashboard').classList.remove('hidden');
    document.getElementById('userInfo').textContent = `Welcome, ${currentUser.username}`;
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
}

function handleAddCandidate(e) {
    e.preventDefault();
    
    const name = document.getElementById('candidateName').value;
    const position = document.getElementById('candidatePosition').value;
    const photo = document.getElementById('candidatePhoto').value || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face';
    
    const newCandidate = {
        id: Date.now(),
        name,
        position,
        photo,
        votes: 0
    };
    
    candidates.push(newCandidate);
    saveCandidates();
    
    // Reset form
    document.getElementById('candidateForm').reset();
    
    // Refresh displays
    displayCandidatesForAdmin();
    displayResults();
    
    showSuccess('Candidate added successfully!');
}

function deleteCandidate(candidateId) {
    if (confirm('Are you sure you want to delete this candidate?')) {
        candidates = candidates.filter(candidate => candidate.id !== candidateId);
        saveCandidates();
        displayCandidatesForAdmin();
        displayResults();
        showSuccess('Candidate deleted successfully!');
    }
}

function displayCandidatesForAdmin() {
    const container = document.getElementById('candidatesList');
    
    if (candidates.length === 0) {
        container.innerHTML = '<p class="text-center">No candidates added yet.</p>';
        return;
    }
    
    const candidatesHTML = candidates.map(candidate => `
        <div class="candidate-card">
            <img src="${candidate.photo}" alt="${candidate.name}" class="candidate-photo" 
                 onerror="this.src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'">
            <div class="candidate-name">${candidate.name}</div>
            <div class="candidate-position">${candidate.position}</div>
            <div class="vote-count">Votes: ${candidate.votes}</div>
            <button class="delete-btn" onclick="deleteCandidate(${candidate.id})">Delete</button>
        </div>
    `).join('');
    
    container.innerHTML = `<div class="candidates-grid">${candidatesHTML}</div>`;
}

function displayCandidatesForUser() {
    const container = document.getElementById('votingCandidates');
    
    // Check if user has already voted
    if (votes[currentUser.username]) {
        const votedCandidate = candidates.find(c => c.id === votes[currentUser.username]);
        container.innerHTML = `
            <div class="voted-message">
                <h3>✅ Thank you for voting!</h3>
                <p>You have already voted for <strong>${votedCandidate ? votedCandidate.name : 'Unknown'}</strong></p>
                <p>You can only vote once.</p>
            </div>
        `;
        return;
    }
    
    if (candidates.length === 0) {
        container.innerHTML = '<p class="text-center">No candidates available for voting.</p>';
        return;
    }
    
    const candidatesHTML = candidates.map(candidate => `
        <div class="candidate-card">
            <img src="${candidate.photo}" alt="${candidate.name}" class="candidate-photo"
                 onerror="this.src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'">
            <div class="candidate-name">${candidate.name}</div>
            <div class="candidate-position">${candidate.position}</div>
            <button class="vote-btn" onclick="castVote(${candidate.id})">Vote for ${candidate.name}</button>
        </div>
    `).join('');
    
    container.innerHTML = `<div class="candidates-grid">${candidatesHTML}</div>`;
}

function castVote(candidateId) {
    if (votes[currentUser.username]) {
        showError('You have already voted!');
        return;
    }
    
    if (confirm('Are you sure you want to vote for this candidate? You can only vote once.')) {
        // Record the vote
        votes[currentUser.username] = candidateId;
        
        // Update candidate vote count
        const candidate = candidates.find(c => c.id === candidateId);
        if (candidate) {
            candidate.votes++;
        }
        
        // Save data
        saveVotes();
        saveCandidates();
        
        // Refresh display
        displayCandidatesForUser();
        
        showSuccess('Your vote has been recorded successfully!');
    }
}

function displayResults() {
    const container = document.getElementById('resultsList');
    
    if (candidates.length === 0) {
        container.innerHTML = '<p class="text-center">No candidates to show results for.</p>';
        return;
    }
    
    // Calculate total votes
    const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
    
    // Sort candidates by votes (descending)
    const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);
    
    const resultsHTML = sortedCandidates.map(candidate => {
        const percentage = totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(1) : 0;
        
        return `
            <div class="result-item">
                <div>
                    <strong>${candidate.name}</strong> (${candidate.position})
                    <br>
                    <small>${candidate.votes} votes (${percentage}%)</small>
                </div>
                <div class="result-bar">
                    <div class="result-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h4>Total Votes Cast: ${totalVotes}</h4>
        </div>
        ${resultsHTML}
    `;
}

function saveCandidates() {
    localStorage.setItem('candidates', JSON.stringify(candidates));
}

function saveVotes() {
    localStorage.setItem('votes', JSON.stringify(votes));
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

// Load votes from localStorage on startup
votes = JSON.parse(localStorage.getItem('votes')) || {};
