# UI Command — Master Knowledge Base

Central reference for the `/ui` command system. All UI skills derive their authority from this document.

---

## 1. Tailwind Plus Resource Library

### 1.1 Templates — https://tailwindcss.com/plus/templates
Premium, full-site templates built on Tailwind CSS. Each template is a complete starting point for a specific application type.

**Available Template Categories:**
- **SaaS / Application** — Dashboard layouts, admin panels, multi-page app shells
- **Marketing** — Landing pages, pricing pages, feature showcases
- **E-commerce** — Product pages, cart, checkout flows
- **Blog / Content** — Article pages, author profiles, tag/category archives
- **Documentation** — Sidebar navigation, code highlighting, API reference layouts

**Usage Pattern:**
1. Identify the template category matching the project type
2. Reference the template's component structure as the baseline
3. Adapt tokens (colors, fonts, spacing) to match the detected project design system
4. Do not deviate from the template's responsive breakpoint strategy unless explicitly requested

**Key Characteristics of Tailwind Plus Templates:**
- Mobile-first responsive design using `sm:`, `md:`, `lg:`, `xl:`, `2xl:` breakpoints
- Uses Tailwind CSS v3/v4 utility classes — no custom CSS unless unavoidable
- Dark mode via `dark:` variant — always implement alongside light mode
- Consistent spacing scale: `p-4`, `p-6`, `p-8`, `gap-4`, `gap-6`, `gap-8`
- Typography: `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-4xl`, `font-semibold`, `font-bold`
- Shadows: `shadow-sm`, `shadow`, `shadow-md`, `shadow-lg`
- Border radius: `rounded`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-full`

---

### 1.2 UI Kit — https://tailwindcss.com/plus/ui-kit
Production-ready React components built on Headless UI + Tailwind CSS. The official component library for building accessible, composable interfaces.

**Component Categories:**

| Category | Components |
|----------|-----------|
| **Application UI** | Application shells, Navbars, Sidebars, Page headings, Card layouts |
| **Overlays** | Modals, Drawers, Notification toasts, Alert dialogs |
| **Navigation** | Tabs, Breadcrumbs, Pagination, Steps, Command palettes |
| **Data Display** | Tables, Stats, Activity feeds, Calendars, Lists |
| **Forms** | Input groups, Select menus, Radio/Checkbox groups, Date pickers, Toggles |
| **Feedback** | Loading states, Empty states, Error pages (404, 500), Success states |

**Implementation Rules for UI Kit Components:**
- Import from `@headlessui/react` for interactive components (Dialog, Menu, Combobox, Listbox, Tabs, Disclosure)
- Always include `aria-*` attributes as specified in Headless UI docs
- Use `transition` + `TransitionChild` for animated enter/leave states
- Prefer controlled components with explicit `open`/`setOpen` state
- Never use `z-index` values outside the scale: `z-10`, `z-20`, `z-30`, `z-40`, `z-50`

---

### 1.3 UI Blocks / Marketing — https://tailwindcss.com/plus/ui-blocks/marketing
Pre-built marketing section blocks that snap into any page. Each block is a self-contained HTML/JSX section.

**Block Categories:**

| Block Type | Description |
|------------|-------------|
| **Hero Sections** | Full-width hero, split hero, app screenshot hero, gradient hero |
| **Feature Sections** | 3-column features, icon features, screenshot features, alternating features |
| **Pricing Sections** | 2-tier, 3-tier, comparison table pricing |
| **CTA Sections** | Simple CTA, image CTA, newsletter signup CTA |
| **Testimonial Sections** | Grid testimonials, carousel, large quote |
| **Team Sections** | Card grid, list format, avatar row |
| **Logo Clouds** | Simple grid, scrolling strip, with heading |
| **Stats Sections** | Numbers grid, with description, banner stats |
| **FAQ Sections** | Two-column accordion, simple list |
| **Newsletter Sections** | Inline form, centered form, split form |
| **Contact Sections** | Split with map, simple contact form, contact info list |
| **Header / Navbar** | Simple centered, with flyout menus, dark header |
| **Footer** | Simple footer, multi-column, with newsletter |

**Usage Rules:**
- Each block uses Tailwind CSS utility classes only — no inline styles
- Blocks are designed for `max-w-7xl mx-auto` container width
- Section padding: `py-16 sm:py-24 lg:py-32` — always use responsive padding
- Background variations: `bg-white`, `bg-gray-50`, `bg-gray-900`, gradient via `bg-gradient-to-r`

---

## 2. Project Configuration Schema

When `/ui setup` runs, it detects and stores this configuration in `UI_Command/project-config.json`:

```json
{
  "framework": "next|react|vue|svelte|astro|html",
  "version": "string",
  "styling": "tailwind|css-modules|styled-components|sass",
  "tailwindVersion": "3|4",
  "componentLibrary": "headlessui|shadcn|radix|mui|none",
  "designTokens": {
    "primaryColor": "string",
    "fontFamily": "string",
    "borderRadius": "none|sm|md|lg|xl",
    "darkMode": true
  },
  "projectType": "saas|marketing|ecommerce|blog|docs|dashboard|other",
  "tailwindPlusTemplate": "string|null",
  "srcDir": "src|app|pages|.",
  "componentDir": "string",
  "detectedAt": "ISO timestamp"
}
```

---

## 3. Skill Map

| Skill | File | Auto-invoked for |
|-------|------|-----------------|
| `ui-setup` | `skills/ui-setup/SKILL.md` | `/ui setup` |
| `ui-tailwind-templates` | `skills/ui-tailwind-templates/SKILL.md` | `/ui template`, `/ui setup` |
| `ui-tailwind-ui-kit` | `skills/ui-tailwind-ui-kit/SKILL.md` | `/ui component`, `/ui page` |
| `ui-tailwind-blocks` | `skills/ui-tailwind-blocks/SKILL.md` | `/ui block`, `/ui page` |
| `ui-component-builder` | `skills/ui-component-builder/SKILL.md` | `/ui component`, `/ui page` |
| `ui-responsive-design` | `skills/ui-responsive-design/SKILL.md` | All modes |
| `ui-accessibility` | `skills/ui-accessibility/SKILL.md` | All modes |

---

## 4. Common Mistakes to Avoid

| Mistake | Correct Approach |
|---------|-----------------|
| Using arbitrary pixel values (`w-[347px]`) | Use Tailwind scale (`w-80`, `w-96`) unless explicitly needed |
| Hardcoding colors (`text-[#3b82f6]`) | Use semantic Tailwind tokens (`text-blue-500`) |
| Missing dark mode variants | Every `bg-white` needs `dark:bg-gray-900`, every `text-gray-900` needs `dark:text-white` |
| Skipping mobile breakpoint | Always start with mobile layout, add `md:` and `lg:` |
| Non-semantic HTML | Use `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>` |
| Missing aria attributes on interactive elements | Every button, link, modal, dropdown needs proper aria |
| Inline onClick without keyboard handler | All interactive elements need `onKeyDown` or use native button/a |

---

## 5. File Output Conventions

- **Component files**: `.tsx` for TypeScript React, `.jsx` for JavaScript React, `.vue` for Vue
- **Always export as named export**: `export function HeroSection() {}`
- **Props interface at top of file** (TypeScript): `interface HeroSectionProps { ... }`
- **No default exports** unless required by framework routing
- **One component per file** — never bundle multiple components in one file
- **File naming**: PascalCase for components (`HeroSection.tsx`), kebab-case for pages (`about-us.tsx`)

---

## 6. Environment Variables

| Variable | Purpose |
|----------|---------|
| None required | UI command works entirely with file system — no API keys needed |

Tailwind Plus resources are referenced via URL — the agent uses the browser MCP to inspect them when needed.
