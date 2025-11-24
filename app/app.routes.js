(function () {
  "use strict";

  angular.module("taskManagementApp").config([
    "$routeProvider",
    function ($routeProvider) {
      $routeProvider

        .when("/login", {
          templateUrl: "app/components/auth/login.html",
          controller: "LoginController",
          controllerAs: "vm",
        })

        .when("/tasks", {
          templateUrl: "app/components/tasks/task-list.html",
          controller: "TaskListController",
          controllerAs: "vm",
          requiresAuth: true,
        })

        .when("/tasks/new", {
          templateUrl: "app/components/tasks/task-form.html",
          controller: "TaskFormController",
          controllerAs: "vm",
          requiresAuth: true,
          resolve: {
            task: function () {
              return null;
            },
          },
        })

        .when("/tasks/edit/:id", {
          templateUrl: "app/components/tasks/task-form.html",
          controller: "TaskFormController",
          controllerAs: "vm",
          requiresAuth: true,
          resolve: {
            task: [
              "$route",
              "TaskService",
              function ($route, TaskService) {
                var taskId = $route.current.params.id;
                return TaskService.getTaskById(taskId);
              },
            ],
          },
        })
        .otherwise({
          redirectTo: "/login",
        });
    },
  ]);
})();
