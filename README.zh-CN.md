# Matoujie 主题

Matoujie 是一套由 HAE 制作的 Typora 主题，主打清爽、克制、易读的编辑体验。

[查看主题展示页面](https://HAE8939.github.io/typora-theme/)

## 特性

- 高对比度、长文友好的排版设计
- 温暖配色（Clay + Ivory），兼顾美感与可读性
- **Unicode-range 字体隔离** — 中英文各自渲染，互不干扰
- **字重解耦** — 英文用 Inter Regular (400)，中文用 Noto Sans SC Light (300)，视觉重量一致
- Anthropic 风格 Callout 卡片（Feature / Info / Stat / Quote / Danger）
- 外部链接自动显示图标
- 优化的侧边栏卡片样式
- 打印友好，自动隐藏链接图标

## 字体系统

| 用途 | 字体 | 字重 | 体积 |
|------|------|------|------|
| 英文 / UI | Inter | 300, 400, 500, 700 | ~480 KB |
| 中文 | Noto Sans SC | 300, 400, 500, 700 | **~4.5 MB** |
| 代码 | JetBrains Mono | 400, 400i, 500 | ~210 KB |

> **注意：** Noto Sans SC 四个字重共约 4.5 MB，这是中文字体的正常体积。字体文件通过 `unicode-range` 按需加载。

## 安装

1. 在 Typora 中打开 `设置` → `外观` → `打开主题文件夹`
2. 复制以下文件到主题目录：
   ```
   matoujie.css
   fonts/
   ├── inter/
   ├── noto-sans-sc/
   └── jetbrains-mono/
   ```
3. 重启 Typora
4. 在 `主题` 菜单中选择 `Matoujie`

## 自定义

- **字体**：修改 `:root` 中的 `--font-ui`、`--font-heading`、`--font-mono`
- **配色**：核心颜色通过 CSS 变量定义（`--primary-color`、`--bg-color` 等）
- **排版**：`#write` 的宽度和间距可微调
- **链接图标**：修改 `--link-icon-content` 可更换符号（如 `"\2197\00A0"` 为 ↗）

## 许可

MIT

## 致谢

- [Konayuki Theme](https://github.com/aerandirsf/Konayuki) — 基础样式参考
- [Inter](https://rsms.me/inter/) — 英文字体
- [Noto Sans SC](https://github.com/notofonts/noto-cjk) — 中文字体
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/) — 代码字体
