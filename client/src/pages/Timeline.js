import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { notesAPI } from '../services/api';
import { format } from 'date-fns';
import Navbar from '../components/Navbar';
import '../styles/Timeline.css';

function Timeline() {
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadTimeline();
  }, []);

  const loadTimeline = async () => {
    try {
      const response = await notesAPI.getTimeline(user.userId);
      setTimelineData(response.data);
    } catch (error) {
      console.error('Error loading timeline:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading timeline...</div>;
  }

  return (
    <div className="timeline-page">
      <Navbar />
      
      <div className="timeline-container">
        <h1>📅 Timeline</h1>
        <p className="timeline-subtitle">See your notes organized by date</p>
        
        <div className="timeline">
          {timelineData.map((day) => (
            <div key={day._id} className="timeline-day">
              <div className="timeline-date">
                <h3>{format(new Date(day._id), 'MMMM d, yyyy')}</h3>
                <span className="note-count">{day.count} notes</span>
              </div>
              
              <div className="timeline-notes">
                {day.notes.map((note) => (
                  <div key={note._id} className="timeline-note">
                    <h4>{note.title || 'Untitled'}</h4>
                    <p>{note.content?.substring(0, 100)}...</p>
                    <div className="timeline-note-tags">
                      {note.tags.map(tag => (
                        <span key={tag} className="tag-small">#{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {timelineData.length === 0 && (
          <div className="empty-state">
            <h3>No notes yet</h3>
            <p>Start creating notes to see them in your timeline</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Timeline;
