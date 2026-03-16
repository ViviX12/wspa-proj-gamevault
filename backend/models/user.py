from sqlalchemy import Column, String, Enum, Boolean, DECIMAL, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from database import Base
import uuid
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    display_name = Column(String(100))
    avatar_url = Column(String(500))
    role = Column(Enum("user", "publisher", "admin", name="user_role"), default="user")
    status = Column(Enum("active", "suspended", "deleted", name="user_status"), default="active")
    two_factor_enabled = Column(Boolean, default=False)
    wallet_balance = Column(DECIMAL(10, 2), default=0.00)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow)