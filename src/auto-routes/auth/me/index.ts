import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import authMiddleware from "../../../middleware/authMiddleware";
import { AuthUserGetDto } from "../../../types/domain/auth/AuthUserGetDto";
import { MyAuthRequest } from "../../../types/domain/auth/MyAuthRequest";

export default function meRoute(expressApp: Application) {
  return <Resource>{
    middleware: authMiddleware,
    get: async (req: MyAuthRequest, res: Response) => {
      return res.json(new AuthUserGetDto(req.user, null, null));
    },
  };
}
