import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { HttpStatus } from "@nestjs/common";

@Injectable()
export class TransactionMiddleware implements NestMiddleware {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const session = await this.connection.startSession();
    session.startTransaction();

    (req as any).session = session;

    res.on("finish", async () => {
      if (
        res.statusCode >= HttpStatus.OK &&
        res.statusCode < HttpStatus.BAD_REQUEST
      ) {
        await session.commitTransaction();
      } else {
        await session.abortTransaction();
      }
      session.endSession();
    });

    next();
  }
}
