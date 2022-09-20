import { createServer } from "http";

import { config } from "dotenv";
import { Server } from "socket.io";
import { wsEventNames } from "./utils/wsEventNames";
import { wsRoomNames } from "./utils/wsRoomNames";
config();

export const addSocketServer = (app?: any) => {
  const httpServer = createServer(app);

  const serverSocket = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  serverSocket.on("connection", (userSocket) => {
    console.log("user connected");

    userSocket.on("enter-group", (groupId: string) => {
      userSocket.join(`group-${groupId}`);
      console.log("joined group");
    });

    userSocket.on("saveIdea", ({ idea, groupId }) => {
      console.log("send saveIdea");
      userSocket.to(`group-${groupId}`).emit("saveIdea", { idea, groupId });
    });

    userSocket.on(wsEventNames.deleteIdea, ({ idea, groupId }) => {
      userSocket
        .to(wsRoomNames.group(groupId))
        .emit(wsEventNames.deleteIdea, { idea, groupId });
    });
  });

  app.set("socketio", serverSocket);

  return httpServer;
};
