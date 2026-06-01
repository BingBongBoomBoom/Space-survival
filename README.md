## Space Survival — v1.0 Final Release (PROJOPP_AP_Final)

Oficjalne, produkcyjne wydanie aplikacji (Wersja 1.0) realizujące pełne wytyczne projektu końcowego z przedmiotu PROJOPP.

---

### 📑 RAPORT Z ETAPU 7: TESTOWANIE APLIKACJI (PROJOPP_AP_e7)

Zgodnie z wytycznymi zaimplementowano i przeprowadzono **DWIE metody testowania** oprogramowania w celu zapewnienia stabilności wersji finalnej:

#### 1. Metoda Testów Automatycznych (Jednostkowych)
* **Opis:** Napisanie niezależnego skryptu sprawdzającego logikę biznesową gry bez udziału interfejsu graficznego.
* **Realizacja:** Wstrzyknięto do silnika funkcję `runAutomatedTests()`. Testuje ona w izolacji warunki brzegowe gry (m.in. blokadę maksymalnej liczby żyć na poziomie 5, naliczanie punktów za bonusy oraz poprawność redukcji czasu trwania tarczy ochronnej).
* **Wynik:** Pomyślna asercja wszystkich przypadków testowych (Status: 4/4 PASSED).

#### 2. Metoda Testów Manualnych (Eksploracyjnych z użyciem Panelu Diagnostycznego)
* **Opis:** Weryfikacja reakcji UI, skalowania trudności oraz stanów gry za pomocą deweloperskich skrótów klawiszowych.
* **Realizacja:** Do kodu dodano ukryte mapowanie klawiszy (Cheat Menu):
  * `H` – Wymuszenie $+100$ punktów (Weryfikacja dynamicznego wzrostu prędkości asteroid).
  * `J` – Natychmiastowe wywołanie tarczy energetycznej (Weryfikacja nakładania filtrów graficznych Canvas).
  * `K` – Symulacja natychmiastowej śmierci (Weryfikacja zatrzymania pętli gry i wywołania ekranu Game Over).
* **Wynik:** Interfejs oraz pamięć lokalna (`localStorage`) poprawnie synchronizują i zapisują stany gry pod rygorem gwałtownych zmian zmiennych systemowych.

---

### 📦 ZAWARTOŚĆ WYDANIA V1.0 (Etap 8):
1. **Kod źródłowy:** Pełna, zoptymalizowana implementacja zawarta w plikach `index.html`, `js.js` oraz `style.css`.
2. **Architektura:** Klient skryptowy niewymagający kompilacji ani zewnętrznych frameworków.
3. **Weryfikacja działania:** Pełna integracja zapisu najlepszych wyników, filtrów graficznych CRT-scanlines oraz dynamicznej zmiany skórek statku.

### 🚀 INSTRUKCJA URUCHOMIENIA:
1. Pobierz załączone poniżej pliki źródłowe (lub pobierz archiwum ZIP kodu źródłowego).
2. Rozpakuj zawartość.
3. Kliknij dwukrotnie plik `index.html` — gra uruchomi się natychmiast w dowolnej przeglądarce internetowej.
