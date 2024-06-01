import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TestsChild, TestsChildSchema } from "./entities/tests-child.entity";
import { TestsChildService } from "./tests-child.service";
import { TestsChildController } from "./tests-child.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TestsChild.name, schema: TestsChildSchema },
    ]),
  ],
  controllers: [TestsChildController],
  providers: [TestsChildService],
})
export class TestsChildModule {}
