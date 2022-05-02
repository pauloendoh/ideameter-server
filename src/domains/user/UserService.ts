import UserRepository from "./UserRepository";

export default class UserService {
  constructor(private readonly userRepository = new UserRepository()) {}

  public async findById(userId: string) {
    return this.userRepository.findById(userId);
  }
}
