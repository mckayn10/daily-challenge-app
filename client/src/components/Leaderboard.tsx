import React, { useState, useCallback } from 'react';
import './Leaderboard.css';

interface LeaderboardUser {
  _id: string;
  name: string;
  totalPoints: number;
  currentStreak: number;
  challengesCompleted: number;
  level: number;
}

const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'points' | 'streak'>('points');
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/users/leaderboard?sortBy=${activeTab === 'points' ? 'points' : 'streak'}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  React.useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);


  if (loading) {
    return <div className="loading">Loading leaderboard...</div>;
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `#${index + 1}`;
    }
  };

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h2>🏆 Leaderboard</h2>
        <p>See how you stack up against other challengers!</p>
      </div>

      <div className="leaderboard-tabs">
        <button 
          className={`tab ${activeTab === 'points' ? 'active' : ''}`}
          onClick={() => setActiveTab('points')}
        >
          ⭐ Points
        </button>
        <button 
          className={`tab ${activeTab === 'streak' ? 'active' : ''}`}
          onClick={() => setActiveTab('streak')}
        >
          🔥 Streak
        </button>
      </div>

      <div className="leaderboard-list">
        {users.map((user, index) => (
          <div 
            key={user._id} 
            className={`leaderboard-item ${user.name === 'You' ? 'current-user' : ''}`}
          >
            <div className="rank">
              {getRankIcon(index)}
            </div>
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-level">Level {user.level}</div>
            </div>
            <div className="user-stats">
              {activeTab === 'points' ? (
                <>
                  <div className="primary-stat">{user.totalPoints}</div>
                  <div className="stat-label">points</div>
                </>
              ) : (
                <>
                  <div className="primary-stat">{user.currentStreak}</div>
                  <div className="stat-label">day streak</div>
                </>
              )}
            </div>
            <div className="secondary-stats">
              <span>{user.challengesCompleted} completed</span>
            </div>
          </div>
        ))}
      </div>

      <div className="leaderboard-footer">
        <p>Rankings update daily at midnight UTC</p>
      </div>
    </div>
  );
};

export default Leaderboard;