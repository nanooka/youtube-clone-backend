const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(express.json());

// const apiKey = "AIzaSyCB_jwO0CDx7oIHM3wUXTlU0zwiJOh12x8";
const apiKey = "AIzaSyB9Y0VMkev57rkase2o37r_xJOceqga-h0";

// API endpoint to fetch YouTube data
app.get("/api/youtube/search", async (req, res) => {
  try {
    const { query } = req.query;
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          q: query,
          key: apiKey,
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

app.get("/api/youtube/channel-search", async (req, res) => {
  try {
    const { query, channelId } = req.query;

    const params = {
      q: query,
      key: apiKey,
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

app.get("/api/youtube/channel-videos/:channelId", async (req, res) => {
  try {
    const { channelId } = req.params;
    const { order = "date" } = req.query;

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          channelId: channelId,
          key: apiKey,
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
          key: apiKey,
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

app.get("/api/youtube/channel-playlists/:channelId", async (req, res) => {
  try {
    const { channelId } = req.params;

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlists",
      {
        params: {
          channelId: channelId,
          key: apiKey,
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

app.get("/api/youtube/channel-playlistItems/:playlistId", async (req, res) => {
  try {
    const { playlistId } = req.params;

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlistItems",
      {
        params: {
          playlistId: playlistId,
          key: apiKey,
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

app.get("/api/youtube/channel-live/:channelId", async (req, res) => {
  try {
    const { channelId } = req.params;
    const { order = "date" } = req.query;

    const searchResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          channelId: channelId,
          key: apiKey,
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
          key: apiKey,
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

// app.get("/api/youtube/videos-details", async (req, res) => {
//   try {
//     const { videoIds } = req.query; // Expect a comma-separated list of video IDs
//     const response = await axios.get(
//       "https://www.googleapis.com/youtube/v3/videos",
//       {
//         params: {
//           id: videoIds,
//           key: apiKey,
//           part: "snippet,contentDetails,statistics",
//         },
//       }
//     );
//     const videoDetails = response.data.items;

//     const channelIds = [
//       ...new Set(videoDetails.map((video) => video.snippet.channelId)),
//     ];
//     const channelResponse = await axios.get(
//       "https://www.googleapis.com/youtube/v3/channels",
//       {
//         params: {
//           id: channelIds.join(","),
//           key: apiKey,
//           part: "snippet",
//         },
//       }
//     );

//     const channelDetails = channelResponse.data.items.reduce((acc, channel) => {
//       acc[channel.id] = channel;
//       return acc;
//     }, {});

//     res.json({
//       videoDetails,
//       channelDetails,
//     });
//   } catch (error) {
//     console.error("Error fetching video details:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
