import { zValidator } from "@hono/zod-validator";
import { StatusCodes } from "http-status-codes";
import { createRouter } from "@/lib/create-app";
import { requireAuth } from "@/middleware/auth";
import { IdParamSchema } from "@/validators";

const router = createRouter().delete(
  "/:id",
  requireAuth,
  zValidator("param", IdParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    await c.var.services.tagService.delete(id, c.var.user.id);

    return c.body(null, StatusCodes.NO_CONTENT);
  },
);

export default router;
