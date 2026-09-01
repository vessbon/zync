import health from "@/routes/health.route";
import tags from "@/routes/tags";
import timeEntries from "@/routes/time-entries";
import createApp, { type CreateAppDeps } from "./lib/create-app";

export function buildApp(deps: CreateAppDeps) {
  const app = createApp(deps);

  const routes = [
    { path: "/health", router: health },
    { path: "/api/tags", router: tags },
    { path: "/api/time", router: timeEntries },
  ] as const;

  for (const { path, router } of routes) {
    app.route(path, router);
  }

  return app;
}
