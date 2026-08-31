import { createMiddleware } from "hono/factory";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import type { SessionData } from "@/lib/session";

export type AuthenticatedEnv = {
  Variables: SessionData;
};

export const requireAuth = createMiddleware<AuthenticatedEnv>(
  async (c, next) => {
    if (!c.var.user || !c.var.session) {
      return c.json(
        { message: ReasonPhrases.UNAUTHORIZED },
        StatusCodes.UNAUTHORIZED,
      );
    }

    await next();
  },
);
