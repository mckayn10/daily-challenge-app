import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import './Profile.css';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: string;
}

const Profile: React.FC = () => {
  const { user, token } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchProfileData(), fetchAchievements()]);
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.users}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      } else {
        console.error('Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchAchievements = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.achievements}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAchievements(data);
      } else {
        console.error('Failed to fetch achievements');
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading your profile...</div>;
  }

  const displayUser = profileData || user;

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-avatar">
          {displayUser?.name?.charAt(0) || '?'}
        </div>
        <div className="profile-info">
          <h2>{displayUser?.name}</h2>
          <p>{displayUser?.email}</p>
          <p>Level {displayUser?.level} • Joined {displayUser?.joinedAt ? new Date(displayUser.joinedAt).toLocaleDateString() : 'Recently'}</p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-grid">
          <div className="stat-item">
            <div className="stat-value">{displayUser?.currentStreak || 0}</div>
            <div className="stat-label">🔥 Current Streak</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{displayUser?.longestStreak || 0}</div>
            <div className="stat-label">🏆 Best Streak</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{displayUser?.totalPoints || 0}</div>
            <div className="stat-label">⭐ Total Points</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{displayUser?.challengesCompleted || 0}</div>
            <div className="stat-label">✅ Completed</div>
          </div>
        </div>
      </div>

      <div className="achievements-section">
        <h3>Achievements</h3>
        <div className="achievements-grid">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-info">
                <h4>{achievement.name}</h4>
                <p>{achievement.description}</p>
                <div className="achievement-points">+{achievement.points} points</div>
                {achievement.unlocked && achievement.unlockedAt && (
                  <span className="unlock-date">
                    Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </span>
                )}
                {!achievement.unlocked && (
                  <span className="lock-status">🔒 Locked</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;