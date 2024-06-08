import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Test } from "./entities/test.entity";
import { TestsChild } from "../tests-child/entities/tests-child.entity";
import { CreateTestDto } from "./dto/create-test.dto";
import { UpdateTestDto } from "./dto/update-test.dto";

@Injectable()
export class TestsService {
  constructor(
    @InjectModel(Test.name) private testModel: Model<Test>,
    @InjectModel(TestsChild.name) private testsChildModel: Model<TestsChild>,
  ) {}

  getAll() {
    return this.testModel.find({ deleted: false });
  }

  getAllDeleted() {
    return this.testModel.find({ deleted: true });
  }

  getById(_id: string) {
    return this.testModel.findOne({ _id, deleted: false });
  }

  add(createTestDto: CreateTestDto) {
    return this.testModel.create(createTestDto);
  }

  update(_id: string, updateTestDto: UpdateTestDto) {
    return this.testModel.findByIdAndUpdate(_id, updateTestDto, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(_id: string) {
    return Promise.all([
      this.testsChildModel.updateMany({ test: _id }, { deleted: true }),
    ]).then(() =>
      this.testModel.findByIdAndUpdate(_id, {
        deleted: true,
      }),
    );
  }

  async restoreById(_id: string) {
    return Promise.all([
      this.testsChildModel.updateMany({ test: _id }, { deleted: false }),
    ]).then(() =>
      this.testModel.findByIdAndUpdate(_id, {
        deleted: false,
      }),
    );
  }

  async forceDelete(_id: string) {
    return Promise.all([this.testsChildModel.deleteMany({ test: _id })]).then(
      () => this.testModel.findByIdAndDelete(_id),
    );
  }
}
