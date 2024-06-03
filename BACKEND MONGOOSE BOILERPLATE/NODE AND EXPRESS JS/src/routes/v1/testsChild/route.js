import { Router } from "express";
import * as testController from "./controller.js";
import { METHOD, PATH } from "../../../constants/index.js";

const router = Router();

const testChildRoutes = [
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
  },
  {
    method: METHOD.PATCH,
    path: PATH.EDIT,
    handler: testController.updateTestChild,
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

testChildRoutes.forEach((route) => {
  const { method, path = "", handler } = route;
  router[method](path, handler);
});

export default router;
