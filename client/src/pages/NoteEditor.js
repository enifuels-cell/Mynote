import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { notesAPI, aiAPI } from '../services/api';
import syncService from '../services/syncService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Navbar from '../components/Navbar';
import VoiceRecorder from '../components/VoiceRecorder';
import '../styles/NoteEditor.css';

function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [note, setNote] = useState({
    title: '',
    content: '',
    tags: [],
    attachments: [],
    userId: user.userId,
    color: '#ffffff'
  });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);

  useEffect(() => {
    if (id && id !== 'new') {
      loadNote();
    }
  }, [id]);

  const loadNote = async () => {
    try {
      const response = await notesAPI.getById(id);
      setNote(response.data);
      setAiSummary(response.data.aiSummary || '');
    } catch (error) {
      console.error('Error loading note:', error);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      note.lastModified = new Date();
      
      if (navigator.onLine) {
        if (id && id !== 'new') {
          await notesAPI.update(id, note);
        } else {
          const response = await notesAPI.create(note);
          navigate(`/note/${response.data._id}`, { replace: true });
        }
      } else {
        // Save offline
        await syncService.saveNoteOffline(note);
      }
      
      alert('Note saved successfully!');
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateSummary = async () => {
    try {
      if (id && id !== 'new') {
        const response = await aiAPI.summarize(id);
        setAiSummary(response.data.summary);
      }
    } catch (error) {
      console.error('Error generating summary:', error);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !note.tags.includes(tagInput.trim())) {
      setNote({ ...note, tags: [...note.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setNote({ ...note, tags: note.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleVoiceNote = (audioBlob, transcript) => {
    setNote({
      ...note,
      voiceNote: {
        url: URL.createObjectURL(audioBlob),
        transcript: transcript || ''
      }
    });
    setShowVoiceRecorder(false);
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['link', 'image'],
      ['clean']
    ]
  };

  return (
    <div className="note-editor">
      <Navbar />
      
      <div className="editor-container">
        <div className="editor-header">
          <input
            type="text"
            className="note-title"
            placeholder="Note title..."
            value={note.title}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
          />
          
          <div className="editor-actions">
            <button onClick={handleGenerateSummary} className="btn btn-secondary">
              🤖 Generate Summary
            </button>
            <button onClick={() => setShowVoiceRecorder(!showVoiceRecorder)} className="btn btn-secondary">
              🎤 Voice Note
            </button>
            <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : '💾 Save'}
            </button>
            <button onClick={() => navigate('/')} className="btn btn-secondary">
              ← Back
            </button>
          </div>
        </div>

        {showVoiceRecorder && (
          <VoiceRecorder onRecordingComplete={handleVoiceNote} />
        )}

        {aiSummary && (
          <div className="ai-summary">
            <h4>AI Summary:</h4>
            <p>{aiSummary}</p>
          </div>
        )}

        <ReactQuill
          theme="snow"
          value={note.content}
          onChange={(content) => setNote({ ...note, content })}
          modules={modules}
          className="quill-editor"
        />

        <div className="note-metadata">
          <div className="tags-section">
            <h4>Tags</h4>
            <div className="tags-input">
              <input
                type="text"
                placeholder="Add tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <button onClick={handleAddTag}>Add</button>
            </div>
            <div className="tags-list">
              {note.tags.map(tag => (
                <span key={tag} className="tag">
                  #{tag}
                  <button onClick={() => handleRemoveTag(tag)}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="color-picker">
            <h4>Note Color</h4>
            <input
              type="color"
              value={note.color}
              onChange={(e) => setNote({ ...note, color: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoteEditor;
