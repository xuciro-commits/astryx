---
schema_version: 4
template_version: 2
kind: system-spec
id: spec:AST-109
authority: draft
archive_reason: null
superseded_by: null
approved_by: null
approved_at: null
phase: proposed
owners: [cixzhang]
affects_architecture: [architecture:public-component-api]
affects_families: [family:input-fields]
affects_contributing: []
affects_consumer_docs: [Selector]
---

# Clear value system spec

<!-- path-applicability:v1 -->

```json
{
  "paths": ["packages/core/src/Selector/**"]
}
```

<!-- Describe the system, not the project: present tense, what it does. No proposals, history, pull requests, or research in the record; see docs/contributing/spec-writing.md and report its rubric results in the pull request. -->

## Intent

清除 `Selector` 会把它带回起始点，而由调用方说明该起始点是什么。起始点为“Everyone”的筛选器清除后回到“Everyone”，而不是回到空白字段。代表该起始点的那一行在搜索收窄列表时始终留在列表中，因此用户总能从列表本身回到该起始点。

## Members

本规则仅适用于 `Selector`。它的值类型是 `string`，其清除选项（FR4）是 `value` 为 `clearValue` 的那个选项，相等性判断为字符串相等。`family:input-fields` 的其他每个成员，包括 `Typeahead`、`Tokenizer`、`MultiSelector` 和 `ComplexSelector`，都保留不带 `clearValue` 的普通布尔 `hasClear`。

## Non-goals

- 与清除分离的重置概念。清除只有一项职责、一个 prop，由 `hasClear` 的 `clearValue` 指明落到哪里。
- 默认值或非受控模式。`Selector` 是受控的，没有 `defaultValue`。
- 搜索匹配与查询归一化。匹配下限由 `spec:AST-056` FR4 拥有。
- 在除 `Selector` 之外的任何输入上使用 `hasClear` 的对象形式：`Typeahead`、`Tokenizer`、`MultiSelector`、`ComplexSelector`、`PowerSearch`，以及文本、数字、日期、时间与文件输入。
- 等效的内部实现只要满足本契约就仍然有效。
- 内部模块、文件、函数名、算法、数据结构、存储布局、清单、日志、锁、事务协议以及 CI 作业/工作流拓扑属于架构或实现，除非调用方或互操作的系统有意把该确切机制作为公共协议来依赖。在这种情况下，要说明谁依赖它，以及为什么等效实现无法满足契约。

## Public contract

```tsx
<Selector
  label="Owner"
  hasClear={{clearValue: 'all'}}
  hasSearch
  value={owner} // string, never null
  onChange={setOwner} // (value: string) => void
  options={[
    {value: 'all', label: 'Everyone', icon: UsersIcon},
    {type: 'divider'},
    ...owners,
  ]}
/>
```

## Requirements

- **FR1 — `hasClear={{clearValue}}` 决定清除落到哪里。** `Selector` 的 `hasClear` 接受 `boolean | {clearValue: string}`。`true` 的行为与今日一致：清除上报 `null`。对象形式会开启清除，并让每条清除路径都通过 `onChange` 和 `changeAction` 上报 `clearValue`：触发器的清除按钮、触发器上的 Delete 与 Backspace，以及选择清除选项（FR4）。`false` 与缺省保持其当前含义。
- **FR2 — 类型跟随对象形式，现有调用方保持不变。** 使用 `hasClear={{clearValue}}` 时，`value`、`onChange` 和 `changeAction` 接受不含 `null` 的 `string`。使用 `true`、`false` 或不带 `hasClear` 时，类型与已发布版本完全一致，包括 `hasClear` 下的 `null`。
- **FR3 — 处于清除值时无可清除。** 当值等于 `clearValue` 时，触发器的清除按钮隐藏，与今日值为空时隐藏一致。触发器像显示任何值一样显示该值：该选项的标签与图标，且不显示 `placeholder`。
- **FR4 — 清除选项留在列表中。** `value` 等于 `clearValue` 的选项就是清除选项。搜索从不隐藏它，包括匹配不到任何内容的查询——此时空搜索结果提示会渲染在它之后。它不算作结果：结果数量播报与空搜索状态只统计匹配项。查询处于活动状态时，默认高亮落在第一个匹配项上，绝不落在清除选项上，因此 Enter 绝不会误选它；方向键可以到达它。它保留调用方在顶层条目中的位置。匹配不到任何选项的 `clearValue` 不固定任何项，并在开发环境给出警告。
- **FR5 — 选择清除选项就是选择一个值。** 它使用选项行的解剖结构、尺寸、按压模型、触摸目标、主题目标和呈现方式，关闭状态下触发器的输入查找会匹配其标签。选择它会关闭浮层并把焦点返回触发器（`component:Selector` FR1）。清除按钮像今日一样返回焦点。
- **FR6 — 禁用、只读、必填与表单保持其含义。** `Selector` 被禁用或只读时，清除保持不可用（`component:Selector` FR6）。空 `clearValue` 会像今日空值一样未通过 `isRequired` 校验；非空 `clearValue` 则不。带 `htmlName` 时，清除后提交的值是 `clearValue`。

### Accessibility contract

