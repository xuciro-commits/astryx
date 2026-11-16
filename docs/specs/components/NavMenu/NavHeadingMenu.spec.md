---
schema_version: 3
template_version: 7
kind: component
id: component:NavHeadingMenu
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-26
owners: [cixzhang]
review_triggers: [behavior, theming, accessibility]
verified_by:
  [
    packages/core/src/NavMenu/NavHeadingMenu.test.tsx,
    apps/storybook/stories/NavMenu.stories.tsx,
    packages/core/src/Icon/Icon.test.tsx,
    packages/core/src/Text/Text.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    scripts/check-knowledge.mjs,
    apps/storybook/rtl-audit/targets.json,
  ]
modules: []
families: [family:navigation-destinations, family:action-groups]
design_specs: []
architecture:
  [
    architecture:component-theming-surface,
    architecture:icon-resolution-and-component-slots,
    architecture:interaction-modality,
    architecture:layer-runtime,
    architecture:public-component-api,
  ]
contributing: []
system_specs: [spec:AST-005/DEC-1, spec:AST-020, spec:AST-085]
---

# NavHeadingMenu component contract

## Contract at a glance

| 领域                    | 契约                                                                                                                                                                                                                                                            |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | `NavHeadingMenu` 接收 `children`、`size`（`sm`、`md`、`lg`；默认 `md`）和 `minWidth`；`NavHeadingMenuItem` 接收 `label`、`description`、`icon`、`href`、`onClick` 和 `isDisabled`；提供目标 `nav-heading-menu` 与 `nav-heading-menu-item`，并带有 `size` 状态。 |
| Behavior                | 标题弹出层内部的一个 `role="menu"` 列表，包含 `menuitem` 行，支持方向键、Home、End、typeahead、Enter、Space 和 Escape。选中某个启用项会执行该项，并在宿主标题提供关闭动作时关闭标题菜单。                                                                       |
| End-user impact         | 用户通过标题菜单以指针或键盘切换产品或账户；键盘和 typeahead 可以到达禁用行，这些行会被朗读为禁用，并且不做任何事（FR6）。                                                                                                                                      |
| Builder impact          | 无。                                                                                                                                                                                                                                                            |
| Compatibility/readiness | 记录已发布的行为；无 API 变更；禁用项获得 `tabindex="-1"`（FR6）。存在四处实现缺口（见 Current-state impact）。                                                                                                                                                 |
| Review checks           | 拒绝以下情况：`menu`/`menuitem` 角色被调用方 props 覆盖，键盘移动或 typeahead 跳过禁用项，禁用项触发动作或关闭菜单，或调用方的 `onKeyDown` 静默禁用键盘模型。                                                                                                   |
| 治理规则                | `family:navigation-destinations` FR7；`architecture:interaction-modality`；`architecture:component-theming-surface`；`architecture:layer-runtime`。                                                                                                             |

本表只是评审的投影；以下正文才具有权威性。

## Intent

NavHeadingMenu 在 SideNavHeading 或 TopNavHeading 的弹出层中呈现可选择的动作。它拥有菜单列表、其键盘模型以及每个条目的行。`NavMenu.doc.mjs` 将 NavHeadingMenu 与 NavHeadingMenuItem 一起记录，而 NavHeadingMenuItem 没有自己的使用方文档，因此本条记录同时覆盖两者。

## Compatibility and migration

- 默认发布状态保留：禁用项为 `no`：键盘可以到达禁用项，且该项带有 `tabindex="-1"`（FR5、FR6），这是 `component:DropdownMenu` DEC-11 下的一项缺陷修复（所有者决策，2026-11-04）
- 兼容性类别：记录已发布的行为；无公共 API、样式或目标变更；禁用项获得 `tabindex="-1"`（FR6）
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档和发行说明。

## Current-state impact

- **禁用的链接条目仍然会导航。** 带 `href` 的禁用 NavHeadingMenuItem 保留其链接目标，且不会取消点击，因此即使该项报告 `aria-disabled` 并跳过其 `onClick`，指针点击仍会导航。`family:navigation-destinations` FR7 要求成员保留各自的禁用语义，而 `spec:AST-085` FR2 要求禁用的控件阻止导航。
- **文档记载的组合方式嵌套了两层菜单。** 按使用方文档的指示，作为 SideNavHeading 或 TopNavHeading 的 `menu` 传入时，NavHeadingMenu 的 `role="menu"` 直接位于标题自身的 `role="menu"` 包装器内部。WAI-ARIA 1.2 只允许 `menu` 拥有 `menuitem` 家族的条目和分组，因此辅助技术会遇到菜单嵌套在菜单中的情况。
- **该菜单没有自己的名称。** 除非调用方传入 `aria-label`，否则 NavHeadingMenu 的 `menu` 不带可访问名称；在标题内部，只有标题的包装器 `menu` 有名称。`spec:AST-020` FR15 采用的 APG 菜单模式会为每个菜单命名。
- **焦点仅通过填充显示。** 条目会移除轮廓，并用悬停填充标记焦点；它没有使用 `architecture:interaction-modality` 提供的共享焦点轮廓。

