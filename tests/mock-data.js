(function () {
  "use strict";

  window.MockData = {
    users: [
      {
        id: 1,
        name: "Leanne Graham",
        username: "Bret",
        email: "Sincere@april.biz",
      },
      {
        id: 2,
        name: "Ervin Howell",
        username: "Antonette",
        email: "Shanna@melissa.tv",
      },
    ],

    tasks: [
      {
        id: 1,
        userId: 1,
        title: "Complete project documentation",
        description: "Write comprehensive documentation for the project",
        status: "In Progress",
        dueDate: "2025-12-31",
        completed: false,
        editable: true,
        createdAt: "2025-11-01T10:00:00Z",
      },
      {
        id: 2,
        userId: 1,
        title: "Review pull requests",
        description: "Review and merge pending pull requests",
        status: "Pending",
        dueDate: "2025-11-30",
        completed: false,
        editable: true,
        createdAt: "2025-11-05T14:30:00Z",
      },
      {
        id: 3,
        userId: 1,
        title: "Setup CI/CD pipeline",
        description: "Configure automated testing and deployment",
        status: "Completed",
        dueDate: "2025-11-15",
        completed: true,
        editable: false,
        createdAt: "2025-11-01T09:00:00Z",
        completedAt: "2025-11-14T16:45:00Z",
      },
    ],

    mockToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiQnJldCJ9.mock_signature",

    newTaskData: {
      title: "New test task",
      description: "This is a test task description",
      status: "Pending",
      dueDate: "2025-12-25",
    },

    getUserByUsername: function (username) {
      return this.users.find(function (u) {
        return u.username.toLowerCase() === username.toLowerCase();
      });
    },

    getTaskById: function (taskId) {
      return this.tasks.find(function (t) {
        return t.id === taskId;
      });
    },
  };
})();
