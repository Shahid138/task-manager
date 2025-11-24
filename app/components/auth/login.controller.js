(function () {
  "use strict";

  angular
    .module("taskManagementApp.auth")
    .controller("LoginController", [
      "$location",
      "AuthService",
      LoginController,
    ]);

  function LoginController($location, AuthService) {
    var vm = this;

    vm.credentials = {
      username: "",
      password: "",
    };
    vm.error = "";
    vm.isLoading = false;
    vm.showHint = true;

    vm.login = login;
    vm.clearError = clearError;

    init();

    function init() {
      if (AuthService.isAuthenticated()) {
        $location.path("/tasks");
      }
    }

    function login() {
      vm.error = "";
      vm.isLoading = true;

      if (!vm.credentials.username || !vm.credentials.password) {
        vm.error = "Please enter both username and password";
        vm.isLoading = false;
        return;
      }

      AuthService.login(vm.credentials.username, vm.credentials.password)
        .then(function (response) {
          console.log("Login successful for user:", response.user.username);
          $location.path("/tasks");
        })
        .catch(function (error) {
          vm.error = error.error || "Login failed. Please try again.";
          console.error("Login error:", error);
        })
        .finally(function () {
          vm.isLoading = false;
        });
    }

    function clearError() {
      vm.error = "";
    }
  }
})();
