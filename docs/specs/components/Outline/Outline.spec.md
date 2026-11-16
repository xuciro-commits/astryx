---
schema_version: 3
template_version: 7
kind: component
id: component:Outline
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers:
  [public-api, behavior, layout, theming, accessibility, interaction]
verified_by:
  [
    packages/core/src/Outline/Outline.test.tsx,
    packages/core/src/Outline/OutlineFocus.a11y.chromium.spec.ts,
    packages/core/src/theme/themingTargets.test.ts,
    .github/visual-baseline/manifest.json,
    scripts/check-knowledge.mjs,
  ]
modules: [module:Outline/parseOutlineFromMarkdown]
families: []
design_specs: [design:reduced-motion]
architecture:
  [
    architecture:component-theming-surface,
    architecture:interaction-modality,
    architecture:public-component-api,
  ]
contributing: []
system_specs: [spec:AST-009, spec:AST-020]
---

# Outline component contract

## Contract at a glance

| Area          | Contract                                                                                                                                                                                                                     |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公开契约      | `items`、`activeId`、`onActiveIdChange`、`label`、`density`、`onNavigateStart`、`onNavigateEnd`、`offset`、`scrollContainerRef`、`hasScrollOnClick`、根 `BaseProps`、`ref`。                                                 |
| 行为          | 一个带标签的同页标题链接导航列表，支持键盘移动、随滚动跟踪的当前标题，以及滑动指示器。                                                                                                                                       |
| 最终用户影响  | 用户能看出自己在长页面中的位置，并通过指针或键盘跳到任意标题，落点位于固定页眉之下。                                                                                                                                         |
| 构建者影响    | 构建者显式的 `aria-label` 本应用于命名该导航；目前 `label` 或本地化默认值会取代它（FR1 缺口）。                                                                                                                              |
| 兼容性/就绪度 | 已发布行为记录为 current；无 API、默认值或输出变化。Current-state impact 下列出了四处实现缺口。                                                                                                                              |
| 审查检查      | 拒绝以下情况：链接被排除在 Tab 顺序之外，或未指明例外就加入方向键移动；目标缺失时出现死链；回调触发两次；焦点轮廓丢失。                                                                                                      |
| 治理规则      | `architecture:interaction-modality`；`architecture:component-theming-surface`；`architecture:public-component-api` INV5–INV8；`spec:AST-020` FR15；`design:reduced-motion` DR1–DR3；WCAG 2.2 SC 1.3.1、2.1.1、2.4.3、2.4.7。 |

本表是审查投影；以下正文具有权威性。

## Intent

Outline 提供同页标题导航：带标签的标题链接、垂直指示轨道，以及跟随读者当前所在标题的滑动活动指示器。文档拥有这些标题。

使用方语法与示例属于 `Outline.doc.mjs`。

## Compatibility and migration

- 保留的已发布默认值：`yes`——本地化的“Table of contents”标签、默认密度、无偏移、以最近的可滚动祖先（否则窗口）作为滚动根、点击时平滑滚动。
- 兼容类别：记录已发布行为；无公开 prop、默认值、DOM、target 或样式输出变化。
- 受控/非受控行为：当前标题通过 `activeId` 与 `onActiveIdChange` 受控，或为非受控并由滚动跟踪。
- 迁移决策：无

使用方迁移说明属于使用方文档与发行说明。

## Current-state impact

- **调用方 `aria-label` 被取代（FR1）。** 调用方的 props 在组件的 `aria-label` 之前展开，因此调用方的 `aria-label` 会被 `label` 或本地化默认值取代；只有 `label` prop 能为该导航命名，而 `architecture:public-component-api` INV5 允许调用方的显式输入到达元素。
- **导航后焦点仍留在 Outline 上（FR4）。** 激活链接会滚动到该节，但焦点仍留在链接上，因此下一次 Tab 会越过 Outline，通常是回到内容顶部方向，而不是进入所选小节；原生页内链接则会移动顺序焦点的起点（WCAG 2.2 SC 2.4.3）。
- **在减少动效下指示器仍滑动（FR6）。** 指示器的移动与尺寸变化过渡没有减少动效分支，而 `design:reduced-motion` DR1–DR3 要求它在精细指针上立即变化、在粗指针上以 200 ms 或更短时间交叉淡入。
- **在减少动效下导航仍平滑滚动（FR4）。** 跟随链接总是平滑滚动到标题，而 `design:reduced-motion` DR1–DR3 要求由组件发起的滚动在精细指针上立即落位、在粗指针上以 200 ms 或更短时间交叉淡入。

