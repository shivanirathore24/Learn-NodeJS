console.log("Script is loaded!");

/* This code will remove the contact-div container if no contact is present */
// Get the contact div and ul
const contactDiv = document.getElementById("contact-div");
const ul = contactDiv.querySelector("ul");

// Check if there are any list items inside the ul
if (ul && ul.childElementCount === 0) {
  contactDiv.style.display = "none"; // Hide the contact div
}
