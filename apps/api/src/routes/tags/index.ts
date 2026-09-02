import { createRouter } from "@/lib/create-app";
import createRoute from "./create.route";
import deleteRoute from "./delete.route";
import detailRoute from "./detail.route";

const router = createRouter();

const routes = [createRoute, deleteRoute, detailRoute] as const;

routes.forEach((route) => {
  router.route("/", route);
});

export default router;
