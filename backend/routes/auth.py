from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models.user import User
from auth import hash_password, verify_password, create_access_token, verify_token
import uuid
import logging

router = APIRouter()
logger = logging.getLogger("gamevault")

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    display_name: str = None

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/auth/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    existing_email = db.query(User).filter(User.email == request.email).first()
    if existing_email:
        logger.warning(f"REJESTRACJA | FAIL | email zajety: {request.email}")
        raise HTTPException(status_code=400, detail="Email już jest zajęty")

    existing_username = db.query(User).filter(User.username == request.username).first()
    if existing_username:
        logger.warning(f"REJESTRACJA | FAIL | username zajety: {request.username}")
        raise HTTPException(status_code=400, detail="Nazwa użytkownika już jest zajęta")

    new_user = User(
        id=uuid.uuid4(),
        username=request.username,
        email=request.email,
        password_hash=hash_password(request.password),
        display_name=request.display_name or request.username
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    logger.info(f"REJESTRACJA | OK | user_id: {new_user.id} | username: {new_user.username} | email: {new_user.email}")

    return {
        "message": "Rejestracja udana!",
        "user_id": str(new_user.id),
        "username": new_user.username
    }

@router.post("/auth/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        logger.warning(f"LOGOWANIE | FAIL | nie znaleziono uzytkownika: {request.email}")
        raise HTTPException(status_code=401, detail="Nieprawidłowy email lub hasło")

    if not verify_password(request.password, user.password_hash):
        logger.warning(f"LOGOWANIE | FAIL | bledne haslo dla: {request.email}")
        raise HTTPException(status_code=401, detail="Nieprawidłowy email lub hasło")

    token = create_access_token(data={
        "sub": str(user.id),
        "username": user.username,
        "role": user.role
    })

    logger.info(f"LOGOWANIE | OK | user_id: {user.id} | username: {user.username} | rola: {user.role}")

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": str(user.id),
        "username": user.username,
        "role": user.role
    }

@router.get("/auth/me")
def get_me(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        logger.warning("AUTH/ME | FAIL | brak tokena")
        raise HTTPException(status_code=401, detail="Brak tokena autoryzacji")

    token = authorization.replace("Bearer ", "")
    payload = verify_token(token)
    if not payload:
        logger.warning("AUTH/ME | FAIL | nieprawidlowy token")
        raise HTTPException(status_code=401, detail="Nieprawidłowy token")

    user_id = payload.get("sub")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        logger.warning(f"AUTH/ME | FAIL | nie znaleziono uzytkownika: {user_id}")
        raise HTTPException(status_code=404, detail="Użytkownik nie istnieje")

    logger.info(f"AUTH/ME | OK | user_id: {user.id} | username: {user.username}")

    return {
        "user_id": str(user.id),
        "username": user.username,
        "email": user.email,
        "display_name": user.display_name,
        "role": user.role,
        "wallet_balance": float(user.wallet_balance),
        "created_at": str(user.created_at)
    }