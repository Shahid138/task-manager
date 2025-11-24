(function (window) {
  "use strict";

  window.TaskAppUtils = {
    formatDate: function (dateString) {
      if (!dateString) return "";

      var date = new Date(dateString);
      var options = { year: "numeric", month: "short", day: "numeric" };
      return date.toLocaleDateString("en-US", options);
    },

    generateId: function () {
      return (
        "task_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
      );
    },

    truncate: function (str, length) {
      if (!str) return "";
      if (str.length <= length) return str;
      return str.substring(0, length) + "...";
    },

    debounce: function (func, wait) {
      var timeout;
      return function executedFunction() {
        var context = this;
        var args = arguments;
        var later = function () {
          timeout = null;
          func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    isPastDate: function (dateString) {
      if (!dateString) return false;
      var date = new Date(dateString);
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    },

    getStatusClass: function (status) {
      var statusClasses = {
        Pending: "status-pending",
        "In Progress": "status-progress",
        Completed: "status-completed",
      };
      return statusClasses[status] || "";
    },

    isValidEmail: function (email) {
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },

    deepClone: function (obj) {
      return JSON.parse(JSON.stringify(obj));
    },

    sortBy: function (array, property, order) {
      order = order || "asc";
      return array.sort(function (a, b) {
        if (order === "asc") {
          return a[property] > b[property] ? 1 : -1;
        } else {
          return a[property] < b[property] ? 1 : -1;
        }
      });
    },
  };
})(window);
