import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "request-logging" },
  transports: [new winston.transports.File({ filename: "log.txt" })],
});

const winstonLoggerMiddleware = async (req, res, next) => {
  // Exclude logging for /signin and /signup routes
  if (
    !req.url.includes("/signin") &&
    !req.url.includes("/signup") &&
    !req.url.includes("/resetPassword")
  ) {
    const logData = `${req.url} - ${JSON.stringify(req.body)}`;
    logger.info(logData);
  }
  next();
};

export default winstonLoggerMiddleware;
