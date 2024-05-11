const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API endpoint to fetch YouTube data
app.get("/api/youtube/search", async (req, res) => {
  try {
    const { query } = req.query;
    const apiKey = "AIzaSyCB_jwO0CDx7oIHM3wUXTlU0zwiJOh12x8";

    // Make request to YouTube Data API to search videos
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          q: query,
          key: apiKey,
          part: "snippet",
          type: "video",
          maxResults: 10, // Adjust as needed
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
