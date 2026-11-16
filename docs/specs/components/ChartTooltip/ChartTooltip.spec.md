---
schema_version: 3
template_version: 5
kind: component
id: component:ChartTooltip
authority: draft
archive_reason: null
superseded_by: null
approved_by: null
approved_at: null
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/charts/src/ChartTooltip.test.tsx,
    apps/storybook/stories/charts/Tooltip.stories.tsx,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:component-test-sufficiency,
    architecture:component-theming-surface,
    architecture:theme-application,
    architecture:knowledge-contracts,
    architecture:layer-runtime,
  ]
contributing: []
system_specs:
  [spec:AST-002, spec:AST-003, spec:AST-013, spec:AST-027, spec:AST-029]
---

# ChartTooltip component contract

## Contract at a glance

| 方面          | 契约                                                                                                                                                                                                                   |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | 无 API 形状或默认值变更。本草案记录已发布的分组内容、指示器、圆点、自定义渲染与定位这些表面。                                                                                                                          |
| 行为          | 最近的指针 x 选择一个数据项；卡片、启用的 SVG 指示器和符合条件的圆点会一起更新。当先前选择与下一次选择都产出内容时，已可见的 Layer 保持打开。卡片停留在最近的图表 HTML 作用域内，并使用 Layer 的 fixed 模式。          |
| 最终用户影响  | 指针用户保留图表嵌套的 Theme/MediaTheme 处理；受支持的浏览器还会把详情保留在裁剪或模态顶层 UI 之上，而简化回退保留普通可见性。                                                                                         |
| 构建方影响    | 无。`Chart tooltip`、tooltip 配置对象以及直接组合 `ChartTooltip` 继续使用相同的 props 和默认值。                                                                                                                       |
| 兼容性/就绪度 | Canary 兼容的行为修复。这份观察性草案不具权威性；定位含义、焦点关联和未来的主题化目标仍是未解决的所有者选择。                                                                                                          |
| 评审检查      | 拒绝文档正文宿主、过早打开自定义内容、变更 API/默认值、丢失指针清理、重复调用自定义渲染、非法 SVG 坐标，或任何声称开放问题已解决的表述。                                                                               |
| 治理规则      | `spec:AST-027/FR7–FR8`、`architecture:layer-runtime/INV1–INV3`、`architecture:theme-application/INV1–INV3`、`spec:AST-013/FR7–FR10`、`architecture:component-test-sufficiency/INV1–INV11`，以及 `spec:AST-029/DEC-4`。 |

本表是评审视角的投影；下文正文才是权威依据。

## Intent

ChartTooltip 为最靠近指针的图表数据项渲染补充性的分组值。它负责指针选中的卡片、该卡片的视口定位、可选的十字准线或条形带高亮，以及符合条件的悬停圆点。Chart 负责数据、刻度、绘图几何、指针分发、可访问命名，以及其受支持的等效数据视图。

## Compatibility and migration

- 已发布的默认值保留：在 canary 表面为是；该包没有稳定发布。
- 兼容性类别：无公开 API 或默认值变更；卡片从使用页面级 z-index 的固定 body portal 迁移到共享的 fixed Layer 运行时。
- 受控/非受控行为：不适用；Chart 的指针流拥有活动索引。
- 迁移决策：无；`spec:AST-027/FR7–FR8` 已经要求该 Layer 迁移。

使用方迁移说明属于使用方文档和发布说明。

## Ownership boundary

**拥有**

- 从最近的图表指针事件中选择 tooltip 内容。
- 为悬停的数据项推导有序的可见系列行。
- 渲染默认卡片或调用方提供的卡片内容。
- 将 Layer 承载在最近的图表 HTML 容器之下，以便嵌套的 Theme 和 MediaTheme 作用域保持继承。
- 通过 Layer fixed 模式对卡片坐标进行定位和视口钳制；自定义渲染器拥有其内容尺寸。
- 渲染当前的十字准线或条形带指示器，以及符合条件的悬停圆点。
- 当组件卸载时，取消订阅 Chart 的指针流。

**不拥有 / 非目标**

