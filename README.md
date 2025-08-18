# 🎯 Daily Challenge Hub

A React/Node.js application for tracking daily challenges, building streaks, and competing with friends!

## Features

- **Daily Challenges**: Get a new challenge every day across different categories
- **Streak Tracking**: Build and maintain challenge streaks
- **Community Voting**: Vote on other users' challenge submissions  
- **Leaderboards**: Compete for top points and longest streaks
- **Achievement System**: Unlock badges for milestones
- **Real-time Updates**: Live voting and notifications with Socket.io

## Tech Stack

- **Frontend**: React, TypeScript, React Router
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose
- **Real-time**: Socket.io
- **Styling**: Custom CSS with modern design

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd daily-challenge-hub
   ```

2. **Set up the server**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

3. **Set up the client**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the server** (from `/server` directory):
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

2. **Start the client** (from `/client` directory):
   ```bash
   npm start
   ```
   Client runs on `http://localhost:3000`

### Environment Variables

Create a `.env` file in the `/server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/daily-challenge-hub
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

## Project Structure

```
daily-challenge-hub/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.tsx        # Main App component
│   │   └── App.css        # Global styles
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   └── index.ts       # Server entry point
│   └── package.json
└── README.md
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/challenges/today` - Get today's challenge
- `GET /api/challenges` - Get recent challenges
- `GET /api/users/leaderboard` - Get leaderboard data
- `GET /api/users/:id/stats` - Get user statistics

## Challenge Categories

- 📸 **Photo**: Photography challenges
- 🏃 **Fitness**: Physical activity challenges  
- 🎨 **Creative**: Art and creativity challenges
- 📚 **Learning**: Educational challenges
- 🧘 **Mindfulness**: Meditation and reflection
- 💻 **Coding**: Programming challenges

## Next Steps

- [ ] Add user authentication and registration
- [ ] Implement file upload for challenge submissions
- [ ] Add real-time community voting system
- [ ] Create achievement unlock notifications
- [ ] Build challenge submission review system
- [ ] Add social features (friends, sharing)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.