import model from "./model";
import testChildModel from "../testsChild/model";
import { TestModel } from "../../../types/index";

async function getAll() {
  return await model.find({ deleted: false });
}

async function getAllDeleted() {
  return await model.find({ deleted: true });
}

async function getById(_id: string) {
  return await model.findOne({ _id, deleted: false });
}

async function getImageById(_id: string) {
  return await model.findOne({ _id, deleted: false }).select("image");
}

async function add(body: TestModel) {
  return await model.create(body);
}

async function update(_id: string, body: TestModel) {
  return await model.findOneAndUpdate({ _id }, body, { new: true });
}

async function deleteById(_id: string) {
  return await model.findOneAndUpdate({ _id }, { deleted: true });
}

async function restoreById(_id: string) {
  return await model.findOneAndUpdate({ _id }, { deleted: false });
}

async function forceDelete(_id: String) {
  const deletedDocument = await model.findOneAndDelete({ _id });

  return Promise.all([testChildModel.deleteMany({ test: _id })]).then(
    () => deletedDocument
  );
}

export default {
  getAll,
  getAllDeleted,
  getById,
  getImageById,
  add,
  update,
  deleteById,
  restoreById,
  forceDelete,
};
