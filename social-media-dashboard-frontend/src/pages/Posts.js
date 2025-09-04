import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
  Fab,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  Publish as PublishIcon,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import PostCard from '../components/PostCard';
import api from '../services/api';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    content: '',
    platforms: [],
    postType: 'text',
    scheduledAt: null
  });

  const platformOptions = [
    { value: 'facebook', label: 'Facebook', icon: <Facebook />, color: '#1877f2' },
    { value: 'twitter', label: 'Twitter', icon: <Twitter />, color: '#1da1f2' },
    { value: 'instagram', label: 'Instagram', icon: <Instagram />, color: '#e4405f' },
    { value: 'linkedin', label: 'LinkedIn', icon: <LinkedIn />, color: '#0077b5' }
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data.data.posts);
    } catch (error) {
      showSnackbar('Error fetching posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = (post = null) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        content: post.content,
        platforms: post.platforms || [],
        postType: post.postType || 'text',
        scheduledAt: post.scheduledAt ? new Date(post.scheduledAt) : null
      });
    } else {
      setEditingPost(null);
      setFormData({
        content: '',
        platforms: [],
        postType: 'text',
        scheduledAt: null
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPost(null);
    setFormData({
      content: '',
      platforms: [],
      postType: 'text',
      scheduledAt: null
    });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.content.trim()) {
        showSnackbar('Content is required', 'error');
        return;
      }
      if (formData.platforms.length === 0) {
        showSnackbar('Please select at least one platform', 'error');
        return;
      }

      const submitData = {
        content: formData.content,
        platforms: formData.platforms,
        postType: formData.postType,
        scheduledAt: formData.scheduledAt?.toISOString()
      };

      if (editingPost) {
        await api.put(`/posts/${editingPost.id}`, submitData);
        showSnackbar('Post updated successfully');
      } else {
        await api.post('/posts', submitData);
        showSnackbar('Post created successfully');
      }

      handleCloseDialog();
      fetchPosts();
    } catch (error) {
      showSnackbar(error.response?.data?.error || 'Error saving post', 'error');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      showSnackbar('Post deleted successfully');
      fetchPosts();
    } catch (error) {
      showSnackbar('Error deleting post', 'error');
    }
  };

  const handlePlatformChange = (platform) => {
    const updatedPlatforms = formData.platforms.includes(platform)
      ? formData.platforms.filter(p => p !== platform)
      : [...formData.platforms, platform];
    
    setFormData({ ...formData, platforms: updatedPlatforms });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'success';
      case 'scheduled': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4">Posts Management</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Create Post
          </Button>
        </Box>

        {loading ? (
          <Typography>Loading posts...</Typography>
        ) : (
          <Grid container spacing={3}>
            {posts.map((post) => (
              <Grid item xs={12} md={6} lg={4} key={post.id}>
                <PostCard 
                  post={post} 
                  onEdit={() => handleOpenDialog(post)}
                  onDelete={() => handleDeletePost(post.id)}
                />
              </Grid>
            ))}
            {posts.length === 0 && (
              <Grid item xs={12}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      No posts yet
                    </Typography>
                    <Typography variant="body2" color="textSecondary" mb={2}>
                      Create your first post to get started with social media management
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenDialog()}
                    >
                      Create First Post
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        )}

        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => handleOpenDialog()}
        >
          <AddIcon />
        </Fab>

        {/* Create/Edit Post Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingPost ? 'Edit Post' : 'Create New Post'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Post Content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                margin="normal"
                placeholder="What's on your mind?"
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Post Type</InputLabel>
                <Select
                  value={formData.postType}
                  label="Post Type"
                  onChange={(e) => setFormData({ ...formData, postType: e.target.value })}
                >
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="image">Image</MenuItem>
                  <MenuItem value="video">Video</MenuItem>
                  <MenuItem value="story">Story</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Select Platforms
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {platformOptions.map((platform) => (
                  <Chip
                    key={platform.value}
                    icon={platform.icon}
                    label={platform.label}
                    onClick={() => handlePlatformChange(platform.value)}
                    color={formData.platforms.includes(platform.value) ? 'primary' : 'default'}
                    variant={formData.platforms.includes(platform.value) ? 'filled' : 'outlined'}
                    sx={{ 
                      borderColor: platform.color,
                      '&.MuiChip-colorPrimary': { backgroundColor: platform.color }
                    }}
                  />
                ))}
              </Box>

              <DateTimePicker
                label="Schedule For (Optional)"
                value={formData.scheduledAt}
                onChange={(newValue) => setFormData({ ...formData, scheduledAt: newValue })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    margin="normal"
                    helperText="Leave empty to save as draft"
                  />
                )}
                minDateTime={new Date()}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingPost ? 'Update' : 'Create'} Post
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
};

export default Posts;
