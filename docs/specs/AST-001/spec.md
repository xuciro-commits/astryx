---
schema_version: 4
template_version: 1
kind: system-spec
id: spec:AST-001
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-08-31
phase: accepted
owners: [cixzhang, imdreamrunner]
affects_architecture: [architecture:public-component-api]
affects_families: [family:input-fields]
affects_contributing: []
affects_consumer_docs: [Selector, MultiSelector]
---

# Async option-source states

## Intent

使用 Selector 或 MultiSelector 的人应当能够使用调用方提供的每一个选项，包括在字段值正在解析或正在保存的时候。当没有任何可用选项时，控件应当说明来源是仍处于待定状态，还是已经完成为空，而不是呈现一个沉默但看起来可操作的 Selector。

## Non-goals

- 重新定义 input-family 的 `isLoading`；它仍然是值解析或保存状态。
- 为初始选项来源待定状态选择公共 API 的名称或形状。
- 定义失败、重试、分页、缓存或过期响应排序。
- 改变 Typeahead 由组件自有的异步搜索生命周期。
- 在本规格 pull request 中实现 Selector 或 MultiSelector 的行为。

## Requirements

- **FR1 — 提供的选项决定可用性。** 提供给 Selector 或 MultiSelector 的规范化选项，是决定哪些选项可以被渲染和被选择的来源。
- **FR2 — 输入加载不会抑制选项。** 输入 `isLoading` 不得隐藏、禁用或以其他方式使已提供的选项不可用。在字段值忙碌时，搜索和键盘导航必须在同一组已提供选项上运行。
- **FR3 — 零个已提供选项意味着无可选选项状态。** 当规范化后的已提供集合不包含任何可选选项时，选择器不得提供暗示存在可选选项的激活或导航。
- **FR4 — 初始待定状态是显式的。** 初始选项来源待定状态必须独立提供。不得从零个选项或输入 `isLoading` 推断它。
- **FR5 — 待定状态不会产生虚假的空或只读声明。** 在零个已提供选项时，显式的初始待定状态仍然没有可选选项，但必须呈现并通告为正在加载，而不是呈现为已完成为空或只读。在存在已提供选项时，来源待定信号不得覆盖 FR1 或 FR2。
- **FR6 — 已完成为空是只读且显式的。** 在零个已提供选项且没有显式初始待定状态时，选择器为只读且没有可选选项。其可见状态和程序化状态必须传达该完成状态，而不要求使用者激活一个不可用的弹出层。
- **FR7 — 加载、只读和空保持可区分。** 对于以下情形，视觉输出、可访问性语义、焦点行为和通告必须保持一致：初始待定、已完成为空，以及输入 `isLoading` 为 true 时存在已提供选项。从初始待定到已完成为空的转换必须一次性通告新结果，且不得丢失控件的可访问名称或当前值。

### Platform support

- 支持的特性/引擎下限：与 Selector 和 MultiSelector 相同的浏览器和辅助技术支持。
- 不支持的行为：输入 `isLoading` 不得被用作回退的选项来源信号。
- 浏览器证据：加载、只读和已完成为空状态需要真实浏览器中的键盘与可访问性树验证；仅靠 DOM 断言不够。屏幕阅读器观察是 `spec:AST-009` 下建议的后续工作，而不是合并或发布要求。

## Current-state impact

- Selector 和 MultiSelector 在输入 `isLoading` 为 true 时，已经让非空的已提供选项保持渲染、可被键盘到达并且可选。这满足 FR1 和 FR2；实现必须保留该行为。
- 输入 `isLoading` 目前会抑制空与无结果的呈现以及搜索结果计数通告。源码注释和使用方 API 文本把这种抑制描述为选项尚未到达，尽管该标志负责的是值解析或保存。
- 两个组件都没有暴露显式的初始选项来源待定状态。在零个选项且输入未加载时，二者仍然提供一个可操作的触发器，打开的是已完成为空的内容，而不是只读的无选择状态。
- `family:input-fields/FR5` 和 `family:input-fields/DEC-2` 已经记录了输入 `isLoading` 的已批准含义。本规格收窄了由此产生的、针对选择器的零选项、待定与可访问性要求。
- `architecture:public-component-api` 和 `spec:AST-002` 管辖用于表示显式初始待定状态所需的、尚未确定的公共 API。
- 实现面向待定 API、零选项只读行为以及可访问的状态转换。它还会移除错误的“选项未到达”说法，同时保留有选项时的可用性。随后，所属组件的契约与使用方文档必须链接到适用的 AST-001 决策；在该工作落地之前，`component:Selector` 仍然是已发布 Selector 行为的权威来源。

## Verification

| 契约          | 验证                                                       | 代表性状态                                                               | 变异或失败预期                                                              |
| ------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| FR1、FR2      | Selector 和 MultiSelector 交互测试                         | 存在已填充选项且输入 `isLoading`；已搜索与未搜索；指针与键盘             | 因为字段值忙碌，某个已提供选项消失、变得不可到达或无法被选择                |
| FR3、FR5、FR6 | 状态转换与激活测试                                         | 初始待定时的零个选项；从待定到已完成为空；没有待定状态时的零个选项       | 控件提供不存在的选择、在待定时声称已完成为空，或在完成后仍持续呈现加载      |
| FR7           | 真实浏览器键盘与可访问性树测试；建议进行屏幕阅读器后续验证 | 初始待定、已完成为空/只读、输入 `isLoading` 时存在已填充选项、已有选中值 | 可见状态与通告状态不一致、焦点丢失、名称/值消失，或者转换静默无声或重复通告 |
| Public API    | OQ1 解决后的类型级与使用方示例测试                         | 省略/默认状态、显式初始待定、动态完成                                    | 零个选项或输入 `isLoading` 悄悄替代了显式的来源状态                         |

## Decision log

### DEC-1 — Provided options stay available while the input value is loading

**参考：** `spec:AST-001/DEC-1`

**决定者：** `cixzhang`，`2026-08-31`

Selector 和 MultiSelector 从调用方提供的选项中推导选项可用性。输入 `isLoading` 描述的是值解析或保存，并且不会抑制这些选项。

已否决：把输入 `isLoading` 当作独立提供的选项尚未到达的证据，因为这样做会让有效选择变得不可用，并把两个互不相关的状态合并在一起。

### DEC-2 — Zero options is a no-choice state, not evidence of pending work

**参考：** `spec:AST-001/DEC-2`

**决定者：** `cixzhang`，`2026-08-31`

零个已提供选项意味着没有可选择的选项；一旦来源不处于显式待定状态，选择器就是只读的，并传达已完成为空。初始待定是一个独立的显式状态：它没有可选选项，但传达正在加载，并且不得从空数组中推断。

已否决：用一次零选项观察同时表示“仍在加载”和“已完成且没有选择”，因为使用者和辅助技术无法区分等待中与已完成的只读控件。

## Open questions

- **OQ1 — 用什么公共 API 表示 Selector 和 MultiSelector 的显式初始选项来源待定状态？**（`human-api`）该 API 必须区分待定与已完成为空，同时不改变输入 `isLoading`，也不覆盖已提供选项的可用性。
