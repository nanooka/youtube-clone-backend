const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const users = require("./routes/users");
const youtube = require("./routes/youtube");
const LikedVideos = require("./routes/liked-videos");

app.use("/users", users);
app.use("/api/youtube", youtube);
app.use("/liked-videos", LikedVideos);

app.listen(3000, () => console.log("server started"));
