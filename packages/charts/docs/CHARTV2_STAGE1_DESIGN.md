# ChartV2 阶段 1 — 设计与正确性研究

为“让它正确 + 真正好用的 API”阶段所做的深入设计工作。这是计划中 Stage 1 背后的思考（包抽取是另一个机械化的阶段）。目标：在通过发布把它锁定之前，先确定一个优秀、难以后悔的图表 API 应该是什么样。是 `CHARTV2_PHASE1_PLAN.md`（问题/证据）与计划面板（顺序安排）的配套文档。

状态：研究 + 提案。第 8 节需要负责人决策。

---

## 0. 概要（TL;DR）

- 核心架构——**标记是返回配置的工厂函数；图表拥有唯一的 x/y 尺度；标记先 resolve() 再 render()**——是现代且正确的选择。它与 Observable Plot（同类最佳的“标记 + 共享尺度”设计）以及 MUI X / Plotly / Highcharts 的 series 数组模型一致。我们应当保留它。
- **API 表面在约 25 个具体方面不一致**（颜色有 5 种形态，`size` 与 `radius`，`upper/lower` 与 `high/low`，位置参数与仅选项，label 只在 4 个标记上有，GL 标记无法使用主题颜色，等等）。设计工作的主要精力就在这里。
- **杠杆率最高的单一想法**是采用**通道/编码模型**（一个视觉属性可以是常量、字段名或 accessor），并统一应用于 color/size/opacity。它把大多数不一致收拢为一个连贯概念，并顺带修复 accessor 颜色 + 图例问题。
- **颜色 token 很好**（10 个分类色 + 9 条连续色带 + 中性色），v1 已有强大的配色盘 API 可采用。真正的缺口：自动分配、GL 无法使用 token、分类 token 在浅色/深色下完全相同、色觉缺陷（CVD）安全性未验证。
- 最大的**正确性**缺口与尺度有关：没有时间尺度、没有对数尺度、退化值域（单点 / 零范围 / 空），以及没有可靠的基线/裁剪（已在计划中）。此外还有一份很长的失败模式矩阵（第 5 节）。

---

## 1. ChartV2 在图表库版图中的位置

有四大 API 家族。理解它们能告诉我们该借鉴哪些经验。

- **组合式 / JSX children** —— Recharts、Victory、visx。
  `<LineChart data><Line dataKey="x"/><XAxis/></LineChart>`。易于发现且符合 React 习惯，但尺度难以协调，节点多时性能受损，跨标记一致性靠手工。**这正是 Chart v1 的模型**——也是 v2 存在的原因。
- **按图表类型的一体化配置** —— Nivo、Chart.js、Tremor（部分）。
  `<ResponsiveLine data={...} big-prop-bag/>`。常见场景下很快；但混合标记类型（同一图表中的 bar + line + band）和组合能力较差。
- **图形语法 / 标记** —— Observable Plot、Vega-Lite、AntV G2。
  `Plot.plot({marks:[Plot.barY(data,{x,y,fill}), Plot.lineY(...)]})`。标记是函数/对象；绘图拥有尺度；每个视觉属性都是一个**通道**。在正确性和组合性上同类最佳；概念数量稍多。
- **Series 数组配置** —— MUI X Charts、Plotly、Highcharts、ECharts。
  `series={[{type:'bar', data...}, {type:'line', ...}]}`，坐标轴单独配置，双尺度使用多个具名轴。务实，在仪表盘中非常常见。

**ChartV2 是前两者优点的混合体：** Observable-Plot 风格的标记（`bar(...)`、`line(...)` 返回配置）通过 MUI 风格的 `series={[...]}` 数组传入，并使用单一共享尺度。这是一个强大、站得住脚的基础。结论：**保留架构；修复 API 表面并补齐缺失的尺度能力。**

同类最佳做到了而我们目前没做的：

