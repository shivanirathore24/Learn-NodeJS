import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  // 1. Log request headers for debugging
  console.log(req.headers);

  // 2. Extract the token from the 'Authorization' header
  const token = req.headers["authorization"]; // Format: 'Bearer <token>'

  // 3. Respond with 'Unauthorized' if no token is provided
  if (!token) {
    return res.status(401).send("Unauthorized: No token provided");
  }

  try {
    // 4. Verify the token using the secret key and log the decoded payload
    const payload = jwt.verify(token, "N6BUpqT7VL8cI7VbzLHaaS9txwGJWZMR");
    req.userID = payload.userID;
    console.log(payload);
  } catch (err) {
    // 5. Log token verification errors and send 'Unauthorized' response
    console.error("Token Error: Invalid or expired token", err.message);
    return res.status(401).send("Unauthorized: Invalid or expired token");
  }

  // 6. Token is valid, proceed to the next middleware
  next();
};

export default jwtAuth;
