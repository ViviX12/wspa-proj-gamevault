# GameVault 🎮

Sklep internetowy z grami cyfrowymi – projekt studencki.

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

GameVault to sklep internetowy z grami cyfrowymi. Użytkownicy mogą przeglądać dostępne gry, zakupić je i pobrać z własnej biblioteki. Projekt powstał w ramach przedmiotu Projekt Zespołowy Systemu Informatycznego na WSPA w Lublinie.

---

## Autorzy

- Dawid Sałata nr albumu 21744
- Krzysztof Sosnówka nr albumu 21752
- Olaf Laszczowski nr albumu 22485
- Maksym Jagodziński nr albumu 21648 – backend, baza danych

---

## Technologie

Frontend: HTML, CSS, JavaScript

Backend: Python, FastAPI, SQLAlchemy

Baza danych: PostgreSQL

Autoryzacja: JWT, bcrypt

---

## Sprint Plan

Sprint 1 | Konfiguracja środowiska, baza danych, podstawowe API | 31.03.2026

Sprint 2 | Rejestracja, logowanie, zakup gier, biblioteka | 14.04.2026

Sprint 3 | Recenzje, integracja frontend-backend | 28.04.2026

Sprint 4 | Testy, poprawki, prezentacja | 12.05.2026

---

## Funkcjonalności

- [x] Przeglądanie katalogu gier
- [x] Rejestracja i logowanie
- [x] Zakup gry
- [x] Biblioteka zakupionych gier
- [x] Historia zamówień
- [ ] Recenzje produktów
- [ ] Wyszukiwanie i filtrowanie
- [ ] Integracja z frontendem

---

## Architektura projektu

Aplikacja działa w architekturze klient-serwer. Frontend to statyczne strony HTML/CSS/JS które komunikują się z backendem przez REST API. Backend napisany w FastAPI obsługuje całą logikę – rejestrację, logowanie, zakupy i bibliotekę. Dane przechowywane są w bazie PostgreSQL. Autoryzacja opiera się na tokenach JWT – po zalogowaniu użytkownik dostaje token który wysyła przy każdym zapytaniu wymagającym logowania.

---

## Instalacja

Wymagania: Python 3.12+, PostgreSQL 17+, Git

1. Sklonuj repozytorium
```
git clone https://github.com/ViviX12/wspa-proj-gamevault.git
cd wspa-proj-gamevault
```

2. Stwórz środowisko wirtualne i zainstaluj biblioteki
```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

3. Stwórz bazę danych o nazwie gamevault w PostgreSQL (przez pgAdmin lub terminal)

4. Stwórz plik .env w folderze backend
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gamevault
DB_USER=postgres
DB_PASSWORD=twoje_haslo
SECRET_KEY=twoj_tajny_klucz
```

---

## Uruchomienie aplikacji

### Backend
```
cd backend
python -m uvicorn main:app --reload
```
Backend działa na http://127.0.0.1:8000

Dokumentacja API dostępna na http://127.0.0.1:8000/docs

### Frontend
Otwórz plik index.html w przeglądarce.

---

## Instrukcja użytkownika

1. Otwórz aplikację w przeglądarce
2. Załóż konto lub zaloguj się
3. Przeglądaj dostępne gry w katalogu
4. Kliknij na grę żeby zobaczyć szczegóły
5. Kup grę – pojawi się w Twojej bibliotece
6. W bibliotece znajdziesz wszystkie zakupione gry

---

## Struktura repozytorium

```
wspa-proj-gamevault/
├── backend/                  – logika aplikacji
│   ├── models/               – tabele bazy danych
│   │   ├── user.py           – użytkownicy
│   │   ├── product.py        – produkty i kategorie
│   │   ├── order.py          – zamówienia
│   │   └── library.py        – biblioteka użytkownika
│   ├── routes/               – endpointy API
│   │   ├── auth.py           – rejestracja i logowanie
│   │   ├── products.py       – produkty
│   │   └── orders.py         – zamówienia i biblioteka
│   ├── auth.py               – JWT i hashowanie haseł
│   ├── database.py           – konfiguracja bazy danych
│   ├── main.py               – główny plik aplikacji
│   └── seed.py               – dane testowe
├── sklep/                    – interfejs użytkownika
├── requirements.txt          – biblioteki Python
├── .gitignore
└── README.md
```

---

## API

| Metoda | Endpoint | Opis | Wymaga logowania |
|--------|----------|------|-----------------|
| GET | /products | Lista produktów | Nie |
| GET | /products/{id} | Szczegóły produktu | Nie |
| POST | /auth/register | Rejestracja | Nie |
| POST | /auth/login | Logowanie | Nie |
| POST | /orders | Zakup produktu | Tak |
| GET | /orders/{user_id} | Historia zamówień | Tak |
| GET | /library/{user_id} | Biblioteka użytkownika | Tak |

---

## Status projektu

Sprint 2 ukończony. Projekt w trakcie rozwoju.

---

## Licencja

Projekt edukacyjny – WSPA Lublin 2025/2026
