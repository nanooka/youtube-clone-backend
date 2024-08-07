const express = require("express");
const router = express();
const { connectToDb, getDb } = require("../db");
const WatchLaterVideo = require("../models/watchLaterVideo");

let db;

connectToDb((err) => {
  if (!err) {
    db = getDb();
  }
});

// add video to watch later list http://localhost:5000/watch-later-videos
router.post("/", async (req, res) => {
  let { userID, id } = req.body;

  try {
    const existingVideo = await db
      .collection("watch-later-videos")
      .findOne({ userID, id });
    if (existingVideo) {
      res.status(500).json({ message: "Already added to watch list" });
    } else {
      const video = new WatchLaterVideo(req.body);
      const result = await db.collection("watch-later-videos").insertOne(video);
      res.status(201).json(result);
    }
  } catch (err) {
    res.status(500).json({ error: "Could not add video" });
  }
});

// get user's liked videos list http:/localhost:5000/watch-later-videos/user-watch-later-videos
router.post("/user-watch-later-videos", async (req, res) => {
  try {
    const userID = req.body.userID;
    if (!userID) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const userWatchLaterVideos = await db
      .collection("watch-later-videos")
      .find({ userID })
      .toArray();
    res.status(200).json(userWatchLaterVideos);
  } catch (err) {
    res.status(500).json({ error: "Could not get watch later list" });
  }
});

module.exports = router;