- 图表数据、刻度、绘图几何或指针事件生成——由 `component:Chart` 拥有。
- 产品特定的值格式化、系列标签和颜色——由产品调用点和系列定义拥有。
- 图表的可访问名称、隐藏数据表、摘要或其他等效的非指针数据视图——由 `component:Chart` 和产品调用点拥有。
- 新的可聚焦数据点模型或 tooltip 触发关系；这些需要在 `spec:AST-002` 和 `spec:AST-003` 下由所有者决定。

## Public concepts

| 概念         | 封闭取值或状态                                 | 含义                                                                           | 按变体/方向/状态划分的可用性 | 默认值         | 所有者                                                         | 稳定性       | 无效值行为                                                     |
| ------------ | ---------------------------------------------- | ------------------------------------------------------------------------------ | ---------------------------- | -------------- | -------------------------------------------------------------- | ------------ | -------------------------------------------------------------- |
| 系列来源     | 调用方数组或省略                               | 提供行标签、值、颜色、标记类型和悬停圆点资格。                                 | 每个 ChartTooltip            | 空数组         | 产品调用点                                                     | experimental | Utility 系列和未解析的系列会被过滤；缺失和非有限的行值会保留。 |
| 卡片内容     | 默认正文；自定义 React 节点；自定义 `null`     | 显示分组详情，或仅抑制卡片。                                                   | 悬停的数据项                 | 默认分组内容   | `component:ChartTooltip`                                       | experimental | 自定义 `null` 从不打开 Layer，并保持启用的 SVG 指示器和圆点。  |
| 悬停指示器   | 启用或禁用；条形带或垂直十字准线               | 标记绘图区内活动的 x 位置。                                                    | 有效的悬停数据项             | 启用           | `component:ChartTooltip`                                       | experimental | 非法或非有限的图表坐标会抑制该标记。                           |
| 悬停圆点     | 启用或禁用；每个符合条件的已解析非条形系列一个 | 标记活动索引处每个符合条件的系列点。                                           | 有效的有限已解析点           | 启用           | `component:ChartTooltip`                                       | experimental | 缺失和非有限的已解析点会被跳过。                               |
| 卡片定位     | `auto`、`right`、`left`、`top`                 | 根据悬停的 x 坐标和当前垂直规则选择水平定位。                                  | 可见卡片                     | `auto`         | `component:ChartTooltip`                                       | experimental | 未知值会被 TypeScript 拒绝。                                   |
| Layer 宿主   | 最近的图表 HTML 容器                           | 在保持为 SVG 之外合法 HTML 的同时，保留最近的 Theme 和 MediaTheme CSS 作用域。 | 浏览器渲染                   | 最近的图表容器 | `architecture:layer-runtime`; `architecture:theme-application` | settled      | 文档正文宿主会丢失嵌套的 CSS 作用域。                          |
| Layer 可见性 | 已关闭；浏览器顶层打开；简化回退可见           | 在受支持时使用原生顶层堆叠；否则保留普通卡片可见性。                           | 浏览器渲染                   | 已关闭         | `architecture:layer-runtime`                                   | settled      | 简化回退不宣称具备顶层堆叠。                                   |

## Behavioral and layout contract

草案需求会标明其依据，以免把观察到的代码误认为有意的决策。`current` 契约不含未解决的行。

