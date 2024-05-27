import model from "./model.js";
import lookup from "../../../utils/aggregate.js";
import { RESOURCE } from "../../../constants/index.js";

async function getAll() {
  return await model
    .aggregate()
    .match({ deleted: false })
    .append(lookup(RESOURCE.TESTS, RESOURCE.TEST, RESOURCE.TEST, []));
}

async function getAllDeleted() {
  return await model
    .aggregate()
    .match({ deleted: true })
    .append(lookup(RESOURCE.TESTS, RESOURCE.TEST, RESOURCE.TEST, []));
}

async function getById(_id) {
  const result = await model.findOne({ _id, deleted: false });
  return result
    ? await model
        .aggregate()
        .match({ _id: result._id })
        .append(lookup(RESOURCE.TESTS, RESOURCE.TEST, RESOURCE.TEST, []))
    : null;
}

async function getImageById(_id) {
  return await model.findOne({ _id, deleted: false }).select("image");
}

async function add(body) {
  return await model.create(body);
}

async function update(_id, body) {
  return await model.findOneAndUpdate({ _id }, body, { new: true });
}

async function deleteById(_id) {
  return await model.findOneAndUpdate({ _id }, { deleted: true });
}

async function restoreById(_id) {
  return await model.findOneAndUpdate({ _id }, { deleted: false });
}

async function forceDelete(_id) {
  return await model.findOneAndDelete({ _id });
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
