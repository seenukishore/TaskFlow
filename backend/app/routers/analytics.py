from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.task import Task, TaskStatus, TaskPriority
from app.models.project import Project, ProjectStatus
from app.models.organization import OrganizationMember
from app.utils.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/v1/analytics", tags=["Analytics"])

@router.get("/{org_id}")
def get_analytics(
    org_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Projects stats
    total_projects = db.query(Project).filter(
        Project.organization_id == org_id,
        Project.is_deleted == False
    ).count()

    active_projects = db.query(Project).filter(
        Project.organization_id == org_id,
        Project.status == ProjectStatus.ACTIVE,
        Project.is_deleted == False
    ).count()

    completed_projects = db.query(Project).filter(
        Project.organization_id == org_id,
        Project.status == ProjectStatus.COMPLETED,
        Project.is_deleted == False
    ).count()

    # Tasks stats
    total_tasks = db.query(Task).filter(
        Task.organization_id == org_id,
        Task.is_deleted == False
    ).count()

    done_tasks = db.query(Task).filter(
        Task.organization_id == org_id,
        Task.status == TaskStatus.DONE,
        Task.is_deleted == False
    ).count()

    in_progress_tasks = db.query(Task).filter(
        Task.organization_id == org_id,
        Task.status == TaskStatus.IN_PROGRESS,
        Task.is_deleted == False
    ).count()

    todo_tasks = db.query(Task).filter(
        Task.organization_id == org_id,
        Task.status == TaskStatus.TODO,
        Task.is_deleted == False
    ).count()

    backlog_tasks = db.query(Task).filter(
        Task.organization_id == org_id,
        Task.status == TaskStatus.BACKLOG,
        Task.is_deleted == False
    ).count()

    in_review_tasks = db.query(Task).filter(
        Task.organization_id == org_id,
        Task.status == "in_review",
        Task.is_deleted == False
    ).count()

    # Priority stats
    critical_tasks = db.query(Task).filter(
        Task.organization_id == org_id,
        Task.priority == TaskPriority.CRITICAL,
        Task.is_deleted == False
    ).count()

    high_tasks = db.query(Task).filter(
        Task.organization_id == org_id,
        Task.priority == TaskPriority.HIGH,
        Task.is_deleted == False
    ).count()

    medium_tasks = db.query(Task).filter(
        Task.organization_id == org_id,
        Task.priority == TaskPriority.MEDIUM,
        Task.is_deleted == False
    ).count()

    low_tasks = db.query(Task).filter(
        Task.organization_id == org_id,
        Task.priority == TaskPriority.LOW,
        Task.is_deleted == False
    ).count()

    # Members count
    total_members = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.is_active == True
    ).count()

    # Completion rate
    completion_rate = round((done_tasks / total_tasks * 100) if total_tasks > 0 else 0, 1)

    return {
        "projects": {
            "total": total_projects,
            "active": active_projects,
            "completed": completed_projects,
        },
        "tasks": {
            "total": total_tasks,
            "done": done_tasks,
            "in_progress": in_progress_tasks,
            "todo": todo_tasks,
            "backlog": backlog_tasks,
            "in_review": in_review_tasks,
        },
        "priority": {
            "critical": critical_tasks,
            "high": high_tasks,
            "medium": medium_tasks,
            "low": low_tasks,
        },
        "members": {
            "total": total_members,
        },
        "metrics": {
            "completion_rate": completion_rate,
            "active_issues": total_tasks - done_tasks,
            "velocity": total_tasks,
            "throughput": done_tasks,
        }
    }