import { IsArray, IsString } from "class-validator";

export class MoveIdeasToTabDto {
  @IsString()
  tabId: string;

  @IsArray()
  ideaIds: string[];
}
