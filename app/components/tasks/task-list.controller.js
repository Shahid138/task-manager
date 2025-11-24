(function () {
  "use strict";

  angular
    .module("taskManagementApp.tasks")
    .controller("TaskListController", [
      "$location",
      "$scope",
      "TaskService",
      "AuthService",
      TaskListController,
    ]);

  function TaskListController($location, $scope, TaskService, AuthService) {
    var vm = this;

    vm.tasks = [];
    vm.filteredTasks = [];
    vm.isLoading = true;
    vm.error = null;
    vm.currentUser = null;

    vm.searchQuery = "";
    vm.statusFilter = "All";
    vm.sortBy = "dueDate";
    vm.sortOrder = "asc";

    vm.stats = {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
    };

    vm.loadTasks = loadTasks;
    vm.goToAddTask = goToAddTask;
    vm.editTask = editTask;
    vm.deleteTask = deleteTask;
    vm.markAsCompleted = markAsCompleted;
    vm.filterAndSortTasks = filterAndSortTasks;
    vm.refreshTasks = refreshTasks;

    init();

    function init() {
      vm.currentUser = AuthService.getCurrentUser();
      loadTasks();
    }

    function loadTasks() {
      vm.isLoading = true;
      vm.error = null;

      TaskService.getAllTasks()
        .then(function (tasks) {
          vm.tasks = tasks;
          calculateStats();
          filterAndSortTasks();
          vm.isLoading = false;
        })
        .catch(function (error) {
          vm.error = "Failed to load tasks. Please try again.";
          vm.isLoading = false;
          console.error("Error loading tasks:", error);
        });
    }

    function refreshTasks() {
      vm.isLoading = true;

      TaskService.getAllTasks(true)
        .then(function (tasks) {
          vm.tasks = tasks;
          calculateStats();
          filterAndSortTasks();
          vm.isLoading = false;
        })
        .catch(function (error) {
          vm.error = "Failed to refresh tasks.";
          vm.isLoading = false;
        });
    }

    function goToAddTask() {
      $location.path("/tasks/new");
    }

    function editTask(taskId) {
      var task = vm.tasks.find(function (t) {
        return t.id === taskId;
      });

      if (task && !task.editable) {
        alert("Completed tasks cannot be edited.");
        return;
      }

      $location.path("/tasks/edit/" + taskId);
    }

    function deleteTask(taskId) {
      if (!confirm("Are you sure you want to delete this task?")) {
        return;
      }

      TaskService.deleteTask(taskId)
        .then(function () {
          var index = vm.tasks.findIndex(function (t) {
            return t.id === taskId;
          });
          if (index !== -1) {
            vm.tasks.splice(index, 1);
          }
          calculateStats();
          filterAndSortTasks();
        })
        .catch(function (error) {
          alert("Failed to delete task: " + (error.error || "Unknown error"));
        });
    }

    function markAsCompleted(taskId) {
      TaskService.markAsCompleted(taskId)
        .then(function (updatedTask) {
          var index = vm.tasks.findIndex(function (t) {
            return t.id === taskId;
          });
          if (index !== -1) {
            vm.tasks[index] = updatedTask;
          }
          calculateStats();
          filterAndSortTasks();
        })
        .catch(function (error) {
          alert(
            "Failed to mark task as completed: " +
              (error.error || "Unknown error")
          );
        });
    }

    function filterAndSortTasks() {
      var filtered = vm.tasks;

      if (vm.searchQuery) {
        var query = vm.searchQuery.toLowerCase();
        filtered = filtered.filter(function (task) {
          return (
            task.title.toLowerCase().indexOf(query) !== -1 ||
            task.description.toLowerCase().indexOf(query) !== -1
          );
        });
      }
      if (vm.statusFilter && vm.statusFilter !== "All") {
        filtered = filtered.filter(function (task) {
          return task.status === vm.statusFilter;
        });
      }

      filtered.sort(function (a, b) {
        var aVal, bVal;

        if (vm.sortBy === "dueDate") {
          aVal = new Date(a.dueDate);
          bVal = new Date(b.dueDate);
        } else if (vm.sortBy === "title") {
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
        } else if (vm.sortBy === "status") {
          aVal = a.status;
          bVal = b.status;
        }

        if (vm.sortOrder === "asc") {
          return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        } else {
          return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        }
      });

      vm.filteredTasks = filtered;
    }

    function calculateStats() {
      vm.stats.total = vm.tasks.length;
      vm.stats.pending = vm.tasks.filter(function (t) {
        return t.status === "Pending";
      }).length;
      vm.stats.inProgress = vm.tasks.filter(function (t) {
        return t.status === "In Progress";
      }).length;
      vm.stats.completed = vm.tasks.filter(function (t) {
        return t.status === "Completed";
      }).length;
    }

    $scope.$watchGroup(
      ["vm.searchQuery", "vm.statusFilter", "vm.sortBy", "vm.sortOrder"],
      function () {
        filterAndSortTasks();
      }
    );
  }
})();
