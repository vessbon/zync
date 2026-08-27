import {
  type DB,
  drizzleAdapter,
} from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import type { EmailSender } from "@/email";

export function createAuth(deps: { db: DB; emailSender: EmailSender }) {
  return betterAuth({
    basePath: "/api/auth",
    database: drizzleAdapter(deps.db, {
      provider: "pg",
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
  });
}

export type Auth = ReturnType<typeof createAuth>;
