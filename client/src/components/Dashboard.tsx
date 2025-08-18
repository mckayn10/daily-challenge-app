import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useChallenge } from '../contexts/ChallengeContext';
import './Dashboard.css';

interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  challengesCompleted: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { todayChallenge, loading: challengeLoading } = useChallenge();
  const navigate = useNavigate();

  const userStats: UserStats = {
    currentStreak: user?.currentStreak || 0,
    longestStreak: user?.longestStreak || 0,
    totalPoints: user?.totalPoints || 0,
    challengesCompleted: user?.challengesCompleted || 0
  };

  if (challengeLoading) {
    return <div className="loading">Loading your dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <h2>Welcome back! 👋</h2>
        <p>Ready for today's challenge?</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{userStats.currentStreak}</div>
          <div className="stat-label">🔥 Current Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{userStats.longestStreak}</div>
          <div className="stat-label">🏆 Longest Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{userStats.totalPoints}</div>
          <div className="stat-label">⭐ Total Points</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{userStats.challengesCompleted}</div>
          <div className="stat-label">✅ Completed</div>
        </div>
      </div>

      {todayChallenge && (
        <div className="today-challenge">
          <h3>Today's Challenge</h3>
          <div className="challenge-card">
            <div className="challenge-header">
              <h4>{todayChallenge.title}</h4>
              <span className={`difficulty ${todayChallenge.difficulty}`}>
                {todayChallenge.difficulty}
              </span>
            </div>
            <p>{todayChallenge.description}</p>
            <div className="challenge-footer">
              <span className="category">#{todayChallenge.category}</span>
              <span className="points">{todayChallenge.points} points</span>
            </div>
            <button 
              className="start-challenge-btn"
              onClick={() => navigate('/challenge')}
            >
              Start Challenge 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;