from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.project import Project, ProjectStatus
from app.models.activity_log import ActivityLog
from app.schemas.project import ProjectCreate, ProjectUpdate
import uuid
from datetime import datetime

def create_project(db: Session, org_id: str, user_id: str, request: ProjectCreate) -> Project:
    project = Project(
        id=uuid.uuid4(),
        organization_id=org_id,
        created_by=user_id,
        name=request.name,
        description=request.description,
        team_id=request.team_id,
        start_date=request.start_date,
        due_date=request.due_date
    )
    db.add(project)
    db.flush()

    log = ActivityLog(
        id=uuid.uuid4(),
        organization_id=org_id,
        user_id=user_id,
        project_id=project.id,
        action="created",
        entity_type="project",
        entity_id=project.id,
        description=f"Project '{request.name}' created"
    )
    db.add(log)
    db.commit()
    db.refresh(project)
    return project

def get_projects(db: Session, org_id: str, page: int = 1, limit: int = 20, status: str = None) -> dict:
    query = db.query(Project).filter(
        Project.organization_id == org_id,
        Project.is_deleted == False
    )

    if status:
        query = query.filter(Project.status == status)

    total = query.count()
    projects = query.offset((page - 1) * limit).limit(limit).all()
    return {"total": total, "page": page, "limit": limit, "data": projects}

def get_project(db: Session, project_id: str, org_id: str) -> Project:
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.organization_id == org_id,
        Project.is_deleted == False
    ).first()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return project

def update_project(db: Session, project_id: str, org_id: str, user_id: str, request: ProjectUpdate) -> Project:
    project = get_project(db, project_id, org_id)
    update_data = request.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(project, key, value)

    log = ActivityLog(
        id=uuid.uuid4(),
        organization_id=org_id,
        user_id=user_id,
        project_id=project.id,
        action="updated",
        entity_type="project",
        entity_id=project.id,
        description=f"Project '{project.name}' updated"
    )
    db.add(log)
    db.commit()
    db.refresh(project)
    return project

def delete_project(db: Session, project_id: str, org_id: str, user_id: str) -> dict:
    project = get_project(db, project_id, org_id)
    project.is_deleted = True
    project.deleted_at = datetime.utcnow()

    log = ActivityLog(
        id=uuid.uuid4(),
        organization_id=org_id,
        user_id=user_id,
        project_id=project.id,
        action="deleted",
        entity_type="project",
        entity_id=project.id,
        description=f"Project '{project.name}' deleted"
    )
    db.add(log)
    db.commit()
    return {"message": "Project deleted successfully"}