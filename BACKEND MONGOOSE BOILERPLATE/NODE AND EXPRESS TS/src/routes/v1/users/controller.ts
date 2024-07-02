import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import createError from "http-errors";
import bcrypt from "bcrypt";
import service from "./service";
import { ENV } from "../../../config";
import { RESOURCE, STATUSCODE } from "../../../constants";
import { upload, responseHandler, multipleImages } from "../../../utils";
import {
  setToken,
  getToken,
  blacklistToken,
  generateAccess,
} from "../../../middlewares";

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.getAll();

  responseHandler(
    res,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Users found"
      : "All Users retrieved successfully",
  );
});

const getAllUsersDeleted = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.getAllDeleted();

  responseHandler(
    res,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Deleted Users found"
      : "All Deleted Users retrieved successfully",
  );
});

const getSingleUser = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.getById(req.params.id);

  responseHandler(
    res,
    data,
    !data ? "No User found" : "User retrieved successfully",
  );
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.getEmail(req.body.email);

  if (!data) throw createError(STATUSCODE.NOT_FOUND, "No User found");

  if (!(await bcrypt.compare(req.body.password, data.password)))
    throw createError(STATUSCODE.UNAUTHORIZED, "Password does not match");

  const accessToken = generateAccess({ role: (data as any)[RESOURCE.ROLE] });
  setToken(accessToken.access);

  responseHandler(res, data, "User Login successfully", accessToken);
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const savedToken = getToken();

  if (savedToken) blacklistToken();

  responseHandler(res, [], "User Logout successfully");
});

const createNewUser = [
  upload.array("image"),
  asyncHandler(async (req: Request, res: Response) => {
    const session = req.session;
    const uploadedImages = await multipleImages(
      req.files as Express.Multer.File[],
      [],
    );
    const hashed = await bcrypt.hash(req.body.password, ENV.SALT_NUMBER);

    if (uploadedImages.length === STATUSCODE.ZERO)
      throw createError(STATUSCODE.BAD_REQUEST, "Image is required");

    const data = await service.add(
      {
        ...req.body,
        password: hashed,
        image: uploadedImages,
      },
      session,
    );

    responseHandler(res, [data], "User created successfully");
  }),
];

const updateUser = [
  upload.array("image"),
  asyncHandler(async (req: Request, res: Response) => {
    const session = req.session;
    const oldData = await service.getById(req.params.id);

    const uploadNewImages = await multipleImages(
      req.files as Express.Multer.File[],
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

    responseHandler(res, [data], "User updated successfully");
  }),
];

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const session = req.session;
  const data = await service.deleteById(req.params.id, session);

  responseHandler(
    res,
    data?.deleted ? [] : [data],
    data?.deleted ? "User is already deleted" : "User deleted successfully",
  );
});

const restoreUser = asyncHandler(async (req: Request, res: Response) => {
  const session = req.session;
  const data = await service.restoreById(req.params.id, session);

  responseHandler(
    res,
    !data?.deleted ? [] : data,
    !data?.deleted ? "User is not deleted" : "User restored successfully",
  );
});

const forceDeleteUser = asyncHandler(async (req: Request, res: Response) => {
  const session = req.session;
  const data = await service.forceDelete(req.params.id, session);

  const message = !data ? "No User found" : "User force deleted successfully";

  await multipleImages(
    [],
    data?.image ? data.image.map((image) => image.public_id) : [],
  );

  responseHandler(res, data, message);
});

export {
  getAllUsers,
  getAllUsersDeleted,
  getSingleUser,
  createNewUser,
  updateUser,
  deleteUser,
  restoreUser,
  forceDeleteUser,
  loginUser,
  logoutUser,
};
