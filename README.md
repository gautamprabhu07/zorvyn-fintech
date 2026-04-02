# Finance Data Processing and Access Control System

## Overview

Finance Data Processing and Access Control System is a full-stack implementation of a role-aware finance platform built for backend evaluation. The backend is designed around clean modular architecture, strict access control, and aggregation-driven analytics APIs. The frontend consumes these APIs with reliability-focused UX patterns such as request cancellation, retry actions, and clear error handling. Together, the project demonstrates both backend engineering depth and practical end-to-end system thinking.

## Live Features Summary

- JWT-based authentication with register and login flows
- Role-based access control with VIEWER, ANALYST, and ADMIN permissions
- Financial records CRUD with filtering, search, pagination, and soft delete
- Dashboard analytics APIs for summary, category insights, recent activity, and trends
- Auth endpoint rate limiting for abuse protection
- Seed script with realistic demo users and sample records
- Automated tests for backend integration and frontend behavior
- Frontend reliability features including loading states, retry UX, and user-facing error feedback

## Tech Stack

### Backend

- Node.js (CommonJS)
- Express 5
- MongoDB with Mongoose
- bcrypt
- jsonwebtoken
- express-rate-limit
- cors
- dotenv

### Frontend

- React 19
- Vite
- Tailwind CSS
- axios
- react-router-dom
- recharts

### Testing

- Backend: jest, supertest
- Frontend: vitest, Testing Library, jsdom

## System Architecture

### Architectural Style

The backend uses modular MVC with a service layer for analytical logic:

- Routes define endpoint contracts and compose middleware
- Middleware handles cross-cutting concerns such as auth, role checks, validation, and error handling
- Controllers orchestrate request-response flow and remain intentionally thin
- Services encapsulate reusable domain logic for dashboard aggregations
- Models define persistence rules, schema constraints, and indexes

### Request Flow

1. Client sends an HTTP request to a route
2. Route-level middleware validates auth token, user status, and role permissions
3. Validation middleware sanitizes and normalizes payloads or query parameters
4. Controller receives validated input and delegates heavy domain logic to service functions when needed
5. Mongoose model executes queries or aggregation pipelines against MongoDB
6. Controller returns a structured JSON response with clear success and error shapes
7. Global error handler standardizes failures and status codes

### Why This Structure Scales

- Separation of concerns keeps controllers simple and testable
- Service-layer analytics prevents business logic sprawl
- Middleware-centric authorization makes policy enforcement consistent across endpoints
- Modular boundaries support incremental feature expansion with low coupling
- Indexed data model improves query performance for real dashboard traffic patterns

## Role-Based Access Model

| Role    | Permissions                                        |
| ------- | -------------------------------------------------- |
| VIEWER  | Dashboard access only                              |
| ANALYST | Dashboard plus read-only record access             |
| ADMIN   | Full record management plus user status management |

Backend enforcement:

- Authorization is enforced server-side through protect and authorizeRoles middleware
- Access rules are validated before controller execution

Frontend enforcement:

- Route guards and conditional UI provide user experience alignment
- Frontend permissions improve usability, while backend remains final authority

## API Design Philosophy

- REST-style endpoint organization by domain: auth, records, dashboard, users
- Thin controllers with service delegation for analytics and complex transformations
- Query-driven filtering and pagination for flexible data retrieval
- Consistent success and error response conventions
- Explicit status codes for validation, authorization, not found, and server failures

## Data Modeling

### User Model

Design decisions:

- Unique normalized email for identity
- Hashed passwords using bcrypt pre-save hook
- Role and status enums for controlled state transitions
- Password hidden from normal query projections

### FinancialRecord Model

Design decisions:

- Explicit amount, type, category, date, note fields for financial domain clarity
- Soft-delete flag preserves history and supports reversible operations
- isDeleted-aware queries protect against accidental hard data loss
- Multi-field indexes support common access patterns used by filters and dashboard analytics

### Why Soft Delete

Soft delete preserves historical integrity, avoids accidental irreversible loss, and supports audit-friendly behavior while still excluding deleted records from normal reads.

### Why Indexing

Indexes are applied to type, category, date, and isDeleted combinations to improve performance for:

- Filtered records listing
- Date-range analytics
- Category and type-level dashboard aggregations

## Dashboard Analytics Design

Dashboard analytics are aggregation-first, not CRUD-derived in application code.

Design approach:

- Aggregation pipelines compute totals and grouped summaries inside MongoDB
- Service layer centralizes match-stage construction and validation
- Controllers remain orchestration-only, keeping analytics logic reusable and testable

Performance considerations:

- Aggregation work is pushed down to the database engine
- Indexed filters reduce scan cost for common summary queries
- Shared filter builder avoids divergent logic and keeps analytics endpoints consistent

## Validation and Error Handling

### Backend Validation

- Request body and query validation at middleware/controller boundaries
- Field normalization for type, category, amount, and date
- Defensive checks for pagination and date range correctness
- Structured error payloads with meaningful messages

