import testsRoute from "./tests/route.js";
import testChildRoute from "./testsChild/route.js";

const routes = [
  {
    route: testsRoute,
  },
  {
    route: testChildRoute,
  },
];

export const V1 = routes.map((route) => ({
  url: `v1/`,
  route: route.route,
}));
