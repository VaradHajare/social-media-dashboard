import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Avatar
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn
} from '@mui/icons-material';

const Analytics = () => {
  const platforms = [
    {
      name: 'Facebook',
      icon: <Facebook sx={{ color: '#1877f2' }} />,
      followers: 850,
      engagement: 65,
      posts: 12,
      trend: 'up'
    },
    {
      name: 'Instagram',
      icon: <Instagram sx={{ color: '#e4405f' }} />,
      followers: 1200,
      engagement: 78,
      posts: 15,
      trend: 'up'
    },
    {
      name: 'Twitter',
      icon: <Twitter sx={{ color: '#1da1f2' }} />,
      followers: 650,
      engagement: 45,
      posts: 20,
      trend: 'down'
    },
    {
      name: 'LinkedIn',
      icon: <LinkedIn sx={{ color: '#0077b5' }} />,
      followers: 420,
      engagement: 55,
      posts: 8,
      trend: 'up'
    }
  ];

  const PlatformCard = ({ platform }) => (
    <Card elevation={3}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ mr: 2, bgcolor: 'transparent' }}>
            {platform.icon}
          </Avatar>
          <Typography variant="h6">{platform.name}</Typography>
          <Box ml="auto">
            {platform.trend === 'up' ? (
              <TrendingUp color="success" />
            ) : (
              <TrendingDown color="error" />
            )}
          </Box>
        </Box>
        
        <Box mb={2}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Followers
          </Typography>
          <Typography variant="h4" color="primary">
            {platform.followers.toLocaleString()}
          </Typography>
        </Box>

        <Box mb={2}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">Engagement Rate</Typography>
            <Typography variant="body2">{platform.engagement}%</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={platform.engagement} 
            sx={{ height: 6, borderRadius: 3 }}
            color={platform.engagement > 60 ? 'success' : platform.engagement > 40 ? 'warning' : 'error'}
          />
        </Box>

        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2" color="textSecondary">
            Posts this month
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {platform.posts}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={4}>
        <Typography variant="h3" gutterBottom>
          📊 Analytics Dashboard
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Track your social media performance across all platforms
        </Typography>
      </Box>

      {/* Overview Stats */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary" gutterBottom>
                3.1K
              </Typography>
              <Typography variant="h6">Total Followers</Typography>
              <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                +12% this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="secondary" gutterBottom>
                55
              </Typography>
              <Typography variant="h6">Total Posts</Typography>
              <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                +8% this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="success.main" gutterBottom>
                61%
              </Typography>
              <Typography variant="h6">Avg. Engagement</Typography>
              <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                +5% this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="info.main" gutterBottom>
                15K
              </Typography>
              <Typography variant="h6">Total Reach</Typography>
              <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                +15% this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Platform Analytics */}
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Platform Performance
      </Typography>
      
      <Grid container spacing={3}>
        {platforms.map((platform) => (
          <Grid item xs={12} md={6} key={platform.name}>
            <PlatformCard platform={platform} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Analytics;
