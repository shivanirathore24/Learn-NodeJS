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
