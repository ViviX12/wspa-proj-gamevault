from sqlalchemy import Column, TIMESTAMP, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from database import Base
import uuid
from datetime import datetime

class Library(Base):
    __tablename__ = "library"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    # Czy gra jest zainstalowana
    installed = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)