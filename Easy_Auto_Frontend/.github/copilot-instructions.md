<!-- .github/copilot-instructions.md - guidance for AI coding agents -->

# Copilot / AI Agent Instructions

Purpose: quick, actionable guidance so an AI contributor can be productive in this Expo + Expo Router TypeScript app.

**Quick Start:**

- **Install / Run:** Use the repo root and run `npm install`, then `npm run start`.
- **Platform targets:** `npm run android`, `npm run ios`, `npm run web` (all use Expo dev server).
- **Reset script:** `npm run reset-project` runs `scripts/reset-project.js` to clear derived state.

**Project Type & Key libs:**

- **Framework:** Expo (managed) with `expo-router` — routing is file-system based under `app/`.
- **Routing / Navigation:** `expo-router`, `@react-navigation/*`; stack and tabs are composed via `app/_layout.tsx` and `app/(tabs)/_layout.tsx`.
- **Common libs:** `react-native-reanimated`, `@expo/vector-icons`, `expo-*` packages.

**Important Files / Patterns (examples):**

- `app/_layout.tsx` — root Stack. Note `unstable_settings.anchor = '(tabs)'` and the `Stack.Screen` for `(tabs)` and `modal`.
- `app/(tabs)/_layout.tsx` — Tabs layout; tabs defined with `Tabs.Screen` names that map to `app/(tabs)/index.tsx` and `app/(tabs)/explore.tsx`.
- `app/modal.tsx` — modal route shown by the stack with `presentation: 'modal'`.
- `components/` — reusable UI pieces; e.g. `components/haptic-tab.tsx` is used as `tabBarButton` in the tabs layout.
- `constants/theme.ts` and `hooks/use-color-scheme.ts` — theme and color-scheme utilities; components use `Colors[colorScheme]`.

**Import alias:**

- Source imports use the `@/` alias (e.g. `import { HapticTab } from '@/components/haptic-tab';`). Check `tsconfig.json` for the `paths` mapping.

**Conventions & expectations for changes:**

- Routes map 1:1 to files under `app/`. To add a screen, create `app/<route>.tsx` or folder + `index.tsx`.
- Layout files (`_layout.tsx`) provide wrapper nav configuration — modify layouts to change global navigation behavior.
- Prefer default-exported React components for screens (matches existing files).
- Keep TypeScript types in place; project uses `typescript` dev dependency.

**Dev workflow & debugging tips:**

- Start dev server with `npm run start` and use Expo DevTools to open on simulator or device.
- For web, use `npm run web` which runs Expo web build.
- Linting: `npm run lint` (uses `expo lint`).

**Where to look for examples:**

- UI pattern: `components/ui/*` (icons, themed text/view, collapsible patterns).
- Route + navigation: `app/_layout.tsx`, `app/(tabs)/_layout.tsx`, `app/modal.tsx`.
- Platform-specific hooks: `hooks/use-color-scheme.ts` and `hooks/use-color-scheme.web.ts`.

**What NOT to assume:**

- This repository is an Expo-managed app — do not run plain `react-native` CLI commands expecting native project files.
- There are no automated tests in the repo root; do not invent test runners or CI steps unless added.

If something in this guidance is unclear or you want extra examples (e.g. adding a new tab screen, or how to update theme tokens), say which area and I will expand with concrete file edits.
