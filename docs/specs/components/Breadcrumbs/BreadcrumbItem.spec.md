---
schema_version: 3
template_version: 7
kind: component
id: component:BreadcrumbItem
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-27
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Breadcrumbs/Breadcrumbs.test.tsx,
    packages/core/src/Breadcrumbs/__tests__/Breadcrumbs.a11y.test.tsx,
    packages/core/src/Breadcrumbs/__tests__/Breadcrumbs.a11y.chromium.spec.ts,
    apps/storybook/stories/BreadcrumbItem.stories.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    scripts/check-knowledge.mjs,
  ]
modules: []
families:
  [
    family:navigation-destinations,
    family:overlay-dismissal,
    family:action-groups,
  ]
design_specs: [design:bidirectionality]
architecture:
  [
    architecture:component-style-authoring,
    architecture:component-test-sufficiency,
    architecture:component-theming-surface,
    architecture:interaction-modality,
    architecture:layer-runtime,
    architecture:public-component-api,
    architecture:react-component-runtime,
  ]
contributing: [contributing:api-conventions]
system_specs: [spec:AST-002, spec:AST-005]
---

# BreadcrumbItem component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | `BreadcrumbItem`，带有 `children`、`href`、`as`、`onClick`、`isCurrent`、`startIcon`、`menu` 与 `menuSize`；目标为 `breadcrumb-item`、`breadcrumb-item-menu-trigger` 与 `breadcrumb-menu`。 |
| Behavior                | 一个面包屑项：链接、样式为链接的按钮、纯文本、当前页或同级菜单触发器，由 ORD1 选择。它渲染自己的装饰性分隔符，在第一个面包屑项上隐藏。当没有任何面包屑项另行声明时，最后一项成为当前页。    |
| End-user impact         | 用户沿层级向上移动，从面包屑项的菜单打开同级目标，并听到哪一项是当前页。                                                                                                                    |
| Builder impact          | 无。                                                                                                                                                                                        |
| Compatibility/readiness | 记录已发布的行为；无公共变更。两处实现缺口：自动当前页状态在渲染之后才应用，并且可能落到列表项上（见 Current-state impact）。                                                               |
| Review checks           | 拒绝以下情形：当前项的内容所有者缺少 `aria-current="page"`（已记录的 `<li>` 回退除外）；分隔符被暴露；菜单缺少名称、状态与控制关联；菜单关闭时抢占有效的外部焦点。                          |
| Governing rules         | `component:Breadcrumbs`；`family:navigation-destinations`；`family:overlay-dismissal`；`component:Popover`；`design:bidirectionality` DR4；`architecture:react-component-runtime` INV1。    |

本表是审查用的投影；以下正文具有权威性。

## Intent

BreadcrumbItem 在 Breadcrumbs 轨迹中呈现单个目标、操作、当前位置或同级菜单触发器。使用方用法见 `BreadcrumbItem.doc.mjs`。

## Compatibility and migration

- 已发布的默认值保留：`yes`
- 兼容性类别：记录已发布的行为；无公共变更
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **自动当前状态在渲染之后被修补。** 当没有任何面包屑项设置 `isCurrent` 时，最后一项首次渲染时不带 `aria-current`，随后一个 Effect 检查 DOM 中的同级列表并添加 `aria-current="page"`。`architecture:react-component-runtime` INV1 要求渲染输出从有效状态开始，而不是在后续 Effect 中被修补。
- **自动当前状态可能落到列表项上。** 当最后一项通过自定义 `as` 或 `LinkProvider` 链接渲染，而该链接不转发其 ref 时，自动当前修补会把 `aria-current="page"` 设置在 `<li>` 上，而链接上没有任何标记，因此该链接不会被播报为当前页（FR3、AR2）。

## Ownership boundary

**Owns**

- 列表项根节点、依据当前公共输入选出的项内容分支，以及将文档化的项 ref 与 `BaseProps` 界面转发到该根节点。
- 为其在轨迹中的位置渲染的装饰性分隔符容器。
- 样式为链接的操作或菜单触发器，以及 BreadcrumbItem 特有的菜单表面，包括它们当前的主题目标。
- 在未提供显式菜单尺寸时，从父级 Breadcrumbs 变体推导菜单项尺寸。

**Does not own / non-goals**

