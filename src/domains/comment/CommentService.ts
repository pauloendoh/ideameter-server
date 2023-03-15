import { Comment } from "@prisma/client"
import { ForbiddenError } from "routing-controllers"
import IdeaRepository from "../idea/IdeaRepository"
import { CommentRepository } from "./CommentRepository"

export class CommentService {
  constructor(
    private commentRepo = new CommentRepository(),
    private ideaRepo = new IdeaRepository()
  ) {}

  async findManyByIdeaId(ideaId: string, requesterId: string) {
    const isAllowed = await this.ideaRepo.userIdsCanAccessIdea({
      userIds: [requesterId],
      ideaId,
    })
    if (!isAllowed) {
      throw new ForbiddenError("Not allowed")
    }

    const comments = await this.commentRepo.findByIdeaId(ideaId)
    return comments
  }

  async save(dto: Comment, requesterId: string) {
    if (dto.id) {
      return this.update(dto, requesterId)
    }
    return this.create(dto, requesterId)
  }

  async update(dto: Comment, requesterId: string) {
    const comment = await this.commentRepo.update(dto, requesterId)
    return comment
  }

  async create(dto: Comment, requesterId: string) {
    const comment = await this.commentRepo.create(dto, requesterId)
    return comment
  }
}
