from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.organizations import router as organizations_router
from app.routers.projects import router as projects_router
from app.routers.tasks import router as tasks_router
from app.routers.comments import router as comments_router
from app.routers.analytics import router as analytics_router

app = FastAPI(
    title="TaskFlow API",
    description="Production-level Multi-tenant Project Management Platform",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(organizations_router)
app.include_router(projects_router)
app.include_router(tasks_router)
app.include_router(comments_router)
app.include_router(analytics_router)

@app.get("/")
def root():
    return {
        "app": "TaskFlow API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}