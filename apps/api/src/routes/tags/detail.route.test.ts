import { expect, test } from "bun:test";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { buildUnauthenticatedTestApp } from "#tests/helpers/build-test-app";

test("tag not found", async () => {
  const app = buildUnauthenticatedTestApp();

  const inputTagId = "c5858ab4-944c-436e-b453-f19fda300c9b";

  const res = await app.request(`/api/tags/${inputTagId}`, {
    method: "GET",
  });

  expect(res.status).toBe(StatusCodes.NOT_FOUND);
  expect(await res.json()).toEqual({
    message: ReasonPhrases.NOT_FOUND,
  });
});

test("tag retrieved successfully", async () => {
  const app = buildUnauthenticatedTestApp();

  const tagId = "849a3077-f684-4913-8f06-5533de05fea6";

  const res = await app.request(`/api/tags/${tagId}`, {
    method: "GET",
  });

  expect(res.status).toBe(StatusCodes.OK);
  expect(await res.json()).toEqual({
    message: ReasonPhrases.OK,
    tag: expect.objectContaining({
      id: tagId,
    }),
  });
});
