# Zorvyn Assignment Context

## Candidate Details

- Name: Gautam
- Email: gautamprabhumit@gmail.com
- Company: Zorvyn FinTech Pvt. Ltd.
- Portal: Zorvyn Assignment Portal
- Role: Backend Developer Intern
- Type: Internship

## Assignment Title

Finance Data Processing and Access Control Backend

## Objective

To evaluate backend development skills through a practical assignment centered around API design, data modeling, business logic, and access control.

This assignment is intended to assess backend architecture thinking, application logic structuring, correct data handling, and building reliable systems that are clear, maintainable, and logically organized.

Note: If you have already built a similar backend project earlier, you may submit that project for evaluation. Clearly explain how it matches this assignment and share the repository and, if available, the deployed API or documentation link.

## Key Instructions

- No fixed project structure is required.
- Focus on correctness, clarity, and maintainability.
- Reasonable assumptions are acceptable if documented.
- Clean implementation matters more than size.
- A smaller, well-designed solution is preferred over a larger inconsistent one.

## Flexibility

You have full freedom to:

- Use any backend language, framework, or library.
- Use any database, or even an in-memory store for simplification.
- Define your own schema, service structure, and business logic flow.
- Build REST, GraphQL, or equivalent backend interfaces.
- Use mock authentication and local development setup if needed.

## Scenario

Build the backend for a finance dashboard system where different users interact with financial records based on role.

The system should support storage and management of financial entries, user roles, permissions, and summary-level analytics. The backend should be logically structured and serve data to a frontend dashboard cleanly and efficiently.

## Core Requirements

### 1. User and Role Management

Support:

- Creating and managing users
- Assigning roles to users
- Managing user status (active or inactive)
- Restricting actions based on roles

Possible roles:

- Viewer: Can only view dashboard data
- Analyst: Can view records and access insights
- Admin: Can create, update, and manage records and users

The exact role model is flexible, but role-based behavior must be clear.

### 2. Financial Records Management

Support financial records such as transactions or entries.

Example fields:

- Amount
- Type (income or expense)
- Category
- Date
- Notes or description

Required operations:

- Create records
- View records
- Update records
- Delete records
- Filter records by date, category, type, etc.

### 3. Dashboard Summary APIs

Provide APIs or backend logic for summary-level dashboard data, for example:

- Total income
- Total expenses
- Net balance
- Category-wise totals
- Recent activity
- Monthly or weekly trends

This should demonstrate aggregated backend logic, not only CRUD.

### 4. Access Control Logic

Enforce backend-level access control by role.

Examples:

- Viewer cannot create or modify records
- Analyst can read records and access summaries
- Admin has full management access

You may implement access control via middleware, guards, decorators, policy checks, or equivalents.

### 5. Validation and Error Handling

Demonstrate proper behavior for invalid input and operations:

- Input validation
- Useful error responses
- Appropriate status codes
- Protection against invalid operations

### 6. Data Persistence

Use a suitable persistence approach:

- Relational database
- Document database
- SQLite for simplicity
- Any other reasonable option

If simplified or mock storage is used, document it clearly.

## Optional Enhancements

Optional improvements include:

- Token/session authentication
- Pagination
- Search
- Soft delete
- Rate limiting
- Unit/integration tests
- API documentation

## Evaluation Criteria

1. Backend Design
2. Logical Thinking
3. Functionality
4. Code Quality
5. Database and Data Modeling
6. Validation and Reliability
7. Documentation
8. Additional Thoughtfulness

## Important Note

This assignment is designed purely for assessment and is not expected to be production-ready.

A well-reasoned and well-structured submission is valued more than unnecessary complexity. The assignment evaluates both functionality and engineering approach.

## Submission Deadline

- Date: Mon, 06 Apr, 2026
- Time: 10:00 PM

## Important Guidelines

- Submission is allowed only once.
- All required fields must be completed.
- Submission must be original work.
- Plagiarism leads to disqualification.

## Tips for Success

Take time to understand requirements thoroughly, plan carefully, and ensure the submission reflects your best work.

## Footer

© 2026 Zorvyn FinTech Pvt. Ltd. All rights reserved.

Name: Aisha Khan
Email: aisha.khan@example.com
Password: Finance@123
Confirm Password: Finance@123
Role: VIEWER

Use seed users:

viewer@demo.com / Viewer123
analyst@demo.com / Analyst123
admin@demo.com / Admin123
