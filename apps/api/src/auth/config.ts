// Isolated auth config file for CLI
import { createDb } from "@repo/db/client";
import { createAuth } from "@/auth";

const db = createDb("postgresql://localhost/dummy");

export default createAuth({
  db,
  emailSender: {
    async send() {},
  },
});
