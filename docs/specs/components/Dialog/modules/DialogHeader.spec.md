---
schema_version: 3
template_version: 1
kind: module
id: module:Dialog/DialogHeader
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-09-23
owners: [cixzhang, imdreamrunner]
review_triggers: [theming, layout, public-api]
verified_by:
  [
    packages/core/src/Dialog/DialogHeader.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    packages/cli/foundation/discovery/theming-targets.test.mjs,
    scripts/check-knowledge.mjs,
    apps/storybook/rtl-audit/targets.json,
  ]
parent_component: component:Dialog
references:
  [architecture:component-theming-surface, architecture:container-padding]
---

# DialogHeader module contract

## Intent

`DialogHeader` 呈现 Dialog 的标题区域及其可选的关闭控件。本记录拥有稳定的标题行、起始内容、标题块、结束内容与关闭图标结构，拥有它们的公开主题化目标，以及施加于现有结束内容槽位的固定补偿。

## Compatibility and migration

- 已发布默认值保持：`yes`
- 兼容类别：两个新增式主题化目标与一个新增式 prop；省略时布局、绘制、交互、无障碍与主题化保持不变
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 排列标题内容与控件的标题行。
- 用于可选前置内容的起始内容包装容器。
- 将标题与可选副标题分组的标题块。
- 将可选尾部内容与关闭操作分组的现有结束内容包装容器。
- 由 medium 尺寸关闭操作的透明内缩推导出的固定结束槽位补偿。
- 为可选关闭操作渲染的关闭图标。
- `dialog-header`、`dialog-header-start-content`、`dialog-header-title-block`、`dialog-header-end-content` 与 `dialog-header-close-icon` 目标。

**不拥有 / 非目标**

- Dialog 模态性、关闭策略或焦点生命周期 —— 由 `component:Dialog` 及其关联的系统记录拥有。
- 本模块之外的通用 Button 或 Icon 呈现 —— 由那些组件拥有。
- List 风格的继承式 container-padding 补偿、调用方提供的 margin 值，或通用对齐原语。

## Public API and concepts

本契约保留三个现有主题化表面，新增两个内容槽位目标，并新增一个面向槽位的补偿覆盖项。

| Concept                      | Closed values or states              | Meaning                                        | Default                    | Owner                        | Stability |
| ---------------------------- | ------------------------------------ | ---------------------------------------------- | -------------------------- | ---------------------------- | --------- |
| 标题行目标                   | present                              | 为排列标题内容与控件的行设置样式               | 现有的行视觉效果           | `module:Dialog/DialogHeader` | stable    |
| 起始内容目标                 | 当起始内容渲染时为 present           | 为可选前置内容的包装容器设置样式               | 现有起始内容布局           | `module:Dialog/DialogHeader` | stable    |
| 标题块目标                   | present                              | 为标题/副标题分组元素设置样式                  | 现有标题堆叠视觉效果       | `module:Dialog/DialogHeader` | stable    |
| 结束内容目标                 | 当结束内容或关闭操作渲染时为 present | 为将尾部内容与关闭操作分组的包装容器设置样式   | 现有结束内容布局           | `module:Dialog/DialogHeader` | stable    |
| 关闭图标目标                 | 当关闭操作渲染时为 present           | 为关闭字形本身设置样式                         | 现有 medium Icon 视觉效果  | `module:Dialog/DialogHeader` | stable    |
| `endContentEdgeCompensation` | `inline`、`block`、`all`             | 选择现有结束内容包装容器的哪些轴获得其固定补偿 | 省略；保留自动关闭操作补偿 | `module:Dialog/DialogHeader` | stable    |

对于这个面向槽位的 prop，`inline` 表示该槽位的逻辑 inline-end 边缘，`block` 表示两个 block 边缘，`all` 则将两者合并。

## Behavioral contract

