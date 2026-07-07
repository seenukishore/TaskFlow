from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.project import (
    ProjectCreate, ProjectUpdate, ProjectResponse, ProjectListResponse
)
from app.services.project import (
    create_project, get_projects, get_project,
    update_project, delete_project
)
from app.utils.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/v1/organizations/{org_id}/projects", tags=["Projects"])

@router.post("/", response_model=ProjectResponse)
def create_project_route(
    org_id: str,
    request: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_project(db, org_id, str(current_user.id), request)

@router.get("/", response_model=ProjectListResponse)
def list_projects(
    org_id: str,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status: str = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_projects(db, org_id, page, limit, status)

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project_route(
    org_id: str,
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_project(db, project_id, org_id)

@router.put("/{project_id}", response_model=ProjectResponse)
def update_project_route(
    org_id: str,
    project_id: str,
    request: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return update_project(db, project_id, org_id, str(current_user.id), request)

@router.delete("/{project_id}")
def delete_project_route(
    org_id: str,
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return delete_project(db, project_id, org_id, str(current_user.id))