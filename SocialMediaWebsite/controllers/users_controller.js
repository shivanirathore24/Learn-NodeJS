const User = require("../models/user"); //import User Schema

/*
module.exports.profile = function (req, res) {
  if (req.cookies.user_id) {
    user.findById(req.cookies.user_id, function (err, user) {
      if (user) {
        return res.render("user_profile", {
          title: "User Profile",
          user: user,
        });
      } else {
        return res.redirect("/users/sign-in");
      }
    });
  } else {
    return res.redirect("/users/sign-in");
  }
};
*/
module.exports.profile = async function (req, res) {
  try {
    if (req.cookies.user_id) {
      const user = await User.findById(req.cookies.user_id).exec();

      if (user) {
        return res.render("user_profile", {
          title: "User Profile",
          user: user,
        });
      } else {
        return res.redirect("/users/sign-in");
      }
    } else {
      return res.redirect("/users/sign-in");
    }
  } catch (error) {
    // Handle any potential errors here
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

//render the sign up page
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

/*** sign-in and create a session for a user ***/
module.exports.createSession = async function (req, res) {
  try {
    // Find the User
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      // Handle password mismatch
      if (user.password !== req.body.password) {
        return res.redirect("back");
      }

      // Handle session creation
      res.cookie("user_id", user.id);
      return res.redirect("/users/profile");
    } else {
      // Handle user not found
      return res.redirect("back");
    }
  } catch (err) {
    console.log("Error in finding user in signing in:", err);
    // Handle other errors here
  }
};