## Ownership boundary

**负责**

- Menu 容器、菜单语义、键盘移动、typeahead，以及当前的 `nav-heading-menu` 目标。
- 每个 Item 的动作/链接行、选中处理、尺寸处理，以及当前的 `nav-heading-menu-item` 目标。
- 内容布局：包含文本渲染或调用方渲染的标签路径，以及可选的描述。

**不负责 / 非目标**

- Icon 图形与 `icon` 目标——通过 Icon 渲染的值委托给 `component:Icon`。
- 字符串标签与描述的排版及其 `text` 目标——委托给 `component:Text`。
- 非字符串标签内容——由调用方负责。
- SideNavHeading 或 TopNavHeading 的触发器、弹出层表面、定位、关闭生命周期或关闭状态归属——由 `component:SideNavHeading` 与 `component:TopNavHeading` 负责。
- 目的地接受与阻止——由 `family:navigation-destinations` 负责。

## Public concepts

| 概念 | 封闭取值或状态   | 含义                                           | 按变体/方向/状态的可达性          | 默认值 | 所有者                     | 稳定性 | 无效值行为              |
| ---- | ---------------- | ---------------------------------------------- | --------------------------------- | ------ | -------------------------- | ------ | ----------------------- |
| Size | `sm`、`md`、`lg` | 菜单最小宽度（160、200、240 px）与条目内边距。 | 菜单与每个条目通过 context 生效。 | `md`   | `component:NavHeadingMenu` | 稳定   | TypeScript 拒绝其他值。 |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 依据                 |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| FR1 | NavHeadingMenu 渲染一个 Menu `div`，携带 `role="menu"`、带 `size` 的当前 `nav-heading-menu` 目标、转发进来的 `ref`、`data-testid` 以及其他 DOM props；调用方 props 不能替换该角色。`minWidth` 会覆盖尺寸的最小宽度。                                                                                                                                                                                                                                                               | 当前源码、文档与测试 |
| FR2 | NavHeadingMenuItem 渲染一个 Item，携带 `role="menuitem"` 与带菜单尺寸的当前 `nav-heading-menu-item` 目标，在提供 `href` 时渲染为 `LinkProvider` 链接（否则为 `<a>`），未提供时渲染为 `div`。调用方 props 不能替换其角色、tab 索引或禁用状态。                                                                                                                                                                                                                                      | 当前源码、文档与测试 |
| FR3 | 可选的由 Icon 渲染的图标委托给 Icon 的 `icon` 目标。字符串标签与所有描述通过 Text 的 `text` 目标渲染为一行；非字符串标签直接作为调用方自有的内容渲染。                                                                                                                                                                                                                                                                                                                             | 当前源码与目标文档   |
| FR4 | 弹出层运行时由宿主标题负责。当宿主提供关闭回调时（TopNavHeading 与折叠状态的 SideNavHeading），NavHeadingMenu 在 Escape 以及成功选中 Item 时调用它；展开状态的 SideNavHeading 不提供回调，因此选择后菜单保持打开（`component:SideNavHeading` FR7）。                                                                                                                                                                                                                               | 当前源码与测试       |
| FR5 | 条目（包括禁用条目）可聚焦，但不是 tab 停靠点。在独立菜单中，ArrowDown 与 ArrowUp 移动一个条目（包括禁用条目）并循环；Home 与 End 跳到第一个和最后一个条目；输入字符会移动到匹配的条目（包括禁用条目）（FR6、`component:DropdownMenu` FR17）；Enter 或 Space 激活当前聚焦的条目。                                                                                                                                                                                                  | 当前源码与测试       |
| FR6 | 激活启用的条目会运行其 `onClick`，然后运行关闭回调；禁用条目携带 `aria-disabled="true"`，必须像启用条目一样位于 tab 顺序之外但保持可聚焦（`spec:AST-085` FR1），按 `component:DropdownMenu` FR17 的说明可被键盘移动与 typeahead 到达（所有者决策，2026-11-04，`component:DropdownMenu` DEC-11），并且不运行 `onClick`、也不关闭菜单。                                                                                                                                              | 当前源码与测试       |
| FR7 | 菜单上的调用方 `onKeyDown` 先运行；除非该调用方在某个未被条目处理器取消的事件上调用 `preventDefault()`，键盘模型仍会运行；条目处理器取消事件不会阻止方向键导航。                                                                                                                                                                                                                                                                                                                   | 当前源码与测试       |
| FR8 | 在打开的菜单中，按下（手指、触控笔或鼠标）落在已启用条目上并在条目间滑动时，只作用于抬起时所在的条目一次，并通过该条目自身的激活完成，高亮跟随指针；在外部抬起不作用于任何条目，鼠标在外部释放会关闭菜单。菜单为此采用 `module:DropdownMenu/useMenuPress`（`family:action-groups` FR1–FR5；`module:DropdownMenu/useMenuPress` DEC-7）。按在非条目的调用方内容上，以及对链接条目进行 Ctrl-、Cmd- 或 Shift- 点击或中键点击，仍归该内容或浏览器自身处理，键盘与辅助技术行为保持不变。 | 当前源码与测试       |

