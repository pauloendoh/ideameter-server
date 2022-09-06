import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import IdeaService from "../../../domains/idea/IdeaService";
import authMiddleware from "../../../middleware/authMiddleware";
import { MyAuthRequest } from "../../../types/domain/auth/MyAuthRequest";

export default function subideaIdRoute(expressApp: Application) {
  return <Resource>{
    delete: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const { subideaId } = req.params as { subideaId: string };

        const deletedIdea = await new IdeaService().deleteSubidea(
          subideaId,
          req.user.id
        );

        return res.status(200).json(deletedIdea);
      },
    },
  };
}
