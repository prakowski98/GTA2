# Uliczny Chaos - GTA 2 Inspired Browser Game

Pełna implementacja silnika gry inspirowanej GTA 2 w czystym JavaScript.

## Uruchomienie

### Metoda 1: Serwer HTTP (zalecane)

```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (npx)
npx http-server -p 8000

# PHP
php -S localhost:8000
```

Następnie otwórz: http://localhost:8000

### Metoda 2: Bezpośrednio z pliku

Niektóre przeglądarki (Firefox) pozwalają otworzyć `index.html` bezpośrednio.

## Sterowanie

- **WASD** - Ruch postaci / Prowadzenie pojazdu
- **SHIFT** - Bieg (na piechotę)
- **SPACJA** - Strzelanie
- **E** - Wejście/Wyjście z pojazdu

## Rozgrywka

- Eksploruj proceduralnie generowane miasto
- Znajdź zielone strefy aby rozpocząć misje
- Wykonuj misje: dostawy, eliminacje, destrukcje
- Unikaj lub walcz z policją
- Kradnij pojazdy (3 typy: auto, ciężarówka, sportowy)

## Systemy Gry

### Silnik
- Stała częstotliwość logiki (60 TPS)
- Interpolacja klatek dla płynności
- System entity-component
- Spatial grid dla kolizji

### Fizyka
- Kolizje AABB i okręgowe
- Impulsy i tarcie
- Kolizje z mapą i innymi obiektami

### AI
- Cywile: patrol, idle
- Policja: chase, attack
- Gangi: hostile AI
- Maszyny stanów z detekcją wzrokową

### Wanted System
- 5 poziomów poszukiwania (★★★★★)
- Zanikanie w czasie
- Detekcja świadków
- Dynamiczne spawnowanie policji

### Misje
- 3 typy misji (dostawa, eliminacja, destrukcja)
- System JSON-driven
- Śledzenie postępu

## Struktura Techniczna

```
game/
├── core/          - Silnik gry, pętla, czas
├── systems/       - Systemy (fizyka, AI, render, combat)
├── entities/      - Typy obiektów (gracz, NPC, pojazdy)
├── components/    - Komponenty (transform, physics, health)
├── world/         - Mapa, kamera, generacja świata
├── input/         - Obsługa wejścia
├── ui/            - HUD i interfejs
├── utils/         - Narzędzia (math, collision, spatial grid)
└── data/          - Dane (config, misje JSON)
```

## Debugowanie

Użyj `index-debug.html` aby zobaczyć szczegółowe logi inicjalizacji.

## Specyfikacja

- **Język:** Pure JavaScript ES6+ (moduły)
- **Rendering:** Canvas 2D
- **Rozmiar mapy:** 2560x2560 pikseli (80x80 kafelków)
- **Wielkość kafelka:** 32x32 piksele
- **Język interfejsu:** Polski

## Wydajność

- Generacja świata: ~50-100ms
- Rendering: 60 FPS (zależnie od sprzętu)
- Logika: 60 TPS (stała)

## Licencja

Kod oryginalny, brak zewnętrznych zależności. Gra inspirowana mechaniką GTA 2.
