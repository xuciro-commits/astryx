---
schema_version: 3
template_version: 7
kind: component
id: component:EmptyState
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility, testing]
verified_by:
  [
    packages/core/src/EmptyState/EmptyState.test.tsx,
    packages/core/src/EmptyState/EmptyState.announce.test.tsx,
    .github/visual-baseline/manifest.json,
    scripts/check-knowledge.mjs,
    packages/core/src/theme/themingTargets.test.ts,
    packages/core/src/docPropReferences.test.ts,
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
system_specs:
  [spec:AST-009, spec:AST-020/FR1, spec:AST-086/FR2, spec:AST-086/FR11]
---

# EmptyState component contract

## Contract at a glance

| Area          | Contract                                                                                                                                                                                |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | `EmptyState` 在无 live role 的单个根元素中渲染必需的标题，以及可选的描述、装饰性图标和由调用方拥有的操作；调用方选择标题层级与紧凑布局。                                                |
| 行为          | null、undefined、布尔与空字符串的可选取值不创建插槽包装元素。渲染内容按图标、文本、操作的顺序排列；紧凑布局会减小间距并堆叠操作。                                                       |
| 终端用户影响  | 用户能到达具名的空内容消息及任何后续操作，且不会因浅层空的取值得出现空白空隙；标题契合周围的文档大纲。                                                                                  |
| 构建者影响    | 无；该记录描述已发布行为。                                                                                                                                                              |
| 兼容性/就绪度 | 将已发布行为记录为 current；API、默认值或输出均无变化。                                                                                                                                 |
| 评审检查      | 拒绝以下情形：标题缺失、将承载信息的图标作为装饰性隐藏、浅层空的可选标量仍改变布局、根 prop/ref/style 被丢弃，或缺少 anatomy 的主题目标。                                               |
| 管辖规则      | `architecture:public-component-api` INV1 与 INV5–INV9；`architecture:component-theming-surface` INV2–INV6；`architecture:component-test-sufficiency` INV1–INV7、INV10–INV11；WCAG 2.2。 |

本表是评审投影；下方的正文具有权威性。

## Intent

`EmptyState` 为原本为空的内容区域提供一个语义标题、辅助上下文、可选的装饰性视觉元素，以及可选的、由调用方拥有的后续操作。

## Compatibility and migration

- 保留已发布默认值：`yes`——标题层级为 3、默认布局、根元素上无 live role。
- 兼容性类别：记录已发布行为；公共 prop、默认值、DOM、目标或样式输出均无变化。
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 根元素、内容顺序、标题元素，以及默认/紧凑布局；
- 将图标插槽作为装饰性内容从辅助技术中隐藏；以及
- 可选插槽是否会创建组件拥有的包装元素与间距。

**不拥有 / 非目标**

- 消息文案、图标含义、操作控件或操作行为——这些属于产品调用点及其提供的组件；
- 页面级标题顺序——调用方为其文档选择 `headingLevel`；或
- 错误、加载中或有内容时的行为。

## Public concepts

| 概念        | 封闭取值或状态    | 含义                                                 | 按变体/方向/状态的可获得性 | 默认值  | 所有者                 | 稳定性 | 无效取值行为                            |
| ----------- | ----------------- | ---------------------------------------------------- | -------------------------- | ------- | ---------------------- | ------ | --------------------------------------- |
| title       | string            | 空区域的标题内容。                                   | 全部                       | 必需    | `component:EmptyState` | 稳定   | 类型拒绝                                |
| description | string 或缺失     | 标题下方的可选辅助上下文。                           | 全部                       | 缺失    | `component:EmptyState` | 稳定   | nullish 与空字符串取值会省略该部分      |
| icon        | React node 或缺失 | 可选的调用方视觉元素，以装饰性内容呈现在文本消息旁。 | 全部                       | 缺失    | 产品调用点             | 稳定   | nullish、布尔与空字符串取值会省略该插槽 |
| actions     | React node 或缺失 | 消息下方可选的、由调用方拥有的后续操作。             | 全部                       | 缺失    | 产品调用点             | 稳定   | nullish、布尔与空字符串取值会省略该插槽 |
| 标题层级    | `1` 到 `6`        | 标题在周围文档大纲中的 HTML 标题层级。               | 全部                       | `3`     | 产品调用点             | 稳定   | 类型拒绝                                |
| 布局变体    | default、compact  | 紧凑布局会减小间距并将操作插槽垂直堆叠。             | 全部                       | default | `component:EmptyState` | 稳定   | 类型拒绝                                |

## Behavioral and layout contract

| ID  | Invariant                                                                                                           | Basis                                                       |
| --- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| FR1 | 存在时，组件必须渲染一个根元素，按该阅读顺序包含图标、文本组与操作。组件不得向根元素添加 live role 或 `aria-live`。 | 当前实现与使用方文档；`spec:AST-086` FR2；WCAG 2.2 SC 1.3.2 |
| FR2 | 必需的标题必须按调用方选定的标题层级渲染，且不改变组件的视觉类型角色。                                              | 当前实现、测试与使用方文档；WCAG 2.2 SC 1.3.1 与 SC 2.4.6   |
| FR3 | null、undefined、布尔与空字符串的可选取值不得创建包装元素、布局空隙或辅助技术节点；浅层非空的容器仍会被包装。       | React 的直接子节点渲染语义；既有的公共可选插槽接口          |
| FR4 | 插槽缺失时，装饰性图标包装必须不存在；渲染时则必须从辅助技术中隐藏。                                                | 当前实现与测试；WCAG 2.2 SC 1.1.1                           |
| FR5 | 根元素的 DOM/data/ARIA/事件 props、ref、`className`、`style` 与 `xstyle` 必须到达根元素并在其上组合。               | `architecture:public-component-api` INV5–INV8               |
| FR6 | 紧凑布局必须减小组件间距并堆叠操作插槽，同时保持内容顺序与根语义。                                                  | 当前实现、测试与使用方文档                                  |

### Allowed variation

- **AV1 — 调用方内容。** 消息措辞、装饰性图像与操作组合可在产品调用点变化。
- **AV2 — 主题涂装。** 受主题控制的涂装与排版可通过文档化的目标变化，而 anatomy 与内容顺序保持稳定。

### Representative states

| State            | Required invariant                        | Allowed variation          |
| ---------------- | ----------------------------------------- | -------------------------- |
| 仅标题           | 根元素与选定的标题层级保持存在            | 消息措辞                   |
| 描述             | 辅助文本跟随标题                          | 文本长度与换行             |
| 装饰性图标       | 视觉元素先于文本且对辅助技术隐藏          | 调用方提供的图像           |
| 操作             | 调用方控件跟随文本组                      | 一个或多个调用方拥有的控件 |
| 紧凑             | 减小的间距与垂直操作保持语义              | 主题涂装与调用方内容       |
| 浅层空的可选标量 | nullish、布尔与空字符串取值不产生包装元素 | 哪个可选插槽接收该取值     |

### Transformation and precedence order

- **ORD1 — 根组合。** 组件语义与主题元数据先与组件样式组合，然后在共享合并契约下与使用方的 `xstyle`、`className` 和 `style` 组合。组件不设置 role，因此调用方的 `role` 会原样到达根元素。

### Performance and resources

- **PR1 — 自身不持有资源。** EmptyState 不持有自己的状态、监听器、观察器或定时器；其文本外部的共享播报包装拥有对它进行播报的观察（`spec:AST-086`）。

## Accessibility contract

- **AR1 — 标题语义。** 标题是按调用方选定层级的标题。
- **AR2 — 装饰性视觉元素。** 图标插槽对辅助技术隐藏；调用方将所有必要的含义保留在标题或描述中。
- **AR3 — 无 live region；出现时播报。** EmptyState 不向根元素添加 live role 或 `aria-live`，也不移动焦点。若它在文档完成加载之前（或在水合期间）被渲染或发生更改，则不会播报任何内容。当它稍后出现，或其消息稍后变化时，它会通过共享的礼貌通道播报其消息一次（`spec:AST-086` FR2、FR11）。消息即标题与描述，不含对辅助技术隐藏的内容；操作标签不属于其中。操作控件保留各自的名称、角色与行为。

## Design relationships

当前没有设计记录管辖 EmptyState 专有的表现形式。视觉判断仍是证据，而非产品权威。

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Container": {"target": "empty-state"},
  "Icon": {
    "none": {
      "reason": "intentional: caller-supplied decorative content keeps its own styling and has no component-owned paint target"
    }
  },
  "Title": {"target": "empty-state-title"},
  "Description": {"target": "empty-state-description"},
  "Actions": {
    "none": {
      "reason": "intentional: caller-supplied controls keep their own component targets and behavior"
    }
  }
}
```

## Family and system relationships

当前没有 family 记录拥有 EmptyState 专有的行为。

## Verification map

| Contract           | Verification                                                                                                     | Representative states                                                                  | Mutation or failure expectation                                                                                                                                                                                            | Audit section              |
| ------------------ | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| FR1, FR3, FR4, AR2 | `EmptyState.test.tsx` 的插槽、顺序、装饰性图标、空插槽与 live role 测试；稳定视觉基线 `core-emptystate--default` | 仅标题；全部插槽；缺失与浅层空的插槽                                                   | 为缺失或浅层空的插槽生成包装元素、插槽顺序改变、图标未对辅助技术隐藏，或根元素上出现 live role，均判定失败；默认布局发生变化会以变更形式返回评审。缺口：没有辅助技术树检查能证明被隐藏的图标或标题（`spec:AST-009` FR3）。 | `audit:EmptyState/a11y`    |
| FR2, AR1           | `EmptyState.test.tsx` 的标题测试                                                                                 | 默认层级 3；每一层级                                                                   | 标题若不是选定的标题元素则判定失败。缺口：没有检查确认标题在每个标题层级下保持同一字体样式。                                                                                                                               | `audit:EmptyState/a11y`    |
| AR3                | `EmptyState.announce.test.tsx`                                                                                   | 随页面渲染；稍后出现；iframe；处于 live 容器内；消息变化；服务端渲染与水合；隐藏与显示 | 加载或水合期间发生播报、稍后出现或变化时缺少播报或重复播报、消息中包含隐藏文本，或在 live 容器内播报，均判定失败。缺口：没有测试断言 EmptyState 出现时焦点停留在原处。                                                     | `audit:EmptyState/a11y`    |
| FR5, ORD1          | `EmptyState.test.tsx` 的 ref、`data-testid` 与根组合测试                                                         | DOM、data、事件、样式输入；调用方 role；ref                                            | 丢失输入、替换调用方 role，或 ref 不是 `div`，均判定失败。缺口：ref 测试只检查 ref 是 `div`，而不检查它是根元素。没有测试断言调用方 `xstyle` 会跟随组件样式。                                                              | `audit:EmptyState/api`     |
| FR6                | `EmptyState.test.tsx` 的紧凑与主题目标测试                                                                       | 默认与紧凑                                                                             | 紧凑布局未体现在根元素、标题与描述上，或改变了插槽顺序，均判定失败。缺口：减小的间距与堆叠的操作没有自动化检查。                                                                                                           | `audit:EmptyState/layout`  |
| PR1                | 源码评审                                                                                                         | 每条渲染路径                                                                           | 缺口：若 EmptyState 添加自己的状态、监听器或定时器，没有自动化检查会判定失败。                                                                                                                                             | `audit:EmptyState/code`    |
| 主题 anatomy 映射  | `scripts/check-knowledge.mjs`；`themingTargets.test.ts`                                                          | 使用方 anatomy 与当前目标                                                              | 缺失、多余或过期的映射会导致仓库校验失败。                                                                                                                                                                                 | `audit:EmptyState/theming` |

## Decision log

无记录。该记录描述已发布行为。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤或 family/system 规则。它链接到它们的拥有者。