## Ownership boundary

**拥有**

- 导航地标及其 `outline` target、列表、标题链接及其 `outline-item` target、标签、指示轨道，以及活动指示器及其 `outline-indicator` target。
- 列表内的键盘焦点、滚动跟踪、点击与键盘导航，以及导航回调。

**不拥有／非目标**

- 目标标题及其内容——由文档或产品调用点拥有。
- 从 markdown 构建 `items`——由 `module:Outline/parseOutlineFromMarkdown` 拥有。

## Public concepts

| 概念     | 封闭取值或状态                                     | 含义                                                                                   | 按变体/方向/状态的可用性 | 默认值                      | 所有者              | 稳定性 | 无效值行为                     |
| -------- | -------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------ | --------------------------- | ------------------- | ------ | ------------------------------ |
| 条目     | `{id, label, level}` 列表                          | 按顺序排列的标题，标题层级为 1–6。                                                     | 始终                     | —                           | 调用方              | 稳定   | 层级被钳制为四档缩进。         |
| 当前标题 | 受控 `activeId`；滚动跟踪                          | 被标记为当前的标题。                                                                   | 始终                     | 滚动跟踪                    | `component:Outline` | 稳定   | —                              |
| 标签     | 字符串                                             | 该导航的无障碍名称。                                                                   | 始终                     | 本地化默认值                | `component:Outline` | 稳定   | —                              |
| 密度     | `default`；`compact`                               | 链接内边距。                                                                           | 始终                     | `default`                   | `component:Outline` | 稳定   | 封闭联合类型；由类型系统拒绝。 |
| 滚动范围 | `offset`；`scrollContainerRef`；`hasScrollOnClick` | 激活线与落点偏移；被滚动的容器（否则为最近的可滚动祖先，再否则为窗口）；点击是否滚动。 | 始终                     | 0；最近的可滚动祖先；`true` | `component:Outline` | 稳定   | —                              |
| 导航事件 | `onNavigateStart`；`onNavigateEnd`                 | 在链接导航开始及其滚动稳定时触发。                                                     | 始终                     | 无                          | 调用方              | 稳定   | —                              |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 依据                                                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| FR1 | Outline 渲染一个 `nav`，它带有 `outline` target，反映 `density`，由 `label` 或本地化的“Table of contents”命名，其中包含一个 `ul`（`role="list"`），内有若干 `li` 条目，每个条目带有一个指向 `#<id>` 的链接，其标签以省略号截断，随后是一个 `aria-hidden` 的指示轨道和一个 `aria-hidden` 的活动指示器。调用方显式的 `aria-label` 会到达 `nav`（`architecture:public-component-api` INV5）。实现缺口：组件的 `aria-label` 会取代它（Current-state impact）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 当前源码与测试                                                |
| FR2 | 每个链接携带 `outline-item` target，它反映 `level`，并对当前标题反映 `active`；当前链接带有 `aria-current="location"`、主文本颜色与半粗字重。标题层级 1 和 2 共用第一档缩进，层级 3、4 和 5–6 分别取第二、第三、第四档。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 当前源码与测试                                                |
| FR3 | 每个链接都在常规 Tab 顺序中，且除本记录指明例外外，Outline 不在链接之间添加方向键、Home 或 End 移动（`spec:AST-020` FR15）；Tab 在最后一个链接之后离开列表。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 当前源码与测试；`spec:AST-020` FR15；WCAG 2.2 SC 2.1.1        |
| FR4 | 在目标存在的链接上点击、按 Enter 或 Space，会把 `#<id>` 压入历史并平滑滚动到该标题：在 `offset` 为 0 时，每个可滚动祖先（含窗口）都滚动到使该标题到达顶部；`offset` 非零时只有滚动根（`scrollContainerRef`，否则最近的可滚动祖先，再否则窗口）滚动，落点为 `offset` 像素加上该标题自身的滚动外边距，位于其顶部之下；`onNavigateStart` 在导航开始时触发，`onNavigateEnd` 在滚动稳定或读者以手动滚动打断时恰好触发一次，若没有滚动结束事件则回退到超时；第二次导航会立即结束第一次，且 Outline 在滚动中途卸载后 `onNavigateEnd` 不再触发。在减少动效下，导航滚动不产生位移：在精细指针上立即落位（`design:reduced-motion` DR3），在粗指针上以 200 ms 或更短时间交叉淡入（DR2）。当 `hasScrollOnClick={false}` 时什么都不滚动：hash 被压入、标题被标记为当前，`onNavigateEnd` 立即触发。在目标缺失时点击或按 Enter，以及任何修饰键组合，都交由浏览器处理；在目标缺失时按 Space 不做任何事。跟随链接会把顺序焦点的起点移到目标，正如原生页内链接（WCAG 2.2 SC 2.4.3）。实现缺口：在减少动效下滚动仍是平滑的；且焦点仍停留在 Outline 链接上，因此下一次 Tab 从 Outline 之后继续，而不是进入所选小节（Current-state impact）。 | 当前源码与测试                                                |
| FR5 | 非受控时，当前标题跟随读者在滚动根（`scrollContainerRef`，否则最近的可滚动祖先，再否则窗口）中的滚动位置，使用由 `offset` 偏移的激活线以及每个标题自身的滚动外边距；在任何标题越过该线之前，第一个标题为当前，一旦滚动根到达末尾，最后一个标题为当前；点击会在滚动稳定后把其标题标记为当前。非受控时，`onActiveIdChange` 报告当前标题的每次变化，无论来自滚动还是点击；受控时，Outline 不跟踪滚动，由 `activeId` 决定，`onActiveIdChange` 报告点击所选的标题。键盘焦点移动与组件自身的导航滚动不被视为手动滚动。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 当前源码与测试                                                |
| FR6 | 活动指示器是内联起始处一条 2px `--color-icon-primary` 的竖条，覆盖在 2px `--color-border` 轨道上，通过 CSS 锚点定位贴在当前链接上，并以快速标准过渡移动。在减少动效下，指示器不产生位移：在精细指针上立即变化（`design:reduced-motion` DR3），在粗指针上以 200 ms 或更短时间交叉淡入（DR2）。实现缺口：该过渡没有减少动效分支，因此指示器仍会滑动（Current-state impact）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 当前源码与测试                                                |
| FR7 | 键盘聚焦的链接在所有受支持的上下文中都显示共享焦点轮廓。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 当前源码；浏览器证据；`architecture:interaction-modality`     |
| FR8 | `ref`、DOM、data 与事件 props、`xstyle`、`className` 和 `style` 到达 `nav` 或在其上组合；`data-testid` 到达它。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 当前源码与测试；`architecture:public-component-api` INV5–INV8 |

