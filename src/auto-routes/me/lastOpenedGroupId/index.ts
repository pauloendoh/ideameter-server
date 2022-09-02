import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import UserService from "../../../domains/user/UserService";
import authMiddleware from "../../../middleware/authMiddleware";
import { MyAuthRequest } from "../../../types/domain/auth/MyAuthRequest";
import { InvalidPayloadError400 } from "../../../utils/errors/InvalidPayloadError400";

export default function testRoute(expressApp: Application) {
  return <Resource>{
    get: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const groupId = await new UserService().findLastOpenedGroupId(
          req.user.id
        );

        return res.status(200).json(groupId);
      },
    },
    put: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const { groupId } = req.body as { groupId: string };
        if (!groupId)
          throw new InvalidPayloadError400(
            "groupId is missing in the payload."
          );

        await new UserService().updateLastOpenedGroupId(req.user.id, groupId);

        return res.status(200);
      },
    },
  };
}
