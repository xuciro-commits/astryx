---
schema_version: 3
template_version: 7
kind: component
id: component:Thumbnail
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-26
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Thumbnail/Thumbnail.test.tsx,
    packages/core/src/__tests__/ReducedMotionPress.a11y.chromium.spec.ts,
    packages/core/src/theme/themingTargets.test.ts,
    apps/storybook/stories/Thumbnail.stories.tsx,
    .github/visual-baseline/manifest.json,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:component-theming-surface,
    architecture:interaction-modality,
    architecture:internationalization,
    architecture:public-component-api,
  ]
contributing: []
system_specs: [spec:AST-009, spec:AST-085, spec:AST-086]
---

# Thumbnail component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                                                                           |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | 一个 64px 的方形图片预览，带 `src`、`alt`、`label`、`isLoading`、`isDisabled`、可选的 `onClick` 打开操作，以及按 `showRemoveOn` 显示的可选 `onRemove` 操作。                                                                                   |
| 行为          | 预览显示骨架、图片、上传遮罩或占位符；它是一个具名分组，其打开与移除操作是彼此独立的按钮。                                                                                                                                                     |
| 终端用户影响  | 屏幕阅读器用户在一个分组名中听到文件与图片，并触及 “Open …” 与 “Remove …” 按钮；键盘与触摸用户始终能触及悬停显示的移除按钮。                                                                                                                   |
| 构建者影响    | 主题的退出时长与缓动决定触摸按压的释放效果（FR4）；无 API 变更。                                                                                                                                                                               |
| 兼容性/就绪度 | 无 API 变更；触摸按压释放发生变化（FR4、`spec:AST-094` FR5）。Current-state impact 下列出了六处实现缺口。                                                                                                                                      |
| 审查检查      | 拒绝以下情况：会脱离 tab 顺序的仅悬停移除按钮、无角色元素上带名字、未提供 `alt` 就暴露的图片，或自我播报的忙碌加载指示器。                                                                                                                     |
| 治理规则      | `spec:AST-085/FR1`；`spec:AST-086/FR8`；WCAG 2.2 2.5.8；`architecture:public-component-api/INV5,INV6,INV8`；`architecture:internationalization/INV1a`；`component:Thumbnail/FR4`（触摸按压释放）；`spec:AST-094/FR5`（按压释放的退出 token）。 |

本表是审查视角的投影；以下正文才具有权威性。

## Intent

Thumbnail 在一个紧凑的方形中预览单个图片附件，并带有可选的打开与移除操作。它拥有预览的加载、错误与上传状态、其无障碍分组名，以及移除操作的位置与显示。

## Compatibility and migration

- 保持已发布的默认值：触摸按压释放取 `no`：它按主题的退出时长与缓动淡出，与 FR4 及 `spec:AST-094` FR5 一致。鼠标按压保留卡片的桌面按压样式。
- 兼容类别：非破坏性行为变更；无公共 prop、默认值或 DOM 变更
- 受控/非受控行为：不适用；图片失败追踪是内部状态
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **使用方的 `role` 覆盖分组角色（FR7、AR1）。** 使用方的 `role`（例如 `none` 或 `img`）会覆盖 `role="group"`，使组合后的名字落在一个可能无法承载它的元素上，而 `architecture:public-component-api` INV5 要求组件自有的语义不被覆盖。
- **组合名位于目录之外（FR3）。** 当 `label` 与 `alt` 同时存在时，分组名 "{label} — {alt}" 在调用点拼接，而不是来自一条目录消息，因此某个区域设置无法对其重新排序或重新标点（`architecture:internationalization` INV1a）。
- **移除目标小于 24px（AR4）。** 在精细指针下，移除按钮的点击区域为 20 × 20 CSS 像素，且与打开操作重叠，而 WCAG 2.2 2.5.8 要求 24 × 24 或提供间距。在粗略指针下为 24 × 24。
- **标签 tooltip 无法通过键盘到达（FR3）。** 标签 tooltip 挂载到根分组上，而根分组不可聚焦，因此在打开或移除按钮上的键盘焦点不会显示它（WCAG 2.2 2.1.1）。标签仍通过分组与按钮名到达辅助技术。
- **Open 与 Remove 上出现两个焦点指示器（FR4）。** 只要图片容器包含键盘焦点就会描边，而打开与移除按钮又各自保留焦点环，因此聚焦任一都会绘制两个指示器，而 `architecture:interaction-modality` INV3 允许每次焦点移动只有一个。
- **禁用状态未反映在 target 上（FR6）。** `thumbnail` target 不反映任何状态，因此主题无法在那里为禁用状态设置样式（`architecture:component-theming-surface` INV6）。

