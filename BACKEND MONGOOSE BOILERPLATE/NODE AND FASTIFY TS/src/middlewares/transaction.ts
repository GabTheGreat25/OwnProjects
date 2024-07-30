import mongoose from "mongoose";
import { STATUSCODE, RESOURCE } from "../constants/index.js";
import { FastifyReply } from "fastify";
import { CustomFastifyRequest } from "../types";

export async function transaction(
  req: CustomFastifyRequest,
  reply: FastifyReply,
) {
  const session = await mongoose.startSession();
  session.startTransaction();
  req.session = session;

  async function handleTransaction() {
    reply.statusCode >= STATUSCODE.OK &&
    reply.statusCode < STATUSCODE.BAD_REQUEST
      ? await session.commitTransaction()
      : await session.abortTransaction();

    session.endSession();
    reply.raw.off(RESOURCE.FINISH, handleTransaction);
  }

  reply.raw.once(RESOURCE.FINISH, handleTransaction);
}
