import { createRouter } from "@/lib/create-app";
import create from "./create.route";

const router = createRouter();

router.route("/", create);

export default router;
