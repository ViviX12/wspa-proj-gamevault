from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models.review import Review
from models.library import Library
from auth import verify_token
import uuid

router = APIRouter()

# to co frontend wysyla 
class CreateReviewRequest(BaseModel):
    product_id: str
    rating: int
    title: str
    content: str
    recommended: bool = True

# POST /reviews
#wymaga posiadania gry i konta
@router.post("/reviews")
def create_review(
    request: CreateReviewRequest,
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

    library_item = db.query(Library).filter(
        Library.user_id == user_id,
        Library.product_id == request.product_id
    ).first()

    if not library_item:
        raise HTTPException(
            status_code=403,
            detail="Możesz recenzować tylko gry które posiadasz"
        )

    existing_review = db.query(Review).filter(
        Review.user_id == user_id,
        Review.product_id == request.product_id
    ).first()

    if existing_review:
        raise HTTPException(
            status_code=400,
            detail="Już napisałeś recenzję dla tej gry"
        )

    if not 1 <= request.rating <= 10:
        raise HTTPException(
            status_code=400,
            detail="Ocena musi być między 1 a 10"
        )

    new_review = Review(
        id=uuid.uuid4(),
        user_id=user_id,
        product_id=request.product_id,
        rating=request.rating,
        title=request.title,
        content=request.content,
        recommended=request.recommended
    )

    db.add(new_review)
    db.commit()

    return {
        "message": "Recenzja dodana!",
        "review_id": str(new_review.id)
    }

# GET /reviews/{product_id}
@router.get("/reviews/{product_id}")
def get_reviews(product_id: str, db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(
        Review.product_id == product_id,
        Review.status == "active"
    ).all()

    result = []
    for review in reviews:
        result.append({
            "review_id": str(review.id),
            "rating": review.rating,
            "title": review.title,
            "content": review.content,
            "recommended": review.recommended,
            "helpful_votes": review.helpful_votes,
            "created_at": str(review.created_at)
        })

    return result