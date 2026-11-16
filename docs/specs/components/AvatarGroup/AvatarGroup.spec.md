---
schema_version: 3
template_version: 7
kind: component
id: component:AvatarGroup
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-26
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/AvatarGroup/AvatarGroup.test.tsx,
    packages/core/src/AvatarGroup/AvatarGroupOverflow.test.tsx,
    packages/core/src/Avatar/Avatar.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    apps/storybook/stories/AvatarGroup.stories.tsx,
    apps/storybook/stories/AvatarGroupOverflow.stories.tsx,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:component-theming-surface,
    architecture:internationalization,
    architecture:public-component-api,
  ]
contributing: []
system_specs: [spec:AST-009, spec:AST-038]
---

# AvatarGroup component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                 |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | 一个带标签的组，由调用方提供的 Avatar 子元素组成，可选地以一个 AvatarGroupOverflow 结尾，并具有统一的 `size` 与 `shape`。                                |
| Behavior                | 成员之间按 avatar 尺寸的四分之一重叠；交互成员共享一个 Tab 停靠点，配合方向键漫游与一段可翻译的键盘提示。                                                |
| End-user impact         | 屏幕阅读器用户会听到一个具名组；键盘用户 Tab 进入该组一次，然后用方向键在交互 avatar 之间移动。                                                          |
| Builder impact          | 无；本记录描述的是已发布的行为。                                                                                                                         |
| Compatibility/readiness | 已发布行为记录为 current；没有 API、默认值或输出变化。实现缺口列在 Current-state impact 下。                                                             |
| Review checks           | 拒绝在组内让自己的 size 或 shape 胜出的成员、在交互成员上出现多于一个 Tab 停靠点，或没有任何交互成员却出现键盘提示的情况。                               |
| Governing rules         | `architecture:public-component-api/INV5,INV6,INV7,INV8`；`architecture:component-theming-surface/INV2,INV6`；`architecture:internationalization/INV1a`。 |

本表是审查用的投影；下文才具有权威性。

## Intent

AvatarGroup 将若干人显示为一个紧凑、互相重叠的行。它负责该组的名称、传给成员的统一 size 与 shape、重叠几何，以及交互成员之间的键盘移动。

## Compatibility and migration

- 保留已发布的默认值：`yes`
- 兼容类别：记录已发布的行为；不涉及公共 prop、默认值、DOM 或样式输出的变化
- 受控/非受控行为：不适用
- 迁移决策：无

使用方的迁移说明属于使用方文档与发布说明。

## Current-state impact

- **过时的提示与 Tab 停靠点（FR5、AR2、AR3）。** 当某个成员通过自身状态变成链接或按钮、或转为静态，而组本身并未渲染时，组会保留先前的提示与 Tab 停靠点。新的交互成员得不到提示，并且在焦点进入该组之前各自成为独立的 Tab 停靠点；一个最终没有任何交互成员的组会保留过时的提示；而当持有 Tab 停靠点的成员转为静态时，其余链接仍保留 `tabindex="-1"`，于是 Tab 会跳过该组，键盘用户无法到达它们，直到组再次渲染。

## Ownership boundary

**负责**

- 组的根元素、其 role 与名称，以及它的 `avatar-group` target。
- 通过 context 提供给成员的 size、shape、重叠量与数值尺寸。
- 使第一个重叠成员留在组内的起始内边距。
- 在带有 avatar item 标记的成员之间进行的漫游焦点，以及键盘提示。

**不负责 / 非目标**

- 哪些 avatar 可见以及隐藏数量——由产品调用点负责，它会对自己的列表做切片。
- 每个成员的渲染、名称、tooltip 与组内环——由 `component:Avatar` 负责。
- “+N” 指示器——由 `component:AvatarGroupOverflow` 负责。

## Public concepts

