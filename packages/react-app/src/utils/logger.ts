import winston, { format } from "winston";

export const createLogger = (service: string) =>
  winston.createLogger({
    level: "info",
    format: format.combine(
      format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      format.json(),
    ),
    defaultMeta: { endpoint: service },
    transports: [new winston.transports.Console()],
  });
