import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "src/utils";
import { ENV, addCorsOptions } from "src/config";

async function run() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(addCorsOptions());
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(ENV.PORT);
}

run();
