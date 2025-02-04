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

## Debugging in VS Code
We have discussed debugging Node.js applications using the built-in Node.js
debugger. Now we'll explore debugging Node.js applications using Visual Studio
Code (VSCode), a powerful code editor.

Debugging Process in VS Code
To debug Node.js applications in VS Code:
1. Open the products.js file in VS Code.
2. Go to the Run and Debug panel or press Ctrl+Shift+D and click "create a
launch.json file".
![launch.json file](./images/launch_file.png)
3. Select "Node.js" from the dropdown to create a basic configuration for
debugging Node.js applications
![Select Debugger](./images/select_debugger.png)
4. Set a breakpoint at line 4 by clicking on the left side of the line number.
![Set Breakpoint](./images/set_breakpoint.png)
5. Click the green "Launch Program" button or press F5 to start the debugger.
![Launch Program](./images/launch_program.png)
6. Add the product and total variables to the watch panel to monitor their values.
![Watch Panel](./images/watch_panel.png)
7. The debugger will pause at the breakpoint, allowing you to inspect variables,
step through code, and observe the call stack.

VS Code offers several debugger options to control the debugging
process:
![Debugger Options](./images/debugger_options.png)

1. Continue: This option allows the debugger to continue running the code until
the next breakpoint or the end of the program is reached.
2. Step Over: With this option, the debugger moves to the next line of code,
skipping over function calls. It is useful for quickly moving through code
without diving into function details.
3.  Step Into: This option allows the debugger to step into the next function call,
enabling you to examine the details of the function being called.
4. Step Out: If the debugger is currently inside a function, the Step Out option
will cause it to exit the current function and return to the calling code.
5. Restart: This option restarts the debugging process from the beginning,
allowing you to re-run the code and analyze it again.
6. Stop: This option terminates the debugging session and exits the debugger
