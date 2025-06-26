# KayJournal Slack Bot

A Slack bot that saves journal entries to Monday.com with a simple `/journal` command.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Copy the example environment file and fill in your values:
```bash
cp env.example .env
```

Then edit `.env` with your actual values:
```bash
MONDAY_API_TOKEN=your_monday_api_token_here
MONDAY_BOARD_ID=your_board_id_here
```

### 3. Get Monday.com API Token
1. Go to [Monday.com Developer](https://monday.com/developers)
2. Create a new app
3. Get your API token from the app settings

### 4. Get Monday.com Board ID
1. Open your Monday.com board
2. The board ID is in the URL: `https://monday.com/boards/BOARD_ID`
3. Create columns in your board:
   - User (Text column)
   - Entry (Text column) 
   - Date (Date column)

### 5. Test the Integration
```bash
node test.js
```

### 6. Start the Server
```bash
node index.js
```

## 📋 Available Endpoints

- `POST /journal-entry` - Slack webhook handler
- `GET /test-monday` - Test Monday.com connection
- `POST /test-save` - Test saving entries
- `GET /` - Health check

## 🔧 Slack Setup

1. Create a Slack app at [api.slack.com](https://api.slack.com/apps)
2. Add a Slash Command:
   - Command: `/journal`
   - Request URL: `https://your-domain.com/journal-entry`
   - Short Description: `Save a journal entry`
3. Install the app to your workspace

## 🧪 Testing

### Test Monday.com Connection
```bash
curl http://localhost:3000/test-monday
```

### Test Saving an Entry
```bash
curl -X POST http://localhost:3000/test-save \
  -H "Content-Type: application/json" \
  -d '{"user": "test-user", "entry": "Test journal entry"}'
```

### Test Slack Webhook
```bash
curl -X POST http://localhost:3000/journal-entry \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "user_name=test-user&text=Test journal entry from Slack"
```

## 🏗 Architecture

- **Express.js** - Web server and webhook handler
- **Monday.com API** - Data persistence
- **Slack Slash Commands** - User interface
- **Axios** - HTTP client for API calls

## 🔮 Future Features

- AI-powered sentiment analysis
- Journal entry summaries
- Smart tagging and categorization
- Retrieval and search functionality 