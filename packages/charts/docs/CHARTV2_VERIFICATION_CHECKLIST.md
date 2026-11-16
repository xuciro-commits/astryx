# ChartV2 — 验证清单

在我们将图表库称为“正确”之前需要验证的详尽、具体事项。这是 Stage 1（修复）和 Stage 2（测试）的 QA 主干。它结合了 (a) 截图环节已经检查过的内容，以及 (b) 所有仍未测试的内容。

状态图例：

- `[ok]` 在全部 21 个 story 的浅色+深色截图审查中验证为可接受
- `[BUG]` 已确认的问题（在 Stage 1 中跟踪）
- `[?]` 尚未验证 — 需要检查和/或专用 story
- `[new]` 需要新的 story/fixture 才能实际执行

我们如何验证：

- **视觉**：对每个 story 运行 Playwright 截图工具，浅色 + 深色（已有）。
- **单元**：针对布局/比例尺/颜色/图例/工具提示/格式化器的 vitest。
- **手动**：Playwright 可驱动的悬停/键盘/调整大小交互。
- **SSR**：render-to-string 冒烟测试。

---

## 1. 坐标轴（“所有坐标轴都没问题吗？”）

### 位置与结构

- `[ok]` 底部坐标轴渲染基线；标签在 band 类别下方居中。
- `[ok]` 左侧坐标轴默认渲染为浮动标签（无轴线、无刻度）。
- `[?]` 确认浮动 y 轴（默认无轴线/无刻度）是预期的默认外观，而不是绘制细微的轴线/刻度。（设计决策 — 看起来像 Google Sheets 那样干净。）
- `[?]` 右侧坐标轴（`position="right"`）— 放置位置、标签锚点（start），用于 secondary-axis story。`[new]`
- `[?]` 顶部坐标轴（`position="top"`）— 标签放置在绘图区上方。`[new]`
- `[?]` `showAxisLine` / `showTicks` 在所有组合下的开关（仅线、线+刻度、刻度强制开启线）。`[new]` 专用 story。

### 刻度与密度

- `[BUG]` 类别很多的 band 轴重叠成一片模糊（candlestick，30 天）。需要宽度感知的自动跳过，而无需 `maxTicks`。
- `[?]` 线性轴遵守 `tickCount`（d3 会在其附近选取“nice”计数）。
- `[?]` 超出时 `maxTicks` 均匀跳过标签（验证 every-Nth 逻辑）。
- `[?]` 长类别标签 — 截断（`truncate`）会追加“…”；考虑旋转。
- `[new]` 针对密集/长 band 标签的旋转标签选项（目前没有）。
- `[?]` 首个/最后一个线性刻度在绘图区边缘不被裁剪（存在边缘可见性保护 — 偏移在 [-10, width+10] 内）。
- `[?]` 网格线与轴刻度位置精确对齐（网格使用 `yScale.ticks(5)`；轴使用 `tickCount=5` — 确认当 `tickCount` 变化时两者匹配）。

### 坐标轴反映的域

- `[ok]` 负 y 域：底部轴线绘制在 y=0，而不是图表边缘（NegativeValues）。
- `[ok]` 左侧轴上的货币格式化器（$ 值）可渲染（SimpleBar）。
- `[?]` 轴上的 percent / compactNumber / shortDate / monthYear 格式化器。`[new]`
- `[BUG]` 连续 y（line/area/dot）将 min/max 紧贴顶部/底部边缘（没有余量）。
- `[new]` 时间轴：以合理的日期刻度 + 格式化处理 Date x 值（目前没有时间比例尺）。
- `[new]` 对数轴：十倍刻度（1,10,100…）（目前没有对数比例尺）。
- `[?]` 零范围/单值域：轴仍显示合理刻度（不是全都相同）。

### 坐标轴外观

- `[ok]` 轴标签文字颜色在深色模式下自适应（secondary text token）。
- `[?]` 轴线条/刻度在浅色和深色主体上的对比度。
- `[?]` RTL：左/右轴侧 + 标签锚点镜像。`[new]`
- `[?]` 流式：轴刻度滑动动画（`animated`）流畅且遵循 reduced-motion。`[new]`

---

## 2. 比例尺与域

