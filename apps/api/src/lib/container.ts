import { createServices } from "@repo/core/core";
import { createDb } from "@repo/db/client";
import { createAuth } from "@/auth";
import type { EmailSender } from "@/email";
import { ConsoleEmailSender } from "@/email/console";
import env from "@/env";
import { createBetterAuthHandler } from "./auth-handler";
import { createPinoLogger } from "./logger";
import { createBetterAuthSession } from "./session";

export const db = createDb(env.DATABASE_URL);
export const emailSender: EmailSender = new ConsoleEmailSender();
export const auth = createAuth({ db, emailSender });

export const rootLogger = createPinoLogger(env.NODE_ENV === "production");
export const getSession = createBetterAuthSession(auth);
export const authHandler = createBetterAuthHandler(auth);

export const services = createServices(db);
