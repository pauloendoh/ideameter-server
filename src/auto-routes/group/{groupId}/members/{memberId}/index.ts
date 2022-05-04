import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import GroupService from "../../../../../domains/group/GroupService";
import authMiddleware from "../../../../../middleware/authMiddleware";
import { MyAuthRequest } from "../../../../../types/domain/auth/MyAuthRequest";

export default function groupMemberId(expressApp: Application) {
  return <Resource>{
    post: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const groupId = req.params.groupId;
        const memberId = req.params.memberId;

        const newMember = await new GroupService().addMember(
          groupId,
          req.user.id,
          memberId
        );

        return res.status(200).json(newMember);
      },
    },
  };
}
