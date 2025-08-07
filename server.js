const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(cors({
    origin: isProduction 
        ? ['https://your-frontend-domain.vercel.app', 'https://your-app.onrender.com']
        : ['http://localhost:3000']
}));
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'candidate-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Only allow image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Initialize SQLite Database
const db = new sqlite3.Database('voting_system.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        initializeDatabase();
    }
});

// Create database tables
function initializeDatabase() {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user'
    )`, (err) => {
        if (err) {
            console.error('Error creating users table:', err);
        } else {
            console.log('Users table created/verified.');
        }
    });

    // Candidates table
    db.run(`CREATE TABLE IF NOT EXISTS candidates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        position TEXT NOT NULL,
        photo_path TEXT,
        votes INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating candidates table:', err);
        } else {
            console.log('Candidates table created/verified.');
        }
    });

    // Votes table
    db.run(`CREATE TABLE IF NOT EXISTS votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        candidate_id INTEGER,
        voted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (candidate_id) REFERENCES candidates (id),
        UNIQUE(user_id)
    )`, (err) => {
        if (err) {
            console.error('Error creating votes table:', err);
        } else {
            console.log('Votes table created/verified.');
            // Insert default users after all tables are created
            setTimeout(insertDefaultUsers, 1000);
        }
    });
}

function insertDefaultUsers() {
    // Insert admin
    db.run(`INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)`, 
        ['admin', 'admin123', 'admin'], (err) => {
            if (err) {
                console.error('Error inserting admin:', err);
            } else {
                console.log('Admin user created/verified.');
            }
        });

    // Insert 20 users
    for (let i = 1; i <= 20; i++) {
        db.run(`INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)`, 
            [`user${i}`, 'password123', 'user'], (err) => {
                if (err) {
                    console.error(`Error inserting user${i}:`, err);
                }
            });
    }

    console.log('All default users created/verified.');
}

// API Routes

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    db.get(`SELECT id, username, role FROM users WHERE username = ? AND password = ?`, 
        [username, password], (err, row) => {
        if (err) {
            res.status(500).json({ error: 'Database error' });
        } else if (row) {
            res.json({ success: true, user: row });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

// Get all candidates
app.get('/api/candidates', (req, res) => {
    db.all(`SELECT * FROM candidates ORDER BY created_at DESC`, (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json(rows);
        }
    });
});

// Add new candidate (with photo upload)
app.post('/api/candidates', upload.single('photo'), (req, res) => {
    const { name, position } = req.body;
    const photoPath = req.file ? req.file.filename : null;
    
    db.run(`INSERT INTO candidates (name, position, photo_path) VALUES (?, ?, ?)`,
        [name, position, photoPath], function(err) {
        if (err) {
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json({ 
                success: true, 
                candidate: { 
                    id: this.lastID, 
                    name, 
                    position, 
                    photo_path: photoPath,
                    votes: 0 
                }
            });
        }
    });
});

// Delete candidate
app.delete('/api/candidates/:id', (req, res) => {
    const candidateId = req.params.id;
    
    // First, get the photo path to delete the file
    db.get(`SELECT photo_path FROM candidates WHERE id = ?`, [candidateId], (err, row) => {
        if (err) {
            res.status(500).json({ error: 'Database error' });
            return;
        }
        
        // Delete the photo file if it exists
        if (row && row.photo_path) {
            const photoPath = path.join(__dirname, 'uploads', row.photo_path);
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
            }
        }
        
        // Delete candidate from database
        db.run(`DELETE FROM candidates WHERE id = ?`, [candidateId], function(err) {
            if (err) {
                res.status(500).json({ error: 'Database error' });
            } else {
                // Also delete related votes
                db.run(`DELETE FROM votes WHERE candidate_id = ?`, [candidateId]);
                res.json({ success: true });
            }
        });
    });
});

// Cast vote
app.post('/api/vote', (req, res) => {
    const { userId, candidateId } = req.body;
    
    // Check if user has already voted
    db.get(`SELECT id FROM votes WHERE user_id = ?`, [userId], (err, row) => {
        if (err) {
            res.status(500).json({ error: 'Database error' });
        } else if (row) {
            res.status(400).json({ error: 'User has already voted' });
        } else {
            // Insert vote
            db.run(`INSERT INTO votes (user_id, candidate_id) VALUES (?, ?)`,
                [userId, candidateId], function(err) {
                if (err) {
                    res.status(500).json({ error: 'Database error' });
                } else {
                    // Update candidate vote count
                    db.run(`UPDATE candidates SET votes = votes + 1 WHERE id = ?`,
                        [candidateId], (err) => {
                        if (err) {
                            res.status(500).json({ error: 'Database error' });
                        } else {
                            res.json({ success: true });
                        }
                    });
                }
            });
        }
    });
});

// Check if user has voted
app.get('/api/vote-status/:userId', (req, res) => {
    const userId = req.params.userId;
    
    db.get(`SELECT v.*, c.name as candidate_name FROM votes v 
            JOIN candidates c ON v.candidate_id = c.id 
            WHERE v.user_id = ?`, [userId], (err, row) => {
        if (err) {
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json({ hasVoted: !!row, vote: row });
        }
    });
});

// Get voting results
app.get('/api/results', (req, res) => {
    db.all(`SELECT c.*, 
            (SELECT COUNT(*) FROM votes v WHERE v.candidate_id = c.id) as vote_count
            FROM candidates c 
            ORDER BY vote_count DESC`, (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Database error' });
        } else {
            const totalVotes = rows.reduce((sum, candidate) => sum + candidate.vote_count, 0);
            res.json({ candidates: rows, totalVotes });
        }
    });
});

// Get users count
app.get('/api/users-count', (req, res) => {
    db.get(`SELECT COUNT(*) as count FROM users`, (err, row) => {
        if (err) {
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json({ count: row.count });
        }
    });
});

// Export voting data
app.get('/api/export', (req, res) => {
    const queries = {
        users: 'SELECT username, role FROM users',
        candidates: 'SELECT name, position, votes FROM candidates',
        votes: `SELECT u.username, c.name as candidate_name, v.voted_at 
                FROM votes v 
                JOIN users u ON v.user_id = u.id 
                JOIN candidates c ON v.candidate_id = c.id`
    };

    Promise.all([
        new Promise((resolve, reject) => {
            db.all(queries.users, (err, rows) => err ? reject(err) : resolve(rows));
        }),
        new Promise((resolve, reject) => {
            db.all(queries.candidates, (err, rows) => err ? reject(err) : resolve(rows));
        }),
        new Promise((resolve, reject) => {
            db.all(queries.votes, (err, rows) => err ? reject(err) : resolve(rows));
        })
    ]).then(([users, candidates, votes]) => {
        const exportData = {
            export_date: new Date().toISOString(),
            summary: {
                total_users: users.length,
                total_candidates: candidates.length,
                total_votes: votes.length
            },
            users,
            candidates,
            votes
        };
        
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=voting_data_export.json');
        res.json(exportData);
    }).catch(err => {
        res.status(500).json({ error: 'Export failed' });
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
        }
    }
    res.status(500).json({ error: error.message });
});

// Start server
app.listen(PORT, () => {
    console.log(`🗳️  Voting System Server running on http://localhost:${PORT}`);
    console.log(`📁 Files will be uploaded to: ${path.join(__dirname, 'uploads')}`);
    console.log(`💾 Database: ${path.join(__dirname, 'voting_system.db')}`);
    console.log(`🌐 Frontend: React app running on http://localhost:3000`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});