- 导航地标、有序列表、轨迹标签、分隔符取值或视觉变体——由 `component:Breadcrumbs` 通过公共父组件拥有。
- 目标接受与自定义路由器的交接——由 `family:navigation-destinations` 与共享链接所有者拥有。
- 通用顶层托管、焦点包含、定位与轻关闭——由 `component:Popover` 与 `architecture:layer-runtime` 拥有。
- 共享的 Escape/平台关闭排序——由 `family:overlay-dismissal` 拥有。
- 菜单项数据、行语义、选择或子菜单行为——委派给 DropdownMenu 项管线。
- 调用方提供的图标图形或任意子内容。

## Public concepts

| Concept    | Closed values or states             | Meaning                                                                            | Availability by variant/orientation/state | Default                                     | Owner                                  | Stability | Invalid-value behavior                                                          |
| ---------- | ----------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------- | -------------------------------------- | --------- | ------------------------------------------------------------------------------- |
| 项内容     | 必需的 `ReactNode`                  | 提供可见的项标签，并可包含调用方拥有的内容。                                       | 每个项分支                                | 必需                                        | `component:BreadcrumbItem`             | 已发布    | React 渲染所提供的节点。                                                        |
| 目标       | 提供或缺失的 `href`                 | 当项未被显式标记为当前且没有菜单时，选择共享链接路径。                             | 默认与 supporting 变体                    | 缺失                                        | `family:navigation-destinations`       | 已发布    | 共享链接处理决定接受的目标。                                                    |
| 操作       | 提供或缺失的 `onClick`              | 在未提供目标或菜单时选择原生、样式为链接的按钮，或在提供了 `href` 时增强链接路径。 | 非当前项                                  | 缺失                                        | `component:BreadcrumbItem`             | 已发布    | `menu` 目前会抑制此输入，并在开发环境发出警告。                                 |
| 当前页     | `true`、`false` 或省略              | `true` 显式把项标记为当前；`false` 使其退出；省略使该项成为自动当前候选。          | 每个分支，包括菜单触发器                  | 省略                                        | `component:BreadcrumbItem`             | 已发布    | 当没有项被显式为当前时，若最后一项省略该 prop，则它获得 `aria-current="page"`。 |
| 链接渲染器 | 逐项的 `as`、提供方渲染器或原生锚点 | 选择接收已接受目标的组件。                                                         | 非当前链接路径                            | 提供方渲染器，其次原生锚点                  | `family:navigation-destinations`       | 已发布    | 显式为当前及菜单路径不使用它。                                                  |
| 起始内容   | 提供或缺失的 `startIcon`            | 在项标签之前渲染调用方内容。                                                       | 每个项分支                                | 缺失                                        | 调用方                                 | 已发布    | 调用方内容仍归调用方所有。                                                      |
| 同级菜单   | 数据数组、组合而成的菜单内容或缺失  | 用菜单按钮与菜单表面替换链接/操作内容分支。                                        | 当前或非当前项                            | 缺失                                        | `component:BreadcrumbItem`；菜单行委派 | 已发布    | 目前会抑制 `href` 或 `onClick`，并在开发环境发出警告。                          |
| 菜单尺寸   | `sm`、`md` 或 `lg`                  | 选择委派的菜单行尺寸。                                                             | 菜单分支                                  | `supporting` Breadcrumbs 为 `sm`，否则 `md` | `component:BreadcrumbItem`             | 已发布    | TypeScript 拒绝不支持的值。                                                     |

## Behavioral and layout contract

