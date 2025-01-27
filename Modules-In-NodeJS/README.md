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