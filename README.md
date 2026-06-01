# Space Survival Game

🚀 Retro-Cyberpunkowa kosmiczna gra zręcznościowa uruchamiana bezpośrednio w przeglądarce internetowej. Przetrwaj w pasie asteroid, zbieraj ulepszenia i walcz o jak najwyższe miejsce w rankingu!

---

## 🎮 Jak uruchomić grę?

Gra nie wymaga żadnej instalacji, kompilacji ani pobierania dodatkowych programów. Jest napisana w czystym JavaScript, HTML5 i CSS3.

1. Pobierz pliki projektu (`index.html`, `js.js`, `style.css`).
2. Umieść je wszystkie **w jednym wspólnym folderze**.
3. Kliknij dwukrotnie plik **`index.html`** (otworzy się automatycznie w Twojej przeglądarce).

---

## 🕹️ Sterowanie

* **Ruch statkiem w lewo:** Klawisz <kbd>A</kbd> lub Strzałka w lewo <kbd>←</kbd>
* **Ruch statkiem w prawo:** Klawisz <kbd>D</kbd> lub Strzałka w prawo <kbd>→</kbd>

---

## 🚀 Mechanika Rozgrywki

Twoim zadaniem jest unikanie nadlatujących z góry asteroid. Gra posiada 3 poziomy trudności (Easy, Medium, Hard). Im dłużej utrzymasz się przy życiu, tym szybciej poruszają się przeszkody.

### Bonusy do zebrania (Power-upy):
* 🛡️ **Tarcza (Cyanowy okrąg):** Aktywuje barierę energetyczną, która całkowicie pochłania następne uderzenie asteroidy.
* 💎 **Punkty (Żółty diament):** Natychmiastowo zasila Twój wynik o dodatkowe **+25 punktów**.
* ❤️ **Życie (Czerwone serce):** Regeneruje 1 punkt zdrowia (maksymalna pula żyć wynosi 5).

---

## 📊 System Zapisu Wyników (Leaderboard)

Najlepsze wyniki są automatycznie i trwale zapisywane w pamięci podręcznej Twojej przeglądarki (`localStorage`). Ranking jest segregowany osobno dla każdego poziomu trudności, dzięki czemu możesz na bieżąco śledzić i bicie własnych rekordów.

---

## 🛠️ Skróty Diagnostyczne (Dla Testerów)

Jeśli chcesz przetestować zachowanie silnika gry na skrajne sytuacje, użyj poniższych klawiszy na klawiaturze w trakcie lotu:
* <kbd>H</kbd> – Dodaje $+100$ punktów (pozwala sprawdzić, jak gra przyspiesza wraz ze wzrostem wyniku).
* <kbd>J</kbd> – Natychmiastowo wymusza odpalenie tarczy ochronnej.
* <kbd>K</kbd> – Resetuje życia do 0 i natychmiast wywołuje ekran końca gry (Game Over).

---

## 📄 Licencja

Projekt dystrybuowany na warunkach **Licencji MIT**. Możesz go dowolnie modyfikować, kopiować i rozwijać.
