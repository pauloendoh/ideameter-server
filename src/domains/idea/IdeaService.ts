import { IdeaWithRelationsType } from "../../types/domain/idea/IdeaWithLabelsType";
import ForbiddenError403 from "../../utils/errors/ForbiddenError403";
import NotFoundError404 from "../../utils/errors/NotFoundError404";
import GroupRepository from "../group/GroupRepository";
import IdeaRepository from "./IdeaRepository";

export default class IdeaService {
  constructor(
    private readonly ideaRepository = new IdeaRepository(),
    private readonly groupRepository = new GroupRepository()
  ) {}

  async createIdea(idea: IdeaWithRelationsType, requesterId: string) {
    const isAllowed = await this.ideaRepository.userCanAccessTab(
      idea.tabId,
      requesterId
    );
    if (!isAllowed)
      throw new ForbiddenError403(
        "You're not allowed to add ideas to this tab"
      );

    const createdIdea = await this.ideaRepository.createIdea(idea, requesterId);
    return createdIdea;
  }

  async createSubidea(idea: IdeaWithRelationsType, requesterId: string) {
    const parent = await this.ideaRepository.findById(idea.parentId);
    if (!parent) throw new ForbiddenError403("Parent idea not found");

    const isAllowed = await this.ideaRepository.userCanAccessTab(
      parent.tabId,
      requesterId
    );
    if (!isAllowed)
      throw new ForbiddenError403(
        "You're not allowed to add ideas to this tab"
      );

    idea.tabId = undefined;
    const createdIdea = await this.ideaRepository.createIdea(idea, requesterId);
    return createdIdea;
  }

  async findIdeasByGroupId(groupId: string, requesterId: string) {
    const isAllowed = await this.groupRepository.userBelongsToGroup(
      requesterId,
      groupId
    );
    if (!isAllowed)
      throw new ForbiddenError403("You're not allowed to see this group");

    const ideas = await this.ideaRepository.findIdeasAndSubIdeasByGroupId(
      groupId
    );
    return ideas;
  }

  async findIdeasByTabId(tabId: string, requesterId: string) {
    const isAllowed = await this.ideaRepository.userCanAccessTab(
      tabId,
      requesterId
    );
    if (!isAllowed)
      throw new ForbiddenError403("You're not allowed to see this tab");

    const ideas = await this.ideaRepository.findIdeasByTabId(tabId);
    return ideas;
  }

  async updateIdea(idea: IdeaWithRelationsType, requesterId: string) {
    const isAllowed = await this.ideaRepository.userCanAccessTab(
      idea.tabId,
      requesterId
    );
    if (!isAllowed)
      throw new ForbiddenError403("You're not allowed to update this idea");

    const updatedIdea = await this.ideaRepository.updateIdea(idea);
    return updatedIdea;
  }

  async findSubideasByIdeaId(parentId: string, requesterId: string) {
    const parent = await this.ideaRepository.findById(parentId);
    if (!parent) throw new NotFoundError404("Parent idea not found");

    const isAllowed = await this.ideaRepository.userCanAccessTab(
      parent.tabId,
      requesterId
    );
    if (!isAllowed) throw new ForbiddenError403("Not allowed");

    const subideas = await this.ideaRepository.findSubideasByIdeaId(parentId);
    return subideas;
  }

  async findSubideasByGroupId(groupId: string, requesterId: string) {
    const isAllowed = await this.groupRepository.userBelongsToGroup(
      requesterId,
      groupId
    );

    if (!isAllowed) throw new ForbiddenError403("Not allowed");

    const subideas = await this.ideaRepository.findSubideasByGroupId(groupId);
    return subideas;
  }
}
