const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

//authentication using passport- passport using LocalStrategy to find User who Signed-in
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async function (email, password, done) {
      try {
        const user = await User.findOne({ email: email });

        if (!user || user.password != password) {
          console.log("Invalid Username/Password");
          return done(null, false); // Authentication failed
        }

        return done(null, user); // Authentication passed, return the user
      } catch (err) {
        console.log("Error in finding user --> Passport");
        return done(err);
      }
    }
  )
);

//serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
  done(null, user.id); //id is set in encrypted format in the cookie
});

//deserializing the user from the key in the cookies
passport.deserializeUser(async function (id, done) {
    try {
      const user = await User.findById(id);
      
      if (!user) {
        console.log("User not found");
        return done(null, false);
      }
  
      return done(null, user);
    } catch (err) {
      console.log("Error in finding user --> Passport");
      return done(err);
    }
  });
  

module.exports = passport;

/*
Authenticated the user --> Serialize the user (when user signed-in) we find id sends it to cookie --> 
then cookie is sent to the browser --> browser makes request --> we need to deserialize it & find the user again.
*/
