const express = require("express");
const router = express();
const { connectToDb, getDb } = require("../db");
const Subscription = require("../models/subscription");

let db;

connectToDb((err) => {
  if (!err) {
    db = getDb();
  }
});

// subscribe channel http://localhost:3000/subscriptions
router.post("/", async (req, res) => {
  let { userID, channelID } = req.body;

  try {
    const existingChannel = await db
      .collection("subscriptions")
      .findOne(req.body);
    if (existingChannel) {
      res.status(500).json({ message: "Already subscribed" });
    } else {
      const subscribe = new Subscription(req.body);
      const result = await db.collection("subscriptions").insertOne(subscribe);
      res.status(201).json(result);
    }
  } catch (err) {
    res.status(500).json({ error: "Could not subscribe channel" });
  }
});

// unsubscribe channel
router.delete("/", async (req, res) => {
  let { userID, channelID } = req.body;

  try {
    const existingChannel = await db
      .collection("subscriptions")
      .findOne(req.body);
    if (!existingChannel) {
      res.status(400).json({ message: "Channel not found" });
    }
    const result = await db.collection("subscriptions").deleteOne(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not unsubscribe channel" });
  }
});

module.exports = router;
