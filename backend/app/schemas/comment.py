from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class CommentCreate(BaseModel):
    content: str

class CommentUpdate(BaseModel):
    content: str

class CommentResponse(BaseModel):
    id: UUID
    task_id: UUID
    user_id: UUID
    content: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

class CommentListResponse(BaseModel):
    total: int
    page: int
    limit: int
    data: list[CommentResponse]