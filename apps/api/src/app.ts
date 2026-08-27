import health from "@/routes/health.route";
import createApp, { type CreateAppDeps } from "./lib/create-app";

export function buildApp(deps: CreateAppDeps) {
  const app = createApp(deps);

  const routes = [{ path: "/health", router: health }] as const;

  for (const { path, router } of routes) {
    app.route(path, router);
  }

  return app;
}
