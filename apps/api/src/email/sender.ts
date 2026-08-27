export interface EmailSender {
  send(msg: {
    to: string;
    subject: string;
    text: string;
    html?: string;
  }): Promise<void>;
}
