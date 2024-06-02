import { Module } from "@nestjs/common";
import { AppConfigModule } from "src/config/config.module";
import { RoutesModule } from "src/routes/routes.module";
import { JwtModule } from "src/middleware/middleware.module";

@Module({
  imports: [AppConfigModule, JwtModule, RoutesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
