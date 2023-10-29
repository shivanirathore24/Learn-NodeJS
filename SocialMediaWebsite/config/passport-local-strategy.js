const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

//authentication using passport- passport using LocalStrategy to find User who Signed-in
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    function (email, password, done) {
      //find the user and establish the identity
      User.findOne({ email: email }, function (err, user) {
        if (err) {
          console.log("Error in finding user --> Passport");
          return done(err);
        }

        if (!user || user.passport != password) {
          console.log("Invalid Username/ Password");
          return null, false; // error --> null , authentication -->false i.e auth failed
        }

        return done(null, user); // error--> null, authentication passed so returned User
      });
    }
  )
);

//serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
  done(null, user.id); //id is set in encrypted format in the cookie
});

//deserializing the user from the key in the cookies
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log("Error in finding user --> Passport");
      return done(err);
    }
    return done(null, user);
  });
});

module.exports = passport;

/*
Authenticated the user --> Serialize the user (when user signed-in) we find id sends it to cookie --> 
then cookie is sent to the browser --> browser makes request --> we need to deserialize it & find the user again.
*/
