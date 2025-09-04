import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  Paper,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Schedule as ScheduleIcon,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from '../services/api';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const PostScheduler = () => {
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchScheduledPosts();
  }, []);

  const fetchScheduledPosts = async () => {
    try {
      const response = await api.get('/posts?status=scheduled');
      const posts = response.data.data.posts.map(post => ({
        ...post,
        start: new Date(post.scheduledAt),
        end: new Date(post.scheduledAt),
        title: post.content.substring(0, 50) + (post.content.length > 50 ? '...' : '')
      }));
      setScheduledPosts(posts);
    } catch (error) {
      console.error('Error fetching scheduled posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      facebook: <Facebook sx={{ color: '#1877f2' }} />,
      twitter: <Twitter sx={{ color: '#1da1f2' }} />,
      instagram: <Instagram sx={{ color: '#e4405f' }} />,
      linkedin: <LinkedIn sx={{ color: '#0077b5' }} />
    };
    return icons[platform.toLowerCase()] || <ScheduleIcon />;
  };

  const getUpcomingPosts = () => {
    const now = new Date();
    return scheduledPosts
      .filter(post => new Date(post.scheduledAt) > now)
      .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
      .slice(0, 5);
  };

  const getTodaysPosts = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return scheduledPosts.filter(post => {
      const postDate = new Date(post.scheduledAt);
      return postDate >= today && postDate < tomorrow;
    });
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: '#1976d2',
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Content Scheduler</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          href="/posts"
        >
          Schedule New Post
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Calendar View */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Scheduled Posts Calendar
              </Typography>
              <Box sx={{ height: 600 }}>
                <Calendar
                  localizer={localizer}
                  events={scheduledPosts}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: '100%' }}
                  eventPropGetter={eventStyleGetter}
                  views={['month', 'week', 'day']}
                  defaultView="month"
                  onSelectEvent={(event) => {
                    console.log('Selected event:', event);
                  }}
                  onSelectSlot={(slotInfo) => {
                    setSelectedDate(slotInfo.start);
                  }}
                  selectable
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Today's Posts */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Schedule
              </Typography>
              {getTodaysPosts().length > 0 ? (
                <List>
                  {getTodaysPosts().map((post) => (
                    <ListItem key={post.id} divider>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <ScheduleIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={post.content.substring(0, 60) + '...'}
                        secondary={`${format(new Date(post.scheduledAt), 'HH:mm')} • ${post.platforms.length} platform${post.platforms.length > 1 ? 's' : ''}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="textSecondary" sx={{ py: 2 }}>
                  No posts scheduled for today
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Posts */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Posts
              </Typography>
              {getUpcomingPosts().length > 0 ? (
                <List>
                  {getUpcomingPosts().map((post) => (
                    <ListItem key={post.id} divider>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'warning.main' }}>
                          <ScheduleIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={post.content.substring(0, 50) + '...'}
                        secondary={
                          <Box>
                            <Typography variant="caption" display="block">
                              {format(new Date(post.scheduledAt), 'MMM dd, HH:mm')}
                            </Typography>
                            <Box display="flex" gap={0.5} mt={0.5}>
                              {post.platforms.map((platform) => (
                                <Avatar
                                  key={platform}
                                  sx={{ width: 16, height: 16, bgcolor: 'transparent' }}
                                >
                                  {getPlatformIcon(platform)}
                                </Avatar>
                              ))}
                            </Box>
                          </Box>
                        }
                      />
                      <Box display="flex" flexDirection="column" gap={0.5}>
                        <IconButton size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="textSecondary" sx={{ py: 2 }}>
                  No upcoming posts scheduled
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Scheduling Stats
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Total Scheduled</Typography>
                <Chip label={scheduledPosts.length} color="primary" size="small" />
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">This Week</Typography>
                <Chip 
                  label={scheduledPosts.filter(post => {
                    const postDate = new Date(post.scheduledAt);
                    const weekFromNow = new Date();
                    weekFromNow.setDate(weekFromNow.getDate() + 7);
                    return postDate <= weekFromNow;
                  }).length} 
                  color="warning" 
                  size="small" 
                />
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">This Month</Typography>
                <Chip 
                  label={scheduledPosts.filter(post => {
                    const postDate = new Date(post.scheduledAt);
                    const monthFromNow = new Date();
                    monthFromNow.setMonth(monthFromNow.getMonth() + 1);
                    return postDate <= monthFromNow;
                  }).length} 
                  color="success" 
                  size="small" 
                />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PostScheduler;
