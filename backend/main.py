from fastapi import FastAPI
from database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
import models.user
import models.product
import models.order
import models.library
import models.review

Base.metadata.create_all(bind=engine)

app = FastAPI(title="GameVault API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  #zmień na konkretny adres frontendu tam gdzie *
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routes.products import router as products_router
from routes.auth import router as auth_router
from routes.orders import router as orders_router
from routes.reviews import router as reviews_router
app.include_router(reviews_router)
app.include_router(orders_router)
app.include_router(auth_router)
app.include_router(products_router)

@app.get("/")
def root():
    return {"message": "GameVault API działa!"}