| ID   | Invariant                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Basis                                                                            |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| FR1  | 项根节点是一个 `<li>`，承载公共 ref、带轨迹变体的 `breadcrumb-item` 目标、`data-testid`、样式逃逸通道以及其他 DOM props。                                                                                                                                                                                                                                                                                                                                                 | 已发布的类型、源码、文档与测试；`architecture:public-component-api`              |
| FR2  | 带 `href` 且无菜单的非当前项使用共享链接渲染器，`onClick` 位于链接上；仅有 `onClick` 的项使用样式为链接的原生按钮；两者皆无的项渲染文本内容。                                                                                                                                                                                                                                                                                                                             | 已发布的源码、文档与测试                                                         |
| FR3  | 显式 `isCurrent=true` 把内容渲染为文本（或菜单触发器），并携带 `aria-current="page"`，同时忽略 `href` 与 `onClick`；显式 `false` 使其退出；当列表中没有项携带 `aria-current="page"` 时，列表的最后一个子项若省略该 prop，则在其内容所有者上获得它（Current-state impact 记录了回退到 `<li>` 的情形）；最后一个子项设置 `isCurrent={false}` 的轨迹没有当前面包屑。                                                                                                         | 已发布的源码、文档与测试                                                         |
| FR4  | 每个项在其内容之前渲染一个 `aria-hidden` 分隔符容器，在第一个项上隐藏。内置的 `/` 在 RTL 中恰好镜像一次；调用方提供的分隔符按给定内容渲染。                                                                                                                                                                                                                                                                                                                               | 源码、聚焦测试与 `design:bidirectionality` DR4                                   |
| FR5  | 菜单项暴露一个菜单按钮，带有 `aria-haspopup="menu"`、其展开状态与 `aria-controls`，以及一个由触发器命名的 `role="menu"` 表面，包括非字符串的触发器内容。点击、Enter、Space 与 ArrowDown 会打开它并聚焦其第一项；Escape、Tab 与选择会关闭它；方向键在项之间移动且不循环，typeahead 跳转到匹配的项。                                                                                                                                                                        | APG Menu Button 模式、`component:Popover`、源码、测试与浏览器证据                |
| FR6  | 关闭菜单会保留新获得焦点的外部控件。仅当关闭的表面否则会使焦点滞留时，焦点才返回触发器。                                                                                                                                                                                                                                                                                                                                                                                  | `component:Popover` 与浏览器焦点行为                                             |
| FR7  | 菜单分支将项渲染、选择、行焦点与子菜单内容委派给共享的 DropdownMenu 项管线，数据来源可以是数据数组或组合的 children。使用 `menu` 时，`href` 与 `onClick` 被忽略，并记录一条开发警告。                                                                                                                                                                                                                                                                                     | 已发布的源码与聚焦测试                                                           |
| FR8  | 省略的 `menuSize` 在进入菜单管线之前，在 `supporting` 变体下解析为 `sm`，其他情况解析为 `md`。                                                                                                                                                                                                                                                                                                                                                                            | 已发布的源码与使用方文档                                                         |
| FR9  | 局部目标为：`<li>` 上的 `breadcrumb-item`、菜单按钮上的 `breadcrumb-item-menu-trigger`，以及菜单表面上的 `breadcrumb-menu`；前两者反映轨迹的变体。链接、按钮与菜单触发器绘制共享的焦点轮廓。                                                                                                                                                                                                                                                                              | 已发布的文档、源码与主题测试                                                     |
| FR10 | 在打开的菜单中，落在某个已启用项上并随后滑过各项的按压（手指、笔或鼠标）只作用于抬起位置所属的项，且仅一次，通过该项自身的激活实现，高亮跟随指针；在外部抬起则不作用于任何项，鼠标在外部释放会关闭菜单。菜单为此采用 `module:DropdownMenu/useMenuPress`（`family:action-groups` FR1–FR5；`module:DropdownMenu/useMenuPress` DEC-7）。落在非项调用方内容上的按压，以及对链接项的 Ctrl-、Cmd- 或 Shift-点击或中键点击，仍归该内容或浏览器自身所有，键盘与辅助技术行为不变。 | 当前源码与测试                                                                   |
| FR11 | 在 AppShell 移动端抽屉内，激活面包屑项的链接或按钮会调用 `onClick`，随后关闭抽屉；例外是，对链接的 Ctrl-、Cmd-、Shift- 或 Alt-点击会执行 `onClick`，并为下一次点击保持抽屉打开，除非 `onClick` 取消该点击，与 `component:TopNavItem` FR5 和 `component:SideNavItem` FR10 的做法一致；标记为 `isCurrent` 的面包屑项不导航，会保持抽屉打开。                                                                                                                                | 与 `component:TopNavItem` FR5 和 `component:SideNavItem` FR10 保持一致；缺陷修复 |

### Allowed variation

- **AV1 — 链接渲染器。** 原生锚点与自定义路由组件可以在 DOM 实现上不同，同时保留共享目标契约。
- **AV2 — 调用方内容。** 标签与起始内容可以是任何可渲染的 React 内容；项拥有周围的语义，而非调用方图形或标记。
- **AV3 — 菜单内容。** 数据驱动内容与组合内容可通过委派的管线产生操作、分区、分隔线、可选中的项或子菜单。
- **AV4 — 主题。** 当前目标与语义令牌可以改变绘制，而项角色、焦点所有权与分支行为保持稳定。

### Representative states

