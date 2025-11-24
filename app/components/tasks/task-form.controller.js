(function () {
  "use strict";

  angular
    .module("taskManagementApp.tasks")
    .controller("TaskFormController", [
      "$location",
      "$routeParams",
      "TaskService",
      "task",
      TaskFormController,
    ]);

  function TaskFormController($location, $routeParams, TaskService, task) {
    var vm = this;

    vm.task = {
      title: "",
      description: "",
      status: "Pending",
      dueDate: "",
    };
    vm.isEditMode = false;
    vm.isLoading = false;
    vm.error = null;
    vm.validationErrors = {};

    vm.statusOptions = ["Pending", "In Progress", "Completed"];

    vm.submitForm = submitForm;
    vm.cancel = cancel;
    vm.validateField = validateField;
    vm.clearError = clearError;

    init();

    function init() {
      if (task) {
        vm.isEditMode = true;
        vm.task = angular.copy(task);

        if (!vm.task.editable) {
          vm.error = "This task is completed and cannot be edited.";
        }
      } else {
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        vm.task.dueDate = tomorrow.toISOString().split("T")[0];
      }
    }

    function submitForm(isValid) {
      vm.error = null;
      vm.validationErrors = {};

      if (!isValid || !validateAllFields()) {
        vm.error = "Please fix the validation errors before submitting.";
        return;
      }

      if (vm.isEditMode && !vm.task.editable) {
        vm.error = "Completed tasks cannot be edited.";
        return;
      }

      vm.isLoading = true;

      if (vm.isEditMode) {
        TaskService.updateTask(vm.task.id, vm.task)
          .then(function (updatedTask) {
            console.log("Task updated successfully:", updatedTask);
            $location.path("/tasks");
          })
          .catch(function (error) {
            vm.error =
              error.error || "Failed to update task. Please try again.";
            vm.isLoading = false;
          });
      } else {
        TaskService.createTask(vm.task)
          .then(function (newTask) {
            console.log("Task created successfully:", newTask);
            $location.path("/tasks");
          })
          .catch(function (error) {
            vm.error =
              error.error || "Failed to create task. Please try again.";
            vm.isLoading = false;
          });
      }
    }

    function cancel() {
      if (
        confirm(
          "Are you sure you want to cancel? Any unsaved changes will be lost."
        )
      ) {
        $location.path("/tasks");
      }
    }

    function validateField(fieldName) {
      vm.validationErrors[fieldName] = null;

      switch (fieldName) {
        case "title":
          if (!vm.task.title || vm.task.title.trim().length === 0) {
            vm.validationErrors.title = "Title is required";
          } else if (vm.task.title.length < 3) {
            vm.validationErrors.title =
              "Title must be at least 3 characters long";
          } else if (vm.task.title.length > 100) {
            vm.validationErrors.title = "Title must not exceed 100 characters";
          }
          break;

        case "description":
          if (!vm.task.description || vm.task.description.trim().length === 0) {
            vm.validationErrors.description = "Description is required";
          } else if (vm.task.description.length < 10) {
            vm.validationErrors.description =
              "Description must be at least 10 characters long";
          } else if (vm.task.description.length > 500) {
            vm.validationErrors.description =
              "Description must not exceed 500 characters";
          }
          break;

        case "dueDate":
          if (!vm.task.dueDate) {
            vm.validationErrors.dueDate = "Due date is required";
          } else {
            var selectedDate = new Date(vm.task.dueDate);
            var today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today && !vm.isEditMode) {
              vm.validationErrors.dueDate = "Due date cannot be in the past";
            }
          }
          break;

        case "status":
          if (!vm.task.status) {
            vm.validationErrors.status = "Status is required";
          }
          break;
      }

      return !vm.validationErrors[fieldName];
    }

    function validateAllFields() {
      var isValid = true;

      ["title", "description", "dueDate", "status"].forEach(function (field) {
        if (!validateField(field)) {
          isValid = false;
        }
      });

      return isValid;
    }

    function clearError() {
      vm.error = null;
    }
  }
})();
