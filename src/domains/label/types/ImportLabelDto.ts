import { IsString } from "class-validator"

export class ImportLabelDto {
  @IsString()
  name: string

  @IsString()
  bgColor: string
}
