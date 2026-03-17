from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.product import Product

router = APIRouter()

@router.get("/products")
def get_products(db: Session = Depends(get_db)):            #ten endpoint zwraca liste wszystkich produktow ktore sa aktynwe
    products = db.query(Product).all()                      #przyda sie wam do frontendu to 
    return products

@router.get("/products/{product_id}")
def get_product(product_id: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()            #endpoint konkretnych produktow 
    if not product:
        raise HTTPException(status_code=404, detail="Produkt nie istnieje")
    return product