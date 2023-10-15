const express = require("express");
const router = express.Router(); //entry point for all the requests
const homeController = require("../controllers/home_controller");

console.log("Router loaded!");

router.get("/", homeController.home); //accessing home function from homeController
router.use("/users", require("./users"));

module.exports = router; //export,so that available in index.js file(entry file)