### Allowed variation

- 条目可以渲染为链接或回调动作，也可以启用或禁用，而不改变解剖结构归属。
- Icon 可以缺省。标签可以走通过 Text 渲染的字符串路径，也可以走直接作为调用方自有内容渲染的非字符串路径。条目描述可以缺省，存在时通过 Text 渲染。
- 菜单尺寸与最小宽度可以变化，而不会产生独立的解剖结构部件或目标。

### Representative states

| 状态           | 必需不变式                                       | 允许的变化                                                   |
| -------------- | ------------------------------------------------ | ------------------------------------------------------------ |
| 链接条目       | 条目是带 menuitem 语义及其当前目标的锚点。       | 目标地址、文本、描述与图标可以变化。                         |
| 动作条目       | 条目是带 menuitem 语义及其当前目标的 div。       | 选中回调可以变化。                                           |
| 禁用条目       | 条目仍然存在，并体现禁用语义。                   | 键盘移动与 typeahead 可以到达它；激活时它不做任何事（FR6）。 |
| 字符串标签条目 | 通过 Text 渲染的条目标签委托给 Text 的当前目标。 | 标签值、目标地址、描述与图标可以变化。                       |
| 自定义标签条目 | 调用方渲染的条目标签保持调用方自有。             | 调用方控制非字符串标签内容。                                 |
| 带描述条目     | 条目描述委托给 Text 的当前目标。                 | 描述内容可以变化或缺省。                                     |

### Transformation and precedence order

- **ORD1 — 菜单宽度。** 先取 `minWidth`，再取尺寸的最小宽度。
- **ORD2 — 键盘。** 先运行调用方 `onKeyDown`，再运行菜单键盘模型（FR7）。

### Performance and resources

- 无资源规则。

## Accessibility contract

- **AR1 — 菜单语义。** 一个 `menu` 容纳 `menuitem` 行（FR1、FR2）。它只能由调用方的 `aria-label` 命名；在标题内部，标题命名自己的包装器 `menu`，而不是这个（Current-state impact）。
- **AR2 — 键盘。** FR5 与 FR6。
- **AR3 — 禁用。** 禁用项以禁用状态暴露，可被键盘移动与 typeahead 到达，并且保持惰性（FR6）。

## Design relationships

| 解剖结构或状态             | 设计要求                                    | 表示权威           | 层级角色     | 组件契约 |
| -------------------------- | ------------------------------------------- | ------------------ | ------------ | -------- |
| Menu                       | 以菜单语义与键盘导航组织 nav-heading 动作。 | 当前源码与公共文档 | 显著         | FR1、FR4 |
| Item                       | 呈现一个可选择的动作或导航目的地。          | 当前源码与公共文档 | 显著         | FR2      |
| Icon                       | 在标签之前呈现可选的、由 Icon 所有的图形。  | `component:Icon`   | 辅助         | FR3      |
| Text-rendered item label   | 通过 Text 的正文样式呈现字符串标签。        | `component:Text`   | 显著         | FR2、FR3 |
| Caller-rendered item label | 通过调用方自有内容直接呈现非字符串标签。    | 调用方提供的内容   | 视上下文而定 | FR2、FR3 |
| Item description           | 通过 Text 的辅助样式呈现可选的辅助内容。    | `component:Text`   | 辅助         | FR2、FR3 |

