// index.js
const express = require('express')
const app = express()

app.use(express.urlencoded({ extended: true }))

// Test route
app.post('/journal-entry', (req, res) => {
  console.log('Received:', req.body)     // log to console
  res.json({ text: "Got it!" })          // reply to client
})


// Default root route
app.get('/', (req, res) => {
  res.send('I’m alive and working')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})