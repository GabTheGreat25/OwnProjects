import { Router } from "express";
import * as userController from "./controller.js";
import { METHOD, PATH } from "../../../constants/index.js";
import { verifyToken } from "../../../utils/index.js";

const router = Router();

const userRoutes = [
  {
    method: METHOD.GET,
    path: PATH.USERS,
    middleware: [verifyToken],
    handler: userController.getAllUsers,
  },
  {
    method: METHOD.GET,
    path: PATH.DELETED_USERS,
    middleware: [verifyToken],
    handler: userController.getAllUsersDeleted,
  },
  {
    method: METHOD.POST,
    path: PATH.LOGIN,
    middleware: [],
    handler: userController.loginUser,
  },
  {
    method: METHOD.POST,
    path: PATH.LOGOUT,
    middleware: [],
    handler: userController.logoutUser,
  },
  {
    method: METHOD.GET,
    path: PATH.USER_ID,
    middleware: [verifyToken],
    handler: userController.getSingleUser,
  },
  {
    method: METHOD.POST,
    path: PATH.USERS,
    middleware: [],
    handler: userController.createNewUser,
  },
  {
    method: METHOD.PATCH,
    path: PATH.EDIT_USER_ID,
    middleware: [verifyToken],
    handler: userController.updateUser,
  },
  {
    method: METHOD.DELETE,
    path: PATH.USER_ID,
    middleware: [verifyToken],
    handler: userController.deleteUser,
  },
  {
    method: METHOD.PUT,
    path: PATH.RESTORE_USER_ID,
    middleware: [verifyToken],
    handler: userController.restoreUser,
  },
  {
    method: METHOD.DELETE,
    path: PATH.FORCE_DELETE_USER_ID,
    middleware: [verifyToken],
    handler: userController.forceDeleteUser,
  },
];

userRoutes.forEach(({ method, path, middleware = [], handler }) => {
  router[method](path, ...middleware, handler);
});

export default router;
