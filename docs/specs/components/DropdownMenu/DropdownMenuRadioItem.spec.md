---
schema_version: 3
template_version: 7
kind: component
id: component:DropdownMenuRadioItem
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers: [public-api, behavior, accessibility, theming, testing]
verified_by:
  [
    packages/core/src/DropdownMenu/DropdownMenuSelectable.test.tsx,
    packages/core/src/DropdownMenu/__tests__/Menu.a11y.test.tsx,
    packages/core/src/RadioList/__tests__/RadioGroup.a11y.test.tsx,
    packages/core/src/DropdownMenu/__tests__/DropdownMenuRadioItemAudit.a11y.chromium.spec.ts,
    apps/storybook/rtl-audit/verified-not-applicable.json,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:public-component-api,
    architecture:component-theming-surface,
    architecture:component-test-sufficiency,
    architecture:interaction-modality,
  ]
contributing: []
system_specs: [spec:AST-020]
---

# DropdownMenuRadioItem component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Public contract         | DropdownMenuRadioGroup 内的一个 `menuitemradio` 行，必填 value 与 label，可选 description、icon、end content、disabled 状态、根输入以及 ref。    |
| Behavior                | 启用状态下激活会通过 group 发出该行的 value，应用 group 的关闭策略，然后运行调用方 click 处理函数；禁用状态下激活不执行其中任何一项。            |
| End-user impact         | 辅助技术听到一个带其选中状态的单选选项；指针与键盘选择提交相同的 value，禁用的选项无法被选中。                                                   |
| Builder impact          | 把该行放在 DropdownMenuRadioGroup 内，并给它唯一的 value 和 label；调用方处理函数与该行自身的行为并行运行。                                      |
| Compatibility/readiness | 记录已发布行为；无 API 变更；禁用的行获得 `tabindex="-1"`（FR4）。                                                                               |
| Review checks           | 拒绝嵌套的语义单选控件、第二个键盘所有者、本地选择状态、丢失的调用方输入，或会选中、关闭、调用调用方 click 处理函数的禁用激活。                  |
| Governing rules         | `spec:AST-020` FR15；`architecture:public-component-api/INV5–INV8`；`architecture:component-theming-surface/INV4–INV6`；`spec:AST-020/FR1,FR2`。 |

此表是评审用的投影；以下正文才是权威。

## Intent

DropdownMenuRadioItem 在 DropdownMenu 的指针呈现中渲染单选组的一个可选项。该行拥有其 `menuitemradio` 语义、选中状态、装饰性单选标记、可见内容、禁用绘制以及激活顺序。DropdownMenuRadioGroup 拥有受控 value 与关闭策略；DropdownMenu 拥有焦点移动、typeahead、键盘激活以及菜单生命周期。

## Compatibility and migration

- 保留已发布默认值：是（`isDisabled=false`）。
- 兼容性类别：记录已发布行为；无公开 prop 或导出变更；禁用的行获得 `tabindex="-1"`（FR4）。
- 受控行为：选中状态始终由 group 的 `value` 推导；该行不持有选择状态。
- 迁移决策：无。

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 一个行根节点，带有 `role="menuitemradio"`，其 `aria-checked` 由 group 的 value 推导。
- 选择顺序：禁用守卫、group 的 `onChange(value)`、可选的关闭，然后是调用方 click 处理函数。
- 装饰性的共享单选标记、它的大小以及它的行内位置。
- 通过 Item 组合的 label、description、icon 与 end content。
- 禁用状态的暴露与绘制，以及启用行的悬停焦点。
- ref、受支持的宿主输入、`className`、`style` 和 `xstyle` 的根组合。

**不拥有 / 非目标**

- 选中的 value、变更回调与关闭策略——归 `component:DropdownMenuRadioGroup` 所有。
- 焦点进入、方向键导航、typeahead、Enter/Space 点击合成、按压手势以及关闭——归 `component:DropdownMenu` 所有。
- 可选择性行的触摸底部面板渲染——归父级呈现所有。
- 单选标记的绘制——归共享的 radio Indicator 所有。

## Public concepts

