from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.organization import (
    OrganizationCreate, OrganizationUpdate, OrganizationResponse,
    OrganizationListResponse, TeamCreate, TeamResponse, AddMemberRequest
)
from app.services.organization import (
    create_organization, get_organizations, get_organization,
    update_organization, delete_organization, add_member,
    create_team, get_teams
)
from app.utils.dependencies import get_current_user, require_org_admin
from app.models.user import User

router = APIRouter(prefix="/api/v1/organizations", tags=["Organizations"])

@router.post("/", response_model=OrganizationResponse)
def create_org(
    request: OrganizationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_organization(db, request, str(current_user.id))

@router.get("/", response_model=OrganizationListResponse)
def list_orgs(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_organizations(db, str(current_user.id), page, limit)

@router.get("/{org_id}", response_model=OrganizationResponse)
def get_org(
    org_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_organization(db, org_id)

@router.put("/{org_id}", response_model=OrganizationResponse)
def update_org(
    org_id: str,
    request: OrganizationUpdate,
    current_user: User = Depends(require_org_admin),
    db: Session = Depends(get_db)
):
    return update_organization(db, org_id, str(current_user.id), request)

@router.delete("/{org_id}")
def delete_org(
    org_id: str,
    current_user: User = Depends(require_org_admin),
    db: Session = Depends(get_db)
):
    return delete_organization(db, org_id, str(current_user.id))

@router.post("/{org_id}/members")
def add_org_member(
    org_id: str,
    request: AddMemberRequest,
    current_user: User = Depends(require_org_admin),
    db: Session = Depends(get_db)
):
    return add_member(db, org_id, request.user_id, request.role)

@router.post("/{org_id}/teams", response_model=TeamResponse)
def create_team_route(
    org_id: str,
    request: TeamCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_team(db, org_id, str(current_user.id), request)

@router.get("/{org_id}/teams")
def list_teams(
    org_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_teams(db, org_id)