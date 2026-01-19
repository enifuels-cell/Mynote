const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Note = sequelize.define('Note', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT('long'),
    defaultValue: null
  },
  rich_content: {
    type: DataTypes.JSON,
    defaultValue: null
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: null
  },
  ai_summary: {
    type: DataTypes.TEXT('long'),
    defaultValue: null
  },
  ai_tags: {
    type: DataTypes.JSON,
    defaultValue: null
  },
  ai_category: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  is_pinned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_archived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_secure: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: '#ffffff'
  },
  reminder_date: {
    type: DataTypes.DATE,
    defaultValue: null
  },
  reminder_message: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  is_reminder_recurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  reminder_pattern: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  device_id: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  deleted_at: {
    type: DataTypes.DATE,
    defaultValue: null
  }
}, {
  timestamps: true,
  tableName: 'notes',
  underscored: true,
  paranoid: true
});

module.exports = Note;
