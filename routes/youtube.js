const express = require("express");
const axios = require("axios");

const router = express.Router();

// API endpoint to fetch YouTube data
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          q: query,
          key: process.env.apiKey,
          part: "snippet",
          type: "video",
          maxResults: 20,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/channel-search", async (req, res) => {
  try {
    const { query, channelId } = req.query;

    const params = {
      q: query,
      key: process.env.apiKey,
      part: "snippet",
      type: "video",
      maxResults: 20,
    };

    // Add channelId to params if it's provided
    if (channelId) {
      params.channelId = channelId;
    }

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params,
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/videos/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          id: videoId,
          key: process.env.apiKey,
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

router.get("/channels/:channelId", async (req, res) => {
  try {
    const { channelId } = req.params;
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/channels",
      {
        params: {
          id: channelId,
          key: process.env.apiKey,
          part: "snippet,id,statistics,brandingSettings",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching video by videoId:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/comments/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/commentThreads",
      {
        params: {
          videoId: videoId,
          key: process.env.apiKey,
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

router.get("/channel-videos/:channelId", async (req, res) => {
  try {
    const { channelId } = req.params;
    const { order = "date" } = req.query;

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          channelId: channelId,
          key: process.env.apiKey,
          part: "snippet",
          order: order,
          maxResults: 20,
        },
      }
    );

    const videoIds = response.data.items
      .map((item) => item.id.videoId)
      .join(",");

    const videoDetailsResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          id: videoIds,
          key: process.env.apiKey,
          part: "snippet,contentDetails,statistics",
        },
      }
    );

    res.json(videoDetailsResponse.data);
  } catch (error) {
    console.error("Error fetching videos for channel:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/channel-playlists/:channelId", async (req, res) => {
  try {
    const { channelId } = req.params;

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlists",
      {
        params: {
          channelId: channelId,
          key: process.env.apiKey,
          part: "snippet,contentDetails",
          maxResults: 25,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching playlists for channel:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/channel-playlistItems/:playlistId", async (req, res) => {
  try {
    const { playlistId } = req.params;

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlistItems",
      {
        params: {
          playlistId: playlistId,
          key: process.env.apiKey,
          part: "snippet,contentDetails",
          maxResults: 25,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching playlists for channel:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/channel-live/:channelId", async (req, res) => {
  try {
    const { channelId } = req.params;
    const { order = "date" } = req.query;

    const searchResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          channelId: channelId,
          key: process.env.apiKey,
          part: "snippet",
          eventType: "completed",
          type: "video",
          order: order,
          maxResults: 20,
        },
      }
    );

    const videoIds = searchResponse.data.items
      .map((item) => item.id.videoId)
      .join(",");

    const videoDetailsResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          id: videoIds,
          key: process.env.apiKey,
          part: "snippet,contentDetails,statistics,liveStreamingDetails",
        },
      }
    );

    console.log("Video Details Response:", videoDetailsResponse.data);

    res.json(videoDetailsResponse.data);
  } catch (error) {
    console.error("Error fetching live videos for channel:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
