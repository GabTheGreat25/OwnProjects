import { Router } from "express";
import * as userController from "./controller";
import { METHOD, PATH } from "../../../constants";
import { verifyJWT } from "../../../middlewares";

const router = Router() as any;

const userRoutes = [
  {
    method: METHOD.GET,
    path: "",
    middleware: [verifyJWT],
    handler: userController.getAllUsers,
  },
  {
    method: METHOD.GET,
    path: PATH.DELETED,
    middleware: [verifyJWT],
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
    path: PATH.ID,
    middleware: [verifyJWT],
    handler: userController.getSingleUser,
  },
  {
    method: METHOD.POST,
    path: "",
    middleware: [],
    handler: userController.createNewUser,
  },
  {
    method: METHOD.PATCH,
    path: PATH.EDIT,
    middleware: [verifyJWT],
    handler: userController.updateUser,
  },
  {
    method: METHOD.DELETE,
    path: PATH.DELETE,
    middleware: [verifyJWT],
    handler: userController.deleteUser,
  },
  {
    method: METHOD.PUT,
    path: PATH.RESTORE,
    middleware: [verifyJWT],
    handler: userController.restoreUser,
  },
  {
    method: METHOD.DELETE,
    path: PATH.FORCE_DELETE,
    middleware: [verifyJWT],
    handler: userController.forceDeleteUser,
  },
];

userRoutes.forEach(({ method, path, middleware = [], handler }) => {
  router[method](path, ...middleware, handler);
});

export default router;
