# Burmese Calendar — iPhone & Android app

Expo (React Native, TypeScript) app built on the same mmcal engine as the wall calendar and the 2027 posters.

**Features:** the tactile board from the wall calendar (paper, pressed-in dimples, a ball you drag, flick or send to a day, with a light haptic tap when it lands), with Myanmar dates in Burmese numerals, full and new moons, Sabbath days, official 2027 holidays (calculated for other years, clearly labelled), a day page with Yatyaza, Pyathada, Naga head and Mahabote, a holiday list, Burmese/English UI and Sabbath-eve reminders. Fully offline, no data collected.

```bash
npm install
npx expo start         # run on your phone with Expo Go
npm test               # 2027 golden test (all 365 days) + helpers
npm run typecheck && npm run lint
```

| Path | What |
|---|---|
| `src/app/` | Screens (Expo Router): calendar, today, holidays, settings, `day/[date]` |
| `src/lib/calendar.ts` | All calendar logic |
| `src/lib/ball.ts` | Ball physics (port of `src/tactile.html`) |
| `src/components/TactileBoard.tsx` | The board: dimples, ball, shadows |
| `src/lib/holidays.ts` | Official holiday lists. Add each new year here |
| `src/engine/mmcal.js` | Generated from `../vendor/mmcal`. Rebuild with `npm run engine` |
| `store/` | Store listing text, screenshots, feature graphic |
| `PUBLISHING.md` | Step-by-step App Store and Google Play guide |

Bundle id / package: `com.itgardenmalaysia.burmesecalendar`

Design by IT Garden Malaysia (RN). mmcal © Dr. Yan Naing Aye, MIT License.
