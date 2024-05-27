const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(express.json());

const apiKey = "AIzaSyCB_jwO0CDx7oIHM3wUXTlU0zwiJOh12x8";

// API endpoint to fetch YouTube data
app.get("/api/youtube/search", async (req, res) => {
  try {
    const { query } = req.query;
    // const apiKey = "AIzaSyCB_jwO0CDx7oIHM3wUXTlU0zwiJOh12x8";

    // Make request to YouTube Data API to search videos
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          q: query,
          key: apiKey,
          part: "snippet",
          type: "video",
          maxResults: 20, // Adjust as needed
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/youtube/videos/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          id: videoId,
          key: apiKey,
          part: "snippet,statistics,player,contentDetails",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching video by videoId:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/youtube/channels/:channelId", async (req, res) => {
  try {
    const { channelId } = req.params;
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/channels",
      {
        params: {
          id: channelId,
          key: apiKey,
          part: "snippet,id,statistics",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching video by videoId:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/youtube/comments/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/commentThreads",
      {
        params: {
          videoId: videoId,
          key: apiKey,
          part: "snippet",
          maxResults: 20,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
