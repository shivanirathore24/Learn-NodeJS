# Getting Started with NodeJS
## Introduction to Node.js
### What is Node.js?
1. Node.js is an open-source, cross-platform JavaScript runtime.
2. It runs on Chrome's V8 JavaScript engine.
3. Node.js enables server-side JavaScript programming.
4. Node.js helps create scalable and high-performance web applications.

Note: Node.js is neither a library nor a framework.

### Why was Node.js created?
1. Node.js was created to overcome the limitations of existing server-side
technologies, such as Apache and PHP, which had issues handling
multiple simultaneous connections.
2. Node.js was a better solution, especially for JavaScript developers.

### How was Node.js created?
Node.js is a server-side runtime for JavaScript created by Ryan Dahl in 2009. His
goal was to develop a fast and efficient platform that could handle the demands of
modern web applications. He used Google's V8 JavaScript engine for its high
performance and paired it with an event-driven, non-blocking I/O model to create a
potent and effective server-side runtime for JavaScript.

### Advantages of using an event-driven, non-blocking I/O model
The main advantage of using an event-driven, non-blocking I/O model is that it
allows for better performance and resource utilization, especially when handling
multiple connections simultaneously.

## Why Is Node.js Popular?
1. High-Performance
2. Role of javascript
3. Lightweight
4. Works well with data-intensive applications

## Runtimes
A runtime is an environment that allows a programming language to execute code. It
provides the necessary resources and tools for a language to interact with the
operating system and hardware. Regarding JavaScript, the browser serves as the
runtime environment, and NodeJS works as runtime on the server.

### What do Runtimes do?
1. Complies or Interprets
2. Memory Management
3. Handles Input/Output Operations
4. Garbage Collection

### Different Browser Runtimes for JavaScript
There are several browser runtimes ( Javascript engine ) for JavaScript, such as V8
for Google Chrome, SpiderMonkey for Mozilla Firefox, Chakra for Microsoft Edge,
and JavaScriptCore for Apple Safari. Each of these engines has its way of
implementing and optimizing JavaScript.

## Setting up Node
### Steps to Install Node.js
1. Go to nodejs.org, the official Node.js website. [Link](https://nodejs.org/en)
2. Choose between the LTS (Long Term Support) or the Current version of
Node.js.
3. It is recommended to select the LTS version for better stability, especially for
beginners.
4. Download the LTS installer that matches your operating system.
5. Follow the installation steps.
6. After the installation process, Node.js will be installed and ready to use.
7. To check the Node.js installation, open the terminal/command prompt.
8. Type `node -v` and press enter.
9. The installed version will be displayed.

### Creating and Running the "Hello World" Node.js Program
1. Open a text editor and create a new file named "hello-world.js"
2. Type the following code into the file:
console.log("Hello, World!");
3. Save the file with the .js extension.
4. Open the terminal/command prompt and navigate to the directory where the
file is saved.
5. Type node hello-world.js and press enter.
6. The program will execute, and the output "Hello, World!" will be displayed in
the terminal/command prompt.

## Blocking and Non-Blocking Code
***Blocking code***, or synchronous code, is code that stops the execution of your
program until a task is completed. This can cause your application to become
unresponsive, especially when dealing with tasks that take significant time, like
calculations or loops.
Here's an example of blocking code:

```javascript
for (let i = 0; i < 1000000000; i++) {
  // This code illustrates a time-consuming task and does not perform any //
  // practical action.
}
console.log('Finished loop.')
```

The code is blocking because it contains a long-running synchronous task.
The program cannot perform other tasks during the execution of the loop, which may
cause it to appear frozen or unresponsive to the user.

***Non-Blocking*** or asynchronous code enables a program to continue execution while
waiting for a task to complete. This is done using callbacks, promises, or async/await
syntax in JavaScript.
Here's an example of non-blocking code:
```javascript
console.log('Starting timer')
setTimeout(() => {
    console.log('Timer finished.')
}, 5000)
console.log('Finished timer.')
```
In this example, the setTimeout function doesn't block the execution. Instead, it takes
a callback function that gets executed after a specified delay.

