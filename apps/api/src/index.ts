import { buildApp } from "./app";
import env from "./env";
import { authHandler, getSession, rootLogger, services } from "./lib/container";

const app = buildApp({
  rootLogger,
  getSession,
  authHandler,
  services,
  isProduction: env.NODE_ENV === "production",
});

export default {
  port: env.PORT,
  fetch: app.fetch,
};
