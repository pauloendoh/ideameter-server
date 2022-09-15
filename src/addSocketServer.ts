import { createServer } from "http";

import { config } from "dotenv";
import { Server } from "socket.io";
config();

export const addSocketServer = (app?: any) => {
  const httpServer = createServer(app);

  const serverSocket = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  serverSocket.on("connection", (userSocket) => {
    userSocket.on("enter-group", (groupId: string) => {
      userSocket.join(`group-${groupId}`);
    });

    userSocket.on("saveIdea", ({ idea, groupId }) => {
      userSocket.to(`group-${groupId}`).emit("saveIdea", { idea, groupId });
    });
  });

  return httpServer;
};
