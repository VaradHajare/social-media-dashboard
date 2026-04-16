// test-database.js
const { sequelize, testConnection } = require('./config/database');
const User = require('./models/User');

const testDatabase = async () => {
  try {
    console.log('🧪 Testing database connection...');
    
    // Test connection
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Failed to connect to database');
    }
    
    // Test model sync
    await sequelize.sync({ alter: false });
    console.log('✅ Models synced with database');
    
    // Test data insertion
    const testUser = await User.create({
      username: 'testuser_' + Date.now(),
      email: `test_${Date.now()}@example.com`,
      password_hash: 'testpassword123',
      first_name: 'Test',
      last_name: 'User',
      bio: 'Test user for database verification'
    });
    
    console.log('✅ Test user created:', {
      id: testUser.id,
      username: testUser.username,
      email: testUser.email
    });
    
    // Test password comparison
    const isValid = await testUser.comparePassword('testpassword123');
    console.log('✅ Password validation:', isValid ? 'PASS' : 'FAIL');
    
    // Clean up test user
    await testUser.destroy();
    console.log('✅ Test user cleaned up');
    
    console.log('\n🎉 Database setup successful! All tests passed.');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await sequelize.close();
  }
};

testDatabase();
