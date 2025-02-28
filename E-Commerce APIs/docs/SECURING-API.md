## SECURING APIs

## Understanding Security

### Introduction to the next set of APIs

#### APIs to be created:

- Rate a product.
- Add products to a cart.
- Retrieve products from the cart.
- Remove a product from the cart.

### Need for User Authentication

- User authentication is required for user-specific actions.
- Actions such as adding items to the cart or placing orders require user
  identification.
- Without authentication, it becomes difficult for the system to determine
  user-specific actions.

### Reasons for Securing the Application

- Controlled access: Only logged-in users should access certain features.
- Data privacy: User data should not be accessible to everyone.
- Examples: Misuse of private data on social media platforms.

### How to Secure the Application

- Authentication and authorization are essential.
- Authentication verifies the identity of a user.
- Authorization determines what a user can access based on their privileges.

### Authentication and Authorization

<img src="./images/authentication_authorization.png" alt="Authentication and Authorization" width="600" height="auto">

### Types of Authentication

<img src="./images/types_of_authentication.png" alt="Types of Authentication" width="600" height="auto">

1. **Basic authentication:** Users provide credentials with each request.
2. **API keys:** Unique keys for user identification (used by third-party APIs).
3. **OAuth (Open Authentication):** Allows authentication using third-party
   applications (e.g., Google or Facebook).
4. **JWT (JSON Web Token):** Popular authentication method using tokens (more
   details in future videos).
