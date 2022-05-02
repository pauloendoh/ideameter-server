import { User } from "@prisma/client";
import { Request } from "express";

export interface MyAuthRequest extends Request {
  user: User;
}
