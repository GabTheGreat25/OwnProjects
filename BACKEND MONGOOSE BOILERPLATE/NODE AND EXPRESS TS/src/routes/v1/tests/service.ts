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

async function add(body: TestModel, session: any) {
  return await model.create([body], { session });
}

async function update(_id: string, body: TestModel, session: any) {
  return await model.findByIdAndUpdate(_id, body, {
    new: true,
    runValidators: true,
    session,
  });
}

async function deleteById(_id: string, session: any) {
  return Promise.all([
    testChildModel
      .updateMany({ test: _id }, { deleted: true })
      .session(session),
  ]).then(() => model.findByIdAndUpdate(_id, { deleted: true }, { session }));
}

async function restoreById(_id: string, session: any) {
  return Promise.all([
    testChildModel
      .updateMany({ test: _id }, { deleted: false })
      .session(session),
  ]).then(() => model.findByIdAndUpdate(_id, { deleted: false }, { session }));
}

async function forceDelete(_id: String, session: any) {
  return Promise.all([
    testChildModel.deleteMany({ test: _id }).session(session),
  ]).then(() => model.findByIdAndDelete(_id, { session }));
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
