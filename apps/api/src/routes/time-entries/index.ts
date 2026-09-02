import { createRouter } from "@/lib/create-app";
import create from "./create.route";

const router = createRouter();

const routes = [create] as const;

routes.forEach((route) => {
  router.route("/", route);
});

export default router;
