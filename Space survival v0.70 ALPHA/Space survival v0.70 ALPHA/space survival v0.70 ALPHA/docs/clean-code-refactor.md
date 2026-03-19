# Wdrożenie Zasad Clean Code: Space Survival

Ten dokument śledzi proces refaktoryzacji projektu zgodnie z 5 wybranymi zasadami Clean Code, prowadząc do wersji 1.0.0.

## Wybrane Zasady Clean Code

Poniżej znajduje się 5 zasad, które zostaną zaimplementowane w kolejnych wersjach aplikacji w celu poprawy jakości i czytelności kodu.

### 1. Nazwy o Znaczeniu (Meaningful Names)
- **Problem:** Niespójne i niekonwencjonalne nazwy plików (`space.survival.JS.js`) oraz zbyt ogólne nazwy zmiennych (`keys`).
- **Planowane rozwiązanie:** Zmiana nazw plików na standardowe (`js.js`, `style.css`) oraz poprawa nazw kluczowych zmiennych na bardziej opisowe (`keyboardState`).

### 2. Unikaj "Magicznych Liczb" (Avoid Magic Numbers)
- **Problem:** W kodzie znajduje się wiele liczb (np. wymiary gracza, prędkości, szanse na spawn) bez żadnego kontekstu, co utrudnia modyfikację i zrozumienie logiki.
- **Planowane rozwiązanie:** Stworzenie centralnego obiektu konfiguracyjnego `GAME_CONFIG`, który zbierze wszystkie te wartości w jednym miejscu z opisowymi nazwami.

### 3. Funkcje Powinny Robić Jedną Rzecz (SRP)
- **Problem:** Główna funkcja `gameLoop` jest przeładowana odpowiedzialnością – zarządza logiką, renderowaniem i aktualizacją UI jednocześnie.
- **Planowane rozwiązanie:** Podział `gameLoop` na dwie oddzielne funkcje: `update()` dla logiki gry i `draw()` dla rysowania na canvas.

### 4. Nie Powtarzaj Się (DRY)
- **Problem:** Wartości początkowe gry (np. `score = 0`) są zdefiniowane na początku skryptu, a następnie powtórzone w funkcji `restartGame`.
- **Planowane rozwiązanie:** Stworzenie funkcji `resetGameState`, która będzie jedynym źródłem prawdy o stanie początkowym, czerpiąc dane z `GAME_CONFIG`.

### 5. Grupuj Dane w Struktury (Encapsulate State)
- **Problem:** Wszystkie zmienne stanu gry (`score`, `gameRunning`, `player`, `asteroids`) są rozproszone w globalnym scope, co utrudnia zarządzanie.
- **Planowane rozwiązanie:** Zebranie wszystkich zmiennych stanu w jeden obiekt `gameState`, co ułatwi ich śledzenie i modyfikację.
