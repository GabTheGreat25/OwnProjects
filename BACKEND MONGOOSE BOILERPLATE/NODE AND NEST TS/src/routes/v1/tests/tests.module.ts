import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestSchema } from "./entities/test.entity";
import {
  TestsChild,
  TestsChildSchema,
} from "../tests-child/entities/tests-child.entity";
import { TestsService } from "./tests.service";
import { TestsController } from "./tests.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Test.name, schema: TestSchema },
      { name: TestsChild.name, schema: TestsChildSchema },
    ]),
  ],
  providers: [TestsService],
  controllers: [TestsController],
})
export class TestsModule {}
