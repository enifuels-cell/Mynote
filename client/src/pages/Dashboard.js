import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { notesAPI, aiAPI } from '../services/api';
import syncService from '../services/syncService';
import NoteCard from '../components/NoteCard';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import '../styles/Dashboard.css';

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [selectedTag, setSelectedTag] = useState(null);
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    loadNotes();
  }, [user]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      
      // Ensure user and userId are available
      if (!user || !user.userId) {
        console.warn('User or userId not available');
        setLoading(false);
        return;
      }
      
      // Try to load from server first
      if (navigator.onLine) {
        const response = await notesAPI.getAll(user.userId);
        setNotes(response.data);
        setFilteredNotes(response.data);
      } else {
        // Load from offline storage
        const offlineNotes = await syncService.getNotesOffline(user.userId);
        setNotes(offlineNotes);
        setFilteredNotes(offlineNotes);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
      // Fallback to offline
      if (user && user.userId) {
        const offlineNotes = await syncService.getNotesOffline(user.userId);
        setNotes(offlineNotes);
        setFilteredNotes(offlineNotes);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setFilteredNotes(notes);
      return;
    }

    try {
      const response = await notesAPI.search(user.userId, query);
      setFilteredNotes(response.data);
    } catch (error) {
      // Offline search
      const filtered = notes.filter(note =>
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredNotes(filtered);
    }
  };

  const handleTagFilter = (tag) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
      setFilteredNotes(notes);
    } else {
      setSelectedTag(tag);
      const filtered = notes.filter(note => note.tags.includes(tag));
      setFilteredNotes(filtered);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (navigator.onLine) {
        await notesAPI.delete(id);
      } else {
        await syncService.deleteNoteOffline(id);
      }
      loadNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleAIOrganize = async () => {
    try {
      await aiAPI.organize(user.userId);
      loadNotes();
      alert('Notes organized successfully!');
    } catch (error) {
      console.error('Error organizing notes:', error);
      alert('Failed to organize notes');
    }
  };

  const getAllTags = () => {
    const tagSet = new Set();
    notes.forEach(note => {
      if (note.tags && Array.isArray(note.tags)) {
        note.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet);
  };

  if (loading) {
    return <div className="loading">Loading notes...</div>;
  }

  return (
    <div className="dashboard">
      <Navbar />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>My Notes</h1>
          <div className="dashboard-actions">
            <button onClick={handleAIOrganize} className="btn btn-secondary">
              🤖 AI Organize
            </button>
            <button onClick={() => navigate('/note/new')} className="btn btn-primary">
              ✏️ New Note
            </button>
          </div>
        </div>

        <SearchBar onSearch={handleSearch} />

        <div className="tags-filter">
          {getAllTags().map(tag => (
            <button
              key={tag}
              className={`tag-chip ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => handleTagFilter(tag)}
            >
              #{tag}
            </button>
          ))}
        </div>

        <div className="view-toggle">
          <button
            className={view === 'grid' ? 'active' : ''}
            onClick={() => setView('grid')}
          >
            Grid
          </button>
          <button
            className={view === 'list' ? 'active' : ''}
            onClick={() => setView('list')}
          >
            List
          </button>
        </div>

        <div className={`notes-container ${view}`}>
          {filteredNotes.length === 0 ? (
            <div className="empty-state">
              <h3>No notes yet</h3>
              <p>Create your first note to get started</p>
            </div>
          ) : (
            filteredNotes.map(note => (
              <NoteCard
                key={note._id}
                note={note}
                onDelete={handleDelete}
                onClick={() => navigate(`/note/${note._id}`)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
