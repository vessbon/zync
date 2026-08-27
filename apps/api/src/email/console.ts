import type { EmailSender } from "./sender";

// Only use in a dev environment
export class ConsoleEmailSender implements EmailSender {
  async send(msg: { to: string; subject: string; text: string }) {
    console.log("\n=== EMAIL ===");
    console.log(`To: ${msg.to}`);
    console.log(`Subject: ${msg.subject}`);
    console.log(msg.text);
    console.log("=============\n");
  }
}
