// routes/posts.js
const express = require('express');
const router = express.Router();

// Mock post storage (temporary - replace with database later)
let posts = [
  {
    id: 1,
    userId: 1,
    content: "Welcome to our social media dashboard! 🚀",
    platforms: ["facebook", "twitter"],
    postType: "text",
    status: "published",
    createdAt: new Date("2024-09-01"),
    publishedAt: new Date("2024-09-01")
  },
  {
    id: 2,
    userId: 1,
    content: "Check out our latest features! 📱",
    platforms: ["instagram", "linkedin"],
    postType: "text",
    status: "scheduled",
    scheduledAt: new Date("2024-09-10T10:00:00Z"),
    createdAt: new Date("2024-09-04")
  }
];

// Mock authentication middleware (basic version)
const mockAuth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. No token provided'
    });
  }

  // Mock user - in real app, decode JWT and get user
  req.user = { id: 1, username: 'testuser' };
  next();
};

// GET /api/posts - Get all posts for user
router.get('/', mockAuth, (req, res) => {
  try {
    console.log('Getting posts for user:', req.user.id);
    
    const { page = 1, limit = 10, status } = req.query;
    
    // Filter posts by user
    let userPosts = posts.filter(post => post.userId === req.user.id);
    
    // Filter by status if provided
    if (status) {
      userPosts = userPosts.filter(post => post.status === status);
    }
    
    // Simple pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedPosts = userPosts.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: {
        posts: paginatedPosts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: userPosts.length,
          pages: Math.ceil(userPosts.length / limit)
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
});

// POST /api/posts - Create new post
router.post('/', mockAuth, (req, res) => {
  try {
    console.log('Creating post:', req.body);
    
    const { content, platforms, postType = 'text', scheduledAt } = req.body;
    
    // Basic validation
    if (!content || !platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Content and at least one platform are required'
      });
    }
    
    // Validate platforms
    const validPlatforms = ['facebook', 'instagram', 'twitter', 'linkedin'];
    const invalidPlatforms = platforms.filter(p => !validPlatforms.includes(p));
    if (invalidPlatforms.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Invalid platforms: ${invalidPlatforms.join(', ')}`
      });
    }
    
    // Create new post
    const newPost = {
      id: posts.length + 1,
      userId: req.user.id,
      content,
      platforms,
      postType,
      status: scheduledAt ? 'scheduled' : 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    if (scheduledAt) {
      newPost.scheduledAt = new Date(scheduledAt);
    }
    
    posts.push(newPost);
    
    res.status(201).json({
      success: true,
      data: { post: newPost }
    });
    
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create post'
    });
  }
});

// GET /api/posts/:id - Get single post
router.get('/:id', mockAuth, (req, res) => {
  try {
    const { id } = req.params;
    const post = posts.find(p => p.id === parseInt(id) && p.userId === req.user.id);
    
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
});

// PUT /api/posts/:id - Update post
router.put('/:id', mockAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { content, platforms, postType, scheduledAt } = req.body;
    
    const postIndex = posts.findIndex(p => p.id === parseInt(id) && p.userId === req.user.id);
    
    if (postIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    const post = posts[postIndex];
    
    // Only allow editing draft and scheduled posts
    if (post.status === 'published') {
      return res.status(400).json({
        success: false,
        error: 'Cannot edit published posts'
      });
    }
    
    // Update post
    if (content !== undefined) post.content = content;
    if (platforms !== undefined) post.platforms = platforms;
    if (postType !== undefined) post.postType = postType;
    if (scheduledAt !== undefined) {
      post.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;
      post.status = scheduledAt ? 'scheduled' : 'draft';
    }
    
    post.updatedAt = new Date();
    posts[postIndex] = post;
    
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
});

// DELETE /api/posts/:id - Delete post
router.delete('/:id', mockAuth, (req, res) => {
  try {
    const { id } = req.params;
    const postIndex = posts.findIndex(p => p.id === parseInt(id) && p.userId === req.user.id);
    
    if (postIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    const post = posts[postIndex];
    
    // Only allow deleting draft, scheduled, and failed posts
    if (post.status === 'published') {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete published posts'
      });
    }
    
    posts.splice(postIndex, 1);
    
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
});

// GET /api/posts/scheduled - Get scheduled posts
router.get('/scheduled', mockAuth, (req, res) => {
  try {
    const scheduledPosts = posts.filter(post => 
      post.userId === req.user.id && 
      post.status === 'scheduled' &&
      new Date(post.scheduledAt) >= new Date()
    );
    
    // Sort by scheduled date
    scheduledPosts.sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
    
    res.json({
      success: true,
      data: { posts: scheduledPosts }
    });
    
  } catch (error) {
    console.error('Get scheduled posts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get scheduled posts'
    });
  }
});

module.exports = router;
