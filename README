🗨️ Diligent — Slack-Style Messaging App

A full-stack messaging system built as part of CSE 186: Full Stack Web Development at UC Santa Cruz.
This project implements Diligent, a Slack-inspired single-page web application using the NERP Stack — Node.js, Express, React, and PostgreSQL — along with Material-UI for the frontend.

🚀 Overview

Diligent is a responsive, real-time chat platform where users can:

Log in and manage workspaces and channels

Send and view direct messages

Compose and view threaded conversations

Manage personal settings (avatar, status, sign-out)

Experience seamless transitions between mobile and desktop views

The app is built following a mobile-first design approach and uses a well-structured REST API conforming to OpenAPI 3.0.3 specifications.

🧠 Tech Stack
Layer	Technologies
Frontend	React + Material-UI + Vite
Backend	Node.js + Express + OpenAPI
Database	PostgreSQL via Docker
Testing	Jest + React Testing Library + Supertest
API Validation	OpenAPI 3.0.3
End-to-End Tests	Playwright (via e2e folder)
⚙️ Setup Instructions

To install node packages:
  $ npm install
  $ cd backend
  $ npm install
  $ cd ../frontend
  $ npm install
  4 cd ..

To start the database: 
  $ cd backend
  $ docker-compose up -d
  $ cd ..

To run the Web App: 
  $ npm start

To stop the database:
  $ cd backend
  $ docker-compose down
  $ cd ..

This runs both the frontend and backend dev servers concurrently.

🧪 Testing
Test Type	Command	Description
Lint	npm run lint	Run ESLint checks
Lint (fix)	npm run lint -- --fix	Auto-fix lint errors
Backend tests	cd backend && npm test	API tests
Frontend tests	cd frontend && npm test	UI component tests
End-to-end tests	cd e2e && npm test	Full-stack flow tests
🗂️ Project Structure
diligent/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   └── __tests__/
│   ├── sql/
│   │   ├── schema.sql
│   │   ├── data.sql
│   │   └── indexes.sql
│   ├── api/openapi.yaml
│   └── docker-compose.yml
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   └── __tests__/
│   ├── vite.config.js
│   └── index.html
│
├── e2e/
│   ├── tests/
│   └── .env
│
└── package.json

🧩 Core Features

Authentication: JWT-based login system (no plaintext passwords)

Workspaces: Create/join multiple workspaces

Channels: Channel-based messaging with thread replies

Direct Messages: Real-time private chats

Responsive Design: Mobile and desktop views with adaptive navigation

Settings: Update avatar, change status, sign out

Testing: Unit + E2E + API coverage to ≥ 98 %

🧾 Mandatory User Accounts (for testing)
Email	Password	Role
anna@books.com	annaadmin	Admin
molly@books.com	mollymember	Member

Each user has at least three workspaces with four channels per workspace.

🧼 Code Quality & Grading Highlights

100% code coverage across backend + frontend

Fully linted, no suppressions or warnings

REST API adheres strictly to OpenAPI 3.0.3 schema

Comprehensive E2E coverage for all implemented flows
