import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat
} from '@mui/icons-material';

const MetricCard = ({ title, value, change, icon, color = 'primary' }) => {
  const getTrendIcon = () => {
    if (change > 0) return <TrendingUp sx={{ fontSize: 16 }} />;
    if (change < 0) return <TrendingDown sx={{ fontSize: 16 }} />;
    return <TrendingFlat sx={{ fontSize: 16 }} />;
  };

  const getTrendColor = () => {
    if (change > 0) return 'success';
    if (change < 0) return 'error';
    return 'default';
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Box sx={{ fontSize: 24, color: `${color}.main` }}>
            {icon}
          </Box>
        </Box>
        
        <Typography variant="h4" component="div" gutterBottom>
          {value?.toLocaleString() || 0}
        </Typography>
        
        {change !== undefined && (
          <Chip
            icon={getTrendIcon()}
            label={`${Math.abs(change)}%`}
            color={getTrendColor()}
            size="small"
            variant="outlined"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
