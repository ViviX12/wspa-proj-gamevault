from fastapi import FastAPI
from database import engine, Base
import models.user
import models.product

Base.metadata.create_all(bind=engine)

app = FastAPI(title="GameVault API")

from routes.products import router as products_router
app.include_router(products_router)

@app.get("/")
def root():
    return {"message": "GameVault API działa!"}