| State        | Required invariant                                                     | Allowed variation                        |
| ------------ | ---------------------------------------------------------------------- | ---------------------------------------- |
| 目标链接     | 共享链接路径、可见的键盘焦点与接受的目标行为仍可用。                   | 原生或自定义路由渲染器；可选的起始内容。 |
| 操作按钮     | 原生按钮语义与提供的点击处理仍可用。                                   | 默认或 supporting 排版。                 |
| 显式当前     | 当前页状态暴露在渲染的内容所有者上。                                   | 纯内容或菜单触发器。                     |
| 自动当前     | 最后一项在省略该 prop 时，仅在不存在显式当前项的情况下获得当前页状态。 | 链接或文本内容仍处于其已发布的分支。     |
| 关闭的菜单   | 触发器暴露 `aria-haspopup="menu"`、控制该菜单，并报告折叠状态。        | 数据驱动或组合的行；当前或非当前触发器。 |
| 打开的菜单   | 已命名的菜单可在顶层到达，焦点进入其第一个符合条件的行。               | 行种类、子菜单内容与显式菜单尺寸。       |
| 已关闭的菜单 | 一次关闭即收起该表面；有效的外部焦点被保留，滞留的焦点返回触发器。     | Escape、选择、Tab 或原生轻关闭。         |

### Transformation and precedence order

- **ORD1 — 内容分支。** 先求值显式当前；在当前或非当前状态之内，`menu` 选择菜单分支。否则 `href` 选择链接分支，然后 `onClick` 选择操作分支，最后保留纯内容。
- **ORD2 — 链接渲染器。** 逐项的 `as` 优先于 LinkProvider，后者优先于原生锚点。
- **ORD3 — 菜单尺寸。** 显式 `menuSize` 优先；否则 supporting 解析为 `sm`，其余父变体解析为 `md`。

### Performance and resources

- **PR1 — 委派的层资源。** BreadcrumbItem 不创建独立的全局监听器或观察器；菜单生命周期与焦点资源仍委派给 Popover 与共享菜单 hook。
- **PR2 — 自动当前的协调。** 当前源码通过在渲染之后检查已渲染的同级列表来解析省略的当前状态。这是 Current-state impact 记录的缺口，而非已批准的实现要求。

## Accessibility contract

- **AR1 — 轨迹语义。** 父级 Breadcrumbs 地标与有序列表拥有聚合的面包屑语义；每个项仍是一个列表项。
- **AR2 — 当前状态。** 当前项的内容所有者暴露 `aria-current="page"`；列表项包装器不重复它。实现缺口：当自定义链接不转发其 ref 时，自动当前回退到 `<li>`（Current-state impact）。
- **AR3 — 原生交互。** 链接使用链接语义，仅操作的项使用原生按钮，菜单项使用 APG Menu Button 关系。
- **AR4 — 菜单名称。** 菜单表面由触发器命名，包括可见项内容是非字符串 React 节点的情况。
- **AR5 — 焦点。** 键盘焦点在链接与菜单/操作按钮上可见。菜单进入、包含、Escape 返回与外部焦点保留遵循 FR5–FR6。
- **AR6 — 分隔符。** 分隔符内容对辅助技术隐藏，同时对有视力的读者保持方向正确。

## Design relationships

| Anatomy or state | Design requirement                                     | Representation authority                               | Hierarchy role    | Component contract |
| ---------------- | ------------------------------------------------------ | ------------------------------------------------------ | ----------------- | ------------------ |
| 项根节点         | 承载当前排版与 `breadcrumb-item` 目标。                | 当前源码与公共文档                                     | Supporting        | FR1、FR9           |
| 链接或操作内容   | 使用原生语义与共享焦点指示器，不引入另一个内容目标。   | 当前源码；`architecture:interaction-modality`          | Supporting        | FR2、AR3、AR5      |
| 当前内容         | 使用已发布的非颜色文本强调，配合当前页语义。           | 当前源码与客观的非颜色传达                             | Prominent         | FR3、AR2           |
| 分隔符           | 对辅助技术保持装饰性，并依上下文 bidi 角色镜像。       | 客观 bidi 行为                                         | Supporting        | FR4、AR6           |
| 菜单触发器       | 在原生焦点所有者上绘制菜单触发器目标。                 | 当前源码与公共文档                                     | Supporting        | FR5、FR9、AR3–AR5  |
| 菜单表面         | 在 Popover 的共享层表面内绘制 `breadcrumb-menu` 细化。 | `component:Popover` 加上当前的 BreadcrumbItem 目标清单 | Prominent         | FR5–FR9            |
| 起始内容         | 渲染调用方内容，而不主张其图形或语义。                 | 调用方内容；组合时使用 `component:Icon`                | Context-dependent | AV2                |

## Family and system relationships

