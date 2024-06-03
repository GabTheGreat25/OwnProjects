import model from "./model.js";
import {
  AdminDiscriminator,
  EmployeeDiscriminator,
  CustomerDiscriminator,
} from "./discriminators/index.js";
import { ROLE, RESOURCE } from "../../../constants/index.js";

async function getAll() {
  return await model.find({ deleted: false }).select("+password");
}

async function getAllDeleted() {
  return await model.find({ deleted: true });
}

async function getById(_id) {
  return await model.findOne({ _id, deleted: false });
}

async function getEmail(email) {
  return await model
    .findOne({ email, deleted: false })
    .select(RESOURCE.PASSWORD);
}

async function add(body) {
  return await (
    body.roles === ROLE.ADMIN
      ? AdminDiscriminator
      : body.roles === ROLE.EMPLOYEE
        ? EmployeeDiscriminator
        : body.roles === ROLE.CUSTOMER
          ? CustomerDiscriminator
          : model
  ).create([body]);
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
  getEmail,
  add,
  update,
  deleteById,
  restoreById,
  forceDelete,
};
