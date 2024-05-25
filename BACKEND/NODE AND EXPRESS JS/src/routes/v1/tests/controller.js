import service from "./service.js";
import asyncHandler from "express-async-handler";
import { STATUSCODE } from "../../../constants/index.js";
import { upload } from "../../../helpers/cloudinary.js";
import { responseHandler, multipleImages } from "../../../utils/index.js";

const getAllTests = asyncHandler(async (req, res) => {
  const data = await service.getAll();

  responseHandler(
    res,
    data?.length === STATUSCODE.ZERO ? "No test found" : "Get all test success",
    data
  );
});

const getAllTestsDeleted = asyncHandler(async (req, res) => {
  const data = await service.getAllDeleted();

  responseHandler(
    res,
    data?.length === STATUSCODE.ZERO
      ? "No deleted test found"
      : "Get all deleted test success",
    data
  );
});

const getSingleTest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const data = await service.getById(id);

  responseHandler(res, !data ? "No test found" : "Get test success", data);
});

const createNewTest = [
  upload.array("image"),
  asyncHandler(async (req, res) => {
    const images = await multipleImages(req.files, []);

    const data = await service.add({
      ...req.body,
      image: images,
    });

    responseHandler(res, "Create test success", [data]);
  }),
];

const updateTest = [
  upload.array("image"),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const oldData = await service.getImageById(id);

    const images = await multipleImages(
      req.files,
      oldData?.image.map((image) => image.public_id) || []
    );

    const data = await service.update(id, { ...req.body, image: images });

    responseHandler(res, "Update test success", [data]);
  }),
];

const deleteTest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await service.deleteById(id);

  responseHandler(
    res,
    data?.deleted ? "This test is already deleted" : "Delete test success",
    data?.deleted ? [] : [data]
  );
});

const restoreTest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await service.restoreById(id);

  responseHandler(
    res,
    !data?.deleted ? "Test is not deleted" : "Restore test success",
    !data?.deleted ? [] : data
  );
});

const forceDeleteTest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await service.forceDelete(id);

  const message = !data ? "No test found" : "Force delete test success";

  await multipleImages(
    [],
    data?.image ? data.image.map((image) => image.public_id) : []
  );

  responseHandler(res, message, data);
});

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
