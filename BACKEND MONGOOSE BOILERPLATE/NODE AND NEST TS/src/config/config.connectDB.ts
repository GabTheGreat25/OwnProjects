import { Injectable, Logger } from "@nestjs/common";
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from "@nestjs/mongoose";
import mongoose from "mongoose";
import { ENV } from "src/config";
import { STATUSCODE } from "src/constants";

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  private readonly logger = new Logger(MongooseConfigService.name);

  async createMongooseOptions(): Promise<MongooseModuleOptions> {
    try {
      mongoose.set("strictQuery", false);
      await mongoose.connect(ENV.DATABASE_URI);
      this.logger.log(`Host Database connected to ${ENV.DATABASE_URI}`);
      this.logger.log(`Host Server started on port ${ENV.PORT}`);
    } catch (err) {
      this.logger.error(`Database connection error: ${err.message}`);
      process.exit(STATUSCODE.ONE);
    }

    return {
      uri: ENV.DATABASE_URI,
    };
  }
}