菜单是弹出层的内容，而不是弹出层的宿主。SideNavHeading 或 TopNavHeading 负责层生命周期，并通过 context 提供关闭回调。

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Menu": {"target": "nav-heading-menu"},
  "Item": {"target": "nav-heading-menu-item"},
  "Icon": {
    "delegatesTo": {"owner": "component:Icon", "target": "icon"}
  },
  "Text-rendered item label": {
    "delegatesTo": {"owner": "component:Text", "target": "text"}
  },
  "Caller-rendered item label": {
    "none": {
      "reason": "intentional: Non-string label content is rendered directly and remains caller-owned"
    }
  },
  "Item description": {
    "delegatesTo": {"owner": "component:Text", "target": "text"}
  }
}
```

## Family and system relationships

- `architecture:component-theming-surface` 负责解剖结构资格、本地目标映射、组件委托以及事实性的 `none` 处置。
- `architecture:icon-resolution-and-component-slots` 负责 Icon 槽位解析；本条记录陈述当前的 Icon 委托。
- `architecture:layer-runtime` 负责父级 nav 标题所使用的共享弹出层宿主生命周期。NavHeadingMenu 仅负责其菜单行为，并消费标题提供的关闭回调。
- `architecture:public-component-api` 负责稳定的 props 与子组件表面。
- `family:navigation-destinations` 负责 NavHeadingMenuItem `href` 的共享接受/阻止结果；`spec:AST-005/DEC-1` 要求原生与自定义路由器条目路径都保留该结果。

## Verification map

| 契约             | 验证                                                                                           | 代表性状态                                                    | 变更或失败预期                                                                                                           | 审计章节                        |
| ---------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------- |
| FR1, FR2         | `NavHeadingMenu.test.tsx` 的角色、渲染、链接与禁用套件                                         | 含链接、动作与禁用 Item 的菜单                                | 移除菜单/条目语义、内容或当前渲染分支，会使现有的角色、标签、属性与文本检查失败。                                        | `audit:NavHeadingMenu/anatomy`  |
| FR3              | 对 NavHeadingMenuItem 源码的检查，加上 Icon 与 Text 的目标元数据                               | Icon、字符串标签、调用方渲染标签与描述路径                    | 源码证明 Icon 槽位委托、条件标签渲染与 Text 包裹的描述；聚焦测试断言字符串与描述内容，但不断言目标位置或自定义标签归属。 | `audit:NavHeadingMenu/theming`  |
| FR4–FR7          | `NavHeadingMenu.test.tsx` 的 context、键盘、禁用与透传套件                                     | 选中、Escape、方向键、Home/End、typeahead、禁用、调用方处理器 | 破坏关闭回调消费、键盘行为或角色优先级，会使聚焦的交互断言失败。                                                         | `audit:NavHeadingMenu/behavior` |
| 目标清单         | 源码检查与 `themingTargets.test.ts`                                                            | Menu、Item 与委托的 Icon 目标                                 | 运行时与文档化的目标元数据漂移会使目标校验失败。                                                                         | `audit:NavHeadingMenu/theming`  |
| 主题解剖结构映射 | `scripts/check-knowledge.mjs`                                                                  | 规范解剖结构与两个当前本地目标                                | 缺失、多余、带前缀或过期的映射会使仓库校验失败。                                                                         | `audit:NavHeadingMenu/theming`  |
| FR8              | `NavHeadingMenu.test.tsx` 的动作组套件（触摸与鼠标滑动）                                       | 跨条目滑动的触摸与鼠标操作；一个禁用条目；不可拖拽的链接条目  | 移除该采用会使滑动测试失败。                                                                                             | —                               |
| RTL 关系         | RTL 审计精选的 D2 目标（`apps/storybook/rtl-audit/targets.json`）作用于 `NavMenu / With icons` | 菜单条目图标及其标签；LTR 与 RTL                              | 图标如果不在其标签的行内起始位置，会使 D2 失败。                                                                         | `audit:NavHeadingMenu/i18n-rtl` |

从源码读取、尚无聚焦测试的内容：

- FR1：转发进来的 `ref`，以及菜单角色优先于调用方 props。
- FR2：`nav-heading-menu-item` 目标与 `LinkProvider` 链接。
- FR3。
- FR5：启用条目可聚焦但不是 tab 停靠点。
- FR6：禁用条目不会关闭菜单。
- SideNavHeading 或 TopNavHeading 内部的 FR4、FR5 与 AR1。
- 主题映射中 Menu 与 Item 的目标放置。

## Decision log

未记录组件本地的决策。

## Open questions

无。

## Content boundary

本文件不重复使用方的 props 表、示例、键盘或层算法、实现步骤或系统规则。它链接到它们的负责者。
