// index.js
require('dotenv').config()
const express = require('express')
const { saveEntryToMonday, testMondayConnection } = require('./utils/monday')

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Slack webhook handler for /journal command
app.post('/journal-entry', async (req, res) => {
  try {
    console.log('Received Slack webhook:', req.body)
    
    // Extract data from Slack payload
    const { user_name, text, response_url } = req.body
    
    if (!user_name || !text) {
      return res.json({
        response_type: 'ephemeral',
        text: '❌ Please provide both a username and journal entry text.'
      })
    }

    // Save to Monday.com
    await saveEntryToMonday(user_name, text)
    
    // Send confirmation back to Slack
    res.json({
      response_type: 'ephemeral',
      text: `✅ Journal entry saved! Thanks for sharing, ${user_name}.`
    })
    
  } catch (error) {
    console.error('Error processing journal entry:', error)
    res.json({
      response_type: 'ephemeral',
      text: '❌ Sorry, there was an error saving your journal entry. Please try again.'
    })
  }
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