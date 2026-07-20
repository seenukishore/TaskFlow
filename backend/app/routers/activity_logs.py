from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.utils.dependencies import get_current_user
from app.models.user import User
from app.models.activity_log import ActivityLog

router = APIRouter(prefix="/api/v1/activity-logs", tags=["Activity Logs"])

@router.get("/{org_id}")
def get_activity_logs(
    org_id: str,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    entity_type: str = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(ActivityLog).filter(
        ActivityLog.organization_id == org_id
    )

    if entity_type:
        query = query.filter(ActivityLog.entity_type == entity_type)

    total = query.count()
    logs = query.order_by(
        ActivityLog.created_at.desc()
    ).offset((page - 1) * limit).limit(limit).all()

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "data": [
            {
                "id": str(log.id),
                "user_id": str(log.user_id),
                "project_id": str(log.project_id) if log.project_id else None,
                "task_id": str(log.task_id) if log.task_id else None,
                "action": log.action,
                "entity_type": log.entity_type,
                "entity_id": str(log.entity_id),
                "old_value": log.old_value,
                "new_value": log.new_value,
                "description": log.description,
                "created_at": log.created_at
            }
            for log in logs
        ]
    }