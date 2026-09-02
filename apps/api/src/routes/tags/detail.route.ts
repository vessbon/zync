import { zValidator } from "@hono/zod-validator";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { createRouter } from "@/lib/create-app";
import { IdParamSchema } from "@/validators";

const router = createRouter().get(
  "/:id",
  zValidator("param", IdParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const tag = await c.var.services.tagService.getById(id);

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
