# Changelog

Wszystkie zmiany będą zapisywanę w tym pliku.

### Added
- Pliki dokumentacji: `CHANGELOG.md` oraz `docs/clean-code-refactor.md`.
- Centralny obiekt konfiguracyjny `GAME_CONFIG` do łatwego zarządzania parametrami gry.
- Obiekt `gameState` grupujący wszystkie zmienne stanu gry dla lepszej enkapsulacji.
- Struktura komentarzy w `game.js` dzieląca kod na logiczne sekcje.

### Changed
- **(Clean Code #1: Nazwy o Znaczeniu)** - Ustandaryzowano nazewnictwo plików (`js.js`, `style.css`) i kluczowych zmiennych (`keyboardState`).
- **(Clean Code #2: Unikanie Magicznych Liczb)** - Wszystkie zahardkodowane wartości (prędkości, rozmiary, kolory) zostały przeniesione do `GAME_CONFIG`.
- **(Clean Code #3: SRP)** - Główna pętla gry (`gameLoop`) została zrefaktoryzowana i podzielona na osobne funkcje `update()` (logika) i `draw()` (rysowanie).
- **(Clean Code #4: DRY)** - Zunifikowano logikę startu i restartu gry w funkcji `resetGameState`, aby unikać powtórzeń kodu.
- **(Clean Code #5: Enkapsulacja Stanu)** - Wszystkie zmienne globalne przechowujące stan gry zostały przeniesione do obiektu `gameState`.