# Burmese Family Calendar · မိသားစု ပြက္ခဒိန်

A Burmese-first family wall calendar. Every day shows the Gregorian date **and** its Myanmar lunar date, moon phase, Sabbath (ဥပုသ်) days, and Myanmar + Thai (+ optional US) holidays — the same information as the printed *Myanmar & Thailand Calendar*, plus a clock, family events and Google Calendar.

## Views

| View | What it shows |
|---|---|
| **Wall** (`#wall`) | Landscape tablet display: clock, today's Myanmar date, moon-phase picture, Sabbath / holiday badges, next full moon and Sabbath, upcoming holidays, rolling 4-week grid. Dims 10 pm – 6 am. |
| **Month** (`#month`) | Print-style grid: large Gregorian numbers, Burmese waxing/waning day numerals, red ● full moon / black ● new moon, pink public holidays, blue Thai holidays, Myanmar-year header (e.g. ၁၃၈၈ ခုနှစ်၊ နတ်တော်-ပြာသို). |
| **Year** (`#year`) | 12 mini-months with moon and holiday markers. |
| **Day details** | Tap any day: full Myanmar date, Sasana year, moon, Sabbath, Yatyaza / Pyathada, dragon-head direction, holidays, and family events (add / remove). |

Settings (gear icon): holiday layers (Myanmar / Thai / US), Sabbath markers, astrology layer, Google Calendar, night dimming, week start.

## Run it

`index.html` is a single self-contained file (engine and fonts embedded) — open it in any browser, or set it as a kiosk / full-screen page on the wall tablet. Works offline.

Family events are saved in the browser (`localStorage`). When hosted as a claude.ai artifact, events are stored in the artifact's shared database so every device sees the same events, and the Google Calendar connector shows your calendar events.

## Develop

```bash
npm install      # fonts (@fontsource) for the build
npm run build    # src/app.html + vendor/mmcal engine + fonts -> index.html
npm test         # golden tests against the printed 2027 calendar
```

- `src/app.html` — the app (HTML/CSS/JS). Edit this, then rebuild.
- `vendor/mmcal/ceMmDateTime.js` — Myanmar calendar engine by Dr. Yan Naing Aye (MIT).
- `scripts/build.mjs` — inlines the engine and embeds Noto Sans Myanmar + Inter as base64 woff2.
- `tests/golden-2027.test.mjs` — every waxing/waning day of Jan, Feb, May and Dec 2027 must match the printed calendar (121/121), plus the 1389 New Year date.

## Data sources

- **Lunar dates, moon phases, Sabbath, astrology:** mmcal algorithm.
- **2027 Myanmar public holidays and Thai holidays:** transcribed from the printed 2027 Myanmar & Thailand Calendar (red = Myanmar public holiday, blue = Thai). Edit `MM_2027`, `MM_OBS_2027`, `TH_FIXED`, `TH_YEAR` in `src/app.html` to update.
- **Other years:** Myanmar holidays from mmcal's standard rules (government one-off extra days are not included); Thai fixed-date holidays only — Thai lunar holidays (Makha / Visakha / Asahna Bucha) need to be added per year in `TH_YEAR`, since Thai lunar dates don't always match Myanmar ones.

## Typography

- Burmese: **Noto Sans Myanmar** (embedded), falling back to Pyidaungsu, Padauk, Myanmar Text, Myanmar Sangam MN.
- Latin & numerals: **Inter**.
- Unicode only (no Zawgyi); Burmese line-height 1.6–1.8; Burmese digits for lunar days, Western digits for Gregorian dates.

See [`docs/PLAN.md`](docs/PLAN.md) for the design research and roadmap, and [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) for licenses.

## Roadmap

- [x] Calendar engine + golden tests
- [x] Print-style month grid, wall display, year view, day details
- [x] Family events, Google Calendar overlay
- [ ] Photo slideshow on the wall panel
- [ ] Weather
- [ ] Thai lunar holidays for 2028+; Myanmar 2028 holiday list once announced
- [ ] Kanote festival themes for Thadingyut / Tazaungdaing
- [ ] Printable PDF month export
