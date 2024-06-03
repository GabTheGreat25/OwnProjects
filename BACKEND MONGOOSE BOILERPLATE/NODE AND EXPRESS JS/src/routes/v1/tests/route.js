import { Router } from "express";
import * as testController from "./controller.js";
import { METHOD, PATH } from "../../../constants/index.js";

const router = Router();

const testRoutes = [
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
  },
  {
    method: METHOD.PATCH,
    path: PATH.EDIT,
    handler: testController.updateTest,
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

testRoutes.forEach((route) => {
  const { method, path = "", handler } = route;
  router[method](path, handler);
});

export default router;
