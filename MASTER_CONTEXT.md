# TaskFlow - Master Context

## Project Overview
Multi-tenant Project Management Platform (Jira + Asana + Monday.com simplified)
Production-level system with AI-powered features for Germany job portfolio.

## Tech Stack
- **Backend:** Python + FastAPI + SQLAlchemy + Alembic
- **Database:** PostgreSQL (local: `taskflow` db, user: postgres, password: Admin)
- **Auth:** JWT (Access + Refresh tokens), bcrypt password hashing
- **AI:** Groq (llama-3.1-8b-instant) for Smart Priority Engine + Task Summarizer
- **Frontend:** React + Vite + Tailwind CSS (not started yet)
- **Storage:** AWS S3 (bucket: kishore-dev-bucket-storage, region: us-east-1)
- **Deployment:** TBD (Render/AWS planned)

## Project Structure

TaskFlow/

├── backend/

│   ├── app/

│   │   ├── models/        ✅ DONE (12 tables)

│   │   ├── schemas/       ✅ DONE (all pydantic schemas)

│   │   ├── services/      ✅ DONE (auth, organization, project, task, ai)

│   │   ├── routers/       🔄 IN PROGRESS (auth.py done, 5 more pending)

│   │   ├── middleware/    ⬜ NOT STARTED

│   │   ├── utils/         ✅ DONE (security.py, dependencies.py)

│   │   └── database.py    ✅ DONE

│   ├── migrations/        ✅ DONE (initial migration applied)

│   ├── main.py            ⬜ NOT STARTED (FastAPI app entry point)

│   ├── .env               ✅ DONE

│   └── requirements.txt   ✅ DONE

├── frontend/               ⬜ NOT STARTED

├── MASTER_CONTEXT.md       ✅ THIS FILE

└── SESSION_HANDOFF.md      ✅ TRACKS CURRENT STEP

## Database Models (All Created)
1. **users** - id, email, full_name, hashed_password, role (enum: super_admin/org_admin/project_manager/team_member), avatar_url, is_active, is_deleted
2. **organizations** - id, name, slug, description, logo_url, is_active, is_deleted
3. **organization_members** - pivot table (org_id, user_id, role)
4. **teams** - id, organization_id, name, description
5. **team_members** - pivot table (team_id, user_id, role)
6. **projects** - id, organization_id, team_id, created_by, name, status (enum), health (enum), dates
7. **tasks** - id, organization_id, project_id, created_by, title, status (enum: backlog/todo/in_progress/in_review/done), priority (enum), ai_priority, ai_summary, story_points
8. **task_assignments** - pivot table (task_id, user_id, assigned_by)
9. **comments** - id, organization_id, task_id, user_id, content
10. **attachments** - id, organization_id, task_id, uploaded_by, s3_key, s3_url
11. **activity_logs** - id, organization_id, user_id, project_id, task_id, action, entity_type, entity_id, old_value, new_value
12. **notifications** - id, organization_id, user_id, title, message, type, extra_data (renamed from metadata - reserved word)

## Important Fixes Applied
- Python 3.14 venv issue → used `python -m venv venv --without-pip` then `python -m ensurepip --upgrade`
- PostgreSQL not in PATH → used full path `"C:\Program Files\PostgreSQL\18\bin\psql.exe"`
- `metadata` is reserved in SQLAlchemy Declarative → renamed to `extra_data` in notification.py
- Groq free tier rate limit hit on `llama-3.3-70b-versatile` → switched to `llama-3.1-8b-instant` for AI service calls

## RBAC Roles (in order of permission)
1. `super_admin` - platform level
2. `org_admin` - full control in their org
3. `project_manager` - manage projects/tasks
4. `team_member` - view/update assigned tasks + comment

## AI Features Planned
1. ✅ Smart Priority Engine - auto-assigns priority based on title+description (implemented in `services/ai.py`)
2. ✅ AI Task Summarizer - one-line summary (implemented in `services/ai.py`)
3. ⬜ Semantic Search - planned for later phase

## UI Reference
User provided 10 screenshots of "TaskFlow" reference design - dark mode, purple/indigo accent (#7c3aed style), card-based dashboard with stats (Throughput, Cycle Time, Active Issues, Team Velocity), Kanban board view, Analytics with charts, Team members page, Login page with Google OAuth option, Workspace switcher modal, Task detail panel with attachments/activity/comments sidebar.

## Phase Plan (8 Phases)
1. ✅ Project Setup + Database Models + Migrations — **COMPLETE**
2. 🔄 Authentication + RBAC Middleware — **IN PROGRESS**
3. ⬜ Organizations, Teams & Projects CRUD
4. ⬜ Tasks, Comments, Attachments
5. ⬜ Activity Logs + Notifications
6. ⬜ Frontend (React) Integration
7. ⬜ Analytics + Kanban + Polish
8. ⬜ Testing + Documentation + Deployment

## API Convention
- Prefix: `/api/v1/`
- List endpoints support: `?page=1&limit=20&sort=created_at&order=desc`
- Auth: Bearer token in `Authorization` header

## User Preferences (IMPORTANT)
- User communicates in Tanglish, wants step-by-step instructions
- User wants confirmation after every single file/step before moving to next
- User is building this for Germany job applications - wants PRODUCTION QUALITY, no shortcuts
- Always say "Done aa solu!" prompt style to wait for confirmation
- User trusts the assistant deeply - do not skip steps or rush