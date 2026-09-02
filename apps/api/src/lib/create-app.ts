import { structuredLogger } from "@hono/structured-logger";
import type { Services } from "@repo/core/services";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { requestId } from "hono/request-id";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import type { Auth } from "@/auth";
import type { AuthHandler } from "./auth-handler";
import type { Logger } from "./logger";
import type { GetSession } from "./session";

export type AppEnv = {
  Variables: {
    user: Auth["$Infer"]["Session"]["user"] | null;
    session: Auth["$Infer"]["Session"]["session"] | null;
    services: Services;
    logger: Logger;
  };
};

export function createRouter() {
  return new Hono<AppEnv>({ strict: false });
}

export interface CreateAppDeps {
  rootLogger: Logger;
  getSession: GetSession;
  authHandler: AuthHandler;
  services: Services;
  isProduction: boolean;
}

export default function createApp({
  rootLogger,
  getSession,
  authHandler,
  services,
  isProduction,
}: CreateAppDeps) {
  const app = createRouter();

  // General error handling
  app.notFound((c) => {
    return c.json({ message: ReasonPhrases.NOT_FOUND }, StatusCodes.NOT_FOUND);
  });

  app.onError((err, c) => {
    c.var.logger.error({ err }, "request failed");
    return c.json(
      {
        message: err.message,
        ...(isProduction ? {} : { stack: err.stack }),
      },
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  });

  // Middleware
  app.use("/favicon.ico", serveStatic({ path: "./favicon.ico" }));
  app.use("*", requestId());

  // Logger middleware
  app.use(
    structuredLogger({
      createLogger: (c) => rootLogger.child({ requestId: c.var.requestId }),
      onResponse: (logger, c, elapsedMs) =>
        logger.info({ method: c.req.method, path: c.req.path, elapsedMs }),
    }),
  );

  // Service middleware
  app.use("*", async (c, next) => {
    c.set("services", services);
    await next();
  });

  // Session middleware
  app.use("*", async (c, next) => {
    const session = await getSession(c.req.raw.headers);

    c.set("user", session?.user ?? null);
    c.set("session", session?.session ?? null);
    await next();
  });

  // Mount the auth handler
  app.on(["POST", "GET"], "/api/auth/*", (c) => {
    return authHandler(c.req.raw);
  });

  return app;
}
