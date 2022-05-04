import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import AuthService from "../../../domains/auth/AuthService";
import authMiddleware from "../../../middleware/authMiddleware";
import { MyAuthRequest } from "../../../types/domain/auth/MyAuthRequest";

export default function meRoute(expressApp: Application) {
  return <Resource>{
    middleware: authMiddleware,
    get: async (req: MyAuthRequest, res: Response) => {
      const authUserWithToken = await new AuthService().getAuthUserWithToken(
        req.user
      );
      return res.json(authUserWithToken);
    },
  };
}
