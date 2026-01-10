const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateRegistrationOptions, verifyRegistrationResponse, generateAuthenticationOptions, verifyAuthenticationResponse } = require('@simplewebauthn/server');

// Register user
router.post('/register', async (req, res) => {
  try {
    const { email, username, passwordHash } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const user = new User({ email, username, passwordHash });
    await user.save();
    
    res.status(201).json({ 
      userId: user._id, 
      username: user.username,
      email: user.email 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, passwordHash } = req.body;
    
    const user = await User.findOne({ username, passwordHash });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    user.lastLogin = new Date();
    await user.save();
    
    res.json({ 
      userId: user._id, 
      username: user.username,
      email: user.email,
      preferences: user.preferences
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Generate biometric registration options
router.post('/biometric/register-options', async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const options = await generateRegistrationOptions({
      rpName: 'Mynote',
      rpID: 'localhost',
      userID: user._id.toString(),
      userName: user.username,
      attestationType: 'none',
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        requireResidentKey: false,
        userVerification: 'preferred',
      },
    });
    
    res.json(options);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify biometric registration
router.post('/biometric/register-verify', async (req, res) => {
  try {
    const { userId, credential } = req.body;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Store credential (simplified for this implementation)
    user.biometricCredentials.push({
      credentialID: Buffer.from(credential.id),
      publicKey: Buffer.from(credential.publicKey),
      counter: 0,
      deviceType: credential.deviceType || 'unknown'
    });
    
    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user preferences
router.put('/preferences/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.preferences = { ...user.preferences, ...req.body };
    await user.save();
    
    res.json(user.preferences);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
