# Task Management Application

A task management web application built with AngularJS, featuring JWT authentication, CRUD operations, and unit testing.

## Features

### Core Features
- **User Authentication** - JWT-based login system with session management
- **Task Management** - Full CRUD operations for tasks
- **Task Filtering** - Filter tasks by status (Pending, In Progress, Completed)
- **Search Functionality** - Search tasks by title or description
- **Sorting** - Sort tasks by due date, title, or status
- **Task Status** - Mark tasks as completed (completed tasks become non-editable)
- **Responsive Design** - Mobile-friendly interface
- **Statistics Dashboard** - Visual overview of task statistics

### Technical Features
- Modular AngularJS architecture
- Route-based navigation with authentication guards
- localStorage for data persistence
- Unit tests with Jasmine/Karma
- RESTful API integration
- Custom directives and filters
- Form validation with error messages

## Prerequisites

Before running this project, ensure you have:

- **Node.js** (v14.x or higher)
- **npm** (v6.x or higher)
- A modern web browser (Chrome, Firefox, Safari, or Edge)

## Installation

1. **Clone the repository**
```bash
git clone <https://github.com/Shahid138/task-manager>
cd task-management-app
```

2. **Install dependencies**
```bash
npm install
```

## Running the Application

### Development Server

Start the application using http-server:

```bash
npm start
```
The application will open automatically at `http://localhost:8080`

or

```bash
npm run dev
```
The application will open automatically at `http://127.0.0.1:3000/`

### Login Credentials

The application uses JSONPlaceholder's user data for demo authentication. You can log in with any of these usernames (password can be anything):

- Username: `Bret` (Password: any)
- Username: `Antonette` (Password: any)
- Username: `Samantha` (Password: any)
- Username: `Karianne` (Password: any)

*More usernames available from [JSONPlaceholder Users](https://jsonplaceholder.typicode.com/users)*

## Running Tests

### Run all tests

```bash
npm test
```

### Run tests once (CI mode)

```bash
npm run test:single
```

### Test Coverage

Tests achieve >70% code coverage and include:
- Authentication Service tests
- Task Service tests
- Controller tests (Login, Task List, Task Form)
- Both positive and negative test scenarios

View coverage report in `coverage/` directory after running tests.

## Project Structure

```
task-management-app/
│
├── app/
│   ├── app.js                          # Main module
│   ├── app.routes.js                   # Route configurations
│   │
│   ├── components/
│   │   ├── auth/                       # Authentication module
│   │   │   ├── auth.service.js
│   │   │   ├── login.controller.js
│   │   │   └── login.html
│   │   │
│   │   ├── tasks/                      # Tasks module
│   │   │   ├── task.service.js
│   │   │   ├── task-list.controller.js
│   │   │   ├── task-list.html
│   │   │   ├── task-form.controller.js
│   │   │   └── task-form.html
│   │   │
│   │   └── common/                     # Shared components
│   │       ├── navbar.directive.js
│   │       └── navbar.html
│   │
│   ├── directives/                     # Custom directives
│   │   └── task-item.directive.js
│   │
│   └── filters/                        # Custom filters
│       └── task-filter.js
│
├── assets/
│   ├── css/
│   │   └── style.css                   # Application styles
│   └── js/
│       └── utils.js                    # Utility functions
│
├── tests/
│   ├── unit/                           # Unit test specs
│   └── mock-data.js                    # Mock data for unit tests
│
├── index.html                          # Main HTML file
├── package.json                        # Dependencies
├── karma.conf.js                       # Karma test configuration
└── README.md                           # This file
```

## Application Pages

### 1. Login Page (`/login`)
- User authentication with username/password
- Form validation
- Error handling
- Redirect to tasks after successful login

### 2. Task List Page (`/tasks`)
- Display all tasks in a grid layout
- Statistics cards showing task counts
- Search functionality
- Filter by status
- Sort by multiple criteria
- Mark tasks as completed
- Edit/Delete actions
- Responsive design

### 3. Add/Edit Task Page (`/tasks/new`, `/tasks/edit/:id`)
- Form with fields: Title, Description, Status, Due Date
- Client-side validation
- Character counters
- Error messages
- Cancel confirmation

## Technical Implementation

### Architecture Patterns

**Module Pattern**: Separate modules for authentication, tasks, filters, and directives

**Controller-as Syntax**: Using `vm` (view model) for better code organization

**Service Layer**: Business logic separated into reusable services

**Route Guards**: Protected routes requiring authentication

**localStorage**: Data persistence for tasks and authentication tokens

### API Integration

The application integrates with [JSONPlaceholder](https://jsonplaceholder.typicode.com/):

- `/users` - User authentication (mock)
- `/todos` - Task data source

### Data Enhancement

Since JSONPlaceholder's todos API lacks some fields, the application enhances tasks with:
- Auto-generated descriptions
- Random due dates (within 30 days)
- Status field (Pending/In Progress/Completed)
- Editable flag (false for completed tasks)
- Timestamps (created, updated, completed)

## Testing Strategy

### Unit Tests

All tests are written using **Jasmine** and run with **Karma**.

**Test Coverage Includes:**

1. **Services**
   - AuthService: login, logout, token management
   - TaskService: CRUD operations, data persistence

2. **Controllers**
   - LoginController: authentication flow
   - TaskListController: task display, filtering, sorting
   - TaskFormController: form validation, submission

3. **Test Scenarios**
   - Positive flows (successful operations)
   - Negative flows (error handling)
   - Edge cases (empty data, invalid inputs)

### Running Specific Tests

```bash
# Run tests matching a pattern
karma start karma.conf.js --grep="AuthService"
```

## Best Practices Followed

1. **Code Organization**: Modular structure with clear separation of concerns
2. **Naming Conventions**: Consistent file and variable naming
3. **Comments**: Meaningful comments explaining complex logic
4. **Error Handling**: Comprehensive error handling and user feedback
5. **Validation**: Client-side validation with meaningful messages
6. **Responsive Design**: Mobile-first approach
7. **Accessibility**: Semantic HTML and proper form labels
8. **Performance**: Efficient filtering and sorting algorithms

## Assumptions & Enhancements

### Assumptions

1. **Mock Authentication**: Using JSONPlaceholder users for demo purposes
2. **Mock API**: CRUD operations simulate API calls but use localStorage
3. **Data Enhancement**: Generated descriptions and due dates for tasks
4. **Single User Session**: Application supports one user at a time

### Enhancements Made

1. **Statistics Dashboard**: Visual overview of task counts
2. **Advanced Filtering**: Multiple filter and sort options
3. **Responsive Design**: Works on all screen sizes
4. **User Feedback**: Loading states, error messages, confirmations
5. **Data Persistence**: localStorage for offline capability
6. **Comprehensive Testing**: >70% code coverage (May Fail sometimes)