const User = require("../models/user"); //import User Schem

module.exports.profile = function (req, res) {
  // res.end("<h1>User Profile!</h1>");
  return res.render("user_profile", {
    title: "User Profile",
  });
};

//render the sigh up page
module.exports.signUp = function (req, res) {
  return res.render("user_sign_up", {
    title: "Social Media | Sign up",
  });
};

//render the sign in page
module.exports.signIn = function (req, res) {
  return res.render("user_sign_in", {
    title: "Social Media | Sign In",
  });
};

/*** Post the sign up data ***/
module.exports.create = async function (req, res) {
  try {
    // During sign-up, check if the password and confirm-password doen't match
    if (req.body.password !== req.body["confirm-password"]) {
      return res.redirect("back");
    }

    // Find if a user with the same email is already created/present
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      // If user is not found, create the user
      const newUser = await User.create(req.body);
      return res.redirect("/users/sign-in");
    } else {
      // If the user is already present
      return res.redirect("back");
    }
  } catch (error) {
    console.error("Error in creating user while signing up:", error);
    return res.status(500).send("Server error");
  }
};

//sign-in and create a session for a user
module.exports.createSession = function (req, res) {
  //TODO later
};
