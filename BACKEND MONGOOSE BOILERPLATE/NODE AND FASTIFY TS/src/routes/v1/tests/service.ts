import model from "./model";
import testChildModel from "../testsChild/model";
import { TestModel } from "../../../types";

async function getAll() {
  return await model.find({ deleted: false });
}

async function getAllDeleted() {
  return await model.find({ deleted: true });
}

async function getById(_id: string) {
  return await model.findOne({ _id, deleted: false });
}

async function add(body: TestModel) {
  return await model.create(body);
}

async function update(_id: string, body: TestModel) {
  return await model.findByIdAndUpdate(_id, body, {
    new: true,
    runValidators: true,
  });
}

async function deleteById(_id: string) {
  return Promise.all([
    testChildModel.updateMany({ test: _id }, { deleted: true }),
  ]).then(() => model.findByIdAndUpdate(_id, { deleted: true }));
}

async function restoreById(_id: string) {
  return Promise.all([
    testChildModel.updateMany({ test: _id }, { deleted: false }),
  ]).then(() => model.findByIdAndUpdate(_id, { deleted: false }));
}

async function forceDelete(_id: string) {
  return Promise.all([testChildModel.deleteMany({ test: _id })]).then(() =>
    model.findByIdAndDelete(_id),
  );
}

export default {
  getAll,
  getAllDeleted,
  getById,
  add,
  update,
  deleteById,
  restoreById,
  forceDelete,
};