1. **统一通道**（Plot/Vega-Lite）：color/size/opacity 在所有地方都接受 constant | field | accessor。（我们只在 `bar`/`dot` 的 color 上这样做。）
2. **一等公民、可配置的尺度**（MUI/ECharts/Plot 都有）：x/y（以及 color/size）尺度的_类型_和选项都是显式且可覆盖的。我们从数据推断 linear 或 band，且不暴露任何配置。
3. **时间尺度**（所有家都有）。我们没有——金融/流式用 band 字符串或原始数字来凑。（`ScaleTime` 已在轴类型中导入，但根从未构建它。）
4. **多轴 / 次坐标轴**（MUI/ECharts/Highcharts/Plotly/Chart.js）用于双单位图表（价格 vs 成交量）。我们强制共享一个 y——这就是金融复合图看起来坏掉的原因。
5. **CVD 安全的默认分类配色盘**（Vega/Plot 提供类似 tableau10 的色集）。我们的在精神上接近；需要验证。
6. （范围之外，为完整性提及）**分面 / 小多图（small multiples）**。

---

## 2. 编码 / 通道模型（最大的单一 API 决策）

### 具体问题

从 API 审计看，“如何设置一个视觉属性”有多种写法：

- color：`ColorAccessor`（bar/dot）| `string`（line/area/band/errorBar/referenceLine）
  | 必填 `string`（dotGL/dotGLInteractive/streamGL）| `string[]` 色带（heatmapGL）
  | `upColor/downColor` 对（candlestick）。五种形态。
- “点的大小”：`radius`（dot，半径）与 `size`（dotGL，直径）。
- opacity：`opacity`（大多数）与 `bandOpacity`（referenceLine）以及没有（line/candlestick）。

### 提案：一个 `Channel<T>` 概念

借鉴 Observable Plot 的通道。一个视觉属性接受以下三种之一：

```ts
type Channel<T> =
  | T // constant: color: '#0171E3' or a token
  | {field: string} // read a data column (maps via a scale)
  | ((datum: Row, index: number) => T); // accessor
```

统一应用于按数据点或按系列变化的属性：`color`（fill/stroke）、`size`/`r`、`opacity`。于是：

- `bar('rev', {color: '#...'})` 仍然可用（常量）。
- `bar('rev', {color: d => d.up ? green : red})` 可用（accessor）——并会显示在图例中（第 3 节）。
- `dot('y', {color: {field: 'category'}})` 通过颜色尺度（分类）映射一列——这正是按类别散点图真正需要的，目前无法做到。

这一单一概念取代了审计中的 C3/C8/C9/C14，并解锁按字段着色（一种常见但目前缺失的能力）。它是增量的：常量用法（今天的用法）继续有效。

范围说明：我们*不*需要完整的 Vega-Lite 类型系统（定量/序数/时间）。通道 + 一小组显式尺度（第 4 节）对这个库来说就是恰当的能力范围。

---

## 3. 颜色系统（深入探讨）

### 我们已有的（良好基础）

Token（`packages/core/src/theme/domainTokens/dataTokens.ts`）：

- **10 个分类色**：blue、orange、purple、green、pink、cyan、red、teal、brown、indigo。（类似 Tableau10——不同系列用不同色相。）
- **9 条连续色带 × 5 级**（5=最深 → 1=最浅）：blue、shamrock、orange、pink、purple、red、teal、yellow、gray。用于有序/定量场景（热力图、分级统计图）。
- **1 个中性色**（标签、参考线、空状态）。

v1 的配色盘 API（`getChartColors`/`useChartColors`）已经暴露：`categorical(n)`、`sequential[hue](n)`、`diverging.positiveNegative/coldHot/custom`、`semantic`（positive/negative/warning/neutral）、`structural`（axis/grid/tick/label）、`alpha()`。这确实是一个好 API——**整体采用**到 charts 包中。

### 待修复的问题