## Ownership boundary

**拥有**

- 根分组、方形图片容器，以及 Image、Placeholder、Skeleton、上传遮罩与移除按钮部件。
- 视觉状态的选择与图片失败重试。
- 分组名、打开按钮名与移除按钮名。
- 移除按钮的位置、遮罩、点击区域与悬停显示。
- 上传忙碌状态的播报。

**不拥有 / 非目标**

- 由 `onClick` 打开的 Lightbox 或详情视图——由产品调用点拥有。
- 附件集合与上传传输——由组合组件与产品调用点拥有。
- Button、Skeleton、Spinner、Icon 与 Tooltip 的内部实现——由这些组件拥有；Thumbnail 组合它们。
- 悬停与聚焦显示机制——由共享的容器显示工具拥有。

## Public concepts

| 概念     | 封闭取值或状态                                   | 含义                                                                    | 按变体/方向/状态的可用性                 | 默认值      | 所有者                | 稳定性 | 无效值行为              |
| -------- | ------------------------------------------------ | ----------------------------------------------------------------------- | ---------------------------------------- | ----------- | --------------------- | ------ | ----------------------- |
| 视觉状态 | skeleton；上传遮罩下的图片或占位符；图片；占位符 | 图片容器显示的内容（FR2）。                                             | 由 `src`、`isLoading` 与加载错误解析得出 | placeholder | `component:Thumbnail` | 稳定   | —                       |
| 打开操作 | present；absent                                  | `onClick` 在图片之上添加一个 “Open …” 按钮；加载中或禁用时惰性（FR4）。 | 有 `onClick` 时                          | absent      | `component:Thumbnail` | 稳定   | —                       |
| 移除操作 | present；absent                                  | `onRemove` 在顶部行末角添加一个 “Remove …” 按钮；禁用时惰性（FR5）。    | 有 `onRemove` 时                         | absent      | `component:Thumbnail` | 稳定   | —                       |
| 移除显示 | `hover`、`always`                                | 移除按钮在静止状态下是否显示。                                          | 仅当有 `onRemove` 时                     | `hover`     | `component:Thumbnail` | 稳定   | TypeScript 拒绝其他值。 |
| 禁用     | enabled；disabled                                | 使缩略图变暗；其操作保持可聚焦并被播报为禁用（FR6）。                   | 所有状态                                 | enabled     | `component:Thumbnail` | 稳定   | —                       |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 依据           |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| FR1 | 根是宽 64px、不收缩、隔离的 inline-flex 列，承载 `thumbnail` target。它持有一个方形图片容器，具有 `--radius-element` 圆角、裁剪溢出，以及 `--color-neutral` 背景。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 当前源码与测试 |
| FR2 | 无 `src` 的 `isLoading` 显示 Skeleton；带 `src` 的 `isLoading` 显示图片，若该 `src` 已失败则显示占位符字形，二者都位于覆盖色上传遮罩之下，遮罩内有一个小的 on-media Spinner；不带加载的 `src` 以 cover 适配显示图片，并带 1px 内嵌边框；无 `src`，或加载失败的 `src`，显示次级色的图片占位符字形。失败按 `src` 追踪，因此变更后的 `src` 会被重新尝试。                                                                                                                                                                                                                                                                                                                                                                                            | 当前源码与测试 |
| FR3 | 根在 `label` 与 `alt` 都存在时为 `role="group"`，名为 "{label} — {alt}"，否则为 `label`，否则为 `alt`，否则为翻译后的 “Thumbnail”；使用方的 `aria-label` 或 `aria-labelledby` 在其后到达根，并改为分组的名字。组合名是一条目录消息（`architecture:internationalization` INV1a）；实现缺口："{label} — {alt}" 在调用点拼接（见 Current-state impact）。已定义的 `label` 还会把缩略图包在一个显示它的 Tooltip 中，该 Tooltip 同时把标签设为分组的无障碍描述；`label` 从不内联渲染。tooltip 可通过键盘显示（WCAG 2.2 2.1.1）。实现缺口：tooltip 挂载到不可聚焦的根上，且仅在悬停与触摸时打开；聚焦打开或移除按钮不会显示它（见 Current-state impact）。在开发环境中，`src` 没有 `alt`、`label`、`aria-label` 或 `aria-labelledby` 时会记录一条警告。 | 当前源码与测试 |
| FR4 | 有 `onClick` 时，一个全尺寸的 `button type="button"`，名为 “Open {name}”，包裹图片内容并调用 `onClick`；悬停与按压遮罩对鼠标和触摸显示。触摸按压立即显示。在触摸呈现下，其释放按主题的退出运动 token（`--duration-exit`、`--ease-exit`）淡出，依据 `spec:AST-094` FR5；鼠标按压保留卡片的桌面按压样式。加载中或禁用时，Open 保持挂载且惰性，因此已聚焦的 Open 保持焦点（`spec:AST-085` FR1、FR4、FR6）。每次焦点移动只显示一个指示器（`architecture:interaction-modality` INV3）：图片容器为打开按钮绘制共享的 focus-visible 轮廓。实现缺口：打开与移除按钮都在容器轮廓内保留各自的焦点环，因此聚焦任一都会绘制两个指示器（见 Current-state impact）。                                                                                            | 当前源码与测试 |
| FR5 | 有 `onRemove` 时，一个小型的仅图标次级 Button，名为 “Remove {name}”，位于图片之上、距顶部与行末边缘 `--spacing-1`，以覆盖遮罩与 on-dark 图标绘制；点击会在 `onRemove` 之前阻止传播，因此它绝不会打开缩略图。`showRemoveOn="hover"` 时，该按钮在静止状态下通过不透明度视觉隐藏，仍留在 tab 顺序与无障碍树中，并在容器悬停、容器内聚焦时显示，且在粗略主指针下始终显示（`spec:AST-094` FR13）。禁用时，Remove 保持挂载且惰性，因此已聚焦的 Remove 保持焦点（`spec:AST-085` FR1、FR4）。                                                                                                                                                                                                                                                             | 当前源码与测试 |
| FR6 | `isDisabled` 将根变暗至一半不透明度并关闭指针事件。其操作保持挂载、可聚焦并被播报为禁用（`spec:AST-085` FR1、FR4、FR5），且禁用状态反映在所属 target 上（`architecture:component-theming-surface` INV6）。实现缺口：`thumbnail` target 不反映任何状态（见 Current-state impact）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 当前源码与测试 |
| FR7 | `ref` 到达根。受支持的 DOM、ARIA、data 与事件 prop 到达根；`data-testid` 到达根；`xstyle`、`className` 与 `style` 在组件样式之后按该顺序合并。使用方的 `aria-label` 或 `aria-labelledby` 为分组命名（FR3）。分组角色是组件自有的语义（`architecture:public-component-api` INV5）。实现缺口：使用方 prop 在角色之后展开，因此使用方的 `role` 会覆盖它（见 Current-state impact）。                                                                                                                                                                                                                                                                                                                                                                 | 当前源码与测试 |

