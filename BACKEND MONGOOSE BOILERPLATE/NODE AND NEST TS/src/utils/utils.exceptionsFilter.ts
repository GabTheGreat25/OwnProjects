import { Catch, ArgumentsHost, HttpStatus } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Request, Response } from "express";

export class CustomError extends Error {
  constructor(
    public message: string,
    public status: number,
  ) {
    super(message);
  }
}

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof CustomError && exception.status
        ? exception.status
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof CustomError && exception.message
        ? exception.message
        : "Internal Server Error";

    response.status(status).json({
      status: false,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      stack:
        process.env.NODE_ENV === "production" ? undefined : exception.stack,
    });
  }
}
