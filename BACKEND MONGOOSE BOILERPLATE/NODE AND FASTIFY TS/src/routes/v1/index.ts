import testsRoute from "./tests/route.js";
import { RESOURCE } from "../../constants/index.js";

const routes = [
  {
    url: RESOURCE.TESTS,
    route: testsRoute,
  },
];

export const V1 = routes.map((route: any) => ({
  url: `${RESOURCE.V1}${route.url}`,
  route: route.route,
}));
