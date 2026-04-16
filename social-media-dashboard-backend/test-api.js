const axios = require('axios');
const API_BASE = 'http://localhost:5000/api';

const testAPI = async () => {
  try {
    // Test health endpoint
    console.log('Testing health endpoint...');
    const health = await axios.get('http://localhost:5000/health');
    console.log('✅ Health check:', health.data);

    // Test user registration
    console.log('\nTesting user registration...');
    const registerRes = await axios.post(`${API_BASE}/auth/register`, {
      username: 'testuser',
      email: 'test@example.com',
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User'
    });
    console.log('✅ Registration successful:', registerRes.data);

    const { token } = registerRes.data.data;

    // Test protected route
    console.log('\nTesting protected route...');
    const meRes = await axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Get user profile:', meRes.data);

    // Test post creation
    console.log('\nTesting post creation...');
    const postRes = await axios.post(`${API_BASE}/posts`, {
      content: 'This is a test post!',
      platforms: ['facebook', 'twitter'],
      postType: 'text'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Post created:', postRes.data);
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

// Run tests if PostgreSQL is running
testAPI();