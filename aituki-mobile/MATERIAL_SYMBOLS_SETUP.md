# Material Symbols Rounded Variable Font Setup

## Required Configuration

To use Material Symbols Rounded with the exact styling you specified:
- **Weight:** 100
- **Grade:** 200
- **Optical Size:** 20px
- **Style:** Rounded

## Step 1: Download the Variable Font

1. Go to https://fonts.google.com/icons
2. Select **Material Symbols Rounded**
3. Download the variable font file:
   - **MaterialSymbolsRounded[wght@100..700][GRAD@-200..200][opsz@20..48].ttf**

## Step 2: Place Font in Project

1. Create the fonts directory if it doesn't exist:
   ```bash
   mkdir -p assets/fonts
   ```

2. Place the downloaded font file in:
   ```
   assets/fonts/MaterialSymbolsRounded[wght@100..700][GRAD@-200..200][opsz@20..48].ttf
   ```

## Step 3: Update app.json (if needed)

The font should be automatically loaded via `expo-font`. If you need to explicitly configure it, add to `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-font",
        {
          "fonts": [
            "./assets/fonts/MaterialSymbolsRounded[wght@100..700][GRAD@-200..200][opsz@20..48].ttf"
          ]
        }
      ]
    ]
  }
}
```

## Step 4: Usage

The IconLibrary component now uses Material Symbols Rounded with:
- Weight: 100 (lightest stroke)
- Grade: 200 (increased thickness without changing footprint)
- Optical Size: 20px (optimized for small sizes)
- Style: Rounded (handled by the font variant)

```tsx
<IconLibrary iconName="home" size={24} color="#1f5661" />
<IconLibrary iconName="favorite" size={20} color="#ff0000" />
<IconLibrary iconName="settings" size={32} color="#000000" />
```

## Icon Naming

Material Symbols use **snake_case** naming (e.g., `account_circle`, `favorite`, `settings`).

The IconLibrary component maps common icon names to Material Symbol names, but you can also use Material Symbol names directly:

```tsx
// Direct Material Symbol name
<IconLibrary iconName="account_circle" />

// Mapped name (still works)
<IconLibrary iconName="user" />
```

## Fallback

If the Material Symbols font fails to load, the component falls back to MaterialIcons from `@expo/vector-icons` automatically.

## Troubleshooting

1. **Font not loading:** Ensure the font file path matches exactly in the `useFonts` call
2. **Icons not displaying:** Check that the font file is correctly placed in `assets/fonts/`
3. **Variable font settings not working:** iOS and Android support `fontVariationSettings`, but some older versions may not

## Font File Size

The Material Symbols variable font file is typically around 800KB-1MB. This is larger than static fonts but provides all weights, grades, and optical sizes in one file.

