from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models.user
import models.product
import models.order
import models.library
import models.review
import logging
import os

Base.metadata.create_all(bind=engine)

log_dir = os.path.join(os.path.dirname(__file__), "logs")
os.makedirs(log_dir, exist_ok=True)

logging.basicConfig(
    filename=os.path.join(log_dir, "integration.log"),
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

logger = logging.getLogger("gamevault")

app = FastAPI(title="GameVault API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    response = await call_next(request)
    logger.info(f"HTTP | {request.method} {request.url.path} | status: {response.status_code} | client: {request.client.host}")
    return response

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
    logger.info("ROOT | Serwis GameVault API odpowiada")
    return {"message": "GameVault API dziala!"}