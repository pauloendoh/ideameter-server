import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import UserService from "../../../domains/user/UserService";
import authMiddleware from "../../../middleware/authMiddleware";
import { MyAuthRequest } from "../../../types/domain/auth/MyAuthRequest";

export default function testRoute(expressApp: Application) {
  return <Resource>{
    get: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const { q } = req.query as { q: string };
        const users = await new UserService().findByText(q);

        return res.status(200).json(users);
      },
    },
  };
}
