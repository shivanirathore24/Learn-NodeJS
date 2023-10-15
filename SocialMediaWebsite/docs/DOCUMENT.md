## Documentation [All steps for Project]

### 1: Setting up Directory Structure:

1. Create an 'index.js' file under your project directory i.e 'SocialMediaWebsite' folder.

2. For creating 'package.json,' run the following command in your project directory:

   ```bash
   npm init
   ```

3. Create folders using the 'mkdir' command in your project directory. For example:

   - To create a 'routes' folder:

   ```bash
   mkdir routes
   ```

   - To create a 'controllers' folder:

   ```bash
   mkdir controllers
   ```

   - To create a 'views' folder:

   ```bash
   mkdir views
   ```

   - To create a 'models' folder:

   ```bash
   mkdir models
   ```

   - To create a 'config' folder:

   ```bash
   mkdir config
   ```

### 2: Setup Express Server

1. Install express server, then node_modules folder will be created.
   ```bash
   npm install express
   ```
2. Write code in 'index.js' file to setup express server.

### 3: Add .gitignore file and npm start

1. Added "node_modules/" inside .gitignore file.
2. Intially, we were using command to run project:
   ```bash
   nodemon index.js
   ```
3. Now added "start": "nodemon index.js" inside script in package.json, now to run project use command:
   ```bash
   npm start
   ```

### 4: Set up express Router

1. Created 'index.js' file under 'routes folder' and write code.
2. Entry file(index.js), use express router.
3. Do check "npm start" whether router is loaded or not.

### 5: Create a 'home' Controller and router for request '/':

1. Created 'home_controller.js' file under 'controllers folder' and write code.
2. Access and use 'home function of home_controlleer.js' inside routes(index.js).
3. For default route, access from index.js(entry file): app.use("/", require("./routes"));
4. Start project and check in browser "http://localhost:8000/".

### 6: Create a 'user' controller and router for request 'users/profile':

1. Created 'users_controller.js' file under 'controllers folder' and write code.
2. Created 'users.js' file under 'routes folder'.
3. Access and use 'profile function of users_controlleer.js' inside routes(users.js) for /profile request.
4. routes(index.js) --> root of all other routes i.e for further routes, access from here:
   router.use('/routerName', require('./routerFile'))
   - for request '/'(bydefault): index.js(entry point) --> routes(index.js) --> home_controller.js (home function)
   - for reuqest '/users/profile': index.js(entry point) --> routes(index.js) --> routes(users.js) -->users_controller.js (profile function)

### 7: Routes:

1. routes(index.js): Entry point for all request and handles all direct urls i.e (root level routes) For example : /home , /contact, /about etc
2. routes(users.js): handles all user related request. For example: users/profile , users/create, users/edit etc..
