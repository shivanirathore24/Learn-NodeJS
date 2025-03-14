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

## Using Middleware Logger
We will use the logger middleware and test if the requests are being logged
properly.
### Applying Logger Middleware
- The logger middleware can be applied at different levels: application level, route
level, or controller level.
- We apply the logger middleware at the application level using
`server.use(loggerMiddleware)`.
### Testing the Logger Middleware
- We use a tool like Postman to send requests and check if they are being logged.
- After sending a request, we check the logs to see if the timestamp and log data
are present.
- Initially, the log data may display as `[object Object]` because we need to convert
it to a string.

### Enhancing the Logger Middleware
1. We modify the logger middleware to convert the request body to a string and log
the request URL.
2. The `JSON.stringify()` method is used to convert the request body object to a
string.
3. The `appendFile` function is used instead of `writeFile` to preserve existing log
data.
4. A new line character (`\n`) is appended before each log entry for readability.

#### Modified logger.middleware.js file:
```javascript
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
  // Exclude logging for /signin and /signup routes
  if (!req.url.includes("/signin") && !req.url.includes("/signup")) {
    const logData = `${req.url} - ${JSON.stringify(req.body)}`;
    await log(logData);
  }
  next();
};

export default loggerMiddleware;
```
### Logging Best Practices
- We should avoid logging sensitive information such as passwords.
- We can skip logging specific routes or requests, like sign-in requests, to prevent
logging sensitive data.
- Applying the logger middleware at the route level allows for more granular control
over which requests are logged.


