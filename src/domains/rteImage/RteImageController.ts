import { User } from "@prisma/client"
import {
  CurrentUser,
  JsonController,
  Post,
  UploadedFile,
} from "routing-controllers"
import { rteImageMulterConfig } from "../../utils/multer/rteImageMulterConfig"
import { AwsFileDto } from "../profile/types/AwsFileDto"
import { MulterFileDto } from "../profile/types/MulterFileDto"
import RteImageService from "./RteImageService"

@JsonController("")
export class ProfileController {
  constructor(private readonly rteImageService = new RteImageService()) {}

  @Post("/rte-images")
  createRteImage(
    @CurrentUser({ required: true }) user: User,
    @UploadedFile("file", { options: rteImageMulterConfig })
    file: AwsFileDto | MulterFileDto
  ) {
    return this.rteImageService.createRteImage(user.id, file)
  }

  @Post("/subidea/image")
  handleSubideaImageUpload(
    @CurrentUser({ required: true }) user: User,
    @UploadedFile("file", { options: rteImageMulterConfig })
    file: AwsFileDto | MulterFileDto
  ) {
    return this.rteImageService.handleSubideaImageUpload({
      file,
      userId: user.id,
    })
  }
}