| ID   | Invariant                                                                                                                                                                     | Basis                                        | Review state |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ------------ |
| FR1  | 标题行 MUST 在施加其行布局与 gap 的元素上携带 `dialog-header`。                                                                                                               | 当前实现与所有者决策                         | settled      |
| FR2  | 标题块 MUST 在施加其标题/副标题布局与 gap 的元素上携带 `dialog-header-title-block`。                                                                                          | 当前实现与所有者决策                         | settled      |
| FR3  | 渲染出的关闭 Icon MUST 在施加图标呈现的字形元素上携带 `dialog-header-close-icon`。                                                                                            | 当前实现与所有者决策                         | settled      |
| FR4  | 省略 `onOpenChange` MUST 继续省略关闭操作及其可选的关闭图标结构。                                                                                                             | 已发布行为                                   | settled      |
| FR5  | 现有结束包装容器 MUST 继续将可选 `endContent` 与可选关闭操作分组；本次变更 MUST NOT 增加另一个包装容器。                                                                      | 当前实现                                     | settled      |
| FR6  | 省略 `endContentEdgeCompensation` 时，渲染关闭操作 MUST 保留已发布的固定负 block 内缩与逻辑 inline-end 内缩，无论 `endContent` 是否存在。没有关闭操作时，不施加任何自动补偿。 | 已发布行为与所有者决策                       | settled      |
| FR7  | 显式的 `inline` MUST 只施加逻辑 inline-end 补偿；`block` MUST 只施加两个 block 边缘；`all` MUST 同时施加两者。显式值覆盖自动的关闭操作选择。                                  | `module:Dialog/DialogHeader/DEC-2`           | settled      |
| FR8  | 补偿 MUST 使用逻辑 inline 属性，保留标题、槽位与关闭操作的语义和命中目标，且不暴露任何由调用方控制的 margin 量值。                                                            | `architecture:container-padding`; 所有者决策 | settled      |
| FR9  | 只要可选起始内容渲染，前置内容包装容器 MUST 携带 `dialog-header-start-content`。                                                                                              | `module:Dialog/DialogHeader/DEC-3`           | settled      |
| FR10 | 只要可选结束内容或关闭操作渲染，现有尾部内容包装容器 MUST 携带 `dialog-header-end-content`。                                                                                  | `module:Dialog/DialogHeader/DEC-3`           | settled      |

### Transformation and precedence order

1. 若 `endContentEdgeCompensation` 存在，其封闭值选择获得补偿的轴。
2. 否则，渲染的关闭操作选择 `all`；省略关闭操作则不选择任何补偿。
3. 在正常的主题 CSS 通过共享主题化管道解析之前，模块将每个主题化目标施加到其所属元素上。

### Performance and resources

- 新增式封闭值分支与类选择不引入任何监听器、观察器、定时器、测量或异步资源。

## Accessibility contract

- 补偿与主题化目标 MUST NOT 改变标题的角色、焦点行为、对话框命名、关闭按钮的无障碍名称与操作，或任何槽位子元素的命中目标。

## Design relationships

