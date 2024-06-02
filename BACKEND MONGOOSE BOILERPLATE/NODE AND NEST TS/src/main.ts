import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ENV, addCorsOptions } from "src/config";

async function run() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(addCorsOptions());
  await app.listen(ENV.PORT);
}

run();
