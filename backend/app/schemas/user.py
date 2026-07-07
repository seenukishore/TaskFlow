from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.user import UserRole
from uuid import UUID

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    role: Optional[UserRole] = UserRole.TEAM_MEMBER

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: Optional[bool] = None

class UserResponse(BaseModel):
    id: UUID
    email: str
    full_name: str
    role: str
    avatar_url: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

class UserListResponse(BaseModel):
    total: int
    page: int
    limit: int
    data: list[UserResponse]