---
schema_version: 3
template_version: 7
kind: component
id: component:RadioListItem
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-28
owners: [cixzhang]
review_triggers:
  [
    public-api,
    behavior,
    layout,
    interaction,
    motion,
    theming,
    styling,
    accessibility,
    visual,
    react-runtime,
    compatibility,
  ]
verified_by:
  [
    packages/core/src/RadioList/RadioList.test.tsx,
    packages/core/src/RadioList/RadioListItem.press.source-build.test.mjs,
    packages/core/src/RadioList/__tests__/RadioGroup.a11y.test.tsx,
    packages/core/src/RadioList/__tests__/RadioGroup.a11y.chromium.spec.ts,
    apps/storybook/rtl-audit/targets.json,
    packages/core/src/Indicator/touchTarget.test.tsx,
    packages/core/src/Indicator/__tests__/TouchTargets.interaction.browser.spec.ts,
  ]
modules: []
families: []
design_specs: [design:user-states]
architecture:
  [
    architecture:component-theming-surface,
    architecture:interaction-modality,
    architecture:public-component-api,
  ]
contributing: []
system_specs: [spec:AST-085]
---

# RadioListItem component contract

## Contract at a glance

| 领域            | 契约                                                                                                                                                                                      |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约        | 无变更。RadioListItem 接收 `label`、`aria-label`、`value`、`description`、`isDisabled`、`startContent`、`endContent`、`align` 以及基础 props，并且必须位于 RadioList 内部。               |
| 行为            | 一个选项行：一个视觉上隐藏的原生 radio，由 radio 指示器绘制，由可见标签命名，整行作为其点击目标，radio 是它唯一的 Tab 停靠点。                                                            |
| 最终用户影响    | 人们可以点击选项上的任意位置来选择它，键盘用户每个选项只需到达一个控件。项目禁用的选项，或处于无原因禁用的组中的选项，会离开 Tab 顺序；获得焦点的禁用选项会显示行轮廓，但没有指示器圆环。 |
| 构建者影响      | 无。                                                                                                                                                                                      |
| 兼容性/就绪状态 | 记录已发布的行为；无 API、默认值或 DOM 变更。原生 `disabled`、两个焦点指示器、禁用选项上缺失的指示器圆环，以及 `startContent` 文档，都列在“当前状态影响”下。                              |
| 审查检查        | 否决行上出现第二个 Tab 停靠点、标签中会选中该选项的链接、未被关联的描述、偏离已绘制行的主题目标，或禁用状态下的选中。                                                                     |
| 管辖规则        | `component:RadioList`；`spec:AST-085` FR1–FR3、FR6；`design:user-states` DR1、DR2（按下叠加层）；`architecture:interaction-modality` INV1–INV3。                                          |

此表是审查投影；下文的正文具有权威性。

## Intent

RadioListItem 是 RadioList 中的一个选项。它拥有该选项的原生 radio、命名与描述、行表面点击委托、项目禁用状态、radio 上的按下与悬停反馈，以及 `radio-list-item` 目标。使用方用法位于 `RadioListItem.doc.mjs` 中。

## Compatibility and migration

- 保留的已发布默认值：`yes`
- 兼容性类别：记录已发布的行为；无公共 prop、默认值、导出或 DOM 变更
- 受控/非受控行为：由父级 RadioList 的 `value` 控制
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 该选项的原生 radio、其名称、描述链接以及表单值。
- 行表面到 radio 的点击委托以及 `onClick` 路由。
- 项目禁用状态，以及 `radio-list-item` 上对禁用、选中和尺寸的反映。
- radio 指示器的悬停色调与按下叠加层，以及其焦点圆环（FR7、OQ1）。
- 裸默认行外观。

**不拥有 / 非目标**

- 组、其值、名称、尺寸、禁用原因，以及必填与状态语义——由 `component:RadioList` 拥有。
- 标签、描述、起始与结束内容的行布局——由 Item 拥有。
- radio 指示器的绘制——由 Indicator 注册表中的 radio 指示器拥有。
- 在 RadioList 之外使用——不受支持；它会抛出错误。

## Public concepts

