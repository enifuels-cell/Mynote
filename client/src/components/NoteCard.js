import React from 'react';
import { format } from 'date-fns';
import '../styles/NoteCard.css';

function NoteCard({ note, onClick, onDelete }) {
  const getPreview = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.substring(0, 150) + (text.length > 150 ? '...' : '');
  };

  return (
    <div 
      className="note-card" 
      style={{ borderLeftColor: note.color }}
      onClick={onClick}
    >
      <div className="note-card-header">
        <h3>{note.title || 'Untitled'}</h3>
        <button 
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm('Delete this note?')) {
              onDelete(note._id);
            }
          }}
        >
          🗑️
        </button>
      </div>
      
      <div className="note-card-content">
        {getPreview(note.content)}
      </div>
      
      {note.aiSummary && (
        <div className="note-summary">
          <strong>AI:</strong> {note.aiSummary.substring(0, 100)}...
        </div>
      )}
      
      <div className="note-card-footer">
        <div className="note-tags">
          {note.tags.slice(0, 3).map(tag => (
            <span key={tag} className="tag-small">#{tag}</span>
          ))}
        </div>
        <span className="note-date">
          {format(new Date(note.lastModified || note.createdAt), 'MMM d, yyyy')}
        </span>
      </div>
    </div>
  );
}

export default NoteCard;
