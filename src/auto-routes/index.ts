import { Application, Request, Response } from "express";
import { Resource } from "express-automatic-routes";

export default function testRoute(expressApp: Application) {
  return <Resource>{
    get: async (request: Request, res: Response) => {
      return res.status(200).send("Nice");
    },
  };
}
