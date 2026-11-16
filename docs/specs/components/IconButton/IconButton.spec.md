---
schema_version: 3
template_version: 7
kind: component
id: component:IconButton
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-25
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, accessibility]
verified_by:
  [
    packages/core/src/IconButton/IconButton.test.tsx,
    packages/core/src/IconButton/__tests__/IconButtonAudit.a11y.chromium.spec.ts,
    packages/core/src/Button/__tests__/Button.a11y.test.tsx,
    packages/core/src/Button/__tests__/Button.a11y.chromium.spec.ts,
  ]
modules: []
families: [family:buttons]
design_specs: [design:reduced-motion]
architecture:
  [architecture:component-size-cascade, architecture:public-component-api]
contributing: []
system_specs: [spec:AST-085]
---

# IconButton component contract

## Contract at a glance

| 领域                    | 契约                                                                                                                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Public contract         | 无变更。IconButton 接受 Button 的 props，但不含 `isIconOnly`、`children` 和 `endContent`，且要求 `icon`。                                                                                        |
| Behavior                | IconButton 始终渲染 Button 的仅图标模式：一个默认方形的按钮，通过 `aria-label` 由 `label` 命名，没有可见文本。其他所有行为都是 Button 的。                                                       |
| End-user impact         | 用户看到的是一个紧凑、默认方形的操作，反馈与任何 Button 相同。屏幕阅读器用户听到 `label`。只有调用方添加提示时，视力正常的用户才会得到可见提示。                                                 |
| Builder impact          | 无。                                                                                                                                                                                             |
| Compatibility/readiness | 记录已发布的行为；无 API、默认值或 DOM 变更。Button 的链接模式焦点、减弱动效和自着色内容缺口原样适用；三者都列在 Current-state impact 下。                                                       |
| Review checks           | 拒绝这样的 IconButton：渲染可见的标签文本或结束内容；在默认宽高比且无 `width` 时不是方形；丢失 `aria-label`；或行为与 Button 的仅图标模式不同。                                                  |
| Governing rules         | `family:buttons` FR1, FR7, AV2, AV6；`component:Button`；`spec:AST-085` FR1, FR4；`design:reduced-motion` DR1, DR3；`architecture:component-size-cascade`；`architecture:public-component-api`。 |

此表是审查投影；下文正文具有权威性。

## Intent

IconButton 是 `family:buttons` 所指的 Button 的显式仅图标投影。它为调用方提供一个可 grep 的组件，用于只显示图标的紧凑操作，而不创建第二套操作模型。使用方用法见 `IconButton.doc.mjs`。

## Compatibility and migration

- 已发布的默认值保留：`yes`；默认值来自 Button
- 兼容性类别：记录已发布的行为；无公共 prop、默认值、导出或 DOM 变更
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档和发布说明。

## Ownership boundary

**拥有**

- 将 Button 的内容模式固定为仅图标。
- Prop 接口：必需的 `icon`，且没有 `isIconOnly`、`children` 或 `endContent`。

**不拥有 / 非目标**

- 所有渲染行为：元素、命名规则、尺寸、默认方形几何、点击与 `clickAction` 处理、pending、disabled、链接模式、tooltip、elevation、feedback，以及 `button` 主题目标——由 `component:Button` 拥有。
- 由 `label` 自动生成的 tooltip——不提供；由调用方添加 `tooltip`（`family:buttons` AV6）。
- 图标渲染——由 `component:Icon` 拥有。

## Public concepts

| Concept    | Closed values or states | Meaning              | Availability by variant/orientation/state                                                | Default | Owner                  | Stability | Invalid-value behavior                                     |
| ---------- | ----------------------- | -------------------- | ---------------------------------------------------------------------------------------- | ------- | ---------------------- | --------- | ---------------------------------------------------------- |
| 仅图标模式 | 始终开启                | 图标是唯一可见内容。 | 所有 variant、尺寸和状态。                                                               | 开启    | `component:IconButton` | 稳定      | TypeScript 拒绝 `isIconOnly`、`children` 和 `endContent`。 |
| 图标       | 调用方节点              | 可见字形；必需。     | 所有状态；pending 时隐藏在 Spinner 之后，除非它自绘颜色（`component:Button` FR8 缺口）。 | 必需    | `component:IconButton` | 稳定      | TypeScript 拒绝缺少 `icon`。                               |

