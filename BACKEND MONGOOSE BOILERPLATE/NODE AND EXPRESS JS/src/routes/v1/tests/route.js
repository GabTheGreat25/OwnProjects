import { Router } from "express";
import * as testController from "./controller.js";
import { METHOD, PATH } from "../../../constants/index.js";

const router = Router();

const testRoutes = [
  {
    method: METHOD.GET,
    path: PATH.TESTS,
    handler: testController.getAllTests,
  },
  {
    method: METHOD.GET,
    path: PATH.DELETED_TESTS,
    handler: testController.getAllTestsDeleted,
  },
  {
    method: METHOD.GET,
    path: PATH.TEST_ID,
    handler: testController.getSingleTest,
  },
  {
    method: METHOD.POST,
    path: PATH.TESTS,
    handler: testController.createNewTest,
  },
  {
    method: METHOD.PATCH,
    path: PATH.EDIT_TEST_ID,
    handler: testController.updateTest,
  },
  {
    method: METHOD.DELETE,
    path: PATH.TEST_ID,
    handler: testController.deleteTest,
  },
  {
    method: METHOD.PUT,
    path: PATH.RESTORE_TEST_ID,
    handler: testController.restoreTest,
  },
  {
    method: METHOD.DELETE,
    path: PATH.FORCE_DELETE_TEST_ID,
    handler: testController.forceDeleteTest,
  },
];

testRoutes.forEach((route) => {
  const { method, path, handler } = route;
  router[method](path, handler);
});

export default router;