| ID  | 候选不变式                                                                                                                                                                                                                                                    | 依据                                                                                                                               | 草案评审状态   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| FR1 | Chart 的 `tooltip` 简写必须注入图表系列；当需要行和圆点时，直接组合目前要求调用方传入相同的系列数组。                                                                                                                                                         | 实现、类型、文档和聚焦测试                                                                                                         | verify         |
| FR2 | 最近的指针事件必须选择一个数据索引；从存在内容到存在内容的变更必须替换内容，而不关闭已打开的 Layer。离开绘图区、选择过期索引，或选择被自定义 `null` 抑制的内容，必须让 Layer 保持关闭或隐藏已打开的卡片，并且之后某个存在内容的索引必须能够再次将其显示出来。 | `spec:AST-013/FR8–FR10`；`architecture:component-test-sufficiency/INV4–INV5`；实现以及聚焦/浏览器测试                              | verify         |
| FR3 | 默认卡片必须显示 x 值，并显示单个裸值，或为每个可见的已解析系列显示一行带标签的行。自定义渲染器必须在每次渲染时接收一次 x 值和有序行，并且可以返回 `null` 而不打开 Layer。                                                                                    | 实现和聚焦测试                                                                                                                     | verify         |
| FR4 | 启用的指示器必须在 band 刻度上为条形系列渲染条形带高亮，其他情况下渲染垂直十字准线。启用的圆点必须排除条形系列以及非有限或缺失的已解析点。                                                                                                                    | 实现和聚焦测试                                                                                                                     | verify         |
| FR5 | `auto` 目前从右侧开始，在行内溢出时翻转到左侧；显式的 `right`、`left` 和 `top` 使用悬停的 x 坐标，而当前每个模式都使用绘图区顶部作为其垂直原点，并对结果坐标进行钳制。自定义渲染的内容保留其调用方拥有的尺寸。                                                | 实现和部分聚焦测试                                                                                                                 | human decision |
| FR6 | 宿主必须保持在最近的图表 HTML 容器之下，以保留 Theme 和 MediaTheme 作用域，并且必须使用 `useLayer({mode: 'fixed'})`；受支持的浏览器获得原生顶层提升，而没有 Popover API 的浏览器使用 Layer 的简化可见性回退。文档正文宿主或数值 z-index 不是替代方案。        | `architecture:theme-application/INV1–INV3`；`spec:AST-027/FR7–FR8`；`architecture:layer-runtime/INV1–INV3`；`spec:AST-013/FR7–FR8` | settled        |
| FR7 | 组件必须按活动回调身份订阅一次，并且必须在卸载时释放该订阅。                                                                                                                                                                                                  | 实现和聚焦测试                                                                                                                     | verify         |
| FR8 | 服务端渲染必须省略仅浏览器端使用的 layer，且不读取 portal 目标；SVG 指示器仍由渲染派生。                                                                                                                                                                      | `spec:AST-013/FR9–FR10`；实现和聚焦的服务端渲染测试                                                                                | verify         |

### Allowed variation

- **AV1 — 系列内容。** 调用方可以通过现有公共输入选择标签、颜色、顺序、值和自定义渲染的卡片内容。
- **AV2 — 图表几何。** Chart 可以更改绘图区尺寸和刻度输出；ChartTooltip 遵循提供的指针坐标并钳制其卡片坐标。自定义渲染器拥有其内容尺寸。
- **AV3 — 补充表面。** 当图表的非指针呈现已提供足够详情时，产品可以省略 tooltip。

### Representative states

| 状态                    | 必需不变式                                                           | 允许的变化                                  |
| ----------------------- | -------------------------------------------------------------------- | ------------------------------------------- |
| 存在内容的状态转换      | 卡片内容和位置更新，同时同一 Layer 宿主保持连续打开。                | 选中的值和结果坐标会变化。                  |
| 初始 / 指针离开         | 卡片已关闭，且不暴露过期的卡片内容。                                 | SVG 指示器不存在。                          |
| 过期索引                | 对于当前数据中不存在的指针索引，Layer 不打开。                       | 先前的有效内容可能已经被关闭。              |
| 单系列                  | 卡片显示 x 值外加一个值。                                            | 调用方标签、颜色和值会变化。                |
| 多系列                  | 卡片保留推导出的可见系列顺序，并为每一行加标签。                     | 行的数量和类型会变化。                      |
| 自定义内容              | 渲染器接收当前的 x 值和行。                                          | 可以返回任意非交互式 React 内容。           |
| 自定义 `null`           | Layer 从不打开，同时启用的绘图区指示器仍然存在。                     | 指示器和圆点选项仍可独立配置。              |
| band 刻度上的条形       | 条形带高亮替换十字准线；条形不获得悬停圆点。                         | 条形带几何遵循刻度。                        |
| 折线、面积或圆点        | 十字准线和符合条件的有限悬停圆点跟随选定索引。                       | 系列绘制和已解析坐标会变化。                |
| 嵌套 Theme / MediaTheme | Layer 宿主仍是最近活动作用域的 DOM 后代。                            | 主题名称和媒体模式会变化。                  |
| 裁剪或模态组合          | Layer 宿主是位于裁剪和顶层同级之上的已打开原生 popover。             | 周围的裁剪和模态几何会变化。                |
| 简化的 Popover 回退     | 宿主初始隐藏，在有效悬停时打开，并再次隐藏且不会出现虚假的可见状态。 | 原生顶层增强不可用。                        |
| 服务端渲染              | 不发出 portal 或浏览器 layer。                                       | 在没有指针状态时，渲染的 SVG 片段可能为空。 |

