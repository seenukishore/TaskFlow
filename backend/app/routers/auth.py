from fastapi import APIRouter, Depends, HTTPException, Response, Request
from sqlalchemy.orm import Session
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.database import get_db
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, RefreshTokenRequest
from app.services.auth import register_user, login_user, refresh_access_token
from app.utils.security import blacklist_token, decode_token
from app.utils.dependencies import get_current_user
from app.models.user import User
import os

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])
security = HTTPBearer(auto_error=False)

COOKIE_SECURE = os.getenv("DEBUG", "True") != "True"

@router.post("/register")
def register(request: RegisterRequest, response: Response, db: Session = Depends(get_db)):
    data = register_user(db, request)
    response.set_cookie(
        key="access_token",
        value=data["access_token"],
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",
        max_age=1800
    )
    response.set_cookie(
        key="refresh_token",
        value=data["refresh_token"],
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",
        max_age=604800
    )
    return {
        "access_token": data["access_token"],
        "refresh_token": data["refresh_token"],
        "token_type": "bearer"
    }

@router.post("/login")
def login(request: LoginRequest, response: Response, db: Session = Depends(get_db)):
    data = login_user(db, request)
    response.set_cookie(
        key="access_token",
        value=data["access_token"],
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",
        max_age=1800
    )
    response.set_cookie(
        key="refresh_token",
        value=data["refresh_token"],
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",
        max_age=604800
    )
    return {
        "access_token": data["access_token"],
        "refresh_token": data["refresh_token"],
        "token_type": "bearer"
    }

@router.post("/refresh")
def refresh(request: Request, response: Response, db: Session = Depends(get_db)):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        # Fallback to body
        raise HTTPException(status_code=401, detail="No refresh token")
    
    data = refresh_access_token(db, refresh_token)
    response.set_cookie(
        key="access_token",
        value=data["access_token"],
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",
        max_age=1800
    )
    response.set_cookie(
        key="refresh_token",
        value=data["refresh_token"],
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",
        max_age=604800
    )
    return data

@router.post("/logout")
def logout(
    request: Request,
    response: Response,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = None
    if credentials:
        token = credentials.credentials
    else:
        token = request.cookies.get("access_token")
    
    if token:
        try:
            blacklist_token(token, db)
        except:
            pass
    
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"message": "Successfully logged out"}

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "is_active": current_user.is_active,
        "created_at": current_user.created_at
    }