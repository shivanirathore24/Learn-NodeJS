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