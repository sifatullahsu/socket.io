import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://192.168.10.42:5173",
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.json({ success: true, message: "The server is running." });
});

io.on("connection", (socket) => {
  console.log(`A user is connected. ${socket.id}`);

  socket.on("join-room", ({ roomId, name }) => {
    socket.join(roomId);
  });

  socket.on("message", ({ roomId, name, message }) => {
    socket.to(roomId).emit("receive-message", { name, message });
  });

  socket.on("disconnect", () => {
    console.log(`A user has been disconnected. ${socket.id}`);
  });
});

server.listen(5000, "192.168.10.42", () => {
  console.log("Server running on port 5000");
});
