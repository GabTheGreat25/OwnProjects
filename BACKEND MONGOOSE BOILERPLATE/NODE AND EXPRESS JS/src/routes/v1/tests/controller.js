import service from "./service.js";
import asyncHandler from "express-async-handler";
import { STATUSCODE } from "../../../constants/index.js";
import { upload } from "../../../helpers/cloudinary.js";
import { responseHandler, multipleImages } from "../../../utils/index.js";

const getAllTests = asyncHandler(async (req, res) => {
  const data = await service.getAll();

  responseHandler(
    res,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Tests found"
      : "All Tests retrieved successfully"
  );
});

const getAllTestsDeleted = asyncHandler(async (req, res) => {
  const data = await service.getAllDeleted();

  responseHandler(
    res,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Deleted Tests found"
      : "All Deleted Tests retrieved successfully"
  );
});

const getSingleTest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const data = await service.getById(id);

  responseHandler(
    res,
    data,
    !data ? "No Test found" : "Test retrieved successfully"
  );
});

const createNewTest = [
  upload.array("image"),
  asyncHandler(async (req, res) => {
    const images = await multipleImages(req.files, []);

    const data = await service.add({
      ...req.body,
      image: images,
    });

    responseHandler(res, [data], "Test created successfully");
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

    responseHandler(res, [data], "Test updated successfully");
  }),
];

const deleteTest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await service.deleteById(id);

  responseHandler(
    res,
    data?.deleted ? [] : [data],
    data?.deleted ? "Test is already deleted" : "Test deleted successfully"
  );
});

const restoreTest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await service.restoreById(id);

  responseHandler(
    res,
    !data?.deleted ? [] : data,
    !data?.deleted ? "Test is not deleted" : "Test restored successfully"
  );
});

const forceDeleteTest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await service.forceDelete(id);

  const message = !data ? "No Test found" : "Test force deleted successfully";

  await multipleImages(
    [],
    data?.image ? data.image.map((image) => image.public_id) : []
  );

  responseHandler(res, data, message);
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
