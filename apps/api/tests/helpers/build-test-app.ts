import { buildApp } from "@/app";
import type { AuthHandler } from "@/lib/auth-handler";
import type { CreateAppDeps } from "@/lib/create-app";
import type { Logger } from "@/lib/logger";
import type { Services } from "@/lib/services";
import type { GetSession } from "@/lib/session";

const rootLogger: Logger = {
  info() {},
  error() {},
  warn() {},
  debug() {},
  child() {
    return this;
  },
};

const services: Services = {
  tagService: {
    create: async (_, input) => {
      return { id: "random", name: input.name, userId: input.userId };
    },
  },
};

const getSession: GetSession = async () => null;
const authHandler: AuthHandler = () => new Response("auth ok");

export function buildTestApp(overrides?: Partial<CreateAppDeps>) {
  return buildApp({
    rootLogger,
    getSession,
    authHandler,
    services,
    isProduction: false,
    ...overrides,
  });
}
