import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  TrendingUp,
  People,
  PostAdd,
  Schedule
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPosts: 0,
    scheduledPosts: 0,
    publishedPosts: 0,
    totalFollowers: 0
  });

  useEffect(() => {
    // Simulate loading stats
    setTimeout(() => {
      setStats({
        totalPosts: 25,
        scheduledPosts: 8,
        publishedPosts: 17,
        totalFollowers: 1250
      });
    }, 1000);
  }, []);

  const MetricCard = ({ title, value, icon, color = 'primary', trend }) => (
    <Card elevation={3}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" color={`${color}.main`} gutterBottom>
              {value}
            </Typography>
            <Typography variant="h6" color="textSecondary">
              {title}
            </Typography>
            {trend && (
              <Chip 
                label={trend} 
                size="small" 
                color="success" 
                sx={{ mt: 1 }}
              />
            )}
          </Box>
          <Box
            sx={{
              p: 2,
              borderRadius: '50%',
              backgroundColor: `${color}.light`,
              color: `${color}.main`
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Welcome Section */}
      <Box mb={4}>
        <Typography variant="h3" gutterBottom>
          Welcome back, {user?.firstName}! 👋
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Here's what's happening with your social media accounts
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Posts"
            value={stats.totalPosts}
            icon={<PostAdd />}
            color="primary"
            trend="+12%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Scheduled"
            value={stats.scheduledPosts}
            icon={<Schedule />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Published"
            value={stats.publishedPosts}
            icon={<TrendingUp />}
            color="success"
            trend="+8%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Followers"
            value={stats.totalFollowers}
            icon={<People />}
            color="info"
            trend="+5%"
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                📈 Recent Activity
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Your posts are performing well this week
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Engagement Rate
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={75} 
                    sx={{ height: 8, borderRadius: 4 }} 
                  />
                  <Typography variant="caption" color="textSecondary">
                    75% (Great!)
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                🎯 Quick Stats
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Posts This Week</Typography>
                  <Typography variant="body2" fontWeight="bold">12</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Avg. Likes per Post</Typography>
                  <Typography variant="body2" fontWeight="bold">45</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Best Performing Platform</Typography>
                  <Typography variant="body2" fontWeight="bold">Instagram</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Next Scheduled Post</Typography>
                  <Typography variant="body2" fontWeight="bold">Tomorrow 2PM</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
