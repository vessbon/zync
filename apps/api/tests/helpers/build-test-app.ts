import type { Session, User } from "better-auth";
import { buildApp } from "@/app";
import type { AuthHandler } from "@/lib/auth-handler";
import type { CreateAppDeps } from "@/lib/create-app";
import type { Logger } from "@/lib/logger";
import type { GetSession } from "@/lib/session";
import { createMockServices } from "./mock-services";

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

const services = createMockServices();

const testUser: User = {
  id: "user-123",
  name: "Test User",
  email: "test@example.com",
  emailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const testSession: Session = {
  id: "session-123",
  userId: "user-123",
  token: "token-123",
  expiresAt: new Date(new Date().getDate() + 7),
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function buildTestApp(overrides?: Partial<CreateAppDeps>) {
  return buildApp({
    rootLogger,
    getSession: async () => ({
      user: testUser,
      session: testSession,
    }),
    authHandler,
    services,
    isProduction: false,
    ...overrides,
  });
}

export function buildUnauthenticatedTestApp(
  overrides?: Partial<CreateAppDeps>,
) {
  return buildApp({
    rootLogger,
    getSession,
    authHandler,
    services,
    isProduction: false,
    ...overrides,
  });
}
