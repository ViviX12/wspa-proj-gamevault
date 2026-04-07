from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # <--- DODANO: Import CORS
from database import engine, Base
import models.user
import models.product
import models.order
import models.library

Base.metadata.create_all(bind=engine)

app = FastAPI(title="GameVault API")

# <--- DODANO: Konfiguracja CORS odblokowująca Reacta
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], # Adresy z których React pyta o dane
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routes.products import router as products_router
from routes.auth import router as auth_router
from routes.orders import router as orders_router
app.include_router(orders_router)
app.include_router(auth_router)
app.include_router(products_router)

@app.get("/")
def root():
    return {"message": "GameVault API działa!"}