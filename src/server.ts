import { config } from "dotenv";
import * as express from "express";
import autoroutes from "express-automatic-routes";
config();

const app = express();
app.use(express.json());

autoroutes(app, { dir: "./auto-routes" });

const port = process.env.PORT || 8081;
app.listen(port, () => console.log(`server running on port ${port}`));
