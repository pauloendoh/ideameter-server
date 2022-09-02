import ForbiddenError403 from "../../utils/errors/ForbiddenError403";
import GroupRepository from "../group/GroupRepository";
import UserRepository from "./UserRepository";

export default class UserService {
  constructor(
    private readonly userRepository = new UserRepository(),
    private readonly groupRepo = new GroupRepository()
  ) {}

  public async findById(userId: string) {
    return this.userRepository.findById(userId);
  }

  public async findByText(text: string) {
    return this.userRepository.findByText(text);
  }

  public async findLastOpenedGroupId(userId: string) {
    return (await this.userRepository.findById(userId)).lastOpenedGroupId;
  }

  public async updateLastOpenedGroupId(userId: string, groupId: string) {
    const isAllowed = await this.groupRepo.userBelongsToGroup(userId, groupId);

    if (!isAllowed)
      throw new ForbiddenError403("User does not belong to this group.");

    await this.userRepository.updateLastOpenedGroupId(userId, groupId);
  }
}
