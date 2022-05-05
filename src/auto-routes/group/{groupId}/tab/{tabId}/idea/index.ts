import { Idea } from "@prisma/client";
import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import IdeaService from "../../../../../../domains/idea/IdeaService";
import authMiddleware from "../../../../../../middleware/authMiddleware";
import { MyAuthRequest } from "../../../../../../types/domain/auth/MyAuthRequest";

export default function testRoute(expressApp: Application) {
  return <Resource>{
    post: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const payload = req.body as Idea;
        const users = await new IdeaService().createIdea(payload, req.user.id);

        return res.status(200).json(users);
      },
    },
    get: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const { tabId } = req.params as { tabId: string };
        const ideas = await new IdeaService().findIdeasByTabId(
          tabId,
          req.user.id
        );

        return res.status(200).json(ideas);
      },
    },
  };
}
