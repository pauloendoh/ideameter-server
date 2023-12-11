import { IdeaRating } from "@prisma/client"
import { Server } from "socket.io"
import ForbiddenError403 from "../../utils/errors/ForbiddenError403"
import NotFoundError404 from "../../utils/errors/NotFoundError404"
import { socketEvents } from "../../utils/socket/socketEvents"
import { socketRooms } from "../../utils/socket/socketRooms"
import GroupRepository from "../group/GroupRepository"
import IdeaRepository from "../idea/IdeaRepository"
import RatingRepository from "./RatingRepository"

export default class RatingService {
  constructor(
    private readonly ratingRepository = new RatingRepository(),
    private readonly groupRepository = new GroupRepository(),
    private readonly ideaRepository = new IdeaRepository()
  ) {}

  async saveIdeaRating(
    ideaId: string,
    rating: number | null,
    requesterId: string,
    socketServer: Server
  ) {
    const isAllowed = await this._userCanSaveIdeaRating(ideaId, requesterId)
    if (!isAllowed)
      throw new ForbiddenError403("You're not allowed to rate this idea")

    const previousAvgRating = await this.ratingRepository.findAvgRatingFromIdea(
      ideaId
    )
    const ratingExists = await this.ratingRepository.ratingExists(
      ideaId,
      requesterId
    )

    const savedRating = ratingExists
      ? await this.ratingRepository.updateRating(ratingExists.id, rating)
      : await this.ratingRepository.createRating(ideaId, rating, requesterId)

    const updatedIdea = await this.handleInterestingOrIrrelevantIdea(
      previousAvgRating,
      ideaId
    )

    this.handleSavedRatingSocket(savedRating, socketServer)

    return { savedRating, idea: updatedIdea }
  }

  async _userCanSaveIdeaRating(ideaId: string, requesterId: string) {
    const idea = await this.ideaRepository.findById(ideaId)
    if (!idea) {
      throw new NotFoundError404("Idea not found")
    }

    if (idea.parentId) {
      const isAllowed = await this.ratingRepository.userCanRateSubidea(
        idea.parentId,
        requesterId
      )
      return isAllowed
    }

    const isAllowed = await this.ratingRepository.userCanRateIdea(
      ideaId,
      requesterId
    )
    return isAllowed
  }

  async findRatingsByGroupId(groupId: string, requesterId: string) {
    const isAllowed = await this.groupRepository.userBelongsToGroup(
      requesterId,
      groupId
    )
    if (!isAllowed)
      throw new ForbiddenError403("You're not allowed to see this group")

    const ratings = await this.ratingRepository.findRatingsByGroupId(groupId)
    return ratings
  }

  async deleteIdeaRating(
    ideaId: string,
    requesterId: string,
    socketServer: Server
  ) {
    const ratingExists = await this.ratingRepository.ratingExists(
      ideaId,
      requesterId
    )
    if (!ratingExists) throw new NotFoundError404("Rating not found")

    const deletedRating = await this.ratingRepository.deleteRating(
      ratingExists.id
    )

    this.handleDeletedRatingSocket(deletedRating, socketServer)

    return deletedRating
  }

  private async handleInterestingOrIrrelevantIdea(
    previousAvgRating: number,
    ideaId: string
  ) {
    const currentAvgRating = await this.ratingRepository.findAvgRatingFromIdea(
      ideaId
    )

    if (previousAvgRating < 2.5 && currentAvgRating >= 2.5) {
      await this.ideaRepository.updateOnFire(ideaId, new Date())
    } else if (previousAvgRating >= 2.5 && currentAvgRating < 2.5) {
      await this.ideaRepository.updateIrrelevantIdea(ideaId, new Date())
    }

    return this.ideaRepository.findById(ideaId)
  }

  private async handleSavedRatingSocket(
    savedRating: IdeaRating,
    socketServer: Server
  ) {
    const group = await this.groupRepository.findGroupByIdeaId(
      savedRating.ideaId
    )
    if (!group) throw new NotFoundError404("Group not found.")

    socketServer
      .to(socketRooms.group(group.id))
      .emit(socketEvents.savedRating, {
        savedRating,
        groupId: group.id,
      })

    return true
  }

  private async handleDeletedRatingSocket(
    deletedRating: IdeaRating,
    socketServer: Server
  ) {
    const group = await this.groupRepository.findGroupByIdeaId(
      deletedRating.ideaId
    )
    if (!group) throw new NotFoundError404("Group not found.")

    socketServer
      .to(socketRooms.group(group.id))
      .emit(socketEvents.deletedRating, {
        ratingId: deletedRating.id,
        groupId: group.id,
      })

    return true
  }

  async refreshRating(params: { requesterId: string; ratingId: string }) {
    const isOwner = await this.ratingRepository.isOwner(params)

    if (!isOwner)
      throw new ForbiddenError403("You're not allowed to perform this action")

    const rating = await this.ratingRepository.refreshRating(params.ratingId)

    return rating
  }
}
