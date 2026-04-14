from sqlalchemy import Column, String, Text, Integer, Boolean, TIMESTAMP, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from database import Base
import uuid
from datetime import datetime

class Review(Base):
    __tablename__ = "reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    rating = Column(Integer, nullable=False)
    recommended = Column(Boolean, default=True)
    title = Column(String(200))
    content = Column(Text)
    helpful_votes = Column(Integer, default=0)
    status = Column(Enum("active", "hidden", "deleted", name="review_status"), default="active")
    created_at = Column(TIMESTAMP, default=datetime.utcnow)