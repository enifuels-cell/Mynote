import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">📝 Mynote</Link>
      </div>
      
      <div className="navbar-menu">
        <Link to="/" className="nav-link">Dashboard</Link>
        <Link to="/timeline" className="nav-link">Timeline</Link>
        <Link to="/focus" className="nav-link">Focus Mode</Link>
        <Link to="/settings" className="nav-link">Settings</Link>
      </div>
      
      <div className="navbar-actions">
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <span className="user-info">{user?.username}</span>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
