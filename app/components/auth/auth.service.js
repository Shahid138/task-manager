(function () {
  "use strict";

  angular.module("taskManagementApp.auth", []).service("AuthService", [
    "$http",
    "$q",
    "$rootScope",
    function ($http, $q, $rootScope) {
      var TOKEN_KEY = "taskapp_auth_token";
      var USER_KEY = "taskapp_user_data";
      var API_URL = "https://jsonplaceholder.typicode.com";

      this.login = function (username, password) {
        var deferred = $q.defer();

        if (!username || !password) {
          deferred.reject({ error: "Username and password are required" });
          return deferred.promise;
        }

        $http
          .get(API_URL + "/users")
          .then(function (response) {
            var user = response.data.find(function (u) {
              return u.username.toLowerCase() === username.toLowerCase();
            });

            if (user) {
              var mockToken =
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
                btoa(
                  JSON.stringify({ userId: user.id, username: user.username })
                ) +
                ".mock_signature_" +
                Date.now();

              localStorage.setItem(TOKEN_KEY, mockToken);
              localStorage.setItem(USER_KEY, JSON.stringify(user));

              $rootScope.$emit("login:success", user);

              deferred.resolve({
                token: mockToken,
                user: user,
              });
            } else {
              deferred.reject({ error: "Invalid username or password" });
            }
          })
          .catch(function (error) {
            deferred.reject({ error: "Authentication service unavailable" });
          });

        return deferred.promise;
      };

      this.logout = function () {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        $rootScope.$emit("logout");
      };

      this.isAuthenticated = function () {
        var token = localStorage.getItem(TOKEN_KEY);
        return !!token;
      };

      this.getToken = function () {
        return localStorage.getItem(TOKEN_KEY);
      };

      this.getCurrentUser = function () {
        var userData = localStorage.getItem(USER_KEY);
        return userData ? JSON.parse(userData) : null;
      };

      this.getAuthHeader = function () {
        var token = this.getToken();
        return token ? { Authorization: "Bearer " + token } : {};
      };
    },
  ]);
})();
