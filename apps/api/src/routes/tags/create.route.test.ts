import { expect, test } from "bun:test";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { buildTestApp } from "#tests/helpers/build-test-app";

test("tag created successfully", async () => {
  const app = buildTestApp();

  const res = await app.request("/api/tags", {
    method: "POST",
    body: JSON.stringify({ name: "test-tag", userId: "user-123" }),
    headers: new Headers({ "Content-Type": "application/json" }),
  });

  expect(res.status).toBe(StatusCodes.CREATED);
  expect(await res.json()).toEqual({
    message: ReasonPhrases.CREATED,
    tag: expect.objectContaining({
      name: "test-tag",
      userId: "user-123",
    }),
  });
});