- `component:Breadcrumbs` 提供分隔符与变体。
- `design:bidirectionality` DR4 管辖内置分隔符的镜像。
- `family:navigation-destinations` 拥有原生与自定义链接路径的目标检查与交接。BreadcrumbItem 组合共享链接所有者。
- `family:overlay-dismissal` 拥有最顶层 Escape/平台关闭路由。BreadcrumbItem 通过 Popover 参与。
- `component:Popover` 拥有通用菜单表面托管、焦点包含与滞留焦点返回；BreadcrumbItem 拥有其触发器与细化目标。
- `architecture:component-theming-surface` 拥有目标限定、放置与状态反映。
- `architecture:public-component-api` 与 `spec:AST-002` 拥有已发布 API、优先级、无效状态预防与兼容性审查。

## Verification map

| Contract         | Verification                                                                                                                             | Representative states                                                        | Mutation or failure expectation                                                                                                  | Audit section                                 |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| FR1–FR3, AR1–AR3 | `Breadcrumbs.test.tsx` 分支、test-id 与当前状态套件                                                                                      | 链接、操作、显式当前、省略的最后一项                                         | 某个分支改变了语义元素、丢失当前状态，或移动了公共根契约。                                                                       | `audit:BreadcrumbItem/api-behavior`           |
| FR4, AR6         | `Breadcrumbs.test.tsx` 分隔符、镜像样式类与自定义分隔符测试                                                                              | 内置斜杠、自定义分隔符                                                       | 上下文分隔符未恰好镜像一次，或对 AT 变得可见。                                                                                   | `audit:BreadcrumbItem/rtl`                    |
| FR5–FR8, AR3–AR5 | `Breadcrumbs.test.tsx` 菜单套件                                                                                                          | 字符串与 ReactNode 标签、点击/键盘打开、行、选择、Escape、外部关闭           | 菜单丢失名称/状态、焦点进入错误的所有者，或关闭时抢占有效的外部焦点。                                                            | `audit:BreadcrumbItem/accessibility-behavior` |
| FR9              | `Breadcrumbs.test.tsx` 主题目标测试；`themingTargets.test.ts`                                                                            | 项、菜单触发器、菜单表面；默认/supporting                                    | 某个目标消失、移到不参与绘制的管道，或丢失变体反映。                                                                             | `audit:BreadcrumbItem/theming`                |
| AR1–AR2          | `Breadcrumbs.a11y.test.tsx` 与 `Breadcrumbs.a11y.chromium.spec.ts`                                                                       | 轨迹、显式当前、自动当前、退出                                               | 角色、名称、状态或焦点预期出现回归。                                                                                             | `audit:BreadcrumbItem/accessibility-behavior` |
| FR10             | `Breadcrumbs.test.tsx` 菜单面包屑套件（触摸与鼠标滑动）                                                                                  | 跨项的触摸与鼠标滑动                                                         | 移除该采用会导致滑动测试失败。                                                                                                   | —                                             |
| FR11             | `Breadcrumbs.test.tsx` 移动端抽屉套件：面包屑项链接会关闭抽屉，包括仅按位置成为当前的最后一项；标记为 `isCurrent` 的面包屑项会保持打开。 | TopNav 与 SideNav 抽屉中的链接与按钮面包屑项；当前面包屑项；抽屉外的面包屑项 | 在抽屉中对未修改面包屑项的按压若保持打开、对面包屑项链接的修饰点击若关闭抽屉，或当前面包屑项按压、抽屉外按压若关闭抽屉，均失败。 | —                                             |

从源码读取，尚无聚焦测试：

- FR1：`<li>` 上的项 `ref` 与其他 DOM props。
- FR3：最后一项设置 `isCurrent={false}` 使轨迹没有当前面包屑。
- FR4：内置斜杠在从右到左布局中恰好镜像一次。
- FR5：Enter 与 Space 打开菜单、点击聚焦第一行、Tab 关闭菜单、方向键在两端停住而不循环，以及 typeahead。
- FR7：在 `menu` 旁忽略 `onClick`。
- FR8.
- FR9：链接、按钮与菜单触发器上的共享焦点轮廓。

## Decision log

未记录组件本地决策。

## Open questions

- **OQ1 — 冲突的交互 props。** 已发布的 `menu` + `href` 或 `menu` + `onClick` 组合应保持基于警告的优先级，还是应由兼容计划使其无法表示？（`human-api`）
- **OQ2 — 自动当前的所有权。** 省略的 `isCurrent` 是否应保持为自动检测的当前候选；若是，应由哪个 React 拥有的机制取代渲染后的 DOM 协调？（`human-api`）

## Content boundary

本文件不复述使用方 prop 表、菜单项 API、审计评分、运行证据、截图、实现步骤，以及共享的导航、层、关闭与主题规则。它链接到它们的所有者。