| 概念 | 封闭取值或状态                              | 含义                                             | 按变体/方向/状态划分的可用性 | 默认值       | 所有者                    | 稳定性 | 无效值行为                         |
| ---- | ------------------------------------------- | ------------------------------------------------ | ---------------------------- | ------------ | ------------------------- | ------ | ---------------------------------- |
| 命名 | `label` 节点或文本；`aria-label`            | 为 radio 命名；`aria-label` 替换可见标签的名称。 | 始终。                       | label 为必填 | `component:RadioListItem` | 稳定   | TypeScript 拒绝缺失的 label。      |
| 值   | string                                      | 组选中并提交的值。                               | 始终。                       | 必填         | `component:RadioListItem` | 稳定   | TypeScript 拒绝缺失的 value。      |
| 禁用 | off、项目、组、带原因的组                   | 阻止选中。                                       | 始终。                       | off          | `component:RadioListItem` | 稳定   | 不适用。                           |
| 内容 | `description`、`startContent`、`endContent` | 标签周围的辅助文本与调用方内容。                 | 始终。                       | 无           | 调用方                    | 稳定   | 不渲染任何内容的描述不会添加链接。 |

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                       | 依据                                                                        |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| FR1  | 当 RadioListItem 在 RadioList 之外渲染时会抛出错误。                                                                                                                                                                                                                                                                                                                                                                         | 当前源码                                                                    |
| FR2  | 该选项渲染一个 Item 行，其起始内容是一个视觉上隐藏的原生 `<input type="radio">`（组的 `name`、此 `value`，当组值匹配时处于选中状态），叠加在 radio 指示器之上，随后是任何 `startContent`。                                                                                                                                                                                                                                   | 当前源码与测试                                                              |
| FR3  | radio 通过 `aria-labelledby` 由可见标签元素命名，文本标签与节点标签皆如此；`aria-label` 替换该名称，且绝不会传到行上。可渲染的 `description` 通过 `aria-describedby` 关联；不渲染任何内容的描述不会添加链接。                                                                                                                                                                                                                | 当前测试                                                                    |
| FR4  | radio 是该选项唯一的 Tab 停靠点。行表面（标签、描述、空白区域）上的点击被委托给 radio；标签、描述或结束内容中的链接和按钮保留其自身行为。为行类型化的调用方 `onClick`，在直接点击与委托点击时都在 radio 上运行；该路由是已发布的行为，在 OQ2 裁定之前不构成要求。                                                                                                                                                            | WCAG 4.1.2；当前测试                                                        |
| FR5  | 选中 radio 会调用组的 `onChange(value)`，除非该选项已禁用。                                                                                                                                                                                                                                                                                                                                                                  | 当前测试                                                                    |
| FR6  | 当项目或组禁用时即禁用。禁用的 radio 必须保持可聚焦并带有 `aria-disabled="true"`、与表单分离，并拒绝选中（`spec:AST-085` FR1–FR3）；禁用的选项不显示悬停色调或按下叠加层。实现缺口：只有带组原因的组禁用 radio 才渲染该形态；项目禁用的 radio，以及无原因的组禁用 radio，会得到原生 `disabled`，从而将它们从 Tab 顺序中移除。可聚焦的禁用 radio 在点击或方向键移到其上时，仍会运行调用方的 `onClick`（`spec:AST-085` FR2）。 | `spec:AST-085`；当前源码与测试                                              |
| FR7  | radio 上的键盘焦点会在 radio 指示器上绘制共享焦点圆环，并在行上绘制 Item 的行 focus-within 轮廓。一次焦点移动必须只有一个元素拥有该指示器（`architecture:interaction-modality` INV3）；由哪个元素拥有它是 OQ1。实现缺口：两者都会绘制。在获得焦点的禁用选项上，指示器圆环被跳过，这违背 `spec:AST-085` FR6；只有行轮廓显示，是否足够取决于 OQ1。                                                                             | `architecture:interaction-modality` INV1–INV3；`spec:AST-085` FR6；当前源码 |
| FR8  | 悬停已启用的行会给 radio 指示器着色。RadioListItem 应用 `design:user-states` DR1 和 DR2 作为按下叠加层，在已启用行被按下时将其绘制在指示器上。行本身默认不绘制内边距、圆角、悬停或按下背景。                                                                                                                                                                                                                                 | `design:user-states`；当前测试                                              |
| FR9  | 在粗指针上，radio 的命中区域至少为 24 × 24 CSS 像素，其位置遵循行内方向。                                                                                                                                                                                                                                                                                                                                                    | WCAG 2.5.8；当前测试                                                        |
| FR10 | 在强制颜色下，选中的圆点保持可见。                                                                                                                                                                                                                                                                                                                                                                                           | WCAG 1.4.11；当前测试                                                       |
| FR11 | 已绘制的行元素带有 `astryx-radio-list-item`（与 Item 自身的目标并存），并反映 `data-size`、选中时的 `data-selected`，以及禁用时的 `data-disabled`。主题的 `radio-list-item` 样式会覆盖裸默认行。                                                                                                                                                                                                                             | `architecture:component-theming-surface` INV6；当前测试                     |
| FR12 | `ref`、`className`、`style`、`xstyle`、`align`、`data-*`、`id`，以及除 `aria-label` 之外的 ARIA 都会传到行上。                                                                                                                                                                                                                                                                                                               | 当前测试                                                                    |
| FR13 | 在粗指针下，触摸目标向 44 × 44 px 增长，最多延伸到相邻目标的一半处，且绝不小于控件自身的盒子（所有者决策，2026-11-04；`spec:AST-094` FR42）。它通过已启用选项行上的不可见条带增长，而行保持其尺寸。                                                                                                                                                                                                                          | `spec:AST-094` FR42；当前源码与测试                                         |

