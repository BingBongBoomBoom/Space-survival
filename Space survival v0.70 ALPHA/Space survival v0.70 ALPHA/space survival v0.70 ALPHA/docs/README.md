# 🚀 Space Survival

## 🎯 Cel gry
Celem gry jest **przetrwanie jak najdłużej** w kosmosie, unikając asteroid i zbierając power-upy.
Gracz steruje rakietą, która porusza się w lewo i prawo, a każda zebrana tarcza lub bonus punktowy zwiększa szansę na dłuższe przetrwanie.

-----------------------------

## ⚙️ Zasada działania
- **Rakieta** porusza się w lewo/prawo (strzałeczki na klawiaturze "<- oraz ->").
- **Asteroidy** spadają z góry z różną prędkością.
- **Kolizja z asteroidą** kończy grę, chyba że gracz ma aktywną tarczę lub więcej żyć.
- Wynik punktowy rośnie wraz z unikaniem przeszkód.

## 🎁 Power-upy i tarcza
- **Tarcza (`tarcza`)**: power-up włącza tarczę na ok. `7` sekund. Gdy tarcza jest aktywna, pierwsze trafienie asteroidą nie zabiera życia (tarcza zostaje wtedy wyłączona).
- **Bonus punktowy (`bonus`)**: zwiększa wynik o `+25` punktów po zebraniu.
- **Dodatkowe życie (`życie`)**: zwiększa liczbę żyć o `+1` (maksymalnie do `5`) po zebraniu.

## 🏆 Leaderboard
Po zakończeniu gry wynik jest zapisywany lokalnie (`localStorage`) i trafia do rankingu `top 5`, filtrowanego według poziomu trudności.