- **AR1 — 名称与状态。** 清除选项的可访问名称是其标签，当值等于 `clearValue` 时会暴露其选中状态。清除按钮的可访问名称与 tooltip 保持不变（`family:input-fields` FR11）。
- **AR2 — 焦点。** 如同 FR5：选择清除选项会把焦点返回触发器，清除按钮保持其现有的焦点返回行为。
- **AR3 — 播报。** 清除不额外播报任何内容：触发器像对待任何选择一样朗读新值。
- **AR4 — 动效。** 此处不新增任何动效。各浮层自身的动效与减少动效行为继续适用。

### Platform support

- 支持的功能/引擎下限：所有受支持的浏览器与渲染器。此处没有任何内容位于能力检查之后。
- 不支持的行为：无。
- 浏览器证据：针对 FR2 的类型测试；针对名称、选中状态、焦点与播报的 DOM 和无障碍树断言；针对弹出层与底部面板中按压模型的真实 Chromium 交互。

## Current-state impact

- `family:input-fields` 仅在其采用表中为 `Selector` 列出 `hasClear` 的 `{clearValue}` 形式，并引用本记录。其他每个成员的 `hasClear` 都保持布尔值。
- `component:Selector` 列出清除选项与 FR3 的清除按钮规则。
- `Selector` 的 `.doc.mjs` 记录 `hasClear` 的对象形式及其类型收窄。
- `Selector` 保留一条内部清除路径；其当前内部名称不约束公共 prop。

## Verification

| Contract | Verification                                    | Representative states                                                        | Mutation or failure expectation                                                          |
| -------- | ----------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| FR1      | `Selector` 回调与 Action 测试套件               | 清除按钮、Delete/Backspace、清除选项；`hasClear` 为 `true` 与 `{clearValue}` | 对象形式下任何清除路径上报 `clearValue` 之外的值，或 `true` 下上报 `null` 之外的任何内容 |
| FR2      | `Selector` 类型测试                             | 无 `hasClear`；`true`；`{clearValue}`                                        | 对象形式下接受 `null`，或缺少它时任何已发布签名发生变化                                  |
| FR3      | 触发器渲染测试套件                              | 值等于 `clearValue`；不相等；为空                                            | 在 `clearValue` 处仍显示清除按钮，或触发器在该处显示 `placeholder`                       |
| FR4      | 带 live-region 断言的搜索测试套件               | 无查询；有匹配；无匹配；在搜索输入中按 Enter；`clearValue` 没有对应选项      | 该行被过滤、被计数、在查询下被默认高亮，或被 Enter 选中                                  |
| FR5      | 弹出层与底部面板中的交互测试套件；真实 Chromium | 指针、触摸、键盘；输入查找                                                   | 该行偏离选项行行为，或焦点落到别处                                                       |
| FR6      | 禁用、只读、必填与表单测试套件                  | 禁用；只读；必填且 `clearValue` 为空与非空；`htmlName`                       | 清除可达、必填校验错误，或提交的值不同                                                   |
| AR1–AR4  | 无障碍树、焦点与播报断言                        | `Selector` 处于与离开 `clearValue` 处                                        | 名称或状态缺失、焦点移到别处，或触发额外播报                                             |

已知验证缺口：这些测试套件在 `main` 上均不存在。

## Decision log

### DEC-1 — Going back is clear, to a value the caller names on `hasClear`

**Reference:** `spec:AST-109/DEC-1`

**Decider:** `cixzhang`, `2026-10-28`

清除已经意味着“回到起始点”；`hasClear` 的对象形式让调用方说明起始点在哪里，因此一项职责只保留一个 prop（`architecture:public-component-api` INV21）。该对象是现有开关上的普通配置，不是解剖设置（INV18），它不新增可视布尔值（INV20），并且在运行时没有成本（INV19）。

拒绝：单独的重置值或行，因为它与清除共享同一职责。拒绝：单独的 `clearValue` prop，因为两个 prop 会切换同一项职责。

### DEC-2 — The clear option is the option that holds the clear value

**Reference:** `spec:AST-109/DEC-2`

**Decider:** pending

该选项已经带有清除值的标签与图标，因此它就是留在列表中的那一行。不存在新的条目类型或 label prop。

拒绝：在 `options` 中设置专用的清除条目，因为它会在持有该值的选项旁边第二次命名清除状态。

### DEC-3 — Types narrow only with the object form

**Reference:** `spec:AST-109/DEC-3`

**Decider:** `cixzhang`, `2026-10-28`

使用 `hasClear={{clearValue}}` 时，`Selector` 绝不上报 `null`，因此其类型也如此声明。使用任何其他 `hasClear` 值时什么都不变，因此对象形式是增量式的。

### DEC-4 — The clear value is `Selector`'s alone

**Reference:** `spec:AST-109/DEC-4`

**Decider:** `cixzhang`, `2026-10-29`

`hasClear` 的对象形式与清除选项属于 `Selector`，它的筛选从诸如“Everyone”这样的真实值开始。`Typeahead`、`Tokenizer` 以及所有其他输入都保留普通的布尔 `hasClear`。`PowerSearch` 不是 selector。

拒绝：在整个 selector 家族中使用对象形式，因为只有 `Selector` 需要清除落到真实值上。

## Open questions

- **OQ1 — `hasClear` 的对象形式是否扩展到 `MultiSelector` 或 `ComplexSelector`？**（`human-api`）在裁定之前，两者都保留普通的布尔 `hasClear`。
