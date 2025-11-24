describe('TaskService', function() {
    var TaskService, $httpBackend, $rootScope, AuthService;
    var API_URL = 'https://jsonplaceholder.typicode.com/todos';
    
    beforeEach(module('taskManagementApp.tasks'));
    beforeEach(module('taskManagementApp.auth'));
    
    beforeEach(inject(function(_TaskService_, _$httpBackend_, _$rootScope_, _AuthService_) {
        TaskService = _TaskService_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        AuthService = _AuthService_;
        
        localStorage.clear();

        spyOn(AuthService, 'getCurrentUser').and.returnValue(MockData.users[0]);
    }));
    
    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        localStorage.clear();
    });
    
    describe('getAllTasks()', function() {
        it('should fetch and enhance tasks from API', function() {
            var mockApiTasks = [
                { id: 1, userId: 1, title: 'Task 1', completed: false },
                { id: 2, userId: 1, title: 'Task 2', completed: true }
            ];
            
            $httpBackend.expectGET(API_URL + '?userId=1')
                .respond(200, mockApiTasks);
            
            var tasks;
            TaskService.getAllTasks().then(function(data) {
                tasks = data;
            });
            
            $httpBackend.flush();
            
            expect(tasks).toBeDefined();
            expect(tasks.length).toBe(2);
            expect(tasks[0].description).toBeDefined();
            expect(tasks[0].dueDate).toBeDefined();
            expect(tasks[0].status).toBeDefined();
        });
        
        it('should return cached tasks on subsequent calls', function() {
            var mockApiTasks = [
                { id: 1, userId: 1, title: 'Task 1', completed: false }
            ];
            
            $httpBackend.expectGET(API_URL + '?userId=1')
                .respond(200, mockApiTasks);
            
            TaskService.getAllTasks();
            $httpBackend.flush();

            var tasks;
            TaskService.getAllTasks().then(function(data) {
                tasks = data;
            });
            
            $rootScope.$apply();
            
            expect(tasks).toBeDefined();
            expect(tasks.length).toBe(1);
        });
        
        it('should force refresh when requested', function() {
            var mockApiTasks = [
                { id: 1, userId: 1, title: 'Task 1', completed: false }
            ];

            $httpBackend.expectGET(API_URL + '?userId=1')
                .respond(200, mockApiTasks);
            TaskService.getAllTasks();
            $httpBackend.flush();
       
            $httpBackend.expectGET(API_URL + '?userId=1')
                .respond(200, mockApiTasks);
            TaskService.getAllTasks(true);
            $httpBackend.flush();
        });
        
        it('should handle API errors', function() {
            $httpBackend.expectGET(API_URL + '?userId=1')
                .respond(500, 'Server Error');
            
            var error;
            TaskService.getAllTasks().catch(function(err) {
                error = err;
            });
            
            $httpBackend.flush();
            
            expect(error).toBeDefined();
        });
    });
    
    describe('getTaskById()', function() {
        beforeEach(function() {
            localStorage.setItem('taskapp_tasks', JSON.stringify(MockData.tasks));
        });
        
        it('should return task with matching ID', function() {
            var task;
            TaskService.getTaskById(1).then(function(data) {
                task = data;
            });
            
            $rootScope.$apply();
            
            expect(task).toBeDefined();
            expect(task.id).toBe(1);
        });
        
        it('should reject when task not found', function() {
            var error;
            TaskService.getTaskById(999).catch(function(err) {
                error = err;
            });
            
            $rootScope.$apply();
            
            expect(error).toBeDefined();
            expect(error.error).toBe('Task not found');
        });
    });
    
    describe('createTask()', function() {
        it('should create a new task', function() {
            var taskData = MockData.newTaskData;
            
            var newTask;
            TaskService.createTask(taskData).then(function(data) {
                newTask = data;
            });
            
            $rootScope.$apply();
            
            expect(newTask).toBeDefined();
            expect(newTask.title).toBe(taskData.title);
            expect(newTask.id).toBeDefined();
            expect(newTask.userId).toBe(1);
            expect(newTask.editable).toBe(true);
        });
        
        it('should mark completed tasks as non-editable', function() {
            var taskData = angular.copy(MockData.newTaskData);
            taskData.status = 'Completed';
            
            var newTask;
            TaskService.createTask(taskData).then(function(data) {
                newTask = data;
            });
            
            $rootScope.$apply();
            
            expect(newTask.editable).toBe(false);
            expect(newTask.completed).toBe(true);
        });
    });
    
    describe('updateTask()', function() {
        beforeEach(function() {
            localStorage.setItem('taskapp_tasks', JSON.stringify(MockData.tasks));
        });
        
        it('should update an editable task', function() {
            var updatedData = {
                title: 'Updated title',
                description: 'Updated description',
                status: 'In Progress',
                dueDate: '2025-12-31'
            };
            
            var result;
            TaskService.updateTask(1, updatedData).then(function(data) {
                result = data;
            });
            
            $rootScope.$apply();
            
            expect(result).toBeDefined();
            expect(result.title).toBe(updatedData.title);
            expect(result.updatedAt).toBeDefined();
        });
        
        it('should reject updating non-editable task', function() {
            var error;
            TaskService.updateTask(3, MockData.newTaskData).catch(function(err) {
                error = err;
            });
            
            $rootScope.$apply();
            
            expect(error).toBeDefined();
            expect(error.error).toBe('Completed tasks cannot be edited');
        });
        
        it('should reject updating non-existent task', function() {
            var error;
            TaskService.updateTask(999, MockData.newTaskData).catch(function(err) {
                error = err;
            });
            
            $rootScope.$apply();
            
            expect(error).toBeDefined();
            expect(error.error).toBe('Task not found');
        });
    });
    
    describe('deleteTask()', function() {
        beforeEach(function() {
            localStorage.setItem('taskapp_tasks', JSON.stringify(MockData.tasks));
        });
        
        it('should delete an existing task', function() {
            var result;
            TaskService.deleteTask(1).then(function() {
                result = true;
            });
            
            $rootScope.$apply();
            
            expect(result).toBe(true);
        });
        
        it('should reject deleting non-existent task', function() {
            var error;
            TaskService.deleteTask(999).catch(function(err) {
                error = err;
            });
            
            $rootScope.$apply();
            
            expect(error).toBeDefined();
            expect(error.error).toBe('Task not found');
        });
    });
    
    describe('markAsCompleted()', function() {
        beforeEach(function() {
            localStorage.setItem('taskapp_tasks', JSON.stringify(MockData.tasks));
        });
        
        it('should mark task as completed', function() {
            var result;
            TaskService.markAsCompleted(1).then(function(data) {
                result = data;
            });
            
            $rootScope.$apply();
            
            expect(result).toBeDefined();
            expect(result.status).toBe('Completed');
            expect(result.completed).toBe(true);
            expect(result.editable).toBe(false);
            expect(result.completedAt).toBeDefined();
        });
    });
    
    describe('generateDummyDescription()', function() {
        it('should generate description', function() {
            var description = TaskService.generateDummyDescription('Test task');
            
            expect(description).toBeDefined();
            expect(typeof description).toBe('string');
            expect(description.length).toBeGreaterThan(0);
        });
    });
    
    describe('generateRandomDate()', function() {
        it('should generate a valid future date', function() {
            var date = TaskService.generateRandomDate();
            
            expect(date).toBeDefined();
            expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
            
            var dateObj = new Date(date);
            expect(dateObj instanceof Date).toBe(true);
            expect(isNaN(dateObj.getTime())).toBe(false);
        });
    });
});