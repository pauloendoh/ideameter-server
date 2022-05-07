import { GroupTab } from "@prisma/client";
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
    put: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const payload = req.body as GroupTab;

        const saved = await new TabService().editTab(payload, req.user.id);

        return res.status(200).json(saved);
      },
    },
    delete: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const payload = req.body as GroupTab;

        const deleted = await new TabService().deleteGroupTab(
          payload,
          req.user.id
        );

        return res.status(200).json(deleted);
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