| Anatomy or state | Design requirement                                                             | Representation authority | Module contract |
| ---------------- | ------------------------------------------------------------------------------ | ------------------------ | --------------- |
| 标题行           | 拥有标题内容与控件之间的排列和间距。                                           | 本模块                   | FR1             |
| 起始内容         | 拥有可选起始内容的前置包装容器。                                               | 本模块                   | FR9             |
| 标题块           | 拥有标题/副标题分组与间距。                                                    | 本模块                   | FR2             |
| 结束内容         | 拥有包含可选结束内容与关闭操作的现有尾部包装容器，包括其固定的面向槽位的补偿。 | 本模块                   | FR4–FR8, FR10   |
| 关闭图标         | 拥有 Button 所属操作内关闭字形的视觉盒。                                       | 本模块与 Icon 渲染       | FR3, FR4        |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Header row": {"target": "dialog-header"},
  "Start content": {"target": "dialog-header-start-content"},
  "Title block": {"target": "dialog-header-title-block"},
  "End content": {"target": "dialog-header-end-content"},
  "Close icon": {"target": "dialog-header-close-icon"}
}
```

## Parent and system relationships

- `component:Dialog` 拥有模态行为与聚合的 Dialog 契约。
- `component:Layout` 拥有五个模块拥有的内部部件之外的组合 LayoutHeader 区域。
- `component:Button` 拥有关闭操作的控件行为、命中目标与外部呈现。
- `component:Icon` 渲染字形；本模块保证为关闭图标在 DialogHeader 特定的视觉契约中提供独立目标。
- `architecture:component-theming-surface` 拥有目标资格、结构映射，以及每个目标都落在其绘制元素上的要求。
- `architecture:container-padding` 定义了保留内缩的边缘补偿意图，并将这个面向槽位的投影与 List 风格的继承内缩自补偿和全出血区分开。

## Verification map

| Contract          | Verification                                                                                                       | Representative states                                     | Mutation or failure expectation                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------- | ----------------------------------------------------- |
| FR1–FR3, FR9–FR10 | 目标测试、目标清单、生成的探测主题与源码检查                                                                       | 仅标题、标题/副标题、起始内容、结束内容、关闭操作         | 某个目标缺失、未记录、重复，或偏离其所属绘制元素。    |
| FR4–FR5           | 现有内容与关闭按钮测试                                                                                             | 仅结束内容；仅关闭；两者                                  | 关闭操作或槽位内容消失、重排，或增加另一个包装容器。  |
| FR6–FR7           | 针对结束槽位类选择的聚焦断言                                                                                       | 仅关闭；仅结束内容；两者；显式 `inline`、`block` 与 `all` | 省略的 prop 改变已发布几何，或显式值选择了错误的轴。  |
| FR8               | 源码检查、RTL CI、交互测试与聚焦的真实浏览器几何                                                                   | LTR 与 RTL；自定义结束控件；关闭操作                      | 物理 margin、调用方控制的量值或命中目标变更进入实现。 |
| 主题化结构映射    | `scripts/check-knowledge.mjs`                                                                                      | 全部五个模块结构条目与目标                                | 结构、文档、运行时目标与模块映射出现漂移。            |
| RTL 关系          | 在 `Dialog / Default`（对话框已打开）上运行 RTL audit curated D2 target（`apps/storybook/rtl-audit/targets.json`） | 标题块与关闭控件；LTR 与 RTL                              | 标题不在关闭控件的 inline 起始处则无法通过 D2。       |

## Decision log

### DEC-1 — Header targets follow stable anatomy and visual ownership

**Reference:** `module:Dialog/DialogHeader/DEC-1`

**Decider:** cixzhang, 2026-09-14

每个公开目标代表已记录的结构，并施加到拥有对应视觉效果的元素上。标题行、标题块与关闭图标满足该准入规则，并被批准为新增式目标。

### DEC-2 — End-content compensation is slot-targeted and explicit

**Reference:** `module:Dialog/DialogHeader/DEC-2`

**Decider:** cixzhang, 2026-09-22

只要关闭操作渲染，DialogHeader 就保留其已发布的自动补偿。`endContentEdgeCompensation` 面向现有结束内容槽位，并选择 `inline`、`block` 或 `all`，而不暴露 margin 量值。这是保留内缩边缘补偿意图的一个面向槽位的投影；它不会让 DialogHeader 成为 List 风格继承内边距的使用方。

### DEC-3 — Content-slot wrappers are approved target destinations

**Reference:** `module:Dialog/DialogHeader/DEC-3`

**Decider:** cixzhang, 2026-09-23

`startContent` 与 `endContent` 的现有包装容器被批准为稳定的可见结构。它们的目标位置是 `dialog-header-start-content` 与 `dialog-header-end-content`；实现不得增加包装容器，并且必须保留默认布局、绘制、交互、无障碍与公开 prop。结束内容的名称遵循公开 prop，即使该槽位还包含可选关闭操作。

## Open questions

- `endContentEdgeCompensation` 的 `inline`、`block` 与 `all` 轴值如何映射到 `endContentEdge` 的处理值（`architecture:container-padding`），以及旧 prop 何时进入其兼容窗口？目前该 prop 按已发布状态继续受支持。

## Content boundary

本记录不重复使用方签名/示例、父 Dialog 行为、实现步骤或共享主题化规则。它链接到它们的规范所有者。