- `[BUG]` 空数据 → band 回退 → NaN → 空白（破坏流式）。
- `[BUG]` 没有 `yBaseline`/`yDomain`/`xDomain` 控制（v1 对齐）。
- `[new]` 单个数据点 → 域必须合成一个跨度；点居中/可见。
- `[new]` 全部相等/零范围的值 → 带填充的域，合理刻度。
- `[new]` 全部为零 → 基线正确，柱在 0 处平坦。
- `[new]` 全部为负 → 柱从 0 向下增长；轴线在 0（顶部）。
- `[new]` 一个巨大离群值 → 记录/日志化补救方案；线性仍然不抛错。
- `[?]` `nice()` 行为：应用于自动域，不应用于显式域（避免缩放/流式期间棘轮效应）。
- `[?]` x 数值 vs band 推断的正确性（全数字 → 线性；否则 band）。
- `[new]` 显式比例尺配置（`type: 'linear'|'band'|'time'|'log'`）覆盖推断。
- `[new]` 次级 y 轴（`axis:'y2'`）将标记映射到它自己的域（financial）。
- `[?]` 堆叠域 = 堆叠的总和（已在 StackedBars/Areas 上目视验证）；为其添加单元测试。
- `[?]` 混合正/负堆叠计算正确的范围。

---

## 3. 颜色与调色板（“颜色？”）

### 调色板正确性

- `[BUG]` 默认颜色 token（`--color-chart-1`、`--color-positive/negative`）不存在 → 未传颜色时呈黑色/不可见。修复：按索引自动分配 categorical。
- `[?]` `categorical(n)` 按系列顺序返回不同色相；与图例色块匹配。
- `[?]` `sequential[hue](n)` 用于热力图/分级统计图的渐变排序（深→浅）。
- `[?]` `diverging.positiveNegative/coldHot/custom` 围绕中点。
- `[?]` `semantic`（positive/negative/warning/neutral）驱动 candlestick 上涨/下跌、参考线、误差条（不是原始 token）。
- `[?]` `structural`（axis/grid/tick/label）由外围框架使用，具备主题感知。
- `[?]` `alpha(hex, o)` 生成正确的 rgba。

### 深色模式与对比度

- `[ok]` 实心 SVG 标记（bar/line/area-line/dot）和 GL 散点圆点在深色主体上对比度良好（已审查：bars、line、scatter、candlestick、heatmap）。
- `[BUG]` **半透明 / 深色系填充在深色背景下被冲淡 — 范围很广。** 在深色下审查：置信带（不透明度 0.1–0.2）几乎不可见；kitchen-sink 参考带（琥珀色 0.15 / 绿色 0.08）变得浑浊；area-gradient 填充非常暗；**误差条（`#1e3a5f`）在深色柱上几乎不可见**；金融成交量柱（灰色 0.3）浑浊。根因：颜色/不透明度是为浅色背景选择的（通常是硬编码 hex），而不是模式感知的。在调色板/语义层面修复（模式感知的填充基色 + 不透明度；误差条/结构默认值来自主题 token，而不是 hex）。
- `[ok]` 已实际使用的分类中间色调（blue/red/orange/green）在深色下可接受。完整 10 种（cyan/teal/brown/indigo/purple/pink）在深色下仍为 `[?]`。
- `[ok]` 热力图顺序渐变低端（近白色）在深色下可读（高对比度）；但注意它是 story 提供的 hex 范围，不是主题 token（见下文）。
- `[note]` **热力图 `colorRange` 和 candlestick 上涨/下跌颜色是 story 提供的 hex，不是主题 token** → 它们不会适应浅色/深色。考虑将热力图默认设为顺序渐变 token 集，并将 candlestick 默认设为 `semantic.positive/negative`。
- `[new]` 对 10 种分类色进行 CVD（色盲）安全审查（deuter/protan/tritan）；记录建议的最大（约 8）不同系列数。

### 颜色应用

- `[BUG]` 使用 accessor 着色的系列会从图例中消失。
- `[new]` 按字段着色（`color:{field}`）→ 序数颜色比例尺 + 图例条目。
- `[BUG]` GL 标记无法接受 token（`hexToGL` 仅支持 hex）— 需要 token→hex 解析器。
- `[?]` 运行时切换主题会重新解析颜色，包括缓存的 GL hex。
- `[new]` >10 个系列 → 调色板循环使用 + 开发警告。
- `[?]` 不透明度：堆叠/重叠填充（area 0.3、band 0.15）正确合成。
- `[?]` 渐变填充（area `gradient`）从颜色→透明的色标；每个系列唯一（两个 area 共享 dataKey 时渐变 id 冲突 → 通过 `_uid` 去重）。
- `[?]` 色块颜色与渲染的系列颜色完全匹配（bar 用方形，其他用线形）。
- `[BUG-story]` Swatch story 只渲染单个方形 — 展示不充分（没有 `line` 变体、没有多颜色、没有深色对比）。扩展该 story。

---

## 4. 图例

