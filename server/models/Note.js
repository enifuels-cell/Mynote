const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    default: ''
  },
  richContent: {
    type: Object,
    default: {}
  },
  tags: [{
    type: String,
    trim: true
  }],
  attachments: [{
    name: String,
    url: String,
    type: String,
    size: Number
  }],
  voiceNote: {
    url: String,
    duration: Number,
    transcript: String
  },
  aiSummary: {
    type: String,
    default: ''
  },
  aiTags: [{
    type: String,
    trim: true
  }],
  aiCategory: {
    type: String,
    default: ''
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  isSecure: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#ffffff'
  },
  reminder: {
    date: Date,
    message: String,
    isRecurring: Boolean,
    recurringPattern: String
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  lastSynced: {
    type: Date,
    default: Date.now
  },
  deviceId: {
    type: String,
    default: ''
  },
  version: {
    type: Number,
    default: 1
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
NoteSchema.index({ userId: 1, createdAt: -1 });
NoteSchema.index({ userId: 1, tags: 1 });
NoteSchema.index({ userId: 1, isDeleted: 1 });
NoteSchema.index({ 'reminder.date': 1 });

module.exports = mongoose.model('Note', NoteSchema);
