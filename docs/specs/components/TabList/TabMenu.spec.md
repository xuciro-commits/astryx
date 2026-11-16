---
schema_version: 3
template_version: 7
kind: component
id: component:TabMenu
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-27
owners: [cixzhang]
review_triggers: [public-api, behavior, accessibility]
verified_by:
  [
    packages/core/src/TabList/TabList.test.tsx,
    apps/storybook/stories/TabList.stories.tsx,
    apps/storybook/rtl-audit/targets.json,
  ]
modules: []
families: [family:overlay-dismissal, family:action-groups]
design_specs: [design:reduced-motion]
architecture:
  [
    architecture:component-style-authoring,
    architecture:interaction-modality,
    architecture:public-component-api,
    architecture:component-theming-surface,
  ]
contributing: []
system_specs: []
---

# TabMenu component contract

## Contract at a glance

| 区域          | 契约                                                                                                                                                                 |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | `TabMenu`，接受 `label` 和 `options`（`{value, label, icon?}`）；标记 `tab-menu`、`tab-menu-dropdown` 和 `tab-menu-item`，当某个选项被选中时还标记 `tab-indicator`。 |
| 行为          | 一个 TabList 条目，把若干个标签值归组到一个菜单按钮之后。其标签显示所选选项，否则显示 `label`；选择某个选项即选中该值并关闭菜单。                                    |
| 最终用户影响  | 用户从一个条目即可访问溢出的标签值，并看到其中哪个被选中；键盘用户获得 APG 菜单按钮行为，菜单内部只有一个 Tab 停靠点。                                               |
| 构建者影响    | 无。                                                                                                                                                                 |
| 兼容性/就绪度 | 记录已发布的行为；无公共变更。六处实现缺口（见“Current-state impact”）。                                                                                             |
| 审查检查      | 否决缺少 `menuitemradio` 和 `aria-checked` 的选项，否决打开的菜单中存在多个 Tab 停靠点，或否决关闭后让焦点滞留的菜单。                                               |
| 管辖规则      | `component:TabList`（条带边缘几何）；`family:overlay-dismissal`；`architecture:interaction-modality`。                                                               |

本表是审查投影；以下正文具有权威性。

## Intent

TabMenu 是一个 TabList 条目，把若干个标签值收纳在一个菜单中。它拥有自己的触发器、选项菜单，以及选择某个选项时如何选中一个值。使用方用法见 `TabMenu.doc.mjs`。

## Compatibility and migration

- 已发布的默认行为保持不变：`yes`
- 兼容性类别：记录已发布的行为；无公共变更
- 受控/非受控行为：选择由 TabList 的 `value` 决定；菜单的打开状态是内部的
- 迁移决策：无

使用方迁移说明属于使用方文档和发布说明的内容。

## Current-state impact

- **隐藏的标签孪生体预留了选中宽度。** 触发器的可见标签还渲染了第二份 `aria-hidden` 副本，用于预留该标签在选中字重下的宽度。`architecture:component-style-authoring` INV7 要求内容只渲染一次，并由 CSS 确定尺寸，或在显示它的元素上预留空间。
- **悬停装饰是一个元素。** 触发器的悬停填充是一个 `aria-hidden` 的 span，而不是伪元素；`architecture:component-style-authoring` INV7 要求不带语义角色的装饰由伪元素承载。
- **打开的菜单重复了标签。** 菜单的标题重复了 `label`，而未选中任何选项时触发器也会显示这段文本，因此菜单打开期间该文本会渲染两次。`architecture:component-style-authoring` INV7 要求内容只渲染一次。
- **减少动态效果下的动效。** 即使请求了减少动态效果，chevron 的转向以及触发器和条目的颜色与填充过渡仍然会动画；`design:reduced-motion` DR1–DR3 不允许位移，并且对精细指针不允许任何动画属性。
- **`tab-menu` 和 `tab-menu-item` 目标不反映任何状态。** 触发器采用选中样式，被选中的选项采用 medium 字重，但这两个目标都不反映状态。`architecture:component-theming-surface` INV6 要求改变绘制的状态反映在所属目标上。
- **选中会挂载额外元素。** 触发器仅在有选项被选中时才挂载它的 `tab-indicator`，选项仅在选中时才挂载它的勾选标记。`architecture:component-style-authoring` INV7 要求状态通过现有元素上的属性、类和样式表达，绝不通过额外元素表达。

