import asyncHandler from "express-async-handler";
import createError from "http-errors";
import service from "./service.js";
import { STATUSCODE } from "../../../constants/index.js";
import {
  upload,
  responseHandler,
  multipleImages,
} from "../../../utils/index.js";

const getAllTestsChild = asyncHandler(async (req, res) => {
  const data = await service.getAll();

  responseHandler(
    res,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Test Childs found"
      : "All Test Childs retrieved successfully",
  );
});

const getAllTestsChildDeleted = asyncHandler(async (req, res) => {
  const data = await service.getAllDeleted();

  responseHandler(
    res,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Deleted Test Childs found"
      : "All Deleted Test Childs retrieved successfully",
  );
});

const getSingleTestChild = asyncHandler(async (req, res) => {
  const data = await service.getById(req.params.id);

  responseHandler(
    res,
    data,
    !data ? "No Test Child found" : "Test Child retrieved successfully",
  );
});

const createNewTestChild = [
  upload.array("image"),
  asyncHandler(async (req, res) => {
    const uploadedImages = await multipleImages(req.files, []);

    if (uploadedImages.length === STATUSCODE.ZERO)
      throw createError(STATUSCODE.BAD_REQUEST, "Image is required");

    const data = await service.add({
      ...req.body,
      image: uploadedImages,
    });

    responseHandler(res, [data], "Test Child created successfully");
  }),
];

const updateTestChild = [
  upload.array("image"),
  asyncHandler(async (req, res) => {
    const oldData = await service.getImageById(req.params.id);

    const uploadNewImages = await multipleImages(
      req.files,
      oldData?.image.map((image) => image.public_id) || [],
    );

    const data = await service.update(req.params.id, {
      ...req.body,
      image: uploadNewImages,
    });

    responseHandler(res, [data], "Test Child updated successfully");
  }),
];

const deleteTestChild = asyncHandler(async (req, res) => {
  const data = await service.deleteById(req.params.id);

  responseHandler(
    res,
    data?.deleted ? [] : [data],
    data?.deleted
      ? "Test Child is already deleted"
      : "Test Child deleted successfully",
  );
});

const restoreTestChild = asyncHandler(async (req, res) => {
  const data = await service.restoreById(req.params.id);

  responseHandler(
    res,
    !data?.deleted ? [] : data,
    !data?.deleted
      ? "Test child is not deleted"
      : "Test child restored successfully",
  );
});

const forceDeleteTestChild = asyncHandler(async (req, res) => {
  const data = await service.forceDelete(req.params.id);

  const message = !data
    ? "No Test Child found"
    : "Test Child force deleted successfully";

  await multipleImages(
    [],
    data?.image ? data.image.map((image) => image.public_id) : [],
  );

  responseHandler(res, data, message);
});

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
