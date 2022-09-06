import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import IdeaService from "../../../domains/idea/IdeaService";
import authMiddleware from "../../../middleware/authMiddleware";
import { MyAuthRequest } from "../../../types/domain/auth/MyAuthRequest";

export default function ideaIdRoute(expressApp: Application) {
  return <Resource>{
    delete: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const { ideaId } = req.params as { ideaId: string };

        const result = await new IdeaService().deleteIdea(ideaId, req.user.id);

        return res.status(200).json(result);
      },
    },
  };
}
