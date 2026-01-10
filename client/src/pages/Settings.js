import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { emailAPI, syncAPI, aiAPI } from '../services/api';
import Navbar from '../components/Navbar';
import '../styles/Settings.css';

function Settings() {
  const { user, updatePreferences } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [emailForwarding, setEmailForwarding] = useState('');
  const [forwardingEmail, setForwardingEmail] = useState('');
  const [clipboardSync, setClipboardSync] = useState(true);
  const [autoOrganize, setAutoOrganize] = useState(user?.preferences?.aiAutoOrganize ?? true);
  const [insights, setInsights] = useState(null);

  const handleEmailSetup = async () => {
    try {
      const response = await emailAPI.configure(user.userId, emailForwarding);
      setForwardingEmail(response.data.forwardingEmail);
      alert('Email forwarding configured! Send emails to: ' + response.data.forwardingEmail);
    } catch (error) {
      console.error('Error setting up email:', error);
      alert('Failed to setup email forwarding');
    }
  };

  const handleSyncClipboard = async () => {
    if (clipboardSync) {
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          await syncAPI.syncClipboard(user.userId, text, localStorage.getItem('deviceId'));
          alert('Clipboard synced!');
        }
      } catch (error) {
        console.error('Error syncing clipboard:', error);
      }
    }
  };

  const handleGetInsights = async () => {
    try {
      const response = await aiAPI.getInsights(user.userId);
      setInsights(response.data);
    } catch (error) {
      console.error('Error getting insights:', error);
    }
  };

  const handleBiometricSetup = async () => {
    try {
      // Check if Web Authentication API is available
      if (!window.PublicKeyCredential) {
        alert('Biometric authentication is not supported on this device');
        return;
      }

      alert('Biometric setup would be configured here. This is a demo implementation.');
    } catch (error) {
      console.error('Error setting up biometrics:', error);
    }
  };

  return (
    <div className="settings-page">
      <Navbar />
      
      <div className="settings-container">
        <h1>⚙️ Settings</h1>
        
        <section className="settings-section">
          <h2>Appearance</h2>
          <div className="setting-item">
            <label>
              <span>Dark Mode</span>
              <button onClick={toggleTheme} className="btn btn-secondary">
                {theme === 'light' ? 'Enable Dark Mode' : 'Enable Light Mode'}
              </button>
            </label>
          </div>
        </section>

        <section className="settings-section">
          <h2>AI Features</h2>
          <div className="setting-item">
            <label>
              <span>Auto AI Organization</span>
              <input
                type="checkbox"
                checked={autoOrganize}
                onChange={(e) => {
                  setAutoOrganize(e.target.checked);
                  updatePreferences({ aiAutoOrganize: e.target.checked });
                }}
              />
            </label>
          </div>
          <button onClick={handleGetInsights} className="btn btn-secondary">
            View AI Insights
          </button>
          {insights && (
            <div className="insights-panel">
              <h3>Your Insights</h3>
              <p>Total Notes: {insights.totalNotes}</p>
              <div>
                <h4>Top Tags:</h4>
                {insights.topTags.map(([tag, count]) => (
                  <span key={tag} className="tag-insight">
                    #{tag} ({count})
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="settings-section">
          <h2>Email to Notes</h2>
          <div className="setting-item">
            <input
              type="email"
              placeholder="Your email address"
              value={emailForwarding}
              onChange={(e) => setEmailForwarding(e.target.value)}
            />
            <button onClick={handleEmailSetup} className="btn btn-primary">
              Setup Email Forwarding
            </button>
          </div>
          {forwardingEmail && (
            <div className="info-box">
              Forward emails to: <strong>{forwardingEmail}</strong>
            </div>
          )}
        </section>

        <section className="settings-section">
          <h2>Sync & Clipboard</h2>
          <div className="setting-item">
            <label>
              <span>Cross-Device Clipboard Sync</span>
              <input
                type="checkbox"
                checked={clipboardSync}
                onChange={(e) => setClipboardSync(e.target.checked)}
              />
            </label>
          </div>
          <button onClick={handleSyncClipboard} className="btn btn-secondary">
            Sync Clipboard Now
          </button>
        </section>

        <section className="settings-section">
          <h2>Security</h2>
          <div className="setting-item">
            <button onClick={handleBiometricSetup} className="btn btn-secondary">
              🔐 Setup Biometric Lock
            </button>
          </div>
          <p className="info-text">
            Use fingerprint or face recognition to secure your sensitive notes
          </p>
        </section>

        <section className="settings-section">
          <h2>Account</h2>
          <div className="setting-item">
            <p><strong>Username:</strong> {user?.username}</p>
            <p><strong>Email:</strong> {user?.email}</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Settings;
