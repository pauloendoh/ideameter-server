import { Application, Request, Response } from "express";
import { Resource } from "express-automatic-routes";
import AuthService from "../../../domains/auth/AuthService";
import LoginDto from "../../../types/domain/auth/LoginDto";

export default function loginRoute(expressApp: Application) {
  return <Resource>{
    post: async (req: Request, res: Response) => {
      const body = req.body as LoginDto;

      const authUser = await new AuthService().login(body);
      return res.json(authUser);
    },
  };
}
