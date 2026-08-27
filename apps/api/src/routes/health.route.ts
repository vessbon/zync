import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { createRouter } from "@/lib/create-app";

const router = createRouter().get("/", (c) => {
  return c.json({ status: ReasonPhrases.OK }, StatusCodes.OK);
});

export default router;
