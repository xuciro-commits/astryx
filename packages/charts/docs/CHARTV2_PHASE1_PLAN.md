# ChartV2 — 阶段 1 计划（就地做好）

让 `packages/lab/src/ChartV2/` **就地**达到生产可用状态的持续更新计划——不重命名、不删除 Chart v1、不新建包、不做文档站点。指导原则（来自负责人）：**做真正、生产可用的修复；只要明显正确，就默认采用正规的修法。**

状态图例：`[ ]` 待办 · `[~]` 进行中 · `[x]` 已完成

---

## 0. 如何运行 / 审查

```bash
pnpm -F @astryxdesign/build build      # prereq
pnpm -F @astryxdesign/core build       # prereq (lab typecheck needs core's dist)
pnpm storybook                         # http://localhost:6006  (Lab / ChartV2*)
pnpm -F @astryxdesign/lab typecheck    # ChartV2 currently typechecks clean
pnpm test                              # vitest (no ChartV2 tests exist yet)
```

**可视化审查工具**（我们如何“查看每一张图”）：一个 Playwright 脚本会访问 `iframe.html?id=<storyId>&globals=colorMode:{light|dark}`，为每个 ChartV2 story 截取浅色 + 深色截图。Story ID 来自 `http://localhost:6006/index.json`。截图保存在 `/tmp/chartv2-shots/`。这就是审查循环——每次修改后重新运行，并肉眼比对差异。

---

## 1. 已确认的问题（证据）

### 尺度 / 值域

- **连续型标记（line/area/dot）紧贴绘图区边缘，且过冲部分会溢出。**
  `computeLayout` 把 y 值域精确设为 `[min,max]`（当边界本身已是整数时，`.nice()` 不会增加留白）。`Simple Line`：Jan(38)=最小值贴在坐标轴上，Jun(52)=最大值贴顶，而 `monotone` 曲线会向绘图区_上方_过冲。目前**没有 clipPath**（v1 有 `astryx-chart-plot`），因此过冲会渲染到边距里。柱状图看起来没问题，只是因为它们强制 `includeZero`。
  → `layout.ts:128-136`，`Chart.tsx:295-346` 中没有裁剪。
- **空数据会破坏尺度 → 流式渲染什么也不显示。** 当 `data=[]` 时，`isNumericX` 为 false（`xValues.length > 0` 守卫），于是 x 落入 **band** 分支且值域为空；y 值域变成 `[Infinity,-Infinity]`。随后 `streamGL` 通过 `xScale(n)`/`yScale(n)` 映射推入的点 → `undefined`/`NaN` → 空白。5 秒后验证为空白。→ `layout.ts:44-60,84-136`，`streamGL.tsx:146-152`。**没有根上的 `xDomain`/`yDomain`，streamGL 无法工作。**
- **金融复合图有误导性**：成交量柱（500–1500）与价格共用 y 轴（80–130），把蜡烛图/MA 压成一条细缝。这是单一共享尺度的固有问题。该 story 需要重新设计（去掉成交量，或采用有文档说明的次坐标轴模式）。→ `ChartV2Advanced.stories.tsx:121-171`。

### 图表外框 / 布局

- **Band 轴会绘制每个类别 → candlestick 的 x 标签重叠**成一团（30 个“Day N”标签）。只有调用方传入 `maxTicks` 时才会自动跳过。需要按宽度自适应的默认跳过。→ `ChartAxis.tsx:89-113`。
- **参考线标签徽标**在右边缘被裁切（“Acceptable”）；文本宽度是估算的（`label.length*5.5+8`），可能超出。→ `referenceLine.tsx:70-71,177`。
- **混合标记配 `legend="end"` 时会裁切**最后一根柱/标签（图表区域缩小，但绘图区宽度/标签居中溢出）。→ `Chart.tsx:277-282`。
- **热力图顶行**在绘图区顶部有轻微裁切。→ `heatmapGL.tsx:102-105`。

### 损坏的默认值 / 正确性

