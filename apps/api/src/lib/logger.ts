import pino from "pino";

export interface Logger {
  info(obj: object | string, msg?: string): void;
  error(obj: object | string, msg?: string): void;
  warn(obj: object | string, msg?: string): void;
  debug(obj: object | string, msg?: string): void;
  child(bindings: Record<string, unknown>): Logger;
}

export function createPinoLogger(isProduction: boolean): Logger {
  const transport = !isProduction
    ? {
        transport: {
          target: "pino-pretty",
          options: { colorize: true, singleLine: true },
        },
      }
    : {};

  return pino({
    level: isProduction ? "info" : "debug",
    ...transport,
  });
}
