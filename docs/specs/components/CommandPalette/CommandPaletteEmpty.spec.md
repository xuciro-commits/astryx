---
schema_version: 3
template_version: 7
kind: component
id: component:CommandPaletteEmpty
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-11-01
owners: [cixzhang]
review_triggers: [public-api, behavior, theming, accessibility, testing]
verified_by:
  [
    packages/core/src/CommandPalette/CommandPaletteEmpty.test.tsx,
    packages/core/src/CommandPalette/CommandPalette.test.tsx,
    packages/core/src/CommandPalette/CommandPaletteList.test.tsx,
    packages/core/src/CommandPalette/__tests__/CommandPaletteEmptyAudit.a11y.chromium.spec.ts,
    packages/core/src/theme/themingTargets.test.ts,
    apps/storybook/stories/CommandPaletteEmpty.stories.tsx,
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
  ]
contributing: []
system_specs: [spec:AST-029, spec:AST-056]
---

# CommandPaletteEmpty component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 公共契约      | `CommandPaletteEmpty` / `CommandPaletteEmptyProps`：必需的 `children`、`BaseProps<HTMLDivElement>`，以及一个根 `ref`。                                                               |
| 行为          | 一个普通容器把调用方内容作为辅助文本居中。CommandPalette 在无查询与无结果分支渲染它；它不拥有任何 role、状态、播报或交互。                                                           |
| 最终用户影响  | 走到面板死胡同的人读到这条消息，而调用方的任何链接都保持为普通可达内容，而不是一个选项。                                                                                             |
| 构建者影响    | 无。                                                                                                                                                                                 |
| 兼容性/就绪度 | 记录已发布的行为；无公共变更。标注为从源码读取的论断仍待证据。                                                                                                                       |
| 审查检查      | 拒绝组件自有的 role 或 live region、围绕调用方内容的选项语义、被丢弃的根输入、被移出绘制根的目标，或溢出其宿主内联轴的内容。                                                         |
| 管辖规则      | `architecture:public-component-api/INV1,INV5–INV8`；`architecture:component-theming-surface/INV2–INV6`；`spec:AST-056/FR3`、`AR1`（针对父组件的播报）；WCAG 2.2 SC 1.4.3 与 1.4.10。 |

本表格是审查投影；下文的正文具有权威性。

## Intent

CommandPaletteEmpty 呈现在 CommandPalette 结果区域中没有可选项时显示的消息。它拥有空消息表面：其布局、辅助排版、次要文本颜色、根输入合成，以及 `command-palette-empty` 主题目标。CommandPalette 决定消息何时出现、默认说什么，以及是否播报它。

使用方语法与示例属于 `CommandPaletteEmpty.doc.mjs`。

## Compatibility and migration

- 保留已发布的默认值：`yes`
- 兼容类别：记录已发布的行为；无公共变更
- 受控/非受控行为：不适用。
- 迁移决策：无。

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 一个根容器及其公共 ref，以及 DOM/data/ARIA、class、style、事件与 `xstyle` 合成。
- 为调用方内容提供居中布局、块级与内联内边距、辅助字号与行距、正文字体族，以及次要文本颜色。
- 把调用方文本包裹在宿主的内联尺寸内。
- 同一绘制根上的 `command-palette-empty` 目标。

**不拥有 / 非目标**

- 空分支何时出现、内置目录消息，以及空搜索播报——由 `component:CommandPalette` 拥有。
- 为空时的结果表面语义，包括去除 listbox 语义——由 `component:CommandPalette` 与 `component:CommandPaletteList` 拥有。
- 调用方内容中的含义、链接或控件——由产品调用点拥有。

## Public concepts

| 概念   | 封闭取值或状态                              | 含义                               | 按变体/方向/状态的可用性           | 默认值 | 拥有者       | 稳定性 | 无效值行为                                  |
| ------ | ------------------------------------------- | ---------------------------------- | ---------------------------------- | ------ | ------------ | ------ | ------------------------------------------- |
| 空消息 | 调用方 `ReactNode`：文本或元素              | 在没有可选项时人们读到的辅助消息。 | 无查询与无结果的面板分支；独立组合 | 必需   | 组件         | 稳定   | 按给定内容渲染；不可渲染的值由 React 决定。 |
| 根表面 | ref；DOM/data/ARIA；class/style/xstyle/事件 | 扩展消息根。                       | 每次渲染                           | 省略   | 公共组件 API | 稳定   | 接受的输入会合成；组件不添加任何 role。     |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                           | 依据                                                               |
| --- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| FR1 | 组件必须在一个容器元素内渲染其 children，该容器在两个轴上将它们居中，并使用居中文本、辅助字号、正文字体族与次要文本颜色。        | 当前源码、使用方文档与聚焦测试                                     |
| FR2 | 当没有查询也没有结果时，CommandPalette 必须用 `emptyBootstrapText` 渲染本组件；当有查询但没有结果时，用 `emptySearchText` 渲染。 | 当前源码与测试                                                     |
| FR3 | 根必须不携带组件自有的 role、live region 或焦点停靠点，因此调用方链接与控件保持普通内容。                                        | WAI-ARIA 1.2 listbox 拥有子项规则；当前源码与测试                  |
| FR4 | 调用方文本必须在宿主的内联尺寸内换行，包括单个不可断行的词元，因此在 320 CSS px 下没有任何消息会造成内联滚动或裁切。             | WCAG 2.2 SC 1.4.10；当前源码                                       |
| FR5 | 绘制根必须携带 `command-palette-empty` 目标；组件样式先于调用方 `xstyle` 应用。                                                  | `architecture:component-theming-surface/INV2–INV6`；源码与聚焦测试 |
| FR6 | 接受的 ref、DOM/data/ARIA、class、style、事件与 `xstyle` 必须到达根或在其上合成。                                                | `architecture:public-component-api/INV5–INV8`；聚焦测试            |

