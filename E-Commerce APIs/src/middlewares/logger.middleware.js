import fs from "fs";
const fsPromise = fs.promises;

async function log(logData) {
  try {
    logData = `${new Date().toString()} +  ${logData}\n`;
    await fsPromise.appendFile("log.txt", logData);
  } catch (err) {
    console.log(err);
  }
}

const loggerMiddleware = async (req, res, next) => {
  // Exclude logging for /signin, /signup, and /resetPassword routes
  if (
    !req.url.includes("/signin") &&
    !req.url.includes("/signup") &&
    !req.url.includes("/resetPassword")
  ) {
    const logData = `${req.url} - ${JSON.stringify(req.body)}`;
    await log(logData);
  }
  next();
};

export default loggerMiddleware;
