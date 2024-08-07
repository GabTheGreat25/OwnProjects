import { Router } from "express";
import * as userController from "./controller";
import { METHOD, PATH, ROLE } from "../../../constants";
import { verifyJWT, authorizeRoles } from "../../../middlewares";

const router = Router() as any;

const userRoutes = [
  {
    method: METHOD.GET,
    roles: [ROLE.ADMIN],
    middleware: [verifyJWT],
    handler: userController.getAllUsers,
  },
  {
    method: METHOD.GET,
    path: PATH.DELETED,
    roles: [ROLE.ADMIN],
    middleware: [verifyJWT],
    handler: userController.getAllUsersDeleted,
  },
  {
    method: METHOD.POST,
    path: PATH.LOGIN,
    handler: userController.loginUser,
  },
  {
    method: METHOD.POST,
    path: PATH.LOGOUT,
    handler: userController.logoutUser,
  },
  {
    method: METHOD.GET,
    path: PATH.ID,
    roles: [ROLE.ADMIN],
    middleware: [verifyJWT],
    handler: userController.getSingleUser,
  },
  {
    method: METHOD.POST,
    handler: userController.createNewUser,
  },
  {
    method: METHOD.PATCH,
    path: PATH.EDIT,
    roles: [ROLE.ADMIN, ROLE.EMPLOYEE],
    middleware: [verifyJWT],
    handler: userController.updateUser,
  },
  {
    method: METHOD.DELETE,
    path: PATH.DELETE,
    roles: [ROLE.ADMIN, ROLE.EMPLOYEE],
    middleware: [verifyJWT],
    handler: userController.deleteUser,
  },
  {
    method: METHOD.PUT,
    path: PATH.RESTORE,
    roles: [ROLE.ADMIN, ROLE.EMPLOYEE],
    middleware: [verifyJWT],
    handler: userController.restoreUser,
  },
  {
    method: METHOD.DELETE,
    path: PATH.FORCE_DELETE,
    roles: [ROLE.ADMIN, ROLE.EMPLOYEE],
    middleware: [verifyJWT],
    handler: userController.forceDeleteUser,
  },
  {
    method: METHOD.PATCH,
    path: PATH.CHANGE_PASSWORD,
    middleware: [verifyJWT],
    roles: [ROLE.ADMIN, ROLE.EMPLOYEE, ROLE.CUSTOMER],
    handler: userController.changeUserPassword,
  },
  {
    method: METHOD.POST,
    path: PATH.EMAIL_OTP,
    handler: userController.sendUserEmailOTP,
  },
  {
    method: METHOD.PATCH,
    path: PATH.RESTORE_PASSWORD,
    handler: userController.resetUserEmailPassword,
  },
];

userRoutes.forEach((route) => {
  const { method, path = "", roles = [], middleware = [], handler } = route;
  router[method](path, middleware.concat(authorizeRoles(...roles)), handler);
});

export default router;
