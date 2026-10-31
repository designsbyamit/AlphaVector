# Signal: the portfolio design system, as used for AlphaVector

Status: **documented, not implemented as a system.** The AlphaVector marketing site wears Signal as a *skin*
(tokens, type, a handful of CSS classes). There is no component library, no design-system page and no shared
package. This file is the reference for what the skin is, where it came from and how far it has been applied.

Source of truth: `src/styles/tokens.css` in the portfolio repo (`designsbyamit/amit2.1`, live at neo.designsbyamit.com).
The older `docs/design-system.md` in that repo (Inter, warm palette) is out of date; ignore it.

## Rules (from the portfolio)

1. Text colour comes from the ink ramp, never from opacity.
2. Every text token passes WCAG 2.2 AA (4.5:1) on every surface token.
3. **Lime (signal) is a fill** for the one primary action and live status. It is never text on a light ground.
4. **Cobalt is for links and focus.** Nothing else is blue.
5. One primary button per view. Buttons are sentence case, 44px minimum height, 6px radius.
6. Display type is light (weight 200 to 300, 24px and above only). Running text is regular weight, 16px minimum.
7. Hairline dividers and cards, not heavy rules. Callouts are panels with an icon or plain text, never a coloured left border.
8. Hover changes a colour token. Only cards that are links get a hover state.

## Tokens

### Surfaces and ink (dark mode, the default)

| Token | Value | Use |
|---|---|---|
| bg | `#0F1013` | page |
| surface-1 | `#181A1F` | cards, header |
| surface-2 | `#22252B` | raised, inputs, menus |
| surface-3 | `#2C3038` | hover on raised |
| ink | `#ECEDEF` | headings, body (16.4:1) |
| ink-2 | `#C4C7CD` | long body, secondary (11.4:1) |
| ink-3 | `#A3A7B0` | labels, metadata (7.9:1) |
| faint | `#5D626C` | decorative only, never text |

Lines are ink at 10% (hairline), 18% (card border) and 42% (control border, 3:1 or better).

### Action and feedback

| Token | Dark | Light |
|---|---|---|
| signal (fill) | `#C8F55A` | `#C8F55A` (fill only) |
| on-signal (text on it) | `#0F1013` | `#0F1013` |
| signal-ink (signal as text) | `#C8F55A` | `#3F6B00` |
| link / link-hover / focus | `#7D98FF` / `#A5B8FF` / `#7D98FF` | `#3654E0` / `#2440B8` / `#3654E0` |
| danger | `#FF8A7A` | `#B42818` |

### Light mode (defined in the portfolio, not wired up on the AlphaVector site)

bg `#F5F6F7`, surface-1 `#FFFFFF`, surface-2 `#EEF0F2`, surface-3 `#E4E7EB`, ink `#0F1013`, ink-2 `#3A3E46`, ink-3 `#4D525C`.

### Image fields (identical in both modes)

cobalt `#1B2350`, teal `#0F3B3A`, plum `#33203F`, graphite `#22252B`. Text on them is `#ECEDEF`, accent `#C8F55A`.

### Type, space, shape, motion

- Sans: **Geist Variable**. Mono: **Geist Mono Variable** (tags, table headers, status labels, uppercase with letter-spacing).
- Display sizes use weight 200 to 300 with tracking from -0.02em to -0.045em. Body 16px minimum, labels and overlines 12px minimum.
- Space: 4px base, 8px rhythm. Container 1280px, gutter 24px (48px from 768px), section padding 72 / 96 / 128px.
- Radius: 4px (tags), 6px (buttons, inputs), 10px (cards, menus), pill (chips, toggles).
- Motion: ease `cubic-bezier(0.16, 1, 0.3, 1)`; 160ms for state changes, 280ms for surfaces, 600ms for entrances. Respect `prefers-reduced-motion`.

### Component behaviour (specification only)

| Component | Behaviour |
|---|---|
| Button | primary = signal fill; secondary = 1px control border; ghost = underlined text. Disabled at 45% opacity. |
| Chip | pill with a visible border, clickable. Selected = filled with ink. |
| Tag | mono text with a `/` prefix, not clickable, no hover. |
| Card | surface-1, 1px hairline border, 10px radius, 24px padding (32px from 768px). |
| Field | surface-1, control border, 6px radius, 16px text so iOS does not zoom. |
| Link | cobalt, always underlined in running text. |
| Table | mono uppercase header in ink-3, hairline rows, ink-2 cells. |

## AlphaVector's extension

The portfolio has no data colours. AlphaVector needs three, one per signal, and each signal keeps its colour everywhere
it appears (diagram, headings, weight tables, the logo). They are deliberately not lime (signal) and not blue (links).

| Signal | Text | Fill |
|---|---|---|
| Strengths | `#5ED6CE` | `#2BB3AE` |
| Passion | `#FF8FB4` | `#E05A93` |
| Market demand | `#F2B84B` | `#E8A317` |

Text variants measure 8.2:1 or better on surface-1 and 7.2:1 or better on surface-2. In print (the passion worksheet)
the site switches back to dark text on white and uses the darker text variants `#0B6463`, `#A82F63` and `#85560A`.

The site kept its original Tailwind token names so page markup did not change. Mapping:

| Site token | Signal role |
|---|---|
| paper | bg |
| paper-deep | surface-1 |
| raised | surface-2 |
| ink / ink-soft / muted / faint | ink / ink-2 / ink-3 / faint |
| rule / rule-control | line (hairline) / line-control |
| signal, on-signal, link | signal, on-signal, link |

## Adoption status

Applied on the marketing site (`alphavector-site`):
- Dark graphite ground, ink ramp, hairlines, lime primary button, cobalt links and focus, Geist and Geist Mono.
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-sm`, `.card`, `.field`, `.link` as plain CSS in `app/globals.css`.
- Display headings at weight 300; coloured 3px top rules only where they identify a signal.

Not applied, on purpose or not yet:
- Light mode and a theme toggle (tokens listed above, nothing wired).
- Chips, tags, tabs, accordion, quote, status and breadcrumb patterns (none are used on the site).
- Image fields, a design-system reference page, a shared token package, a Figma library.

The AlphaVector **app** (`alphavector-app`) is a duplicate of WingSpan and uses WingSpan's theme (lime `#B6FF2E` on dark),
which is close to but not identical to Signal's lime `#C8F55A`. If the app should match the site exactly, change `--neon` in
`app/globals.css`; that is the only place the app's accent is defined.
