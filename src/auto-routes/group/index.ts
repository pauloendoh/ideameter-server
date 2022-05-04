import { Group } from "@prisma/client";
import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import GroupService from "../../domains/group/GroupService";
import authMiddleware from "../../middleware/authMiddleware";
import { MyAuthRequest } from "../../types/domain/auth/MyAuthRequest";
import GroupDto from "../../types/domain/group/GroupDto";

export default function testRoute(expressApp: Application) {
  return <Resource>{
    post: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const payload = req.body as GroupDto;
        const createdGroup = await new GroupService().createGroup(
          payload,
          req.user.id
        );

        return res.status(200).json(createdGroup);
      },
    },
    get: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const groups = await new GroupService().findGroupsByUser(req.user.id);
        return res.status(200).json(groups);
      },
    },
    put: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const payload = req.body as Group;
        const editedGroup = await new GroupService().editGroup(
          payload,
          req.user.id
        );

        return res.status(200).json(editedGroup);
      },
    },
  };
}