- `[ok]` 独立图例渲染带色块 + 标签的条目（Legend story）。
- `[ok]` 位置 top/bottom（水平换行）和 start/end（垂直堆叠）。
- `[BUG]` `legend="end"` 缩小绘图区，但最后一个柱/标签被裁剪（MixedMarks）。
- `[?]` 在位置内对齐 start/center/end。
- `[?]` 实用标记（band/errorBar/referenceLine）正确地从图例中排除。
- `[BUG]` 没有 `SeriesDef.color` 的标记（candlestick/GL）被排除 — 颜色修复后，决定哪些应该出现（candlestick 上涨/下跌？GL 系列？）。
- `[new]` 多系列图例溢出（换行/滚动）、长标签。
- `[?]` 图例色块变体匹配标记类型（bar=方形，其他=线形）。
- `[?]` 重复标签不会作为 React key 冲突（图例以 `label` 为 key）。

---

## 5. 工具提示与悬停（基本未测试 — 截图是静态的）

- `[?]` 悬停为 line/area/dot 显示十字准线；为 bars 显示 band 高亮矩形。
- `[?]` 工具提示卡片内容：悬停 x 处的系列行、标签、颜色、值正确。
- `[BUG-latent]` 工具提示值 = `datum[dataKeys[0]]`：candlestick 只显示 `open`；streamGL 产生 `undefined`；GL scatter 创建行。按标记修复工具提示语义。
- `[?]` 悬停圆点为 line/area/dot 在聚焦索引处渲染；bars/utility 跳过。
- `[?]` 卡片在视口边缘附近翻转/夹紧（placement auto/left/right/top）。
- `[?]` 仅在数据索引变化时重新渲染（性能）— 验证没有每次移动的 React 渲染。
- `[?]` 深色模式下的工具提示（popover 背景、文本、色块）。
- `[?]` `dotGLInteractive` GPU 拾取的悬停会触发自己的 `renderTooltip`；确保它不会与外围工具提示重复。
- `[new]` 空/指针离开清除卡片和指示器。
- `[?]` 移动端的触摸/指针（touch-action）— 不干扰滚动。

---

## 6. 网格

- `[ok]` 默认水平网格；与 y 刻度对齐；跳过 y=0 线。
- `[?]` band 的垂直网格（`vertical`）（按类别）和线性（刻度）。
- `[?]` 深色模式下的网格对比度（border-emphasized token）。
- `[?]` 网格位于标记之后（渲染顺序）— 绝不在数据之上。

---

## 7. 各标记渲染（全部 12 个）

- `[ok]` `bar` — simple/stacked/grouped/grouped-stacked/negative；顶部圆角；仅堆叠顶部有圆角半径。
- `[ok]` `line` — 曲线（默认 monotone）；可选点（硬编码 r=3 — 是否暴露？）。
- `[ok]` `area` — 填充 + 渐变 + 堆叠；顶部描边。
- `[?]` `dot`（SVG 散点）— 尚无专用 story。`[new]`
- `[BUG]` `dot.dodge` — 已声明，但不起作用。
- `[ok]` `band` — 上/下界之间的置信区间。
- `[ok]` `candlestick` — 上涨/下跌实体 + 影线；最小实体高度。
- `[ok]` `errorBar` — 竖线 + 端帽。
- `[ok]` `referenceLine` — 单 y、y+y2 带、x 线（需要单独 story）。`[new]`
- `[BUG]` `referenceLine` 标签徽章在右边缘被裁剪（Acceptable/Target）。
- `[ok]` `dotGL` — WebGL 散点（200 点）。
- `[new]` `dotGLInteractive` — story 未覆盖悬停/拾取。
- `[BUG]` `heatmapGL` — 构建自己的 y 比例尺；顶行被裁剪；应共享图表比例尺。
- `[BUG]` `streamGL` — 空白（空数据比例尺）；硬编码 key 在两个流时冲突。
- `[?]` 有 x 比例尺要求的标记在错误比例尺上优雅失败（heatmap 需要 band；referenceLine.x 需要 linear；streamGL 需要数值）。
- `[BUG]` 同一 dataKey 上的两个系列冲突（解析映射 + React key）— 重复 key。

---

## 8. 布局与响应式

- `[ok]` 标题/副标题渲染在图表上方；aria 连接到 `<title>`/`<desc>`。
- `[?]` 通过 ResizeObserver 实现响应式宽度 — 从宽→窄调整大小会重新布局。
- `[?]` 容器宽度为 0（初始挂载）时渲染占位符，不崩溃。
- `[?]` 非常小的容器（例如 150px）— 轴/标签优雅降级。
- `[?]` `margin` 覆盖 — 应用内边距；为长轴标签留出足够空间。
- `[BUG]` `legend="end"` 裁剪绘图区（见 §4）。
- `[?]` 一个页面上的多个图表不共享/泄漏 id（gradient/clip id 唯一）。

