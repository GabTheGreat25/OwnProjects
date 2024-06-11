import {
  FastifyInstance,
  FastifyPluginOptions,
  HTTPMethods,
  RouteHandlerMethod,
  RouteOptions,
  preHandlerHookHandler,
} from "fastify";
import * as testController from "./controller";
import { METHOD, PATH } from "../../../constants";
import { upload } from "../../../utils";
import { Route } from "../../../types";

const routes: Route[] = [
  {
    method: METHOD.GET,
    handler: testController.getAllTestsChild,
  },
  {
    method: METHOD.GET,
    path: PATH.DELETED,
    handler: testController.getAllTestsChildDeleted,
  },
  {
    method: METHOD.GET,
    path: PATH.ID,
    handler: testController.getSingleTestChild,
  },
  {
    method: METHOD.POST,
    handler: testController.createNewTestChild,
    preHandler: upload.array("image"),
  },
  {
    method: METHOD.PATCH,
    path: PATH.EDIT,
    handler: testController.updateTestChild,
    preHandler: upload.array("image"),
  },
  {
    method: METHOD.DELETE,
    path: PATH.DELETE,
    handler: testController.deleteTestChild,
  },
  {
    method: METHOD.PUT,
    path: PATH.RESTORE,
    handler: testController.restoreTestChild,
  },
  {
    method: METHOD.DELETE,
    path: PATH.FORCE_DELETE,
    handler: testController.forceDeleteTestChild,
  },
];

const router = async (
  app: FastifyInstance,
  opts: FastifyPluginOptions,
  done: Function,
) => {
  routes.forEach(({ method, path = "", handler, preHandler }) => {
    const routeOptions: RouteOptions = {
      method: method as HTTPMethods,
      url: path,
      handler: handler as RouteHandlerMethod,
      preHandler: (preHandler as preHandlerHookHandler) || [],
    };
    app.route(routeOptions);
  });
  done();
};

export default router;