| Concept  | Closed values or states       | Meaning                               | Availability by variant/orientation/state | Default  | Owner                   | Stability | Invalid-value behavior  |
| -------- | ----------------------------- | ------------------------------------- | ----------------------------------------- | -------- | ----------------------- | --------- | ----------------------- |
| Size     | 任意 `component:Avatar` size  | 应用于每个成员与溢出指示器。          | 所有组                                    | `md`     | `component:AvatarGroup` | 稳定      | TypeScript 拒绝其他值。 |
| Shape    | `circle`、`rounded`、`square` | 应用于每个成员与溢出指示器。          | 所有组                                    | `circle` | `component:AvatarGroup` | 稳定      | TypeScript 拒绝其他值。 |
| Keyboard | 静态组；交互组                | 是否有任何成员带有 avatar item 标记。 | 在组的每次自身渲染时读取                  | 静态     | `component:AvatarGroup` | 稳定      | —                       |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                                                                                                                                                                                                            | Basis          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| FR1 | 根元素是一个 inline-flex、垂直居中的 `div`，带有 `role="group"`，名称取自调用方的 `aria-label` 或 `aria-labelledby`，否则使用翻译后的“Avatars”。它带有反映 `size` 与 `shape` 的 `avatar-group` target，并按顺序渲染子元素。                                                                                                                                                          | 当前源码与测试 |
| FR2 | 组把自身的 `size`、`shape`、数值尺寸，以及取该数值尺寸四分之一并取整的重叠量，提供给同一层中位于其下的每个 Avatar 与 AvatarGroupOverflow（`spec:AST-038` FR7、FR8；位于 hover card、popover 或其他层中的成员保留自己的 size 与 shape，但那里带标记的成员仍属于 FR4 的漫游集合）；成员自身的 size 与 shape 永远不会胜出，包括组使用其默认值时。                                       | 当前源码与测试 |
| FR3 | 每个成员都把重叠量的负值作为其 inline-start 外边距，第一个成员也不例外；组以相同数值为其 inline start 增加内边距，使第一个成员留在其内部，而空组没有起始内边距。当成员被 HoverCard 或 Tooltip 包裹时，重叠依然成立。                                                                                                                                                                 | 当前源码与测试 |
| FR4 | 带有 `data-avatar-item` 的元素——链接型与按钮型 avatar，以及可点击的溢出指示器——构成一个具有单一 Tab 停靠点的水平漫游集合：方向键按渲染方向在它们之间移动并在两端回绕，Home 与 End 跳转到第一个和最后一个。成员中的其他可聚焦内容（例如状态槽中的按钮）不在该集合内。                                                                                                                 | 当前源码与测试 |
| FR5 | 提示与 Tab 停靠点取决于在组自身最后一次渲染时读取到的“是否有任何成员带有 item 标记”：只要有成员带有，组内就会渲染一个视觉隐藏的翻译提示（“Use arrow keys to move between avatars”），并追加到 `aria-describedby` 中调用方值之后；纯静态组没有 Tab 停靠点，也没有提示。实现缺口：成员通过自身状态获得或失去标记而组未渲染时，提示与 Tab 停靠点会保持过时（见 Current-state impact）。 | 当前源码与测试 |
| FR6 | `ref` 指向根元素。受支持的 DOM、ARIA、data 与事件 prop 会透传到根元素；组件的 role、名称、描述与 `data-testid` 在其之后应用；调用方的 `onKeyDown` 与 `onFocus` 在漫游处理器之前运行，其中调用 `preventDefault()` 的处理器会跳过该事件的漫游处理器（`architecture:public-component-api` INV7）；`xstyle`、`className` 与 `style` 按该顺序在组件样式之后合并。                         | 当前源码与测试 |

### Allowed variation

- **AV1 — 主题绘制。** 主题可以按 `size` 与 `shape` 重新设定 `avatar-group` 的样式，而不改变成员资格、重叠归属或焦点行为。
- **AV2 — 成员资格。** 成员的数量与种类随调用点而变化。

### Representative states

| State      | Required invariant                                               | Allowed variation |
| ---------- | ---------------------------------------------------------------- | ----------------- |
| 静态组     | 有名称的组；没有 Tab 停靠点；没有提示。                          | 成员。            |
| 交互组     | 一个成员为 `tabIndex={0}`，其余为 `-1`；方向键漫游；提示被描述。 | 成员。            |
| 带溢出按钮 | 溢出指示器是最后一个漫游项。                                     | 数量。            |
| 空组       | 渲染时没有起始内边距。                                           | —                 |
| 从右到左   | 重叠与方向键移动都遵循渲染方向。                                 | —                 |

### Transformation and precedence order

- **ORD1 — 成员的 size 与 shape。** 组的值 → 成员自身的 prop（在组内被忽略）。
- **ORD2 — 描述。** 调用方的 `aria-describedby` → 键盘提示 id。
- **ORD3 — 按键与焦点处理。** 调用方的 `onKeyDown` 或 `onFocus` → 漫游处理器；调用方处理器若调用 `preventDefault()`，会跳过该事件的漫游处理器。

### Performance and resources

- **PR1 — 成员检测。** 检测交互成员不会新增观察者或监听器；组会在每次自身渲染后重新读取其成员，而“是否有任何成员可交互”的变化会在绘制前重新渲染该组。

## Accessibility contract

- **AR1 — 有名称的组。** 根元素为 `role="group"`，带有一个调用方可替换的、已翻译的默认名称。
- **AR2 — 单一 Tab 停靠点。** 交互成员共享单一 Tab 停靠点，并可用方向键、Home 与 End 到达，两个方向都按视觉顺序，以组自身最后一次渲染时读取的状态为准（成员本地变化存在 FR5 缺口）。
- **AR3 — 键盘提示。** 提示仅在漫游适用时描述该组，以组自身最后一次渲染时读取的状态为准（成员本地变化存在 FR5 缺口）。
- **AR4 — 静态成员。** 静态 avatar 不是漫游项，在组内没有 Tab 停靠点；`component:Avatar` 记录了对其 tooltip 的影响。

