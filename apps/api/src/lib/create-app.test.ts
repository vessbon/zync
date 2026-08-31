import { describe, expect, test } from "bun:test";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { buildUnauthenticatedTestApp } from "#tests/helpers/build-test-app";
import type { SessionData } from "@/lib/session";

describe("app error handling", () => {
  test("unknown route returns 404", async () => {
    const app = buildUnauthenticatedTestApp();

    const res = await app.request("/does-not-exist");

    expect(res.status).toBe(StatusCodes.NOT_FOUND);
    expect(await res.json()).toEqual({ message: ReasonPhrases.NOT_FOUND });
  });

  test("thrown errors return 500 with stack outside production", async () => {
    const app = buildUnauthenticatedTestApp({ isProduction: false });
    app.get("/boom", () => {
      throw new Error("kaboom");
    });

    const res = await app.request("/boom");
    const body = (await res.json()) as { message: string; stack?: string };

    expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(body.message).toBe("kaboom");
    expect(body.stack).toBeString();
  });

  test("thrown errors hide stack in production", async () => {
    const app = buildUnauthenticatedTestApp({ isProduction: true });
    app.get("/boom", () => {
      throw new Error("kaboom");
    });

    const res = await app.request("/boom");
    const body = (await res.json()) as { message: string; stack?: string };

    expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(body.message).toBe("kaboom");
    expect(body.stack).toBeUndefined();
  });
});

describe("session middleware", () => {
  test("populates c.var.user and c.var.session from getSession", async () => {
    const fakeSession = {
      user: { id: "user-1", email: "a@b.test" },
      session: { id: "session-1", token: "tok" },
    } as unknown as SessionData;

    const app = buildUnauthenticatedTestApp({
      getSession: async () => fakeSession,
    });
    app.get("/whoami", (c) =>
      c.json({ user: c.var.user, session: c.var.session }),
    );

    const res = await app.request("/whoami");

    expect(res.status).toBe(StatusCodes.OK);
    expect(await res.json()).toEqual({
      user: fakeSession.user,
      session: fakeSession.session,
    });
  });

  test("sets user and session to null when getSession returns null", async () => {
    const app = buildUnauthenticatedTestApp({ getSession: async () => null });
    app.get("/whoami", (c) =>
      c.json({ user: c.var.user, session: c.var.session }),
    );

    const res = await app.request("/whoami");

    expect(res.status).toBe(StatusCodes.OK);
    expect(await res.json()).toEqual({ user: null, session: null });
  });

  test("forwards request headers to getSession", async () => {
    let receivedHeaders: Headers | undefined;
    const app = buildUnauthenticatedTestApp({
      getSession: async (headers) => {
        receivedHeaders = headers;
        return null;
      },
    });
    app.get("/whoami", (c) => c.json({ ok: true }));

    await app.request("/whoami", { headers: { cookie: "session=abc" } });

    expect(receivedHeaders?.get("cookie")).toBe("session=abc");
  });
});
