import { Request, Response } from "express";
import service from "./service";
import asyncHandler from "express-async-handler";
import { STATUSCODE } from "../../../constants/index";
import { upload } from "../../../helpers/cloudinary";
import { responseHandler, multipleImages } from "../../../utils/index";

const getAllTests = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.getAll();

  responseHandler(
    res,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Tests found"
      : "All Tests retrieved successfully",
  );
});

const getAllTestsDeleted = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.getAllDeleted();

  responseHandler(
    res,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Deleted Tests found"
      : "All Deleted Tests retrieved successfully",
  );
});

const getSingleTest = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const data = await service.getById(id);

  responseHandler(
    res,
    data,
    !data ? "No Test found" : "Test retrieved successfully",
  );
});

const createNewTest = [
  upload.array("image"),
  asyncHandler(async (req: Request, res: Response) => {
    const images = await multipleImages(req.files as Express.Multer.File[], []);

    const data = await service.add({
      ...req.body,
      image: images,
    });

    responseHandler(res, [data], "Test created successfully");
  }),
];

const updateTest = [
  upload.array("image"),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const oldData = await service.getImageById(id);

    const images = await multipleImages(
      req.files as Express.Multer.File[],
      oldData?.image.map((image) => image.public_id) || [],
    );

    const data = await service.update(id, { ...req.body, image: images });

    responseHandler(res, [data], "Test updated successfully");
  }),
];

const deleteTest = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await service.deleteById(id);

  responseHandler(
    res,
    data?.deleted ? [] : [data],
    data?.deleted ? "Test is already deleted" : "Test deleted successfully",
  );
});

const restoreTest = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await service.restoreById(id);

  responseHandler(
    res,
    !data?.deleted ? [] : data,
    !data?.deleted ? "Test is not deleted" : "Test restored successfully",
  );
});

const forceDeleteTest = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await service.forceDelete(id);

  const message = !data ? "No Test found" : "Test force deleted successfully";

  await multipleImages(
    [],
    data?.image ? data.image.map((image) => image.public_id) : [],
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
