import createError from "http-errors";
import bcrypt from "bcrypt";
import service from "./service.js";
import { ENV } from "../../../config/index.js";
import { RESOURCE, STATUSCODE } from "../../../constants/index.js";
import { responseHandler, multipleImages } from "../../../utils/index.js";
import {
  setToken,
  getToken,
  blacklistToken,
  generateAccess,
} from "../../../middlewares/index.js";

const getAllUsers = async (req, reply) => {
  const data = await service.getAll();

  responseHandler(
    req,
    reply,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Users found"
      : "All Users retrieved successfully",
  );
};

const getAllUsersDeleted = async (req, reply) => {
  const data = await service.getAllDeleted();

  responseHandler(
    req,
    reply,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Deleted Users found"
      : "All Deleted Users retrieved successfully",
  );
};

const getSingleUser = async (req, reply) => {
  const data = await service.getById(req.params.id);

  responseHandler(
    req,
    reply,
    data,
    !data ? "No User found" : "User retrieved successfully",
  );
};

const loginUser = async (req, reply) => {
  const data = await service.getEmail(req.body.email);

  if (!data) throw createError(STATUSCODE.NOT_FOUND, "No User found");

  if (!(await bcrypt.compare(req.body.password, data.password)))
    throw createError(STATUSCODE.UNAUTHORIZED, "Password does not match");

  const accessToken = generateAccess({ role: data[RESOURCE.ROLE] });
  setToken(accessToken.access);

  responseHandler(req, reply, data, "User Login successfully", accessToken);
};

const logoutUser = async (req, reply) => {
  const savedToken = getToken();

  if (savedToken) blacklistToken();

  responseHandler(req, reply, [], "User Logout successfully");
};

const createNewUser = async (req, reply) => {
  const session = req.session;
  const uploadedImages = await multipleImages(req.files, []);
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

  responseHandler(req, reply, [data], "User created successfully");
};

const updateUser = async (req, reply) => {
  const session = req.session;
  const oldData = await service.getById(req.params.id);

  const uploadNewImages = await multipleImages(
    req.files,
    oldData?.image.map((image) => image.public_id),
  );

  const data = await service.update(
    req.params.id,
    {
      ...req.body,
      image: uploadNewImages,
    },
    session,
  );

  responseHandler(req, reply, [data], "User updated successfully");
};

const deleteUser = async (req, reply) => {
  const session = req.session;
  const data = await service.deleteById(req.params.id, session);

  responseHandler(
    req,
    reply,
    data?.deleted ? [] : [data],
    data?.deleted ? "User is already deleted" : "User deleted successfully",
  );
};

const restoreUser = async (req, reply) => {
  const session = req.session;
  const data = await service.restoreById(req.params.id, session);

  responseHandler(
    req,
    reply,
    !data?.deleted ? [] : data,
    !data?.deleted ? "User is not deleted" : "User restored successfully",
  );
};

const forceDeleteUser = async (req, reply) => {
  const session = req.session;
  const data = await service.forceDelete(req.params.id, session);

  const message = !data ? "No User found" : "User force deleted successfully";

  await multipleImages(
    [],
    data?.image ? data.image.map((image) => image.public_id) : [],
  );

  responseHandler(req, reply, data, message);
};

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
