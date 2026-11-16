---
schema_version: 3
template_version: 7
kind: component
id: component:MoreMenu
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-26
owners: [cixzhang]
review_triggers: [theming]
verified_by:
  [
    packages/core/src/MoreMenu/MoreMenu.test.tsx,
    packages/core/src/DropdownMenu/__tests__/MenuButton.a11y.test.tsx,
    packages/core/src/DropdownMenu/__tests__/MenuButton.a11y.chromium.spec.ts,
    apps/storybook/stories/MoreMenu.stories.tsx,
    packages/core/src/DropdownMenu/DropdownMenu.test.tsx,
    packages/core/src/Button/Button.test.tsx,
    packages/core/src/Icon/Icon.test.tsx,
    packages/core/src/List/List.test.tsx,
    scripts/check-knowledge.mjs,
    apps/storybook/rtl-audit/targets.json,
  ]
modules: []
families: [family:overlay-dismissal]
design_specs: []
architecture:
  [
    architecture:component-theming-surface,
    architecture:icon-resolution-and-component-slots,
    architecture:interaction-modality,
    architecture:layer-runtime,
  ]
contributing: []
system_specs: [spec:AST-020]
---

# MoreMenu component contract

## Contract at a glance

| 领域            | 契约                                                                                                                                                                                                                                      |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约        | `MoreMenu`，接受 `items`、`label`（默认 “More options”）、`variant`（`ghost`）、`size`（周边尺寸上下文，否则 `md`）、`icon`、`isDisabled`、`placement`、`alignment`、`presentation`、`isMenuOpen` 和 `onOpenChange`；目标为 `more-menu`。 |
| 行为            | 一个仅显示图标的溢出 Button，带有 tooltip，可打开由 `items` 组成的 DropdownMenu；MoreMenu 将打开状态、placement、alignment 和 presentation 转发给 DropdownMenu，自身不添加任何菜单运行时。                                                |
| 终端用户影响    | 用户在一个名为 “More options” 的按钮背后找到次要操作；键盘用户将其作为 APG 菜单按钮打开。                                                                                                                                                 |
| 构建者影响      | 无。                                                                                                                                                                                                                                      |
| 兼容性/就绪状态 | 记录已发布的行为；无公共变更。存在两处实现缺口（见 Current-state impact）。                                                                                                                                                               |
| 审查检查        | 拒绝将 `more-menu` 移到触发器上、拒绝并行的菜单运行时，或拒绝丢失 name、`aria-haspopup`、`aria-expanded` 或 `aria-controls` 的触发器。                                                                                                    |
| 管辖规则        | `spec:AST-020`（模式绑定）；`architecture:component-theming-surface`；`architecture:layer-runtime`；`family:overlay-dismissal`。                                                                                                          |

本表是审查投影；下文正文具有权威性。

## Intent

MoreMenu 提供一个可见的、仅显示图标的溢出触发器，并将其操作呈现委托给 DropdownMenu。它拥有触发器的默认值、组合面板上的 `more-menu` 目标，以及转发给 DropdownMenu 的内容。使用方用法见 `MoreMenu.doc.mjs`。

## Compatibility and migration

- 已发布的默认行为保持不变：`yes`
- 兼容性类别：记录已发布行为；运行时、DOM、样式、目标与公共 API 均保持不变
- 受控/非受控行为：`isMenuOpen` 和 `onOpenChange` 原样传递给 DropdownMenu
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **bottom-sheet 触发器会丢失 ref。** 当 `presentation="bottom-sheet"`，或在紧凑触屏上使用 `presentation="adaptive"` 时，DropdownMenu 会替换 MoreMenu 传给触发器的 `ref`，因此调用方提供的 ref 保持为空。`architecture:public-component-api` INV8 要求 ref 到达契约所承诺的元素。
- **方向键打开行是建议性的。** 共享的 menu-button 绑定将 AR1 的 ArrowDown 与 ArrowUp 打开行作为建议项执行，因此键盘打开时若未落在第一行或最后一行，不会使任一绑定通道失败。`spec:AST-020` FR9 要求被采用的预期必须是强制性的。

## Ownership boundary

**拥有**

- 溢出菜单的组合，及其可见的仅显示图标触发器的默认值。
- Menu 表面当前的 `more-menu` 目标，它是组合后的 DropdownMenu 面板上的第二个类名。

**不拥有 / 非目标**

