# PMKUSUM

---

> **A React Native mobile app for the PM‑KUSUM solar programme**, built for JREDA. Field workflows (survey, inspection, insurance, JCR), asset tracking, and live plant monitoring — written in TypeScript with Redux Toolkit, React Query, and NativeWind. This README is the hand‑over reference for any developer joining the project.

## Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Quick Start (Local Development)](#quick-start-local-development)
- [Project Structure](#project-structure)
- [Path Aliases](#path-aliases)
- [Architecture Overview](#architecture-overview)
- [Screens & Feature Map](#screens--feature-map)
- [State Management & Data Fetching](#state-management--data-fetching)
- [API Layer](#api-layer)
- [Styling](#styling)
- [Testing & Linting](#testing--linting)
- [Building & Release](#building--release)
- [Contributing & Handover Guide](#contributing--handover-guide)
- [Troubleshooting & FAQ](#troubleshooting--faq)
- [Contact & Maintainers](#contact--maintainers)

---

## Project Overview
`PMKUSUM` is the field & monitoring companion app for the PM‑KUSUM solar
scheme. It covers the operational lifecycle of a site:

- **Authentication** with a multi‑step registration flow
- **Dashboard** with summary tiles and quick navigation
- **Live plant status** (geolocation + real‑time metric cards)
- **Performance & analysis** views with charts
- **Field workflows** — Survey, Inspection, Insurance, JCR (Joint Commissioning Report), Asset details
- **Payments** via Razorpay

Core characteristics:
- **Modular screen hierarchy** under `src/screens/`, each feature with its own `components/`
- **Centralised navigation** in `src/navigation/AppNavigator.tsx` (auth vs. main stacks, lazy‑loaded screens)
- **Redux Toolkit store** with `redux-persist` (auth persisted to AsyncStorage)
- **Server‑state** via React Query (`src/services/queryClient.ts`)
- **Single Axios client** with a bearer‑token interceptor (`src/api/apiClient.ts`)
- **NativeWind v4** (Tailwind classes in JSX)
- **Type‑safe** end‑to‑end with TypeScript 5.x and path aliases

---

## Tech Stack
| Category         | Library / Tool                                              | Version                            |
|------------------|-------------------------------------------------------------|------------------------------------|
| **Framework**    | react-native                                                | 0.85.3                             |
| **UI runtime**   | react                                                       | 19.2.3                             |
| **Language**     | typescript                                                  | 5.8.3                              |
| **Navigation**   | @react-navigation/native, native-stack                      | ^7.2.4 / ^7.15.1                   |
| **Screens/Safe** | react-native-screens, react-native-safe-area-context        | ^4.25.2 / ^5.5.2                   |
| **State**        | @reduxjs/toolkit, react-redux                               | ^2.12.0 / ^9.3.0                   |
| **Persistence**  | redux-persist + @react-native-async-storage/async-storage   | ^6.0.0 / ^3.1.0                    |
| **Server State** | @tanstack/react-query                                       | ^5.100.11                          |
| **HTTP**         | axios                                                       | ^1.16.1                            |
| **Forms**        | react-hook-form + @hookform/resolvers + zod                 | ^7.76.0 / ^5.4.0 / ^4.4.3          |
| **Styling**      | nativewind + tailwindcss                                    | ^4.0.36 / ^3.4.19                  |
| **Charts**       | react-native-gifted-charts, react-native-svg                | ^1.4.77 / ^15.15.5                 |
| **Media/UI**     | react-native-video, react-native-linear-gradient, 
                     react-native-swiper, react-native-reanimated-skeleton       | ^6.19.2 / ^2.8.3 / ^1.6.0 / ^1.6.0 |
| **Payments**     | react-native-razorpay                                       | ^3.0.0                             |
| **Icons**        | @react-native-vector-icons/* (ant-design, feather, fontawesome, fontawesome6, ionicons, material-icons, simple-line-icons) | ^13.1.x |
| **Testing**      | jest + react-test-renderer                                  | ^29.6.3 / 19.2.3                   |
| **Lint/Format**  | eslint + prettier                                           | ^8.19.0 / 2.8.8                    |

> JS engine: **Hermes** (enabled in `android/gradle.properties`). Node **≥ 22.11**.

---

## Quick Start (Local Development)
```bash
# 1. Clone
git clone <repo-url>
cd PMKUSUM

# 2. Install dependencies
npm install

# 3. iOS pods (macOS only)
cd ios && bundle install && pod install && cd ..

# 4. Start Metro
npm start

# 5. Run on Android
npm run android      # react-native run-android --no-packager

# 6. Run on iOS (macOS)
npm run ios
```
> **Prerequisites**: Node ≥ 22.11, JDK 17+, Android SDK (and Xcode for iOS).
> `npm run android` starts without bundling Metro (`--no-packager`), so run
> `npm start` in a separate terminal first.

---

## Project Structure
```
PMKUSUM/
│   App.tsx                # Root component – wires all providers + AppLayout
│   index.js               # RN entry point
│   babel.config.js        # NativeWind preset + module-resolver aliases
│   tailwind.config.js     # Tailwind + NativeWind config
│   global.css             # Tailwind directives (imported once in App.tsx)
│   tsconfig.json          # TS compiler options + path aliases
│   metro.config.js        # Metro bundler config
│
├─ src/
│   ├─ api/                # apiClient.ts – shared Axios instance + interceptors
│   ├─ assets/             # images, fonts (SpaceGrotesk), video
│   ├─ components/
│   │   ├─ home/           # Home-screen sections
│   │   ├─ layout/         # AppLayout (drawer + navbar + gradient), Footer
│   │   └─ ui/             # Reusable UI; ui/form/ for form controls
│   ├─ config/             # (reserved for app config)
│   ├─ navigation/         # AppNavigator.tsx – stacks, routes, screen layout
│   ├─ screens/            # Feature screens (see Screens & Feature Map)
│   ├─ services/           # queryClient.ts – React Query client
│   ├─ store/              # store.ts (Redux + persist), slices/authSlice.ts
│   ├─ types/              # assets.d.ts, nativewind-env.d.ts
│   └─ utils/              # helpers.ts, shadows.ts, tilePalette.ts
│
├─ __tests__/              # App.test.tsx
├─ android/                # Native Android project (Gradle)
└─ ios/                    # Native iOS project (Xcode workspace)
```

---

## Path Aliases
Defined in **both** `babel.config.js` (module-resolver) and `tsconfig.json`
(keep them in sync):

| Alias          | Resolves to        |
|----------------|--------------------|
| `@/*`          | `src/*`            |
| `@components/*`| `src/components/*` |
| `@screens/*`   | `src/screens/*`    |
| `@navigation/*`| `src/navigation/*` |
| `@store/*`     | `src/store/*`      |
| `@services/*`  | `src/services/*`   |
| `@utils/*`     | `src/utils/*`      |
| `@constants/*` | `src/constants/*`  |
| `@assets/*`    | `src/assets/*`     |

---

## Architecture Overview
Provider order in **`App.tsx`** (order matters — see comments in the file):

```
Redux Provider → PersistGate → QueryClientProvider → SafeAreaProvider
  → NavigationContainer (transparent theme) → SafeAreaView → AppLayout → AppNavigator
```

- **`AppLayout`** (`src/components/layout/`) renders the gradient background,
  navbar, and drawer that wrap every screen.
- **`AppNavigator`** picks the initial route from the `auth` slice
  (`Dashboard` when authenticated, else `Home`) and renders **two distinct
  stacks** — logged‑out screens aren't mounted at all when authenticated.
- **Screens are lazy‑loaded** with `React.lazy` so the initial JS bundle stays small.
- A shared **`screenLayout`** wraps each route in a `KeyboardAvoidingView` +
  `ScrollView` with a sticky `Footer`, so keyboard handling and the footer are
  applied to every screen automatically (tuned for Android 15+ edge‑to‑edge).

---

## Screens & Feature Map
Routes are typed in `RootStackParamList` (`src/navigation/AppNavigator.tsx`).

**Public (unauthenticated) stack**
| Route      | Screen                                             |
|------------|----------------------------------------------------|
| `Home`     | `screens/home/HomeScreen`                          |
| `Register` | `screens/auth/register/RegisterIndex` (multi‑step) |

**Authenticated stack**
| Route         | Screen                              |
|---------------|-------------------------------------|
| `Dashboard`   | `screens/dashboard/Dashboard`       |
| `LiveStatus`  | `screens/liveStatus/LiveStatus`     |
| `Performance` | `screens/performance/Performance`   |
| `Analysis`    | `screens/analysis/Analysis`         |
| `Assets`      | `screens/assets/AssetDetails`       |
| `Insurance`   | `screens/insurance/Insurance`       |
| `Inspection`  | `screens/inspection/Inspection`     |
| `Survey`      | `screens/survey/Survey`             |
| `JCR`         | `screens/jcr/JCR`                   |

---

## State Management & Data Fetching
| Layer             | Responsibility                                                          |
|-------------------|-------------------------------------------------------------------------|
| **Redux Toolkit** | Global UI state & authentication (`store/slices/authSlice.ts`)          |
| **Redux‑Persist** | Persists the `auth` slice (token + user) to AsyncStorage via `whitelist`|
| **React Query**   | Server state, caching, retries, background refetch                      |
| **Axios**         | HTTP client with auth interceptor (`src/api/apiClient.ts`)              |

Typed Redux hooks are exported from `src/store/store.ts`: use
`useAppSelector` / `useAppDispatch` (never the raw react‑redux hooks). Only the
`auth` slice is whitelisted for persistence — add new slices to the whitelist
explicitly if they must survive an app restart.

---

## API Layer
- Single shared instance in **`src/api/apiClient.ts`** — route all calls through it.
- **Base URL**: `https://api.pmkusum.jreda.gov.in/api/v1` (timeout 15s).
- **Request interceptor** reads the latest token from the Redux store on every
  call and attaches `Authorization: Bearer <token>`.
- **Response interceptor** centralises error logging; `401` currently warns
  (refresh‑token flow is a documented TODO in the file).

---

## Styling
- **Tailwind config** in `tailwind.config.js`; directives in `global.css`,
  imported once in `App.tsx`.
- **NativeWind v4** enables `className` utilities directly in JSX (no separate
  StyleSheets for most styling).
- Shared style helpers live in `src/utils/` (`shadows.ts`, `tilePalette.ts`).
- App font: **Space Grotesk** (bundled under `src/assets/fonts/` and linked into native projects).

---

## Testing & Linting
```bash
# Unit tests (jest + react-test-renderer)
npm test

# Lint
npm run lint        # eslint .
```
> Tests live in `__tests__/`. ESLint config is `.eslintrc.js` (extends
> `@react-native/eslint-config`); formatting via Prettier.

---

## Building & Release
| Platform          | Command                                            |
|-------------------|----------------------------------------------------|
| **Android (APK)** | `cd android && ./gradlew assembleRelease`          |
| **Android (AAB)** | `cd android && ./gradlew bundleRelease`            |
| **iOS**           | Open `ios/PMKUSUM.xcworkspace` in Xcode → Archive  |

Android build notes (`android/app/build.gradle`):
- Per‑architecture **ABI splits** are enabled (`armeabi-v7a`, `arm64-v8a`,
  `x86_64`); `universalApk` is off. `x86_64` is for the emulator only.
- **Hermes** is enabled.
- Release currently signs with the **debug keystore** and has **ProGuard/R8
  disabled** — generate a real keystore and enable minification before
  publishing. See the official RN signing docs.

---

## Contributing & Handover Guide
1. **Branching** – `main` is stable; feature work on `feature/<name>`, merged via PR.
2. **Code style** – run `npm run lint` before committing.
3. **Commits** – conventional commits (`feat:`, `fix:`, `docs:`).
4. **Adding a route** – add it to `RootStackParamList` first, then register the
   `Stack.Screen` and lazy import in `AppNavigator.tsx`.
5. **New aliases** – update **both** `babel.config.js` and `tsconfig.json`.
6. **Persisting new state** – add the slice to the `whitelist` in `store.ts`.
7. **On‑boarding checklist**: install Node/JDK/Android SDK (+ Xcode), run
   `npm install` (and `pod install` for iOS), verify with `npm run lint` and
   `npm test`, then run on a device/emulator.

---

## Troubleshooting & FAQ
- **Metro hangs / stale bundle** – `npm start -- --reset-cache`.
- **`npm run android` shows a red screen** – Metro isn't running; start it with `npm start`.
- **iOS pod issues** – run `bundle exec pod install` after any native module change.
- **Android build fails** – ensure `JAVA_HOME` points to JDK 17+ and the Gradle wrapper is current.
- **Alias import not resolving** – confirm the alias exists in *both* `babel.config.js` and `tsconfig.json`, then reset the Metro cache.
- **Missing icons / fonts** – relink assets: `npx react-native-asset`.

---

## Contact & Maintainers
- **Primary maintainer**: R U Bharti (GitHub: @R-U-Bharti)
- **APK Link**: https://drive.google.com/drive/folders/17QzRBMJX7AYthqUd5xiSNlL1DrVLPccE?usp=drive_link


---
*Happy coding!*