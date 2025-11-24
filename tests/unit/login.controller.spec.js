describe("LoginController", function () {
  var $controller, $rootScope, $location, $q, AuthService;
  var controller, scope;

  beforeEach(module("taskManagementApp.auth"));

  beforeEach(inject(function (
    _$controller_,
    _$rootScope_,
    _$location_,
    _$q_,
    _AuthService_
  ) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $location = _$location_;
    $q = _$q_;
    AuthService = _AuthService_;

    scope = $rootScope.$new();
  }));

  function createController() {
    controller = $controller("LoginController", {
      $location: $location,
      AuthService: AuthService,
    });
  }

  describe("Initialization", function () {
    it("should initialize with empty credentials", function () {
      createController();

      expect(controller.credentials.username).toBe("");
      expect(controller.credentials.password).toBe("");
      expect(controller.error).toBe("");
      expect(controller.isLoading).toBe(false);
    });

    it("should redirect to tasks if already authenticated", function () {
      spyOn(AuthService, "isAuthenticated").and.returnValue(true);
      spyOn($location, "path");

      createController();

      expect($location.path).toHaveBeenCalledWith("/tasks");
    });

    it("should not redirect if not authenticated", function () {
      spyOn(AuthService, "isAuthenticated").and.returnValue(false);
      spyOn($location, "path");

      createController();

      expect($location.path).not.toHaveBeenCalled();
    });
  });

  describe("login()", function () {
    beforeEach(function () {
      createController();
    });

    it("should show error when credentials are empty", function () {
      controller.credentials.username = "";
      controller.credentials.password = "";

      controller.login();

      expect(controller.error).toBe("Please enter both username and password");
      expect(controller.isLoading).toBe(false);
    });

    it("should call AuthService.login with credentials", function () {
      var deferred = $q.defer();
      spyOn(AuthService, "login").and.returnValue(deferred.promise);
      spyOn($location, "path");

      controller.credentials.username = "testuser";
      controller.credentials.password = "password";

      controller.login();

      expect(controller.isLoading).toBe(true);
      expect(AuthService.login).toHaveBeenCalledWith("testuser", "password");

      deferred.resolve({ user: { username: "testuser" } });
      $rootScope.$apply();

      expect(controller.isLoading).toBe(false);
      expect($location.path).toHaveBeenCalledWith("/tasks");
    });

    it("should handle login error", function () {
      var deferred = $q.defer();
      spyOn(AuthService, "login").and.returnValue(deferred.promise);

      controller.credentials.username = "testuser";
      controller.credentials.password = "wrongpassword";

      controller.login();

      deferred.reject({ error: "Invalid credentials" });
      $rootScope.$apply();

      expect(controller.error).toBe("Invalid credentials");
      expect(controller.isLoading).toBe(false);
    });

    it("should handle generic error", function () {
      var deferred = $q.defer();
      spyOn(AuthService, "login").and.returnValue(deferred.promise);

      controller.credentials.username = "testuser";
      controller.credentials.password = "password";

      controller.login();

      deferred.reject({});
      $rootScope.$apply();

      expect(controller.error).toBe("Login failed. Please try again.");
      expect(controller.isLoading).toBe(false);
    });
  });

  describe("clearError()", function () {
    beforeEach(function () {
      createController();
    });

    it("should clear error message", function () {
      controller.error = "Some error";

      controller.clearError();

      expect(controller.error).toBe("");
    });
  });
});
