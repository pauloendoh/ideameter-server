import path from "path"

import { config } from "dotenv"
import express from "express"
import "reflect-metadata"
import {
  Action,
  createExpressServer,
  RoutingControllersOptions,
} from "routing-controllers"
import { validateJwt } from "./utils/auth/validateJwt"
import { addSocketServer } from "./utils/socket/addSocketServer"

require("express-async-errors")

config()

const routingControllersOptions: RoutingControllersOptions = {
  cors: true,
  controllers: [path.join(__dirname + "/**/*Controller{.js,.ts}")],
  currentUserChecker: async (action: Action) => {
    const token = action.request.headers["x-auth-token"]
    const user = await validateJwt(token)
    return user
  },
}

const app = createExpressServer(routingControllersOptions)

app.use("/public", express.static("./public"))

const httpServer = addSocketServer(app)

const port = +process.env.PORT || 8081
httpServer.listen(port, () => {
  console.log(`server running on port ${port}`)
})
