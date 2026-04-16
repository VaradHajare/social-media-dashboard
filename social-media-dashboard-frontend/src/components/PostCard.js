import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  AccessTime,
  CheckCircle,
  Error,
  Article
} from '@mui/icons-material';

const PostCard = ({ post, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      facebook: <Facebook sx={{ color: '#1877f2' }} />,
      twitter: <Twitter sx={{ color: '#1da1f2' }} />,
      instagram: <Instagram sx={{ color: '#e4405f' }} />,
      linkedin: <LinkedIn sx={{ color: '#0077b5' }} />
    };
    return icons[platform?.toLowerCase()] || null;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published':
        return <CheckCircle color="success" />;
      case 'scheduled':
        return <Schedule color="warning" />;
      case 'failed':
        return <Error color="error" />;
      default:
        return <Article color="action" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'success';
      case 'scheduled': return 'warning'; 
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Default values for safer rendering
  const safePost = {
    status: 'draft',
    content: 'No content',
    platforms: [],
    ...post
  };

  const canEdit = ['draft', 'scheduled'].includes(safePost.status);
  const canDelete = ['draft', 'scheduled', 'failed'].includes(safePost.status);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            {getStatusIcon(safePost.status)}
            <Chip
              label={safePost.status?.charAt(0).toUpperCase() + safePost.status?.slice(1)}
              color={getStatusColor(safePost.status)}
              size="small"
            />
          </Box>
          {(canEdit || canDelete) && (
            <IconButton
              size="small"
              onClick={handleMenuClick}
            >
              <MoreIcon />
            </IconButton>
          )}
        </Box>

        {/* Content */}
        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
          {safePost.content?.length > 150 
            ? `${safePost.content.substring(0, 150)}...` 
            : safePost.content}
        </Typography>

        {/* Platforms */}
        {safePost.platforms?.length > 0 && (
          <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
            {safePost.platforms.map((platform, index) => (
              <Avatar
                key={`${platform}-${index}`}
                sx={{ width: 24, height: 24, bgcolor: 'transparent' }}
              >
                {getPlatformIcon(platform)}
              </Avatar>
            ))}
          </Box>
        )}

        <Divider sx={{ my: 1 }} />

        {/* Dates */}
        <Box>
          {safePost.scheduledAt && (
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <AccessTime fontSize="small" color="action" />
              <Typography variant="caption" color="textSecondary">
                Scheduled: {formatDate(safePost.scheduledAt)}
              </Typography>
            </Box>
          )}
          
          {safePost.publishedAt && (
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <CheckCircle fontSize="small" color="success" />
              <Typography variant="caption" color="textSecondary">
                Published: {formatDate(safePost.publishedAt)}
              </Typography>
            </Box>
          )}

          <Typography variant="caption" color="textSecondary">
            Created: {formatDate(safePost.createdAt)}
          </Typography>
        </Box>

        {/* Error message */}
        {safePost.status === 'failed' && safePost.errorMessage && (
          <Box mt={1}>
            <Typography variant="caption" color="error">
              Error: {safePost.errorMessage}
            </Typography>
          </Box>
        )}
      </CardContent>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {canEdit && (
          <MenuItem
            onClick={() => {
              onEdit && onEdit();
              handleMenuClose();
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}
        
        {canDelete && (
          <MenuItem
            onClick={() => {
              onDelete && onDelete();
              handleMenuClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
};

export default PostCard;
