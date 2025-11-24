(function () {
  "use strict";

  angular
    .module("taskManagementApp.filters", [])

    .filter("taskStatus", function () {
      return function (tasks, status) {
        if (!status || status === "All") {
          return tasks;
        }

        return tasks.filter(function (task) {
          return task.status === status;
        });
      };
    })

    .filter("taskSearch", function () {
      return function (tasks, searchQuery) {
        if (!searchQuery) {
          return tasks;
        }

        var query = searchQuery.toLowerCase();

        return tasks.filter(function (task) {
          return (
            task.title.toLowerCase().indexOf(query) !== -1 ||
            task.description.toLowerCase().indexOf(query) !== -1
          );
        });
      };
    })

    .filter("priority", function () {
      return function (priority) {
        var priorities = {
          low: "🟢 Low",
          medium: "🟡 Medium",
          high: "🔴 High",
        };
        return priorities[priority] || priority;
      };
    })

    .filter("daysUntilDue", function () {
      return function (dueDate) {
        if (!dueDate) return "";

        var due = new Date(dueDate);
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);

        var diffTime = due - today;
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
          return "Overdue by " + Math.abs(diffDays) + " day(s)";
        } else if (diffDays === 0) {
          return "Due today";
        } else if (diffDays === 1) {
          return "Due tomorrow";
        } else {
          return "Due in " + diffDays + " day(s)";
        }
      };
    });
})();
