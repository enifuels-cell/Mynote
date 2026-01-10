const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  biometricCredentials: [{
    credentialID: Buffer,
    publicKey: Buffer,
    counter: Number,
    deviceType: String,
    backedUp: Boolean,
    transports: [String]
  }],
  preferences: {
    theme: {
      type: String,
      default: 'light',
      enum: ['light', 'dark', 'auto']
    },
    defaultView: {
      type: String,
      default: 'grid',
      enum: ['grid', 'list', 'timeline']
    },
    aiAutoOrganize: {
      type: Boolean,
      default: true
    },
    autoSync: {
      type: Boolean,
      default: true
    }
  },
  devices: [{
    deviceId: String,
    deviceName: String,
    lastSynced: Date
  }],
  clipboardHistory: [{
    content: String,
    deviceId: String,
    timestamp: Date
  }],
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
