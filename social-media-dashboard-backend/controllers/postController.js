const { Post, User } = require('../models');
const { Op } = require('sequelize');

class PostController {
  // Get all posts for authenticated user
  static async getPosts(req, res) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const offset = (page - 1) * limit;
      const whereClause = { user_id: req.user.id };
      if (status) {
        whereClause.status = status;
      }
      const posts = await Post.findAndCountAll({
        where: whereClause,
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
      res.json({
        success: true,
        data: {
          posts: posts.rows,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: posts.count,
            pages: Math.ceil(posts.count / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get posts error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get posts'
      });
    }
  }

  // Create new post
  static async createPost(req, res) {
    try {
      const { content, platforms, postType = 'text', scheduledAt, mediaUrls = [] } = req.body;
      const postData = {
        user_id: req.user.id,
        content,
        platforms,
        post_type: postType,
        media_urls: mediaUrls,
        status: scheduledAt ? 'scheduled' : 'draft'
      };
      if (scheduledAt) {
        postData.scheduled_at = new Date(scheduledAt);
      }
      const post = await Post.create(postData);
      res.status(201).json({
        success: true,
        data: { post }
      });
    } catch (error) {
      console.error('Create post error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create post'
      });
    }
  }

  // Get single post
  static async getPost(req, res) {
    try {
      const { id } = req.params;
      const post = await Post.findOne({
        where: {
          id,
          user_id: req.user.id
        }
      });
      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post not found'
        });
      }
      res.json({
        success: true,
        data: { post }
      });
    } catch (error) {
      console.error('Get post error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get post'
      });
    }
  }

  // Update post
  static async updatePost(req, res) {
    try {
      const { id } = req.params;
      const { content, platforms, postType, scheduledAt, mediaUrls } = req.body;
      const post = await Post.findOne({
        where: {
          id,
          user_id: req.user.id,
          status: { [Op.in]: ['draft', 'scheduled'] }
        }
      });
      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post not found or cannot be edited'
        });
      }
      const updateData = {};
      if (content !== undefined) updateData.content = content;
      if (platforms !== undefined) updateData.platforms = platforms;
      if (postType !== undefined) updateData.post_type = postType;
      if (mediaUrls !== undefined) updateData.media_urls = mediaUrls;
      
      if (scheduledAt !== undefined) {
        updateData.scheduled_at = scheduledAt ? new Date(scheduledAt) : null;
        updateData.status = scheduledAt ? 'scheduled' : 'draft';
      }
      await post.update(updateData);
      res.json({
        success: true,
        data: { post }
      });
    } catch (error) {
      console.error('Update post error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update post'
      });
    }
  }

  // Delete post
  static async deletePost(req, res) {
    try {
      const { id } = req.params;
      const post = await Post.findOne({
        where: {
          id,
          user_id: req.user.id,
          status: { [Op.in]: ['draft', 'scheduled', 'failed'] }
        }
      });
      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post not found or cannot be deleted'
        });
      }
      await post.destroy();
      res.json({
        success: true,
        message: 'Post deleted successfully'
      });
    } catch (error) {
      console.error('Delete post error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete post'
      });
    }
  }

  // Get scheduled posts
  static async getScheduledPosts(req, res) {
    try {
      const posts = await Post.findAll({
        where: {
          user_id: req.user.id,
          status: 'scheduled',
          scheduled_at: {
            [Op.gte]: new Date()
          }
        },
        order: [['scheduled_at', 'ASC']]
      });
      res.json({
        success: true,
        data: { posts }
      });
    } catch (error) {
      console.error('Get scheduled posts error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get scheduled posts'
      });
    }
  }
}

module.exports = PostController;