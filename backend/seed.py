from database import SessionLocal
from models.product import Product, Category
from models.user import User
import uuid

db = SessionLocal()
#tworzenie kategorii 
kategoria = Category(
    id=uuid.uuid4(),
    nazwa="Akcja",
    slug="akcja",
    opis="Gry akcji"
)
db.add(kategoria)
db.commit()
db.refresh(kategoria)

#dodawanie produktow 
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
        tytul="ea fc 26",
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
db.close()
print("Dane testowe dodane")