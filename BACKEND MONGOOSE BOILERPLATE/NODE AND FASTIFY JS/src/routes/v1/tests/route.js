import * as testController from "./controller.js";
import { METHOD, PATH } from "../../../constants/index.js";
import { upload } from "../../../utils/index.js";

const routes = [
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