### Allowed variation

- **AV1 — 主题绘制。** 该目标可以重新设定消息表面与文本的样式，而不改变语义或布局归属。
- **AV2 — 调用方内容。** 文本长度、翻译、内联元素与链接可以变化，而根保持为一个普通容器。

### Representative states

| 状态           | 必需的不变式                                    | 允许的变化                   |
| -------------- | ----------------------------------------------- | ---------------------------- |
| 面板无查询空态 | 引导消息渲染在结果区域；不暴露任何 listbox。    | 内置目录文本或调用方内容。   |
| 面板无结果     | 搜索消息渲染；CommandPalette 播报所渲染的文本。 | 内置目录文本或调用方富内容。 |
| 独立           | 同一根在面板之外以调用方内容渲染。              | 宿主布局与调用方 role。      |
| 长文本或翻译   | 文本在宿主内换行；无内联溢出。                  | 行数增加。                   |
| RTL            | 居中布局与文本保持方向中立；内联文本顺序镜像。  | 调用方内容方向。             |
| 窄视口         | 消息在 320 CSS px 的宿主内换行。                | 行数增加。                   |

### Transformation and precedence order

- **ORD1 — 根合成。** 依次应用目标 class、组件样式，然后调用方 `xstyle`；追加调用方 `className`；应用调用方 `style`；把其余宿主 props 展开到根上。

### Performance and resources

- **PR1 — 无生命周期。** CommandPaletteEmpty 不使用任何 hook、监听器、观察器、定时器、请求、状态或 Effect。

## Accessibility contract

- **AR1 — 普通内容。** 根按阅读顺序暴露调用方内容，不添加 role；调用方链接保留其自身的 role 与焦点行为。
- **AR2 — 可读消息。** 在每个受支持的主题与模式下，消息文本相对其渲染表面达到 WCAG 2.2 SC 1.4.3 的对比度最低要求。

## Design relationships

| 解剖结构或状态 | 设计要求                                   | 表示权威       | 层级角色 | 组件契约      |
| -------------- | ------------------------------------------ | -------------- | -------- | ------------- |
| 空消息         | 把死胡同消息作为辅助文本居中呈现在结果中。 | 当前源码 token | 辅助     | FR1, FR4, FR5 |

没有记录组件本地的设计决策。由 `component:CommandPalette` 拥有的 CommandPalette 聚合解剖结构映射标出 Empty 部分。

## Family and system relationships

- `architecture:public-component-api` 拥有导出与根输入合成。
- `architecture:component-theming-surface` 拥有目标放置。
- `architecture:component-test-sufficiency` 拥有成比例的、可观察的证据。
- `spec:AST-056/FR3` 与 `AR1` 要求 CommandPalette 播报它渲染的空搜索消息；本组件提供所渲染的节点。
- `component:CommandPalette` 与 `component:CommandPaletteList` 拥有父分支与空结果表面。
- `spec:AST-029` 拥有审计证据清单，本记录的验证映射遵循该清单。

## Verification map

| 契约          | 验证                                                     | 代表性状态                               | 变更或失败预期                                                                                                                    | 审计小节                                  |
| ------------- | -------------------------------------------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| FR1, FR5–FR6  | `CommandPaletteEmpty.test.tsx`；`themingTargets.test.ts` | 文本与元素 children；根输入              | 被丢弃的输入、被移动的目标或丢失的 children 会使聚焦断言失败。                                                                    | `audit:CommandPaletteEmpty/§2,§3,§4`      |
| FR2, FR3, AR1 | `CommandPalette.test.tsx`；`CommandPaletteList.test.tsx` | 引导、搜索、富内容、模态与内联           | 暴露 listbox、添加 role，或播报所渲染消息之外的文本，都会使断言失败。                                                             | `audit:CommandPaletteEmpty/§1,§4`         |
| FR4, AR2      | `CommandPaletteEmptyAudit.a11y.chromium.spec.ts`         | 窄与宽视口；浅色与深色；强制颜色；富内容 | 在 320 CSS px 下出现水平溢出的用例会使审计清单测试失败。缺口：审计记录消息对比度但不以其为门禁，因此低于 4.5:1 的对比度不会失败。 | `audit:CommandPaletteEmpty/accessibility` |
| PR1           | 源码审查                                                 | 每种状态                                 | 缺口：如果 CommandPaletteEmpty 新增 hook、监听器或 Effect，没有任何自动化检查会失败。                                             | `audit:CommandPaletteEmpty/behavior`      |

从源码读取、但尚无聚焦测试的部分：

- FR1：居中、辅助字号、正文字体族与次要文本颜色。
- AR2：每个主题与模式下的消息对比度。
- PR1：组件自身没有 hook、监听器或生命周期。

## Decision log

没有记录组件本地的决策。

## Open questions

无。

## Content boundary

本文件不复制使用方 prop 表/示例、实现步骤或系统规则。它链接到它们的所有者。
