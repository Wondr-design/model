const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();

// Enable CORS for a specific origin (React app running on localhost:5175)
app.use(
  cors({
    origin: "http://localhost:5175", // Ensure this matches the port where your React app is running
    methods: ["GET", "POST"], // Ensure methods are specified
    allowedHeaders: ["Content-Type"], // Allow necessary headers
  })
);

app.use(express.json());

const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Failed to get response" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