### Frontend Validation

- Form-level validation for login, registration, and record mutations
- Immediate user feedback with inline errors and toast notifications

### Status Code Strategy

- 200 and 201 for successful reads and mutations
- 400 for invalid input
- 401 for missing or invalid authentication
- 403 for role or account status restrictions
- 404 for unknown resources or routes
- 409 for duplicate user registration conflicts
- 429 for auth rate limit threshold
- 500 for unhandled server failures

### Defensive Practices

- Escaped regex search input for safe query behavior
- Role checks performed before sensitive operations
- Active-status checks to block inactive accounts
- Centralized notFound and error middleware for consistent failure handling

## Reliability Features

- Auth rate limiting on register and login endpoints
- Request cancellation on frontend dashboard and records fetches to prevent stale updates
- Global error boundary to handle unexpected render crashes
- Toast notifications for success and failure visibility
- Retry controls on recoverable API failures
- Loading and empty states across critical user paths

## Setup Instructions

### Backend Setup

1. Open a terminal in the project root
2. Install dependencies:
   - npm install
3. Configure environment variables in .env:
   - PORT=5000
   - MONGO_URI=your_mongodb_connection_string
   - JWT_SECRET=your_jwt_secret
   - NODE_ENV=development
   - CORS_ORIGIN=http://localhost:5173
4. Start backend server:
   - npm run dev
5. Seed demo data:
   - npm run seed

### Frontend Setup

1. Open a second terminal
2. Move to frontend directory:
   - cd frontend
3. Install dependencies:
   - npm install
4. Configure frontend environment in frontend/.env:
   - VITE_API_BASE_URL=http://localhost:5000
5. Run frontend dev server:
   - npm run dev

## Demo Credentials

- Admin: admin@demo.com / Admin123
- Analyst: analyst@demo.com / Analyst123
- Viewer: viewer@demo.com / Viewer123

## API Documentation (Short Version)

### Auth

- POST /auth/register
- POST /auth/login

### Records

- GET /records
- GET /records/:id
- POST /records
- PATCH /records/:id
- DELETE /records/:id

### Dashboard

- GET /dashboard/summary
- GET /dashboard/category-breakdown
- GET /dashboard/recent
- GET /dashboard/trends
- Aliases: /dashboard/recent-activity and /dashboard/monthly-trends
- Alternate mount available via /api/dashboard/\*

### Users

- PATCH /api/users/:id/status

---

## Detailed API Documentation

### Authentication

#### POST /auth/register

Description:

- Registers a new user account
- Supports role assignment when provided (backend accepts VIEWER, ANALYST, ADMIN)

Request body:

- name: string, required
- email: string, required
- password: string, required, minimum length 6
- role: string, optional, one of VIEWER, ANALYST, ADMIN

Success response:

- Status: 201
- Body includes success flag, message, and created user data (without password)

Possible errors:

- 400 for missing or invalid fields
- 409 if email already exists
- 429 if auth rate limit is exceeded
- 500 for unexpected failures

#### POST /auth/login

Description:

- Authenticates user and issues JWT token

Request body:

- email: string, required
- password: string, required

Success response:

- Status: 200
- Body includes success flag, token, and user payload

Possible errors:

- 400 for missing or invalid input
- 401 for invalid credentials
- 403 for inactive user account
- 429 if auth rate limit is exceeded
- 500 for unexpected failures

### Records API

#### GET /records

Description:

- Returns paginated financial records for authorized roles
- Access: ANALYST, ADMIN

Query parameters:

- page: positive integer, default 1
- limit: positive integer, default 10
- type: INCOME or EXPENSE
- category: exact category string
- startDate: date string
- endDate: date string
- search: keyword against category and note

Success response:

- Status: 200
- Body includes:
  - success
  - count
  - totalCount
  - pagination: page, limit, totalPages
  - data: array of records

Possible errors:

- 400 for invalid pagination or filters
- 401 if unauthenticated
- 403 if role is unauthorized
- 500 for unexpected failures

#### GET /records/:id

Description:

- Returns one non-deleted record by id
- Access: ANALYST, ADMIN

Success response:

- Status: 200
- Body includes success and data object

Possible errors:

- 400 for invalid id
- 404 if record does not exist or is soft deleted
- 401 or 403 for auth/role violations

#### POST /records

Description:

- Creates a new financial record
- Access: ADMIN

Request body:

- amount: number, required, greater than 0
- type: INCOME or EXPENSE, required
- category: string, required
- date: valid date, required
- note: string, optional

Success response:

- Status: 201
- Body includes success, message, and created record

Possible errors:

- 400 validation failure
- 401 unauthenticated
- 403 unauthorized role

#### PATCH /records/:id

Description:

- Updates a non-deleted financial record
- Access: ADMIN

Request body:

- Any subset of: amount, type, category, date, note

Success response:

- Status: 200
- Body includes success, message, and updated record

