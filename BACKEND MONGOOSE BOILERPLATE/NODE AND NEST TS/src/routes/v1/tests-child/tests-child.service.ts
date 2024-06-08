import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { TestsChild } from "./entities/tests-child.entity";
import { CreateTestsChildDto } from "./dto/create-tests-child.dto";
import { UpdateTestsChildDto } from "./dto/update-tests-child.dto";
import { lookup } from "src/utils";
import { RESOURCE } from "src/constants";

@Injectable()
export class TestsChildService {
  constructor(
    @InjectModel(TestsChild.name) private testsChildModel: Model<TestsChild>,
  ) {}

  getAll() {
    return this.testsChildModel
      .aggregate()
      .match({ deleted: false })
      .append(lookup(RESOURCE.TESTS, RESOURCE.TEST, RESOURCE.TEST, []));
  }

  getAllDeleted() {
    return this.testsChildModel
      .aggregate()
      .match({ deleted: true })
      .append(lookup(RESOURCE.TESTS, RESOURCE.TEST, RESOURCE.TEST, []));
  }

  getById(_id: string) {
    return this.testsChildModel
      .aggregate()
      .match({
        _id: mongoose.Types.ObjectId.createFromHexString(_id),
        deleted: false,
      })
      .append(lookup(RESOURCE.TESTS, RESOURCE.TEST, RESOURCE.TEST, []));
  }

  getImageById(_id: string) {
    return this.testsChildModel
      .findOne({ _id, deleted: false })
      .select("image");
  }

  add(createTestsChildDto: CreateTestsChildDto) {
    return this.testsChildModel.create(createTestsChildDto);
  }

  update(_id: string, updateTestsChildDto: UpdateTestsChildDto) {
    return this.testsChildModel.findByIdAndUpdate(_id, updateTestsChildDto, {
      new: true,
      runValidators: true,
    });
  }

  deleteById(_id: string) {
    return this.testsChildModel.findByIdAndUpdate(_id, { deleted: true });
  }

  restoreById(_id: string) {
    return this.testsChildModel.findByIdAndUpdate(_id, { deleted: false });
  }

  forceDelete(_id: string) {
    return this.testsChildModel.findByIdAndDelete(_id);
  }
}
