from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.task import (
    TaskCreate, TaskUpdate, TaskResponse, TaskListResponse, TaskAssignRequest
)
from app.services.task import (
    create_task, get_tasks, get_task,
    update_task, delete_task
)
from app.utils.dependencies import get_current_user, require_project_manager
from app.models.user import User

router = APIRouter(
    prefix="/api/v1/organizations/{org_id}/projects/{project_id}/tasks",
    tags=["Tasks"]
)

@router.post("/", response_model=TaskResponse)
def create_task_route(
    org_id: str,
    project_id: str,
    request: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_task(db, project_id, org_id, str(current_user.id), request)

@router.get("/", response_model=TaskListResponse)
def list_tasks(
    org_id: str,
    project_id: str,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status: str = Query(None),
    priority: str = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_tasks(db, project_id, org_id, page, limit, status, priority)

@router.get("/{task_id}", response_model=TaskResponse)
def get_task_route(
    org_id: str,
    project_id: str,
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_task(db, task_id, org_id)

@router.put("/{task_id}", response_model=TaskResponse)
def update_task_route(
    org_id: str,
    project_id: str,
    task_id: str,
    request: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return update_task(db, task_id, org_id, str(current_user.id), request)

@router.delete("/{task_id}")
def delete_task_route(
    org_id: str,
    project_id: str,
    task_id: str,
    current_user: User = Depends(require_project_manager),
    db: Session = Depends(get_db)
):
    return delete_task(db, task_id, org_id, str(current_user.id))