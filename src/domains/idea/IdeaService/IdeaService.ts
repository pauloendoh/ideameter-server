import { Group, GroupTab, Idea } from "@prisma/client"
import { ForbiddenError } from "routing-controllers"
import { Server } from "socket.io"
import { IdeaWithRelationsType } from "../../../types/domain/idea/IdeaWithRelationsType"
import ForbiddenError403 from "../../../utils/errors/ForbiddenError403"
import { InvalidPayloadError400 } from "../../../utils/errors/InvalidPayloadError400"
import NotFoundError404 from "../../../utils/errors/NotFoundError404"
import { MySocketServer } from "../../../utils/socket/MySocketServer"
import { socketEvents } from "../../../utils/socket/socketEvents"
import { socketRooms } from "../../../utils/socket/socketRooms"
import GroupRepository from "../../group/GroupRepository"
import TabRepository from "../../group/group-tab/TabRepository"
import { IdeaChangeService } from "../../idea-change/IdeaChangeService"
import { NotificationService } from "../../notification/NotificationService"
import RatingRepository from "../../rating/RatingRepository"
import IdeaRepository from "../IdeaRepository"
import { MoveIdeasToTabDto } from "../types/MoveIdeasToTabDto"

type IdeasAssignedToUser = Idea & { tab: GroupTab & { group: Group } }

export default class IdeaService {
  constructor(
    private readonly ideaRepository = new IdeaRepository(),
    private readonly groupRepository = new GroupRepository(),
    private readonly ratingRepository = new RatingRepository(),
    private readonly notificationService = new NotificationService(),
    private readonly tabRepository = new TabRepository(),
    private readonly socketServer = MySocketServer.instance,
    private readonly ideaChangeService = new IdeaChangeService()
  ) {}

  async createIdea(idea: IdeaWithRelationsType, requesterId: string) {
    const isAllowed = await this.ideaRepository.userCanAccessTab(
      idea.tabId,
      requesterId
    )
    if (!isAllowed)
      throw new ForbiddenError("You're not allowed to add ideas to this tab")

    const createdIdea = await this.ideaRepository.saveIdea(idea, requesterId)
    await this.ratingRepository.createRating(createdIdea.id, 3, requesterId)

    // don't need to await this
    this.notificationService.handleMentionNotificationsCreateIdea(
      createdIdea,
      requesterId
    )

    return createdIdea
  }

  async saveSubidea(subidea: IdeaWithRelationsType, requesterId: string) {
    const parent = await this.ideaRepository.findById(subidea.parentId)
    if (!parent) throw new ForbiddenError403("Parent idea not found")

    const isAllowed = await this.ideaRepository.userCanAccessTab(
      parent.tabId,
      requesterId
    )
    if (!isAllowed)
      throw new ForbiddenError403("You're not allowed to add ideas to this tab")

    subidea.tabId = undefined

    const socketServer = MySocketServer.instance
    if (subidea.id) {
      return this.updateIdea(subidea, requesterId, socketServer)
    }

    return this.createIdea(subidea, requesterId)
  }

  async deleteSubidea(subideaId: string, requesterId: string) {
    const subidea = await this.ideaRepository.findById(subideaId)
    if (!subidea) throw new ForbiddenError403("Subidea not found")

    const parentIdea = await this.ideaRepository.findById(subidea.parentId)

    const isAllowed = await this.ideaRepository.userCanAccessTab(
      parentIdea.tabId,
      requesterId
    )
    if (!isAllowed)
      throw new ForbiddenError403(
        "You're not allowed to change ideas from this tab"
      )

    const deletedIdea = await this.ideaRepository.deleteIdea(subidea.id)
    return deletedIdea
  }

  async deleteIdea(ideaId: string, requesterId: string) {
    const idea = await this.ideaRepository.findById(ideaId)
    if (!idea) throw new ForbiddenError403("Idea not found")

    const isAllowed = await this.ideaRepository.userCanAccessTab(
      idea.tabId,
      requesterId
    )
    if (!isAllowed)
      throw new ForbiddenError403(
        "You're not allowed to change ideas from this tab"
      )

    const result = await this.ideaRepository.deleteIdea(idea.id)
    return result
  }

  async findIdeasByGroupId(groupId: string, requesterId: string) {
    const isAllowed = await this.groupRepository.userBelongsToGroup(
      requesterId,
      groupId
    )
    if (!isAllowed)
      throw new ForbiddenError403("You're not allowed to see this group")

    const ideas = await this.ideaRepository.findIdeasByGroupId(groupId)
    return ideas
  }

  async updateIdea(
    idea: IdeaWithRelationsType,
    requesterId: string,
    socketServer: Server
  ) {
    let parentIdea: IdeaWithRelationsType
    if (idea.parentId) {
      parentIdea = await this.ideaRepository.findById(idea.parentId)
    }
    const isAllowed = await this.ideaRepository.userCanAccessTab(
      parentIdea?.tabId || idea.tabId,
      requesterId
    )
    if (!isAllowed)
      throw new ForbiddenError403("You're not allowed to update this idea")

    const previousIdea = await this.ideaRepository.findById(idea.id)

    if (!previousIdea.isDone && idea.isDone) idea.completedAt = new Date()

    const updatedIdea = await this.ideaRepository.updateIdea(idea)

    await this.ideaChangeService.handleIdeaChange({
      previousIdea,
      updatedIdea,
      requesterId,
    })

    this.notificationService.handleMentionNotificationsUpdateIdea(
      previousIdea,
      updatedIdea,
      requesterId,
      socketServer
    )

    return updatedIdea
  }

