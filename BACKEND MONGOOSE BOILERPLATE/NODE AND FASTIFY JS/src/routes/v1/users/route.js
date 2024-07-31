import * as userController from "./controller.js";
import { METHOD, PATH, ROLE } from "../../../constants/index.js";
import { upload } from "../../../utils/index.js";
import { verifyJWT, authorizeRoles } from "../../../middlewares/index.js";

const routes = [
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
    preHandler: upload.array("image"),
  },
  {
    method: METHOD.PATCH,
    path: PATH.EDIT,
    roles: [ROLE.ADMIN, ROLE.EMPLOYEE],
    middleware: [verifyJWT],
    handler: userController.updateUser,
    preHandler: upload.array("image"),
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
    roles: [ROLE.ADMIN, ROLE.EMPLOYEE, ROLE.CUSTOMER],
    middleware: [verifyJWT],
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

const router = (app, opts, done) => {
  routes.forEach(
    ({
      method,
      path = "",
      roles = [],
      middleware = [],
      handler,
      preHandler,
    }) => {
      app.route({
        method,
        url: path,
        handler,
        preHandler: [
          ...middleware,
          authorizeRoles(...roles),
          preHandler,
        ].filter(Boolean),
      });
    },
  );
  done();
};

export default router;