## Ownership boundary

**拥有**

- 触发器、它的标签和 Tab 停靠点、选项菜单，以及从菜单中进行的选择（FR1–FR6）。

**不拥有 / 非目标**

- 选中的值、尺寸和条带键盘移动——由 TabList 拥有，此处未受契约；条带边缘几何——由 `component:TabList` 拥有。
- Popover 托管和轻量关闭——由共享 popover 与层运行时拥有；Escape 顺序——由 `family:overlay-dismissal` 拥有。

## Public concepts

除使用方 props 之外，没有组件本地概念。

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                            | 依据           |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| FR1 | 触发器是一个 `<button>`，带有 `aria-haspopup="menu"`、`aria-expanded` 和指定菜单名称的 `aria-controls`；它的 props 类型省略了 `role`，调用方 props 无法设置它的 tab index 或 popup 属性。它携带 `tab-menu`，并转发 `ref` 和其他 DOM props。                                                                                                       | 当前源码与测试 |
| FR2 | 触发器显示值被选中的那个选项的标签，否则显示 `label`，并预留 semibold 宽度；当某个选项被选中时，它使用选中样式并显示选中指示器。它像 Tab 一样参与条带的单一 Tab 停靠点（`component:Tab` FR3）：当它的某个选项被选中时，它起始即为该停靠点，停靠点随方向键焦点移动；当条带中没有任何选中项，或选中的条目被禁用时，停靠点从何处起始，此处未受契约。 | 当前源码与测试 |
| FR3 | 点击触发器会在其下方切换一个非模态 popover，并在打开时将焦点移到第一个选项；调用方的 `onClick` 在切换之后运行。                                                                                                                                                                                                                                   | 当前源码与测试 |
| FR4 | 菜单是 `role="menu"`，由 `label` 命名，携带 `tab-menu-dropdown`，其中有一个重复 `label` 的呈现性标题，然后每个选项对应一个 `role="menuitemradio"`，带有表示所选值的 `aria-checked`、一个可选图标，以及选中时的勾选标记。                                                                                                                          | 当前源码与测试 |
| FR5 | 在菜单内部，一个选项是 Tab 停靠点，ArrowUp、ArrowDown、Home 和 End 移动它；ArrowLeft 和 ArrowRight 留给条带；在某个选项上按 Enter、Space 或点击，会通过 TabList 选中它的值并关闭菜单；Escape 和 Tab 关闭菜单。关闭后焦点返回触发器。                                                                                                              | 当前源码与测试 |
| FR6 | 触发器和选项绘制共享的焦点轮廓。                                                                                                                                                                                                                                                                                                                  | 当前源码       |
| FR7 | 在打开的菜单中，一次按压（手指、笔或鼠标）落在某个选项上并滑过各选项时，会通过该选项自身的激活，在抬起处一次性选中它，高亮跟随指针；在外部抬起则不执行任何操作，而在外部释放鼠标会关闭菜单。菜单为此采用 `module:DropdownMenu/useMenuPress`（`family:action-groups` FR1–FR5；`module:DropdownMenu/useMenuPress` DEC-7）。键盘和辅助技术行为不变。 | 当前源码与测试 |

### Allowed variation

- **AV1 — 选项。** 任意数量的选项，每个可带一个可选图标。

### Representative states