### Transformation and precedence order

- **ORD1 — 指针选择。** 接收 Chart 指针事件 → 解析最近的数据索引 → 推导数据项和行 → 解析自定义或默认卡片内容 → 当下一选择也产出内容时保留已打开的 Layer，否则对缺失内容保持 Layer 关闭或对存在内容将其显示 → 测量最终卡片几何并钳制其坐标。
- **ORD2 — 指示器选择。** 检查 `hoverIndicator` → 当任一条形使用 band 刻度时优先采用条形带表示 → 否则解析十字准线 x → 抑制非有限输出。
- **ORD3 — 圆点选择。** 检查 `showHoverDots` → 保留符合条件的非条形系列 → 找到当前已解析的点 → 抑制缺失或非有限的点。

### Performance and resources

- **PR1 — 指针渲染边界。** 在同一个已解析数据索引内的指针移动，当计算出的卡片位置未改变时，不应强制 React 提交。
- **PR2 — 订阅所有权。** ChartTooltip 恰好拥有一个当前指针订阅，并且必须在订阅身份变化或组件卸载时释放该订阅。
- **PR3 — 渲染回调。** 自定义卡片渲染器不得仅为判定可见性而在一次 React 渲染中被调用两次。

## Accessibility contract

- **AR1 — 补充信息。** 仅存在于 tooltip 中的内容不能替代 Chart 的可访问名称、受支持的隐藏数据表、摘要或其他完整数据视图。
- **AR2 — 当前语义。** 卡片目前暴露 `role="tooltip"` 并保持非交互。本草案不主张仅指针的触发路径已完整实现 WAI-ARIA tooltip 模式。
- **AR3 — 关联缺口。** 键盘可达性和 `aria-describedby` 所有者仍未解决，因为 Chart 没有可聚焦的数据点触发器。在未经所有者批准的情况下，审计不得凭空发明该交互或 API。

## Design relationships

