# GameVault 🎮

Sklep internetowy z grami cyfrowymi - projekt studencki.

## Spis treści

1. [Opis projektu](#opis-projektu)
2. [Autorzy](#autorzy)
3. [Technologie](#technologie)
4. [Sprint Plan](#sprint-plan)
5. [Funkcjonalności](#funkcjonalności)
6. [Architektura projektu](#architektura-projektu)
7. [Instalacja](#instalacja)
8. [Uruchomienie aplikacji](#uruchomienie-aplikacji)
9. [Instrukcja użytkownika](#instrukcja-użytkownika)
10. [Struktura repozytorium](#struktura-repozytorium)
11. [API](#api)
12. [Status projektu](#status-projektu)
13. [Licencja](#licencja)

---

## Opis projektu

GameVault to sklep internetowy z grami cyfrowymi. Użytkownicy mogą przeglądać i wyszukiwać dostępne gry, zakupić je, zarządzać własną biblioteką oraz wystawiać recenzje. System rozpoznaje zalogowanych użytkowników i blokuje możliwość ponownego zakupu gry którą już posiadają. Projekt powstał w ramach przedmiotu Projekt Zespołowy Systemu Informatycznego na WSPA w Lublinie.

---

## Autorzy

- Dawid Sałata nr albumu 21744 – UI/UX Design
- Krzysztof Sosnówka nr albumu 21752 – Frontend, HTML/CSS
- Olaf Laszczowski nr albumu 22485 – Frontend, JavaScript/React
- Maksym Jagodziński nr albumu 21648 – Backend, baza danych

---

## Technologie

**Frontend:** React (Vite), JavaScript (ES6+), HTML5, CSS3, react-router-dom

**Backend:** Python 3.12, FastAPI, SQLAlchemy

**Baza danych:** PostgreSQL 17

**Autoryzacja:** JWT (JSON Web Tokens), bcrypt

**Narzędzia:** Git, GitHub, pgAdmin 4, Postman

---

## Sprint Plan

| Sprint | Cel | Termin |
|--------|-----|--------|
| Sprint 1 | Konfiguracja środowiska, baza danych, podstawowe API | 31.03.2026 |
| Sprint 2 | Rejestracja, logowanie (JWT), zakup gier, biblioteka | 14.04.2026 |
| Sprint 3 | Recenzje, CORS, integracja frontend-backend | 28.04.2026 |
| Sprint 4 | Wyszukiwanie, filtrowanie, testy, poprawki, prezentacja | 12.05.2026 |

---

## Funkcjonalności

- [x] Przeglądanie katalogu gier pobieranych z bazy danych
- [x] Wyszukiwanie gier po tytule
- [x] Filtrowanie gier po kategorii i sortowanie po cenie/ocenie
- [x] Rejestracja i logowanie użytkownika (JWT)
- [x] Auto-logowanie po odświeżeniu strony (token w localStorage)
- [x] Profil zalogowanego użytkownika (GET /auth/me)
- [x] Zakup gry z walidacją tokena JWT
- [x] Biblioteka zakupionych gier (tylko gry danego użytkownika)
- [x] Historia zamówień
- [x] Recenzje produktów (tylko dla posiadaczy gry)
- [x] Blokada zakupu gry którą użytkownik już posiada
- [x] Toast notifications zamiast alertów przeglądarki
- [x] Integracja frontend-backend (CORS)
- [x] Dane testowe (seed.py)

---

## Architektura projektu

Aplikacja działa w architekturze klient-serwer. Frontend to nowoczesna aplikacja typu SPA (Single Page Application) zbudowana w React przy użyciu Vite. Komponenty (Shop, Product, Library, Cart, Auth) komunikują się z backendem przez REST API za pomocą fetch. Nawigacja działa bez przeładowywania strony dzięki react-router-dom.

Backend napisany w FastAPI obsługuje całą logikę biznesową — rejestrację, logowanie, zakupy, bibliotekę i recenzje. Dane przechowywane są w bazie PostgreSQL z relacjami między tabelami (users, products, orders, library, reviews). Autoryzacja opiera się na tokenach JWT — po zalogowaniu użytkownik otrzymuje token który przesyła w nagłówku Authorization przy każdym chronionym zapytaniu. CORS jest skonfigurowany co umożliwia komunikację między frontendem a backendem.

---

## Instalacja

**Wymagania:** Python 3.12+, PostgreSQL 17+, Node.js 18+ (LTS), Git

### 1. Sklonuj repozytorium
```bash
git clone https://github.com/ViviX12/wspa-proj-gamevault.git
cd wspa-proj-gamevault
```

### 2. Konfiguracja backendu
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Stwórz bazę danych
Otwórz pgAdmin lub terminal i stwórz bazę danych o nazwie `gamevault`:
```sql
CREATE DATABASE gamevault;
```

### 4. Stwórz plik .env w folderze backend
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gamevault
DB_USER=postgres
DB_PASSWORD=twoje_haslo
SECRET_KEY=twoj_tajny_klucz
```

### 5. Dodaj dane testowe
```bash
python seed.py
```

### 6. Konfiguracja frontendu
Node.js jest wymagany — pobierz wersję LTS z [nodejs.org](https://nodejs.org/).
```bash
cd ../sklep
npm install
```

---

## Uruchomienie aplikacji

### Backend
```bash
cd backend
python -m uvicorn main:app --reload
```
Backend działa na: **http://127.0.0.1:8000**

Dokumentacja API (Swagger): **http://127.0.0.1:8000/docs**

### Frontend
```bash
cd sklep
npm run dev
```
Frontend działa na: **http://localhost:5173**

---

## Instrukcja użytkownika

1. Otwórz aplikację w przeglądarce pod adresem **http://localhost:5173**
2. Załóż konto klikając "Zaloguj się" → formularz rejestracji
3. Zaloguj się - system zapamiętuje sesję po odświeżeniu strony
4. Przeglądaj katalog gier lub wyszukaj po nazwie
5. Kliknij na grę żeby zobaczyć szczegóły i cenę
6. Dodaj grę do koszyka i przejdź do płatności
7. Po zakupie gra pojawia się w Twojej bibliotece
8. W bibliotece możesz zainstalować zakupione gry
9. Na stronie produktu możesz wystawić recenzję grze którą posiadasz

---

## Struktura repozytorium

```
wspa-proj-gamevault/
├── backend/                    – logika aplikacji (Python/FastAPI)
│   ├── models/                 – modele bazy danych (SQLAlchemy)
│   │   ├── user.py             – tabela użytkowników
│   │   ├── product.py          – tabela produktów i kategorii
│   │   ├── order.py            – tabela zamówień i pozycji zamówień
│   │   ├── library.py          – tabela biblioteki użytkownika
│   │   └── review.py           – tabela recenzji
│   ├── routes/                 – endpointy API
│   │   ├── auth.py             – rejestracja, logowanie, profil
│   │   ├── products.py         – produkty, wyszukiwanie, filtrowanie
│   │   ├── orders.py           – zamówienia i biblioteka
│   │   └── reviews.py          – recenzje produktów
│   ├── auth.py                 – JWT i hashowanie haseł (bcrypt)
│   ├── database.py             – konfiguracja połączenia z PostgreSQL
│   ├── main.py                 – główny plik aplikacji, CORS
│   └── seed.py                 – dane testowe (8 gier)
├── sklep/                      – frontend aplikacji (React + Vite)
│   ├── public/
│   │   └── img/                – obrazki gier
│   ├── src/
│   │   ├── components/         – komponenty aplikacji
│   │   │   ├── App.jsx         – główny router, stany globalne, toast
│   │   │   ├── Shop.jsx        – strona sklepu i katalog gier
│   │   │   ├── Product.jsx     – strona szczegółów produktu
│   │   │   ├── Library.jsx     – biblioteka użytkownika
│   │   │   ├── Cart.jsx        – koszyk i płatności
│   │   │   └── Auth.jsx        – logowanie i rejestracja
│   │   ├── main.jsx            – punkt wejścia Reacta
│   │   └── style.css           – globalne style aplikacji
│   ├── index.html
│   └── package.json
├── requirements.txt            – biblioteki Python
├── .gitignore
└── README.md
```

---

## API

| Metoda | Endpoint | Opis | Wymaga logowania |
|--------|----------|------|-----------------|
| GET | /products | Lista produktów (obsługuje ?search, ?category, ?sort_by, ?limit) | Nie |
| GET | /products/{id} | Szczegóły produktu | Nie |
| POST | /auth/register | Rejestracja nowego użytkownika | Nie |
| POST | /auth/login | Logowanie – zwraca token JWT | Nie |
| GET | /auth/me | Dane zalogowanego użytkownika | Tak |
| POST | /orders | Zakup produktu | Tak |
| GET | /orders/{user_id} | Historia zamówień użytkownika | Tak |
| GET | /library/{user_id} | Biblioteka zakupionych gier | Tak |
| GET | /reviews/{product_id} | Lista recenzji produktu | Nie |
| POST | /reviews | Dodanie recenzji (wymaga posiadania gry) | Tak |

### Parametry filtrowania produktów
```
GET /products?search=wiedźmin        - szukaj po tytule
GET /products?category=akcja         - filtruj po kategorii
GET /products?sort_by=current_price  - sortuj po cenie rosnąco
GET /products?sort_by=average_rating - sortuj po ocenie malejąco
GET /products?limit=10               - ogranicz liczbę wyników
```

---

## Status projektu

✅ Sprint 1 - ukończony

✅ Sprint 2 - ukończony

✅ Sprint 3 - ukończony

✅ Sprint 4 - ukończony

**Projekt ukończony w ramach kursu Projekt Zespołowy Systemu Informatycznego - WSPA Lublin 2025/2026.**

---

## Licencja

Projekt edukacyjny - Wyższa Szkoła Przedsiębiorczości i Administracji w Lublinie 2025/2026.
