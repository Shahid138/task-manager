module.exports = function (config) {
  config.set({
    basePath: "",

    frameworks: ["jasmine"],

    files: [
      // AngularJS libraries
      "https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js",
      "https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular-route.min.js",
      "https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular-animate.min.js",
      "https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular-mocks.js",

      // Application files
      "app/app.js",
      "app/app.routes.js",
      "app/components/auth/auth.service.js",
      "app/components/auth/login.controller.js",
      "app/components/tasks/task.service.js",
      "app/components/tasks/task-list.controller.js",
      "app/components/tasks/task-form.controller.js",
      "app/components/common/navbar.directive.js",
      "app/directives/task-item.directive.js",
      "app/filters/task-filter.js",
      "assets/js/utils.js",

      // Mock data
      "tests/mock-data.js",

      // Test files
      "tests/unit/**/*.spec.js",
    ],

    exclude: [],

    preprocessors: {
      "app/**/*.js": ["coverage"],
    },

    reporters: ["progress", "coverage"],

    coverageReporter: {
      type: "html",
      dir: "coverage/",
    },

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ["ChromeHeadless"],

    singleRun: false,

    concurrency: Infinity,
  });
};