### Allowed variation

- **AV1 — 内容。** 标签、描述、起始与结束内容在其类型范围内变化。
- **AV2 — 主题绘制。** 主题可以通过 `radio-list-item` 恢复行内边距、圆角、悬停以及选中绘制。

### Representative states

| 状态     | 必需的不变式                                                                                                                         | 允许的变体 |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| 未选中   | radio 由标签命名；点击行即选中。                                                                                                     | 内容。     |
| 已选中   | radio 处于选中状态；`data-selected`；圆点在强制颜色下可见。                                                                          | 主题绘制。 |
| 富标签   | 名称来自标签文本；其中的链接不会触发选中。                                                                                           | —          |
| 项目禁用 | 可用 `aria-disabled` 聚焦；无悬停或按下反馈；焦点指示器在键盘焦点下显示。实现缺口：原生 `disabled`，且指示器圆环被跳过（FR6、FR7）。 | —          |

### Transformation and precedence order

- **ORD1 — 名称。** `aria-label`，否则为可见标签元素。
- **ORD2 — 可用性。** 组禁用或项目禁用；只有组原因能让 radio 保持可聚焦。

### Performance and resources

- **PR1 — 有界资源。** 该项目不拥有任何观察器或全局监听器；其按下反馈使用共享的按下控制器。

## Accessibility contract

- **AR1 — Radio 语义。** 每个选项都是一个原生 radio，带有名称、可选描述和选中状态。
- **AR2 — 单一 Tab 停靠点。** FR4。
- **AR3 — 目标尺寸。** FR9。
- **AR4 — 非颜色状态。** FR10。

## Design relationships

| 解剖结构或状态 | 设计要求                                   | 表示权威                                                              | 层级角色 | 组件契约       |
| -------------- | ------------------------------------------ | --------------------------------------------------------------------- | -------- | -------------- |
| 单选按钮       | 带悬停色调、按下叠加层、焦点圆环的指示器。 | 按下叠加层为 `design:user-states`；悬停色调为当前源码；焦点圆环为 FR7 | 显著     | FR2, FR7, FR8  |
| 标签           | 为选项命名。                               | Item                                                                  | 显著     | FR3            |
| 描述           | 与 radio 关联的辅助文本。                  | Item                                                                  | 辅助     | FR3            |
| 行             | 裸的、全宽的点击目标。                     | 当前源码与测试                                                        | 辅助     | FR4, FR8, FR11 |

除 `design:user-states` 之外，没有其他设计记录管辖 RadioListItem。

## Family and system relationships

- `component:RadioList` 提供名称、值、尺寸和组可用性。
- `design:user-states` 拥有 radio 指示器所绘制的按下处理。
- `spec:AST-085` 拥有禁用可聚焦性；FR6 和 FR7 记录这些缺口。

## Verification map

