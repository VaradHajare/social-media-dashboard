import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const EngagementChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Facebook',
        data: [4.1, 4.3, 4.0, 4.5, 4.2, 4.8],
        borderColor: '#1877f2',
        backgroundColor: 'rgba(24, 119, 242, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Instagram',
        data: [6.2, 6.5, 6.8, 7.1, 6.9, 7.3],
        borderColor: '#e4405f',
        backgroundColor: 'rgba(228, 64, 95, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Twitter',
        data: [2.8, 3.2, 3.0, 3.4, 3.1, 3.6],
        borderColor: '#1da1f2',
        backgroundColor: 'rgba(29, 161, 242, 0.1)',
        tension: 0.4,
      },
      {
        label: 'LinkedIn',
        data: [5.1, 5.3, 5.6, 5.2, 5.4, 5.8],
        borderColor: '#0077b5',
        backgroundColor: 'rgba(0, 119, 181, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Engagement Rate (%)',
        },
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default EngagementChart;
