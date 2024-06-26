import createError from "http-errors";
import { STATUSCODE, RESOURCE } from "../constants/index.js";
import { ENV } from "../config/index.js";

const notFound = (req, reply) => {
  reply.send(createError(STATUSCODE.NOT_FOUND, RESOURCE.NOT_FOUND));
};

const errorHandler = (error, req, reply) => {
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

export const addErrorHandler = (app) => {
  app.setNotFoundHandler(notFound);
  app.setErrorHandler(errorHandler);
};