1. **损坏的默认值。** 标记默认使用 `--color-chart-1` / `--color-positive` / `--color-negative`，这些都不存在 → 黑色/不可见。修复方式：**在图表根按系列索引自动分配分类配色盘**（标记默认 color = “自动”；根通过 `categorical(n)` 填充未设置的颜色）。Candlestick 的上涨/下跌以及 errorBar/referenceLine 默认使用配色盘中的 `semantic`/`structural`。
2. **GL 标记无法使用 token。** `hexToGL` 执行 `parseInt(hex,16)`——CSS var 或 `rgb()` 会变成 `NaN`（静默渲染错误），这就是 GL 颜色必须是十六进制的原因。修复：在 GL 上传前把任何 CSS 颜色（token/var/命名色/rgb）解析为具体 RGB——通过主题解析器（我们已有 `token(name)`）和/或 canvas 的 `getComputedStyle` 回退。这样 GL 标记就能接受与 SVG 标记相同的颜色，也能从配色盘自动分配。
3. **Accessor 颜色从图例中消失。** `deriveLegendItems` 会丢弃 `color` 不是静态字符串的任何系列。使用通道后，系列有一个_解析后的_代表性颜色（分配的分类槽位，或在稳定点采样的 accessor，或——对于按字段着色——一个图例可以枚举的小尺度）。图例应显示它。
4. **深色模式。** 分类 token 在浅色和深色下完全相同（`light-dark(#0171E3, #0171E3)`）。它们是选中以便在两种背景下都可读的中间调，我们的截图检查显示它们工作正常——但这是一个需要确认的刻意设计点，而不是意外。**连续色带**包含非常暗的档位（`#02165E`），在深色主体上会失去对比度；使用较低色带档位的热力图/面积图需要在深色模式下检查。
5. **CVD（色盲）安全性。** 10 个分类色类似 tableau10，但未针对绿色盲/红色盲/蓝色盲验证。增加一个验证任务；记录建议的最大不同系列数（约 8），超过后色相难以区分。
6. **系列过多。** 确定超过 10 个分类色后的行为：带图案/透明度变化地循环，或警告。（Plot 警告；ECharts 循环。）建议：循环 + 开发警告。

### 颜色尺度（新增，小型）

在根引入一个显式**颜色尺度**用于 `color: {field}` 用法：

- 分类字段 → 按不同值使用 `categorical(n)`（序数颜色尺度）。
- 定量字段 → 连续色带（选择色相）。
- 发散 → 围绕中点使用 `diverging.*`。
  这正是让按字段着色连贯且可图例化的关键。

---

## 4. 尺度——正确性的基础

### 当前状态

`computeLayout` 为 x 构建**要么** `scaleLinear`（数值 x）**要么** `scaleBand`（其他情况），y 始终是 `scaleLinear`，值域为 `[min,max].nice()`（仅当存在 bar/area 时才包含零）。不暴露任何配置。后果：

- 端点贴边；monotone 曲线会过冲到绘图区外（无裁剪）。
- 空数据 → band 分支 → `NaN` 位置 → 流式渲染什么也不显示。
- 没有时间尺度；没有对数尺度；没有按轴控制。

### 提案

1. **值域/基线对齐**（已计划）：`yBaseline: 'auto'|'zero'|'data'`、`yDomain`、`xDomain`——提供时即为权威（不调用 `.nice()`），与 v1 一致。为纯连续型图表添加绘图区 **clipPath** 和少量**留白**。
2. **退化值域处理**（正确性）：单点 / 零范围 / 全部相等 → 合成一个合理的跨度（例如 `v±1` 或 `[0, v*2]`），使标记可见且刻度合理；空数据 + 显式值域 → 遵从该值域（修复流式）。
3. **显式尺度配置**（新增，可选）：允许调用方设置 x/y 尺度的_类型_和选项，而不是纯粹推断：
   ```
   xScale={{type: 'time'}}   // or 'linear' | 'band' | 'log'
   yScale={{type: 'log', domain: [1, 1e6], nice: true}}
   ```
   推断仍是默认。MUI/ECharts/Plot 都是这样工作的，这消除了一类“猜错了”的 bug。
