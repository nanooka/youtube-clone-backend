const mongoose = require("mongoose");

const watchLaterVideoSchema = new mongoose.Schema(
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
    collection: "watch-later-videos",
  }
);

module.exports = mongoose.model("WatchLaterVideo", watchLaterVideoSchema);
