---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics.
---

# Frontend Design (Hyphae POS)

Mandates for UI/UX in the Hyphae POS system.

## 1. Design Tokens (Zinc & Lime)

We use a strict **Zinc (Gray) + Lime (Accent)** aesthetic.

- **Backgrounds:** `bg-zinc-950` (App Bg), `bg-zinc-900` (Cards), `bg-zinc-800` (Fields).
- **Text:** `text-zinc-100` (Primary), `text-zinc-400` (Secondary), `text-zinc-600` (Disabled).
- **Accents:** `text-lime-400` (Highlights), `bg-lime-500` (Primary Actions).
- **Destructive:** `text-red-400`, `bg-red-500/10`.

## 2. Touch-First Targets

POS is a touch interface. Mouse pointers don't exist.

- **Min Target Size:** 44px (minimum). Recommended 56px for frequent actions.
- **Spacing:** `gap-4` or `gap-2`. Dense lists are hard to tap.
- **Feedback:** Use `active:scale-95` or `active:bg-zinc-700` for tactile feedback.

## 3. Motion & Animation

- **Transitions:** `transition-all duration-200 ease-out`.
- **Modals:** `animate-in zoom-in-95 fade-in duration-200`.
- **Lists:** Layout changes (Order Rail) must animate width/flex-grow.

## 4. Component Patterns

### The "Glass" Look
Use subtle transparency for overlays.
`backdrop-blur-md bg-zinc-900/80 border border-zinc-800`

### Numpads
Grid layout (3 columns).
Large buttons (`h-16`).
Monospace numbers (`font-mono`).

### Product Cards
- No images (for speed/cleanliness) or simplified icons.
- Clear price relative to text.
- Selected state: `ring-2 ring-lime-500 bg-lime-500/10`.

## 5. Typography

- **UI Text:** `Inter` (Clean, legible).
- **Data/Numbers:** `Space Mono` (Tabular figures, receipt styling).
- **Headers:** Uppercase `tracking-wider` often looks better for categories.