4. **时间尺度**（填补真正的缺口）：对 Date x 值使用 `scaleTime`；轴已经引用了 `ScaleTime`。可实现真正的金融/流式时间轴和良好的刻度格式化（通过移植的 `shortDate`/`monthYear`）。
5. **次坐标轴 y**（解决金融复合图问题）：允许标记指向次 y 尺度（例如 `bar('volume', {axis: 'y2'})`）并拥有自己的值域，类似 MUI 的 `yAxisId` / Plotly 的 `y2`。这是价格对成交量问题的原则性修复，而不是压扁某个系列。需要决策（第 8 节）——它很强大但增加表面积；如果改为记录“不要在一根轴上混合不兼容单位”，也可以推迟到后续。

需要明确的设计张力：**单一共享尺度就是全部价值主张**（标记之间不会互相矛盾）。次坐标轴是_被认可_的例外，需选择加入且显式，不是自动的——从而为默认情况保留这一保证。

---

## 5. 一切可能出错的地方（失败模式矩阵）

对每个条目：今天会发生什么 → 应该发生什么。驱动 Stage 1 修复 + Stage 2 测试。

### 数据病态

- **空 `data=[]`** → band 尺度、NaN、空白（破坏流式）。→ 遵从显式值域；否则渲染空状态（坐标轴 + “无数据”）。
- **单个数据点** → 零宽/接近退化的值域。→ 合成跨度；把点居中。
- **所有值相等 / 零范围** → 平坦值域，`nice()` 可能使刻度塌缩。→ 给值域加余量。
- **全零 / 全负** → 基线处理（柱子会不会朝错误方向生长？）。→ 由新的边界情况 story 验证；`yBaseline` 正确性。
- **一个巨大离群值** → 其他一切被压扁。→ 记录对数尺度选项；离群值本身是合理的，但 story 应展示对数补救。
- **数值列中的 NaN / null / undefined / 非数值** → 目前被静默强制为 0（有误导性）。→ 跳过（在 line/area 路径中留缺口）还是置 0；决定并记录。line/area 优先留缺口，dot 跳过该点。
- **缺少 dataKey**（拼写错误）→ 到处静默变成 0/undefined。→ 开发警告。
- **重复 x 值**（band）/ **未排序 x**（line）→ band 静默去重；line 画出锯齿。→ 对未排序的 line x 发出开发警告。
- **非常大的 N**（1 万+ SVG 节点）→ 卡顿。→ 已有 GL 标记；记录阈值；（m4 降采样是跟踪中的后续项）。

### 尺度 / 渲染

- **绘图区外的过冲**（monotone/natural 曲线）→ 溢出到边距。→ clipPath。
- **轴标签溢出 / 重叠**（许多 band 类别；长标签；大数字）→ 今天的 candlestick 标签重叠。→ 按宽度自适应自动跳过 + 旋转/截断选项。
- **视口边缘的 tooltip** → 可能被裁切。→ 翻转/钳制（部分已处理；验证）。
- **图例溢出**（许多系列）→ 换行/滚动；`legend="end"` 目前会裁切绘图区。
- **参考线标签跑出画布** → 把徽标钳制在绘图区内。

### 运行时 / 平台

- **SSR / 无 DOM**（Next.js）→ ResizeObserver/canvas/`window` 访问。→ 加守卫；挂载前什么都不渲染或渲染占位符。（文档站点是 Next.js——这很重要。）
- **WebGL 不可用 / 上下文丢失** → GL 标记空白。→ 回退消息或 SVG 路径；处理 `webglcontextlost`。
- **Canvas / 监听器清理**（流式 rAF、环形缓冲、ResizeObserver）→ 泄漏。→ 审计拆卸逻辑。
- **高 DPI** → 模糊。→ webgl 工具中已有 DPR 处理；跨标记验证。
- **运行时切换主题** → 颜色必须重新解析（尤其是 GL，它会缓存十六进制）。→ 主题变化时重新上传。
- **减少动态效果** → 轴有 `animated`；遵从 `prefers-reduced-motion`。

