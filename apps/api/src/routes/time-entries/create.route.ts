import { zValidator } from "@hono/zod-validator";
import { timeEntryInsertSchema } from "@repo/db/validators";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { createRouter } from "@/lib/create-app";
import { requireAuth } from "@/middleware/auth";

const router = createRouter().post(
  "/",
  requireAuth,
  zValidator("json", timeEntryInsertSchema),
  async (c) => {
    const userId = c.var.user.id;
    const input = c.req.valid("json");

    const timeEntry = await c.var.services.timeEntryService.create(
      userId,
      input,
    );

    return c.json(
      { message: ReasonPhrases.CREATED, timeEntry },
      StatusCodes.CREATED,
    );
  },
);

export default router;
