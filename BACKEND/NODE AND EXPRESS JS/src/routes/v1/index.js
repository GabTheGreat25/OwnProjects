import testsRoute from "./tests/route.js";

const routes = [
  {
    route: testsRoute,
  },
];

export const V1 = routes.map((route) => ({
  url: `v1/`,
  route: route.route,
}));
