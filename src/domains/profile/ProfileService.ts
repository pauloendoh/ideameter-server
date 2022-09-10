import { urls } from "../../utils/urls";
import { ProfileRepository } from "./ProfileRepository";
import { AwsFileDto } from "./types/AwsFileDto";
import { MulterFileDto } from "./types/MulterFileDto";

export default class ProfileService {
  constructor(private readonly profileRepo = new ProfileRepository()) {}

  updatePicture = async (userId: string, file: MulterFileDto | AwsFileDto) => {
    let imgUrl = "";

    if ("Location" in file) imgUrl = file.Location;
    else if ("filename" in file) imgUrl = urls.publicUploads(file.filename);

    return this.profileRepo.updatePicture(userId, imgUrl);
  };
}
