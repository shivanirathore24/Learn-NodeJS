# Exploring More Modules
## Debugging in Node.js
Debugging is the process of finding and fixing errors or issues in your code.
It is essential for understanding and improving the functionality of applications.
Debugging in Node.js differs from JavaScript debugging in the browser.
Now, let's look at an example. Consider the following script, products.js:
```javascript
function calculateTotal(products) {
  let total = 0;
  products.forEach((product) => {
    total += product.quantity * product.quantity;
  });
  return total;
}

const productsList = [
  { name: "Shoes", price: 50, quantity: 2 },
  { name: "Hat", price: 25, quantity: 1 },
  { name: "Gloves", price: 30, quantity: 2 },
];

// expected result = 100+25+60=185
const grandTotal = calculateTotal(productsList);
console.log("Grand Total:", grandTotal);
```

In this example, we have a small typo in the calculateTotal function.
Let's use the Node.js debugger to find the issue:
1. Run the command `node inspect products.js`
in your terminal.
2. In the debugger, set a breakpoint at line 4 using the command
`setBreakpoint(4)`
3. Continue the execution using the command `cont`
4. When the breakpoint is hit, add a watch expression for the product variable
using the command `watch('product')`
5. Also, add a watch expression for the total variable using the command
`watch('total')`
6. Now, step over the next break point using the command `cont`
7. The watch expressions will now show the values of product and total. It is
evident that there is an error in the code where product.quantity *
product.quantity is used instead of product.price *
product.quantity

### How debugging in Node.js is different than in Browser
As we mentioned earlier, debugging Node.js is different from debugging JavaScript
in the browser. Here are some key differences:
1. Environment: Node.js runs JavaScript in a server-side environment, whereas
browser typically runs in the client side.
2. Debugging tools: Node.js has its built-in debugger, while browser relies on
browser-based tools like Chrome DevTools.
3. Access to server-side resources: When debugging Node.js, you have access
to server-side resources like the file system, databases, and network
connections.
4. Despite these differences, the core principles of debugging remain the same –
finding and fixing issues in your code.
