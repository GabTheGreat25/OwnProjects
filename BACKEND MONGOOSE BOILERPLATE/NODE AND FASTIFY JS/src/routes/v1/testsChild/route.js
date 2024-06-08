import * as testController from "./controller.js";
import { METHOD, PATH } from "../../../constants/index.js";
import { upload } from "../../../utils/index.js";

const routes = [
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

const router = (app, opts, done) => {
  routes.forEach(({ method, path = "", handler, preHandler }) => {
    const routeOptions = {
      method,
      url: path,
      handler,
      preHandler: preHandler || [],
    };
    app.route(routeOptions);
  });
  done();
};

export default router;