### Allowed variation

- **AV1 — 标题。** 标题数量、标签、层级与当前标题可变，而解剖结构不变。
- **AV2 — 密度。** 默认与紧凑密度使用相同的解剖结构与 target。

### Representative states

| 状态       | 必需不变式                                                          | 允许的变体 |
| ---------- | ------------------------------------------------------------------- | ---------- |
| 非受控滚动 | 当前标题跟随滚动；`onActiveIdChange` 报告它。                       | 偏移。     |
| 受控       | 由 `activeId` 决定；点击通过 `onActiveIdChange` 报告。              | —          |
| 键盘       | Tab 访问每个链接；Enter 与 Space 导航；无方向键、Home 或 End 移动。 | —          |
| 目标缺失   | 点击或 Enter 表现为普通链接；Space 不做任何事；无回调。             | —          |
| 空         | 轨道与指示器渲染；无链接，因此无 Tab 停靠点。                       | —          |

### Transformation and precedence order

- **ORD1 — 当前标题。** 受控 `activeId` → 滚动位置。
- **ORD2 — 激活。** 修饰键组合，或在目标缺失时点击/按 Enter → 浏览器默认行为；目标缺失时按 Space → 无操作；否则压入 hash、滚动并触发回调。

### Performance and resources

- **PR1 — 滚动跟踪。** 非受控期间，Outline 在挂载时监听其滚动根上的滚动；导航等待滚动结束，并带超时回退；Outline 安装共享按压控制器。

