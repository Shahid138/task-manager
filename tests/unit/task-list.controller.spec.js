describe('TaskListController', function() {
    var $controller, $rootScope, $location, $q, TaskService, AuthService;
    var controller, scope;
    
    beforeEach(module('taskManagementApp.tasks'));
    beforeEach(module('taskManagementApp.auth'));
    
    beforeEach(inject(function(_$controller_, _$rootScope_, _$location_, _$q_, _TaskService_, _AuthService_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $location = _$location_;
        $q = _$q_;
        TaskService = _TaskService_;
        AuthService = _AuthService_;
        
        scope = $rootScope.$new();
        
        spyOn(AuthService, 'getCurrentUser').and.returnValue(MockData.users[0]);
    }));
    
    function createController() {
        controller = $controller('TaskListController', {
            $location: $location,
            $scope: scope,
            TaskService: TaskService,
            AuthService: AuthService
        });
    }
    
    describe('Initialization', function() {
        it('should initialize with empty tasks', function() {
            spyOn(TaskService, 'getAllTasks').and.returnValue($q.resolve([]));
            
            createController();
            $rootScope.$apply();
            
            expect(controller.tasks).toEqual([]);
            expect(controller.currentUser).toBe(MockData.users[0]);
        });
        
        it('should load tasks on init', function() {
            spyOn(TaskService, 'getAllTasks').and.returnValue($q.resolve(MockData.tasks));
            
            createController();
            $rootScope.$apply();
            
            expect(controller.tasks.length).toBe(3);
            expect(controller.isLoading).toBe(false);
        });
        
        it('should handle loading error', function() {
            spyOn(TaskService, 'getAllTasks').and.returnValue($q.reject({ error: 'Failed to load' }));
            
            createController();
            $rootScope.$apply();
            
            expect(controller.error).toBe('Failed to load tasks. Please try again.');
            expect(controller.isLoading).toBe(false);
        });
    });
    
    describe('Statistics', function() {
        beforeEach(function() {
            spyOn(TaskService, 'getAllTasks').and.returnValue($q.resolve(MockData.tasks));
            createController();
            $rootScope.$apply();
        });
        
        it('should calculate correct statistics', function() {
            expect(controller.stats.total).toBe(3);
            expect(controller.stats.pending).toBe(1);
            expect(controller.stats.inProgress).toBe(1);
            expect(controller.stats.completed).toBe(1);
        });
    });
    
    describe('goToAddTask()', function() {
        beforeEach(function() {
            spyOn(TaskService, 'getAllTasks').and.returnValue($q.resolve([]));
            createController();
            $rootScope.$apply();
        });
        
        it('should navigate to add task page', function() {
            spyOn($location, 'path');
            
            controller.goToAddTask();
            
            expect($location.path).toHaveBeenCalledWith('/tasks/new');
        });
    });
    
    describe('editTask()', function() {
        beforeEach(function() {
            spyOn(TaskService, 'getAllTasks').and.returnValue($q.resolve(MockData.tasks));
            createController();
            $rootScope.$apply();
        });
        
        it('should navigate to edit page for editable task', function() {
            spyOn($location, 'path');
            spyOn(window, 'alert');
            
            controller.editTask(1);
            
            expect($location.path).toHaveBeenCalledWith('/tasks/edit/1');
            expect(window.alert).not.toHaveBeenCalled();
        });
        
        it('should show alert for non-editable task', function() {
            spyOn($location, 'path');
            spyOn(window, 'alert');
            
            controller.editTask(3);
            
            expect(window.alert).toHaveBeenCalledWith('Completed tasks cannot be edited.');
            expect($location.path).not.toHaveBeenCalled();
        });
    });
    
    describe('deleteTask()', function() {
        beforeEach(function() {
            spyOn(TaskService, 'getAllTasks').and.returnValue($q.resolve(MockData.tasks));
            createController();
            $rootScope.$apply();
        });
        
        it('should delete task after confirmation', function() {
            spyOn(window, 'confirm').and.returnValue(true);
            spyOn(TaskService, 'deleteTask').and.returnValue($q.resolve());
            
            var initialLength = controller.tasks.length;
            controller.deleteTask(1);
            $rootScope.$apply();
            
            expect(TaskService.deleteTask).toHaveBeenCalledWith(1);
            expect(controller.tasks.length).toBe(initialLength - 1);
        });
        
        it('should not delete task if cancelled', function() {
            spyOn(window, 'confirm').and.returnValue(false);
            spyOn(TaskService, 'deleteTask');
            
            controller.deleteTask(1);
            
            expect(TaskService.deleteTask).not.toHaveBeenCalled();
        });
        
        it('should show alert on delete error', function() {
            spyOn(window, 'confirm').and.returnValue(true);
            spyOn(window, 'alert');
            spyOn(TaskService, 'deleteTask').and.returnValue($q.reject({ error: 'Delete failed' }));
            
            controller.deleteTask(1);
            $rootScope.$apply();
            
            expect(window.alert).toHaveBeenCalledWith('Failed to delete task: Delete failed');
        });
    });
    
    describe('markAsCompleted()', function() {
        beforeEach(function() {
            spyOn(TaskService, 'getAllTasks').and.returnValue($q.resolve(MockData.tasks));
            createController();
            $rootScope.$apply();
        });
        
        it('should mark task as completed', function() {
            var completedTask = angular.copy(MockData.tasks[0]);
            completedTask.status = 'Completed';
            completedTask.completed = true;
            completedTask.editable = false;
            
            spyOn(TaskService, 'markAsCompleted').and.returnValue($q.resolve(completedTask));
            
            controller.markAsCompleted(1);
            $rootScope.$apply();
            
            expect(TaskService.markAsCompleted).toHaveBeenCalledWith(1);
            var task = controller.tasks.find(function(t) { return t.id === 1; });
            expect(task.status).toBe('Completed');
        });
        
        it('should handle mark as completed error', function() {
            spyOn(window, 'alert');
            spyOn(TaskService, 'markAsCompleted').and.returnValue($q.reject({ error: 'Update failed' }));
            
            controller.markAsCompleted(1);
            $rootScope.$apply();
            
            expect(window.alert).toHaveBeenCalledWith('Failed to mark task as completed: Update failed');
        });
    });
    
    describe('filterAndSortTasks()', function() {
        beforeEach(function() {
            spyOn(TaskService, 'getAllTasks').and.returnValue($q.resolve(MockData.tasks));
            createController();
            $rootScope.$apply();
        });
        
        it('should filter by search query', function() {
            controller.searchQuery = 'documentation';
            controller.filterAndSortTasks();
            
            expect(controller.filteredTasks.length).toBe(1);
            expect(controller.filteredTasks[0].id).toBe(1);
        });
        
        it('should filter by status', function() {
            controller.statusFilter = 'Completed';
            controller.filterAndSortTasks();
            
            expect(controller.filteredTasks.length).toBe(1);
            expect(controller.filteredTasks[0].status).toBe('Completed');
        });
        
        it('should sort by due date ascending', function() {
            controller.sortBy = 'dueDate';
            controller.sortOrder = 'asc';
            controller.filterAndSortTasks();
            
            var dates = controller.filteredTasks.map(function(t) { return new Date(t.dueDate); });
            for (var i = 1; i < dates.length; i++) {
                expect(dates[i] >= dates[i-1]).toBe(true);
            }
        });
        
        it('should sort by title descending', function() {
            controller.sortBy = 'title';
            controller.sortOrder = 'desc';
            controller.filterAndSortTasks();
            
            var titles = controller.filteredTasks.map(function(t) { return t.title.toLowerCase(); });
            for (var i = 1; i < titles.length; i++) {
                expect(titles[i] <= titles[i-1]).toBe(true);
            }
        });
    });
    
    describe('refreshTasks()', function() {
        beforeEach(function() {
            spyOn(TaskService, 'getAllTasks').and.returnValue($q.resolve(MockData.tasks));
            createController();
            $rootScope.$apply();
        });
        
        it('should force refresh tasks from API', function() {
            TaskService.getAllTasks.calls.reset();
            
            controller.refreshTasks();
            
            expect(TaskService.getAllTasks).toHaveBeenCalledWith(true);
        });
    });
});