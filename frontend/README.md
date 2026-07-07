# TaskFlow

TaskFlow is a multi-tenant project management platform inspired by Jira, Asana, and Monday.com. It combines a FastAPI backend, a React + Vite frontend, PostgreSQL storage, and AI-assisted task insights.

![TaskFlow Status](https://img.shields.io/badge/Status-Active-green?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

---

## Features

- Organization-based multi-tenancy
- Role-based access control
- Project, task, comment, attachment, and notification management
- Activity logs and analytics dashboard
- AI-powered priority suggestions using Groq

## Tech Stack

- Backend: FastAPI, SQLAlchemy, Alembic, PostgreSQL, JWT, boto3, Groq
- Frontend: React, Vite, Zustand, Axios, React Query, Tailwind CSS

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

- Login: [screenshots/login.png](screenshots/login.png)
- Dashboard: [screenshots/dashboard.png](screenshots/dashboard.png)
- Projects: [screenshots/projects.png](screenshots/projects.png)
- Analytics: [screenshots/analytics.png](screenshots/analytics.png)
- Task detail: [screenshots/task-detail.png](screenshots/task-detail.png)

## Getting Started

### 1. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

Create a backend/.env file with values such as:

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

Run the backend:

```bash
uvicorn main:app --reload
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173

### 3. API Docs

Once the backend is running, visit http://localhost:8000/docs

## Notes

- The main repository README for GitHub is this file at the root of the project.
- Screenshot assets are stored in the screenshots folder.
- PostgreSQL should be running locally before starting the backend.

## Author

Kishore Kumar S
- GitHub: [@seenukishore](https://github.com/seenukishore)
- LinkedIn: [linkedin.com/in/kishore-kumar-seenu](https://www.linkedin.com/in/kishore-kumar-seenu/)