其他所有概念（variant、尺寸、elevation、pending、可用性、链接模式、width、tooltip）都属于 Button，并采用 Button 的默认值。

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                                  | 依据                                                  |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| FR1 | IconButton 以仅图标模式准确渲染一个 Button，携带调用方的 `icon` 以及所有其他传入的 prop，包括 `ref`。它自身不添加任何元素、状态或行为。                                                                                                                                                                                                                 | `family:buttons` AV2；当前源码                        |
| FR2 | 只要 `label` 非空，无障碍名称就是通过 `aria-label` 提供的 `label`；不会可见地渲染任何标签文本。                                                                                                                                                                                                                                                         | `family:buttons` FR1；当前源码与测试                  |
| FR3 | 在默认仅图标宽高比且调用方未设 `width` 时，该控件在解析后的尺寸上为方形且无内边距。没有显式尺寸的 Astryx Icon 在 `sm` 和 `md` IconButton 中渲染为 `sm`，在 `lg` IconButton 中渲染为 `md`；显式 Icon 尺寸优先。                                                                                                                                          | `family:buttons` FR7；当前测试                        |
| FR4 | variant、尺寸、elevation、`onClick`、`clickAction`、loading、disabled 以及按压反馈遵循 `component:Button`，包括其实现缺口：disabled 遵循 `component:Button` FR10，在有 `href` 时遵循 FR11；loading 遵循 FR8，在减弱动效且为精细指针时其 Spinner 必须立即出现（`design:reduced-motion` DR3）；按压反馈遵循 FR15，在减弱动效下其按压缩放不得生效（DR1）。 | `component:Button`；`design:reduced-motion`；当前测试 |

### Allowed variation

- **AV1 — 图标内容。** 任何调用方节点都可填充图标槽位；IconButton 不会检查它。

### Representative states

| State             | Required invariant                                       | Allowed variation         |
| ----------------- | -------------------------------------------------------- | ------------------------- |
| 静止              | 默认方形，由 `label` 命名；仅图标。                      | variant、尺寸、主题绘制。 |
| 浮动（elevation） | 表面上为所选层级显示阴影。                               | 层级。                    |
| Loading           | Button 的 pending 状态：Spinner、`aria-busy`，仍可聚焦。 | Spinner 延迟。            |
| Disabled          | Button 的 disabled 状态（`component:Button` FR10）。     | 是否有 tooltip。          |

### Transformation and precedence order

- **ORD1 — 内容模式。** 始终仅图标；没有调用方 prop 可以覆盖它。

### Performance and resources

- **PR1 — 不增加工作。** 除 Button 之外，IconButton 不添加任何状态、effect、监听器或元素。

## Accessibility contract

- **AR1 — 名称。** `label` 是唯一无障碍名称；图标永远不能替代它（`family:buttons` FR1）。
- **AR2 — 可见提示。** IconButton 不显示可见文本。只有当调用方设置 `tooltip` 时才存在可见提示，且除非它重复 `label`，否则它也会描述该按钮（`component:Button` FR12）。
- **AR3 — 目标尺寸。** 在默认方形宽高比下，无 `width` 的最小 IconButton 为 28 × 28 CSS 像素，高于 WCAG 2.5.8 的 24 × 24 最低要求。调用方 `width` 或主题仅图标宽高比将其收窄到低于 24 CSS 像素时，目标尺寸由该调用方或主题负责。
- **AR4 — 其他所有内容。** 键盘、焦点指示器、loading 播报，以及 busy 或 disabled 的暴露遵循 `component:Button` AR2–AR5。

## Design relationships

| Anatomy or state | Design requirement                                                         | Representation authority | Hierarchy role | Component contract |
| ---------------- | -------------------------------------------------------------------------- | ------------------------ | -------------- | ------------------ |
| 方形表面         | 默认 1 / 1 宽高比下的 Button 表面，除非调用方 `width` 或主题宽高比改变它。 | 当前源码                 | 突出           | FR3                |
| 图标             | 唯一可见内容，尺寸由按钮推导。                                             | 当前源码与测试           | 突出           | FR3                |

`design:reduced-motion` 约束 IconButton 继承的按压缩放（FR4）。没有其他设计记录约束 IconButton。IconButton 没有自己的主题目标；它渲染 Button 的 `button` 目标。

## Family and system relationships

- `family:buttons` 将 IconButton 命名为 Button 的显式仅图标投影；IconButton 通过 Button 采用 FR1、FR7、AV2 和 AV6。
- `component:Button` 拥有 IconButton 展现的每一个渲染行为。
- `spec:AST-085` 通过 Button 适用；该缺口记录在那里。

## Verification map

