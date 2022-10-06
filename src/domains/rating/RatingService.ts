import { IdeaRating } from "@prisma/client";
import ForbiddenError403 from "../../utils/errors/ForbiddenError403";
import NotFoundError404 from "../../utils/errors/NotFoundError404";
import GroupRepository from "../group/GroupRepository";
import IdeaRepository from "../idea/IdeaRepository";
import RatingRepository from "./RatingRepository";

export default class RatingService {
  constructor(
    private readonly ratingRepository = new RatingRepository(),
    private readonly groupRepository = new GroupRepository(),
    private readonly ideaRepository = new IdeaRepository()
  ) {}

  async saveRating(ideaId: string, rating: number | null, requesterId: string) {
    const isAllowed = await this.ratingRepository.userCanRateIdea(
      ideaId,
      requesterId
    );
    if (!isAllowed)
      new ForbiddenError403("You're not allowed to rate this idea");

    const previousAvgRating = await this.ratingRepository.findAvgRatingFromIdea(
      ideaId
    );
    const ratingExists = await this.ratingRepository.ratingExists(
      ideaId,
      requesterId
    );

    let savedRating: IdeaRating;
    if (ratingExists)
      savedRating = await this.ratingRepository.updateRating(
        ratingExists.id,
        rating
      );
    else
      savedRating = await this.ratingRepository.createRating(
        ideaId,
        rating,
        requesterId
      );

    const idea = await this.handleInterestingOrIrrelevantIdea(
      previousAvgRating,
      ideaId
    );

    return { savedRating, idea };
  }

  async findRatingsByGroupId(groupId: string, requesterId: string) {
    const isAllowed = await this.groupRepository.userBelongsToGroup(
      requesterId,
      groupId
    );
    if (!isAllowed)
      throw new ForbiddenError403("You're not allowed to see this group");

    const ratings = await this.ratingRepository.findRatingsByGroupId(groupId);
    return ratings;
  }

  async deleteIdeaRating(ideaId: string, requesterId: string) {
    const ratingExists = await this.ratingRepository.ratingExists(
      ideaId,
      requesterId
    );
    if (!ratingExists) throw new NotFoundError404("Rating not found");

    const deletedRating = await this.ratingRepository.deleteRating(
      ratingExists.id
    );

    return deletedRating;
  }

  private async handleInterestingOrIrrelevantIdea(
    previousAvgRating: number,
    ideaId: string
  ) {
    const currentAvgRating = await this.ratingRepository.findAvgRatingFromIdea(
      ideaId
    );

    if (previousAvgRating < 2.5 && currentAvgRating >= 2.5) {
      await this.ideaRepository.updateOnFire(ideaId, new Date());
    } else if (previousAvgRating >= 2.5 && currentAvgRating < 2.5) {
      await this.ideaRepository.updateIrrelevantIdea(ideaId, new Date());
    }

    return this.ideaRepository.findById(ideaId);
  }
}
