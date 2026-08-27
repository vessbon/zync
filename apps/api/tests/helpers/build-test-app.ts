import { buildApp } from "@/app";
import type { AuthHandler } from "@/lib/auth-handler";
import type { CreateAppDeps } from "@/lib/create-app";
import type { Logger } from "@/lib/logger";
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

const getSession: GetSession = async () => null;
const authHandler: AuthHandler = () => new Response("auth ok");

export function buildTestApp(overrides?: Partial<CreateAppDeps>) {
  return buildApp({
    rootLogger,
    getSession,
    authHandler,
    isProduction: false,
    ...overrides,
  });
}
