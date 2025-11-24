(function () {
  "use strict";

  angular.module("taskManagementApp").directive("navbarComponent", [
    "AuthService",
    "$location",
    function (AuthService, $location) {
      return {
        restrict: "E",
        templateUrl: "app/components/common/navbar.html",
        link: function (scope) {
          scope.currentUser = AuthService.getCurrentUser();
          scope.currentPath = $location.path();

          scope.$on("$routeChangeSuccess", function () {
            scope.currentPath = $location.path();
          });

          scope.logout = function () {
            if (confirm("Are you sure you want to logout?")) {
              AuthService.logout();
              $location.path("/login");
            }
          };

          scope.isActive = function (path) {
            return scope.currentPath.indexOf(path) === 0;
          };
        },
      };
    },
  ]);
})();