| Concept      | Closed values or states                        | Meaning                                      | Availability by variant/orientation/state | Default | Owner                             | Stability | Invalid-value behavior                            |
| ------------ | ---------------------------------------------- | -------------------------------------------- | ----------------------------------------- | ------- | --------------------------------- | --------- | ------------------------------------------------- |
| Option value | 任意字符串                                     | group 发出并用于比较以确定选中行的 value。   | 每一行                                    | 必填    | `component:DropdownMenuRadioItem` | stable    | 没有任何 group value 与之匹配时，该行保持未选中。 |
| Checked      | 选中；未选中                                   | group 的 value 是否等于该行的 value。        | 每一行                                    | 推导    | group 上下文与该行                | stable    | 不存在本地覆盖。                                  |
| Availability | 启用；禁用                                     | 该行能否获得悬停焦点并提交其 value。         | 每一行                                    | 启用    | `component:DropdownMenuRadioItem` | stable    | 禁用会阻断每一条激活路径。                        |
| Content      | label；description；icon；end content          | 该选项的可见标识，按阅读顺序。               | 每一行                                    | label   | 该行通过 Item                     | stable    | 公开类型要求 `label`。                            |
| Root surface | ref；DOM/data/ARIA；class/style/xstyle；events | 扩展该行根节点，同时保持其 role 与选中状态。 | 每一行                                    | 省略    | 公开组件 API                      | stable    | 不接受 `role`、`aria-checked` 和 `tabIndex`。     |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                                                                                                          | Basis                                                    |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| FR1 | 该行渲染一个带有 `role="menuitemradio"` 的元素，当且仅当 group 的 value 等于该行的 value 时其 `aria-checked` 为 true。它不嵌套任何原生或 ARIA 单选控件。                                                                                                                           | `spec:AST-020`；当前源码与测试                           |
| FR2 | 在 DropdownMenuRadioGroup 之外渲染该行会抛出异常。                                                                                                                                                                                                                                 | 当前源码与针对性测试                                     |
| FR3 | 启用状态下的激活——通过指针或通过父级合成的 Enter/Space 点击——以该行的 value 调用 group 的 `onChange`，然后在 group 的关闭策略开启时请求 DropdownMenu 关闭，再调用调用方的 `onClick`。                                                                                              | `architecture:public-component-api` INV7；当前行为与测试 |
| FR4 | 禁用的行暴露 `aria-disabled="true"`，像启用行一样带有 `tabindex="-1"`，以便父级的键盘模型能够到达它（`component:DropdownMenu` FR17），不获得悬停焦点，并且在任何激活时（包括辅助技术点击）既不调用 `onChange` 也不调用调用方 `onClick`，且不关闭菜单。它以半透明度和默认光标绘制。 | 当前源码与测试                                           |
| FR5 | ref、受支持的宿主属性与处理函数、`className`、`style` 和 `xstyle` 到达该行根节点或在其上组合。调用方 `onPointerMove` 在该行的悬停焦点之后运行，且调用方处理函数不会取代该行自身的行为。                                                                                            | `architecture:public-component-api` INV5–INV8；当前测试  |
| FR6 | 该标记是共享的 radio Indicator，对辅助技术隐藏，永远不是指针目标，在小尺寸菜单中为 `sm`、其他情况下为 `md`，在精细指针下位于该行的行内起始端、在粗指针下位于行内结束端。                                                                                                           | 当前源码与测试                                           |
| FR7 | 该行带有 `dropdown-menu-item` 目标并携带菜单尺寸，该标记带有 `dropdown-menu-radio` 目标并携带尺寸、选中与禁用反映。                                                                                                                                                                | `architecture:component-theming-surface`；当前源码与文档 |
| FR8 | 该行不添加自己的按键处理函数或 Tab 停靠点：每一行（包括禁用的行）都是 `tabindex="-1"`，以配合父级的游走焦点，键盘选择以父级合成的点击形式到达。                                                                                                                                    | `architecture:interaction-modality`；父级键盘测试        |

### Allowed variation

- **AV1 — 内容。** label、description、icon 与 end content 的长度和种类可以变化；长字符串 label 会截断为一行。
- **AV2 — 尺寸。** 标记跟随父级菜单尺寸：小尺寸菜单中为 `sm`，其他情况下为 `md`。行的内边距目前不随菜单尺寸变化，与操作行不同；这是观察，不是不变式。
- **AV3 — 根样式。** 调用方样式输入可以扩展该行，同时其 role、选中状态与标记保持完好。

