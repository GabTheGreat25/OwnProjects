import { Module } from "@nestjs/common";
import { AppConfigModule } from "./config/config.module";
import { RoutesModule } from "./routes/routes.module";
import { JwtModule } from "./middleware/middleware.module";

@Module({
  imports: [AppConfigModule, JwtModule, RoutesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
