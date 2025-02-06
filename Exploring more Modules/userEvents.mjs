// Import built-in 'events' module
import * as Events from "events";

// Creating a class 'UserEvents' that extends 'EventEmitter' to handle custom events
export class UserEvents extends Events.EventEmitter {
  // Method to create a post and emit an event
  createPost(content) {
    console.log("Post is created"); // Logging message when a post is created
    this.emit("postCreated"); // Emitting the 'postCreated' event after post creation
  }
}
