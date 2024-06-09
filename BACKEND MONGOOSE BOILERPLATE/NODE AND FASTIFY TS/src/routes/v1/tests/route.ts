import * as testController from "./controller.js";
import { METHOD, PATH } from "../../../constants/index.js";
import { upload } from "../../../utils/index.js";
import { Route } from "../../../types";
import {
  FastifyInstance,
  FastifyPluginOptions,
  HTTPMethods,
  RouteHandlerMethod,
  RouteOptions,
  preHandlerHookHandler,
} from "fastify";

const routes: Route[] = [
  {
    method: METHOD.GET,
    handler: testController.getAllTests,
  },
  {
    method: METHOD.GET,
    path: PATH.DELETED,
    handler: testController.getAllTestsDeleted,
  },
  {
    method: METHOD.GET,
    path: PATH.ID,
    handler: testController.getSingleTest,
  },
  {
    method: METHOD.POST,
    handler: testController.createNewTest,
    preHandler: upload.array("image"),
  },
  {
    method: METHOD.PATCH,
    path: PATH.EDIT,
    handler: testController.updateTest,
    preHandler: upload.array("image"),
  },
  {
    method: METHOD.DELETE,
    path: PATH.DELETE,
    handler: testController.deleteTest,
  },
  {
    method: METHOD.PUT,
    path: PATH.RESTORE,
    handler: testController.restoreTest,
  },
  {
    method: METHOD.DELETE,
    path: PATH.FORCE_DELETE,
    handler: testController.forceDeleteTest,
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
