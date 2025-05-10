const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');
const profileRoute = require('./routes/profile.js'); // Adjust path as needed
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser()); 
app.use(cors({
  origin: 'http://localhost:5173', // frontend origin
  credentials: true // allow cookies and headers to be included
}));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to Equalify Backend!');
});

// Gemini API endpoint
// Gemini API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: "Gemini API key is not configured on the server." 
      });
    }

    // Call the Gemini API - UPDATED ENDPOINT URL
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: message
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300
        }
      }
    );

    // Extract the response text from the updated API structure
    const botReply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure how to respond to that.";
    
    return res.json({ reply: botReply });
  } catch (error) {
    console.error("Error calling Gemini API:", error.response?.data || error.message);
    return res.status(500).json({ 
      error: "Failed to get a response from the AI service." 
    });
  }
});



const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const groupRoutes = require('./routes/groups');
const friendRoutes = require('./routes/friends');
const budgetRoutes = require('./routes/budgets');


app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/budgets', budgetRoutes);
app.use("/api/auth", profileRoute);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
