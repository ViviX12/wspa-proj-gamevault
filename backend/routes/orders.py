from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from database import get_db
from models.order import Order, OrderItem
from models.library import Library
from models.product import Product
from auth import verify_token
from fastapi import Header
import uuid

router = APIRouter()

# Schemat co frontend wysyła przy zakupie
class OrderItemRequest(BaseModel):
    product_id: str

class CreateOrderRequest(BaseModel):
    items: List[OrderItemRequest]

def get_current_user(token: str, db: Session):
    """Weryfikuje token JWT i zwraca dane użytkownika"""
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Nieprawidłowy token")
    return payload

# POST /orders
@router.post("/orders")
def create_order(
    request: CreateOrderRequest,
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
    
    total = 0
    order_items_data = []
    
    for item in request.items:
        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()
        
        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Produkt {item.product_id} nie istnieje"
            )
        
        total += float(product.current_price)
        order_items_data.append({
            "product": product,
            "price": product.current_price
        })
    
    # Stwórz zamówienie
    order_number = f"GV-{uuid.uuid4().hex[:8].upper()}"
    new_order = Order(
        id=uuid.uuid4(),
        user_id=user_id,
        order_number=order_number,
        status="completed",
        subtotal=total,
        total_amount=total
    )
    db.add(new_order)
    db.flush()
    
    for item_data in order_items_data:
        order_item = OrderItem(
            id=uuid.uuid4(),
            order_id=new_order.id,
            product_id=item_data["product"].id,
            price=item_data["price"]
        )
        db.add(order_item)
        
        library_item = Library(
            id=uuid.uuid4(),
            user_id=user_id,
            product_id=item_data["product"].id
        )
        db.add(library_item)
    
    db.commit()
    
    return {
        "message": "Zakup udany!",
        "order_number": order_number,
        "total": total,
        "items_purchased": len(order_items_data)
    }

# GET /orders/{user_id}
# Historia zamówień użytkownika
@router.get("/orders/{user_id}")
def get_orders(user_id: str, db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.user_id == user_id).all()
    
    result = []
    for order in orders:
        result.append({
            "order_id": str(order.id),
            "order_number": order.order_number,
            "status": order.status,
            "total_amount": float(order.total_amount),
            "created_at": str(order.created_at)
        })
    
    return result

# GET /library/{user_id}
@router.get("/library/{user_id}")
def get_library(user_id: str, db: Session = Depends(get_db)):
    library = db.query(Library).filter(Library.user_id == user_id).all()
    
    result = []
    for item in library:
        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()
        
        result.append({
            "library_id": str(item.id),
            "product_id": str(item.product_id),
            "tytul": product.tytul if product else "Nieznany",
            "current_price": float(product.current_price) if product else 0,
            "installed": item.installed,
            "created_at": str(item.created_at)
        })
    
    return result