---

## 9. 数据边界情况（需要 fixture — 设计文档第 5 节）

- `[new]` 空 `[]`、单行、两行。
- `[new]` 数值列中的 `null`/`undefined`/`NaN`/非数值 → 间隙（line/area）/ 跳过（points）+ 开发警告（按决定）。
- `[new]` 缺失 dataKey（拼写错误）→ 开发警告，而不是静默为零。
- `[new]` 重复 x 值（band）；未排序 x（line）→ 开发警告。
- `[new]` 非常大的 N（5k–50k）→ GL 路径；记录 SVG 阈值。
- `[new]` 极端值（1e9、1e-9）→ 轴格式化（compactNumber）不溢出。

---

## 10. 平台 / 运行时

- `[new]` SSR：无 DOM 的 render-to-string（Next.js/docsite）— 有保护，不崩溃。
- `[?]` WebGL 不可用 / `webglcontextlost` → GL 标记回退/消息，不硬失败。
- `[?]` 高 DPI（retina）— GL 圆/线清晰；SVG 锐利。
- `[?]` 内存：流式环形缓冲区有界；canvas/ResizeObserver/rAF 在卸载时清理（长时间会话无泄漏）。
- `[?]` 遵循 `prefers-reduced-motion`（轴滑动、任何过渡）。
- `[?]` 快速重新渲染 / prop 频繁变化 — 布局记忆化稳定（无抖动）。

---

## 11. 无障碍（本阶段最低目标）

- `[?]` 根 SVG 有 role/title/desc；aria-label 来自 title。
- `[new]` 每个系列的可访问标签（名称 + 类型）。
- `[new]` 在重要之处颜色不是唯一通道（考虑图案/标签）。
- `[new]`（后续）点/工具提示的键盘导航；数据表回退。
- `[?]` 任何交互元素的 focus-visible 样式。

---

## 12. 主题 / 深色模式

- `[ok]` 所有 21 个 story 已在深色模式下审查；外围框架 + SVG 标记自适应。
- `[?]` 非中性主题（stone、y2k）— 图表颜色 + 结构 token 解析。
- `[?]` `theme="none"`（仅基础 token）— 没有损坏/缺失的 token 回退。
- `[?]` 会话中途实时切换主题/模式会重新解析所有内容（包括 GL）。

---

## 13. 格式化 / i18n

- `[ok]` 轴上的 `currency('$', locale)`。
- `[?]` 轴 + 工具提示上的 `percent`、`compactNumber`、`shortDate`、`monthYear`。
- `[?]` 区域感知（小数/分组分隔符、日期区域设置）。
- `[?]` RTL 布局（轴、图例、工具提示放置）。

---

## 14. API / 类型层面验证

- `[new]` 导出接口测试：barrel + 包别名导出完整契约（option 类型、`ColorAccessor`/`Channel`、legend/margin/scale/`YBaseline` 类型）。
- `[?]` 没有标记泄漏仅内部字段；`SeriesDef` 形状在全部 12 个中稳定。
- `[?]` Channel 类型统一接受 constant | {field} | accessor（重构后）。
- `[?]` `_uid` 在各系列间唯一（包括重复 dataKey、两个流、两条参考线）。
- `[?]` 类型编码 x 比例尺要求（或开发警告），以便捕获错误比例尺配对。
- `[?]` Tree-shaking：导入一个标记不会拉入所有 GL/d3 代码。

---

## 当前状态摘要（来自截图环节 — 浅色 + 深色，全部 21 个 story）

确认可用：所有 bar 变体、负值、area/stacked area、WebGL 散点（浅色+深色）、热力图着色（浅色+深色）、candlestick 颜色（浅色+深色）、图例，以及深色模式下的外围框架/实心标记总体可用。
已确认的 bug：line/area/dot 边缘裁剪 + 超出；流式空白；candlestick 轴标签模糊（浅色+深色）；financial-composite 共享比例尺；参考标签裁剪；`legend="end"` 裁剪；重复 key 警告；默认颜色 token 损坏；热力图顶行裁剪 + 自有比例尺；**半透明填充（band/area）在深色下被冲淡**；Swatch story 展示不足。
设计说明：热力图渐变 + candlestick 颜色是 story 提供的 hex，不是主题 token（不随模式自适应）；y 轴有意使用浮动标签（待确认）。
基本未测试：所有悬停/工具提示交互（截图是静态的）、时间/对数比例尺、SSR、WebGL 上下文丢失、运行时主题切换、非中性主题（stone/y2k）、RTL、a11y、货币以外的格式化器，以及所有数据边界情况。
