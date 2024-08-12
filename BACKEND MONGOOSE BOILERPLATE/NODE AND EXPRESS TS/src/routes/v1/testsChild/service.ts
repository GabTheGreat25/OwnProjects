import mongoose from "mongoose";
import model from "./model";
import { lookup } from "../../../utils";
import { RESOURCE } from "../../../constants";
import { TestChildModel } from "../../../types";

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

async function getById(_id: string) {
  return await model
    .aggregate()
    .match({
      _id: mongoose.Types.ObjectId.createFromHexString(_id),
      deleted: false,
    })
    .append(lookup(RESOURCE.TESTS, RESOURCE.TEST, RESOURCE.TEST, []));
}

async function getImageById(_id: string) {
  return await model.findOne({ _id, deleted: false }).select("image");
}

async function add(body: TestChildModel, session: any) {
  return await model.create([body], { session });
}

async function update(_id: string, body: TestChildModel, session: any) {
  return await model.findByIdAndUpdate(_id, body, {
    new: true,
    runValidators: true,
    session,
  });
}

async function deleteById(_id: string, session: any) {
  return await model.findByIdAndUpdate(_id, { deleted: true }, { session });
}

async function restoreById(_id: string, session: any) {
  return await model.findByIdAndUpdate(_id, { deleted: false }, { session });
}

async function forceDelete(_id: string, session: any) {
  return await model.findByIdAndDelete(_id, { session });
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
