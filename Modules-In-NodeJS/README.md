# Modules in NodeJS
## Understanding Module
### What is a Module?
A module is a self-contained code that can be easily reused across different parts of
an application. It helps in organizing code and makes it easier to maintain and
understand. In Node.js, there are two syntaxes available to use modules:
CommonJS and ES6 module syntax.

### CommonJS Module
CommonJS is the default module system in Node.js that uses the ‘require’ function
to import modules and the ‘module.exports’ object to export them.

Here is an example of a CommonJS module:
```javascript
// utils.js
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
module.exports = { add, subtract };
```
In the above example, a module called utils.js exports two functions, add and
subtract, using the module.exports object. They can be used in another file as
follows:
```javascript
// app.js
const { add, subtract } = require('./utils');
console.log(add(2, 3)); // output: 5
```

### ES6 Module
The ES6 module syntax is a more modern approach that is supported by modern
JavaScript environments, and it employs the "import" and "export" keywords.
Here is an example of an ES6 module:
```javascript
// utils.mjs
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
```
In the above example, a module called utils.mjs exports two functions add and
subtract using the export keyword. They can be used in another file as follows:
```javascript
// app.mjs
import { add, subtract } from './utils.mjs';
//import * as utility from ‘./utils.mjs’
console.log(add(2, 3)); // output: 5
console.log(subtract(5, 2)); // output: 3
// console.log(utility.add(2, 3)); output: 5;
// console.log(utility.subtract(5, 2)); output: 3;
```
In the above example, the add and subtract functions from the utils.mjs module are
imported into the app.mjs file using destructuring and then invoked with arguments 2,
3 and 5, 2 respectively. This would output 5 and 3 to the console.

Note: You must use the .mjs extension for ES6 module files

## Types of Modules
There are three main types of modules in Node.js:
1. Core modules: These are built-in modules in Node.js that provide basic
functionality for tasks like file I/O, networking, and more. They can be
imported and used in your application without installation or configuration.
Here are some common core modules:
    - 'fs': The 'fs' module works with the file system, like reading and writing
files.
    - 'http': The 'http' module is used for creating HTTP servers and clients.
    - 'path': The 'path' module is used for working with file paths.
2. Internal/User-defined/local modules: These are custom modules you create
for your own application. They are created as separate files in your application
and can be imported and used in other parts of your application using either
the CommonJS or ES6 module syntax.
3. Third-party modules: These are modules created by other developers and
published on package registries like npm. They can be installed using a
package manager like npm or yarn and then imported and used in your
application.

## Package Managers and NPM
### Package
A package is a collection of reusable code that can be easily shared and installed in
projects. It usually contains one or more modules, along with other files like
documentation, license information, and configuration files. Packages in Node.js are
usually distributed via the npm registry.

### Package Manager
A package manager is a tool that simplifies managing, installing, and updating
packages. In the Node.js ecosystem, the most popular package manager is NPM,
which unofficially stands for Node Package Manager.
NPM allows:
    - Installation of packages
    - Version Management
    - Managing dependencies
    - Publishing packages

Note: When we install Node.js, NPM is installed by default.

Here is the command to the npm version: ```npm -v```

### Nodemon
Nodemon is a popular utility for Node.js development that automatically restarts your
application when file changes are detected. This can save you much time during
development, as you won't have to manually restart your server each time you make
changes.

To install “Nodemon” globally, you can use the following command in the terminal:
```javascript 
npm install -g nodemon
```
This will download and install “Nodemon” globally on your system. Now, you can use
nodemon to start your application by running:
```javascript 
nodemon app.js
```
Here, app.js is the entry point of your application. Nodemon will watch for changes in
your code and automatically restart the server when any changes are detected. This
can be a huge time-saver during development.

## Understanding Package.json file
Package.json file is a crucial part of any Node.js project and contains metadata
about your project such as its name, version, description, author information,
dependencies, scripts, and other configuration options.
Dependencies listed in package.json can be installed by running the command npm
install in the project directory.

Here's an example of a package.json file for a Node.js project that includes nodemon
as a dev dependency:
```javascript
{
    "name": "my-project",
    "version": "1.0.0",
    "description": "A cool Node.js project!",
    "main": "server.js",
    "scripts": {
    "start": "node server.js",
    "go": "nodemon server.js"
    },
    "author": "Coding Ninjas",
    "dependencies": {
        "mongodb": "^5.1.0"
    },
    "devDependencies": {
    "nodemon": "^2.0.22"
    }
}
```

In this example, we have added "nodemon": "^2.0.22" as a dev dependency by
including it in the devDependencies section of the package.json file. We have also
added a new script called "go" that runs nodemon with the server.js file.

This means that during development, we can use npm run go to start the server
with nodemon, which will automatically restart the server whenever changes are
made to the code.