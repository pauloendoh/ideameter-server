import NotFoundError404 from "../../../utils/errors/NotFoundError404";
import UnauthorizedError401 from "../../../utils/errors/UnauthorizedError401";
import GroupRepository from "../../group/GroupRepository";
import RatingRepository from "./RatingRepository";

export default class RatingService {
  constructor(
    private readonly ratingRepository = new RatingRepository(),
    private readonly groupRepository = new GroupRepository()
  ) {}

  async saveRating(ideaId: string, rating: number | null, requesterId: string) {
    const isAllowed = await this.ratingRepository.userCanRateIdea(
      ideaId,
      requesterId
    );
    if (!isAllowed)
      new UnauthorizedError401("You're not allowed to rate this idea");

    const ratingExists = await this.ratingRepository.ratingExists(
      ideaId,
      requesterId
    );
    if (ratingExists) {
      const updatedRating = await this.ratingRepository.updateRating(
        ratingExists.id,
        rating
      );
      return updatedRating;
    }

    const savedRating = await this.ratingRepository.createRating(
      ideaId,
      rating,
      requesterId
    );
    return savedRating;
  }

  async findRatingsByGroupId(groupId: string, requesterId: string) {
    const isAllowed = await this.groupRepository.userBelongsToGroup(
      requesterId,
      groupId
    );
    if (!isAllowed)
      throw new UnauthorizedError401("You're not allowed to see this group");

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
}
