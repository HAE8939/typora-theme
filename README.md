# Matoujie Theme

[中文文档](README.zh-CN.md)

Matoujie is a clean, elegant Typora theme designed by HAE. It focuses on a calm, high-readability editing experience with warm, restrained colors.

[View Theme Showcase](https://HAE8939.github.io/typora-theme/)

## Features

- Clean, high-contrast design optimized for long-form writing
- Warm color palette (Clay + Ivory) with careful attention to readability
- **Unicode-range font isolation** — Chinese and English render with independent @font-face, no visual conflict
- **Weight decoupling** — body text uses Inter Regular (400) for English, Noto Sans SC Light (300) for Chinese
- Restrained-style callout cards (Feature / Info / Stat / Quote / Danger)
- **Button links** — `[<kbd>Button</kbd>](url)` with solid / outline / dark variants; button-only lines auto-center
- **Column layout** — N `---` followed by N+1 consecutive blockquotes = 2–5 columns
- **Tab groups** (optional plugin) — `_^tab^_` marker + consecutive content, rotates display in exported HTML
- **PDF export optimization** — long code blocks wrap and break across pages, table headers repeat per page, no orphan headings
- Auto link icons on external links (no underline, color only)
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

## Optional Plugin 1: In-editor code enhancement

> Features: hover a code block to reveal a **Copy** button at its top-right; code longer than 20 lines is **collapsed** by default (threshold configurable in the script's `CONFIG`). A standalone ~120-line script with no dependencies.

Typora does not execute theme JS inside the editor, so a one-time script injection into the program directory is required (back up before editing; to uninstall, just remove the injected line):

1. **Copy the script**: put `matoujie-editor.js` into the `resources` folder of the Typora **installation directory** (next to `window.html`)
   - Default Windows install is usually `C:\Program Files\Typora\resources\`; if you cannot find it, open Task Manager → Details → right-click the Typora process → "Open file location"
2. **Back up**: copy `window.html` in the same folder and rename the copy to `window.html.bak`
3. **Inject**: open `window.html` in a text editor and locate:
   ```html
   <script src="./appsrc/window/frame.js" defer="defer"></script>
   ```
   (older Typora versions use `./app/window/frame.js`) Add the following on the **next line** after it:
   ```html
   <script src="./matoujie-editor.js" defer="defer"></script>
   ```
4. **Restart Typora**, hover any code block — the **Copy** button (plus **Fold** for long code) appears at its top-right

> Note: upgrading or reinstalling Typora may overwrite `window.html`; simply redo step 3 in that case.

## Optional Plugin 2: exported HTML enhancements

> Features: tab groups (`_^tab^_` marker + consecutive content), code copy/collapse buttons in exported HTML.

1. Open `matoujie-plugin.txt` and copy its **entire content** (the `<script>` wrapper is already included)
2. In Typora `Preferences` → `Export` → `HTML` → paste into the "**Add to </body>**" field
3. Takes effect on HTML export; when printing / exporting PDF, tabs expand automatically, long code unfolds, and buttons hide

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
