# AGENTS.md - typora-theme 项目协作上下文

> Matoujie Typora 主题（纯 CSS）。

## 架构

- 主题本体 `matoujie.css`：@font-face（unicode-range 中西文隔离）→ `:root` 变量层 → `#write` 排版 → 各元素段。无 JS。
- 2026-09-28 参考开源主题借鉴三项（纯 CSS，已落地）：按钮链接、分栏排版、PDF 导出优化。语法见 `theme-demo.md` 第 12~14 节。
- 2026-09-28 二期：`matoujie-plugin.txt`（自研轻量 JS，源文件即分发文件，自带 `<script>` 包裹）提供三项导出增强：页签组（`*tab*` 标记）、代码块复制按钮、长代码折叠（阈值在插件顶部 CONFIG）。接入 = 复制全文粘贴到 Typora 导出设置「在 </body> 中添加」。见 `theme-demo.md` 第 15~16 节。DEFERRED：引用块内嵌页签组（仅支持正文顶层）。
- 编辑器内代码复制/折叠：自研 `matoujie-editor.js`（源码在主题仓库，部署副本在 `D:\Typora_A\resources\`），window.html 注入 `<script src="./matoujie-editor.js" defer>`（备份在 resources/window.html.bak）。原理：MutationObserver 扫 `#write pre.md-fences`（CodeMirror 行结构，只碰外层），右上角悬浮按钮组（复制 + 超 20 行默认折叠），样式复用 matoujie.css 的 .mj-code-copy / pre.mj-folded。
- **REJECTED** obgnail/typora_plugin（2026-09-28）：46 个模块默认全开导致 Typora 启动明显变慢，用户只需要 2 个功能 → 整体撤除（resources/plugin/ 已删，可从回收站恢复；已还原 window.html 并改注入自研脚本）。教训：编辑器增强优先自研轻量脚本。
- **REJECTED** 导出 HTML 面包屑（2026-09-28）：已实现过底部胶囊 scrollspy，用户不需要此形态，从插件/CSS/文档全部移除。别再提。
- 插件 init 顺序坑：initCode 的 wrapper 包裹会使 pre 失去页签面板候选身份 → initTabs 必须先于 initCode。
- **导出 HTML 代码块是 CodeMirror 结构**：外层 `pre.md-fences`，内部每行一个 `pre.CodeMirror-line`——initCode 必须只选 `pre.md-fences`，用 `pre` 会把每行都包 wrapper 挂按钮，结构全碎。
- **Typora「在 </body> 中添加」插入的是 HTML 片段**：粘贴裸 JS 不会执行且以纯文本显示在页面底部，必须用 `<script>` 包裹（参考的开源主题的分发文件自带包裹，容易想当然）。
- typora_plugin 的 auto_number 默认开启且其 CSS 会进导出 HTML → 文档手写编号时导出双重编号。typora_plugin 已撤除，此坑随之消失；若将来重新引入，在 settings.user.toml 写 `[auto_number] ENABLE=false`。

## 关键坑（勿重复踩）

- **特异性**：基础引用块样式是 `body #write blockquote` (0,1,2)，覆盖它的新规则必须带 `body` 前缀；`:is()` 取参数中最高特异性（`.md-hr` 是 class）。
- **分栏对空白敏感（已定论）**：inline-block 分栏中兄弟元素间若有空白文本节点会因 49%+2%+49%=100% 挤爆换行——但**实测真实 Typora 导出件（`theme-demo.html`）DOM 紧凑无空白**，双栏/三栏在导出中同行不折行，编辑器 DOM 同样紧凑。此坑只在**手写测试 HTML** 时出现：夹具里同组元素必须挤在同一行，带换行缩进就会让最后一栏折行（曾据此误判"导出也坏"）。
- **导出 DOM 结构事实**：Callout 导出为 `<div class="md-alert md-alert-note note">`（**不是** blockquote），`.md-alert-text` 是 `p > span`；分割线导出为 `<hr />`；`#write` 属性用单引号；导出把整套主题 CSS 与插件 script 内联进单个文件。分栏/卡片选择器靠 `:is(blockquote, .md-alert)` 同时命中两态。
- **编辑器 ≠ 导出 DOM（关键）**：Typora 编辑器里 `**粗体**`/`*斜体*` 渲染为 `span[md-inline=strong/em]`（无 strong/em 元素），链接外层还有 `span.md-link` 包裹，行内 HTML 可能再套 `span[md-inline=html]`；导出 HTML 才是干净的 em/strong/a。涉及这两类元素的规则必须双套选择器（编辑器 span[md-inline] / 导出干净 em/strong/a）。
- **按钮居中 quirk**：`:has()` 看不见纯文本节点，按钮与裸文字混排会被误居中；规避 = 文字用 `<span>` 包裹（参考的开源主题同样存在）。
- **分栏触发门槛（2026-09-29 修，全记录见 `docs/bug-log.md`）**：旧规则「hr 后紧跟任意 1 个引用块即分栏」会把正文里常见的「`---` + 一段引言」整条吞掉（`visibility:hidden` + 引用块变 49%）——用户在实际文档中踩到，判定为 bug 而非惯例。现要求 **≥2 个连续引用块** 才触发；组内每条 hr 都隐藏（按前置 hr 条数枚举到 4 条 = 五栏，修前三/四/五栏会漏出带 ✦ 的分割线）。守卫一律用 `:where(:has(...))` 包裹：`:has()` 会把参数特异性算进自身，裸写会抬高 member1 特异性压过 3/4/5 栏链式规则（链越长特异性越高，是这套规则唯一的排序依据）。装饰符无需单独处理——`visibility` 会被 `::after` 继承。
- **打印**：`pre` 必须 `page-break-inside: auto` + `white-space: pre-wrap`，否则长代码横向溢出被裁切；长表格 `break-inside: auto` + `thead { display: table-header-group }` 实现表头逐页重复。

## 验证方法（无 Typora 自动化时）

1. Python 查 CSS 括号配平（先剥注释和字符串）；JS 用 `node --check`。
2. 手写模拟 Typora DOM 的测试 HTML（引用 matoujie.css，注意 `<kbd>` 结构：`[<kbd>x</kbd>](url)` 渲染为 `<a><kbd>`，`*[...](url)` 为 `<em><a><kbd>`，粗体为 `<strong><a><kbd>`）。
3. 无头 Edge 截图核对：`"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless --disable-gpu --screenshot=out.png --window-size=WxH file:///...`；布局数值用注入 JS + fixed 定位 HUD 读 getBoundingClientRect（--dump-dom 会截断不可靠）。
4. **headless 截图只拍 load 同步状态**：setTimeout/rAF/scroll 事件里的 DOM 变化都拍不到（--virtual-time-budget=N 可推进虚拟时间让 debounce/rAF 跑完）；纯逻辑算法提取到 Node 里单测，DOM 注入与样式靠同步截图。
5. **优先用真实导出件当夹具**：`theme-demo.html` 是仓库内保存的 Typora 导出快照（内联了当时的整套 CSS + 插件），比手写模拟 DOM 可信。做法：复制一份 → 在**最后一个** `</body>` 前追加探针 `<pre>` + `<script>`（第一个 `</body>` 在内联插件 JS 的字符串里，插错位置会静默破坏脚本、探针不跑且无报错）→ `--dump-dom --virtual-time-budget=8000` → 正则取回探针文本。
6. 布局断言看 `getBoundingClientRect`：同组元素 `top` 相同 = 同行，`top` 变大 = 折行；配合 `visibility`/`height` 判断分割线是否被吞。
