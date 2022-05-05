import { IdeaRating } from "@prisma/client";
import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import RatingService from "../../domains/idea/rating/RatingService";
import authMiddleware from "../../middleware/authMiddleware";
import { MyAuthRequest } from "../../types/domain/auth/MyAuthRequest";

export default function ideaRoute(expressApp: Application) {
  return <Resource>{
    post: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const payload = req.body as IdeaRating;

        const savedRating = await new RatingService().saveRating(
          payload.ideaId,
          payload.rating,
          req.user.id
        );

        return res.status(200).json(savedRating);
      },
    },
    get: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const query = req.query as { groupId: string };

        const ratingsByGroup = await new RatingService().findRatingsByGroupId(
          query.groupId,
          req.user.id
        );

        return res.status(200).json(ratingsByGroup);
      },
    },
  };
}
