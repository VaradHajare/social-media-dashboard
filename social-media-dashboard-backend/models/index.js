// models/index.js
const { sequelize } = require('../config/database');
const User = require('./User');
const SocialAccount = require('./SocialAccount');
const Post = require('./Post');
const Analytics = require('./Analytics');

// Define associations
User.hasMany(SocialAccount, { foreignKey: 'user_id', as: 'socialAccounts' });
SocialAccount.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Post, { foreignKey: 'user_id', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
SocialAccount.hasMany(Analytics, { foreignKey: 'social_account_id', as: 'analytics' });
Analytics.belongsTo(SocialAccount, { foreignKey: 'social_account_id', as: 'socialAccount' });

module.exports = {
  sequelize,
  User,
  SocialAccount,
  Post,
  Analytics
};