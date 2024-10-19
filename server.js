require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse JSON
app.use(express.json());

// API route to interact with Gemini API
app.post("/ask", async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent([req.body.question]);
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
