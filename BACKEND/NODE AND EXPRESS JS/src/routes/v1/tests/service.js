import model from "./model.js";

async function getAll() {
  return await model.find({ deleted: false });
}

async function getAllDeleted() {
  return await model.find({ deleted: true });
}

async function getById(_id) {
  return await model.findOne({ _id, deleted: false });
}

async function add(body) {
  return await model.create(body);
}

async function update(_id, body) {
  return await model.findOneAndUpdate({ _id }, body);
}

async function deleteById(_id) {
  return await model.findOneAndUpdate({ _id }, { deleted: true });
}

async function restoreById(_id) {
  return await model.findOneAndUpdate(
    { _id },
    { deleted: false },
    { new: true }
  );
}

async function forceDelete(_id) {
  return await model.findOneAndDelete({ _id });
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
