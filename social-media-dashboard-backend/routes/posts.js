const express = require('express');

const router = express.Router();

let posts = [
  {
    id: 1,
    userId: 1,
    content: 'Welcome to our social media dashboard.',
    platforms: ['facebook', 'twitter'],
    postType: 'text',
    status: 'published',
    createdAt: new Date('2024-09-01'),
    publishedAt: new Date('2024-09-01')
  },
  {
    id: 2,
    userId: 1,
    content: 'Check out our latest features.',
    platforms: ['instagram', 'linkedin'],
    postType: 'text',
    status: 'scheduled',
    scheduledAt: new Date('2027-09-10T10:00:00Z'),
    createdAt: new Date('2027-09-04')
  }
];

const mockAuth = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. No token provided'
    });
  }

  const token = authHeader.replace('Bearer ', '');
  const [, , rawUserId] = token.split('_');
  const userId = Number.parseInt(rawUserId, 10);

  if (Number.isNaN(userId)) {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }

  req.user = { id: userId, username: 'testuser' };
  next();
};

router.get('/', mockAuth, (req, res) => {
  try {
    const page = Number.parseInt(req.query.page || '1', 10);
    const limit = Number.parseInt(req.query.limit || '10', 10);
    const { status } = req.query;

    let userPosts = posts.filter((post) => post.userId === req.user.id);

    if (status) {
      userPosts = userPosts.filter((post) => post.status === status);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = userPosts.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        posts: paginatedPosts,
        pagination: {
          page,
          limit,
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

router.post('/', mockAuth, (req, res) => {
  try {
    const { content, platforms, postType = 'text', scheduledAt } = req.body;

    if (!content || !platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Content and at least one platform are required'
      });
    }

    const validPlatforms = ['facebook', 'instagram', 'twitter', 'linkedin'];
    const invalidPlatforms = platforms.filter((platform) => !validPlatforms.includes(platform));

    if (invalidPlatforms.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Invalid platforms: ${invalidPlatforms.join(', ')}`
      });
    }

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

router.get('/scheduled', mockAuth, (req, res) => {
  try {
    const scheduledPosts = posts
      .filter(
        (post) =>
          post.userId === req.user.id &&
          post.status === 'scheduled' &&
          new Date(post.scheduledAt) >= new Date()
      )
      .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));

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

router.get('/:id', mockAuth, (req, res) => {
  try {
    const postId = Number.parseInt(req.params.id, 10);
    const post = posts.find((item) => item.id === postId && item.userId === req.user.id);

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

router.put('/:id', mockAuth, (req, res) => {
  try {
    const postId = Number.parseInt(req.params.id, 10);
    const { content, platforms, postType, scheduledAt } = req.body;
    const postIndex = posts.findIndex((item) => item.id === postId && item.userId === req.user.id);

    if (postIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    const post = posts[postIndex];

    if (post.status === 'published') {
      return res.status(400).json({
        success: false,
        error: 'Cannot edit published posts'
      });
    }

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

router.delete('/:id', mockAuth, (req, res) => {
  try {
    const postId = Number.parseInt(req.params.id, 10);
    const postIndex = posts.findIndex((item) => item.id === postId && item.userId === req.user.id);

    if (postIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    const post = posts[postIndex];

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

module.exports = router;
