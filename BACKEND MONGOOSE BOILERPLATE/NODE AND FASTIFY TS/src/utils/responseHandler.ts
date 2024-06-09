import { FastifyReply, FastifyRequest } from "fastify";
import { MetaData } from "../types";

export function responseHandler(
  req: FastifyRequest,
  reply: FastifyReply,
  data: any,
  message: string,
  meta: MetaData = {},
) {
  const response = {
    status: !!data,
    data: data || [],
    message: message,
    meta: meta,
  };

  req.log.info(`Response: ${JSON.stringify(response)}`);

  reply.send(response);
}
