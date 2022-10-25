import { IsString } from "class-validator"

export class GroupUserIdDto {
  @IsString()
  groupId: string

  @IsString()
  userId: string
}
