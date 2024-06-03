import asyncHandler from "express-async-handler";
import createError from "http-errors";
import bcrypt from "bcrypt";
import service from "./service.js";
import { ENV } from "../../../config/index.js";
import { RESOURCE, STATUSCODE } from "../../../constants/index.js";
import {
  upload,
  responseHandler,
  multipleImages,
} from "../../../utils/index.js";
import {
  setToken,
  getToken,
  blacklistToken,
  generateAccess,
} from "../../../middlewares/index.js";

const getAllUsers = asyncHandler(async (req, res) => {
  const data = await service.getAll();

  responseHandler(
    res,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Users found"
      : "All Users retrieved successfully",
  );
});

const getAllUsersDeleted = asyncHandler(async (req, res) => {
  const data = await service.getAllDeleted();

  responseHandler(
    res,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Deleted Users found"
      : "All Deleted Users retrieved successfully",
  );
});

const getSingleUser = asyncHandler(async (req, res) => {
  const data = await service.getById(req.params.id);

  responseHandler(
    res,
    data,
    !data ? "No User found" : "User retrieved successfully",
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const data = await service.getEmail(req.body.email);

  if (!data) throw createError(STATUSCODE.NOT_FOUND, "No User found");

  if (!(await bcrypt.compare(req.body.password, data.password)))
    throw createError(STATUSCODE.UNAUTHORIZED, "Password does not match");

  const accessToken = generateAccess({ role: data[RESOURCE.ROLE] });
  setToken(accessToken.access);

  responseHandler(res, data, "User Login successfully", accessToken);
});

const logoutUser = asyncHandler(async (req, res) => {
  const savedToken = getToken();

  if (savedToken) blacklistToken();

  responseHandler(res, [], "User Logout successfully");
});

const createNewUser = [
  upload.array("image"),
  asyncHandler(async (req, res) => {
    const uploadedImages = await multipleImages(req.files, []);
    const hashed = await bcrypt.hash(req.body.password, ENV.SALT_NUMBER);

    if (uploadedImages.length === STATUSCODE.ZERO)
      throw createError(STATUSCODE.BAD_REQUEST, "Image is required");

    const data = await service.add({
      ...req.body,
      password: hashed,
      image: uploadedImages,
    });

    responseHandler(res, [data], "User created successfully");
  }),
];

const updateUser = [
  upload.array("image"),
  asyncHandler(async (req, res) => {
    const oldData = await service.getById(req.params.id);

    const uploadNewImages = await multipleImages(
      req.files,
      oldData?.image.map((image) => image.public_id),
    );

    const data = await service.update(req.params.id, {
      ...req.body,
      image: uploadNewImages,
    });

    responseHandler(res, [data], "User updated successfully");
  }),
];

const deleteUser = asyncHandler(async (req, res) => {
  const data = await service.deleteById(req.params.id);

  responseHandler(
    res,
    data?.deleted ? [] : [data],
    data?.deleted ? "User is already deleted" : "User deleted successfully",
  );
});

const restoreUser = asyncHandler(async (req, res) => {
  const data = await service.restoreById(req.params.id);

  responseHandler(
    res,
    !data?.deleted ? [] : data,
    !data?.deleted ? "User is not deleted" : "User restored successfully",
  );
});

const forceDeleteUser = asyncHandler(async (req, res) => {
  const data = await service.forceDelete(req.params.id);

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
