<img width="1910" height="895" alt="image" src="https://github.com/user-attachments/assets/5b25f1d6-24fb-4ada-b2ab-8759c5970774" />


# Scholarly Editorial

A full-stack academic note-sharing platform where students can upload, browse, rate, and comment on course notes.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL via Prisma ORM |
| Auth | JWT + bcrypt |
| File Uploads | Multer |

## Features

- Register / login with JWT-based authentication
- Browse and filter notes by course
- Upload notes (PDF/files) linked to a course
- View note details with file preview
- Rate notes (one rating per user, averaged on the note)
- Comment on notes

## Project Structure

```
scholarly-editorial/
├── client/   # React frontend (Vite)
└── server/   # Express backend
```

## Prerequisites

- Node.js 18+
- PostgreSQL database

## Setup & Running

### 1. Configure the server environment

Create a `.env` file inside `server/`:

```env
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/scholarly_editorial"
JWT_SECRET="your-secret-key"
CLIENT_URL="http://localhost:5173"
PORT=5000
```

### 2. Start the server

```bash
cd server
npm install
npx prisma migrate dev   # creates the database tables
npm run dev              # starts on http://localhost:5000
```

### 3. Start the client

```bash
cd client
npm install
npm run dev              # starts on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/notes` | List all notes |
| POST | `/api/notes` | Upload a new note |
| GET | `/api/notes/:id` | Get note details |
| GET | `/api/courses` | List all courses |
| POST | `/api/:noteId/ratings` | Rate a note |
| GET | `/api/:noteId/comments` | Get comments on a note |
| POST | `/api/:noteId/comments` | Post a comment |

## Database Schema

- **User** — email, name, university, hashed password
- **Course** — code, name, department
- **Note** — title, description, file, linked to user + course
- **Rating** — score (1 per user per note), averaged on the note
- **Comment** — body, linked to user + note
