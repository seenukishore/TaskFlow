from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.organization import Organization, OrganizationMember, Team, TeamMember
from app.models.activity_log import ActivityLog
from app.schemas.organization import OrganizationCreate, OrganizationUpdate, TeamCreate, TeamUpdate
import uuid
from datetime import datetime

def create_organization(db: Session, request: OrganizationCreate, user_id: str) -> Organization:
    # Check slug unique
    existing = db.query(Organization).filter(Organization.slug == request.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Organization slug already exists"
        )

    org = Organization(
        id=uuid.uuid4(),
        name=request.name,
        slug=request.slug,
        description=request.description,
        logo_url=request.logo_url
    )
    db.add(org)
    db.flush()

    # Add creator as admin
    member = OrganizationMember(
        id=uuid.uuid4(),
        organization_id=org.id,
        user_id=user_id,
        role="org_admin"
    )
    db.add(member)

    # Activity Log
    log = ActivityLog(
        id=uuid.uuid4(),
        organization_id=org.id,
        user_id=user_id,
        action="created",
        entity_type="organization",
        entity_id=org.id,
        description=f"Organization '{request.name}' created"
    )
    db.add(log)
    db.commit()
    db.refresh(org)
    return org

def get_organizations(db: Session, user_id: str, page: int = 1, limit: int = 20) -> dict:
    query = db.query(Organization).join(
        OrganizationMember,
        OrganizationMember.organization_id == Organization.id
    ).filter(
        OrganizationMember.user_id == user_id,
        Organization.is_deleted == False
    )

    total = query.count()
    orgs = query.offset((page - 1) * limit).limit(limit).all()
    return {"total": total, "page": page, "limit": limit, "data": orgs}

def get_organization(db: Session, org_id: str) -> Organization:
    org = db.query(Organization).filter(
        Organization.id == org_id,
        Organization.is_deleted == False
    ).first()

    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    return org

def update_organization(db: Session, org_id: str, user_id: str, request: OrganizationUpdate) -> Organization:
    org = get_organization(db, org_id)
    update_data = request.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(org, key, value)

    db.commit()
    db.refresh(org)
    return org

def delete_organization(db: Session, org_id: str, user_id: str) -> dict:
    org = get_organization(db, org_id)
    org.is_deleted = True
    org.deleted_at = datetime.utcnow()
    db.commit()
    return {"message": "Organization deleted successfully"}

def add_member(db: Session, org_id: str, user_id: str, role: str = "team_member") -> OrganizationMember:
    existing = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == user_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already a member"
        )

    member = OrganizationMember(
        id=uuid.uuid4(),
        organization_id=org_id,
        user_id=user_id,
        role=role
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    return member

def create_team(db: Session, org_id: str, user_id: str, request: TeamCreate) -> Team:
    team = Team(
        id=uuid.uuid4(),
        organization_id=org_id,
        name=request.name,
        description=request.description
    )
    db.add(team)
    db.flush()

    member = TeamMember(
        id=uuid.uuid4(),
        team_id=team.id,
        user_id=user_id,
        role="lead"
    )
    db.add(member)
    db.commit()
    db.refresh(team)
    return team

def get_teams(db: Session, org_id: str) -> list:
    return db.query(Team).filter(
        Team.organization_id == org_id,
        Team.is_deleted == False
    ).all()