import type { Auth } from "@/auth";

export type SessionData = {
  user: Auth["$Infer"]["Session"]["user"];
  session: Auth["$Infer"]["Session"]["session"];
};

export type GetSession = (headers: Headers) => Promise<SessionData | null>;

export function createBetterAuthSession(a: Auth): GetSession {
  return (headers) => a.api.getSession({ headers });
}
