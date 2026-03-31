from database import SessionLocal
from models.product import Product, Category
import uuid

db = SessionLocal()

kategoria = db.query(Category).filter(Category.slug == "akcja").first()

if not kategoria:
    kategoria = Category(
        id=uuid.uuid4(),
        nazwa="Akcja",
        slug="akcja",
        opis="Gry akcji"
    )
    db.add(kategoria)
    db.commit()
    db.refresh(kategoria)
    print("Kategoria dodana!")
else:
    print("Kategoria już istnieje, pomijam...")

if not db.query(Product).filter(Product.slug == "cyberpunk-2077").first():
    produkty = [
        Product(
            id=uuid.uuid4(),
            tytul="Cyberpunk 2077",
            slug="cyberpunk-2077",
            opis="Futurystyczna gra RPG",
            base_price=199.99,
            current_price=99.99,
            id_kategorii=kategoria.id,
            status="active"
        ),
        Product(
            id=uuid.uuid4(),
            tytul="Wiedźmin 3",
            slug="wiedzmin-3",
            opis="Najlepsza gra RPG wszech czasów",
            base_price=149.99,
            current_price=49.99,
            id_kategorii=kategoria.id,
            status="active"
        ),
        Product(
            id=uuid.uuid4(),
            tytul="EA FC 26",
            slug="eafc26",
            opis="Najnowsza odsłona EA FC",
            base_price=249.99,
            current_price=249.99,
            id_kategorii=kategoria.id,
            status="active"
        ),
    ]
    for produkt in produkty:
        db.add(produkt)
    db.commit()
    print("Produkty dodane!")
else:
    print("Produkty już istnieją, pomijam...")

db.close()
print("Gotowe!")