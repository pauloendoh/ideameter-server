import { urls } from "../../utils/urls"
import { AwsFileDto } from "../profile/types/AwsFileDto"
import { MulterFileDto } from "../profile/types/MulterFileDto"
import { RteImageRepository } from "./RteImageRepository"

export default class RteImageService {
  constructor(private readonly rteImageRepository = new RteImageRepository()) {}

  createRteImage = async (
    userId: string,
    file: MulterFileDto | AwsFileDto,
    ideaId?: string
  ) => {
    let imgUrl = ""

    if ("Location" in file) {
      imgUrl = file.Location
    } else if ("filename" in file) {
      imgUrl = urls.publicUploads(file.filename)
    }

    return this.rteImageRepository.createRteImage(userId, imgUrl, ideaId)
  }

  async handleSubideaImageUpload(params: {
    userId: string
    file: MulterFileDto | AwsFileDto
  }) {
    const { file } = params

    let imageUrl = ""

    if ("Location" in file) {
      imageUrl = file.Location
    } else if ("filename" in file) {
      imageUrl = urls.publicUploads(file.filename)
    }

    return imageUrl
  }
}
