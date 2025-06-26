// utils/monday.js
const axios = require('axios')

// Monday.com API configuration
const MONDAY_API_URL = 'https://api.monday.com/v2'
const MONDAY_API_TOKEN = process.env.MONDAY_API_TOKEN
const MONDAY_BOARD_ID = process.env.MONDAY_BOARD_ID || 'your_board_id_here'

// GraphQL mutation to create a new item in Monday.com
const CREATE_ITEM_MUTATION = `
  mutation ($boardId: ID!, $itemName: String!, $columnValues: JSON!) {
    create_item (
      board_id: $boardId,
      item_name: $itemName,
      column_values: $columnValues
    ) {
      id
      name
    }
  }
`

/**
 * Save a journal entry to Monday.com
 * @param {string} user - Slack username
 * @param {string} entry - Journal text
 * @returns {Promise<Object>} - Response from Monday.com API
 */
async function saveEntryToMonday(user, entry) {
  try {
    if (!MONDAY_API_TOKEN) {
      throw new Error('MONDAY_API_TOKEN environment variable is not set');
    }

    // You'll need to replace BOARD_ID with your actual Monday.com board ID
    const BOARD_ID = process.env.MONDAY_BOARD_ID || 9455781988; // Replace with your board ID
    
    const today = new Date().toISOString().split('T')[0];
    const columnValues = JSON.stringify({
      "text_mks8qmaf": user, // User column
      "long_text_mks8bfeq": entry, // Entry column
      "date_mks9dpna": today, // Date column (simple date)
    });

    const response = await axios.post(
      MONDAY_API_URL,
      {
        query: CREATE_ITEM_MUTATION,
        variables: {
          boardId: BOARD_ID,
          itemName: `Journal Entry - ${user}`,
          columnValues: columnValues
        }
      },
      {
        headers: {
          'Authorization': MONDAY_API_TOKEN,
          'Content-Type': 'application/json',
          'API-Version': '2023-10'
        }
      }
    );

    console.log('Successfully saved to Monday.com:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error saving to Monday.com:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Test function to verify Monday.com connection
 */
async function testMondayConnection() {
  try {
    const query = `
      query {
        boards {
          id
          name
        }
      }
    `;

    const response = await axios.post(
      MONDAY_API_URL,
      { query },
      {
        headers: {
          'Authorization': MONDAY_API_TOKEN,
          'Content-Type': 'application/json',
          'API-Version': '2023-10'
        }
      }
    );

    console.log('Available boards:', response.data.data.boards);
    return response.data.data.boards;
  } catch (error) {
    console.error('Error testing Monday.com connection:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = {
  saveEntryToMonday,
  testMondayConnection
};