### Representative states

| State          | Required invariant                                          | Allowed variation                    |
| -------------- | ----------------------------------------------------------- | ------------------------------------ |
| Checked        | `aria-checked=true`；标记显示其选中圆点。                   | 内容、尺寸、主题与模式。             |
| Unchecked      | `aria-checked=false`；标记显示空圆。                        | 内容、尺寸、主题与模式。             |
| Focused        | 该行持有焦点。                                              | 指针悬停或键盘到达；焦点绘制见 AR4。 |
| Disabled       | `aria-disabled=true`、无 Tab 停靠点、半透明度，且不可激活。 | 选中或未选中的 value。               |
| Coarse pointer | 标记位于该行的行内结束端。                                  | 方向会镜像该放置。                   |
| RTL / narrow   | 内容与标记遵循逻辑顺序，且无水平页面溢出。                  | 父级菜单的放置与宽度。               |

### Transformation and precedence order

- **ORD1 — 激活。** 禁用守卫 → group 的 `onChange(value)` → 当 group 的关闭策略开启时关闭 → 调用方 `onClick`。
- **ORD2 — 指针移动。** 启用行的悬停焦点 → 调用方 `onPointerMove`。
- **ORD3 — 根组合。** 基础行样式 → 禁用绘制 → 调用方 `xstyle`；调用方 `className` 与 `style` 与该行目标合并。

### Performance and resources

- **PR1 — 仅渲染。** 该行不拥有任何 Effect、监听器、观察器、定时器、请求或本地状态。

## Accessibility contract

- **AR1 — 一个单选选项。** 该行是唯一被播报的控件；其可访问名称来自其可见内容，其状态来自 `aria-checked`。
- **AR2 — 禁用状态。** 禁用的行暴露 `aria-disabled`，且无法通过任何输入提交 value。
- **AR3 — 键盘归属。** DropdownMenu 拥有焦点移动与激活；该行不添加按键处理。键盘按 `component:DropdownMenu` FR17 所述的方式到达禁用的行。
- **AR4 — 焦点可见性。** 键盘焦点在该行内部绘制共享焦点环，内缩量为焦点环自身的宽度，在每种颜色模式下都是如此，包括强制颜色模式；指针输入之后该行只显示覆盖层着色（`architecture:interaction-modality` INV1、INV3）。共享的行处理见 `component:DropdownMenuItem` FR8。

## Design relationships

| Anatomy or state | Design requirement                         | Representation authority | Hierarchy role | Component contract |
| ---------------- | ------------------------------------------ | ------------------------ | -------------- | ------------------ |
| Row              | 菜单行的绘制与圆角；焦点绘制见 AR4。       | 当前源码与菜单令牌       | structural     | FR7, AR4           |
| Radio marker     | 共享 radio Indicator，采用菜单的控件尺寸。 | 共享 radio Indicator     | prominent      | FR1, FR6           |
| Disabled         | 半透明度的行，配默认光标。                 | 当前源码                 | supporting     | FR4                |
| Direction/touch  | 逻辑标记放置，会镜像并在触摸时移动。       | 双向性与当前 CSS         | structural     | FR6                |

未记录任何组件本地的视觉决策。

## Family and system relationships

- `component:DropdownMenuRadioGroup` 拥有 value、变更回调与关闭策略。
- `component:DropdownMenu` 拥有键盘导航、按压模型、`dropdown-menu-item` 与 `dropdown-menu-radio` 目标清单、禁用行的键盘可达性（其 FR17），以及与 `component:DropdownMenuItem` 共享的行焦点处理（其 FR8）。
- `architecture:public-component-api` 拥有根输入与处理函数的组合。
- `architecture:component-theming-surface` 拥有目标放置与状态反映。
- `architecture:component-test-sufficiency` 拥有相称的可观察证据。
- `spec:AST-020` 提供 WCAG/APG 采纳与证据层边界。

## Verification map