| Contract             | Verification                                                                                                                                                                                                                              | Representative states                                                | Mutation or failure expectation                                                                                                       | Audit section                    |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| FR1, FR2             | `IconButton.test.tsx` 的 label、可见文本、ref 和 displayName 用例                                                                                                                                                                         | 静止                                                                 | 出现可见标签文本、丢失 `aria-label` 或丢弃 ref 即失败。                                                                               | `audit:IconButton/anatomy`       |
| FR3                  | `IconButton.test.tsx` 的图标尺寸用例                                                                                                                                                                                                      | `sm`、`md`、`lg`；显式 Icon 尺寸                                     | 默认 Icon 尺寸错误或显式尺寸被覆盖即失败。                                                                                            | `audit:IconButton/layout`        |
| FR3（方形）          | `IconButtonAudit.a11y.chromium.spec.ts` 传感器回执                                                                                                                                                                                        | Neutral 和 Butter 主题、浅色与深色下的 `sm`、`md`、`lg`              | 盒子不是方形、Neutral 主题下存在内边距、图标偏离中心，或在 Neutral 主题下图标不是 16px（`sm`、`md`）或 20px（`lg`），都会使回执失败。 | `audit:IconButton/layout`        |
| FR4                  | `IconButton.test.tsx` 的点击、disabled、loading 和 elevation 用例                                                                                                                                                                         | 点击；disabled；loading；`none` 和 `med` elevation                   | 点击未到达 `onClick`、disabled 状态下点击却生效、busy 的 IconButton 没有 `aria-disabled`，或两个 elevation 的类名相同，都会失败。     | `audit:IconButton/behavior`      |
| FR4（variant、size） | `IconButton.test.tsx` 的 variant 与 size 反映用例                                                                                                                                                                                         | 每个 variant；每个 size                                              | `data-variant` 或 `data-size` 丢失或错误即失败。                                                                                      | `audit:IconButton/behavior`      |
| FR4（减弱动效）      | 证据缺口：没有测试断言在 `prefers-reduced-motion: reduce` 下的按压或 loading 结果。按压状态下的 `IconButtonAudit.a11y.chromium.spec.ts` 回执记录了已发布的 0.98 按压缩放（在减弱动效开启时），这违反本条款，已发布的 Spinner 淡入同样如此 | 鼠标与触摸按压；精细指针下 pending 的 `clickAction` 或可中断 loading | 按压期间计算出的 transform 不是 `none` 或 `scale(1)`，或 loading 开始后 Spinner 不透明度低于 1。                                      | `audit:IconButton/behavior`      |
| AR1, AR4             | `Button.a11y.test.tsx` 和 `Button.a11y.chromium.spec.ts` 中的 IconButton 状态                                                                                                                                                             | IconButton 的静止、disabled、loading                                 | 缺少名称，或可聚焦、可操作、不可用状态错误即失败。                                                                                    | `audit:IconButton/accessibility` |
| AR2, AR3             | `IconButton.test.tsx` 的 tooltip 描述用例，以及 `IconButtonAudit.a11y.chromium.spec.ts` 的传感器回执                                                                                                                                      | 键盘聚焦时的 tooltip；Neutral 主题下的 `sm`                          | tooltip 不在聚焦时显示或不描述按钮，或默认宽高比下 `sm` 目标小于 28 × 28 CSS 像素，即失败。                                           | `audit:IconButton/accessibility` |
| ORD1                 | `IconButton.test.tsx` 的调用方 `isIconOnly` 用例                                                                                                                                                                                          | 调用方 `isIconOnly={false}`                                          | 出现可见标签文本或丢失 `aria-label` 即失败。                                                                                          | `audit:IconButton/behavior`      |
| PR1                  | 证据缺口：没有测试断言 IconButton 不增加工作                                                                                                                                                                                              | —                                                                    | —                                                                                                                                     | `audit:IconButton/behavior`      |

## Current-state impact

- **链接模式焦点（FR4）。** 处于聚焦的链接模式 IconButton 变为 disabled 时会丢失焦点，无论是否有 `tooltip`，因为其锚点被替换为 `<button>`，正如 `component:Button` FR11 所记录。
- **减弱动效（FR4）。** 当用户偏好减弱动效时，单独的 IconButton 在被按压时缩放到 0.98，pending `clickAction` 或可中断 IconButton 的 Spinner 会淡入，正如 `component:Button` FR8 和 FR15 所记录，这与 `design:reduced-motion` DR1 和 DR3 相悖。
- **loading 期间自着色图标（FR4）。** 自绘颜色的图标，例如图片或多色 SVG，会保持在 Spinner 之下可见，正如 `component:Button` FR8 所记录。

## Decision log

无组件本地决策。IconButton 应用 `family:buttons` 和 `component:Button`。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表格/示例、当前审计结果、实现步骤或 family/system 规则。它链接到其所有者。
