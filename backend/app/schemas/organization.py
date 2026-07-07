from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class OrganizationCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    logo_url: Optional[str] = None

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None

class OrganizationResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    description: Optional[str] = None
    logo_url: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

class OrganizationListResponse(BaseModel):
    total: int
    page: int
    limit: int
    data: list[OrganizationResponse]

class TeamCreate(BaseModel):
    name: str
    description: Optional[str] = None

class TeamUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class TeamResponse(BaseModel):
    id: UUID
    organization_id: UUID
    name: str
    description: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}

class AddMemberRequest(BaseModel):
    user_id: str
    role: Optional[str] = "team_member"