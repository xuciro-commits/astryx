---
schema_version: 3
template_version: 7
kind: component
id: component:CommandPaletteFooter
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-11-01
owners: [cixzhang]
review_triggers: [public-api, behavior, accessibility, theming]
verified_by:
  [
    packages/core/src/CommandPalette/CommandPaletteFooter.test.tsx,
    packages/core/src/CommandPalette/__tests__/CommandPaletteFooter.a11y.chromium.spec.ts,
  ]
modules: []
families: []
design_specs: []
architecture:
  [architecture:component-theming-surface, architecture:public-component-api]
contributing: []
system_specs: []
---

# CommandPaletteFooter component contract

## Contract at a glance

| Area          | Contract                                                                                                 |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| 公共契约      | `CommandPaletteFooter`，接受可选的 `children`、`ref`、`xstyle`、`className`、`style` 与 root DOM props。 |
| 行为          | 一行键盘指引 footer：默认显示导航、选择与关闭快捷键，并配有已翻译的标签；`children` 会替换它们。         |
| 最终用户影响  | 用户能看到哪些键可以在面板中移动、执行与关闭。                                                           |
| 构建者影响    | 无。                                                                                                     |
| 兼容性/就绪度 | 记录已发布的行为；无公共变更。                                                                           |
| 审查检查      | 拒绝自身带有 role 或 name 的 footer、丢失的默认快捷键，或无法换行的指引。                                |
| 治理规则      | `component:Kbd`；`architecture:public-component-api`；`architecture:component-theming-surface`。         |

本表是审查投影；下文正文具有权威性。

## Intent

CommandPaletteFooter 是 CommandPalette 底部的指引行。使用方的用法见 `CommandPaletteFooter.doc.mjs`。

## Compatibility and migration

- 已发布的默认值保留：`yes`
- 兼容性类别：记录已发布的行为；无公共变更
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- footer 的 root、其布局、辅助文本样式，以及 `command-palette-footer` 目标（FR1、FR3）。
- 默认提示及其被 `children` 替换的行为（FR2）。
- Root ref、DOM props 与样式（FR4）。

**不拥有 / 非目标**

- 绘制每个快捷键——由 `component:Kbd` 拥有。
- 提示所描述的键盘行为——由 `component:CommandPalette` 拥有。

## Public concepts

除使用方 props 外，没有组件本地概念。

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                      | Basis          |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| FR1 | root 是一行可换行的辅助文本，采用次要颜色，自身没有 role 或 name。                                                                                             | 当前源码与测试 |
| FR2 | 未提供 `children` 时，root 按顺序显示三条提示：Up 与 Down 配已翻译的导航标签、Enter 配选择、Escape 配关闭，每个快捷键都是一个 `Kbd`。`children` 替换全部三条。 | 当前源码与测试 |
| FR3 | root 携带 `command-palette-footer` 目标。                                                                                                                      | 当前源码与测试 |
| FR4 | `ref`、DOM props、`className`、`style` 与 `xstyle` 都会到达 root，调用方的 class 排在生成的 class 之后。                                                       | 当前源码与测试 |

### Allowed variation

- **AV1 — 指引。** 调用方可以替换默认提示。
- **AV2 — 翻译。** 标签文本跟随当前生效的语言区域。

### Representative states

| State  | Required invariant               | Allowed variation |
| ------ | -------------------------------- | ----------------- |
| 默认   | 按顺序显示导航、选择与关闭提示。 | 语言区域。        |
| 自定义 | `children` 替换默认提示。        | 内容。            |
| 窄界面 | 提示换行到更多行。               | 行数。            |

### Transformation and precedence order

- **ORD1 — 内容。** 提供 `children` 时使用它，否则使用默认提示。

### Performance and resources

- 无资源规则。

## Accessibility contract

- **AR1 — 不拥有语义。** footer 不添加 role、name 或焦点目标；每个快捷键的语义归 Kbd 所有。

## Design relationships

| Anatomy or state | Design requirement       | Representation authority | Hierarchy role | Component contract |
| ---------------- | ------------------------ | ------------------------ | -------------- | ------------------ |
| footer           | 一行可换行的辅助性指引。 | 当前源码                 | 辅助           | FR1、FR3           |
| 键盘快捷键       | 显示一个快捷键。         | `component:Kbd`          | 辅助           | FR2                |

由 `component:CommandPalette` 拥有的 CommandPalette 聚合解剖图，映射 footer 与键盘快捷键部分。

## Family and system relationships

- `component:Kbd` 拥有快捷键的绘制与语义。
- `component:CommandPalette` 拥有提示所指的键盘行为。

## Verification map

| Contract | Verification                                                                             | Representative states | Mutation or failure expectation                | Audit section                           |
| -------- | ---------------------------------------------------------------------------------------- | --------------------- | ---------------------------------------------- | --------------------------------------- |
| FR1、AR1 | `CommandPaletteFooter.test.tsx` 的换行测试；`CommandPaletteFooter.a11y.chromium.spec.ts` | 窄界面；LTR 与 RTL    | root 上出现 role 或 name，或没有换行，即失败。 | `audit:CommandPaletteFooter/layout`     |
| FR2      | `CommandPaletteFooter.test.tsx` 的默认标签与自定义 children 测试                         | 默认；自定义          | 丢失提示或忽略 children 即失败。               | `audit:CommandPaletteFooter/behavior`   |
| FR3      | `CommandPaletteFooter.test.tsx` 的 "carries the stable theme target on its single root"  | 任意                  | 缺失目标即失败。                               | `audit:CommandPaletteFooter/theming`    |
| FR4      | `CommandPaletteFooter.test.tsx` 的 className、xstyle、style、ref 与 DOM prop 测试        | root 输入             | 丢弃输入即失败。                               | `audit:CommandPaletteFooter/public-api` |

从源码读取，尚无聚焦测试：

- FR1：辅助文本字号与次要颜色。

## Decision log

未记录组件本地决策。

## Open questions

无。

## Content boundary

本文件不重复使用方 props 表或示例，也不重复 CommandPalette 的搜索与键盘行为。它链接到它们的所有者。
