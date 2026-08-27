import type { Auth } from "@/auth";

export type AuthHandler = (req: Request) => Response | Promise<Response>;

export function createBetterAuthHandler(a: Auth): AuthHandler {
  return (req) => a.handler(req);
}
