from sqlalchemy import Column, String, Text, DECIMAL, Integer, TIMESTAMP, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import ForeignKey
from database import Base
import uuid
from datetime import datetime

class Category(Base):
    __tablename__ = "categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nazwa = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True)
    opis = Column(Text)
    parent_id = Column(UUID(as_uuid=True), ForeignKey("categories.id"), nullable=True)

class Product(Base):
    __tablename__ = "products"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    publisher_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    tytul = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True)
    opis = Column(Text)
    base_price = Column(DECIMAL(10, 2), nullable=False)
    current_price = Column(DECIMAL(10, 2), nullable=False)
    release_date = Column(TIMESTAMP)
    id_kategorii = Column(UUID(as_uuid=True), ForeignKey("categories.id"))
    status = Column(Enum("active", "inactive", "pending", name="product_status"), default="pending")
    average_rating = Column(DECIMAL(3, 2), default=0.00)
    total_sales = Column(Integer, default=0)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)