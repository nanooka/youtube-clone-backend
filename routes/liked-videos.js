const express = require("express");
const router = express();
const { connectToDb, getDb } = require("../db");
const LikedVideo = require("../models/likedVideo");

let db;

connectToDb((err) => {
  if (!err) {
    db = getDb();
  }
});

// add video to liked videos http://localhost:5000/liked-videos
router.post("/", async (req, res) => {
  let { userID, id } = req.body;

  try {
    const existingVideo = await db
      .collection("liked-videos")
      .findOne({ userID, id });
    if (existingVideo) {
      res.status(500).json({ message: "Already liked" });
    } else {
      const video = new LikedVideo(req.body);
      const result = await db.collection("liked-videos").insertOne(video);
      res.status(201).json(result);
    }
  } catch (err) {
    res.status(500).json({ error: "Could not add video" });
  }
});

// remove video from liked videos
router.delete("/", async (req, res) => {
  let { userID, id } = req.body;
  try {
    const existingVideo = await db.collection("liked-videos").findOne(req.body);
    if (!existingVideo) {
      res.status(400).json({ message: "Video not found" });
    }
    const result = await db.collection("liked-videos").deleteOne(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not remove video" });
  }
});

// get user's liked videos list http:/localhost:5000/liked-videos/user-liked-videos
router.post("/user-liked-videos", async (req, res) => {
  try {
    const userID = req.body.userID;
    if (!userID) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const userLikedVideos = await db
      .collection("liked-videos")
      .find({ userID })
      .toArray();
    res.status(200).json(userLikedVideos);
  } catch (err) {
    res.status(500).json({ error: "Could not get liked videos" });
  }
});

module.exports = router;
