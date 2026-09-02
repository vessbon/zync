import { expect, test } from "bun:test";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import {
  buildTestApp,
  buildUnauthenticatedTestApp,
} from "#tests/helpers/build-test-app";

test("requires authentication", async () => {
  const app = buildUnauthenticatedTestApp();

  const res = await app.request(
    "/api/tags/c05ebea9-3a38-4e34-83ed-a8d5558124d1",
    {
      method: "DELETE",
    },
  );

  expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
  expect(await res.json()).toEqual({ message: ReasonPhrases.UNAUTHORIZED });
});

test("tag deleted successfully", async () => {
  const app = buildTestApp();

  const res = await app.request(
    "/api/tags/c5858ab4-944c-436e-b453-f19fda300c9b",
    {
      method: "DELETE",
    },
  );

  expect(res.status).toBe(StatusCodes.NO_CONTENT);
  expect(res.body).toBe(null);
});
