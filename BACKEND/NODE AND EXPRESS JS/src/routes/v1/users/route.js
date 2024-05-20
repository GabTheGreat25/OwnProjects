import { Router } from "express";
import * as userController from "./controller.js";
import { METHOD, PATH } from "../../../constants/index.js";

const router = Router();

const userRoutes = [
  {
    method: METHOD.GET,
    path: PATH.USERS,
    handler: userController.getAllUsers,
  },
  {
    method: METHOD.GET,
    path: PATH.DELETED_USERS,
    handler: userController.getAllUsersDeleted,
  },
  {
    method: METHOD.GET,
    path: PATH.EDIT_USER_ID,
    handler: userController.getSingleUser,
  },
  {
    method: METHOD.POST,
    path: PATH.USERS,
    handler: userController.createNewUser,
  },
  {
    method: METHOD.PATCH,
    path: PATH.EDIT_USER_ID,
    handler: userController.updateUser,
  },
  {
    method: METHOD.DELETE,
    path: PATH.EDIT_USER_ID,
    handler: userController.deleteUser,
  },
  {
    method: METHOD.PUT,
    path: PATH.RESTORE_USER_ID,
    handler: userController.restoreUser,
  },
  {
    method: METHOD.DELETE,
    path: PATH.FORCE_DELETE_USER_ID,
    handler: userController.forceDeleteUser,
  },
];

userRoutes.forEach((route) => {
  const { method, path, handler } = route;
  router[method](path, handler);
});

export default router;
