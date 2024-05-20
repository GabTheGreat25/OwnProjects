import model from "./model.js";
import lookup from "../../../utils/aggregate.js";
import { RESOURCE } from "../../../constants/index.js";

const getAll = async () => {
  return await model
    .aggregate()
    .match({ deleted: false })
    .append(lookup(RESOURCE.TESTS, RESOURCE.TEST, RESOURCE.TEST, []));
};

const getAllDeleted = async () => {
  return await model
    .aggregate()
    .match({ deleted: true })
    .append(lookup(RESOURCE.TESTS, RESOURCE.TEST, RESOURCE.TEST, []));
};

const getById = async (_id) => {
  const result = await model.findOne({ _id, deleted: false });
  return result
    ? await model
        .aggregate()
        .match({ _id: result._id })
        .append(lookup(RESOURCE.TESTS, RESOURCE.TEST, RESOURCE.TEST, []))
    : null;
};

const add = async (body) => {
  return await model.create(body);
};

const update = async (_id, body) => {
  return await model.findOneAndUpdate({ _id }, body);
};

const deleteById = async (_id) => {
  return await model.findOneAndUpdate({ _id }, { deleted: true });
};

const restoreById = async (_id) => {
  return await model.findOneAndUpdate(
    { _id },
    { deleted: false },
    { new: true }
  );
};

const forceDelete = async (_id) => {
  return await model.findOneAndDelete({ _id });
};

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
