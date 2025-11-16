# Full-Stack Todo App (React + Node + TypeScript)

A full-stack Todo application with authentication, secure password reset, and complete Todo CRUD operations.
The project is built with React + TypeScript frontend (Vite).
The backend uses Node + TypeScript (Express + MongoDB Atlas).
Both sides use Zod for validation(integrated in backend as well), and the backend includes token versioning, structured middleware, and an error-logging system that writes logs to MongoDB.

## Demo Video : [Please Click Here](https://drive.google.com/file/d/1oHQRfu-rbxGFH9f4cIl9U3mFDatjDczk/view?usp=sharing)

## Tech Stack

### Frontend

- React + TypeScript (Vite)
- React Router
- Zustand (auth store)
- React Query (server state)
- Zod (schema validation for API responses + forms)
- React Hook Form
- Tailwind CSS

### Backend

- Node.js + TypeScript
- Express
- MongoDB Atlas
- Zod (for request validation at the edge)
- JWT (for access tokens)
- bcrypt (for password hashing)
- Rate limiting (forgot/reset endpoints)
- Nodemailer + Ethereal (for forgot/reset password)
- Centralized error logging (MongoDB)

## Features

- Signup / Login (JWT auth)
- Forgot/Reset Password (email-token based reset)
- Token versioning (invalidates old JWTs after password reset)
- Full Todo CRUD (create, update, complete, delete)
- Complete Zod validation on both frontend and backedn
- Backend logs written to a dedicated MongoDB collection

## Running the Project Locally

### Backend (port 4000)

```
cd todo-backend
npm install
npm run dev
```

- Create .env by checking the .env.example on both frontend and backend

### Frontend (port 5174)

```
cd todo-frontend
npm install
npm run dev
```

Open:

`http://localhost:5174`

## Zod Validation (Backend & Frontend)

### Backend

Every incoming requests like Auth, todos are validated with Zod before going to controllers.
Invalid payloads are rejected immediately.

### Frontend

The frontend mirrors the backend schemas
Zod validates form inputs (with ZodResolver) and parses API responses before they reach the UI, keeping both sides in sync.

## Token Versioning

Each user has a tokenVersion field.
When the password is reset or changed, this value increments, instantly invalidating all previously issued JWTs.

It prevents old or stolen tokens from being reused.

## Password Reset Flow (Ethereal-based)

- User enters email on the “Forgot Password” page.
- Backend generates a reset token, hashes it, stores hash and then
- Email is sent via Nodemailer + Ethereal, after that 
- API returns the Ethereal preview URL, so the email can be opened directly in the browser (no real inbox required-chosen this for faster implementation).
- User clicks reset link → Reset Password page.
- User submits new password with token.
- Backend validates token, updates password, clears reset fields, increments tokenVersion.

So that's how the Forgot/Reset password is working here.

## Collections in MongoDB
- users: credentials, password reset fields, tokenVersion
- todos: user todos
- backend_logs: server logs captured by middleware

We can view logs in Atlas under (shown in demo video as well):

`tododemo.backend_logs`
