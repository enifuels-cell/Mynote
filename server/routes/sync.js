const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const User = require('../models/User');

// Sync notes from client to server
router.post('/notes', async (req, res) => {
  try {
    const { userId, notes, deviceId } = req.body;
    const syncResults = [];
    
    for (const clientNote of notes) {
      const serverNote = await Note.findById(clientNote._id);
      
      if (!serverNote) {
        // New note from client
        const newNote = new Note({ ...clientNote, lastSynced: new Date() });
        await newNote.save();
        syncResults.push({ id: clientNote._id, status: 'created', note: newNote });
      } else {
        // Check for conflicts
        if (serverNote.version > clientNote.version) {
          // Server has newer version
          syncResults.push({ id: clientNote._id, status: 'conflict', note: serverNote });
        } else if (serverNote.lastModified < new Date(clientNote.lastModified)) {
          // Client has newer version
          Object.assign(serverNote, clientNote);
          serverNote.lastSynced = new Date();
          serverNote.deviceId = deviceId;
          await serverNote.save();
          syncResults.push({ id: clientNote._id, status: 'updated', note: serverNote });
        } else {
          // Already in sync
          syncResults.push({ id: clientNote._id, status: 'synced', note: serverNote });
        }
      }
    }
    
    res.json({ 
      success: true, 
      syncResults,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get notes modified after a certain timestamp
router.get('/notes', async (req, res) => {
  try {
    const { userId, since } = req.query;
    const query = { userId, isDeleted: false };
    
    if (since) {
      query.lastModified = { $gt: new Date(since) };
    }
    
    const notes = await Note.find(query).sort({ lastModified: -1 });
    res.json({ notes, timestamp: new Date() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sync clipboard across devices
router.post('/clipboard', async (req, res) => {
  try {
    const { userId, content, deviceId } = req.body;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Add to clipboard history (keep last 50 items)
    user.clipboardHistory.unshift({
      content,
      deviceId,
      timestamp: new Date()
    });
    
    if (user.clipboardHistory.length > 50) {
      user.clipboardHistory = user.clipboardHistory.slice(0, 50);
    }
    
    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get clipboard history
router.get('/clipboard/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user.clipboardHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register device
router.post('/device', async (req, res) => {
  try {
    const { userId, deviceId, deviceName } = req.body;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const existingDevice = user.devices.find(d => d.deviceId === deviceId);
    if (existingDevice) {
      existingDevice.lastSynced = new Date();
    } else {
      user.devices.push({
        deviceId,
        deviceName,
        lastSynced: new Date()
      });
    }
    
    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
