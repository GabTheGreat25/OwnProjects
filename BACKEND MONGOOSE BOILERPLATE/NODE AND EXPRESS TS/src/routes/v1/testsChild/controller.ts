import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import service from "./service";
import { STATUSCODE } from "../../../constants";
import { upload, responseHandler, multipleImages } from "../../../utils";

const getAllTestsChild = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.getAll();

  responseHandler(
    res,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Test Childs found"
      : "All Test Childs retrieved successfully",
  );
});

const getAllTestsChildDeleted = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await service.getAllDeleted();

    responseHandler(
      res,
      data,
      data?.length === STATUSCODE.ZERO
        ? "No Deleted Test Childs found"
        : "All Deleted Test Childs retrieved successfully",
    );
  },
);

const getSingleTestChild = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.getById(req.params.id);

  responseHandler(
    res,
    data,
    !data ? "No Test Child found" : "Test Child retrieved successfully",
  );
});

const createNewTestChild = [
  upload.array("image"),
  asyncHandler(async (req: Request, res: Response) => {
    const images = await multipleImages(req.files as Express.Multer.File[], []);

    const data = await service.add({
      ...req.body,
      image: images,
    });

    responseHandler(res, [data], "Test Child created successfully");
  }),
];

const updateTestChild = [
  upload.array("image"),
  asyncHandler(async (req, res) => {
    const oldData = await service.getImageById(req.params.id);

    const images = await multipleImages(
      req.files as Express.Multer.File[],
      oldData?.image.map((image) => image.public_id) || [],
    );

    const data = await service.update(req.params.id, {
      ...req.body,
      image: images,
    });

    responseHandler(res, [data], "Test Child updated successfully");
  }),
];

const deleteTestChild = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.deleteById(req.params.id);

  responseHandler(
    res,
    data?.deleted ? [] : [data],
    data?.deleted
      ? "Test Child is already deleted"
      : "Test Child deleted successfully",
  );
});

const restoreTestChild = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.restoreById(req.params.id);

  responseHandler(
    res,
    !data?.deleted ? [] : data,
    !data?.deleted
      ? "Test child is not deleted"
      : "Test child restored successfully",
  );
});

const forceDeleteTestChild = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await service.forceDelete(req.params.id);

    const message = !data
      ? "No Test Child found"
      : "Test Child force deleted successfully";

    await multipleImages(
      [],
      data?.image ? data.image.map((image) => image.public_id) : [],
    );

    responseHandler(res, data, message);
  },
);

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
