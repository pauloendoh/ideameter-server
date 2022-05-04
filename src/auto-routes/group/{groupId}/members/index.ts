import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import GroupService from "../../../../domains/group/GroupService";
import authMiddleware from "../../../../middleware/authMiddleware";
import { MyAuthRequest } from "../../../../types/domain/auth/MyAuthRequest";

export default function groupMembers(expressApp: Application) {
  return <Resource>{
    get: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const groupId = req.params.groupId;
        const groupMembers = await new GroupService().findGroupMembers(
          groupId,
          req.user.id
        );

        return res.status(200).json(groupMembers);
      },
    },
  };
}
