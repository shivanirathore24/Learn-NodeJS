import fs from "fs";
const fsPromise = fs.promises;

async function log(logData) {
  try {
    logData = new Date().toString() + ". Log Data: " + logData;
    await fsPromise.writeFile("log.txt", logData);
  } catch (err) {
    console.log(err);
  }
}

const loggerMiddleware = async (req, res, next) => {
  // Log request body.
  await log(req.body);
  next();
};
export default loggerMiddleware
