import service from "./service.js";
import asyncHandler from "express-async-handler";
import { STATUSCODE } from "../../../constants/index.js";
import { upload } from "../../../utils/cloudinary.js";
import { responseHandler, multipleImages } from "../../../utils/index.js";

const getAllTestsChild = asyncHandler(async (req, res) => {
  const data = await service.getAll();

  responseHandler(
    res,
    data?.length === STATUSCODE.ZERO
      ? "No test child found"
      : "Get all test child success",
    data
  );
});

const getAllTestsChildDeleted = asyncHandler(async (req, res) => {
  const data = await service.getAllDeleted();

  responseHandler(
    res,
    data?.length === STATUSCODE.ZERO
      ? "No deleted test child found"
      : "Get all deleted test child success",
    data
  );
});

const getSingleTestChild = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const data = await service.getById(id);

  responseHandler(
    res,
    !data ? "No test child found" : "Get test child success",
    data
  );
});

const createNewTestChild = [
  upload.array("image"),
  asyncHandler(async (req, res) => {
    const images = await multipleImages(req.files, []);

    const data = await service.add({
      ...req.body,
      image: images,
    });

    responseHandler(res, "Create test child success", [data]);
  }),
];

const updateTestChild = [
  upload.array("image"),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const oldData = await service.getById(id);

    const oldImagePublicIds = oldData.image.map((image) => image.public_id);
    const images = await multipleImages(req.files, oldImagePublicIds);

    const data = await service.update(id, { ...req.body, image: images });

    responseHandler(res, "Update test child success", [data]);
  }),
];

const deleteTestChild = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await service.deleteById(id);

  responseHandler(
    res,
    data.deleted
      ? "This test child is already deleted"
      : "Delete test child success",
    data.deleted ? [] : [data]
  );
});

const restoreTestChild = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await service.restoreById(id);

  responseHandler(
    res,
    !data ? "No test child found" : "Restore test child success",
    data
  );
});

const forceDeleteTestChild = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await service.forceDelete(id);

  const message = !data
    ? "No test child found"
    : "Force delete test child success";

  await multipleImages(
    [],
    data?.image ? data.image.map((image) => image.public_id) : []
  );

  responseHandler(res, message, data);
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
