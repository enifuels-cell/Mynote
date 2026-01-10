const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// Mock AI summarization (in production, use OpenAI or similar)
async function generateSummary(text) {
  // This is a simplified implementation
  // In production, integrate with OpenAI API or similar service
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const summary = sentences.slice(0, 2).join('. ') + '.';
  return summary || 'No summary available';
}

// Mock AI tag generation
async function generateTags(text) {
  // Simplified implementation - extract key words
  const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
  const frequency = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  const sortedWords = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(entry => entry[0]);
  
  return sortedWords;
}

// Mock AI categorization
async function categorizeNote(text) {
  const categories = ['work', 'personal', 'ideas', 'todo', 'meeting', 'project', 'research'];
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('meeting') || lowerText.includes('agenda')) return 'meeting';
  if (lowerText.includes('todo') || lowerText.includes('task')) return 'todo';
  if (lowerText.includes('idea') || lowerText.includes('brainstorm')) return 'ideas';
  if (lowerText.includes('project') || lowerText.includes('plan')) return 'project';
  if (lowerText.includes('research') || lowerText.includes('study')) return 'research';
  
  return 'general';
}

// Generate AI summary for a note
router.post('/summarize/:noteId', async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    const summary = await generateSummary(note.content);
    note.aiSummary = summary;
    await note.save();
    
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auto-organize notes with AI
router.post('/organize/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const notes = await Note.find({ userId, isDeleted: false });
    
    const updates = [];
    for (const note of notes) {
      if (!note.content) continue;
      
      const aiTags = await generateTags(note.content);
      const aiCategory = await categorizeNote(note.content);
      
      note.aiTags = aiTags;
      note.aiCategory = aiCategory;
      
      // Merge AI tags with user tags
      const allTags = [...new Set([...note.tags, ...aiTags.slice(0, 3)])];
      note.tags = allTags;
      
      await note.save();
      updates.push({
        id: note._id,
        aiTags,
        aiCategory
      });
    }
    
    res.json({ 
      success: true, 
      organized: updates.length,
      updates 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate smart reminders based on content
router.post('/smart-reminder/:noteId', async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    // Simple keyword-based reminder detection
    const content = note.content.toLowerCase();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    
    let reminderDate = null;
    let reminderMessage = '';
    
    if (content.includes('tomorrow') || content.includes('next day')) {
      reminderDate = tomorrow;
      reminderMessage = 'Reminder for tomorrow';
    } else if (content.includes('next week')) {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      nextWeek.setHours(9, 0, 0, 0);
      reminderDate = nextWeek;
      reminderMessage = 'Reminder for next week';
    }
    
    if (reminderDate) {
      note.reminder = {
        date: reminderDate,
        message: reminderMessage,
        isRecurring: false
      };
      await note.save();
      res.json({ reminder: note.reminder });
    } else {
      res.json({ message: 'No time reference found in note' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get AI insights for all notes
router.get('/insights/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const notes = await Note.find({ userId, isDeleted: false });
    
    const tagFrequency = {};
    const categoryCount = {};
    
    notes.forEach(note => {
      note.tags.forEach(tag => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
      });
      
      if (note.aiCategory) {
        categoryCount[note.aiCategory] = (categoryCount[note.aiCategory] || 0) + 1;
      }
    });
    
    const topTags = Object.entries(tagFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    res.json({
      totalNotes: notes.length,
      topTags,
      categories: categoryCount,
      lastUpdated: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
