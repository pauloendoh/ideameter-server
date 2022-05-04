import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import TabService from "../../../../domains/group/group-tab/TabService";
import authMiddleware from "../../../../middleware/authMiddleware";
import { MyAuthRequest } from "../../../../types/domain/auth/MyAuthRequest";

export default function tabRoute(expressApp: Application) {
  return <Resource>{
    post: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const groupId = req.params.groupId;
        const payload = req.body as {
          name: string;
        };

        const createdTab = await new TabService().createTab(
          groupId,
          payload.name,
          req.user.id
        );

        return res.status(200).json(createdTab);
      },
    },

    get: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const groupId = req.params.groupId;

        const groupTabs = await new TabService().findGroupTabs(
          groupId,
          req.user.id
        );

        return res.status(200).json(groupTabs);
      },
    },
  };
}
