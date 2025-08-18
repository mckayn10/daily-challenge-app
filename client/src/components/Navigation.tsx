import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navigation.css';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h1>🎯 Daily Challenge Hub</h1>
      </div>
      <ul className="nav-links">
        <li>
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link 
            to="/challenge" 
            className={location.pathname === '/challenge' ? 'active' : ''}
          >
            Today's Challenge
          </Link>
        </li>
        <li>
          <Link 
            to="/leaderboard" 
            className={location.pathname === '/leaderboard' ? 'active' : ''}
          >
            Leaderboard
          </Link>
        </li>
        <li>
          <Link 
            to="/profile" 
            className={location.pathname === '/profile' ? 'active' : ''}
          >
            Profile
          </Link>
        </li>
      </ul>
      <div className="nav-user">
        <span className="welcome-text">Hi, {user?.name}!</span>
        <button 
          onClick={logout}
          className="logout-button"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navigation;