### 无障碍

- **屏幕阅读器** → SVG 只在根上有 title/desc；系列/点没有被描述。→ 至少加 role/aria-label；考虑数据表回退（Highcharts/visx 模式）。
- **键盘** → 无法通过键盘访问 tooltip/点。→ 后续项，但要记录。
- **对比度** → structural（axis/grid/label）和系列颜色在两种背景下的表现。

### i18n / 格式化

- **数字/日期/区域设置** → 已有格式化器（`currency`/`percent`/`compactNumber`/`shortDate`/`monthYear`）；确保感知区域设置并移植到包中。
- **RTL** → 轴侧、图例顺序、tooltip 位置。

---

## 6. 按标记的 API 一致性梳理（提议的规范化）

目标：一个可预测的表面，让同一概念在各处都有相同的名称/形态。（完整现状证据在审计中；这是提议的终态。）

- **数据输入：** 每个数据绑定标记在有明显“主键”时接受一个位置主键（`bar/line/dot/area/dotGL/dotGLInteractive`）；多字段标记保持仅选项（`band/candlestick/errorBar/heatmapGL`），但使用**一致的字段名**。
- **边界命名：** 统一区间概念。为 `band`/`errorBar`（两者是双胞胎）选一套词汇：建议 `high`/`low`（与 candlestick/金融一致）或 `upper`/`lower`——选一个，不要两个都用。`referenceLine` 保留 `y`/`y2`（它们是值，不是字段），但要记录这一区别。
- **颜色：** 各处使用一个 `Channel<Color>`（第 2 节）；默认 = 自动配色盘；candlestick 使用 `{up, down}` 作为有文档的特例（或 `color:{up,down}`）。
- **大小：** 统一为一个含义。建议凡是圆点都用 `radius`（SVG 语义）；如果保留 GL 的 `size` 作为直径，记录 2× 关系，或转换使 `radius` 在两者中都表示半径。
- **描边：** 各处使用 `strokeWidth`（弃用 streamGL 的 `lineWidth`）；暴露目前硬编码的描边（面积顶线、candlestick 影线、line-dots 半径）。
- **不透明度：** 各处使用 `opacity`（弃用 `bandOpacity`；referenceLine 的带使用 `fillOpacity` 或嵌套的 `band:{opacity}`）。
- **曲线：** 导出一个共享的 `CurveType`；在 area（以及 band？）上暴露使用它的 `curve`。
- **label：** 每个非工具型标记都接受 `label` 并设置 `SeriesDef.label`，使图例/tooltip 正确；referenceLine 的 `label` 是徽标（记录这一区别）。
- **key/标识：** 语义 `key` + 布局分配的 `_uid`（已计划），使重复 dataKey 以及两个流/引用不冲突。
- **类型中的 x 尺度要求：** 编码 band-vs-linear-vs-time 要求，使编译器能捕获“在线性 x 上使用热力图”，而不是静默为 null（通过有类型的标记变体，或至少运行时开发警告）。
- **去重：** 共享 `xPixel` 辅助函数（每个标记都在重造 band/linear 像素数学）；共享 `ColorAccessor`/`Channel` 类型（目前在 bar/dot 中重复，未导出）。
- **Tooltip 语义：** 修复值派生（candlestick 只显示 `open`；streamGL 产生 `undefined`；GL 散点会创建外框 tooltip 行）。逐个标记决定 tooltip 行的含义，或让标记声明自己的 tooltip 贡献。

---

## 7. 真正好的部分（保留，不要折腾）

- 标记 + 单一共享尺度的架构；`resolve()`/`render()` 拆分；“根对标记类型零知识”。
- `series={[...]}` 配置的人体工学；`legend`/`tooltip` 作为布尔或配置属性。
- 可组合的图表外框基础组件（`ChartSwatch`、独立 `ChartLegend`、`ChartAxis` 对线/刻度/网格的开关）。
- 指针事件模型（单一捕获矩形 → 订阅者；tooltip 只在索引变化时重渲染）。
- v1 的配色盘 API 设计与 token 集合。
- 用于规模的 WebGL 标记（散点/热力图/流）——相对于 Recharts/Nivo 的真正差异化优势。
- 深色模式在 SVG 标记中已经可用。

