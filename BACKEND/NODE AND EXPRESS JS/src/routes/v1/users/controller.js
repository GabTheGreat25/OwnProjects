import service from "./service.js";
import asyncHandler from "express-async-handler";
import { STATUSCODE } from "../../../constants/index.js";
import { upload } from "../../../utils/cloudinary.js";
import bcrypt from "bcrypt";
import ENV from "../../../config/environment.js";
import {
  generateAccess,
  responseHandler,
  multipleImages,
} from "../../../utils/index.js";

const blacklistedTokens = [];

const getAllUsers = asyncHandler(async (req, res) => {
  const data = await service.getAll();

  responseHandler(
    res,
    data?.length === STATUSCODE.ZERO ? "No user found" : "Get all user success",
    data
  );
});

const getAllUsersDeleted = asyncHandler(async (req, res) => {
  const data = await service.getAllDeleted();

  responseHandler(
    res,
    data?.length === STATUSCODE.ZERO
      ? "No deleted user found"
      : "Get all deleted user success",
    data
  );
});

const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const data = await service.getById(id);

  responseHandler(res, !data ? "No user found" : "Get user success", data);
});

const authenticateUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const data = await service.getAll({ filter: { email } });

  const user = data[STATUSCODE.ZERO];

  if (!(await bcrypt.compare(password, user.password))) {
    responseHandler(res, "Password do not match", []);
    return;
  }

  const message = !user ? "No user found" : "Login success";

  responseHandler(res, message, user, generateAccess({}));
});

const logoutUser = (req, res) => {
  const meta = generateAccess({});
  blacklistedTokens[STATUSCODE.ZERO] = meta?.access;

  responseHandler(res, "Logout Success", []);
};

const createNewUser = [
  upload.array("image"),
  asyncHandler(async (req, res) => {
    const images = await multipleImages(req.files, []);
    const hashed = await bcrypt.hash(req.body.password, ENV.SALT_NUMBER);

    const data = await service.add({
      ...req.body,
      password: hashed,
      image: images,
    });

    responseHandler(res, "Create user success", [data]);
  }),
];

const updateUser = [
  upload.array("image"),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const oldData = await service.getById(id);

    const oldImagePublicIds = oldData.image.map((image) => image.public_id);
    const images = await multipleImages(req.files, oldImagePublicIds);

    const data = await service.update(id, { ...req.body, image: images });

    responseHandler(res, "Update user success", [data]);
  }),
];

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await service.deleteById(id);

  responseHandler(
    res,
    data.deleted ? "This user is already deleted" : "Delete user success",
    data.deleted ? [] : [data]
  );
});

const restoreUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await service.restoreById(id);

  responseHandler(res, !data ? "No user found" : "Restore user success", data);
});

const forceDeleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await service.forceDelete(id);

  const message = !data ? "No user found" : "Force delete user success";

  await multipleImages(
    [],
    data?.image ? data.image.map((image) => image.public_id) : []
  );

  responseHandler(res, message, data);
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
  authenticateUser,
  logoutUser,
};
