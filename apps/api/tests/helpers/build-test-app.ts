import type { Session, User } from "better-auth";
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

const tags = new Map([
  [
    "849a3077-f684-4913-8f06-5533de05fea6",
    {
      id: "849a3077-f684-4913-8f06-5533de05fea6",
      name: "jp",
      userId: "user-123",
    },
  ],
]);

const services: Services = {
  tagService: {
    create: async (_, input) => {
      const tag = {
        id: crypto.randomUUID(),
        name: input.name,
        userId: input.userId,
      };

      tags.set(tag.id, tag);

      return tag;
    },
    get: async (id) => {
      return tags.get(id) || null;
    },
  },
};

const getSession: GetSession = async () => null;
const authHandler: AuthHandler = () => new Response("auth ok");

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
