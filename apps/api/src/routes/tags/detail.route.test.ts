import { expect, test } from "bun:test";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import {
  buildTestApp,
  buildUnauthenticatedTestApp,
} from "#tests/helpers/build-test-app";
import {
  createMockServices,
  createMockTagService,
} from "#tests/helpers/mock-services";

test("requires authentication", async () => {
  const app = buildUnauthenticatedTestApp();

  const res = await app.request(
    `/api/tags/c5858ab4-944c-436e-b453-f19fda300c9b`,
    {
      method: "GET",
    },
  );

  expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
  expect(await res.json()).toEqual({ message: ReasonPhrases.UNAUTHORIZED });
});

test("tag not found", async () => {
  const app = buildTestApp();

  const res = await app.request(
    `/api/tags/c5858ab4-944c-436e-b453-f19fda300c9b`,
    {
      method: "GET",
    },
  );

  expect(res.status).toBe(StatusCodes.NOT_FOUND);
  expect(await res.json()).toEqual({
    message: ReasonPhrases.NOT_FOUND,
  });
});

test("tag retrieved successfully", async () => {
  const tagId = "849a3077-f684-4913-8f06-5533de05fea6";

  const app = buildTestApp({
    services: {
      ...createMockServices(),
      tagService: createMockTagService({
        getById: async () => ({
          id: tagId,
          name: "test",
          userId: "user-123",
        }),
      }),
    },
  });

  const res = await app.request(`/api/tags/${tagId}`, {
    method: "GET",
  });

  expect(res.status).toBe(StatusCodes.OK);
  expect(await res.json()).toMatchObject({
    message: ReasonPhrases.OK,
    tag: {
      id: tagId,
    },
  });
});
