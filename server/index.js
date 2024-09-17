const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messagesRoutes");
const socket = require("socket.io");
const socketConnection = require("./configs/socket");
const connectDB = require("./configs/mongoDBConnect");
require("dotenv").config();

const app = express();

//use
app.use(express.json());
app.use(cors());

//routes
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

connectDB();

const server = app.listen(process.env.PORT, () => {
  console.log("server is started successfully");
});

socketConnection(server);
