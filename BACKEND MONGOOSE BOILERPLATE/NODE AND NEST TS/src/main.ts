import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { ENV, addCorsOptions } from "src/config";
import { addErrorHandler } from "src/utils";

async function run() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(addCorsOptions());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new addErrorHandler());
  await app.listen(ENV.PORT);
}

run();
