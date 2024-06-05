import { STATUSCODE, RESOURCE } from "../constants/index.js";
import { ENV } from "../config/index.js";

const notFound = (req, res, next) => {
  const error = new Error(RESOURCE.NOT_FOUND);
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
    message: errorMessage,
    timestamp: new Date().toISOString(),
    url: req.originalUrl,
    stack: ENV.NODE_ENV === RESOURCE.PRODUCTION ? undefined : error.stack,
  });
};

export const addErrorHandler = (app) => {
  app.use(notFound);
  app.use(errorHandler);
};
