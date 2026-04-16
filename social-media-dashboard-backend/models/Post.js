// models/Post.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Post = sequelize.define('Post', {
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
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 5000]
    }
  },
  media_urls: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  platforms: {
    type: DataTypes.JSONB,
    allowNull: false,
    validate: {
      isArrayOfStrings(value) {
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error('Platforms must be a non-empty array');
        }
        const validPlatforms = ['facebook', 'instagram', 'twitter', 'linkedin'];
        value.forEach(platform => {
          if (!validPlatforms.includes(platform)) {
            throw new Error(`Invalid platform: ${platform}`);
          }
        });
      }
    }
  },
  post_type: {
    type: DataTypes.ENUM('text', 'image', 'video', 'story'),
    defaultValue: 'text'
  },
  scheduled_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  published_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'scheduled', 'published', 'failed'),
    defaultValue: 'draft'
  },
  platform_post_ids: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  error_message: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'posts',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['status'] },
    { fields: ['scheduled_at'] },
    { fields: ['published_at'] }
  ]
});

module.exports = Post;