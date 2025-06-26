// test.js - Simple test script for Monday.com integration
require('dotenv').config()
const { saveEntryToMonday, testMondayConnection } = require('./utils/monday');

async function runTests() {
  console.log('🧪 Testing KayJournal Monday.com Integration...\n');

  // Test 1: Check Monday.com connection
  console.log('1. Testing Monday.com connection...');
  try {
    const boards = await testMondayConnection();
    console.log('✅ Connection successful!');
    console.log('Available boards:', boards);
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    console.log('Make sure MONDAY_API_TOKEN is set in your environment variables');
    return;
  }

  console.log('\n2. Testing journal entry save...');
  try {
    const result = await saveEntryToMonday('test-user', 'This is a test journal entry from the test script!', {
      "user1": "test-user",
      "entry1": "This is a test journal entry from the test script!",
      "date4": new Date().toISOString().split('T')[0],
    });
    console.log('✅ Entry saved successfully!');
    console.log('Result:', result);
  } catch (error) {
    console.log('❌ Save failed:', error.message);
    console.log('Make sure MONDAY_BOARD_ID is set and the board exists');
  }

  console.log('\n🎉 Test completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests }; 