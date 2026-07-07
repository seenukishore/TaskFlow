from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID
from app.models.task import TaskStatus, TaskPriority

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[TaskStatus] = TaskStatus.BACKLOG
    priority: Optional[TaskPriority] = TaskPriority.MEDIUM
    story_points: Optional[int] = None
    due_date: Optional[datetime] = None
    assigned_to: Optional[list[str]] = []

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    story_points: Optional[int] = None
    due_date: Optional[datetime] = None

class TaskResponse(BaseModel):
    id: UUID
    organization_id: UUID
    project_id: UUID
    title: str
    description: Optional[str] = None
    status: str
    priority: str
    ai_priority: Optional[str] = None
    ai_summary: Optional[str] = None
    story_points: Optional[int] = None
    due_date: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

class TaskListResponse(BaseModel):
    total: int
    page: int
    limit: int
    data: list[TaskResponse]

class TaskAssignRequest(BaseModel):
    user_ids: list[str]