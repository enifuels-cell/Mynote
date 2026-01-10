const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// Email webhook to create notes
router.post('/webhook', async (req, res) => {
  try {
    const { from, subject, body, userId } = req.body;
    
    // Create note from email
    const note = new Note({
      title: subject || 'Email Note',
      content: body,
      tags: ['email', 'imported'],
      userId: userId || 'default-user', // Should be mapped from email
      aiCategory: 'email'
    });
    
    await note.save();
    
    res.status(201).json({ 
      success: true, 
      noteId: note._id,
      message: 'Note created from email'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Configure email forwarding settings
router.post('/configure', async (req, res) => {
  try {
    const { userId, emailAddress, forwardingEnabled } = req.body;
    
    // In production, this would set up email forwarding rules
    // For now, just return a unique email address for forwarding
    const forwardingEmail = `notes-${userId}@mynote.app`;
    
    res.json({
      success: true,
      forwardingEmail,
      message: 'Email-to-notes configured'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
