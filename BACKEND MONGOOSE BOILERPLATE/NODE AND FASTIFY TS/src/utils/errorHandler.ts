import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import createError from "http-errors";
import { STATUSCODE, RESOURCE } from "../constants";
import { ENV } from "../config";

const notFound = (req: FastifyRequest, reply: FastifyReply) => {
  reply.send(createError(STATUSCODE.NOT_FOUND, RESOURCE.NOT_FOUND));
};

const errorHandler = (error: any, req: FastifyRequest, reply: FastifyReply) => {
  let statusCode = error.statusCode || STATUSCODE.INTERNAL_SERVER_ERROR;
  let errorMessage = error.message;

  if (error.name === RESOURCE.VALIDATION_ERROR) {
    statusCode = STATUSCODE.BAD_REQUEST;
    errorMessage = error.message;
  }

  const data = {
    status: false,
    message: errorMessage,
    timestamp: new Date().toISOString(),
    url: req.raw.url,
    stack: ENV.NODE_ENV === RESOURCE.PRODUCTION ? undefined : error.stack,
  };

  req.log.error(data);
  reply.status(statusCode).send(data);
};

export const addErrorHandler = (app: FastifyInstance) => {
  app.setNotFoundHandler(notFound);
  app.setErrorHandler(errorHandler);
};
