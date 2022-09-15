import path from "path";

import { config } from "dotenv";
import express from "express";
import autoroutes from "express-automatic-routes";
import "reflect-metadata";
import {
  Action,
  createExpressServer,
  RoutingControllersOptions,
} from "routing-controllers";
import { addSocketServer } from "./addSocketServer";
import errorMiddleware from "./middleware/errorMiddleware";
import { validateJwt } from "./utils/auth/validateJwt";

import cors = require("cors");
require("express-async-errors");

config();

const routingControllersOptions: RoutingControllersOptions = {
  cors: true,
  controllers: [path.join(__dirname + "/**/*Controller{.js,.ts}")],
  currentUserChecker: async (action: Action) => {
    const token = action.request.headers["x-auth-token"];
    const user = await validateJwt(token);
    return user;
  },
};

const app = createExpressServer(routingControllersOptions);
app.use("/public", express.static("./public"));

app.use(cors());

app.use(express.json());

autoroutes(app, { dir: "./auto-routes" });

app.use(errorMiddleware);

const httpServer = addSocketServer(app);

const port = +process.env.PORT || 8081;
httpServer.listen(port, () => {
  console.log(`server running on port ${port}`);
});
