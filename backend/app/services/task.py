from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.task import Task, TaskAssignment, TaskStatus, TaskPriority
from app.models.activity_log import ActivityLog
from app.schemas.task import TaskCreate, TaskUpdate
from app.services.ai import analyze_task_priority, generate_task_summary
from app.services.notification import notify_task_created, notify_task_updated, notify_task_completed
import uuid
from datetime import datetime

def create_task(db: Session, project_id: str, organization_id: str, user_id: str, request: TaskCreate) -> Task:
    # AI Priority Analysis
    ai_result = analyze_task_priority(request.title, request.description or "")
    ai_priority_map = {
        "low": TaskPriority.LOW,
        "medium": TaskPriority.MEDIUM,
        "high": TaskPriority.HIGH,
        "critical": TaskPriority.CRITICAL
    }
    ai_priority = ai_priority_map.get(ai_result.get("priority", "medium"), TaskPriority.MEDIUM)
    ai_summary = ai_result.get("summary", request.title)

    task = Task(
        id=uuid.uuid4(),
        organization_id=organization_id,
        project_id=project_id,
        created_by=user_id,
        title=request.title,
        description=request.description,
        status=request.status,
        priority=request.priority,
        ai_priority=ai_priority,
        ai_summary=ai_summary,
        story_points=request.story_points,
        due_date=request.due_date
    )
    db.add(task)
    db.flush()

    # Assign users
    for uid in request.assigned_to:
        assignment = TaskAssignment(
            id=uuid.uuid4(),
            task_id=task.id,
            user_id=uid,
            assigned_by=user_id
        )
        db.add(assignment)

    # Activity Log
    log = ActivityLog(
        id=uuid.uuid4(),
        organization_id=organization_id,
        user_id=user_id,
        project_id=project_id,
        task_id=task.id,
        action="created",
        entity_type="task",
        entity_id=task.id,
        description=f"Task '{request.title}' created"
    )
    db.add(log)
    db.commit()
    db.refresh(task)
    notify_task_created(db, task, str(user_id), organization_id)
    return task

def get_tasks(db: Session, project_id: str, organization_id: str, page: int = 1, limit: int = 20, status: str = None, priority: str = None) -> dict:
    query = db.query(Task).filter(
        Task.project_id == project_id,
        Task.organization_id == organization_id,
        Task.is_deleted == False
    )

    if status:
        query = query.filter(Task.status == status)
    if priority:
        query = query.filter(Task.priority == priority)

    total = query.count()
    tasks = query.offset((page - 1) * limit).limit(limit).all()

    return {"total": total, "page": page, "limit": limit, "data": tasks}

def get_task(db: Session, task_id: str, organization_id: str) -> Task:
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.organization_id == organization_id,
        Task.is_deleted == False
    ).first()

    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task

def update_task(db: Session, task_id: str, organization_id: str, user_id: str, request: TaskUpdate) -> Task:
    task = get_task(db, task_id, organization_id)
    old_status = task.status

    update_data = request.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)

    if request.status == TaskStatus.DONE and old_status != TaskStatus.DONE:
        task.completed_at = datetime.utcnow()

    # Activity Log
    log = ActivityLog(
        id=uuid.uuid4(),
        organization_id=organization_id,
        user_id=user_id,
        task_id=task.id,
        action="updated",
        entity_type="task",
        entity_id=task.id,
        description=f"Task '{task.title}' updated"
    )
    db.add(log)
    
    if request.status == TaskStatus.DONE and old_status != TaskStatus.DONE:
        notify_task_completed(db, task, organization_id)
    else:
        notify_task_updated(db, task, str(user_id), organization_id, update_data)
    
    db.commit()
    db.refresh(task)
    return task

def delete_task(db: Session, task_id: str, organization_id: str, user_id: str) -> dict:
    task = get_task(db, task_id, organization_id)
    task.is_deleted = True
    task.deleted_at = datetime.utcnow()

    log = ActivityLog(
        id=uuid.uuid4(),
        organization_id=organization_id,
        user_id=user_id,
        task_id=task.id,
        action="deleted",
        entity_type="task",
        entity_id=task.id,
        description=f"Task '{task.title}' deleted"
    )
    db.add(log)
    db.commit()
    return {"message": "Task deleted successfully"}