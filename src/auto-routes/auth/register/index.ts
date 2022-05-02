import { Application, Request, Response } from "express";
import { Resource } from "express-automatic-routes";
import AuthService from "../../../domains/auth/AuthService";
import RegisterDto from "../../../types/domain/auth/RegisterDto";

export default function registerRoute(expressApp: Application) {
  return <Resource>{
    post: async (req: Request, res: Response) => {
      const body = req.body as RegisterDto;

      const authUser = await new AuthService().register(body);
      return res.json(authUser);
    },
  };
}
