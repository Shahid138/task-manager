(function () {
  "use strict";

  angular
    .module("taskManagementApp.directives", [])
    .directive("taskItem", function () {
      return {
        restrict: "E",
        scope: {
          task: "=",
          onEdit: "&",
          onDelete: "&",
          onComplete: "&",
        },
        template: `
                    <div class="task-item" ng-class="{'completed': task.completed}">
                        <div class="task-item-header">
                            <span class="status-indicator" ng-class="{
                                'status-pending': task.status === 'Pending',
                                'status-progress': task.status === 'In Progress',
                                'status-completed': task.status === 'Completed'
                            }"></span>
                            <h4>{{ task.title }}</h4>
                        </div>
                        <p class="task-item-description">{{ task.description }}</p>
                        <div class="task-item-footer">
                            <span class="due-date"> {{ task.dueDate | date:'short' }}</span>
                            <div class="task-item-actions">
                                <button ng-if="!task.completed" 
                                        ng-click="onComplete({taskId: task.id})"
                                        class="btn-icon" 
                                        title="Mark as complete">
                                    ✓
                                </button>
                                <button ng-if="task.editable" 
                                        ng-click="onEdit({taskId: task.id})"
                                        class="btn-icon" 
                                        title="Edit">
                                    ✎
                                </button>
                                <button ng-click="onDelete({taskId: task.id})"
                                        class="btn-icon btn-danger" 
                                        title="Delete">
                                    🗑
                                </button>
                            </div>
                        </div>
                    </div>
                `,
        link: function (scope, element, attrs) {
          element.addClass("fade-in");

          if (attrs.draggable) {
            element.attr("draggable", "true");

            element.on("dragstart", function (e) {
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.setData("text/html", this.innerHTML);
              element.addClass("dragging");
            });

            element.on("dragend", function (e) {
              element.removeClass("dragging");
            });
          }
        },
      };
    });
})();
