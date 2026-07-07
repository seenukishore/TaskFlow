# TaskFlow — Intelligent Project Management Platform

> A production-level, multi-tenant project management system built with FastAPI, PostgreSQL, React, and AI-powered features. Inspired by Jira + Asana + Monday.com.

![TaskFlow Dashboard](https://img.shields.io/badge/Status-Active-green?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

---

## Screenshots

### 1. Login Page
![Login Page](screenshots/login.png)

### 2. Engineering Dashboard
![Dashboard](screenshots/dashboard.png)

### 3. Dashboard with Organization
![Zoho Dashboard](screenshots/zohodashboard.png)

### 4. Projects Page
![Projects](screenshots/projects.png)

### 5. Task Detail View
![Task Detail](screenshots/task-detail.png)

### 6. Analytics Dashboard
![Analytics](screenshots/analytics.png)

### 7. Team Members Page
![Team Members](screenshots/team-members.png)

### 8. Inbox / Notifications
![Inbox](screenshots/inbox.png)

---

## Features

### Core Features
- Multi-Tenant Architecture — Organization-level data isolation
- Role-Based Access Control (RBAC) — Super Admin, Org Admin, Project Manager, Team Member
- JWT Authentication — Access + Refresh token rotation, bcrypt password hashing
- Project & Task Management — Full CRUD with soft delete
- Kanban Board — Visual task management with status columns
- Activity Logging — Every action tracked automatically
- Real-time Analytics — Live performance metrics dashboard
- AI-Powered Features — Smart priority detection + task summarization using Groq LLaMA

### Technical Highlights
- RESTful API with FastAPI + Pydantic v2 validation
- SQLAlchemy ORM + Alembic migrations
- Multi-tenant data isolation on every query
- Swagger UI API documentation at `/docs`
- React + Vite frontend with Tailwind CSS
- Custom hooks (useAnalytics, useProjects, useTasks)
- Zustand state management
- Axios interceptors with auto token refresh

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.x + FastAPI |
| Database | PostgreSQL + SQLAlchemy + Alembic |
| Authentication | JWT (Access + Refresh) + bcrypt |
| AI Features | Groq API (LLaMA 3.1) |
| Frontend | React + Vite + Tailwind CSS |
| State Management | Zustand |
| HTTP Client | Axios |
| API Docs | Swagger UI |

---

## Database Schema
organizations
└── organization_members (pivot)
└── teams
└── team_members (pivot)
└── projects
└── tasks
└── task_assignments (pivot)
└── comments
└── attachments
└── activity_logs
└── notifications
users

---

## API Structure
/api/v1/
├── auth/
│   ├── POST /register
│   ├── POST /login
│   └── POST /refresh
├── users/
│   ├── GET /me
│   └── PUT /me
├── organizations/
│   ├── POST /
│   ├── GET /
│   ├── GET /{org_id}
│   ├── PUT /{org_id}
│   ├── DELETE /{org_id}
│   ├── POST /{org_id}/members
│   └── POST /{org_id}/teams
├── organizations/{org_id}/projects/
│   ├── POST /
│   ├── GET /
│   ├── GET /{project_id}
│   ├── PUT /{project_id}
│   └── DELETE /{project_id}
├── organizations/{org_id}/projects/{project_id}/tasks/
│   ├── POST /
│   ├── GET /
│   ├── GET /{task_id}
│   ├── PUT /{task_id}
│   └── DELETE /{task_id}
├── organizations/{org_id}/projects/{project_id}/tasks/{task_id}/comments/
│   ├── POST /
│   ├── GET /
│   ├── PUT /{comment_id}
│   └── DELETE /{comment_id}
└── analytics/{org_id}

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+
- Groq API Key → [console.groq.com](https://console.groq.com)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/seenukishore/TaskFlow.git
cd TaskFlow
```

**2. Backend Setup**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

**3. Environment Variables**
```bash
# Create backend/.env
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

**4. Database Setup**
```bash
# Create PostgreSQL database
createdb taskflow

# Run migrations
alembic upgrade head
```

**5. Frontend Setup**
```bash
cd frontend
npm install
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate
uvicorn main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Project Structure
TaskFlow/
├── backend/
│   ├── app/
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── routers/         # FastAPI routers
│   │   ├── services/        # Business logic
│   │   ├── utils/           # JWT, dependencies
│   │   └── database.py      # DB connection
│   ├── migrations/          # Alembic migrations
│   ├── main.py              # FastAPI app entry
│   └── requirements.txt
└── frontend/
├── src/
│   ├── components/      # Reusable components
│   ├── pages/           # Page components
│   ├── services/        # API service layer
│   ├── store/           # Zustand stores
│   └── hooks/           # Custom React hooks
└── package.json

---

## AI Features

### Smart Priority Engine
Automatically analyzes task title and description to suggest priority level using Groq LLaMA 3.1.

### AI Task Summarizer
Generates concise one-line summaries for tasks to help team members quickly understand context.

---

## Security

- JWT token rotation on every refresh
- bcrypt password hashing
- Organization-level data isolation on every query
- Pydantic v2 input validation
- Soft delete (data never permanently deleted)
- CORS configuration

---

## Author

**Kishore Kumar S**
- GitHub: [@seenukishore](https://github.com/seenukishore)
- LinkedIn: [linkedin.com/in/kishore-kumar-seenu](https://www.linkedin.com/in/kishore-kumar-seenu/)

---

⭐ Star this repo if you found it helpful!