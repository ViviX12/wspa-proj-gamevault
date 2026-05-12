from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models.user import User
from auth import hash_password, verify_password, create_access_token, verify_token
from models.user import User
import uuid

router = APIRouter()

# Schemat danych do rejestracji
class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    display_name: str = None

# Schemat danych do logowania
class LoginRequest(BaseModel):
    email: str
    password: str

# POST /auth/register
# Rejestracja nowego użytkownika
@router.post("/auth/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    
    
    existing_email = db.query(User).filter(User.email == request.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email już jest zajęty")
    
    
    existing_username = db.query(User).filter(User.username == request.username).first()
    if existing_username:
        raise HTTPException(status_code=400, detail="Nazwa użytkownika już jest zajęta")
    
    # Tworzy nowego użytkownika z zahashowanym hasłem
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
    
    return {
        "message": "Rejestracja udana!",
        "user_id": str(new_user.id),
        "username": new_user.username
    }

# POST /auth/login
# Logowanie
@router.post("/auth/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    print(f"DEBUG: Próba logowania dla: {request.email}")

    
    # Znajdź po emailu
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Nieprawidłowy email lub hasło")
    
    # Sprawdź czy hasło się zgadza
    if not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Nieprawidłowy email lub hasło")
    
    # Stwórz token
    token = create_access_token(data={
        "sub": str(user.id),
        "username": user.username,
        "role": user.role
    })
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": str(user.id),
        "username": user.username,
        "role": user.role
    }
# GET /auth/me zwraca dane na podstawie tokenu JWT
@router.get("/auth/me")
def get_me(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Brak tokena autoryzacji")

    token = authorization.replace("Bearer ", "")
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Nieprawidłowy token")

    user_id = payload.get("sub")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Użytkownik nie istnieje")

    return {
        "user_id": str(user.id),
        "username": user.username,
        "email": user.email,
        "display_name": user.display_name,
        "role": user.role,
        "wallet_balance": float(user.wallet_balance),
        "created_at": str(user.created_at)
    }