import { randomBytes } from "crypto";
import multer, { diskStorage } from "multer";
import s3Storage from "multer-sharp-s3";
import path from "path";

import aws from "aws-sdk";

const UPLOAD_PATH = path.resolve(__dirname, "../../../public/uploads");

const localDiskStorage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_PATH);
  },

  filename: (req, file, cb) => {
    // garantir que os nomes não se sobreponham
    // usa-se um hash
    randomBytes(16, (err, hash) => {
      if (err) throw err;

      const filename = `${hash.toString("hex")}-${file.originalname}`;

      cb(null, filename);
    });
  },
});

const s3 = new aws.S3();

const myS3Storage = s3Storage({
  s3: s3,
  Bucket: "endoh",
  ACL: "public-read", // permissão
  // resize: {
  //   width: 300,
  //   height: 300,
  // },
  Key: (req, file, cb) => {
    // garantir que os nomes não se sobreponham
    // usa-se um hash
    randomBytes(16, (err, hash) => {
      if (err) throw err;

      const fileName = `${hash.toString("hex")}-${file.originalname}`;

      cb(null, fileName);
    });
  },
});

// mesma coisa que o profileImageMulterConfig, mas ele não faz resizing
export const rteImageMulterConfig: multer.Options = {
  storage:
    process.env.IS_S3_STORAGE === "true" ? myS3Storage : localDiskStorage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type."));
    }
  },
};
