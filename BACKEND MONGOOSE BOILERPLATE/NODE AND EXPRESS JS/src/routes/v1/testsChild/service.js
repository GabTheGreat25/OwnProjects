import mongoose from "mongoose";
import model from "./model.js";
import { lookup } from "../../../utils/index.js";
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
  return await model
    .aggregate()
    .match({
      _id: new mongoose.Types.ObjectId.createFromTime(_id),
      deleted: false,
    })
    .append(lookup(RESOURCE.TESTS, RESOURCE.TEST, RESOURCE.TEST, []));
}

async function getImageById(_id) {
  return await model.findOne({ _id, deleted: false }).select("image");
}

async function add(body) {
  return await model.create(body);
}

async function update(_id, body) {
  return await model.findByIdAndUpdate(_id, body, { new: true });
}

async function deleteById(_id) {
  return await model.findByIdAndUpdate(_id, { deleted: true });
}

async function restoreById(_id) {
  return await model.findByIdAndUpdate(_id, { deleted: false });
}

async function forceDelete(_id) {
  return await model.findByIdAndDelete(_id);
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