- 触发器按钮的呈现 —— 委托给 `component:Button`。
- 默认语义触发器图形的解析 —— 委托给 Icon 注册表；当前图形直接在 Button 内部渲染，不带 Icon 的 `icon` 目标。任意由调用方渲染的触发器内容仍归调用方所有。
- 菜单面板生命周期与呈现切换 —— 由 DropdownMenu 拥有，本文不做契约。
- 锚定的操作行、分区、分隔线、可选指示项和嵌套浮出 —— 由 DropdownMenu 拥有，本文不做契约。
- BottomSheet 操作行与列表 —— 通过 DropdownMenu 委托给 `component:List`；触摸框架仍由 `component:BottomSheet` 拥有。
- 共享层生命周期或关闭策略。

## Public concepts

无组件本地概念。操作数据与呈现取值属于 DropdownMenu；使用方 props 记录在 `MoreMenu.doc.mjs` 中。

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                           | 依据                 |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| FR1 | 每次渲染都包含一个仅显示图标的 Trigger 按钮。锚定呈现还会渲染一个由 DropdownMenu 拥有的 Menu 表面；bottom-sheet 呈现仅在面板打开期间渲染其 Menu 表面。锚定呈现使用 Pointer 操作行；BottomSheet 呈现使用 Touch 操作行。默认触发器图标是活动注册表中的 `moreHorizontal` 图形；`icon` 可将其替换为任意 React 内容。 | 当前源码、文档与测试 |
| FR2 | `more-menu` 目标作为附加类名应用于组合后的 DropdownMenu 面板，并出现在任何调用方 `className` 之前。它不会应用于 Trigger 按钮。                                                                                                                                                                                   | 当前源码、文档与测试 |
| FR3 | Button 拥有 Trigger 按钮，Icon 注册表拥有默认语义触发器图形的解析。DropdownMenu 拥有 Pointer 操作行，包括键盘如何到达被禁用的行（DropdownMenu FR17）；List 拥有通过 DropdownMenu 的 BottomSheet 路径渲染的 Touch 操作行。                                                                                        | 当前源码与所有者文档 |
| FR4 | MoreMenu 将打开状态、placement、alignment、presentation、`xstyle`、`style` 和 `data-testid` 转发给 DropdownMenu，不添加并行菜单运行时，也不显示 chevron。其默认位置与 DropdownMenu 一致。宿主 `data-*` 属性到达触发按钮，而非菜单；按钮的 name、`id` 和披露属性仍由组件拥有。                                    | 当前源码与测试       |
| FR5 | 触发器的名称由 `label` 提供（否则使用翻译后的 `@astryx.moreMenu.label`，即 “More options”），该名称显示为其 tooltip，使用 `variant`（默认 `ghost`）与 `size`（默认取自周边尺寸上下文，否则 `md`），在锚定呈现中将 `ref` 转发给触发器，并遵循 `isDisabled`：被禁用的触发器不会因任何按键或按压而打开。            | 当前源码与测试       |

### Allowed variation

- **AV1 — 触发器图标。** 默认的语义三点图标可以被图标组件或任意 React 内容替换，而不会把 MoreMenu 目标移到触发器上。
- **AV2 — 呈现。** DropdownMenu 可以决定当前采用锚定还是 BottomSheet 呈现，而 MoreMenu 保持相同的触发器与 Menu 表面所有权。
- **AV3 — 内部。** 操作行、分区、分隔线、图标、可选指示项和嵌套操作可以根据 DropdownMenu 当前的数据契约而变化。

### Representative states

| 状态         | 必需的不变式                                                               | 允许的变化                                          |
| ------------ | -------------------------------------------------------------------------- | --------------------------------------------------- |
| 默认溢出菜单 | 触发按钮使用由 Icon 解析的默认字形，Menu 表面带有 `more-menu`。            | 按钮的 size、variant、placement 与 alignment 可变。 |
| 任意图标内容 | 触发按钮仍归 Button 所有，而调用方内容绕过 Icon 所有权。                   | 调用方拥有所渲染的内容。                            |
| Pointer 呈现 | DropdownMenu 拥有锚定的 Menu 内部与 Pointer 操作行。                       | 行、分区、分隔线与嵌套浮出可变。                    |
| Touch 呈现   | DropdownMenu 拥有由 BottomSheet 支撑的 Menu 内部；List 拥有 Touch 操作行。 | Touch 行与下钻深度可变。                            |

### Transformation and precedence order

