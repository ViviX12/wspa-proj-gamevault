from database import SessionLocal
from models.product import Product, Category
from models.user import User  # ZMIANA: Dodano import modelu User, co naprawia błąd klucza obcego (Foreign Key)
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
    print("Kategoria 'Akcja' dodana!")
else:
    print("Kategoria 'Akcja' już istnieje, pomijam...")

# ZMIANA: Rozszerzono listę do 8 gier, aby sklep lepiej prezentował się na pokazie projektu
gry_do_dodania = [
    {"tytul": "Cyberpunk 2077", "slug": "cyberpunk-2077", "opis": "Futurystyczna gra RPG", "base_price": 199.99, "current_price": 99.99},
    {"tytul": "Wiedźmin 3", "slug": "wiedzmin-3", "opis": "Najlepsza gra RPG wszech czasów", "base_price": 149.99, "current_price": 49.99},
    {"tytul": "EA FC 26", "slug": "eafc26", "opis": "Najnowsza odsłona EA FC", "base_price": 249.99, "current_price": 249.99},
    {"tytul": "Grand Theft Auto V", "slug": "gta-v", "opis": "Kultowa gra akcji od Rockstar Games", "base_price": 129.99, "current_price": 64.99},
    {"tytul": "Red Dead Redemption 2", "slug": "rdr-2", "opis": "Niesamowita przygoda na Dzikim Zachodzie", "base_price": 249.99, "current_price": 124.99},
    {"tytul": "Counter-Strike 2", "slug": "cs-2", "opis": "Najpopularniejsza strzelanka taktyczna", "base_price": 0.00, "current_price": 0.00},
    {"tytul": "Hogwarts Legacy", "slug": "hogwarts-legacy", "opis": "Magiczny świat Harry'ego Pottera", "base_price": 269.99, "current_price": 189.99},
    {"tytul": "Minecraft", "slug": "minecraft", "opis": "Zbuduj swój własny świat", "base_price": 109.99, "current_price": 109.99}
]

# ZMIANA: Dodano nową logikę sprawdzającą każdą grę z osobna, co pozwala wielokrotnie odpalać skrypt bez tworzenia duplikatów
for gra in gry_do_dodania:
    istnieje = db.query(Product).filter(Product.slug == gra["slug"]).first()
    if not istnieje:
        nowy_produkt = Product(
            id=uuid.uuid4(),
            tytul=gra["tytul"],
            slug=gra["slug"],
            opis=gra["opis"],
            base_price=gra["base_price"],
            current_price=gra["current_price"],
            id_kategorii=kategoria.id,
            status="active"
        )
        db.add(nowy_produkt)
        print(f"Dodano nową grę: {gra['tytul']}")
    else:
        print(f"Gra już jest w bazie: {gra['tytul']}")

db.commit()
db.close()
print("Gotowe! Baza została zaktualizowana.")