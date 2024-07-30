import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import createError from "http-errors";
import service from "./service";
import { STATUSCODE } from "../../../constants";
import { upload, responseHandler, multipleImages } from "../../../utils";

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
  const data = await service.getById(req.params.id);

  responseHandler(
    res,
    data,
    !data ? "No Test found" : "Test retrieved successfully",
  );
});

const createNewTest = [
  upload.array("image"),
  asyncHandler(async (req: Request, res: Response) => {
    const uploadedImages = await multipleImages(
      req.files as Express.Multer.File[],
      [],
    );

    if (uploadedImages.length === STATUSCODE.ZERO)
      throw createError(STATUSCODE.BAD_REQUEST, "Image is required");

    const data = await service.add(
      {
        ...req.body,
        image: uploadedImages,
      },
      req.session,
    );

    responseHandler(res, [data], "Test created successfully");
  }),
];

const updateTest = [
  upload.array("image"),
  asyncHandler(async (req: Request, res: Response) => {
    const oldData = await service.getById(req.params.id);

    const uploadNewImages = await multipleImages(
      req.files as Express.Multer.File[],
      oldData?.image.map((image: any) => image.public_id) || [],
    );

    const data = await service.update(
      req.params.id,
      {
        ...req.body,
        image: uploadNewImages,
      },
      req.session,
    );

    responseHandler(res, [data], "Test updated successfully");
  }),
];

const deleteTest = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.deleteById(req.params.id, req.session);

  responseHandler(
    res,
    data?.deleted ? [] : [data],
    data?.deleted ? "Test is already deleted" : "Test deleted successfully",
  );
});

const restoreTest = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.restoreById(req.params.id, req.session);

  responseHandler(
    res,
    !data?.deleted ? [] : [data],
    !data?.deleted ? "Test is not deleted" : "Test restored successfully",
  );
});

const forceDeleteTest = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.forceDelete(req.params.id, req.session);

  const message = !data ? "No Test found" : "Test force deleted successfully";

  await multipleImages(
    [],
    data?.image ? data.image.map((image: any) => image.public_id) : [],
  );

  responseHandler(res, [data], message);
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
