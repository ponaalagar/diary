---
name: Secure Journal & Growth Tracker — React Native
description: Build screens, components, and logic for a dark-mode-first React Native journaling and habit-tracking app using the project's design system, color palette, typography, and feature spec. Invoke whenever generating, editing, or scaffolding any part of this app.
---

## Overview

This skill governs all code generation for the **Secure Journal & Growth Tracker** — a private, encrypted journaling and habit-tracking mobile app built in **React Native** (Expo). Claude must follow the design system, component conventions, and feature spec defined below for every screen, component, hook, and utility it produces.

When invoked, Claude should:
1. Match the exact color tokens, typography, and visual effects from the design system.
2. Follow the feature spec for the correct data, interactions, and navigation structure.
3. Produce clean, typed TypeScript with clear component boundaries.
4. Prefer `StyleSheet.create` for styles; use inline styles only for dynamic values.
5. Keep components focused — one responsibility per file.

---

## Tech Stack & Project Conventions

- **Framework:** React Native with Expo (SDK 51+)
- **Language:** TypeScript (strict mode)
- **Navigation:** `expo-router` (file-based routing, tab layout)
- **State Management:** Zustand for global state; `useState`/`useReducer` for local UI state
- **Storage:** `expo-secure-store` for encrypted data; `AsyncStorage` for non-sensitive prefs
- **Icons:** `@expo/vector-icons` → `MaterialIcons` (Outlined variant where possible)
- **Charts:** `react-native-gifted-charts` or `victory-native`
- **Fonts:** `Manrope` loaded via `expo-font`
- **Animations:** `react-native-reanimated` for gestures and transitions
- **Biometrics:** `expo-local-authentication`

---

## Design System

### Color Tokens

Always define and import from a central `theme.ts` file. Never hard-code hex values inline.

```typescript
// src/theme/colors.ts
export const Colors = {
  // Backgrounds
  bgDark: '#111121',
  bgCard: '#1a1a32',
  bgCardAlt: '#1c1c21',

  // Accent
  primary: '#1717cf',
  primaryMuted: 'rgba(23,23,207,0.2)',

  // Text
  textPrimary: '#ffffff',
  textMuted: '#9494a8',

  // Semantic habit colors
  reading: '#9393c8',
  workout: '#f97316',   // orange-500
  productivity: '#8ab095',

  // Borders
  border: 'rgba(255,255,255,0.08)',

  // Surface overlays
  surfaceOverlay: 'rgba(255,255,255,0.06)',
};
```

### Typography

Load `Manrope` via `expo-font`. Use this scale:

```typescript
// src/theme/typography.ts
export const Typography = {
  heading1: { fontFamily: 'Manrope_700Bold', fontSize: 28, letterSpacing: -0.5 },
  heading2: { fontFamily: 'Manrope_700Bold', fontSize: 22, letterSpacing: -0.3 },
  heading3: { fontFamily: 'Manrope_600SemiBold', fontSize: 18 },
  body:     { fontFamily: 'Manrope_400Regular', fontSize: 15, lineHeight: 22 },
  bodyMed:  { fontFamily: 'Manrope_500Medium', fontSize: 15 },
  micro:    { fontFamily: 'Manrope_600SemiBold', fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase' },
};
```

### Visual Effect Patterns

**Glassmorphism header:**
```typescript
// Use BlurView from expo-blur
<BlurView intensity={60} tint="dark" style={styles.header}>
  {children}
</BlurView>
// header style: position absolute, borderBottomWidth: 1, borderColor: Colors.border
```

**Ambient glow (background radial gradient):**
```typescript
// Use a large, absolutely-positioned View with borderRadius = width/2
// backgroundColor: Colors.primaryMuted, width: 300, height: 300, blur via MaskedView or LinearGradient
// Place behind content at top/center of screen
```

**Card shadows:**
```typescript
shadowColor: Colors.primary,
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.25,
shadowRadius: 16,
elevation: 8,
```

### Card Component Rules

- `borderRadius: 20` for main blocks, `16` for smaller cards
- `backgroundColor: Colors.bgCard`
- `borderWidth: 1`, `borderColor: Colors.border`
- Padding: `16` standard, `20` for featured cards

### Icon Usage Pattern

Icons always render inside a tinted circular container:
```typescript
// Icon with tinted background
<View style={[styles.iconContainer, { backgroundColor: `${color}18` }]}>
  <MaterialIcons name={iconName} size={20} color={color} />
</View>
// iconContainer: width 36, height 36, borderRadius 18, alignItems center, justifyContent center
```

---

## App Feature Spec

### Screen 1 — Authentication (Secure Vault)

**Route:** `/auth` (shown on cold launch before main tabs)

**UI Elements:**
- Full-screen dark background (`Colors.bgDark`) with ambient glow
- Pulsing red dot + lock icon indicator (`status: "VAULT LOCKED"` in micro typography)
- PIN numpad: 3×4 grid of circular buttons, `Colors.surfaceOverlay` background, `Colors.textPrimary` text
- PIN dots: 6 empty/filled circles showing entry progress
- Primary CTA: "Unlock with Face ID" button — solid `Colors.primary`, `borderRadius: 50`, full width
- "Forgot Password?" link in `Colors.textMuted`

**Logic:**
- Use `expo-local-authentication` for biometric unlock
- On success → `router.replace('/(tabs)/diary')`
- On 5 failed PIN attempts → lock for 30 seconds

---

### Screen 2 — Daily Diary (Home)

**Route:** `/(tabs)/diary`

