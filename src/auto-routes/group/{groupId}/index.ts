import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import GroupService from "../../../domains/group/GroupService";
import authMiddleware from "../../../middleware/authMiddleware";
import { MyAuthRequest } from "../../../types/domain/auth/MyAuthRequest";

export default function groupIdRoute(expressApp: Application) {
  return <Resource>{
    delete: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const groupId = req.params.groupId;
        const deletedGroup = await new GroupService().deleteGroup(
          groupId,
          req.user.id
        );

        return res.status(200).json(deletedGroup);
      },
    },
  };
}
