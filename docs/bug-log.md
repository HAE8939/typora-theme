# Bug 记录

> 本文件存放已修复缺陷的完整现场（现象 / 根因 / 修复 / 验证 / 遗留），供回溯与对外说明。
> `AGENTS.md` 只保留蒸馏后的一句话结论与坑，避免每次会话都载入长文。
> 追加到文件末尾，一条一节。

---

## 2026-09-29 · `---` 分割线被分栏规则吞掉

**影响范围**：`matoujie.css` 自 133c882（2026-09-28 引入分栏排版）起，至本次修复。
**等级**：高——破坏正常文档排版，用户在实际业务文档中踩到。
**修复文件**：`matoujie.css`（分栏段，约 1206~1290 行）；同步 `theme-demo.md` §13、`README*.md`、`AGENTS.md`。

### 现象

1. 正文里 `---` 后面紧跟**一个**引用块或 Callout 时，分割线整条消失，且该引用块被压成半宽（实测 47%）。
   复现现场：《项目案例整理索引.md》——`服务范围：深化设计&软装搭配&精装施工` → 空行 → `---` → 空行 → `> 第二批项目`。
2. 附带缺陷：三/四/五栏时，只有**最后一条** `---` 被隐藏，前面会漏出带 ✦ 的装饰分割线。`theme-demo.md` §13 的三栏示例本身就是坏的。

### 根因

分栏的触发条件写成「hr 后紧跟任意 1 个引用块」，没有最小成组要求：

```css
/* 修复前 */
body #write :is(hr, .md-hr):has(+ :is(blockquote, .md-alert)) { visibility: hidden; ... }
body #write :is(hr, .md-hr) + :is(blockquote, .md-alert),
body #write :is(hr, .md-hr) + :is(blockquote, .md-alert) + :is(blockquote, .md-alert) { ... 49% }
```

「`---` + 一段引言」是正文里极常见的普通写法，在 DOM 上与「双栏少写一栏」完全同形，无法区分 → 被当成分栏吞掉。
隐藏规则只匹配「后面直接跟引用块」的 hr，多栏组里前置的 hr 后面跟的是 hr，匹配不到 → 漏出。

### 修复

1. **触发门槛提到 ≥2 个连续引用块/Callout**：单个引用块不再触发分栏，`---` 正常显示、引用块保持整宽。
2. **组内每条分隔线都隐藏**：按前置 hr 条数枚举 0~4 条（4 条 = 五栏），每条都要求其后有 ≥2 个连续引用块。
3. **2~5 栏各自的 member1 加守卫**「后面还有第二个引用块」，防止单个引用块被误判成半宽。
4. **守卫一律用 `:where(:has(...))` 包裹**。原因：`:has()` 会把参数特异性算进自身，裸写 `:has(+ bq)` 会让双栏 member1 的特异性升到 (1,4,1)，反超三栏 member1 的 (1,3,1)；而这套多栏规则完全依赖「链越长 → 特异性越高 → 覆盖短链」来排序，一旦抬高就把三/四/五栏全压回 49%。`:where()` 贡献 0 特异性，守卫加了但排序不变。
5. 删除 `hr::after { content: none }`：`visibility` 会被伪元素继承，隐藏栏组实测不出现 ✦，该规则冗余。

```css
/* 修复后（节选） */
body #write :is(hr, .md-hr):where(:has(+ :is(blockquote, .md-alert) + :is(blockquote, .md-alert))),
body #write :is(hr, .md-hr):where(:has(+ :is(hr, .md-hr) + :is(blockquote, .md-alert) + :is(blockquote, .md-alert))),
/* … 枚举到 4 条 hr = 五栏 */
{ visibility: hidden; border: none; margin: 0 !important; padding: 0; }

body #write :is(hr, .md-hr) + :is(blockquote, .md-alert):where(:has(+ :is(blockquote, .md-alert))),
body #write :is(hr, .md-hr) + :is(blockquote, .md-alert) + :is(blockquote, .md-alert) { … 49% }
```

### 验证

**（1）手写模拟 DOM，9 用例**（数值取自 `getBoundingClientRect`，`#write` 内容宽 776px）

| 用例 | 修复前 | 修复后 |
|---|---|---|
| `---` + 普通段落 | hr visible h=1 | hr visible h=1 mt=40px（不变） |
| `---` + 单个引用块 | **hr hidden h=0 / 引用块 47%** | **hr visible / 引用块 95% 整宽** |
| `---` + 单个 Callout | **hr hidden / 卡片 47%** | **hr visible / 卡片整宽** |
| `---` + 引用块 + 正文 + 引用块 | 引用块误 47% | 整宽，不触发 |
| 两条 `---` + 单个引用块（畸形） | 全塌 | 分割线正常显示，不塌 |
| 1 条 `---` + 2 引用块 | 双栏正常 | 双栏正常（47% + 47%，同 rowTop） |
| 2 条 `---` + 3 引用块 | **第一条 hr 漏出 visible** | **两条 hr 全 hidden，30/30/30 同行** |
| 3 条 `---` + 4 成员 | 前两条漏出 | 全 hidden，4 × 22% 同行 |
| 4 条 `---` + 5 成员 | 漏出 3 条 | 全 hidden，5 × 18% 同行 |

**（2）真实 Typora 导出件核对**（`theme-demo.html`，导出时已内联修复后的 CSS）

`#write` 宽 799px，逐个直接子元素读取计算样式：15 处普通 `---` 全部 `vis=visible h=1`；双栏组 `hr vis=hidden h=0` + 两栏 x=20 / x=407 同行；三栏组**两条** hr 均 `hidden h=0` + 三栏 x=20 / 278 / 536 同行；§7 的 5 张连续 Callout、§12 的连续引用块因前面没有 `---`，全部保持整宽未被误伤。

### 顺带澄清的旧结论

- **「导出 HTML 是否带空白」→ 已实测：紧凑无空白。** 双栏/三栏在真实导出件里同行不折行。`AGENTS.md` 原来那句"待实测"已改为定论。
- 只有**手写** HTML 带换行缩进时才会出问题：49%+2%+49% 正好 100%，中间一个折叠空格（≈4px）即溢出折行。写测试夹具时必须把同组元素挤在同一行。
- 导出里 Callout 是 `<div class="md-alert md-alert-note note">`（**不是** `blockquote`），`.md-alert-text` 是 `p > span`；分栏选择器靠 `:is(blockquote, .md-alert)` 同时命中编辑器与导出两种形态。
- 导出探针脚本要插在**最后一个** `</body>` 之前——第一个 `</body>` 出现在内联插件 JS 的字符串里，插进去会静默破坏脚本、探针不执行且无报错。

### 遗留 / 未做

- 分栏语法的固有歧义仍在：`---` + 恰好 2 个引用块但并非分栏意图时仍会成栏（纯 CSS 拿不到更多信号）。**DEFERRED**：若要彻底消歧需换成显式标记（如 `*col*`），代价是破坏既有文档，不值。
- 未做 Typora **编辑器内** DOM 实测（无自动化入口），只验证了导出 DOM；编辑器与导出的 hr/blockquote 兄弟结构在本次判定上同构，风险低。