### Allowed variation

- **AV1 — 主题绘制。** 主题可以重设 `thumbnail` 样式，而不改变其状态、名字或操作位置。
- **AV2 — 图片内容。** 图片尺寸可变；图片始终覆盖该方形。

### Representative states

| 状态           | 必需不变式                                                                                            | 允许的变化 |
| -------------- | ----------------------------------------------------------------------------------------------------- | ---------- |
| 具名图片       | 分组由 `label` 与 `alt` 命名；图片以其 `alt` 暴露。                                                   | —          |
| 无 alt 的图片  | 图片 `alt=""`、`role="presentation"`、`aria-hidden`。                                                 | —          |
| 占位符或错误   | 占位符字形；新的 `src` 会重试。                                                                       | —          |
| 加载中，无 src | Skeleton；Open 操作保持挂载且惰性。                                                                   | —          |
| 上传中         | 图片，若失败则为占位符，位于遮罩之下并带隐藏的 Spinner；忙碌开始只播报一次；Open 操作保持挂载且惰性。 | —          |
| 可打开         | “Open {name}” 按钮；焦点轮廓在容器上（按钮自身的环是 FR4 缺口）。                                     | —          |
| 可移除，悬停   | “Remove {name}” 在 tab 顺序中，于悬停、聚焦与粗略主指针下显示。                                       | —          |
| 禁用           | 一半不透明度；Open 与 Remove 保持挂载、可聚焦且惰性。                                                 | —          |

