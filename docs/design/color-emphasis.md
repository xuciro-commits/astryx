---
schema_version: 1
template_version: 1
kind: design
id: design:color-emphasis
authority: draft
archive_reason: null
superseded_by: null
approved_by: null
approved_at: null
owners: [ernestt, cixzhang]
review_triggers: [visual, theming, accessibility]
verified_by: []
architecture:
  [
    architecture:theme-tokens,
    architecture:theme-authoring-contract,
    architecture:component-theming-surface,
  ]
components: []
families: []
deciding_specs: []
---

# Color emphasis design specification

## User intent

人们应当能够找到主要操作，并理解表面和状态角色，而无需解读随意的颜色。颜色应在受支持的模式和主题下保持易读性和层级。

## Design principles

- **DR1 — 前景与背景是一项决策。** 颜色选择必须在其所处表面的上下文中进行评估。
- **DR2 — 中性色遵循语义角色。** 交互覆盖层、轨道、内容容器和自包含元素即使其中性值看起来相似，也必须保持可区分。
- **DR3 — 强调保持克制。** 局部操作组应只呈现一个清晰的主强调，而不是让每个操作都同等竞争。
- **DR4 — 状态遵循其规范反馈契约。** 颜色强调必须保留 `design:system-states` 定义的非颜色提示和突出程度，而不是发明另一种状态处理。
- **DR5 — 交互覆盖层保留上下文。** 悬停和按压处理应在视觉上与底层表面结合，而不是用一个不相关的完全不透明块替换它。

## Anatomy and hierarchy

| 角色     | 用途                         | 必需关系                   |
| -------- | ---------------------------- | -------------------------- |
| 基础表面 | 建立页面、容器或元素上下文   | 决定前景选择的含义和易读性 |
| 前景     | 承载文本、图标或边界信息     | 在与配对表面上保持易读     |
| 交互色调 | 传达瞬态响应                 | 保留底层表面的身份         |
| 主强调色 | 将注意力引向最重要的局部操作 | 在视觉上强于同级操作       |

## State representation

静止、悬停、按压、焦点、选中和禁用状态在每种受支持模式下都必须保持感知上可区分。状态表示由 `design:system-states` 拥有。辅助文本和禁用文本不得仅仅因为都比正文更安静而变得无法区分。

## Responsive and input behavior

- **DR6 — 强调在密集布局中依然存在。** 当操作折叠或移动时，主要操作必须保持可识别，而无需放大其余每个控件。
- **DR7 — 悬停颜色是可选反馈。** 触控和键盘路径必须在不依赖悬停色调的情况下保留状态含义。

## Accessibility intent

前景/背景配对必须在受支持模式下保持易读。颜色强调不得削弱 `design:system-states` 拥有的非颜色状态提示。精确阈值和机械对比度验证仍属于无障碍和审计职责。

## Representative examples

- 一个工具栏呈现一个主要操作，同时次要操作和破坏性操作保持清晰，而不共享相同的强调。

## Visual references

不包含规范性素材。在提升为正式记录之前，应在 `docs/design/assets/color-emphasis/` 下添加操作层级和语义中性色示例。状态示例仍由 `design:system-states` 负责。

## Component contract links

本种子草案未声明任何组件契约链接。

## Decision log

目前尚无仓库设计决策批准本记录。它提炼了公共 Design Conventions wiki 中关于颜色角色和强调的意图，同时将 token 词汇和主题机制委托给架构。

## Open questions

- **OQ1 — 主要操作范围。** 哪些容器会重置局部主要操作层级？
- **OQ2 — 代表性主题。** 哪些主题和模式构成角色保留的最小证据集？

## Content boundary

本文件定义颜色角色和强调。它不定义 token 名称、原始值、对比度阈值、主题 API、组件 prop 或审计检查。