  async findSubideasByIdeaId(parentId: string, requesterId: string) {
    const parent = await this.ideaRepository.findById(parentId)
    if (!parent) throw new NotFoundError404("Parent idea not found")

    const isAllowed = await this.ideaRepository.userCanAccessTab(
      parent.tabId,
      requesterId
    )
    if (!isAllowed) throw new ForbiddenError403("Not allowed")

    const subideas = await this.ideaRepository.findSubideasByIdeaId(parentId)
    return subideas
  }

  async findSubideasByGroupId(groupId: string, requesterId: string) {
    const isAllowed = await this.groupRepository.userBelongsToGroup(
      requesterId,
      groupId
    )

    if (!isAllowed) throw new ForbiddenError403("Not allowed")

    const subideas = await this.ideaRepository.findSubideasByGroupId(groupId)
    return subideas
  }

  async findIdeaLinkPreviewInfo(ideaId: string) {
    const idea = await this.ideaRepository.findById(ideaId)
    if (!idea) return null

    if (idea.tabId)
      return {
        description: idea.name,
        title: (await this.tabRepository.findTabById(idea.tabId)).name,
      }

    return {
      description: idea.name,
      title: (await this.ideaRepository.findById(idea.parentId)).name,
    }
  }

  async findAssignedIdeasToUser(requesterId: string) {
    const ideas = await this.ideaRepository.findAssignedIdeasToUser(requesterId)

    return ideas.map((idea: IdeasAssignedToUser) => ({
      idea: {
        id: idea.id,
        name: idea.name,
        isDone: idea.isDone,
        completedAt: idea.completedAt,
      },
      group: {
        groupId: idea.tab?.group.id,
        name: idea.tab?.group.name,
      },
      tab: {
        name: idea.tab?.name,
        tabId: idea.tabId,
      },
    }))
  }

  async moveIdeasToTab(dto: MoveIdeasToTabDto, requesterId: string) {
    const ideaId = dto.ideaIds[0]
    if (!ideaId) throw new InvalidPayloadError400("No idea id provided.")

    const ideaGroup = await this.groupRepository.findGroupByIdeaId(ideaId)
    if (!ideaGroup) throw new NotFoundError404("Origin group not found.")

    const targetGroup = await this.groupRepository.findGroupByTabId(dto.tabId)
    if (!targetGroup) throw new NotFoundError404("Target group not found.")

    if (ideaGroup.id === targetGroup.id) {
      return this.#moveIdeasToTabSameGroup(dto, requesterId)
    }

    return this.#moveIdeasToTabDifferentGroup(dto, requesterId)
  }

  async #moveIdeasToTabSameGroup(dto: MoveIdeasToTabDto, requesterId: string) {
    const userCanAccessTabTarget = this.ideaRepository.userCanAccessTab(
      dto.tabId,
      requesterId
    )
    if (!userCanAccessTabTarget)
      throw new ForbiddenError403("User cannot access target tab.")

    const ideaTabs = await this.ideaRepository.findTabsByIdeaIds(dto.ideaIds)
    if (ideaTabs.length !== 1)
      throw new InvalidPayloadError400("Ideas should belong to the same tab.")

    const userCanAccessTabOrigin = this.ideaRepository.userCanAccessTab(
      ideaTabs[0].id,
      requesterId
    )
    if (!userCanAccessTabOrigin)
      throw new ForbiddenError("User cannot access origin tab.")

    const updatedIdeas = await this.ideaRepository.moveIdeasToTabId(
      dto.ideaIds,
      dto.tabId
    )

    this.socketServer
      .to(socketRooms.group(ideaTabs[0].groupId))
      .emit(socketEvents.moveIdeasToTab, updatedIdeas)

    return updatedIdeas
  }

  async #moveIdeasToTabDifferentGroup(
    dto: MoveIdeasToTabDto,
    requesterId: string
  ) {
    const userCanAcessTargetTab = this.ideaRepository.userCanAccessTab(
      dto.tabId,
      requesterId
    )
    if (!userCanAcessTargetTab)
      throw new ForbiddenError403("User cannot access target tab.")

    const firstIdeaId = dto.ideaIds[0]
    const [originTab] = await this.ideaRepository.findTabsByIdeaIds([
      firstIdeaId,
    ])
    if (!originTab) throw new NotFoundError404("Origin tab not found.")

    const userCanAccessOriginTab = this.ideaRepository.userCanAccessTab(
      originTab.id,
      requesterId
    )

    if (!userCanAccessOriginTab)
      throw new ForbiddenError("User cannot access origin tab.")

    const ideas = await this.ideaRepository.findIdeasByIds(dto.ideaIds)

    const createDtos = ideas.map((idea) => ({
      name: idea.name,
      description: idea.description,
    }))

    await this.ideaRepository.createMany(createDtos, dto.tabId, requesterId)

    await this.ideaRepository.deleteManyIdeas(dto.ideaIds)

    this.socketServer
      .to(socketRooms.group(originTab.groupId))
      .emit(socketEvents.moveIdeasToTab, dto.ideaIds)

    return true
  }
}