**Header:**
- Current date in `heading3`, "ENCRYPTED" badge (micro label, `Colors.primary` tint, pill shape)
- "Save" button (small, `Colors.primary`, `rounded-full`)
- Glassmorphism `BlurView` header

**Journal Entry Section:**
- Multi-line `TextInput`, `Colors.bgDark` background, `Manrope_400Regular`, placeholder in `Colors.textMuted`
- Formatting toolbar: Bold, Italic, List, Image icons

**Daily Habits Section (Habit Tracking):**

| Habit | Control | Color |
|---|---|---|
| Reading | +/- counter showing pages | `Colors.reading` |
| Workout | Minutes input + progress bar | `Colors.workout` |
| Productivity | Toggle switch | `Colors.productivity` |

Each habit row: icon container + label + control, inside a card.

**Weekly Streak Card:**
- Gradient card (`Colors.primary` → `#6366f1`), flame icon, "X Days" in `heading1`
- `LinearGradient` from `expo-linear-gradient`

---

### Screen 3 — Activity History

**Route:** `/(tabs)/history`

**Search Bar:**
- `Colors.bgCard` background, `borderRadius: 12`, search icon (`Colors.textMuted`)

**Filter Pills:**
- Horizontal `ScrollView`, pill buttons: All / Reading / Workout / Productivity
- Active pill: `Colors.primary` background; inactive: `Colors.surfaceOverlay`

**Timeline:**
- Section headers: "Today", "Yesterday" in `micro` typography
- Activity cards show: icon, title, metadata (pages/duration/calories), timestamp

---

### Screen 4 — Calendar & Productivity

**Route:** `/(tabs)/calendar`

**Monthly Calendar Grid:**
- 7-column grid, day cells color-coded:
  - Productive: `Colors.productivity`
  - Journaled only: `Colors.primary`
  - No entry: `Colors.border`
- Selected day: white ring border

**Day Preview Card:**
- Slides up on day select (Reanimated `useAnimatedStyle`)
- Shows tags (Reading, Workout, Coding) as colored pills
- Journal entry snippet in `body` typography

**Stats Row:**
- 3 metric chips: Current Streak / Productive Days / Total Entries

---

### Screen 5 — Insights Dashboard

**Route:** `/(tabs)/insights`

**High-Level Metrics Row:**
- 3 cards side by side: Total Pages, Avg Workout (min), Current Streak

**Reading Chart:**
- 7-day line chart, smooth bezier, gradient fill fading to transparent, `Colors.reading`
- Percentage change badge (green/red)

**Fitness Chart:**
- 7-day bar chart, rounded top corners, `Colors.productivity`

---

### Navigation

**Bottom Tab Bar:**

```typescript
// Tabs: Diary | History | Insights | Settings
// Icons: edit_note | history | insights | settings
// Active tint: Colors.primary
// Tab bar: Colors.bgCard background, borderTopColor: Colors.border, height: 64
```

**Floating Action Button (FAB):**
- Position: `absolute`, `bottom: 80`, `right: 24`
- Size: 56×56, `borderRadius: 28`, `backgroundColor: Colors.primary`
- Shadow using card shadow pattern
- Icon: `add` (MaterialIcons)

---

## Folder Structure

```
src/
├── app/
│   ├── auth.tsx
│   ├── (tabs)/
│   │   ├── diary.tsx
│   │   ├── history.tsx
│   │   ├── calendar.tsx
│   │   ├── insights.tsx
│   │   └── settings.tsx
│   └── _layout.tsx
├── components/
│   ├── ui/
│   │   ├── Card.tsx
│   │   ├── IconBadge.tsx
│   │   ├── PillButton.tsx
│   │   ├── FAB.tsx
│   │   └── StreakCard.tsx
│   ├── habits/
│   │   ├── ReadingCounter.tsx
│   │   ├── WorkoutInput.tsx
│   │   └── ProductivityToggle.tsx
│   ├── charts/
│   │   ├── ReadingLineChart.tsx
│   │   └── FitnessBarChart.tsx
│   └── auth/
│       ├── PinPad.tsx
│       └── BiometricButton.tsx
├── store/
│   ├── journalStore.ts
│   ├── habitStore.ts
│   └── authStore.ts
├── hooks/
│   ├── useBiometrics.ts
│   └── useHabits.ts
├── theme/
│   ├── colors.ts
│   └── typography.ts
└── utils/
    ├── encryption.ts
    └── dateHelpers.ts
```

---

## Code Quality Rules

1. **No magic numbers** — define spacing and size constants in `theme/spacing.ts`.
2. **No inline hex colors** — always reference `Colors.*`.
3. **Always type props** — every component has an explicit `Props` interface.
4. **Accessibility** — every interactive element has `accessibilityLabel` and `accessibilityRole`.
5. **Keyboard avoiding** — all forms wrapped in `KeyboardAvoidingView`.
6. **Safe area** — all screens use `useSafeAreaInsets()` or `SafeAreaView`.
7. **Loading & empty states** — every data-fetching component handles loading/empty/error.

---

## Example Component Output

When generating a component, Claude should follow this pattern:

```typescript
// src/components/ui/Card.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/theme/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  featured?: boolean;
}

export function Card({ children, style, featured = false }: CardProps) {
  return (
    <View style={[styles.base, featured && styles.featured, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },
  featured: {
    borderRadius: 20,
    padding: 20,
  },
});
```

---

## When to Apply This Skill

Always invoke this skill when:
- Creating any new screen, component, or hook for this app
- Editing existing files to match the design system
- Scaffolding navigation, store, or utility files
- Generating chart, auth, or habit-tracking logic
- Reviewing code for style or convention compliance