---

## 8. 设计决策——已决定（推荐默认值；可否决）

这些会实实在在地改变范围/形态。负责人刚接触图表，已把这些委托给推荐的、行业标准的选择；每项都可逆，且可由负责人或 Ruby Cheung 在 Stage-4 设计评审中否决。按杠杆率排序。

1. **通道模型——已采用。** `color`/`size`/`opacity` 在各标记中统一接受 `constant | {field} | accessor`。它是让 API 连贯并解锁按字段着色的骨架。（标记选项的重构较大，值得。）
2. **次坐标轴 y——现在设计，时间允许就实现。** 为双单位图表（价格/成交量）提供选择加入的 `axis:'y2'`；它也为热力图分类 y 提供参考。如果滑期，记录“一个尺度——不要混合单位”并把实现推迟到后续。默认仍是一个共享尺度（核心保证）。
3. **尺度——现在做对齐 + 时间 + 退化；对数若成本低就做。** 本阶段完成 `yBaseline`/`yDomain`/`xDomain` 对齐 + 裁剪 + 留白 + 退化值域处理 + 时间尺度 + 显式尺度配置。如果成本不高就加显式 `type:'log'`，否则后续。
4. **Null/NaN 策略——已决定：缺口 + 跳过 + 开发警告。** Line/area 在 null/NaN 处断开路径（缺口）；点标记跳过该点；发出仅开发环境的警告。不静默强制为 0。
5. **边界词汇——已决定：`high`/`low`。** 为 `band` 和 `errorBar` 都使用 `high`/`low`（与 candlestick/金融一致）。`referenceLine` 保留 `y`/`y2`（值，不是字段），并记录。
6. **超过 10 个系列——已决定：循环 + 开发警告。** 超过 10 个系列后复用分类配色盘，并在开发环境警告；建议实际最多约 8 个不同色相。
7. **无障碍目标——已决定：现在做最低限度。** 本阶段做根 aria/title/desc + 每个系列的标签；键盘导航和数据表回退是跟踪中的后续项。

此处记录的附加决定：8. **CVD 安全——验证，不改设计。** 保留现有分类 token；增加一轮验证（绿色盲/红色盲/蓝色盲）并记录发现，而不是在本阶段发明新配色盘。

---

## 9. 测试影响（输入 Stage 2）

- **单元**：尺度/值域（auto、基线模式、显式、空、单点、零范围、时间）、通道解析（constant/field/accessor）、配色盘解析器 + token→hex、图例/tooltip 派生（含 accessor + 按字段着色）、`_uid` 唯一性、格式化器、每个标记工厂的 `SeriesDef` 形态。
- **失败模式夹具**：第 5 节每一行一个数据集，断言不抛错且产生合理输出。
- **导出面测试**：barrel + 包别名导出完整契约。
- **视觉**：对每个 story 截取浅色 + 深色 Playwright 截图（现有工具），包括新的边界情况和通道/按字段着色 story。
- **SSR 冒烟**：在没有 DOM 的情况下渲染为字符串（守护 Next.js/文档站点用法）。

---

## 附录——来源参考

- Token：`packages/core/src/theme/domainTokens/dataTokens.ts`
- 配色盘 API（待采用）：`packages/lab/src/Chart/getChartColors.ts`、`useChartColors.ts`
- GL 颜色（仅十六进制）：`packages/lab/src/Chart/webgl.ts` `hexToGL`
- 共享 x 辅助函数（使用不足）：`packages/lab/src/Chart/utils.ts` `xPixel`
- 值域/基线对齐参考：`packages/lab/src/Chart/Chart.tsx`
- 完整 API 审计 + 不一致清单：本次会话的目录（已镜像到 `CHARTV2_PHASE1_PLAN.md` 的问题中）。
