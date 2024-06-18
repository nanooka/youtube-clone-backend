const mongoose = require("mongoose");

const likedVideoSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      ref: "User",
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  {
    collection: "liked-videos",
  }
);

module.exports = mongoose.model("LikedVideo", likedVideoSchema);
