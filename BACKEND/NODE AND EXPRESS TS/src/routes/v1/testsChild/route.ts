import { Router } from "express";
import * as testController from "./controller";
import { METHOD, PATH } from "../../../constants/index";

const router = Router() as any;

const testChildRoutes = [
  {
    method: METHOD.GET,
    path: PATH.TESTS_CHILD,
    handler: testController.getAllTestsChild,
  },
  {
    method: METHOD.GET,
    path: PATH.DELETED_TESTS_CHILD,
    handler: testController.getAllTestsChildDeleted,
  },
  {
    method: METHOD.GET,
    path: PATH.TEST_CHILD_ID,
    handler: testController.getSingleTestChild,
  },
  {
    method: METHOD.POST,
    path: PATH.TESTS_CHILD,
    handler: testController.createNewTestChild,
  },
  {
    method: METHOD.PATCH,
    path: PATH.EDIT_TEST_CHILD_ID,
    handler: testController.updateTestChild,
  },
  {
    method: METHOD.DELETE,
    path: PATH.TEST_CHILD_ID,
    handler: testController.deleteTestChild,
  },
  {
    method: METHOD.PUT,
    path: PATH.RESTORE_TEST_CHILD_ID,
    handler: testController.restoreTestChild,
  },
  {
    method: METHOD.DELETE,
    path: PATH.FORCE_DELETE_TEST_CHILD_ID,
    handler: testController.forceDeleteTestChild,
  },
];

testChildRoutes.forEach((route) => {
  const { method, path, handler } = route;
  router[method](path, handler);
});

export default router;