## Accessibility contract

- **AR1 — 导航地标。** `nav` 由调用方显式的 `aria-label` 命名，否则由 `label` 或本地化默认值命名（FR1 缺口），列表与条目保持列表语义（WCAG 2.2 SC 1.3.1）。
- **AR2 — 当前位置。** 当前链接暴露 `aria-current="location"`；指示器与轨道对辅助技术隐藏。
- **AR3 — 链接在 Tab 顺序中且具有真实焦点。** 每个链接通过常规 Tab 顺序获得键盘焦点，并保留真实的 DOM 焦点，而非 `aria-activedescendant`（`spec:AST-020` FR15）。

## Design relationships

| 解剖或状态 | 设计要求                               | 表现权威       | 层级角色 | 组件契约 |
| ---------- | -------------------------------------- | -------------- | -------- | -------- |
| Outline    | 组合标题导航与指示器。                 | 当前源码与文档 | 支撑     | FR1      |
| 标题链接   | 导航到一个标题，并携带层级与活动状态。 | 当前源码与文档 | 显著     | FR2–FR4  |
| 标签       | 链接内的标题文本，以省略号截断。       | 当前源码与文档 | 显著     | FR1, FR2 |
| 指示轨道   | 活动标记背后的竖线。                   | 当前源码与文档 | 支撑     | FR6      |
| 活动指示器 | 与当前链接对齐的标记。                 | 当前源码与文档 | 支撑     | FR6      |

