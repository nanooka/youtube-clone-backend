const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      ref: "User",
      required: true,
    },
    channelID: {
      type: String,
      required: true,
    },
  },
  {
    collection: "subscriptions",
  }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
