import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { notesAPI } from '../services/api';
import Navbar from '../components/Navbar';
import '../styles/FocusMode.css';

function FocusMode() {
  const [notes, setNotes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const response = await notesAPI.getAll(user.userId);
      setNotes(response.data);
      
      // Create flashcards from notes
      const cards = response.data
        .filter(note => note.content && note.title)
        .map(note => ({
          id: note._id,
          question: note.title,
          answer: stripHtml(note.content).substring(0, 300)
        }));
      setFlashcards(cards);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const stripHtml = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  const nextCard = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const prevCard = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  if (flashcards.length === 0) {
    return (
      <div className="focus-mode">
        <Navbar />
        <div className="empty-state">
          <h3>No flashcards available</h3>
          <p>Create some notes to use focus mode</p>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="focus-mode">
      <Navbar />
      
      <div className="focus-container">
        <h1>🎯 Focus Mode</h1>
        <p className="focus-subtitle">Study your notes with flashcards</p>
        
        <div className="flashcard-container">
          <div className="card-counter">
            {currentIndex + 1} / {flashcards.length}
          </div>
          
          <div className={`flashcard ${showAnswer ? 'flipped' : ''}`}>
            <div className="flashcard-content">
              {!showAnswer ? (
                <div className="flashcard-question">
                  <h2>Question</h2>
                  <p>{currentCard.question}</p>
                </div>
              ) : (
                <div className="flashcard-answer">
                  <h2>Answer</h2>
                  <p>{currentCard.answer}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flashcard-controls">
            <button onClick={prevCard} className="btn btn-secondary">
              ← Previous
            </button>
            <button 
              onClick={() => setShowAnswer(!showAnswer)} 
              className="btn btn-primary"
            >
              {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </button>
            <button onClick={nextCard} className="btn btn-secondary">
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FocusMode;
