import {} from "endoh-utils"
import ForbiddenError403 from "../../utils/errors/ForbiddenError403"
import GroupRepository from "../group/GroupRepository"
import UserRepository from "./UserRepository"

export default class UserService {
  constructor(
    private readonly userRepository = new UserRepository(),
    private readonly groupRepo = new GroupRepository()
  ) {}

  async findById(userId: string) {
    return this.userRepository.findById(userId)
  }

  async findByText(text: string) {
    return this.userRepository.findByText(text)
  }

  async findLastOpenedGroupId(userId: string) {
    return (await this.userRepository.findById(userId)).lastOpenedGroupId
  }

  async updateLastOpenedGroupId(userId: string, groupId: string) {
    const isAllowed = await this.groupRepo.userBelongsToGroup({
      userId,
      groupId,
    })

    if (!isAllowed)
      throw new ForbiddenError403("User does not belong to this group.")

    return this.userRepository.updateLastOpenedGroupId(userId, groupId)
  }
}
