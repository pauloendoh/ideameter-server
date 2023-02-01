import { User } from "@prisma/client"
import {
  CurrentUser,
  Get,
  JsonController,
  QueryParam,
} from "routing-controllers"
import UserService from "./UserService"

@JsonController("/user")
export class UserController {
  constructor(private userService = new UserService()) {}

  @Get("/search")
  searchUsers(
    @CurrentUser({ required: true }) user: User,
    @QueryParam("q", { required: true }) q: string
  ) {
    return this.userService.findByText(q)
  }
}
