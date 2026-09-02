import { expect, test } from "bun:test";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import {
  buildTestApp,
  buildUnauthenticatedTestApp,
} from "#tests/helpers/build-test-app";

test("requires authentication", async () => {
  const app = buildUnauthenticatedTestApp();

  const res = await app.request("/api/time", {
    method: "POST",
    body: JSON.stringify({
      tagId: "0fd5f65a-d75b-4c65-b0c3-0c75ce2fedc0",
      duration: 40,
    }),
    headers: new Headers({ "Content-Type": "application/json" }),
  });

  expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
  expect(await res.json()).toEqual({ message: ReasonPhrases.UNAUTHORIZED });
});

test("tag created successfully", async () => {
  const app = buildTestApp();

  const res = await app.request("/api/time", {
    method: "POST",
    body: JSON.stringify({
      tagId: "0fd5f65a-d75b-4c65-b0c3-0c75ce2fedc0",
      duration: 40,
    }),
    headers: new Headers({ "Content-Type": "application/json" }),
  });

  expect(res.status).toBe(StatusCodes.CREATED);
  expect(await res.json()).toMatchObject({
    message: ReasonPhrases.CREATED,
    timeEntry: {
      tagId: "0fd5f65a-d75b-4c65-b0c3-0c75ce2fedc0",
      duration: 40,
    },
  });
});
