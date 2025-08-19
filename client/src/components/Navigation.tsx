import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navigation.css';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h1>🎯 Daily Challenge Hub</h1>
      </div>
      
      {/* Hamburger Menu Button */}
      <button className="hamburger" onClick={toggleMenu}>
        <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
      </button>

      {/* Navigation Menu */}
      <div className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
        <ul className="nav-links">
          <li>
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
              onClick={closeMenu}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/challenge" 
              className={location.pathname === '/challenge' ? 'active' : ''}
              onClick={closeMenu}
            >
              Today's Challenge
            </Link>
          </li>
          <li>
            <Link 
              to="/leaderboard" 
              className={location.pathname === '/leaderboard' ? 'active' : ''}
              onClick={closeMenu}
            >
              Leaderboard
            </Link>
          </li>
          <li>
            <Link 
              to="/profile" 
              className={location.pathname === '/profile' ? 'active' : ''}
              onClick={closeMenu}
            >
              Profile
            </Link>
          </li>
        </ul>
        <div className="nav-user">
          <span className="welcome-text">Hi, {user?.name}!</span>
          <button 
            onClick={() => {
              logout();
              closeMenu();
            }}
            className="logout-button"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;