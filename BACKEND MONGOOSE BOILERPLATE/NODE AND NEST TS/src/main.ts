import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ENV, addCorsOptions } from "src/config";
import { addErrorHandler } from "src/utils";

async function run() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(addCorsOptions());
  app.useGlobalFilters(new addErrorHandler());
  await app.listen(ENV.PORT);
}

run();