## Design relationships

| Anatomy or state | Design requirement           | Representation authority | Hierarchy role | Component contract |
| ---------------- | ---------------------------- | ------------------------ | -------------- | ------------------ |
| Avatar 子元素    | 尺寸统一的成员在一行内重叠。 | 当前源码与文档           | 突出           | FR1–FR3            |
| 溢出指示器       | 位于行末的可选 “+N” 成员。   | 当前源码与文档           | 辅助           | FR2、FR4           |

主题化：根元素是 `avatar-group` target。成员保留各自的 target；溢出指示器的 `avatar-group-overflow` target 属于 `component:AvatarGroupOverflow`。使用方结构未命名任何根部部件，因此不声明 anatomy-theming 块。

## Family and system relationships

- `component:Avatar` 读取组 context，并在自己的根元素上应用环、重叠与 item 标记。
- `component:AvatarGroupOverflow` 读取同一 context，并在可点击时加入漫游集合。
- `architecture:internationalization` 拥有组名称与提示背后的目录。

## Verification map

| Contract       | Verification                                                                                                                           | Representative states                       | Mutation or failure expectation                                                                                                                                                               | Audit section                |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| FR1、AR1       | `AvatarGroup.test.tsx` 的渲染、标签、size 反映、test-id 与空组测试                                                                     | 默认与自定义 `aria-label`；各尺寸；空组     | 缺少 `group` role、默认或自定义名称、`data-size` 反映或子元素时失败。缺口：没有测试断言 inline-flex 居中、`data-shape`、子元素顺序、调用方的 `aria-labelledby`，或调用方的 `role` 被替换。    | `audit:AvatarGroup/a11y`     |
| FR2、ORD1      | `AvatarGroup.test.tsx` 的 size 级联与重叠套件；`Avatar.test.tsx` 的组 shape 测试；`AvatarGroupOverflow.test.tsx` 的 size 与 shape 测试 | 组的 size 与 shape、默认值、组外；`md` 重叠 | 成员自身的 size 或 shape 在组内胜出，或 `md` 重叠值错误时失败。缺口：没有测试断言 `md` 之外尺寸的重叠值，也没有断言另一层中的成员保留自己的 size 与 shape。                                   | `audit:AvatarGroup/behavior` |
| FR3            | `AvatarGroup.test.tsx` 的重叠套件                                                                                                      | 普通成员、被包裹的成员、溢出指示器、空组    | 缺少成员外边距、缺少起始内边距，或空组上出现起始内边距时失败。                                                                                                                                | `audit:AvatarGroup/layout`   |
| FR3（layout）  | `AvatarGroup.stories.tsx` 的各尺寸；`AvatarGroupOverflow.stories.tsx` 的 AllShapes                                                     | 各尺寸与 shape、LTR 与 RTL                  | 缺口：没有自动化检查；第一个成员被裁切或重叠未镜像，只能在渲染出的测试夹具中看到。                                                                                                            | `audit:AvatarGroup/layout`   |
| FR4、AR2、AR4  | `AvatarGroup.test.tsx` 的漫游焦点套件                                                                                                  | 交互 avatar、溢出按钮、状态按钮、静态组     | 出现多于一个 Tab 停靠点、丢失 ArrowRight/ArrowLeft 移动、缺少溢出项、状态按钮进入集合，或静态组上出现 Tab 停靠点，都会失败。缺口：回绕、Home 与 End、以及从右到左的方向键方向没有自动化检查。 | `audit:AvatarGroup/a11y`     |
| FR5、AR3、ORD2 | `AvatarGroup.test.tsx` 的提示测试                                                                                                      | 交互组与静态组                              | 交互组缺少提示，或静态组出现提示时失败。缺口：没有测试覆盖提示在调用方 `aria-describedby` 之后的顺序，或成员通过自身状态改变交互性。                                                          | `audit:AvatarGroup/a11y`     |
| FR6、ORD3      | `AvatarGroup.test.tsx` 的 test-id 测试                                                                                                 | 调用方的 `data-testid`                      | 丢失 test id 时失败。缺口：没有测试覆盖 ref、DOM 透传、属性顺序、调用方处理器的顺序与取消，或样式输入的合并。                                                                                 | `audit:AvatarGroup/api`      |
| PR1            | 源码审查                                                                                                                               | 交互组与静态组                              | 缺口：如果成员检测新增了观察者或监听器，没有自动化检查会失败。                                                                                                                                | `audit:AvatarGroup/behavior` |
| AR1、AR3       | 无障碍树证据（`spec:AST-009` FR3）                                                                                                     | 静态组与交互组                              | 缺口：没有无障碍树检查证明组的 role、名称或描述；单元测试查询的是 DOM。                                                                                                                       | `audit:AvatarGroup/a11y`     |

## Decision log

未记录。本记录描述已发布的行为。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表/示例、当前审查结果、实现步骤或 family/系统规则；它链接到它们的拥有者。
