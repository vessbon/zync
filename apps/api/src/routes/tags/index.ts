import { createRouter } from "@/lib/create-app";
import create from "./create.route";
import list from "./detail.route";

const router = createRouter();

router.route("/", list);
router.route("/", create);

export default router;
