# Publishing Burmese Calendar to the App Store and Google Play

Everything here runs in the cloud through Expo (EAS). You do not need a Mac or Android Studio. You only need a computer with Node.js and a terminal.

## 0. What you pay and how long it takes

| | Apple App Store | Google Play |
|---|---|---|
| Account | Apple Developer Program, **US$99 per year** | Play Console, **US$25 once** |
| Sign-up wait | Usually 1–2 days (ID check) | Usually 1–2 days (ID check) |
| Extra rule | none | New **personal** accounts must run a **closed test with 12+ testers for 14 days in a row** before going public |
| Review | Usually 1–3 days | A few days after the test |
| Expo account | Free (free plan includes a monthly quota of cloud builds) | same |

Plan about **3 weeks** end to end. Google's 14-day test is the slowest part, so start it first.

## 1. One-time setup (about 15 minutes)

```bash
# get the code
git clone https://github.com/RichardNaing/Burmese-Family-Calendar-.git
cd Burmese-Family-Calendar-/mobile
npm install

# check it works on your phone first: install "Expo Go" from the store, then
npx expo start          # scan the QR code with your phone camera
```

Create a free account at https://expo.dev, then link the project:

```bash
npx eas-cli@latest login
npx eas-cli@latest init      # creates the project on expo.dev and writes its id into app.json
```

Commit the change `init` makes to `app.json`.

## 2. Google Play

1. Sign up at https://play.google.com/console ($25). Choose **Personal** unless you have a registered company with a D-U-N-S number. Organization accounts skip the 12-tester rule.
2. **Create app** → name `Burmese Calendar မြန်မာပြက္ခဒိန်`, App, Free.
3. Build the Android app bundle:
   ```bash
   npx eas-cli@latest build --platform android --profile production
   ```
   EAS creates and keeps the upload signing key for you. Say **yes** when it asks.
4. The first upload must be manual: in Play Console go to **Testing → Closed testing → Create track**, download the `.aab` from the EAS build page and upload it.
5. Fill in **Store listing** (text and images are in `store/LISTING.md` and `store/`), **App content** (privacy policy URL, Data safety = no data collected, Ads = no, target audience 18+), and **Content rating** (answer No to everything).
6. Add testers: put 12–20 Gmail addresses on the closed-testing list (family, store owners, friends). Send them the opt-in link. They must stay opted in for 14 days.
7. After 14 days: **Apply for production** in the dashboard, answer the questions, then promote the release to Production.
8. Later updates can go straight from the terminal once you create a Google service account key (EAS walks you through it):
   ```bash
   npx eas-cli@latest build --platform android --profile production --auto-submit
   ```

## 3. Apple App Store

1. Enroll at https://developer.apple.com/programs/enroll/ ($99/year). Use an Apple Account with two-factor authentication on. As an individual, your legal name shows as the seller.
2. Build and send to Apple in one go:
   ```bash
   npx eas-cli@latest build --platform ios --profile production --auto-submit
   ```
   Sign in with your Apple Account when asked. EAS creates the certificates, the app record in App Store Connect (bundle id `com.itgardenmalaysia.burmesecalendar`) and uploads the build.
3. In https://appstoreconnect.apple.com open the app:
   - Paste the listing text from `store/LISTING.md` and upload `store/screenshots/iphone-6.9-*.png`.
   - **App Privacy** → Data Not Collected.
   - **Age rating** → answer None to everything (4+).
   - Pick the uploaded build. Encryption is already declared "none" in `app.json`.
4. Optional: test on your own iPhone first with **TestFlight** (the build appears there automatically).
5. **Add for Review** → **Submit**.

## 4. Shipping an update

1. Make the change, then bump `"version"` in `app.json` (for example `1.0.0` → `1.1.0`). Build numbers increase on their own.
2. Run the same build/submit commands. For small JavaScript-only fixes you can also use `npx eas-cli@latest update` without a store review. That needs `expo-updates`; ask before turning it on.

**Every year:** when the State Gazette announces next year's holidays, add them to `src/lib/holidays.ts`. Until then the app shows calculated holidays labelled "Calculated". Then run `npm test` and ship an update.

## 5. Before every release

```bash
npm run typecheck && npm run lint && npm test
```

## Common rejections and how this app avoids them

- *Missing privacy policy* → hosted at `/privacy/` on your GitHub Pages site.
- *Apple 4.2 "minimum functionality"* → native tabs, offline calculations, reminders and two languages go beyond a wrapped website.
- *Unused Android permissions* → storage and overlay permissions are blocked in `app.json`.
- *Apple privacy manifest* → `app.json` declares the one API the app uses (UserDefaults, for settings).
