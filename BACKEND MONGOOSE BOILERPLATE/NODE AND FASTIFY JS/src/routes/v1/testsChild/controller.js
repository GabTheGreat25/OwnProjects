import service from "./service.js";
import createError from "http-errors";
import { STATUSCODE } from "../../../constants/index.js";
import { responseHandler, multipleImages } from "../../../utils/index.js";

const getAllTestsChild = async (req, reply) => {
  const data = await service.getAll();

  responseHandler(
    req,
    reply,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No TestsChild found"
      : "All TestsChild retrieved successfully",
  );
};

const getAllTestsChildDeleted = async (req, reply) => {
  const data = await service.getAllDeleted();

  responseHandler(
    req,
    reply,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Deleted TestsChild found"
      : "All Deleted TestsChild retrieved successfully",
  );
};

const getSingleTestChild = async (req, reply) => {
  const data = await service.getById(req.params.id);

  responseHandler(
    req,
    reply,
    data,
    !data ? "No TestChild found" : "TestChild retrieved successfully",
  );
};

const createNewTestChild = async (req, reply) => {
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

  responseHandler(req, reply, [data], "TestChild created successfully");
};

const updateTestChild = async (req, reply) => {
  const session = req.session;
  const oldData = await service.getImageById(req.params.id);

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

  responseHandler(req, reply, [data], "TestChild updated successfully");
};

const deleteTestChild = async (req, reply) => {
  const session = req.session;
  const data = await service.deleteById(req.params.id, session);

  responseHandler(
    req,
    reply,
    data?.deleted ? [] : [data],
    data?.deleted
      ? "TestChild is already deleted"
      : "TestChild deleted successfully",
  );
};

const restoreTestChild = async (req, reply) => {
  const session = req.session;
  const data = await service.restoreById(req.params.id, session);

  responseHandler(
    req,
    reply,
    !data?.deleted ? [] : data,
    !data?.deleted
      ? "TestChild is not deleted"
      : "TestChild restored successfully",
  );
};

const forceDeleteTestChild = async (req, reply) => {
  const session = req.session;
  const data = await service.forceDelete(req.params.id, session);

  const message = !data
    ? "No TestChild found"
    : "TestChild force deleted successfully";

  await multipleImages(
    [],
    data?.image ? data.image.map((image) => image.public_id) : [],
  );

  responseHandler(req, reply, data, message);
};

export {
  getAllTestsChild,
  getAllTestsChildDeleted,
  getSingleTestChild,
  createNewTestChild,
  updateTestChild,
  deleteTestChild,
  restoreTestChild,
  forceDeleteTestChild,
};
