import { Request, Response } from "express";
import bcrypt from "bcrypt";
import ENV from "../../../config/environment";
import service from "./service";
import asyncHandler from "express-async-handler";
import { STATUSCODE } from "../../../constants/index";
import { upload } from "../../../helpers/cloudinary";
import {
  generateAccess,
  responseHandler,
  multipleImages,
} from "../../../utils/index";
import { addTokenToBlacklist } from "../../../helpers/blacklist";

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
  const { id } = req.params;

  const data = await service.getById(id);

  responseHandler(
    res,
    data,
    !data ? "No User found" : "User retrieved successfully",
  );
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const data = await service.getAll({ _filter: { email } });

  const user = data[STATUSCODE.ZERO];

  if (!(await bcrypt.compare(password, user.password))) {
    responseHandler(res, [], "Password do not match");
    return;
  }

  const message = !user ? "No User found" : "Login success";

  const accessToken = generateAccess({});

  req.session.accessToken = accessToken.access;

  responseHandler(res, user, message, accessToken);
});

const logoutUser = (req: Request, res: Response) => {
  const access = req.session.accessToken;

  if (access) {
    addTokenToBlacklist(access);
    req.session.destroy((message) => {
      responseHandler(
        res,
        [],
        message ? "Error logging out" : "Logout Success",
      );
    });
  }
};

const createNewUser = [
  upload.array("image"),
  asyncHandler(async (req: Request, res: Response) => {
    const images = await multipleImages(req.files as Express.Multer.File[], []);
    const hashed = await bcrypt.hash(req.body.password, ENV.SALT_NUMBER);

    const data = await service.add({
      ...req.body,
      password: hashed,
      image: images,
    });

    responseHandler(res, [data], "User created successfully");
  }),
];

const updateUser = [
  upload.array("image"),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const oldData = await service.getImageById(id);

    const images = await multipleImages(
      req.files as Express.Multer.File[],
      oldData?.image.map((image) => image.public_id) || [],
    );

    const data = await service.update(id, { ...req.body, image: images });

    responseHandler(res, [data], "User updated successfully");
  }),
];

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await service.deleteById(id);

  responseHandler(
    res,
    data?.deleted ? [] : [data],
    data?.deleted ? "User is already deleted" : "User deleted successfully",
  );
});

const restoreUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const data = await service.restoreById(id);

  responseHandler(
    res,
    !data?.deleted ? [] : data,
    !data?.deleted ? "User is not deleted" : "User restored successfully",
  );
});

const forceDeleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await service.forceDelete(id);

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
