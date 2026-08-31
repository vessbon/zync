import {
  type DB,
  drizzleAdapter,
} from "@better-auth/drizzle-adapter/relations-v2";
import * as schema from "@repo/db/schema";
import { type BetterAuthPlugin, betterAuth } from "better-auth";
import { emailOTP, testUtils } from "better-auth/plugins";
import type { EmailSender } from "@/email";

interface AuthDeps {
  db: DB;
  emailSender: EmailSender;
}

function createAuthOptions(deps: AuthDeps) {
  return {
    basePath: "/api/auth",
    database: drizzleAdapter(deps.db, {
      provider: "pg",
      schema,
      usePlural: true,
    }),
    plugins: [
      emailOTP({
        async sendVerificationOTP({ email, otp }) {
          await deps.emailSender.send({
            to: email,
            subject: "Code",
            text: `Code: ${otp}`,
          });
        },
      }),
    ],
  };
}

export function createAuth(deps: AuthDeps) {
  return betterAuth(createAuthOptions(deps));
}

export function createTestAuth(deps: AuthDeps) {
  const options = createAuthOptions(deps);

  const testPlugin = testUtils({
    captureOTP: true,
  }) as unknown as BetterAuthPlugin;

  return betterAuth({
    ...options,
    plugins: [testPlugin, ...options.plugins],
  });
}

export type Auth = ReturnType<typeof createAuth>;
export type TestAuth = ReturnType<typeof createTestAuth>;
