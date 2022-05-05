import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import RatingService from "../../../../domains/idea/rating/RatingService";
import authMiddleware from "../../../../middleware/authMiddleware";
import { MyAuthRequest } from "../../../../types/domain/auth/MyAuthRequest";

export default function ideaRoute(expressApp: Application) {
  return <Resource>{
    get: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const query = req.params as { groupId: string };

        const ratingsByGroup = await new RatingService().findRatingsByGroupId(
          query.groupId,
          req.user.id
        );

        return res.status(200).json(ratingsByGroup);
      },
    },
  };
}
