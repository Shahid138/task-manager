describe('TaskFormController', function() {
    var $controller, $rootScope, $location, $q, TaskService;
    var controller;
    
    beforeEach(module('taskManagementApp.tasks'));
    
    beforeEach(inject(function(_$controller_, _$rootScope_, _$location_, _$q_, _TaskService_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $location = _$location_;
        $q = _$q_;
        TaskService = _TaskService_;
    }));
    
    function createController(task) {
        controller = $controller('TaskFormController', {
            $location: $location,
            $routeParams: {},
            TaskService: TaskService,
            task: task || null
        });
    }
    
    describe('Initialization - Create Mode', function() {
        beforeEach(function() {
            createController(null);
        });
        
        it('should initialize in create mode', function() {
            expect(controller.isEditMode).toBe(false);
            expect(controller.task.title).toBe('');
            expect(controller.task.description).toBe('');
            expect(controller.task.status).toBe('Pending');
        });
        
        it('should set default due date to tomorrow', function() {
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            var tomorrowStr = tomorrow.toISOString().split('T')[0];
            
            expect(controller.task.dueDate).toBe(tomorrowStr);
        });
    });
    
    describe('Initialization - Edit Mode', function() {
        it('should initialize with existing task data', function() {
            var task = MockData.tasks[0];
            createController(task);
            
            expect(controller.isEditMode).toBe(true);
            expect(controller.task.title).toBe(task.title);
            expect(controller.task.description).toBe(task.description);
        });
        
        it('should show error for non-editable task', function() {
            var task = MockData.tasks[2];
            createController(task);
            
            expect(controller.error).toBe('This task is completed and cannot be edited.');
        });
    });
    
    describe('submitForm() - Create', function() {
        beforeEach(function() {
            createController(null);
        });
        
        it('should create task with valid data', function() {
            spyOn(TaskService, 'createTask').and.returnValue($q.resolve(MockData.newTaskData));
            spyOn($location, 'path');
            
            controller.task = MockData.newTaskData;
            controller.submitForm(true);
            $rootScope.$apply();
            
            expect(TaskService.createTask).toHaveBeenCalledWith(controller.task);
            expect($location.path).toHaveBeenCalledWith('/tasks');
        });
        
        it('should show error for invalid form', function() {
            controller.submitForm(false);
            
            expect(controller.error).toBe('Please fix the validation errors before submitting.');
            expect(controller.isLoading).toBe(false);
        });
        
        it('should handle creation error', function() {
            spyOn(TaskService, 'createTask').and.returnValue($q.reject({ error: 'Creation failed' }));
            
            controller.task = MockData.newTaskData;
            controller.submitForm(true);
            $rootScope.$apply();
            
            expect(controller.error).toBe('Creation failed');
            expect(controller.isLoading).toBe(false);
        });
    });
    
    describe('submitForm() - Update', function() {
        beforeEach(function() {
            createController(MockData.tasks[0]);
        });
        
        it('should update task with valid data', function() {
            spyOn(TaskService, 'updateTask').and.returnValue($q.resolve(controller.task));
            spyOn($location, 'path');
            
            controller.submitForm(true);
            $rootScope.$apply();
            
            expect(TaskService.updateTask).toHaveBeenCalledWith(controller.task.id, controller.task);
            expect($location.path).toHaveBeenCalledWith('/tasks');
        });
        
        it('should not allow updating non-editable task', function() {
            controller.task.editable = false;
            
            controller.submitForm(true);
            
            expect(controller.error).toBe('Completed tasks cannot be edited.');
        });
        
        it('should handle update error', function() {
            spyOn(TaskService, 'updateTask').and.returnValue($q.reject({ error: 'Update failed' }));
            
            controller.submitForm(true);
            $rootScope.$apply();
            
            expect(controller.error).toBe('Update failed');
        });
    });
    
    describe('cancel()', function() {
        beforeEach(function() {
            createController(null);
        });
        
        it('should navigate back after confirmation', function() {
            spyOn(window, 'confirm').and.returnValue(true);
            spyOn($location, 'path');
            
            controller.cancel();
            
            expect($location.path).toHaveBeenCalledWith('/tasks');
        });
        
        it('should not navigate if cancelled', function() {
            spyOn(window, 'confirm').and.returnValue(false);
            spyOn($location, 'path');
            
            controller.cancel();
            
            expect($location.path).not.toHaveBeenCalled();
        });
    });
    
    describe('validateField()', function() {
        beforeEach(function() {
            createController(null);
        });
        
        it('should validate title field', function() {
            controller.task.title = '';
            var isValid = controller.validateField('title');
            expect(isValid).toBe(false);
            expect(controller.validationErrors.title).toBe('Title is required');
            
            controller.task.title = 'ab';
            isValid = controller.validateField('title');
            expect(isValid).toBe(false);
            expect(controller.validationErrors.title).toBe('Title must be at least 3 characters long');
            
            controller.task.title = 'Valid Title';
            isValid = controller.validateField('title');
            expect(isValid).toBe(true);
            expect(controller.validationErrors.title).toBeNull();
        });
        
        it('should validate description field', function() {
            controller.task.description = '';
            var isValid = controller.validateField('description');
            expect(isValid).toBe(false);
            expect(controller.validationErrors.description).toBe('Description is required');
            
            controller.task.description = 'Short';
            isValid = controller.validateField('description');
            expect(isValid).toBe(false);
            expect(controller.validationErrors.description).toBe('Description must be at least 10 characters long');
            
            controller.task.description = 'Valid description with enough characters';
            isValid = controller.validateField('description');
            expect(isValid).toBe(true);
            expect(controller.validationErrors.description).toBeNull();
        });
        
        it('should validate dueDate field', function() {
            controller.task.dueDate = '';
            var isValid = controller.validateField('dueDate');
            expect(isValid).toBe(false);
            expect(controller.validationErrors.dueDate).toBe('Due date is required');
            
            // Past date (only for create mode)
            var yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            controller.task.dueDate = yesterday.toISOString().split('T')[0];
            isValid = controller.validateField('dueDate');
            expect(isValid).toBe(false);
            expect(controller.validationErrors.dueDate).toBe('Due date cannot be in the past');
            
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            controller.task.dueDate = tomorrow.toISOString().split('T')[0];
            isValid = controller.validateField('dueDate');
            expect(isValid).toBe(true);
            expect(controller.validationErrors.dueDate).toBeNull();
        });
        
        it('should validate status field', function() {
            controller.task.status = '';
            var isValid = controller.validateField('status');
            expect(isValid).toBe(false);
            expect(controller.validationErrors.status).toBe('Status is required');
            
            controller.task.status = 'Pending';
            isValid = controller.validateField('status');
            expect(isValid).toBe(true);
            expect(controller.validationErrors.status).toBeNull();
        });
    });
    
    describe('clearError()', function() {
        beforeEach(function() {
            createController(null);
        });
        
        it('should clear error message', function() {
            controller.error = 'Some error';
            
            controller.clearError();
            
            expect(controller.error).toBeNull();
        });
    });
});