| 解剖结构或状态 | 设计要求                                                                                   | 呈现权威                                                                                   | 层级角色 | 组件契约     |
| -------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | -------- | ------------ |
| Layer 宿主     | 保持在最近的图表 HTML 作用域之下；在可用时使用原生顶层堆叠，并在简化回退中保留普通可见性。 | `architecture:theme-application/INV1–INV3`；`spec:AST-027/FR7–FR8`；`spec:AST-013/FR7–FR8` | 覆盖层   | FR6          |
| Tooltip 卡片   | 呈现分组的补充详情，且不接受指针交互。                                                     | unsettled；未链接当前设计记录                                                              | 辅助     | FR3、AR1–AR3 |
| 系列行         | 将一个可见标签和值与其装饰性系列色块关联。                                                 | 观察到的实现                                                                               | 辅助     | FR3          |
| 悬停指示器     | 标记活动的 x 区域，且不改变图表的数据或可访问名称。                                        | unsettled；未链接当前设计记录                                                              | 辅助     | FR4          |
| 悬停圆点       | 在选定索引处呼应一个符合条件的系列点。                                                     | unsettled；未链接当前设计记录                                                              | 辅助     | FR4          |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Layer host": {
    "none": {
      "reason": "unsettled: the host paints the card with semantic tokens but no current contract decides whether ChartTooltip needs a public target."
    }
  },
  "Tooltip card": {
    "none": {
      "reason": "intentional: the semantic role-only child adds no component-owned paint; the Layer host owns the card chrome."
    }
  },
  "Series row": {
    "none": {
      "reason": "intentional: shared Layout, Text, and ChartSwatch components own the rendered row surfaces."
    }
  },
  "Hover indicator": {
    "none": {
      "reason": "unsettled: semantic tokens paint the current SVG mark but no current contract selects public theme reachability."
    }
  },
  "Hover dot": {
    "none": {
      "reason": "unsettled: series-owned paint and current fixed geometry have no approved public theme target."
    }
  }
}
```

## Family and system relationships

- 当前没有家族或设计记录管辖 ChartTooltip。
- `architecture:layer-runtime` 和 `spec:AST-027/FR7–FR8` 要求在受支持处采用 fixed Layer 组合与浏览器顶层提升。
- `architecture:theme-application/INV1–INV3` 要求宿主保持在最近的 Theme 和 MediaTheme CSS 作用域内，而不是 portal 到文档正文。
- `architecture:component-test-sufficiency` 拥有合理的公共状态划分和可观察断言。
- `architecture:component-theming-surface` 拥有解剖结构到目标的处置；本草案记录当前缺失，而不决定未来的可主题化性。
- `architecture:knowledge-contracts` 将使用方语法保留在 `ChartTooltip.doc.mjs` 中，并将观察到的行为保留在本草案组件记录中。
- `spec:AST-013/FR7–FR10` 拥有简化 Popover 回退、服务端渲染边界和真实浏览器证据要求。
- `spec:AST-002` 拥有任何未来的公共 API 或兼容性决策。
- `spec:AST-003` 拥有任何未来的被动覆盖层协调模型。
- `spec:AST-029/DEC-4` 拥有红前绿行为修复；更广泛的 Night Watch 契约拥有本观察性回填、有限证据清单、客观修复和失败关闭就绪报告。

## Verification map

| 契约         | 验证                                                               | 代表性状态                                                                | 变异或失败预期                                                                     | 审计小节                           |
| ------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------- |
| FR1、FR3–FR4 | `ChartTooltip.test.tsx`；Tooltip Storybook 测试夹具                | 单系列、多系列、自定义、null、过期索引、条形、折线、缺失值                | 过期/自定义 null 状态打开 Layer、公共选项改变输出，或缺失/非有限点泄漏为非法 SVG。 | `audit:ChartTooltip/behavior`      |
| FR2          | 存在内容连续性聚焦测试；模态 Storybook play 断言                   | 初始打开、存在→存在、离开→重新打开、打开→过期→有效、内容→自定义 null→内容 | 存在内容变更关闭/重新打开 Layer、留下旧内容，或阻止关闭状态之后的后续存在内容。    | `audit:ChartTooltip/behavior`      |
| FR5          | 聚焦定位测试；源代码审阅                                           | right；其他模式仍为空白                                                   | 在没有所有者裁决或每个公共值证据的情况下变更定位。                                 | `audit:ChartTooltip/api-behavior`  |
| FR6          | 红/绿 Layer 宿主、嵌套主题和简化回退测试；模态 Storybook play 断言 | 嵌套 Theme/MediaTheme、已关闭、回退打开/关闭、原生模态悬停                | 文档正文宿主丢失局部主题作用域、原生顶层状态缺失，或回退可见性为假。               | `audit:ChartTooltip/layering`      |
| FR7          | 聚焦生命周期测试                                                   | 挂载与卸载                                                                | 卸载后仍保留指针监听器。                                                           | `audit:ChartTooltip/code-health`   |
| FR8          | `renderToString` 聚焦测试                                          | 服务端渲染                                                                | 服务端求值读取 `document` 或发出仅浏览器端使用的卡片。                             | `audit:ChartTooltip/runtime`       |
| AR1–AR3      | Chart 可访问性测试；聚焦 axe；所有者评审待定                       | 小数据替代视图和悬停卡片                                                  | tooltip 内容成为唯一数据路径，或草案语义被当作策略。                               | `audit:ChartTooltip/accessibility` |

## Decision log

无。本草案记录观察到的行为，以及当前共享权威已经要求的 Layer 和主题局部性修正；它不批准新的 ChartTooltip 策略。

## Open questions

- **OQ1 — 定位含义。** `top`、`left`、`right` 和 `auto` 是否应在两个轴上都相对悬停点，还是公共描述应指明当前的绘图区顶部垂直原点？（`human-api`）
- **OQ2 — 键盘与 tooltip 关联。** Chart 是否应暴露可聚焦的数据点触发器和 `aria-describedby` 关系，还是该表面应使用不同语义，而数据表仍作为键盘/AT 路径？（`human-api`）
- **OQ3 — 主题化可达性。** Layer 宿主或任何 SVG 指示器是否应成为稳定的公共主题目标？（`human-api`）

## Content boundary

本文件不重复使用方的 prop 表/示例、当前审计结果、实现步骤或共享系统规则。它链接到它们的拥有者。
