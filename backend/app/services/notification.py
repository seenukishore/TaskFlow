from sqlalchemy.orm import Session
from app.models.notification import Notification
import uuid
from datetime import datetime

def create_notification(
    db: Session,
    user_id: str,
    organization_id: str,
    title: str,
    message: str,
    notification_type: str,
    entity_type: str = None,
    entity_id: str = None,
    extra_data: dict = None
):
    try:
        notification = Notification(
            id=uuid.uuid4(),
            organization_id=organization_id,
            user_id=user_id,
            title=title,
            message=message,
            type=notification_type,
            entity_type=entity_type,
            entity_id=entity_id,
            extra_data=extra_data,
            is_read=False
        )
        db.add(notification)
        db.commit()
        return notification
    except Exception as e:
        print(f"Notification creation failed: {str(e)}")
        return None

def notify_task_created(db: Session, task, creator_name: str, org_id: str):
    create_notification(
        db=db,
        user_id=str(task.created_by),
        organization_id=org_id,
        title="Task Created",
        message=f"Your task '{task.title}' was created successfully",
        notification_type="task_created",
        entity_type="task",
        entity_id=str(task.id),
        extra_data={"priority": task.priority, "status": task.status}
    )

def notify_task_updated(db: Session, task, updater_name: str, org_id: str, changes: dict):
    create_notification(
        db=db,
        user_id=str(task.created_by),
        organization_id=org_id,
        title="Task Updated",
        message=f"Task '{task.title}' has been updated",
        notification_type="task_updated",
        entity_type="task",
        entity_id=str(task.id),
        extra_data=changes
    )

def notify_task_completed(db: Session, task, org_id: str):
    create_notification(
        db=db,
        user_id=str(task.created_by),
        organization_id=org_id,
        title="Task Completed!",
        message=f"Task '{task.title}' has been marked as Done",
        notification_type="task_completed",
        entity_type="task",
        entity_id=str(task.id),
        extra_data={"priority": task.priority}
    )

def notify_comment_added(db: Session, task, commenter_name: str, org_id: str, comment_content: str):
    create_notification(
        db=db,
        user_id=str(task.created_by),
        organization_id=org_id,
        title="New Comment",
        message=f"{commenter_name} commented on '{task.title}': {comment_content[:50]}...",
        notification_type="comment_added",
        entity_type="task",
        entity_id=str(task.id),
        extra_data={"comment_preview": comment_content[:100]}
    )