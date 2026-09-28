# Matoujie 主题

[English](README.md)

Matoujie 是一套由 HAE 制作的 Typora 主题，主打清爽、克制、易读的编辑体验。

[查看主题展示页面](https://HAE8939.github.io/typora-theme/)

## 特性

- 高对比度、长文友好的排版设计
- 温暖配色（Clay + Ivory），兼顾美感与可读性
- **Unicode-range 字体隔离** — 中英文各自渲染，互不干扰
- **字重解耦** — 英文用 Inter Regular (400)，中文用 Noto Sans SC Light (300)，视觉重量一致
- 克制风 Callout 卡片（Feature / Info / Stat / Quote / Danger）
- **按钮链接** — `[<kbd>按钮</kbd>](url)` 实心 / 斜体描边 / 粗体深色三态，整行按钮自动居中
- **分栏排版** — N 个 `---` + N+1 个连续引用块 = 2~5 栏
- **页签组**（可选插件）— `_^tab^_` 标记 + 连续内容，导出 HTML 后轮换展示
- **PDF 导出优化** — 长代码块自动换行跨页、表格表头逐页重复、标题不落单
- 外部链接自动显示图标（无下划线，仅颜色区分）
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

## 可选插件一：编辑器内代码增强

> 功能：悬停代码块右上角出现「复制」按钮；超过 20 行的长代码自动折叠（阈值可在脚本顶部 `CONFIG` 修改）。约 120 行、无依赖的独立脚本。

Typora 编辑器不执行主题 JS，需要在程序目录注入一次脚本（修改前建议先备份，卸载只需删除注入行）：

1. **复制脚本**：把 `matoujie-editor.js` 复制到 Typora **安装目录**下的 `resources` 文件夹（与 `window.html` 同级）
   - Windows 默认安装通常在 `C:\Program Files\Typora\resources\`；若找不到安装目录，可在任务管理器 → 详细信息 → Typora 进程「打开文件所在位置」定位
2. **备份**：同目录下复制一份 `window.html` 改名为 `window.html.bak`
3. **注入**：用文本编辑器打开 `window.html`，找到这一行：
   ```html
   <script src="./appsrc/window/frame.js" defer="defer"></script>
   ```
   （旧版本 Typora 为 `./app/window/frame.js`）在它**后面另起一行**加入：
   ```html
   <script src="./matoujie-editor.js" defer="defer"></script>
   ```
4. **重启 Typora**，悬停任意代码块，右上角出现「复制」（+ 长代码出现「折叠」）即成功

> 注意：Typora 升级或重装可能覆盖 `window.html`，届时重新执行第 3 步即可。

## 可选插件二：导出 HTML 增强

> 功能：页签组（`_^tab^_` 标记 + 连续内容轮换展示）、导出 HTML 内的代码复制/折叠按钮。

1. 打开 `matoujie-plugin.txt`，复制**全文**（已自带 `<script>` 包裹）
2. Typora `偏好设置` → `导出` → `HTML` → 在「**在 </body> 中添加**」中粘贴
3. 导出 HTML 即生效；打印 / 导出 PDF 时页签自动全部展开、长代码展开、按钮自动隐藏

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
