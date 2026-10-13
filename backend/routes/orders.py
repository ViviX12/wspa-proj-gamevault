from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from database import get_db
from models.order import Order, OrderItem
from models.library import Library
from models.product import Product
from auth import verify_token
import uuid
import logging

router = APIRouter()
logger = logging.getLogger("gamevault")

class OrderItemRequest(BaseModel):
    product_id: str

class CreateOrderRequest(BaseModel):
    items: List[OrderItemRequest]

@router.post("/orders")
def create_order(
    request: CreateOrderRequest,
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        logger.warning("ZAKUP | FAIL | brak tokena autoryzacji")
        raise HTTPException(status_code=401, detail="Brak tokena autoryzacji")

    token = authorization.replace("Bearer ", "")
    payload = verify_token(token)
    if not payload:
        logger.warning("ZAKUP | FAIL | nieprawidlowy token")
        raise HTTPException(status_code=401, detail="Nieprawidłowy token")

    user_id = payload.get("sub")

    total = 0
    order_items_data = []

    for item in request.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()

        if not product:
            logger.warning(f"ZAKUP | FAIL | user_id: {user_id} | produkt nie istnieje: {item.product_id}")
            raise HTTPException(status_code=404, detail=f"Produkt {item.product_id} nie istnieje")

        total += float(product.current_price)
        order_items_data.append({
            "product": product,
            "price": product.current_price
        })

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

    purchased_titles = []
    for item_data in order_items_data:
        order_item = OrderItem(
            id=uuid.uuid4(),
            order_id=new_order.id,
            product_id=item_data["product"].id,
            price=item_data["price"]
        )
        db.add(order_item)

        existing = db.query(Library).filter(
            Library.user_id == user_id,
            Library.product_id == item_data["product"].id
        ).first()

        if not existing:
            library_item = Library(
                id=uuid.uuid4(),
                user_id=user_id,
                product_id=item_data["product"].id
            )
            db.add(library_item)
            purchased_titles.append(item_data["product"].tytul)
        else:
            logger.warning(f"ZAKUP | DUPLIKAT | user_id: {user_id} | produkt: {item_data['product'].tytul} juz w bibliotece")

    db.commit()

    logger.info(f"ZAKUP | OK | user_id: {user_id} | zamowienie: {order_number} | produkty: {purchased_titles} | kwota: {total} PLN")

    return {
        "message": "Zakup udany!",
        "order_number": order_number,
        "total": total,
        "items_purchased": len(order_items_data)
    }

@router.get("/orders/{user_id}")
def get_orders(user_id: str, db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.user_id == user_id).all()

    logger.info(f"HISTORIA ZAMOWIEN | user_id: {user_id} | liczba zamowien: {len(orders)}")

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

@router.get("/library/{user_id}")
def get_library(user_id: str, db: Session = Depends(get_db)):
    library = db.query(Library).filter(Library.user_id == user_id).all()

    logger.info(f"BIBLIOTEKA | user_id: {user_id} | liczba gier: {len(library)}")

    result = []
    for item in library:
        product = db.query(Product).filter(Product.id == item.product_id).first()

        result.append({
            "library_id": str(item.id),
            "product_id": str(item.product_id),
            "tytul": product.tytul if product else "Nieznany",
            "current_price": float(product.current_price) if product else 0,
            "installed": item.installed,
            "created_at": str(item.created_at)
        })

    return result