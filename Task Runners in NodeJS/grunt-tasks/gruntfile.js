module.exports = function (grunt) {
  // Task configuration
  grunt.initConfig({

    // Minify JS files
    uglify: {
      target: {
        files: {
          "dest/js/main.min.js": ["src/js/*.js"],
        },
      },
    },

    // Minify CSS files
    cssmin: {
      target: {
        files: [
          {
            expand: true,
            cwd: "src/css",
            src: ["*css", "!*.min.css"],
            dest: "dest/css",
            ext: ".min.css",
          },
        ],
      },
    },
  });

  // Load plugins
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-cssmin");

  // Default tasks
  grunt.registerTask("default", ["uglify", "cssmin"]);
};
