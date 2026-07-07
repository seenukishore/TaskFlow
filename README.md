# TaskFlow — Intelligent Project Management Platform

TaskFlow is a modern, multi-tenant project management platform designed for teams that need structure, visibility, and intelligent automation. Built with FastAPI, React, PostgreSQL, and AI-powered task insights, it brings together project planning, team collaboration, analytics, and streamlined workflows in one solution.

![Status](https://img.shields.io/badge/Status-Active-success)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)

---

## Overview

TaskFlow helps organizations manage projects, tasks, teams, and analytics with a clean interface and scalable backend architecture. It supports multi-tenant access, role-based permissions, activity tracking, and AI-assisted task prioritization.

## Key Features

- Multi-tenant architecture with organization-level data isolation
- Role-based access control for admins, managers, and team members
- End-to-end project and task management
- Activity logging and real-time analytics dashboard
- AI-powered task priority suggestions using Groq
- Secure authentication with JWT and password hashing

## Tech Stack

| Layer | Technology |
|------|------------|
| Backend | FastAPI, SQLAlchemy, Alembic, PostgreSQL |
| Authentication | JWT, bcrypt, python-jose |
| AI | Groq API |
| Frontend | React, Vite, Zustand, Axios, React Query |
| Styling | Tailwind CSS |

## Project Structure

```text
TaskFlow/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── routers/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── utils/
│   ├── migrations/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── store/
│   ├── package.json
│   └── vite.config.js
├── screenshots/
└── README.md
```

## Screenshots

### Login Page
![Login Page](screenshots/login.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Dashboard with Organization
![Organization-Dashboard](screenshots/zohodashboard.png)

### Projects View
![Projects](screenshots/projects.png)

### Task Detail View
![Task Detail](screenshots/task-detail.png)

### Analytics View
![Analytics](screenshots/analytics.png)

### Inbox View
![Inbox](screenshots/inbox.png)

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+
- Groq API key

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

Create a backend/.env file with values similar to:

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/taskflow
SECRET_KEY=your-super-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
GROQ_API_KEY=your-groq-api-key
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_BUCKET_NAME=your-bucket-name
AWS_REGION=us-east-1
```

Start the backend:

```bash
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

### API Documentation

Once the backend is running, visit http://localhost:8000/docs

## License

This project is licensed under the MIT License.

## Author

Kishore Kumar S
- GitHub: [@seenukishore](https://github.com/seenukishore)
- LinkedIn: [linkedin.com/in/kishore-kumar-seenu](https://www.linkedin.com/in/kishore-kumar-seenu/)

---

⭐ If you like this project, please consider giving it a star. 