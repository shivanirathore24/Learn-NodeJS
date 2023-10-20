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

//get the sign up data
module.exports.create = function (req, res) {
  //TODO later
};

//sign-in and create a session for a user
module.exports.createSession = function (req, res) {
  //TODO later
};
