module.exports = function (grunt) {
  // Configure the tasks.
  grunt.initConfig({
    //Specify tasks.
    uglify: {
      target: {
        files: {
          // "dest/js/main.min.js": ["src/js/input1.js", "src/js/input2.js"]
          "dest/js/main.min.js": ["src/js/*.js"],
        },
      },
    },
  });

  // Load libraries.
  grunt.loadNpmTasks("grunt-contrib-uglify");

  // Setting up Tasks.
  grunt.registerTask("default", ["uglify"]);
};
