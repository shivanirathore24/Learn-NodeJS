import { UserEvents } from "./userEvents.mjs";

// Creating an instance of the UserEvents class
const userEvent = new UserEvents();

//Save the post data to the database,
// triggered when a new post is created.
function saveToDatabase() {
  console.log("Saving post to database");
}

//Send notifications after a post is created,
// ensures users are notified about new posts.
function sendNotifications() {
  console.log("Sending Notifications");
}

//Update the timeline after a new post,helps in
// reflecting the latest post in the user's feed.
function updateTimeline() {
  console.log("Updating timeline");
}

// Adding event listeners for the 'postCreated' event
// These functions will execute when a new post is created.
userEvent.addListener("postCreated", saveToDatabase);
userEvent.addListener("postCreated", sendNotifications);
userEvent.addListener("postCreated", updateTimeline);

// Creating a new post, which will trigger the 'postCreated' event
userEvent.createPost("This is my first post");
