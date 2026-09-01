import { zValidator } from "@hono/zod-validator";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import * as z from "zod";
import { createRouter } from "@/lib/create-app";

const router = createRouter().get(
  "/:id",
  zValidator(
    "param",
    z.object({
      id: z.uuid(),
    }),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const tag = await c.var.services.tagService.get(id);

    if (!tag) {
      return c.json(
        { message: ReasonPhrases.NOT_FOUND },
        StatusCodes.NOT_FOUND,
      );
    }

    return c.json({ message: ReasonPhrases.OK, tag }, StatusCodes.OK);
  },
);

export default router;
