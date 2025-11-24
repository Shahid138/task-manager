(function () {
  "use strict";

  angular
    .module("taskManagementApp.tasks", [])
    .service("TaskService", ["$http", "$q", "AuthService", TaskService]);

  function TaskService($http, $q, AuthService) {
    var API_URL = "https://jsonplaceholder.typicode.com/todos";
    var STORAGE_KEY = "taskapp_tasks";
    var tasks = [];
    var initialized = false;

    this.getAllTasks = getAllTasks;
    this.getTaskById = getTaskById;
    this.createTask = createTask;
    this.updateTask = updateTask;
    this.deleteTask = deleteTask;
    this.markAsCompleted = markAsCompleted;
    this.generateDummyDescription = generateDummyDescription;
    this.generateRandomDate = generateRandomDate;

    function getAllTasks(forceRefresh) {
      var deferred = $q.defer();

      if (initialized && !forceRefresh) {
        deferred.resolve(angular.copy(tasks));
        return deferred.promise;
      }

      var storedTasks = loadFromStorage();
      if (storedTasks && storedTasks.length > 0 && !forceRefresh) {
        tasks = storedTasks;
        initialized = true;
        deferred.resolve(angular.copy(tasks));
        return deferred.promise;
      }

      var currentUser = AuthService.getCurrentUser();
      var userId = currentUser ? currentUser.id : 1;

      $http
        .get(API_URL + "?userId=" + userId)
        .then(function (response) {
          tasks = response.data.map(function (task, index) {
            return enhanceTask(task, index);
          });

          saveToStorage(tasks);
          initialized = true;

          deferred.resolve(angular.copy(tasks));
        })
        .catch(function (error) {
          console.error("Error fetching tasks:", error);
          deferred.reject(error);
        });

      return deferred.promise;
    }

    function getTaskById(taskId) {
      var deferred = $q.defer();

      getAllTasks().then(function (allTasks) {
        var task = allTasks.find(function (t) {
          return t.id == taskId;
        });

        if (task) {
          deferred.resolve(angular.copy(task));
        } else {
          deferred.reject({ error: "Task not found" });
        }
      });

      return deferred.promise;
    }

    function createTask(taskData) {
      var deferred = $q.defer();

      var newTask = {
        id: Date.now(),
        userId: AuthService.getCurrentUser().id,
        title: taskData.title,
        description: taskData.description,
        status: taskData.status || "Pending",
        dueDate: taskData.dueDate,
        completed: taskData.status === "Completed",
        createdAt: new Date().toISOString(),
        editable: taskData.status !== "Completed",
      };

      tasks.unshift(newTask);
      saveToStorage(tasks);

      deferred.resolve(angular.copy(newTask));

      return deferred.promise;
    }

    function updateTask(taskId, taskData) {
      var deferred = $q.defer();

      var taskIndex = tasks.findIndex(function (t) {
        return t.id == taskId;
      });

      if (taskIndex !== -1) {
        if (!tasks[taskIndex].editable) {
          deferred.reject({ error: "Completed tasks cannot be edited" });
          return deferred.promise;
        }

        tasks[taskIndex].title = taskData.title;
        tasks[taskIndex].description = taskData.description;
        tasks[taskIndex].status = taskData.status;
        tasks[taskIndex].dueDate = taskData.dueDate;
        tasks[taskIndex].completed = taskData.status === "Completed";
        tasks[taskIndex].editable = taskData.status !== "Completed";
        tasks[taskIndex].updatedAt = new Date().toISOString();

        saveToStorage(tasks);
        deferred.resolve(angular.copy(tasks[taskIndex]));
      } else {
        deferred.reject({ error: "Task not found" });
      }

      return deferred.promise;
    }

    function deleteTask(taskId) {
      var deferred = $q.defer();

      var taskIndex = tasks.findIndex(function (t) {
        return t.id == taskId;
      });

      if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        saveToStorage(tasks);
        deferred.resolve();
      } else {
        deferred.reject({ error: "Task not found" });
      }

      return deferred.promise;
    }

    function markAsCompleted(taskId) {
      var deferred = $q.defer();

      var taskIndex = tasks.findIndex(function (t) {
        return t.id == taskId;
      });

      if (taskIndex !== -1) {
        tasks[taskIndex].status = "Completed";
        tasks[taskIndex].completed = true;
        tasks[taskIndex].editable = false;
        tasks[taskIndex].completedAt = new Date().toISOString();

        saveToStorage(tasks);
        deferred.resolve(angular.copy(tasks[taskIndex]));
      } else {
        deferred.reject({ error: "Task not found" });
      }

      return deferred.promise;
    }

    function enhanceTask(task, index) {
      var statuses = ["Pending", "In Progress", "Completed"];
      var status = task.completed ? "Completed" : statuses[index % 2];

      return {
        id: task.id,
        userId: task.userId,
        title: task.title,
        description: generateDummyDescription(task.title),
        status: status,
        dueDate: generateRandomDate(),
        completed: task.completed,
        editable: !task.completed,
        createdAt: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
      };
    }

    function generateDummyDescription(title) {
      var descriptions = [
        "This task requires attention and should be completed as soon as possible.",
        "Please review the requirements and proceed accordingly.",
        "Follow up on this item and ensure all steps are completed.",
        "Important task that needs to be addressed in the current sprint.",
        "Coordinate with team members to complete this task efficiently.",
      ];
      return descriptions[Math.floor(Math.random() * descriptions.length)];
    }

    function generateRandomDate() {
      var today = new Date();
      var futureDate = new Date(
        today.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000
      );
      return futureDate.toISOString().split("T")[0];
    }

    function saveToStorage(tasksToSave) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksToSave));
      } catch (e) {
        console.error("Error saving to localStorage:", e);
      }
    }

    function loadFromStorage() {
      try {
        var stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
      } catch (e) {
        console.error("Error loading from localStorage:", e);
        return null;
      }
    }
  }
})();
