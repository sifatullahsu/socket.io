import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { UserRoute } from "./modules/user/user.route.js";

dotenv.config();
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

app.use("/", UserRoute);

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

async function main() {
  await mongoose.connect(process.env.DATABASE_URL);
  console.log("🛢 Database is connected successfully");

  const s = server.listen(5000, "192.168.10.42", () => {
    console.log("🛢 Server running on port 5000");
  });

  const exitHandler = (error) => {
    console.error(error);

    if (s) {
      server.close(() => {
        console.log("⚠️ Server has been closed");
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const sigtermHandler = () => {
    console.log("SIGTERM received");

    if (s) {
      server.close(() => {
        console.log("⚠️ Server has been closed");
      });
    }
  };

  process.on("uncaughtException", exitHandler);
  process.on("unhandledRejection", exitHandler);
  process.on("SIGTERM", sigtermHandler);
}

main();
