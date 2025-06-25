// utils/monday.js
const axios = require('axios')

const apiKey = process.env.eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjUzMTIwNjczMSwiYWFpIjoxMSwidWlkIjo3NjIzNzI2OSwiaWFkIjoiMjAyNS0wNi0yNVQyMToyODo0OC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTY3MDIzNDYsInJnbiI6InVzZTEifQ.LxQxTwFFB5E_qkZEY2VvMTeNLp1ROYsTaNEFm66UOLU
const boardId = process.env.9455781988

// Helper to save a journal entry
async function saveEntry(user, text) {
  try {
    const query = `
      mutation {
        create_item(
          board_id: ${boardId},
          item_name: "Journal Entry",
          column_values: "{ \\"User\\": \\"${user}\\", \\"Entry\\": \\"${text}\\", \\"Date\\": \\"${new Date().toISOString().split('T')[0]}\\" }"
        ) {
          id
        }
      }
    `

    const res = await axios.post(
      'https://api.monday.com/v2',
      { query },
      {
        headers: {
          Authorization: apiKey,
          'Content-Type': 'application/json',
        },
      }
    )

    return res.data
  } catch (error) {
    console.error('Error saving to Monday.com:', error.response?.data || error.message)
    throw error
  }
}

module.exports = { saveEntry }