### Transformation and precedence order

- **ORD1 — 视觉状态。** 无 `src` 的加载 → 带 `src` 的加载（图片，若失败则为占位符，位于上传遮罩之下）→ 图片 → 占位符（无 `src` 或加载错误）。
- **ORD2 — 名字。** "{label} — {alt}" → `label` → `alt` → “Thumbnail”；使用方的 `aria-label` 会在分组上替换它。
- **ORD3 — 移除点击。** 阻止传播 → `onRemove`。

### Performance and resources

- **PR1 — CSS 显示与共享按压。** 悬停显示仅由 CSS 实现。每个 Thumbnail 在挂载时安装共享的文档级按压控制器，只有可交互的 Thumbnail 才携带其按压标记；上传状态通过共享的忙碌播报通道播报。Thumbnail 不添加自己的监听器、观察器或定时器。

## Accessibility contract

- **AR1 — 分组名。** 根是具名分组，绝不是带名字的无角色元素，因此其内部的打开与移除按钮保持可达。实现缺口：使用方的 `role` 会覆盖分组角色（FR7）。
- **AR2 — 图片替代文本。** 带 `alt` 的图片随其暴露；没有 `alt` 时它被明确视为装饰性。
- **AR3 — 忙碌状态。** 上传 Spinner 对辅助技术隐藏；Thumbnail 通过共享通道在每次忙碌开始时播报一次 “Loading”，正如 `spec:AST-086` FR8 对忙碌所有者所要求的。
- **AR4 — 移除目标。** 移除目标对每种指针都至少为 24 × 24 CSS 像素（WCAG 2.2 2.5.8）。按钮为 20 × 20，在粗略指针下命中区域每边扩展 2px。实现缺口：在精细指针下目标仍为 20 × 20。
- **AR5 — 禁用与加载。** 禁用缩略图的操作保持挂载、可聚焦并被播报为禁用，加载中缩略图的 Open 保持挂载且惰性，因此任一状态开始时焦点都不会移动（`spec:AST-085` FR1、FR4、FR5、FR6）。
- **AR6 — 可触及的移除操作。** 悬停显示的移除按钮绝不会从 tab 顺序中移除，并在键盘聚焦时以及粗略主指针下出现。

## Design relationships

| 解剖结构或状态 | 设计要求                                                 | 表示权威       | 层级角色 | 组件契约      |
| -------------- | -------------------------------------------------------- | -------------- | -------- | ------------- |
| 图片           | 预览图片作为 cover 适配的方形。                          | 当前源码与文档 | 主要     | FR1、FR2、AR2 |
| 占位符         | 没有图片时的图片剪影。                                   | 当前源码与文档 | 辅助     | FR2           |
| 移除按钮       | 叠加的关闭控件，位于固定遮罩上，可在任何图片上清晰可读。 | 当前源码与文档 | 辅助     | FR5、AR4、AR6 |
| 上传遮罩       | 图片上传期间带 spinner 的遮罩。                          | 当前源码与文档 | 辅助     | FR2、AR3      |
| Skeleton       | 无图片加载时的微光。                                     | 当前源码与文档 | 辅助     | FR2           |

主题：根是唯一的 `thumbnail` target；各部件不添加 target。使用方解剖结构未命名根部件，因此不声明 anatomy-theming 块。

## Family and system relationships

- `spec:AST-085` 拥有可聚焦的禁用控件；AR5 记录 Thumbnail 如何应用它。
- `spec:AST-086` 拥有忙碌播报；AR3 记录 Thumbnail 的符合情况。
- `architecture:internationalization` 拥有回退名以及打开与移除名背后的目录。
- `architecture:public-component-api` 拥有 ref、透传与样式输入规则；FR7 将它们应用于根。

## Verification map

