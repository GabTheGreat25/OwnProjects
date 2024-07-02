import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { STATUSCODE, RESOURCE } from "../constants";

export async function transaction(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const session = await mongoose.startSession();
  session.startTransaction();

  req.session = session;

  res.on(RESOURCE.FINISH, async () => {
    res.statusCode >= STATUSCODE.OK && res.statusCode < STATUSCODE.BAD_REQUEST
      ? await session.commitTransaction()
      : await session.abortTransaction();

    session.endSession();
  });

  next();
}
