import cors = require("cors");
import { config } from "dotenv";
import * as express from "express";
import autoroutes from "express-automatic-routes";
import errorMiddleware from "./middleware/errorMiddleware";
require("express-async-errors");

config();

const app = express();
app.use(cors());

app.use(express.json());

autoroutes(app, { dir: "./auto-routes" });

app.use(errorMiddleware);

const port = process.env.PORT || 8081;
app.listen(port, () => console.log(`server running on port ${port}`));
