from fastapi import FastAPI
from database import engine, Base
import models.user
import models.product
import models.order
import models.library

Base.metadata.create_all(bind=engine)

app = FastAPI(title="GameVault API")

from routes.products import router as products_router
from routes.auth import router as auth_router
from routes.orders import router as orders_router
app.include_router(orders_router)
app.include_router(auth_router)
app.include_router(products_router)

@app.get("/")
def root():
    return {"message": "GameVault API działa!"}