- **每个标记的默认颜色 token 都是未定义的。** `--color-chart-1`（bar/line/dot/area/band）以及 `--color-positive`/`--color-negative`（candlestick）在 `packages/core/src/theme` 中**并不存在**。使用默认颜色的标记会渲染成黑色填充 / 不可见的描边。当前所有 story 都通过传入显式十六进制值来绕开这个问题。→ `bar.tsx:72`、`line.tsx:35`、`dot.tsx:22`、`area.tsx:37`、`band.tsx`、`candlestick.tsx:21-22`。
- **重复 key 冲突。** 系列标识 = `dataKey`（`key: dataKey`）。两个系列使用同一个 dataKey 时，会在 `resolved` map（`layout.ts` 的 `resolved.set(s.key,…)`）和 React key（`Chart.tsx` 的 `key={s.key}`）中冲突，静默丢弃数据。`AreaGradient`（`area('revenue')` + `line('revenue')`）上会触发 React 实时警告。另外 `area` 会构建 `gradientId = area-grad-${dataKey}` → DOM id 重复。→ `types.ts:52-54`、所有标记工厂、`layout.ts:219`、`Chart.tsx:310-316`。
- **streamGL 硬编码 `key:'stream'`** → 两个流会冲突。→ `streamGL.tsx:228`。
- **颜色 API 不一致。** `bar`/`dot` 接受 `ColorAccessor`（string | fn）；`line`/`area`/`band` 等只接受 `string`。用 accessor 着色的系列还会从图例中消失：`deriveLegendItems` 会丢弃任何 `color == null` 的系列，而 accessor 系列会设置 `color: undefined`。→ `bar.tsx:12-14,83`、`dot.tsx:11,30`、`line.tsx:26-27`、`area.tsx:26-27`、`legend.ts:18-32`。
- **`dot.dodge` 是存根 TODO**（已声明，从未使用）。→ `dot.tsx:17,48`。
- **标记渲染循环中使用 `key={i}` 数组索引作为 React key** → 重排/流式更新时出现协调（reconciliation）bug。→ `bar.tsx:151`、`line.tsx:88`、`dot.tsx:58`、`candlestick.tsx:83`、`errorBar.tsx:67`。
- **没有配色盘 API**（v1 有 `useChartColors`/`getChartColors`，包含 `categorical`/`sequential`/`diverging`/`semantic`/`structural`/`alpha`）。v2 一个都没有。→ 对比 `Chart/useChartColors.ts`、`Chart/getChartColors.ts`。
- **heatmapGL 自己构建 y band 尺度**（破坏了单一共享尺度）。→ `heatmapGL.tsx:102-105`。

### 运行良好（保持不动）

所有 bar 变体、负值、分组/堆叠、混合、面积 + 堆叠面积、置信带、误差条 + 参考带、WebGL 散点、热力图上色、图例、色块，以及**全局的深色模式**。

---

## 2. 已确定的决策

1. **配色盘 API** → 做真正的实现（复用同包中 v1 的 `getChartColors`/`useChartColors`；让各标记消费它，并修复损坏的默认 token）。
2. **heatmapGL 尺度** → 真正修复：让图表根支持分类 y 尺度，使热力图共享它。
3. **`yBaseline`/`yDomain`/`xDomain`** → 与 v1 完全对齐（流式渲染所必需）。
4. **标记命名**（`bar`/`line`/`dot`）→ 推迟到打包阶段（不是 bug；在“暂不处理”清单上）。现在不重命名。

---

## 3. 工作项（按顺序）

排序原则是先打基础，并让每一步都能通过截图工具独立验证。

### W1 — 系列标识（`_uid`）[ ]

- **问题：** 重复 key 冲突（#3）+ `key={i}`（#7）+ streamGL key（#5）。
- **方案：** 增加由布局分配的 `_uid`（可变字段，参照 `_isTopOfStack`）= `${index}:${key}`；把它作为 `resolved` map、`Chart` 渲染 key、tooltip 查找（`resolved.get`、`resolvedKeys`）和悬停点 key 的真正标识。`key` 仍作为语义标签。把标记渲染循环中的每个 `key={i}` 替换为稳定的按数据点 key（例如 `${dataIndex}` 在_系列内部_没问题，但最好用 x 值；系列内索引可以接受，因为系列以 `_uid` 为作用域）。修复 `area` 的 `gradientId`，使其包含 `_uid`。
- **文件：** `types.ts`、`layout.ts`、`Chart.tsx`、`ChartTooltip.tsx`、`tooltip.ts`、`marks/{bar,line,dot,candlestick,errorBar,area}.tsx`。
- **验证：** `AreaGradient` 的 React 警告消失；新增的“两个系列、同一 dataKey”story 能渲染出两者。

### W2 — 值域 / 基线对齐 + 裁剪 + 连续型留白 [ ]

- **问题：** 贴边 + 过冲 + 空数据损坏（#2，流式）。
- **方案：** 在 `ChartProps` 中增加 `yBaseline?: 'auto'|'zero'|'data'`、`yDomain?`、`xDomain?`；贯穿到 `computeLayout`（参照 v1 `Chart/Chart.tsx:150-220`：显式值域优先且不调用 `.nice()`；`zero` 对称；`auto` 包含 0）。优先级：`yDomain` > 根 `yBaseline` > 每个标记的 `includeZero`。在标记层周围加一个 `clipPath`（类似 v1 的 `astryx-chart-plot`）。为纯连续型图表（无 bar/includeZero、无显式值域）增加少量值域**留白**，使 line/area/dot 的端点不贴边。处理空数据：如果给了 `xDomain`，即使 `data=[]` 也要遵从它（这样流式才有真正的数值尺度）；`yDomain` 同理。
- **文件：** `Chart.tsx`、`layout.ts`、`types.ts`（SeriesContext 已经携带尺度）。
- **验证：** `Simple Line` 不再裁切；流式 story（给定 `xDomain`/`yDomain`，或滚动窗口）能画出内容。

