# Figma Auth Components Reference

Design source: **aiTuki prototype V01**  
Figma file: [aiTuki-prototype-V01](https://www.figma.com/design/DajMfwAJVdLDj6vjKbWudq/aiTuki-prototype-V01)

Use design tokens from `constants/theme.ts` (Spacing, BorderRadius, Typography, Colors) for padding, borders, rounded corners, and typography. Sync visual specs below from Figma when updating designs.

---

## Auth screen components (node IDs)

| Node ID    | Figma link | Purpose |
|------------|------------|--------|
| 2523-24531 | [Link](https://www.figma.com/design/DajMfwAJVdLDj6vjKbWudq/aiTuki-prototype-V01?node-id=2523-24531&t=FEYZsiqFWo6fTB4R-1) | Auth / login screen; contained component |
| **2680-21990** | [Link](https://www.figma.com/design/DajMfwAJVdLDj6vjKbWudq/aiTuki-prototype-V01?node-id=2680-21990&t=FEYZsiqFWo6fTB4R-1) | **Login/Register layout** – dark bg, teal logo/text, social (grayish-teal + white border), email (white + teal border) |
| 2976-22726 | [Link](https://www.figma.com/design/DajMfwAJVdLDj6vjKbWudq/aiTuki-prototype-V01?node-id=2976-22726&t=FEYZsiqFWo6fTB4R-1) | Auth component variant 1 |
| 2976-22881 | [Link](https://www.figma.com/design/DajMfwAJVdLDj6vjKbWudq/aiTuki-prototype-V01?node-id=2976-22881&t=FEYZsiqFWo6fTB4R-1) | Auth component variant 2 |
| 2976-23416 | [Link](https://www.figma.com/design/DajMfwAJVdLDj6vjKbWudq/aiTuki-prototype-V01?node-id=2976-23416&t=FEYZsiqFWo6fTB4R-1) | Auth component variant 3 |
| 2976-23566 | [Link](https://www.figma.com/design/DajMfwAJVdLDj6vjKbWudq/aiTuki-prototype-V01?node-id=2976-23566&t=FEYZsiqFWo6fTB4R-1) | Auth component variant 4 |
| **2985-21876** | [Link](https://www.figma.com/design/DajMfwAJVdLDj6vjKbWudq/aiTuki-prototype-V01?node-id=2985-21876&t=FEYZsiqFWo6fTB4R-1) | **Create Account / Register form** – input fields and layout |

---

## Implementation mapping

- **Login** (`app/(auth)/login.tsx`): Uses tokens; form fields via `FormTextField`; align layout and hierarchy with Figma nodes above.
- **Register** (`app/(auth)/register.tsx`): Same token + `FormTextField` usage; form content from [node 2985-21876](https://www.figma.com/design/DajMfwAJVdLDj6vjKbWudq/aiTuki-prototype-V01?node-id=2985-21876). Link from login: “Create account” / “Register with email”.
- **Reset password** (`app/(auth)/reset-password.tsx`): Same token + `FormTextField` usage.
- **Form fields**: MUI-like pattern (label, outlined border, helper/error) per [MUI Text Field](https://mui.com/material-ui/react-text-field/); styling from design system tokens.

**Contained component (all other login options) – variables to match exactly (node 2523-24531):**
- Container: `padding` Spacing.lg (24), `gap` Spacing.md (16), `borderRadius` BorderRadius.lg (16), `backgroundColor` surface, `borderWidth` 1, `borderColor` theme border.
- Children: Google button, Apple button, secondary CTA (“Sign in with email”), “Create account” link. Same spacing between all items.

When updating from Figma, export spacing, border radius, font size, and colors for each node and update `constants/theme.ts` or component styles to match.

---

## Auth styling reference (Login screen – use for Register & Reset password)

**Source of truth (saved as correct):** `app/(auth)/login.tsx` — main login and “Login with email” form view are the canonical implementation. Match Register and Reset password to this. See also `constants/authTheme.ts`.

### Theme
- **Light only** for auth: white background `#ffffff`, all text **primary** `#1F5661` (`Colors.light.textPrimary`).
- Teal accents: borders and links `#0d9488`; button fills `#fafafa` with teal border.

### Layout
- **Top space:** 64px above logo → `marginTop: Spacing.xl * 2` on header (logo container), or wrapper with `paddingTop: Spacing.xl * 2`.
- **Logo:** Ranged left, no left padding on scroll content. Logo image: 200×56, `alignSelf: 'flex-start'`.
- **Content below logo:** Indent 32px → `paddingLeft: Spacing.xl` on content block (e.g. `contentIndent`).
- **Vertical gaps:** 16px between all elements → `Spacing.md` for `marginBottom` / `marginTop` as needed. “OR” text: no margin above; 16px below.

### Typography
- **H4 (intro):** Font size 20 (h4.fontSize), **font weight regular 400** (`Typography.fontWeight.regular`), line height 25, text align left, color primary.
- **Body1 (e.g. “Continue with Google”):** fontSize 16, weight 400, line height 24, left align, color primary.
- **OR:** Body1-ish, uppercase, centred, `marginTop: 0`, `marginBottom: Spacing.md`.
- All text and icons use `themeColors.textPrimary` (not hardcoded hex in JSX).

### Buttons
- **Social (Google/Apple):** Light bg `#fafafa`, teal border, 48px min height, `BorderRadius.round`, icon 22×22 (PNG from authTheme URIs), label primary color.
- **Email (Login with email / Register with email):** Same style as social; primary text.

### “Login with email” form view (same file)
- **Order:** Back button (top, 16px left padding `Spacing.md`) → logo (64px top via header) → contentIndent: form title “Login with email” (weight 400), then form.
- **Form container:** No frame/background (`backgroundColor: 'transparent'`, `borderWidth: 0`), no padding around inputs.
- **Button text:** Primary color (`themeColors.textPrimary`). Form title weight regular 400.
- **Forgotten Password:** 32px above link (`marginTop: Spacing.xl`).

### Tokens to use
- From `constants/theme`: `Spacing`, `BorderRadius`, `Typography`, `Colors.light`.
- From `constants/authTheme`: `AUTH_FIGMA`, `AUTH_LOGO_URI`, `AUTH_GOOGLE_ICON_URI`, `AUTH_APPLE_ICON_URI`, `AUTH_VERTICAL_GAP`, `AUTH_TOP_SPACE`, `AUTH_CONTENT_INDENT`.
