import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import IdeaService from "../../../../domains/idea/IdeaService";
import authMiddleware from "../../../../middleware/authMiddleware";
import { MyAuthRequest } from "../../../../types/domain/auth/MyAuthRequest";

export default function groupLabelsRoute(expressApp: Application) {
  return <Resource>{
    get: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const groupId = req.params.groupId;
        const groups = await new IdeaService().findIdeasByGroupId(
          groupId,
          req.user.id
        );

        return res.status(200).json(groups);
      },
    },
  };
}
