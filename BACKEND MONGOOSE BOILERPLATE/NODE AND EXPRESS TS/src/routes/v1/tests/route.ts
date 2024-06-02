import { Router } from "express";
import * as testController from "./controller";
import { METHOD, PATH } from "../../../constants";

const router = Router() as any;

const testRoutes = [
  {
    method: METHOD.GET,
    path: "",
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
    path: "",
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
  const { method, path, handler } = route;
  router[method](path, handler);
});

export default router;