| 契约                    | 验证                                                                                                                                                                                                                              | 代表状态                                         | 变异或失败预期                                                                                                                                                                                                                                                                                         | 审计章节                            |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------- |
| FR1                     | 证据缺口：没有测试在 RadioList 之外渲染 RadioListItem                                                                                                                                                                             | —                                                | —                                                                                                                                                                                                                                                                                                      | `audit:RadioListItem/behavior`      |
| FR2–FR5, ORD1, AR1, AR2 | `RadioList.test.tsx` 的选中、富内容以及剩余属性转发用例；`RadioGroup.a11y.test.tsx` 和 `RadioGroup.a11y.chromium.spec.ts`                                                                                                         | 文本与节点标签；`aria-label`；描述；标签中的链接 | 错误的名称、悬空的描述，或会触发选中的链接，即失败。证据缺口：没有测试断言 radio 上直接点击与委托点击时的调用方 `onClick`。                                                                                                                                                                            | `audit:RadioListItem/accessibility` |
| FR6, ORD2               | `RadioList.test.tsx` 的项目禁用与表单用例；`RadioGroup.a11y.test.tsx` 和 `RadioGroup.a11y.chromium.spec.ts` 的 `radio-list-option-disabled`、`radio-list-option-group-disabled` 与 `radio-list-option-disabled-with-message` 状态 | 项目与组禁用；组原因                             | 会选中的禁用选项，或来自带原因禁用组所提交的值，即失败；该绑定对 `radio-list-option-group-disabled` 期望 `tabReachable: false`，当该缺口闭合时这会失败。证据缺口：没有状态守护项目禁用的可聚焦性，因为 `radio-list-option-disabled` 绑定的 radio 并非组的 Tab 停靠点。没有表单用例提交项目禁用的选项。 | `audit:RadioListItem/accessibility` |
| FR7                     | 证据缺口：没有测试覆盖指示器上的焦点圆环放置、禁用圆环，或指示器数量                                                                                                                                                              | —                                                | —                                                                                                                                                                                                                                                                                                      | `audit:RadioListItem/accessibility` |
| FR8                     | `RadioList.test.tsx` 的按下状态与裸行用例；`RadioListItem.press.source-build.test.mjs`                                                                                                                                            | 已启用、已禁用、触摸                             | 禁用选项上出现按下绘制，或出现默认行背景，即失败。证据缺口：没有测试断言悬停色调。                                                                                                                                                                                                                     | `audit:RadioListItem/visual`        |
| FR9, FR10, AR3, AR4     | `RadioList.test.tsx` 的粗指针、RTL 与强制颜色用例                                                                                                                                                                                 | 粗指针；RTL；强制颜色                            | 证据缺口：强制颜色用例只要匹配任一规则即通过（checkbox 标记就提供了一条），因此它不能证明圆点；粗指针与 RTL 用例只检查方向对称的居中 class，而不检查 24 × 24 的最小值或 RTL 位置。                                                                                                                     | `audit:RadioListItem/accessibility` |
| FR11, FR12              | `RadioList.test.tsx` 的主题目标与剩余属性转发用例                                                                                                                                                                                 | 尺寸；选中；禁用                                 | 目标偏离已绘制行，或缺失状态，即失败。证据缺口：没有测试断言行上的 `ref`、`className`、`style` 或 `xstyle`。                                                                                                                                                                                           | `audit:RadioListItem/theming`       |
| FR13                    | `touchTarget.test.tsx` 的命中条带与最小值用例；`TouchTargets.interaction.browser.spec.ts` 的 RadioList 与鼠标用例                                                                                                                 | 已启用与禁用；两个方向；24 与 60 px；鼠标        | 禁用选项上出现条带、鼠标下出现条带、行或间隙改变尺寸、条带越过间隙的一半、24 px 的行不足 44 px，或 60 px 的行仍带条带，即失败。                                                                                                                                                                        | `audit:RadioListItem/behavior`      |
| PR1                     | 证据缺口：没有测试断言不存在观察器或全局监听器                                                                                                                                                                                    | —                                                | —                                                                                                                                                                                                                                                                                                      | `audit:RadioListItem/behavior`      |
| RTL 关系                | RTL 审计精选的 D2 目标（`apps/storybook/rtl-audit/targets.json`），位于 `RadioList / Default`                                                                                                                                     | 指示器与标签；LTR 与 RTL                         | 未位于其标签行内起点的指示器会使 D2 失败。                                                                                                                                                                                                                                                             | `audit:RadioListItem/i18n-rtl`      |

## Current-state impact

- **两个焦点指示器（FR7）。** 键盘焦点同时绘制 Item 的行轮廓与 radio 指示器圆环，这违背 `architecture:interaction-modality` INV3。
- **禁用期间调用方的 onClick（FR6）。** 可聚焦的禁用 radio 仍会运行调用方的 `onClick`，这违背 `spec:AST-085` FR2。
- **禁用可聚焦性（FR6）。** 项目禁用的 radio，以及无原因的组禁用 radio，使用原生 `disabled`，这违背 `spec:AST-085` FR1。
- **禁用焦点圆环（FR7）。** 在获得焦点的禁用选项上，指示器圆环被跳过，这违背 `spec:AST-085` FR6；只有行轮廓显示。
- **使用方文档（FR2）。** `RadioListItem.doc.mjs` 与 `RadioListItem.tsx` 中 `startContent` prop 的 JSDoc 说 `startContent` 渲染在 radio 圆圈之前；实际上它渲染在其之后。

## Decision log

无组件本地决策。

## Open questions

- **OQ1 — 哪个元素绘制该选项的焦点圆环，是行还是 radio 指示器？**（`human-design`）`architecture:interaction-modality` INV3 要求只有一个指示器；CheckboxListItem 组合了同样的两个绘制者。
- **OQ2 — 哪个元素拥有调用方的 `onClick`？**（`human-api`）它按行类型化，却在 radio 上运行，正如 CheckboxListItem 对应的未决问题所记录的那样。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤或家族/系统规则。它链接到它们的所有者。
