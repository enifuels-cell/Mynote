const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'password'
  },
  theme: {
    type: DataTypes.ENUM('light', 'dark', 'auto'),
    defaultValue: 'light'
  },
  default_view: {
    type: DataTypes.ENUM('grid', 'list', 'timeline'),
    defaultValue: 'grid'
  },
  ai_auto_organize: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  auto_sync: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  email_verified_at: {
    type: DataTypes.DATE,
    defaultValue: null
  },
  last_login: {
    type: DataTypes.DATE,
    defaultValue: null
  },
  remember_token: {
    type: DataTypes.STRING(100),
    defaultValue: null
  }
}, {
  timestamps: true,
  tableName: 'users',
  underscored: true
});

module.exports = User;
