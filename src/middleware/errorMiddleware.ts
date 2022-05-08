import { NextFunction, Request, Response } from "express";
import { AlreadyExistsError409 } from "../utils/errors/AlreadyExistsError409";
import ForbiddenError403 from "../utils/errors/ForbiddenError403";
import { InvalidPayloadError400 } from "../utils/errors/InvalidPayloadError400";
import NotFoundError404 from "../utils/errors/NotFoundError404";
import UnauthorizedError401 from "../utils/errors/UnauthorizedError401";

export default function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(error);
  if (error instanceof InvalidPayloadError400)
    res.status(400).send(error.message || "Invalid payload");
  else if (error instanceof UnauthorizedError401)
    res.status(401).send(error.message || "Unauthorized");
  else if (error instanceof ForbiddenError403)
    res.status(403).send(error.message || "Forbidden");
  else if (error instanceof NotFoundError404)
    res.status(404).send(error.message || "Not found");

  if (error instanceof AlreadyExistsError409)
    res.status(409).send(error.message || "Already exists");
  else res.status(500).send("Internal Server Error");

  return next(error);
}
