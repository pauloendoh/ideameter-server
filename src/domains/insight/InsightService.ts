import { String } from "aws-sdk/clients/cloudhsm";
import { InterestSimilarityDto } from "../../types/domain/insights/InterestSimilarityDto";
import ForbiddenError403 from "../../utils/errors/ForbiddenError403";
import GroupRepository from "../group/GroupRepository";
import RatingRepository from "../rating/RatingRepository";

export class InsightService {
  constructor(
    private groupRepository = new GroupRepository(),
    private ratingRepository = new RatingRepository()
  ) {}

  async findInterestSimilarity(
    requesterId: string,
    groupId: string
  ): Promise<InterestSimilarityDto[]> {
    const isAllowed = this.groupRepository.userBelongsToGroup(
      requesterId,
      groupId
    );
    if (!isAllowed)
      throw new ForbiddenError403("User does not belong to group or group.");

    const members = await this.groupRepository.findGroupMembers(groupId);
    const otherMembers = members.filter((m) => m.userId !== requesterId);

    const ratings = await this.ratingRepository.findRatingsByGroupId(groupId);
    const validRatings = ratings.filter((r) => r.rating !== null);

    return otherMembers.map((member) => {
      const sameIdeaIds = validRatings.reduce<String[]>(
        (resultIds, currentRating) => {
          const requesterRated = !!validRatings.find(
            (r) => r.userId === requesterId && r.ideaId === currentRating.ideaId
          );
          const memberRated = !!validRatings.find(
            (r) =>
              r.userId === member.userId && r.ideaId === currentRating.ideaId
          );
          const alreadyIncluded = !!resultIds.find(
            (id) => id === currentRating.ideaId
          );

          if (requesterRated && memberRated && !alreadyIncluded)
            return [...resultIds, currentRating.ideaId];

          return resultIds;
        },
        []
      );

      if (sameIdeaIds.length === 0)
        return {
          user: member.user,
          sameIdeasRatedCount: 0,
          similarityPercentage: 0,
        };

      const sumPercentage = sameIdeaIds.reduce(
        (resultPercentage, currentIdeaId) => {
          const ratingA = validRatings.find(
            (r) => r.ideaId === currentIdeaId && r.userId === requesterId
          );
          const ratingB = validRatings.find(
            (r) => r.ideaId === currentIdeaId && r.userId === member.userId
          );

          const percentage = this.calculateRatingSimilarityPercentage(
            ratingA.rating,
            ratingB.rating
          );

          return resultPercentage + percentage;
        },
        0
      );

      return {
        user: member.user,
        sameIdeasRatedCount: sameIdeaIds.length,
        similarityPercentage: sumPercentage / sameIdeaIds.length,
      };
    });
  }

  calculateRatingSimilarityPercentage(ratingA: number, ratingB: number) {
    const diff = Math.abs(ratingA - ratingB); // example: 1 - 3 = -2 -> 2
    const top = 3 - diff; // 3 - 2 = 1
    const percentage = top / 3; // 1/3 = 33% = 0.33...

    return percentage; // therefore, 1 and 3 is 33% similar... I guess?? // https://imageproxy.ifunny.co/crop:x-20,resize:640x,quality:90x75/images/5667ddd56ea8db760e7cd49b2c91de470b4ce8dcc3e7533a3499ae9269898bd9_1.jpg
  }
}