- **ORD1 — 触发器图标。** `icon`，然后是注册表中的 `moreHorizontal`。
- **ORD2 — 尺寸。** `size`，然后是周边尺寸上下文，然后是 `md`。

### Performance and resources

- 无资源规则；MoreMenu 自身不添加任何监听器或测量。

## Accessibility contract

- **AR1 — 锚定触发器是 Menu Button。** 在锚定的指针呈现中，MoreMenu 的仅显示图标触发器满足 APG Menu Button 模式的必需部分：`button` 角色、以自身 label 作为名称、`aria-haspopup="menu"`、`aria-expanded`、`aria-controls`，以及按 Enter 或 Space 打开并将焦点置于第一个启用的行。ArrowDown 在第一个启用行打开、ArrowUp 在最后一个启用行打开超出了该模式的必需集合，属于具名例外（`spec:AST-020` FR15），因已发布而保留。指针打开会使菜单容器获得焦点，随后第一次 ArrowDown 移动到第一行。在 bottom-sheet 呈现中，触发器打开对话框并声明 `aria-haspopup="dialog"`，不在本模式范围内。

## Design relationships

| 解剖或状态               | 设计要求                                                           | 表征权威           | 层级角色     | 组件契约      |
| ------------------------ | ------------------------------------------------------------------ | ------------------ | ------------ | ------------- |
| 触发按钮                 | 为次要操作提供可见、可发现的入口点。                               | `component:Button` | 支撑性       | FR1, FR3      |
| 由 Icon 解析的触发器图标 | 从活动的 Icon 注册表绘制语义三点图形。                             | Icon 注册表        | 支撑性       | FR1, FR3      |
| 由调用方渲染的触发器内容 | 呈现通过 icon 覆盖传入的任意调用方内容。                           | 调用方提供的内容   | 视上下文而定 | FR1, FR3      |
| Menu 表面                | 将 MoreMenu 的目标添加到组合后的 DropdownMenu 面板，而不是触发器。 | 当前源码与公共文档 | 突出         | FR1, FR2      |
| Pointer 操作行           | 在锚定呈现中呈现操作或嵌套浮出触发器。                             | DropdownMenu       | 突出         | FR1, FR3, FR4 |
| Touch 操作行             | 在触摸呈现中通过 ListItem 呈现操作或下钻入口。                     | `component:List`   | 突出         | FR1, FR3, FR4 |

