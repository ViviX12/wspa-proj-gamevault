from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models.product import Product, Category
from typing import Optional

router = APIRouter()

# GET /products zwraca liste produktow po filtrowaniu
@router.get("/products")
def get_products(
    db: Session = Depends(get_db),
    search: Optional[str] = Query(None, description="Szukaj po tytule gry"),
    category: Optional[str] = Query(None, description="Filtruj po kategorii (slug)"),
    sort_by: Optional[str] = Query("created_at", description="Sortuj po: created_at, current_price, average_rating"),
    limit: int = Query(50, description="Ile produktów zwrócić"),
):
    query = db.query(Product).filter(Product.status == "active")

    
    if search:
        query = query.filter(Product.tytul.ilike(f"%{search}%"))

    
    if category:
        kategoria = db.query(Category).filter(Category.slug == category).first()
        if kategoria:
            query = query.filter(Product.id_kategorii == kategoria.id)

    
    if sort_by == "current_price":
        query = query.order_by(Product.current_price)
    elif sort_by == "average_rating":
        query = query.order_by(Product.average_rating.desc())
    else:
        query = query.order_by(Product.created_at.desc())

    products = query.limit(limit).all()
    return products

@router.get("/products/{product_id}")
def get_product(product_id: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Produkt nie istnieje")
    return product