| Contract | Verification                                                                                                                                                                                                                                                                                                                                                                            | Representative states                 | Mutation or failure expectation                                                                                                                                                                   | Audit section                           |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| FR1, AR1 | `DropdownMenuSelectable.test.tsx` 的 "renders the shared radio indicator in the menu marker" 与 "composes caller root inputs without replacing the row semantics"；`Menu.a11y.test.tsx` 的菜单绑定用例                                                                                                                                                                                  | 选中与未选中                          | 不是 `menuitemradio` 的行或错误的 `aria-checked` 会失败。证据缺口：没有测试断言不存在嵌套的单选控件。                                                                                             | `audit:DropdownMenuRadioItem/semantics` |
| FR2      | `DropdownMenuSelectable.test.tsx` 的 "throws when a radio item is used outside a group"                                                                                                                                                                                                                                                                                                 | 在 group 之外                         | 在 group 之外渲染的行会失败。                                                                                                                                                                     | `audit:DropdownMenuRadioItem/behavior`  |
| FR3, FR8 | `DropdownMenuSelectable.test.tsx` 的 "calls onChange with the selected value"、"composes the caller click handler with the selection"、"composes the caller click handler on keyboard activation"、"keeps the menu open while controlled selection updates when requested"；`DropdownMenu.test.tsx` 的 "activates a focused menuitemradio with Enter and a menuitemcheckbox with Space" | 指针与键盘激活；关闭关闭              | 缺失 `onChange`、丢失调用方 `onClick`，或不顾退出选项而关闭，都会失败。证据缺口：没有测试断言 `onChange`、关闭、`onClick` 的顺序，或启用行上的 `tabindex="-1"`。                                  | `audit:DropdownMenuRadioItem/behavior`  |
| FR4, AR2 | `DropdownMenuSelectable.test.tsx` 的 "does not select, close, or call the caller click handler when disabled"；`DropdownMenu.test.tsx` 的 "does not move focus on hover for a disabled item"                                                                                                                                                                                            | 禁用                                  | 禁用时仍选中、关闭或调用调用方 `onClick`，或禁用的行获得悬停焦点，都会失败。证据缺口：没有测试断言禁用行的 `tabindex="-1"`、父级键盘能够到达它（`component:DropdownMenu` FR17），或半透明度绘制。 | `audit:DropdownMenuRadioItem/behavior`  |
| FR5      | `DropdownMenuSelectable.test.tsx` 的 "composes caller root inputs without replacing the row semantics"、"composes the caller pointer-move handler with menu hover focus" 与 "a ref reaches the menuitemradio element"                                                                                                                                                                   | ref、宿主属性、class、style、指针移动 | 丢失的 ref、属性、class、style 或处理函数都会失败。证据缺口：没有测试断言该行上的 `xstyle`。                                                                                                      | `audit:DropdownMenuRadioItem/api`       |
| FR6, FR7 | `DropdownMenuSelectable.test.tsx` 的 "renders the shared radio indicator in the menu marker"；`DropdownMenuRadioItemAudit.a11y.chromium.spec.ts`                                                                                                                                                                                                                                        | 行内的标记                            | 缺失共享单选标记会失败。证据缺口：没有测试断言标记尺寸随菜单尺寸变化、其在精细与粗指针下的放置，或 `dropdown-menu-radio` 的反映。                                                                 | `audit:DropdownMenuRadioItem/visual`    |
| AR4, PR1 | `DropdownMenuForcedColors.test.tsx`（该行的 `:focus-visible` 环与令牌内缩）；`DropdownMenuAudit.a11y.chromium.spec.ts` 的强制颜色帧。证据缺口：没有测试断言不存在生命周期资源                                                                                                                                                                                                           | —                                     | —                                                                                                                                                                                                 | `audit:DropdownMenuRadioItem/visual`    |

## Current-state impact

无。

## Decision log

无组件本地决策。

## Open questions

- **OQ1 — 共享的 `dropdown-menu-item` 目标是否应反映其各行所绘制的禁用状态？**（`human-api`）可选择行与操作行把禁用的行绘制为半透明度，但该目标只反映尺寸与 variant，因此主题无法通过它为禁用的行设置样式。该目标清单归 `component:DropdownMenu` 所有。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计得分、截图矩阵、实现步骤或 group/父级契约。它以链接指向它们的归属者。
