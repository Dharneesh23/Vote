# 🗳️ Modern Voting System

A complete, modern voting system built with **React** frontend and **Node.js** backend, featuring real-time results, secure file uploads, and beautiful UI.

![Voting System](https://img.shields.io/badge/Tech-React%20%7C%20Node.js%20%7C%20SQLite-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)

## ✨ Features

### 🔐 Admin Features
- **Secure Admin Panel**: Complete candidate management system
- **Photo Upload**: Upload candidate photos from your computer/desktop
- **Real-time Results**: Live vote counting and analytics
- **Candidate Management**: Add, view, and delete candidates
- **Vote Analytics**: Beautiful charts and percentage breakdowns

### 👥 User Features  
- **20 Pre-configured Users**: Ready-to-use user accounts
- **One-Time Voting**: Secure voting with duplicate prevention
- **Beautiful UI**: Modern, responsive design with animations
- **Real-time Updates**: See live vote counts
- **Mobile Friendly**: Works perfectly on all devices

### 🎨 Technical Features
- **React Frontend**: Modern, animated UI with Framer Motion
- **Node.js Backend**: RESTful API with Express.js
- **SQLite Database**: Persistent data storage
- **File Upload**: Multer for secure photo uploads
- **Responsive Design**: Beautiful on all screen sizes
- **Real-time Updates**: Live data synchronization

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone/Download the project**
   ```bash
   cd "c:\Users\Dharneesh S\Vote"
   ```

2. **Install Dependencies**
   ```bash
   npm run install-deps
   ```

3. **Start Development Mode**
   ```bash
   npm run dev
   ```

This will start:
- 🖥️ **Backend Server**: `http://localhost:3001`
- 🌐 **React Frontend**: `http://localhost:3000`

## 🔐 Login Credentials

### 👨‍💼 Admin Account
- **Username**: `admin`
- **Password**: `admin123`

### 👥 User Accounts (20 Users)
- **Usernames**: `user1`, `user2`, `user3`, ..., `user20`
- **Password**: `password123` (same for all users)

## 📁 Project Structure

```
Vote/
├── 📁 client/                 # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── LoginForm.js
│   │   │   ├── AdminDashboard.js
│   │   │   └── UserDashboard.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── 📁 uploads/               # Uploaded candidate photos
├── server.js                 # Node.js Backend Server
├── voting_system.db          # SQLite Database
├── package.json              # Root dependencies
└── README.md                 # This file
```

## 🛠️ Available Scripts

```bash
# Start production server only
npm start

# Start development mode (both frontend & backend)
npm run dev

# Start backend only
npm run server

# Start frontend only
npm run client

# Build frontend for production
npm run build

# Install all dependencies
npm run install-deps
```

## 📊 Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `password` - User password
- `role` - 'admin' or 'user'

### Candidates Table
- `id` - Primary key
- `name` - Candidate name
- `position` - Position/role
- `photo_path` - Uploaded photo filename
- `votes` - Current vote count

### Votes Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `candidate_id` - Foreign key to candidates
- `voted_at` - Timestamp

## 🎨 UI Features

### 🌈 Modern Design
- **Animated Background**: Beautiful gradient animations
- **Glass Morphism**: Modern card designs with backdrop blur
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Layout**: Perfect on mobile, tablet, and desktop

### 🖼️ Photo Management
- **Drag & Drop Upload**: Easy photo uploading
- **Image Preview**: See photos before submitting
- **Secure Storage**: Photos stored in `/uploads` directory
- **Format Support**: JPG, PNG, GIF supported

### 📈 Real-time Results
- **Live Vote Counts**: Updates without refresh
- **Progress Bars**: Visual vote percentage display
- **Candidate Rankings**: Sorted by vote count
- **Total Vote Counter**: See overall participation

## 🔒 Security Features

- ✅ **One Vote Per User**: Database constraints prevent multiple votes
- ✅ **Input Validation**: All inputs are validated and sanitized
- ✅ **File Upload Security**: Only image files allowed with size limits
- ✅ **SQL Injection Prevention**: Parameterized queries used
- ✅ **CORS Protection**: Configured for security

## 🚀 Deployment Ready

### For Production Hosting:

1. **Build the React app**:
   ```bash
   npm run build
   ```

2. **Set Environment Variables**:
   ```bash
   PORT=3001
   NODE_ENV=production
   ```

3. **Deploy to platforms like**:
   - Heroku
   - Vercel
   - DigitalOcean
   - AWS EC2
   - Railway

### Hosting Requirements:
- Node.js support
- File upload capability
- SQLite support (or migrate to PostgreSQL/MySQL)

## 🎯 Usage Guide

### For Admins:
1. Login with admin credentials
2. Go to "Manage Candidates" tab
3. Add candidates with photos and positions
4. Monitor results in "Vote Results" tab
5. View real-time voting analytics

### For Users:
1. Login with user credentials (user1-user20)
2. View all available candidates
3. Click "Vote" for your preferred candidate
4. Confirm your vote (one-time only)
5. See confirmation message

## 🔧 Customization

### Adding More Users:
Edit `server.js` in the `insertDefaultUsers()` function:
```javascript
// Add more users
for (let i = 1; i <= 50; i++) {  // Change 20 to 50
    db.run(`INSERT OR IGNORE INTO users...`);
}
```

### Changing Colors:
Edit `client/src/App.css` gradient values:
```css
.background-gradient {
    background: linear-gradient(135deg, 
        #your-color-1 0%, 
        #your-color-2 25%, 
        #your-color-3 50%
    );
}
```

### Database Migration:
For production, consider migrating from SQLite to PostgreSQL or MySQL by updating the database connection in `server.js`.

## 🐛 Troubleshooting

### Common Issues:

1. **Port Already in Use**:
   ```bash
   # Kill process on port 3001
   npx kill-port 3001
   ```

2. **Database Locked**:
   ```bash
   # Delete database file to reset
   rm voting_system.db
   ```

3. **Photo Upload Issues**:
   - Check `uploads/` directory exists
   - Verify file size (5MB limit)
   - Ensure image format (JPG, PNG, GIF)

## 📱 Mobile Support

- ✅ Fully responsive design
- ✅ Touch-friendly interfaces
- ✅ Mobile-optimized animations
- ✅ Cross-platform compatibility

## 🌟 Demo

Perfect for:
- 🏫 School elections
- 🏢 Office voting
- 🎭 Community decisions
- 📊 Survey systems
- 🗳️ Democratic processes

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React.js for the amazing frontend framework
- Framer Motion for beautiful animations
- Node.js & Express.js for the robust backend
- SQLite for simple database management

---

**🎉 Ready to Vote!** 

Start with `npm run dev` and open `http://localhost:3000` in your browser!

**Made with ❤️ for democratic processes**
