from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

load_dotenv()

# Klucz do szyfrowania tokenów JWT trzymamy go w .env
SECRET_KEY = os.getenv("SECRET_KEY", "admingamevaultkey")
ALGORITHM = "HS256"
# 24h token
ACCESS_TOKEN_EXPIRE_MINUTES = 1440


pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hashuje hasło przed zapisem do bazy"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Sprawdza czy podane hasło zgadza się z hashem w bazie"""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    """Tworzy token JWT dla zalogowanego użytkownika"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str) -> dict:
    """Weryfikuje token JWT i zwraca dane użytkownika"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None