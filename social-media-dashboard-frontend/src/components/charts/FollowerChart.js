import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FollowerChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Facebook',
        data: [1200, 1450, 1380, 1670, 1520, 1800],
        backgroundColor: '#1877f2',
      },
      {
        label: 'Instagram',
        data: [980, 1120, 1340, 1290, 1450, 1620],
        backgroundColor: '#e4405f',
      },
      {
        label: 'Twitter',
        data: [567, 623, 701, 589, 634, 720],
        backgroundColor: '#1da1f2',
      },
      {
        label: 'LinkedIn',
        data: [234, 278, 312, 289, 345, 380],
        backgroundColor: '#0077b5',
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
          text: 'New Followers',
        },
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default FollowerChart;
