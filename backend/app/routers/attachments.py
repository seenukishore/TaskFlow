from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.utils.dependencies import get_current_user
from app.models.user import User
from app.models.attachment import Attachment
import boto3
import os
import uuid
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/v1/organizations/{org_id}/projects/{project_id}/tasks/{task_id}/attachments", tags=["Attachments"])

s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION", "us-east-1")
)

BUCKET_NAME = os.getenv("AWS_BUCKET_NAME", "kishore-dev-bucket-storage")

@router.post("/")
async def upload_attachment(
    org_id: str,
    project_id: str,
    task_id: str,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Generate unique file key
        file_ext = file.filename.split('.')[-1] if '.' in file.filename else ''
        s3_key = f"attachments/{org_id}/{task_id}/{uuid.uuid4()}.{file_ext}"

        # Upload to S3
        file_content = await file.read()
        s3_client.put_object(
            Bucket=BUCKET_NAME,
            Key=s3_key,
            Body=file_content,
            ContentType=file.content_type
        )

        # Generate URL
        s3_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{s3_key}"

        # Save to DB
        attachment = Attachment(
            id=uuid.uuid4(),
            organization_id=org_id,
            task_id=task_id,
            uploaded_by=str(current_user.id),
            file_name=file.filename,
            file_size=len(file_content),
            file_type=file.content_type,
            s3_key=s3_key,
            s3_url=s3_url
        )
        db.add(attachment)
        db.commit()
        db.refresh(attachment)

        return {
            "id": str(attachment.id),
            "file_name": attachment.file_name,
            "file_size": attachment.file_size,
            "file_type": attachment.file_type,
            "s3_url": attachment.s3_url,
            "created_at": attachment.created_at
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.get("/")
def get_attachments(
    org_id: str,
    project_id: str,
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    attachments = db.query(Attachment).filter(
        Attachment.task_id == task_id,
        Attachment.organization_id == org_id,
        Attachment.is_deleted == False
    ).all()

    return {
        "data": [
            {
                "id": str(a.id),
                "file_name": a.file_name,
                "file_size": a.file_size,
                "file_type": a.file_type,
                "s3_url": a.s3_url,
                "created_at": a.created_at
            }
            for a in attachments
        ]
    }

@router.delete("/{attachment_id}")
def delete_attachment(
    org_id: str,
    project_id: str,
    task_id: str,
    attachment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    attachment = db.query(Attachment).filter(
        Attachment.id == attachment_id,
        Attachment.organization_id == org_id,
        Attachment.is_deleted == False
    ).first()

    if not attachment:
        raise HTTPException(status_code=404, detail="Attachment not found")

    try:
        s3_client.delete_object(Bucket=BUCKET_NAME, Key=attachment.s3_key)
    except:
        pass

    attachment.is_deleted = True
    attachment.deleted_at = datetime.utcnow()
    db.commit()

    return {"message": "Attachment deleted successfully"}