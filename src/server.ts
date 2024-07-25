import path from "path"

import { config } from "dotenv"
import express from "express"
import "reflect-metadata"
import {
  createExpressServer,
  RoutingControllersOptions,
} from "routing-controllers"
import { createRatingBackup } from "./scripts/routines/createRatingBackup"
import { myCurrentUserChecker } from "./utils/auth/myCurrentUserChecker"
import { addSocketServer } from "./utils/socket/addSocketServer"

require("express-async-errors")

config()

const routingControllersOptions: RoutingControllersOptions = {
  cors: true,
  controllers: [path.join(__dirname + "/**/*Controller{.js,.ts}")],
  currentUserChecker: myCurrentUserChecker,
}

const app = createExpressServer(routingControllersOptions)

app.use("/public", express.static("./public"))

const httpServer = addSocketServer(app)

const port = +process.env.PORT || 8081
httpServer.listen(port, async () => {
  console.log(`server running on port ${port}`)

  createRatingBackup()
})
