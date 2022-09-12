import { User } from "@prisma/client";
import {
  CurrentUser,
  JsonController,
  Put,
  UploadedFile,
} from "routing-controllers";
import { profileImageMulterConfig } from "../../utils/multer/profileImageMulterConfig";
import ProfileService from "./ProfileService";
import { AwsFileDto } from "./types/AwsFileDto";
import { MulterFileDto } from "./types/MulterFileDto";

@JsonController("/profiles")
export class ProfileController {
  constructor(private profileService = new ProfileService()) {}

  @Put("/picture")
  findTagsByUserId(
    @CurrentUser({ required: true }) user: User,
    @UploadedFile("file", { options: profileImageMulterConfig })
    file: AwsFileDto | MulterFileDto
  ) {
    return this.profileService.updatePicture(user.id, file);
  }
}
