describe("AuthService", function () {
  var AuthService, $httpBackend, $rootScope;
  var API_URL = "https://jsonplaceholder.typicode.com";

  beforeEach(module("taskManagementApp.auth"));

  beforeEach(inject(function (_AuthService_, _$httpBackend_, _$rootScope_) {
    AuthService = _AuthService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;

    localStorage.clear();
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    localStorage.clear();
  });

  describe("login()", function () {
    it("should login successfully with valid credentials", function () {
      var mockUsers = MockData.users;
      var username = "Bret";
      var password = "password123";

      $httpBackend.expectGET(API_URL + "/users").respond(200, mockUsers);

      var result;
      AuthService.login(username, password).then(function (response) {
        result = response;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.username).toBe(username);
      expect(AuthService.isAuthenticated()).toBe(true);
    });

    it("should reject login with invalid username", function () {
      var mockUsers = MockData.users;
      var username = "InvalidUser";
      var password = "password123";

      $httpBackend.expectGET(API_URL + "/users").respond(200, mockUsers);

      var error;
      AuthService.login(username, password).catch(function (err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.error).toBe("Invalid username or password");
      expect(AuthService.isAuthenticated()).toBe(false);
    });

    it("should reject login with empty credentials", function () {
      var error;
      AuthService.login("", "").catch(function (err) {
        error = err;
      });

      $rootScope.$apply();

      expect(error).toBeDefined();
      expect(error.error).toBe("Username and password are required");
    });

    it("should handle API failure", function () {
      $httpBackend.expectGET(API_URL + "/users").respond(500, "Server Error");

      var error;
      AuthService.login("Bret", "password").catch(function (err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.error).toBe("Authentication service unavailable");
    });
  });

  describe("logout()", function () {
    it("should clear authentication data", function () {
      localStorage.setItem("taskapp_auth_token", MockData.mockToken);
      localStorage.setItem(
        "taskapp_user_data",
        JSON.stringify(MockData.users[0])
      );

      expect(AuthService.isAuthenticated()).toBe(true);

      AuthService.logout();

      expect(AuthService.isAuthenticated()).toBe(false);
      expect(localStorage.getItem("taskapp_auth_token")).toBeNull();
      expect(localStorage.getItem("taskapp_user_data")).toBeNull();
    });

    it("should emit logout event", function () {
      var eventEmitted = false;
      $rootScope.$on("logout", function () {
        eventEmitted = true;
      });

      AuthService.logout();

      expect(eventEmitted).toBe(true);
    });
  });

  describe("isAuthenticated()", function () {
    it("should return true when token exists", function () {
      localStorage.setItem("taskapp_auth_token", MockData.mockToken);

      expect(AuthService.isAuthenticated()).toBe(true);
    });

    it("should return false when no token exists", function () {
      expect(AuthService.isAuthenticated()).toBe(false);
    });
  });

  describe("getToken()", function () {
    it("should return stored token", function () {
      localStorage.setItem("taskapp_auth_token", MockData.mockToken);

      var token = AuthService.getToken();

      expect(token).toBe(MockData.mockToken);
    });

    it("should return null when no token exists", function () {
      var token = AuthService.getToken();

      expect(token).toBeNull();
    });
  });

  describe("getCurrentUser()", function () {
    it("should return current user data", function () {
      var userData = MockData.users[0];
      localStorage.setItem("taskapp_user_data", JSON.stringify(userData));

      var user = AuthService.getCurrentUser();

      expect(user).toBeDefined();
      expect(user.username).toBe(userData.username);
    });

    it("should return null when no user data exists", function () {
      var user = AuthService.getCurrentUser();

      expect(user).toBeNull();
    });
  });

  describe("getAuthHeader()", function () {
    it("should return authorization header with token", function () {
      localStorage.setItem("taskapp_auth_token", MockData.mockToken);

      var header = AuthService.getAuthHeader();

      expect(header.Authorization).toBe("Bearer " + MockData.mockToken);
    });

    it("should return empty object when no token exists", function () {
      var header = AuthService.getAuthHeader();

      expect(Object.keys(header).length).toBe(0);
    });
  });
});
