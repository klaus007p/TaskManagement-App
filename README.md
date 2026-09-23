# TaskFlow

A simple task management app built with React + Vite on the frontend and Express + MongoDB on the backend.

## Overview

This app lets a user:
- register an account
- log in securely
- create, view, update, and delete tasks
- track tasks by status: Todo, In-Progress, and Completed
- access a dashboard and task views from the frontend

## Tech stack

- Frontend: React, Vite, JavaScript, React Router
- Styling: Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Auth: JWT-based authentication

## Project structure

- frontend/: React app
- backend/: Express API and MongoDB models/routes

## Auth flow

1. User registers from the frontend form.
2. Frontend sends a POST request to `/api/auth/register`.
3. Backend validates input and creates a user in MongoDB.
4. User logs in with email and password.
5. Backend validates credentials and returns a JWT token.
6. Frontend stores the token and user data in localStorage.
7. Protected routes require the stored token to access task data.

## Task flow

1. Frontend loads tasks from `/api/tasks`.
2. Backend returns task records for the authenticated user.
3. Tasks support the following statuses:
   - Todo
   - In-Progress
   - Completed
4. Users can create, edit, mark complete, and delete tasks through the API.

## Local setup

### Backend

```bash
cd TaskApp/backend
npm install
npm run dev
```

Make sure your `.env` contains values like:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
CLIENT_URL=http://your_url
```

### Frontend

```bash
cd TaskApp/frontend
npm install
npm run dev
```



## Important notes

- The app is intentionally light-themed and does not use dark-mode or priority-based task fields.
- The real backend contract uses only three statuses: Todo, In-Progress, and Completed.
- The frontend is designed to use live backend data instead of mock arrays for production behavior.

## Main routes

- `/login` — sign in
- `/register` — create account
- `/dashboard` — overview
- `/tasks` — list all tasks
- `/tasks/:id` — view/update single task
- `/completed` — completed tasks
- `/important` — in-progress tasks
- `/search` — search task content
- `/settings` — profile/account page

## Current status

This project is a working task management app with authentication and CRUD functionality for tasks, connected between the frontend and backend.
