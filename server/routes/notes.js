const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { Op } = require('sequelize');

// Get all notes for a user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    const notes = await Note.findAll({ 
      where: {
        user_id: userId,
        deleted_at: null
      },
      order: [['updated_at', 'DESC']]
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single note
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note || note.deleted_at) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new note
router.post('/', async (req, res) => {
  try {
    const noteData = { ...req.body };
    
    console.log('Received note data:', noteData);
    
    // Map userId to user_id if needed
    if (noteData.userId && !noteData.user_id) {
      noteData.user_id = noteData.userId;
      delete noteData.userId;
    }
    
    console.log('Final note data:', noteData);
    
    const note = await Note.create(noteData);
    res.status(201).json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update a note
router.put('/:id', async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note || note.deleted_at) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    await note.update({
      ...req.body,
      updated_at: new Date(),
      version: note.version + 1
    });
    
    res.json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a note (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    await note.destroy(); // Sequelize soft delete with paranoid: true
    
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search notes
router.get('/search/query', async (req, res) => {
  try {
    const { userId, q } = req.query;
    const notes = await Note.findAll({
      where: {
        user_id: userId,
        deleted_at: null,
        [Op.or]: [
          { title: { [Op.like]: `%${q}%` } },
          { content: { [Op.like]: `%${q}%` } }
        ]
      },
      order: [['updated_at', 'DESC']]
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get notes by tag
router.get('/tags/:tag', async (req, res) => {
  try {
    const { userId } = req.query;
    const notes = await Note.findAll({
      where: {
        user_id: userId,
        deleted_at: null
      },
      order: [['updated_at', 'DESC']]
    });
    
    // Filter by tag in JSON array
    const filteredNotes = notes.filter(note => {
      const tags = note.tags || [];
      return tags.includes(req.params.tag);
    });
    
    res.json(filteredNotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get timeline data
router.get('/timeline/data', async (req, res) => {
  try {
    const { userId } = req.query;
    const notes = await Note.findAll({
      where: {
        user_id: userId,
        deleted_at: null
      },
      order: [['created_at', 'DESC']]
    });
    
    // Group by date
    const groupedNotes = notes.reduce((acc, note) => {
      const date = note.created_at.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { _id: date, count: 0, notes: [] };
      }
      acc[date].count++;
      acc[date].notes.push(note);
      return acc;
    }, {});
    
    res.json(Object.values(groupedNotes));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
