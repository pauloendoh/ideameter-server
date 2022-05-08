import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import IdeaService from "../../domains/idea/IdeaService";
import authMiddleware from "../../middleware/authMiddleware";
import { MyAuthRequest } from "../../types/domain/auth/MyAuthRequest";
import { IdeaWithRelationsType } from "../../types/domain/idea/IdeaWithLabelsType";

export default function labelsRoute(expressApp: Application) {
  return <Resource>{
    post: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const payload = req.body as IdeaWithRelationsType;

        const saved = await new IdeaService().createSubidea(
          payload,
          req.user.id
        );

        return res.status(200).json(saved);
      },
    },
    get: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const query = req.query as { parentId: string; groupId: string };

        if (query.groupId) {
          const subideas = await new IdeaService().findSubideasByGroupId(
            query.groupId,
            req.user.id
          );

          return res.status(200).json(subideas);
        }

        const subideas = await new IdeaService().findSubideasByIdeaId(
          query.parentId,
          req.user.id
        );

        return res.status(200).json(subideas);
      },
    },
  };
}
