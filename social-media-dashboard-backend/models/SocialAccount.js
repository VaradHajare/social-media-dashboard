 // models/SocialAccount.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SocialAccount = sequelize.define('SocialAccount', {
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
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  platform: {
    type: DataTypes.ENUM('facebook', 'instagram', 'twitter', 'linkedin'),
    allowNull: false
  },
  account_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  account_id: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  access_token: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  refresh_token: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  token_expires_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  account_data: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'social_accounts',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['platform'] },
    { fields: ['user_id', 'platform'], unique: true }
  ]
});

module.exports = SocialAccount;