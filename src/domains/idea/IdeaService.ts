import { Idea } from "@prisma/client";
import UnauthorizedError401 from "../../utils/errors/UnauthorizedError401";
import IdeaRepository from "./IdeaRepository";

export default class IdeaService {
  constructor(private readonly ideaRepository: IdeaRepository) {}

  async createIdea(idea: Idea, requesterId: string) {
    const isAllowed = await this.ideaRepository.isAllowed(
      idea.tabId,
      requesterId
    );
    if (!isAllowed)
      throw new UnauthorizedError401(
        "You're not allowed to add ideas to this tab"
      );

    const createdIdea = await this.ideaRepository.createIdea(idea, requesterId);
    return createdIdea;
  }
}
