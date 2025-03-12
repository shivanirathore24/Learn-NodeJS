## HANDLING ERRORS
## Creating Logger Middleware
Logging is the process of creating logs to track important information in an
application. Logging can be used to track errors, record request data, and provide
insights for debugging.

### Benefits of Logging
1. Logging allows developers to analyze errors and fix them efficiently.
2. Logging request data helps in understanding user behavior and identifying
issues.
3. Logs provide a historical record of events, aiding in troubleshooting and
auditing.

### Logger Middleware Implementation
1. We import the `fs` module and `fs.promises` using `import`.
2. The `log` function is created as an asynchronous function.
3. Within the `log` function, we use `try-catch` to handle errors.
4. The `writeFile` function is called to write the log data to a file.
5. A timestamp is added to the log data using `new Date().toString()`.
6. The log data is exported from the module.

### Logger Middleware Usage
1. The logger middleware is created as a function that takes `request`,
`response`, and `next`.
2. The `log` function is invoked within the logger middleware to log the request
body.
3. The `next` function is called to pass control to the next middleware in the
pipeline.

#### 'logger.middleware.js' file:
```javascript
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
```


