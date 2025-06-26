// index.js
require('dotenv').config()
const express = require('express')
const { saveEntryToMonday, testMondayConnection } = require('./utils/monday')
const axios = require('axios')

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const usedBefore = new Set();

// Slack webhook handler for /journal command
app.post('/journal-entry', async (req, res) => {
  const { user_name, user_id, text, response_url } = req.body;

  let firstTime = false;
  if (!usedBefore.has(user_id)) {
    firstTime = true;
    res.json({
      response_type: 'ephemeral',
      text: "Hey! I'm Kay 👋. Use `/j your thoughts here` to save a private journal entry. I'll quietly store it for you — no pressure, just reflection."
    });
  } else {
    res.json({
      response_type: 'ephemeral',
      text: '📝 Saving your journal entry...'
    });
  }

  // Asynchronously save to Monday.com and send follow-up to Slack
  (async () => {
    try {
      await saveEntryToMonday(user_name, text);
      usedBefore.add(user_id);
      if (response_url) {
        await axios.post(response_url, {
          response_type: 'ephemeral',
          text: `✅ Journal entry saved! Thanks for sharing, ${user_name}.`
        });
      }
    } catch (error) {
      if (response_url) {
        await axios.post(response_url, {
          response_type: 'ephemeral',
          text: '❌ Sorry, there was an error saving your journal entry. Please try again.'
        });
      }
      console.error('Error processing journal entry:', error);
    }
  })();
})

// Test route for Monday.com connection
app.get('/test-monday', async (req, res) => {
  try {
    const boards = await testMondayConnection()
    res.json({ success: true, boards })
  } catch (error) {
    res.json({ success: false, error: error.message })
  }
})

// Test route for saving entries
app.post('/test-save', async (req, res) => {
  try {
    const { user, entry } = req.body
    const result = await saveEntryToMonday(user, entry)
    res.json({ success: true, result })
  } catch (error) {
    res.json({ success: false, error: error.message })
  }
})

// Default root route
app.get('/', (req, res) => {
  res.send('KayJournal Slack Bot is running! 🚀')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
  console.log('Available endpoints:')
  console.log('- POST /journal-entry (Slack webhook)')
  console.log('- GET /test-monday (Test Monday.com connection)')
  console.log('- POST /test-save (Test saving entries)')
})