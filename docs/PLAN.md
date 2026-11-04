# Burmese Digital Calendar — Design Research & Build Plan

## 1. What we're building

A wall-mounted / tablet "family command center" that is **Burmese-first**: every day shows the Gregorian date and its Myanmar lunar date, moon phase, Sabbath (ဥပုသ်) days, and Myanmar + Thai (+ optional US) holidays — the same information the printed "Myanmar & Thailand Calendar" carries — plus clock, photos and family events.

**Design principle:** keep the information density and visual code Burmese readers already know from the print calendar, and modernize typography, spacing and interaction.

## 2. What the reference print calendar does

| Element | Print calendar | Digital |
|---|---|---|
| Header | Large English month + year, month number in a black block, Myanmar year + lunar months spanned (e.g. ၁၃၈၈ ခုနှစ်၊ နတ်တော်-ပြာသို) | Same three-part header |
| Weekday bar | Black bar; Sun and Sat in pink | Same, plus Burmese weekday names |
| Day number | Large heavy numeral, top-right | Same |
| Lunar day | Small Burmese numeral bottom-left | Same |
| Moon phase label | Only on change days: လဆန်း, လပြည့်, လဆုတ်, လကွယ် | Same |
| Moon markers | Red dot = full moon, black dot = new moon | Same color code |
| Holidays | Pink/red = Myanmar public holiday; blue = Thai/other | Same two-tier code |
| Language | Burmese lunar text + English holiday names | Bilingual by default |

## 3. Burmese design preferences

- **Information-rich over minimal.** Popular Myanmar calendar apps compete on how much traditional information they show: full moons, Sabbath and Sabbath eve, Yatyaza / Pyathada, dragon-head direction, astrological days. Astrology is a toggle.
- **Color.** Red + gold (pagoda gilding, red-and-black lacquerware) reads festive and auspicious.

| Token | Hex | Use |
|---|---|---|
| Lacquer red | #9B1C1C | Full moon, public holidays, today |
| Lacquer black | #1A1A1A | New moon, weekday bar, numerals |
| Pagoda gold | #C9A227 | Accents, Sabbath ring, ornaments |
| Paper | #FAF6EE | Light background |
| Holiday pink | #F2C4C4 | Public-holiday fill |
| Observance blue | #BFD5EE | Thai holiday fill |

- **Ornament.** Kanote (ကနုတ်) lotus-tendril scroll, used sparingly (header border, wall panel texture).
- **Numerals.** Burmese digits for lunar days and Myanmar year; Western digits for Gregorian dates.

## 4. Fonts

| Font | Role | License |
|---|---|---|
| Noto Sans Myanmar | Primary Burmese UI font (embedded) | OFL |
| Pyidaungsu | Government-standard font; fallback / print | Free (myanmar.gov.mm) |
| Padauk (SIL) | Fallback, covers Shan/Mon/Karen | OFL |
| Myanmar Text / Myanmar Sangam MN | System fallback | System |
| Inter | Gregorian numerals and English | OFL |

Rules: Unicode only (never Zawgyi); Burmese line-height 1.6–1.8; Burmese set ~10–15% larger than Latin; no italics; no fixed-height text boxes.

## 5. Calendar engine

- mmcal by Dr. Yan Naing Aye (MIT) — lunar dates, moon phase, Sabbath, astrology, standard holidays.
- 2027 holidays from the printed calendar; editable tables in `src/app.html`.
- Golden tests against the printed 2027 calendar.

## 6. Build phases

| Phase | Deliverable | Status |
|---|---|---|
| 0 — Direction | Research, palette, fonts | Done |
| 1 — Engine | mmcal + holiday tables + golden tests | Done |
| 2 — Month grid | Print-style month view | Done |
| 3 — Display mode | Clock, moon, wall grid, night dimming, Google Calendar | Done (no weather / photos yet) |
| 4 — Polish | Kanote festival themes, photos, Burmese/English toggle | Next |
| 5 — Ship | Kiosk setup on the tablet; printable PDF export | Next |

## Sources

- Pyidaungsu as government-recommended Unicode font — Global Voices: https://rising.globalvoices.org/blog/2019/09/06/unified-under-one-font-system-as-myanmar-prepares-to-migrate-from-zawgyi-to-unicode/
- awesome-myanmar-unicode: https://www.github.com/khzaw/awesome-myanmar-unicode
- Burmese script rendering guardrails — 1-StopAsia: https://www.1stopasia.com/blog/?p=13892
- mmcal: https://github.com/yan9a/mmcal
- Kanote wood-carving tradition — SEAsite NIU: https://seasite.niu.edu/Burmese/Culture/exquisite_art_of_wood.htm
