import { createServer } from "http"

import { config } from "dotenv"
import { Server } from "socket.io"
import { MySocketServer } from "./MySocketServer"
import { socketEvents } from "./socketEvents"
import { socketRooms } from "./socketRooms"
config()

export const addSocketServer = (app?: any) => {
  const httpServer = createServer(app)

  const serverSocket = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  })

  serverSocket.on("connection", (userSocket) => {
    console.log("user connected")

    userSocket.on("enter-group", (groupId: string) => {
      userSocket.join(`group-${groupId}`)
      console.log("joined group")
    })

    userSocket.on("saveIdea", ({ idea, groupId }) => {
      console.log("send saveIdea")
      userSocket.to(`group-${groupId}`).emit("saveIdea", { idea, groupId })
    })

    userSocket.on(socketEvents.deleteIdea, ({ idea, groupId }) => {
      userSocket
        .to(socketRooms.group(groupId))
        .emit(socketEvents.deleteIdea, { idea, groupId })
    })
  })

  app.set("socketio", serverSocket)

  MySocketServer.setInstance(serverSocket)

  return httpServer
}
