import createError from "http-errors";
import bcrypt from "bcrypt";
import service from "./service.js";
import { ENV } from "../../../config/index.js";
import { RESOURCE, STATUSCODE } from "../../../constants/index.js";
import {
  responseHandler,
  multipleImages,
  sendEmail,
  generateRandomCode,
} from "../../../utils/index.js";
import {
  setToken,
  getToken,
  blacklistToken,
  generateAccess,
  isTokenBlacklisted,
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

  const accessToken = generateAccess({
    id: data._id,
    role: data[RESOURCE.ROLE],
  });
  setToken(accessToken.access);

  responseHandler(req, reply, data, "User Login successfully", accessToken);
};

const logoutUser = async (req, reply) => {
  const savedToken = getToken();

  return !savedToken || isTokenBlacklisted()
    ? reply.send(createError(STATUSCODE.UNAUTHORIZED, "You are not logged in"))
    : (blacklistToken(),
      responseHandler(req, reply, [], "User Logout successfully"));
};

const createNewUser = async (req, reply) => {
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
    req.session,
  );

  responseHandler(req, reply, [data], "User created successfully");
};

const updateUser = async (req, reply) => {
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
    req.session,
  );

  responseHandler(req, reply, [data], "User updated successfully");
};

const deleteUser = async (req, reply) => {
  const data = await service.deleteById(req.params.id, req.session);

  responseHandler(
    req,
    reply,
    data?.deleted ? [] : [data],
    data?.deleted ? "User is already deleted" : "User deleted successfully",
  );
};

const restoreUser = async (req, reply) => {
  const data = await service.restoreById(req.params.id, req.session);

  responseHandler(
    req,
    reply,
    !data?.deleted ? [] : [data],
    !data?.deleted ? "User is not deleted" : "User restored successfully",
  );
};

const forceDeleteUser = async (req, reply) => {
  const data = await service.forceDelete(req.params.id, req.session);

  const message = !data ? "No User found" : "User force deleted successfully";

  await multipleImages(
    [],
    data?.image ? data.image.map((image) => image.public_id) : [],
  );

  responseHandler(req, reply, [data], message);
};

const changeUserPassword = async (req, reply) => {
  if (!req.body.newPassword || !req.body.confirmPassword)
    throw createError(STATUSCODE.BAD_REQUEST, "Both passwords are required");

  if (req.body.newPassword !== req.body.confirmPassword)
    throw createError(STATUSCODE.BAD_REQUEST, "Passwords do not match");

  const data = await service.changePassword(
    req.params.id,
    req.body.newPassword,
    req.session,
  );

  responseHandler(req, reply, [data], "Password changed successfully");
};

const sendUserEmailOTP = async (req, reply) => {
  const email = await service.getEmail(req.body.email);

  if (new Date() - new Date(email.verificationCode.createdAt) < 5 * 60 * 1000) {
    throw createError(
      "Please wait 5 minutes before requesting a new verification code",
    );
  }

  const code = generateRandomCode();
  await sendEmail(req.body.email, code);

  const data = await service.sendEmailOTP(req.body.email, code, req.session);

  responseHandler(req, reply, [data], "Email OTP sent successfully");
};

const resetUserEmailPassword = async (req, reply) => {
  if (
    !req.body.newPassword ||
    !req.body.confirmPassword ||
    req.body.newPassword !== req.body.confirmPassword
  )
    throw createError(
      STATUSCODE.BAD_REQUEST,
      "Passwords are required and must match",
    );

  const code = await service.getCode(req.body.verificationCode);

  if (
    Date.now() - new Date(code.verificationCode.createdAt).getTime() >
    5 * 60 * 1000
  ) {
    code.verificationCode = null;
    await code.save();
    throw createError("Verification code has expired");
  }

  const data = await service.resetPassword(
    req.body.verificationCode,
    req.body.newPassword,
    req.session,
  );

  if (!data)
    throw createError(STATUSCODE.BAD_REQUEST, "Invalid verification code");

  responseHandler(req, reply, [data], "Password Successfully Reset");
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
  changeUserPassword,
  sendUserEmailOTP,
  resetUserEmailPassword,
};
