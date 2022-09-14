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

  const WS_PORT = +process.env.WS_PORT || 8002;
  httpServer.listen(WS_PORT, () => {
    console.log(`WS listening on ${WS_PORT}`);
  });
};