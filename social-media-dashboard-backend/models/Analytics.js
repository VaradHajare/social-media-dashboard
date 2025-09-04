// models/Analytics.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Analytics = sequelize.define('Analytics', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  social_account_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'social_accounts',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  followers_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  following_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  posts_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  likes_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  comments_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  shares_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  reach: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  impressions: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  engagement_rate: {
    type: DataTypes.DECIMAL(5, 4),
    defaultValue: 0.0000
  }
}, {
  tableName: 'analytics',
  indexes: [
    { fields: ['social_account_id'] },
    { fields: ['date'] },
    { fields: ['social_account_id', 'date'], unique: true }
  ]
});

module.exports = Analytics;