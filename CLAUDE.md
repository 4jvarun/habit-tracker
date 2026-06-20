# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Git workflow

Commit and push to GitHub regularly — after every meaningful change, not just when asked. This repo is the user's backup/rollback point, so uncommitted or unpushed work defeats the purpose.

- Remote: `origin` → `https://github.com/4jvarun/habit-tracker.git`, branch `master`.
- After finishing a change (a feature, a fix, a notable edit), stage it, commit with a clear message describing *why* the change was made, and `git push` right away.
- Don't batch up multiple unrelated changes into one commit — commit each logical change separately.
- Still follow standard git safety: no force-push, no amending commits already pushed, ask before any destructive operation (`reset --hard`, history rewrites, etc.).

## Commands

```bash
npm run dev       # start Vite dev server (http://localhost:5173)
npm run build     # tsc -b (typecheck) then vite build
npm run lint      # eslint .
npm run preview   # preview a production build
npx tsc -b --noEmit   # typecheck only, no emit
```

There is no test suite configured in this project (no test script, no test runner installed).

## Architecture

Single-page habit tracker: React 19 + TypeScript + Vite, styled with Tailwind CSS v4 (via `@tailwindcss/postcss`, no `tailwind.config.js` needed — v4 auto-scans source files). No backend, no router, no global state library. All data lives in the browser via `localStorage`.

**State flow:** `src/hooks/useHabits.ts` is the single source of truth. It loads/saves an array of `Habit` objects (`src/types.ts`) to `localStorage` under the key `habit-tracker:habits`, and exposes `addHabit`, `toggleToday`, `deleteHabit`. `App.tsx` calls this hook once and passes the habits array and handlers down as props to `HabitForm` (create) and `HabitList` → `HabitItem` (per-habit display/actions). There is no other state management.

**Data model:** a `Habit` has `id`, `name`, `emoji`, `color` (hex string), `createdAt`, and `completedDates` (array of `"YYYY-MM-DD"` date-key strings — completion is tracked as a list of completed days, not a boolean per day object). `loadHabits()` in `useHabits.ts` back-fills `emoji`/`color` defaults for habits persisted before those fields existed, so don't assume stored data always matches the current `Habit` shape exactly.

**Dates:** all date math goes through `src/utils/date.ts`. Dates are represented as local `"YYYY-MM-DD"` string keys (`toDateKey`/`todayKey`/`dateKeyToDate`), deliberately built from local `Date` components rather than `toISOString()` to avoid UTC-offset day-shift bugs. `getCurrentStreak` counts backward from today but treats today as not-yet-broken if it isn't completed yet (so the streak doesn't visually reset before the day is over). `getCompletionRate` computes a % over the last N days via `lastNDays`.

**Per-habit color/emoji:** `src/constants.ts` defines the preset `HABIT_EMOJIS` list and `HABIT_COLORS` palette (hex values) offered in `HabitForm`. Because each habit's color is chosen at runtime, it's applied via inline `style` (not Tailwind utility classes like `bg-green-600`) in `HabitItem` and `HabitForm` — Tailwind's static scanner can't pick up dynamically-constructed class names, so any new per-habit visual styling driven by `habit.color` must use inline styles, not class-name string-building.

**Removal:** deleting a habit (`HabitItem`'s trash icon) goes through a native `window.confirm` before calling `onDelete`, since it permanently discards that habit's `completedDates` history.