Menu 表面就是 DropdownMenu 面板本身。它同时带有 `astryx-more-menu` 和 DropdownMenu 自己的面板目标；本地类名不是包装器，也不会重定向触发器。DropdownMenu 仍然是呈现运行时与锚定内部的所有者。其触摸路径将操作行委托给 List，而不是把 pointer-row 目标扩展到 BottomSheet 呈现中。

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Trigger button": {
    "delegatesTo": {"owner": "component:Button", "target": "button"}
  },
  "Icon-resolved trigger icon": {
    "none": {
      "reason": "unsettled: The current useIcon artwork renders directly inside Button; whether it should carry Icon's icon target needs an owner decision."
    }
  },
  "Caller-rendered trigger content": {
    "none": {
      "reason": "intentional: Arbitrary React icon content is caller-owned and receives no MoreMenu target."
    }
  },
  "Menu surface": {"target": "more-menu"},
  "Pointer action row": {
    "delegatesTo": {
      "owner": "component:DropdownMenu",
      "target": "dropdown-menu-item"
    }
  },
  "Touch action row": {
    "delegatesTo": {"owner": "component:List", "target": "list-item"}
  }
}
```

## Family and system relationships

- `architecture:component-theming-surface` 拥有解剖资格判定、本地 Menu 表面目标，以及组合委托规则。
- `architecture:icon-resolution-and-component-slots` 拥有活动主题的图标解析。MoreMenu 的默认图形使用该注册表，但目前绕过了 Icon 绘制的 `icon` 目标。
- `architecture:interaction-modality` 拥有通过 DropdownMenu 继承的共享指针、触摸、键盘与自适应呈现边界。
- `architecture:layer-runtime` 拥有当前 DropdownMenu Popover 宿主、原生 light-dismiss 协调，以及 BottomSheet 宿主区分。MoreMenu 不添加并行的层运行时。
- `family:overlay-dismissal` 拥有共享的 Escape 与平台关闭顺序，并通过其组合的 DropdownMenu 根将 MoreMenu 记录为共享所有者；BottomSheet 呈现保留 BottomSheet 已记录的仅本地采用缺口。

## Verification map

| 契约         | 验证                                                                                                                                                                                                                                               | 代表性状态                                                          | 变异或失败预期                                                                                                               | 审计章节                       |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| FR1, FR4     | `MoreMenu.test.tsx` 的渲染、指针、bottom-sheet 与放置套件，以及其 “passes data-* attributes to the trigger button, not the menu” 和 “passes data-* attributes to the bottom-sheet trigger, not the sheet” 用例                                     | 默认、自定义图标、指针、触摸                                        | 替换组合或更改转发行为会使现有的渲染/交互测试失败。                                                                          | `audit:MoreMenu/anatomy`       |
| FR2          | MoreMenu 目标测试、源码检查与主题目标清单                                                                                                                                                                                                          | 关闭状态的触发器与组合后的菜单面板                                  | 将 `more-menu` 移到触发器上或从面板中移除，会使目标证据失败。                                                                | `audit:MoreMenu/theming`       |
| FR3          | MoreMenu、DropdownMenu、Button、Icon 与 List 的源码/所有者测试                                                                                                                                                                                     | 触发器、图标分支、Pointer 行、Touch 行                              | 某个组合部件丢失其所有者目标，或被记录为 MoreMenu 拥有的新后代。                                                             | `audit:MoreMenu/theming`       |
| FR5          | `MoreMenu.test.tsx` 的 label、自定义 label、ref、禁用键以及禁用期间关闭的测试                                                                                                                                                                      | 默认与自定义 label；禁用                                            | 丢失名称，或禁用的触发器仍能打开，均判定失败。                                                                               | `audit:MoreMenu/behavior`      |
| AR1          | `MoreMenu.test.tsx` 的 label、popup 与指针焦点测试；渲染 MoreMenu 状态的 menu-button 模式绑定 `MenuButton.a11y.test.tsx` 与 `MenuButton.a11y.chromium.spec.ts`；共享 Button 触发器路径上的 `DropdownMenu.test.tsx` ArrowDown 与 ArrowUp 触发键测试 | 默认与自定义图标触发器；关闭/打开；Enter、Space、ArrowDown、ArrowUp | 触发器丢失 label、`aria-haspopup="menu"`、`aria-expanded` 或 `aria-controls`，或按 Enter 或 Space 打开后未落在第一个启用的行 | `audit:MoreMenu/accessibility` |
| 层关系       | `MoreMenu.test.tsx`、`DropdownMenu.test.tsx` 与当前层/关闭记录                                                                                                                                                                                     | light dismiss、Escape、指针、触摸                                   | 文档为 MoreMenu 赋予并行运行时，或错误陈述当前的关闭所有者。                                                                 | `audit:MoreMenu/behavior`      |
| 主题解剖映射 | `scripts/check-knowledge.mjs`                                                                                                                                                                                                                      | 规范解剖与当前目标                                                  | 缺失、多余、带前缀、过时或未分类的映射会使仓库校验失败。                                                                     | `audit:MoreMenu/theming`       |
| RTL 关系     | RTL 审计精选的 D4 目标（`apps/storybook/rtl-audit/targets.json`），作用于 `MoreMenu / Default`（菜单已打开）                                                                                                                                       | 打开菜单相对其触发器；LTR 与 RTL                                    | 在 RTL 中菜单未移到触发器镜像侧，则 D4 失败。                                                                                | `audit:MoreMenu/i18n-rtl`      |

从源码读取，尚无聚焦测试：

- FR1：注册表中的 `moreHorizontal` 作为默认触发器图标。
- FR2：`more-menu` 出现在调用方 `className` 之前，以及它不在 Trigger 按钮上。
- FR4：转发 `isMenuOpen`、`onOpenChange`、`xstyle` 与 `style`，以及不显示 chevron。
- FR5：tooltip、`ghost` 默认值、取自周边尺寸上下文的尺寸、`md` 默认值，以及 ref 到达触发按钮。
- AR1：bottom-sheet 呈现中的 `aria-haspopup="dialog"`。

## Decision log

未记录组件本地决策。

## Open questions

- **OQ1 — 默认触发器图形是否应通过 Icon 的公共目标渲染？**（`human-api`）当前的注册表查找保留了语义图形替换，但使绘制的字形处于 `icon` 目标之外。

## Content boundary

本文件不重复使用方 prop 表、DropdownMenu 条目示例、图标解析规则、实现步骤，也不重复共享的模态、层、关闭与主题规则。它链接到其所有者。
