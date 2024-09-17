const socket = require("socket.io");

const onlineUsers = new Map();

const socketConnection = (server) => {
  const io = socket(server, {
    cors: {
      origin: process.env.HOST,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected: ", socket.id);
    });
  });
};

module.exports = socketConnection;
