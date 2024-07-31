import {
  FastifyInstance,
  FastifyPluginOptions,
  HTTPMethods,
  RouteHandlerMethod,
  RouteOptions,
  preHandlerHookHandler,
} from "fastify";
import * as userController from "./controller";
import { METHOD, PATH, ROLE } from "../../../constants";
import { upload } from "../../../utils";
import { verifyJWT, authorizeRoles } from "../../../middlewares";
import { Route } from "../../../types";

const routes: Route[] = [
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

const router = (
  app: FastifyInstance,
  opts: FastifyPluginOptions,
  done: Function,
) => {
  routes.forEach(
    ({
      method,
      path = "",
      roles = [],
      middleware = [],
      handler,
      preHandler,
    }) => {
      const routeOptions: RouteOptions = {
        method: method as HTTPMethods,
        url: path,
        handler: handler as RouteHandlerMethod,
        preHandler: [
          ...(middleware as preHandlerHookHandler[]),
          authorizeRoles(...roles) as preHandlerHookHandler,
          ...(preHandler ? [preHandler as preHandlerHookHandler] : []),
        ].filter(Boolean),
      };

      app.route(routeOptions);
    },
  );
  done();
};

export default router;
