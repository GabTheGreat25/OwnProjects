import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Response } from "express";
import { ENV } from "src/config";
import { RESOURCE } from "src/constants";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = exception.message || RESOURCE.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      const errorResponse = exception.getResponse();
      if (typeof errorResponse === "object" && errorResponse !== null) {
        message = errorResponse["message"] || message;
      }
    }

    const errorResponse = {
      status: false,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(ENV.NODE_ENV !== RESOURCE.PRODUCTION && { stack: exception.stack }),
    };

    this.logger.error(
      `HTTP Status: ${status} Error Message: ${message}`,
      ENV.NODE_ENV !== RESOURCE.PRODUCTION ? exception.stack : "",
    );

    response.status(status).json(errorResponse);
  }
}
