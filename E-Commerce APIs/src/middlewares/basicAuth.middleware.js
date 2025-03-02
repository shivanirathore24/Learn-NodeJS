import { UserModel } from "../features/user/user.model.js";

const basicAuthorizer = (req, res, next) => {
  // 1. Check if the Authorization header is present in the request
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).send("No authorization details found!");
  }
  console.log("Authorization Header:", authHeader);

  // 2. Extract the Base64-encoded credentials from the Authorization header
  // The header format is "Basic <base64encodedCredentials>"
  const base64Credentials = authHeader.replace("Basic ", "");
  console.log("Base64 Credentials:", base64Credentials);

  // 3. Decode the Base64-encoded credentials to get the "username:password" format
  const decodeCreds = Buffer.from(base64Credentials, "base64").toString("utf8");
  console.log("Decoded Credentials:", decodeCreds); // Expected format: "username:password"

  // 4. Split the decoded string into username and password
  const creds = decodeCreds.split(":");
  if (creds.length < 2) {
    return res.status(401).send("Invalid authorization format");
  }

  // 5. Validate credentials against the user database
  const user = UserModel.getAll().find(
    (u) => u.email === creds[0] && u.password === creds[1]
  );

  // 6. If a valid user is found, proceed to the next middleware
  if (user) {
    console.log("Authorization successful for user:", creds[0]);
    next();
  } else {
    // 7. If credentials are invalid, return a 401 Unauthorized response
    return res.status(401).send("Incorrect Credentials");
  }
};

export default basicAuthorizer;
