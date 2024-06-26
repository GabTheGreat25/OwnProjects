import { Request, Response, NextFunction, Express } from "express";
import createError from "http-errors";
import { STATUSCODE, RESOURCE } from "../constants";
import { ENV } from "../config";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(createError(STATUSCODE.NOT_FOUND, RESOURCE.NOT_FOUND));
};

const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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

export const addErrorHandler = (app: Express) => {
  app.use(notFound);
  app.use(errorHandler);
};
