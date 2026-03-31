from sqlalchemy import Column, String, DECIMAL, TIMESTAMP, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from database import Base
import uuid
from datetime import datetime

class Order(Base):
    __tablename__ = "orders"

    #identyfikator zamówienia
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    # Numer zamówienia czytelny dla użytkownika
    order_number = Column(String(50), unique=True, nullable=False)
    status = Column(Enum("pending", "completed", "cancelled", name="order_status"), default="pending")
    subtotal = Column(DECIMAL(10, 2), nullable=False)
    discount_amount = Column(DECIMAL(10, 2), default=0.00)
    total_amount = Column(DECIMAL(10, 2), nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

class OrderItem(Base):
    __tablename__ = "order_items"

    # Produkt w zamówieniu
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    # Cena w momencie zakupu
    price = Column(DECIMAL(10, 2), nullable=False)