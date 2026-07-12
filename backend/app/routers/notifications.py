from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.utils.dependencies import get_current_user
from app.models.user import User
from app.models.notification import Notification
import uuid
from datetime import datetime

router = APIRouter(prefix="/api/v1/notifications", tags=["Notifications"])

@router.get("/")
def get_notifications(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    unread_only: bool = Query(False),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Notification).filter(
        Notification.user_id == str(current_user.id)
    )

    if unread_only:
        query = query.filter(Notification.is_read == False)

    total = query.count()
    notifications = query.order_by(
        Notification.created_at.desc()
    ).offset((page - 1) * limit).limit(limit).all()

    return {
        "total": total,
        "unread_count": db.query(Notification).filter(
            Notification.user_id == str(current_user.id),
            Notification.is_read == False
        ).count(),
        "page": page,
        "limit": limit,
        "data": [
            {
                "id": str(n.id),
                "title": n.title,
                "message": n.message,
                "type": n.type,
                "entity_type": n.entity_type,
                "entity_id": str(n.entity_id) if n.entity_id else None,
                "extra_data": n.extra_data,
                "is_read": n.is_read,
                "read_at": n.read_at,
                "created_at": n.created_at
            }
            for n in notifications
        ]
    }

@router.put("/{notification_id}/read")
def mark_as_read(
    notification_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == str(current_user.id)
    ).first()

    if not notification:
        return {"message": "Notification not found"}

    notification.is_read = True
    notification.read_at = datetime.utcnow()
    db.commit()

    return {"message": "Marked as read"}

@router.put("/mark-all-read")
def mark_all_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db.query(Notification).filter(
        Notification.user_id == str(current_user.id),
        Notification.is_read == False
    ).update({
        "is_read": True,
        "read_at": datetime.utcnow()
    })
    db.commit()
    return {"message": "All notifications marked as read"}

@router.delete("/{notification_id}")
def delete_notification(
    notification_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == str(current_user.id)
    ).first()

    if not notification:
        return {"message": "Notification not found"}

    db.delete(notification)
    db.commit()
    return {"message": "Notification deleted"}