| 契约                | 验证                                                              | 代表性状态                                      | 变更或失败预期                                                                                                                                                                                                                         | 审查小节                   |
| ------------------- | ----------------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| FR1                 | 在浏览器中的 `Thumbnail.stories.tsx`                              | 每个状态                                        | 缺口：没有测试断言根的宽度、布局，或图片容器的形状、裁剪或绘制；它们仅在渲染的测试夹具中可见。                                                                                                                                         | `audit:Thumbnail/layout`   |
| FR2, ORD1           | `Thumbnail.test.tsx` 状态、错误与重试测试                         | 图片、占位符、骨架、上传中、失败、变更的 `src`  | 任一状态用错元素、失败图片仍在显示，或变更的 `src` 未被重试都会失败。缺口：上传期间失败的 `src`、遮罩与占位符的绘制以及 Spinner 的尺寸与色调没有自动化检查；cover 适配与内嵌边框仅出现在静态图片视觉基线中。                           | `audit:Thumbnail/behavior` |
| FR3, ORD2, AR1, AR2 | `Thumbnail.test.tsx` 命名、角色、图片、警告与 tooltip 测试        | 标签、带 alt 的标签、alt、两者皆无              | 缺失标签或组合名、缺失 `group` 角色、暴露装饰性图片、丢失 `alt`、警告缺失或重复，或标签被内联渲染都会失败。缺口：没有测试断言仅 alt 或默认 “Thumbnail” 名字、使用方的 `aria-label` 或 `aria-labelledby`、标签描述，或 tooltip 的打开。 | `audit:Thumbnail/a11y`     |
| FR4                 | `Thumbnail.test.tsx` 命名、点击、加载、禁用与触摸按压测试         | 可打开、加载中、禁用                            | 错误的 “Open …” 名字、丢失回调或缺失触摸按压遮罩都会失败。如果 Open 卸载、调用 `onClick`，或丢失焦点或其禁用状态，加载与禁用测试会失败。缺口：全尺寸按钮、悬停遮罩与焦点指示器没有自动化检查。                                         | `audit:Thumbnail/behavior` |
| FR5, ORD3, AR6      | `Thumbnail.test.tsx` 移除与 `showRemoveOn` 套件                   | 悬停、始终、默认显示                            | 丢失 `onRemove`、悬停显示的按钮从 DOM 中缺失，或两个取值得到相同的显示处理都会失败。错误的 “Remove …” 名字也会失败。缺口：移除点击绝不调用 `onClick`、按钮的位置与绘制，以及显示触发条件都没有自动化检查。                             | `audit:Thumbnail/a11y`     |
| FR6, AR5            | `Thumbnail.test.tsx` 禁用测试                                     | 带操作的禁用                                    | 如果禁用的 Open 或 Remove 卸载、丢失焦点、丢掉 `aria-disabled` 或调用其回调，测试会失败。缺口：一半不透明度与 pointer-events 规则没有自动化检查。                                                                                      | `audit:Thumbnail/a11y`     |
| FR7                 | `Thumbnail.test.tsx` ref 与 test-id 测试                          | 根                                              | 丢失 ref 或 `data-testid` 会失败。缺口：没有测试覆盖 DOM 透传、属性顺序或样式输入合并。                                                                                                                                                | `audit:Thumbnail/api`      |
| AR3                 | `Thumbnail.test.tsx` 上传测试；对照 `spec:AST-086` FR8 的源码审查 | 上传中                                          | 暴露的上传 Spinner 会失败。缺口：忙碌状态被播报两次时没有自动化检查会失败。                                                                                                                                                            | `audit:Thumbnail/a11y`     |
| AR4                 | 在浏览器中以精细与粗略指针查看 `Thumbnail.stories.tsx`            | 可移除                                          | 缺口：没有自动化的目标尺寸检查；精细指针下的尺寸是已记录的缺口。                                                                                                                                                                       | `audit:Thumbnail/a11y`     |
| PR1                 | 源码审查                                                          | 可移除、可打开、上传中                          | 缺口：Thumbnail 添加自己的监听器、观察器或定时器时，没有自动化检查会失败。                                                                                                                                                             | `audit:Thumbnail/behavior` |
| AR1, AR2            | 无障碍树证据（`spec:AST-009` FR3）                                | 具名分组、打开与移除按钮、带与不带 `alt` 的图片 | 缺口：没有无障碍树检查证明分组名、按钮名或图片暴露；单元测试查询的是 DOM。                                                                                                                                                             | `audit:Thumbnail/a11y`     |

## Decision log

未记录。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审查结果、实现步骤，或家族/系统规则。它链接到它们的所有者。