| 状态           | 必需的不变式                                                                                                                                      | 允许的变化 |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| 未选中任何选项 | 触发器显示 `label`；当另一个启用的条目被选中时，它不作为起始停靠点（Tab FR3）；在没有任何选中项，或选中的条目被禁用时，停靠点从何处起始未受契约。 | —          |
| 选中了选项     | 触发器显示该选项的标签和指示器。                                                                                                                  | —          |
| 打开           | 有名称的菜单；第一个选项获得焦点；一个 Tab 停靠点。                                                                                               | —          |

### Transformation and precedence order

- **ORD1 — 触发器标签。** 先取选中选项的标签，再取 `label`。

### Performance and resources

- 无资源规则。

## Accessibility contract

- **AR1 — 菜单按钮。** FR1 和 FR5 遵循 APG 菜单按钮模式。
- **AR2 — 单选选项。** 选项是带 `aria-checked` 的 `menuitemradio`。

## Design relationships

| 结构或状态 | 设计要求                                   | 表示权威           | 层级角色 | 组件契约 |
| ---------- | ------------------------------------------ | ------------------ | -------- | -------- |
| 触发器     | 带 chevron 和指示器的、样式为 Tab 的按钮。 | 当前源码与公共文档 | 显著     | FR2      |
| 菜单       | 标题，然后是选中时带勾选标记的选项。       | 当前源码           | 辅助     | FR4      |

`TabMenu.doc.mjs` 不声明自己的结构，因此未记录结构-主题映射。

## Family and system relationships

- TabList 提供值、尺寸和条带；`component:TabList` 对其边缘几何订立契约。
- `family:overlay-dismissal` 拥有共享的 Escape 顺序。

## Verification map

| 契约     | 验证                                                                                          | 代表性状态                                        | 变更或失败预期                                 | 审计章节                      |
| -------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------- | ----------------------------- |
| FR1, FR3 | `TabList.test.tsx` 的 TabMenu 与宿主属性测试                                                  | 关闭、打开                                        | 丢失 popup 属性则失败。                        | `audit:TabMenu/accessibility` |
| FR2, FR4 | `TabList.test.tsx` 的 TabMenu 标签、标题和 menuitemradio 测试                                 | 选中与未选中                                      | 标签错误或缺少 `aria-checked` 则失败。         | `audit:TabMenu/behavior`      |
| FR5      | `TabList.test.tsx` 的 TabMenu 键盘导航测试                                                    | ArrowUp、ArrowDown、Home、End、Tab、Escape、Enter | 出现额外的 Tab 停靠点或菜单保持打开则失败。    | `audit:TabMenu/accessibility` |
| FR7      | `TabList.test.tsx` 的 TabMenu 测试套件（触摸与鼠标滑动）                                      | 触摸和鼠标滑过选项                                | 移除该采用会令滑动测试失败。                   | —                             |
| RTL 关系 | RTL 审计精选的 D2 目标（`apps/storybook/rtl-audit/targets.json`），位于 `TabList / With menu` | 菜单 Tab 标签及其 chevron；LTR 和 RTL             | 标签不位于其 chevron 的行内起始侧则未通过 D2。 | `audit:TabMenu/i18n-rtl`      |

从源码读取，尚无聚焦测试：

- FR1：`tab-menu` 目标、转发的 `ref`，以及自有属性优先于调用方 props。
- FR2：预留的 semibold 宽度、选中样式和指示器，以及触发器在条带 Tab 停靠点中的角色。
- FR3：popover 的放置、打开时焦点移到第一个选项，以及调用方的 `onClick` 在切换之后运行。
- FR4：`tab-menu-dropdown` 和 `tab-menu-item` 目标、选项图标，以及勾选标记。
- FR3：第二次点击关闭菜单。
- FR5：Space 选中、选中时菜单关闭、ArrowLeft 和 ArrowRight 留给条带，以及关闭时焦点返回触发器。
- FR6。

## Decision log

未记录组件本地决策。

## Open questions

无。

## Content boundary

本文件不重复使用方 props 表、示例或 TabList 条带行为。它链接到它们的拥有者。