### W3 — 流式端到端可用 [ ]

- 依赖 W2。更新 `StreamingLine` story，传入值域 / 滚动窗口（v1 的“稳定流式窗口”）。确认 streamGL 能映射点且坐标轴会滑动。
- **文件：** `ChartV2Advanced.stories.tsx`，可能还有 `streamGL.tsx`（当尺度不是线性时做保护）。

### W4 — 颜色：统一 accessor + 配色盘 API + 图例修复 [ ]

- **问题：** 颜色不一致（#4）、默认 token 损坏、accessor 系列从图例消失、没有配色盘（#8）。
- **方案：**
  - 通过 `ChartV2/index.ts` + 包的 `index.ts`，从 ChartV2 重新导出 v1 的配色盘（`useChartColors`、`getChartColors`、类型）。
  - 标记的 `color` 默认设为 `undefined` = “自动”；**Chart 根**解析分类配色盘（`useChartColors().categorical(n)`），按索引为每个缺少颜色的系列分配颜色——存为定义上的 `_resolvedColor`（类似 `_uid`）；标记读取 `self._resolvedColor ?? ownColor`。既修复损坏的 token，又为多系列提供自动配色。
  - 扩展 `line`/`area`（以及合适的 `band`）以接受 `ColorAccessor`，与 `bar`/`dot` 对齐。共用一个 `ColorAccessor` 类型（移到 `types.ts`）。
  - 图例：用代表性颜色显示 accessor 着色的系列（在索引 0 处解析 accessor，或使用分配的配色盘颜色），而不是丢弃它们。
- **文件：** `ChartV2/index.ts`、包的 `index.ts`、`types.ts`、`Chart.tsx`、`legend.ts`、`marks/{bar,dot,line,area,band,candlestick}.tsx`。
- **验证：** 默认配色的多系列图表显示不同颜色；新的 accessor 着色 story 出现在图例中；深色模式配色盘自适应。

### W5 — dot.dodge [ ]

- 实现真正的 dodge（按半径偏移同一 x 处重叠的点），或删除该选项。优先实现（生产可用）。→ `dot.tsx`。

### W6 — heatmapGL 共享图表尺度 [ ]

- 为图表根增加分类 y 尺度支持，使热力图读取共享的 y 尺度，而不是自建。核心改动较大；等 W1–W4 落地后再做。
- **文件：** `layout.ts`、`types.ts`（ChartScale/SeriesContext）、`Chart.tsx`、`ChartAxis.tsx`/`ChartGrid.tsx`（分类 y）、`marks/heatmapGL.tsx`。
- **验证：** 热力图行对齐到共享的左侧轴；没有自建的 `scaleBand`。

### W7 — 坐标轴标签自动密度 [ ]

- 为 band 轴提供按宽度自适应的默认标签跳过（修复 candlestick 标签重叠），无需 `maxTicks`。→ `ChartAxis.tsx:89-113`。

### W8 — Story 层面的修复 [ ]

- 参考线标签裁切（测量/钳制徽标的 x）。混合标记配 `legend="end"` 的裁切。金融复合图重做（次坐标轴 story 或去掉成交量）。热力图顶行裁切。

### W9 — 新 story（来自需求简报的审查目标）[ ]

- 纯 SVG `dot` 散点（非 WebGL）。
- `dotGLInteractive` 悬停。
- `referenceLine` 单独使用：单个 `y`；`y`+`y2` 带；`x` 线。
- 边界情况：空数据、单点、全零、全负、一个巨大离群值。
- accessor 着色的系列（检验图例修复）。
- 重复 dataKey 的系列（检验 W1）。
- 通过工具确认每个 story 的深色模式覆盖。

### W10 — 测试 + 最终验证 [ ]

- 为以下内容添加同目录 vitest：`layout`（值域/基线/空数据/堆叠）、`_uid` 唯一性、`legend` 派生（含 accessor）、`tooltip` 派生。运行 `pnpm test`、`pnpm -F @astryxdesign/lab typecheck`、`lint`，并重新截取所有形态的浅色+深色截图。

---

## 4. 待验证 / 未决问题

- 确认缺失 token 的确切集合，以及默认应使用的正确分类 token 名称（配色盘解析 `--color-data-categorical-*`）。
- 连续型图表的留白量（例如约 5%）——选定并记录。
- heatmap 的分类 y：引入 band y 尺度会不会干扰现有数值 y 的消费者？（保护措施：仅当标记请求分类 y 时启用。）
- 既然每个标记已有 `includeZero`，`yBaseline` 的默认值是否仍应保持等价于 `'auto'`？（倾向：根的覆盖优先；保留每个标记的默认值。）

## 5. 范围之外（推迟）

ChartV2 重命名为 Chart · 删除 Chart v1 · 迁到 `packages/charts` · 文档站点第二库支持 + README · 发布 + CI。
