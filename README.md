# Matoujie Theme

Matoujie is a clean, elegant Typora theme designed by HAE. It focuses on a calm, high-readability editing experience with warm, restrained colors.

## Preview

### Text & Typography

![Text styles and link icons](src/图层%201.png)

### Font System

![Inter + Noto Sans SC + JetBrains Mono](src/图层%202.png)

### Callout Cards

![Anthropic-style alert cards](src/图层%206.png)

### Tables & Link Icons

![Tables with link icon exclusion](src/图层%209.png)

## Features

- Clean, high-contrast design optimized for long-form writing
- Warm color palette (Clay + Ivory) with careful attention to readability
- **Unicode-range font isolation** — Chinese and English render with independent @font-face, no visual conflict
- **Weight decoupling** — body text uses Inter Regular (400) for English, Noto Sans SC Light (300) for Chinese
- Anthropic-style callout cards (Feature / Info / Stat / Quote / Danger)
- Auto link icons on external links
- Optimized sidebar with slate-card styling
- Print-friendly with link icon suppression

## Font System

| Role | Font | Weights | Size |
|------|------|---------|------|
| English / UI | Inter | 300, 400, 500, 700 | ~480 KB |
| Chinese | Noto Sans SC | 300, 400, 500, 700 | **~4.5 MB** |
| Code | JetBrains Mono | 400, 400i, 500 | ~210 KB |

> **Note:** Noto Sans SC is large (~4.5 MB for 4 weights). This is normal for CJK fonts. The font files are loaded on-demand via `unicode-range`.

## Installation

1. Open Typora → `Settings` → `Appearance` → `Open Theme Folder`
2. Copy the entire theme folder contents:
   ```
   matoujie.css
   fonts/
   ├── inter/
   ├── noto-sans-sc/
   └── jetbrains-mono/
   ```
3. Restart Typora
4. Select `Matoujie` from the `Theme` menu

## Customization

Edit `matoujie.css` to customize:

- **Fonts**: Modify `--font-ui`, `--font-heading`, `--font-mono` in `:root`
- **Colors**: Core colors are defined as CSS variables (`--primary-color`, `--bg-color`, etc.)
- **Layout**: Width (`#write max-width`) and spacing can be fine-tuned
- **Link icon**: Change `--link-icon-content` to use a different symbol (e.g., `"\2197\00A0"` for ↗)

## License

MIT

## Acknowledgments

- [Konayuki Theme](https://github.com/aerandirsf/Konayuki) — Base style reference
- [Inter](https://rsms.me/inter/) — English typeface
- [Noto Sans SC](https://github.com/notofonts/noto-cjk) — Chinese typeface
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/) — Code typeface
