import { config } from "dotenv";
config();

const { UPLOADS_BASE_URL } = process.env;

export const urls = {
  publicUploads: (fileName: string) => `${UPLOADS_BASE_URL}/${fileName}`,
};