Possible errors:

- 400 invalid id or invalid update payload
- 404 record not found
- 401 or 403 for auth/role violations

#### DELETE /records/:id

Description:

- Soft deletes a financial record by setting isDeleted to true
- Access: ADMIN

Success response:

- Status: 200
- Body includes success and deletion message

Possible errors:

- 400 invalid id
- 404 record not found
- 401 or 403 for auth/role violations

### Dashboard API

All dashboard endpoints require authentication and allow VIEWER, ANALYST, and ADMIN.

#### GET /dashboard/summary

Description:

- Returns top-level totals for income, expense, and net balance

Response shape:

- success
- data:
  - totalIncome
  - totalExpense
  - netBalance

#### GET /dashboard/category-breakdown

Description:

- Returns category-wise totals and income-expense split

Response shape:

- success
- count
- data: array of
  - category
  - total
  - incomeTotal
  - expenseTotal

#### GET /dashboard/recent

Description:

- Returns latest records for activity feed
- Supports limit query value 5 or 10

Response shape:

- success
- count
- data: array of
  - amount
  - category
  - type
  - date

#### GET /dashboard/trends

Description:

- Returns monthly trend points for income and expense charting

Response shape:

- success
- count
- data: array of
  - month
  - income
  - expense

Notes:

- Alias endpoints are also available:
  - /dashboard/recent-activity
  - /dashboard/monthly-trends
- Same endpoints are mounted under /api/dashboard/\* as well

### User Management

#### PATCH /api/users/:id/status

Description:

- Updates user account status
- Access: ADMIN only

Request body:

- status: ACTIVE or INACTIVE

Success response:

- Status: 200
- Body includes success, message, and updated user metadata

Possible errors:

- 400 invalid status or invalid id
- 401 unauthenticated
- 403 unauthorized role
- 404 user not found

---

## How This Project Meets Assignment Requirements

### 1. User and Role Management

Implemented through:

- User schema with role and status enums
- Registration and login APIs
- JWT identity and role propagation
- Admin-only status management endpoint

### 2. Financial Records Management

Implemented through:

- Full records API surface for create, read, update, and soft delete
- Validation middleware for create and update
- Query-based filtering by type, category, and date range
- Search and pagination support in listing endpoint

### 3. Dashboard Summary APIs

Implemented through:

- Dedicated dashboard routes and controller layer
- Service-driven aggregation for summary totals, category breakdown, recent activity, and monthly trends

### 4. Access Control Logic

Implemented through:

- Backend middleware protect and authorizeRoles for strict role enforcement
- Frontend route and UI guards to mirror allowed behaviors
- Backend remains the source of truth for security decisions

### 5. Validation and Error Handling

Implemented through:

- Input validation middleware and controller guards
- Clear status code usage and meaningful response messages
- Global notFound and error middleware for consistency
- Frontend form validation and recoverable retry UX

### 6. Data Persistence

Implemented through:

- MongoDB document persistence with Mongoose schemas
- Indexed record model for frequent filter and analytics access patterns
- Seed script for deterministic demo environment setup

### Optional Enhancements Implemented

- Token authentication with JWT
- Pagination
- Search
- Soft delete
- Rate limiting
- Integration and component-level tests
- Seed data
- Chart-based trends visualization

---

## Design Decisions and Tradeoffs

### Why MongoDB Instead of SQL

Decision:

- Chosen for rapid iteration with flexible document modeling and straightforward aggregation support

Tradeoff:

- Less rigid relational constraints compared to normalized SQL schemas
- Mitigated by explicit schema validation and controlled enums in Mongoose

### Why JWT Authentication

Decision:

- Stateless auth simplifies API scaling and frontend integration
- Token carries identity and role context efficiently

Tradeoff:

- Token revocation is harder than session-based approaches
- Mitigated partially with user status checks on each protected request

### Why MVC with Service Layer

Decision:

- Maintains clean boundaries between transport concerns and domain logic
- Analytics logic in services improves reusability and testability

Tradeoff:

- Slightly more files and indirection
- Acceptable for maintainability and growth

### Why Soft Delete Instead of Hard Delete

Decision:

- Preserves financial history and reduces risk of irreversible accidental deletion

Tradeoff:

- Queries must consistently exclude deleted records
- Addressed with explicit isDeleted conditions in read paths

### Why Regex Search Instead of Full-Text Search

Decision:

- Lightweight implementation aligned with assignment scope
- Supports flexible category and note lookup without additional infrastructure

Tradeoff:

- Regex search does not scale as efficiently as dedicated text indexes or search engines
- Suitable for assignment-level throughput and can be upgraded later

---

## Future Improvements

- Add admin-facing frontend for user lifecycle management
- Expand automated tests for edge cases, authorization denial paths, and analytics validation
- Add export capabilities for records and analytics reports
- Harden production readiness with structured logging, observability, and stricter registration policy controls
- Add API versioning and contract testing for long-term maintainability
