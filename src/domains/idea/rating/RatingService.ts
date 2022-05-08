import ForbiddenError403 from "../../../utils/errors/ForbiddenError403";
import NotFoundError404 from "../../../utils/errors/NotFoundError404";
import GroupRepository from "../../group/GroupRepository";
import IdeaRepository from "../IdeaRepository";
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
      throw new ForbiddenError403("You're not allowed to see this group");

    const ratings = await this.ratingRepository.findRatingsByGroupId(groupId);
    return ratings;
  }

  async findSubideaRatings(parentId: string, requesterId: string) {
    const parent = await this.ideaRepository.findById(parentId);
    if (!parent) throw new NotFoundError404("Parent idea not found");

    const isAllowed = await this.ideaRepository.userCanAccessTab(
      parent.tabId,
      requesterId
    );
    if (!isAllowed) throw new ForbiddenError403("Not allowed");

    const subideaRatings = await this.ratingRepository.findSubideaRatings(
      parentId
    );
    return subideaRatings;
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
