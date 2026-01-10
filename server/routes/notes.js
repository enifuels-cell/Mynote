const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// Get all notes for a user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    const notes = await Note.find({ 
      userId, 
      isDeleted: false 
    }).sort({ lastModified: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single note
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || note.isDeleted) {
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
    const note = new Note(req.body);
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a note
router.put('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || note.isDeleted) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    Object.assign(note, req.body);
    note.lastModified = new Date();
    note.version += 1;
    
    await note.save();
    res.json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a note (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    note.isDeleted = true;
    note.lastModified = new Date();
    await note.save();
    
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search notes
router.get('/search/query', async (req, res) => {
  try {
    const { userId, q } = req.query;
    const notes = await Note.find({
      userId,
      isDeleted: false,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ]
    }).sort({ lastModified: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get notes by tag
router.get('/tags/:tag', async (req, res) => {
  try {
    const { userId } = req.query;
    const notes = await Note.find({
      userId,
      isDeleted: false,
      tags: req.params.tag
    }).sort({ lastModified: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get timeline data
router.get('/timeline/data', async (req, res) => {
  try {
    const { userId } = req.query;
    const notes = await Note.aggregate([
      { $match: { userId, isDeleted: false } },
      { 
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          notes: { $push: '$$ROOT' }
        }
      },
      { $sort: { _id: -1 } }
    ]);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
