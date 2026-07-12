from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.comment import CommentCreate, CommentUpdate, CommentResponse, CommentListResponse
from app.models.comment import Comment
from app.models.activity_log import ActivityLog
from app.models.task import Task
from app.services.notification import notify_comment_added
from app.utils.dependencies import get_current_user
from app.models.user import User
from fastapi import HTTPException, status
import uuid
from datetime import datetime

router = APIRouter(
    prefix="/api/v1/organizations/{org_id}/projects/{project_id}/tasks/{task_id}/comments",
    tags=["Comments"]
)

@router.post("/", response_model=CommentResponse)
def create_comment(
    org_id: str,
    project_id: str,
    task_id: str,
    request: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    comment = Comment(
        id=uuid.uuid4(),
        organization_id=org_id,
        task_id=task_id,
        user_id=str(current_user.id),
        content=request.content
    )
    db.add(comment)

    log = ActivityLog(
        id=uuid.uuid4(),
        organization_id=org_id,
        user_id=str(current_user.id),
        project_id=project_id,
        task_id=task_id,
        action="commented",
        entity_type="comment",
        entity_id=comment.id,
        description=f"Comment added on task"
    )
    db.add(log)
    db.commit()
    db.refresh(comment)

    # Notify task creator
    task = db.query(Task).filter(Task.id == task_id).first()
    if task:
        notify_comment_added(
            db, task,
            current_user.full_name,
            org_id,
            request.content
        )

    return comment

@router.get("/", response_model=CommentListResponse)
def list_comments(
    org_id: str,
    project_id: str,
    task_id: str,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Comment).filter(
        Comment.task_id == task_id,
        Comment.organization_id == org_id,
        Comment.is_deleted == False
    )
    total = query.count()
    comments = query.offset((page - 1) * limit).limit(limit).all()
    return {"total": total, "page": page, "limit": limit, "data": comments}

@router.put("/{comment_id}", response_model=CommentResponse)
def update_comment(
    org_id: str,
    project_id: str,
    task_id: str,
    comment_id: str,
    request: CommentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    comment = db.query(Comment).filter(
        Comment.id == comment_id,
        Comment.user_id == str(current_user.id),
        Comment.is_deleted == False
    ).first()

    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )

    comment.content = request.content
    db.commit()
    db.refresh(comment)
    return comment

@router.delete("/{comment_id}")
def delete_comment(
    org_id: str,
    project_id: str,
    task_id: str,
    comment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    comment = db.query(Comment).filter(
        Comment.id == comment_id,
        Comment.user_id == str(current_user.id),
        Comment.is_deleted == False
    ).first()

    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )

    comment.is_deleted = True
    comment.deleted_at = datetime.utcnow()
    db.commit()
    return {"message": "Comment deleted successfully"}