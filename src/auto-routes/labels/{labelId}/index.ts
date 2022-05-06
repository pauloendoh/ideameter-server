import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import LabelService from "../../../domains/label/LabelService";
import authMiddleware from "../../../middleware/authMiddleware";
import { MyAuthRequest } from "../../../types/domain/auth/MyAuthRequest";

export default function labelsRoute(expressApp: Application) {
  return <Resource>{
    delete: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const { labelId } = req.params as { labelId: string };

        const updatedLabel = await new LabelService().deleteLabel(
          labelId,
          req.user.id
        );

        return res.status(200).json(updatedLabel);
      },
    },
  };
}
