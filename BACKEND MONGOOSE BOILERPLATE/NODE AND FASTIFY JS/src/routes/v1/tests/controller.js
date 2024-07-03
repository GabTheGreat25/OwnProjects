import createError from "http-errors";
import service from "./service.js";
import { STATUSCODE } from "../../../constants/index.js";
import { responseHandler, multipleImages } from "../../../utils/index.js";

const getAllTests = async (req, reply) => {
  const data = await service.getAll();

  responseHandler(
    req,
    reply,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Tests found"
      : "All Tests retrieved successfully",
  );
};

const getAllTestsDeleted = async (req, reply) => {
  const data = await service.getAllDeleted();

  responseHandler(
    req,
    reply,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Deleted Tests found"
      : "All Deleted Tests retrieved successfully",
  );
};

const getSingleTest = async (req, reply) => {
  const data = await service.getById(req.params.id);

  responseHandler(
    req,
    reply,
    data,
    !data ? "No Test found" : "Test retrieved successfully",
  );
};

const createNewTest = async (req, reply) => {
  const session = req.session;
  const uploadedImages = await multipleImages(req.files, []);

  if (uploadedImages.length === STATUSCODE.ZERO)
    throw createError(STATUSCODE.BAD_REQUEST, "Image is required");

  const data = await service.add(
    {
      ...req.body,
      image: uploadedImages,
    },
    session,
  );

  responseHandler(req, reply, [data], "Test created successfully");
};

const updateTest = async (req, reply) => {
  const session = req.session;
  const oldData = await service.getById(req.params.id);

  const uploadNewImages = await multipleImages(
    req.files,
    oldData?.image.map((image) => image.public_id) || [],
  );

  const data = await service.update(
    req.params.id,
    {
      ...req.body,
      image: uploadNewImages,
    },
    session,
  );

  responseHandler(req, reply, [data], "Test updated successfully");
};

const deleteTest = async (req, reply) => {
  const session = req.session;
  const data = await service.deleteById(req.params.id, session);

  responseHandler(
    req,
    reply,
    data?.deleted ? [] : [data],
    data?.deleted ? "Test is already deleted" : "Test deleted successfully",
  );
};

const restoreTest = async (req, reply) => {
  const session = req.session;
  const data = await service.restoreById(req.params.id, session);

  responseHandler(
    req,
    reply,
    !data?.deleted ? [] : data,
    !data?.deleted ? "Test is not deleted" : "Test restored successfully",
  );
};

const forceDeleteTest = async (req, reply) => {
  const session = req.session;
  const data = await service.forceDelete(req.params.id, session);

  const message = !data ? "No Test found" : "Test force deleted successfully";

  await multipleImages(
    [],
    data?.image ? data.image.map((image) => image.public_id) : [],
  );

  responseHandler(req, reply, data, message);
};

export {
  getAllTests,
  getAllTestsDeleted,
  getSingleTest,
  createNewTest,
  updateTest,
  deleteTest,
  restoreTest,
  forceDeleteTest,
};
