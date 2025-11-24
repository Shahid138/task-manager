(function () {
  "use strict";

  angular
    .module("taskManagementApp", [
      "ngRoute",
      "ngAnimate",
      "taskManagementApp.auth",
      "taskManagementApp.tasks",
      "taskManagementApp.filters",
      "taskManagementApp.directives",
    ])
    .run([
      "$rootScope",
      "$location",
      "AuthService",
      function ($rootScope, $location, AuthService) {
        $rootScope.isAuthenticated = AuthService.isAuthenticated();

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
          $rootScope.isAuthenticated = AuthService.isAuthenticated();

          if (next.$$route && next.$$route.requiresAuth) {
            if (!AuthService.isAuthenticated()) {
              event.preventDefault();
              $location.path("/login");
            }
          }

          if (next.$$route && next.$$route.originalPath === "/login") {
            if (AuthService.isAuthenticated()) {
              event.preventDefault();
              $location.path("/tasks");
            }
          }
        });

        $rootScope.$on("login:success", function () {
          $rootScope.isAuthenticated = true;
        });

        $rootScope.$on("logout", function () {
          $rootScope.isAuthenticated = false;
        });
      },
    ])
    .config([
      "$locationProvider",
      function ($locationProvider) {
        $locationProvider.hashPrefix("!");
      },
    ]);
})();
