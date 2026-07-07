from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID
from app.models.project import ProjectStatus, ProjectHealth

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    team_id: Optional[str] = None
    start_date: Optional[datetime] = None
    due_date: Optional[datetime] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ProjectStatus] = None
    health: Optional[ProjectHealth] = None
    team_id: Optional[str] = None
    start_date: Optional[datetime] = None
    due_date: Optional[datetime] = None

class ProjectResponse(BaseModel):
    id: UUID
    organization_id: UUID
    name: str
    description: Optional[str] = None
    status: str
    health: str
    team_id: Optional[UUID] = None
    start_date: Optional[datetime] = None
    due_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

class ProjectListResponse(BaseModel):
    total: int
    page: int
    limit: int
    data: list[ProjectResponse]