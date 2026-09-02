import { zValidator } from "@hono/zod-validator";
import { tagInsertSchema } from "@repo/db/validators";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { createRouter } from "@/lib/create-app";
import { requireAuth } from "@/middleware/auth";

const router = createRouter().post(
  "/",
  requireAuth,
  zValidator("json", tagInsertSchema),
  async (c) => {
    const input = c.req.valid("json");
    const tag = await c.var.services.tagService.create(input, c.var.user.id);
    return c.json({ message: ReasonPhrases.CREATED, tag }, StatusCodes.CREATED);
  },
);

export default router;
