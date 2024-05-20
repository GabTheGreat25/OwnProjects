import { STATUSCODE, RESOURCE } from "../constants/index.js";
import ENV from "../config/environment.js";

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = STATUSCODE.NOT_FOUND;
  next(error);
};

const errorHandler = (error, req, res, next) => {
  let statusCode = error.status || STATUSCODE.INTERNAL_SERVER_ERROR;
  let errorMessage = error.message;

  if (error.name === RESOURCE.VALIDATION_ERROR)
    statusCode = STATUSCODE.BAD_REQUEST;
  errorMessage = error.message;

  res.status(statusCode).json({
    status: false,
    message: error.message,
    stack: ENV.NODE_ENV === RESOURCE.PRODUCTION ? null : error.stack,
  });
};

export const addErrorHandler = (app) => {
  app.use(notFound);
  app.use(errorHandler);
};
