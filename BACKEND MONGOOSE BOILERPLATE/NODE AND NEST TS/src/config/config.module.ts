import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ENV, storage, MongooseConfigService } from "src/config";
import { MongooseModule } from "@nestjs/mongoose";
import { MulterModule } from "@nestjs/platform-express";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => ENV],
      envFilePath: "./src/config/.env",
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    MulterModule.register({
      storage,
    }),
  ],
})
export class AppConfigModule {}
