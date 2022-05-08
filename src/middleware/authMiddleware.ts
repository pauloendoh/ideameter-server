import { config } from "dotenv";
import { NextFunction, Response } from "express";
import { verify as validateJwt } from "jsonwebtoken";
import UserService from "../domains/user/UserService";
import { MyAuthRequest } from "../types/domain/auth/MyAuthRequest";
import UnauthorizedError401 from "../utils/errors/UnauthorizedError401";

config();

// PE 2/3
export default function authMiddleware(
  req: MyAuthRequest,
  res: Response,
  next: NextFunction
) {
  const authToken = req.header("x-auth-token");

  if (!authToken) throw new UnauthorizedError401("No token provided");

  validateJwt(authToken, process.env.JWT_SECRET, async (error, decodedObj) => {
    if (error)
      return res.status(401).send("Token is not valid. Sign in and try again.");

    req.user = await new UserService().findById(decodedObj["userId"]);
    next();
  });
}
