import { expect, test } from "bun:test";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { buildTestApp } from "#tests/helpers/build-test-app";

test("health route responds", async () => {
  const app = buildTestApp();

  const res = await app.request("/health");

  expect(res.status).toBe(StatusCodes.OK);
  expect(await res.json()).toEqual({ status: ReasonPhrases.OK });
});