标签位于 `outline-item` target 之内，并继承其文本处理。指示轨道的 target 暴露尚未确定（OQ2）。

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Outline": {"target": "outline"},
  "Heading link": {"target": "outline-item"},
  "Label": {"inherits": "outline-item"},
  "Indicator track": {
    "none": {
      "reason": "unsettled: No current public target reaches this part"
    }
  },
  "Active indicator": {"target": "outline-indicator"}
}
```

## Family and system relationships

- `module:Outline/parseOutlineFromMarkdown` 从 markdown 构建 `items`。
- `architecture:interaction-modality` 拥有焦点指示；FR7 应用它。
- `architecture:component-theming-surface` 拥有 target 映射、继承部分与未决处置。
- `architecture:public-component-api` 拥有调用方输入路由；FR1 记录 `aria-label` 缺口，FR8 应用其余部分。
- `spec:AST-009` 拥有无障碍树证据；验证映射指出了它的缺口。

## Verification map

| 契约         | 验证                                                                                                                | 代表性状态                                                                                                   | 变更或失败预期                                                                                                                                                                                                                                                                                     | 审计小节                 |
| ------------ | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| FR1, AR1     | `Outline.test.tsx` 的带标签导航、默认标签、类名与轨道测试；稳定视觉基线 `core-outline--basic`（中性主题与探针主题） | 条目；默认标签；轨道与指示器                                                                                 | 缺少 `nav` 名称、链接或指示器，或丢失 `outline` 类名，则失败；默认轮廓发生变化会以“已变更”返回以供审查。缺口：轨道测试匹配任意 `aria-hidden` 元素，因此缺失轨道也能通过；没有测试覆盖标签包装器或其截断，也没有测试覆盖调用方 `aria-label`；且没有无障碍树检查证明地标名称（`spec:AST-009` FR3）。 | `audit:Outline/a11y`     |
| FR2, AR2     | `Outline.test.tsx` 的受控 `aria-current`、条目类名与活动锚点测试                                                    | 受控当前；活动顺序                                                                                           | 缺少 `aria-current`、`outline-item` 类名、活动类名或 `data-level`，或活动链接位于指示器之后，则失败。缺口：层级缩进没有单元检查。                                                                                                                                                                  | `audit:Outline/theming`  |
| FR3, AR3     | `Outline.test.tsx` 键盘套件；`OutlineFocus.a11y.chromium.spec.ts` 的 Tab 路径                                       | 每个链接都在 Tab 顺序中；真实焦点；无方向键、Home 或 End 移动；最后一个链接之后 Tab 离开；一个条目与零个条目 | 链接被排除在 Tab 顺序之外、链接上出现 `tabindex`、使用 `aria-activedescendant`、方向键/Home/End 键移动焦点，或最后一个链接之后 Tab 仍留在列表中，则失败。                                                                                                                                          | `audit:Outline/keyboard` |
| FR4, ORD2    | `Outline.test.tsx` 的导航回调与滚动作用域套件                                                                       | 点击、Enter、Space；稳定；超时；双重稳定；打断；目标缺失；修饰键；`hasScrollOnClick={false}`；偏移落位       | 导航不滚动、回调触发零次或两次、目标缺失或修饰键组合被拦截，则失败。没有测试覆盖导航后焦点去向。没有测试覆盖减少动效下的导航滚动。没有测试覆盖第二次导航结束第一次、滚动中途卸载后 `onNavigateEnd` 不触发，或目标缺失时按 Space。没有测试检查成功导航后的 hash 压入。                              | `audit:Outline/behavior` |
| FR5, ORD1    | `Outline.test.tsx` 的滚动跟踪、受控、偏移、滚动外边距与作用域容器测试                                               | 非受控滚动；受控 API；偏移；滚动外边距；容器；键盘与自身滚动                                                 | 当前标题忽略偏移或滚动外边距、跟踪错误的容器，或把键盘焦点或自身滚动当作手动滚动，则失败。没有测试派发 `scroll` 事件，因此跟踪的滚动事件路径没有检查。                                                                                                                                             | `audit:Outline/behavior` |
| FR6          | `Outline.test.tsx` 指示器测试                                                                                       | 指示器存在；活动锚点顺序                                                                                     | 缺少指示器则失败（缺少轨道则不失败；见 FR1）。缺口：指示器的位置、尺寸、颜色与动效除基线外没有自动检查。没有测试覆盖减少动效结果。                                                                                                                                                                 | `audit:Outline/design`   |
| FR7          | `OutlineFocus.a11y.chromium.spec.ts`                                                                                | 每个受支持的上下文                                                                                           | 在 Chromium 中，聚焦链接没有可见轮廓则失败。                                                                                                                                                                                                                                                       | `audit:Outline/a11y`     |
| FR8          | `Outline.test.tsx` 类名测试；源码审查                                                                               | 调用方类名                                                                                                   | 缺口：没有测试覆盖 `ref`、DOM props、`style` 或 `xstyle` 合并顺序。                                                                                                                                                                                                                                | `audit:Outline/api`      |
| PR1          | `Outline.test.tsx` 稳定测试；源码审查                                                                               | 稳定与回退                                                                                                   | 回退与滚动结束都过去之后仍触发回调则失败。缺口：监听器清理没有检查。                                                                                                                                                                                                                               | `audit:Outline/behavior` |
| 主题解剖映射 | `scripts/check-knowledge.mjs`                                                                                       | 规范解剖与当前 target                                                                                        | 缺失、多余或过时的映射会导致仓库校验失败。                                                                                                                                                                                                                                                         | `audit:Outline/theming`  |

## Decision log

未记录。本记录描述已发布行为。

## Open questions

- **OQ1 — Outline 是否应采用 `spec:AST-020` FR15 的具名例外：对一个很长的标题列表只保留一个 Tab 停靠点，并支持方向键、Home 和 End 移动？**（`human-api`）若不采用，长标题列表每链接消耗一个 Tab 停靠点（FR3）。
- **OQ2 — 指示轨道是否应获得稳定的公开主题 target？**（`human-api`）target 暴露尚未确定；当前缺乏可达性并不能决定答案。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤或系统规则。它链接到它们的所有者。
