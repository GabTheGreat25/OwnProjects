import { Module, MiddlewareConsumer, NestModule, Global } from "@nestjs/common";
import { JwtModule as NestJwtModule } from "@nestjs/jwt";
import { TokenService, TransactionMiddleware } from "src/middleware";
import { ENV } from "src/config";

@Global()
@Module({
  imports: [
    NestJwtModule.register({
      secret: ENV.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: "7d" },
    }),
  ],
  providers: [TokenService],
  exports: [NestJwtModule, TokenService],
})
export class JwtModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TransactionMiddleware).forRoutes("*");
  }
}
