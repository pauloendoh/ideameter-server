import { Label } from "@prisma/client";
import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import LabelService from "../../../../domains/label/LabelService";
import authMiddleware from "../../../../middleware/authMiddleware";
import { MyAuthRequest } from "../../../../types/domain/auth/MyAuthRequest";

export default function groupLabelsRoute(expressApp: Application) {
  return <Resource>{
    get: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const groupId = req.params.groupId;
        const groupLabels = await new LabelService().findLabelsByGroup(
          groupId,
          req.user.id
        );

        return res.status(200).json(groupLabels);
      },
    },
    post: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const payload = req.body as Label;
        const groupId = req.params.groupId;

        const createdLabel = await new LabelService().createLabel(
          payload,
          groupId,
          req.user.id
        );

        return res.status(200).json(createdLabel);
      },
    },
    put: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const payload = req.body as Label;

        const updatedLabel = await new LabelService().updateLabel(
          payload,

          req.user.id
        );

        return res.status(200).json(updatedLabel);
      },
    },
  };
}
