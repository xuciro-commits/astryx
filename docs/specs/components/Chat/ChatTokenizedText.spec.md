---
schema_version: 3
template_version: 7
kind: component
id: component:ChatTokenizedText
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-11-01
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility, testing]
verified_by:
  [
    packages/core/src/Chat/ChatTokenizedText.test.tsx,
    packages/core/src/Chat/__tests__/ChatTokenizedText.a11y.chromium.spec.ts,
    apps/storybook/stories/ChatTokenizedText.stories.tsx,
    apps/storybook/rtl-audit/verified-not-applicable.json,
    packages/core/src/theme/themingTargets.test.ts,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:public-component-api,
    architecture:component-theming-surface,
    architecture:component-test-sufficiency,
    architecture:react-component-runtime,
    architecture:theme-tokens,
    architecture:knowledge-contracts,
  ]
contributing: []
system_specs: [spec:AST-002, spec:AST-020, spec:AST-029]
---

# ChatTokenizedText component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | `ChatTokenizedText`，具有必填的字符串 `children`、可选的 `tokens`（`ChatComposerToken` 形状）、`ref`、`xstyle`、`className`、`style` 以及根 span 属性；目标为 `chat-tokenized-text`。 |
| Behavior                | 未匹配的文本会被保留。非空 token 值按从左到右的顺序逐字面匹配。结构化 token 委托给 Badge，自定义 token 委托给调用方。                                                                 |
| End-user impact         | 读者在已发送的消息中看到的提及和其他 token，与他们在输入区看到的是同样的 chip，位置不变，消息的其余文本保持原样。                                                                     |
| Builder impact          | 无。                                                                                                                                                                                  |
| Compatibility/readiness | 记录已发布的行为；没有公共变更。一个所有者问题仍未解决；对于标注为从源码读取的声明，证据尚待补充。                                                                                    |
| Review checks           | 拒绝零宽匹配、丢失未匹配文本、在没有匹配的情况下执行自定义渲染器、丢弃根输入，或对调用方拥有的内容作出声明。                                                                          |
| Governing rules         | `architecture:public-component-api/INV1, INV5–INV6, INV8–INV9`；`architecture:component-test-sufficiency/INV1–INV7`；ECMAScript RegExp 的推进语义。                                   |

此表是一份审查投影；下方正文具有权威性。

## Intent

ChatTokenizedText 将嵌入纯聊天消息中的已序列化 token 值投射为行内结构化 Badge 内容或调用方渲染的内容，同时保留其周围的文本。

## Compatibility and migration

- 保留的已发布默认值：`yes`
- 兼容类别：记录已发布的行为；没有公共变更
- 受控/非受控行为：不适用；该组件不拥有任何状态
- 迁移决策：无

使用方的迁移说明应放在使用方文档与发布说明中。

## Current-state impact

- **较短的 token 可能拆分较长的 token。** 当一个 token 的值是另一个 token 值的前缀，且排在前面时，较短的值会胜出：在 token 为 `@u1` 然后 `@u12` 的情况下，文本 `@u12` 会渲染出 `@u1` chip 后跟一个多余的 `2`。当两个 token 拥有相同的值时，渲染较晚定义的那个（OQ1）。

## Ownership boundary

**拥有**

- 将已序列化的 token 值与所提供的消息文本进行字面匹配。
- 保留未匹配的文本与源顺序。
- 为每个匹配选择现有的结构化 Badge 分支或自定义渲染分支。
- 根 span、其 `chat-tokenized-text` 目标、可接受的 BaseProps 组合，以及 ref。

**不拥有 / 非目标**

- token 值语法、标识、校验或产品语义。
- Badge 的颜色、图标、尺寸或无障碍语义。
- 调用方提供的自定义 token 内容内部的语义与交互。
- 输入区的插入、序列化、删除、选择，或 token 元素对齐。

## Public concepts

| Concept    | Closed values or states                        | Meaning                                     | Availability by variant/orientation/state | Default | Owner                               | Stability | Invalid-value behavior       |
| ---------- | ---------------------------------------------- | ------------------------------------------- | ----------------------------------------- | ------- | ----------------------------------- | --------- | ---------------------------- |
| 消息文本   | 任意字符串                                     | 纯文本，其字面 token 值可被行内投射。       | 每次渲染                                  | 必填    | `component:ChatTokenizedText`       | 稳定      | 空文本渲染出一个空 span。    |
| token 集合 | 省略；空；非空                                 | 候选的已序列化值及其结构化或自定义呈现。    | 每次渲染                                  | 省略    | 调用方与组件                        | 稳定      | 空 token 值会被忽略。        |
| token 形式 | 结构化 Badge 配置；自定义渲染函数              | 选择委托给 Badge 的内容或调用方渲染的内容。 | 匹配的非空值                              | 无      | 调用方与受委托组件                  | 稳定      | 类型无效的形式会被拒绝。     |
| 根表面     | ref；受支持的 DOM/data/ARIA/class/style/xstyle | 扩展行内根，而不替换其拥有的目标。          | 每次渲染                                  | 省略    | `architecture:public-component-api` | 稳定      | 不受支持的输入仍然不受支持。 |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                           | Basis                                               |
| --- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| FR1 | 组件必须原样保留未匹配的文本，并在每个匹配的非空已序列化值的原始阅读顺序位置替换它。重叠或重复的值如何解析属于 OQ1。                | 当前源码、测试与文档                                |
| FR2 | 空 token 值必须被忽略，以便渲染器总能取得进展，永不进入零宽的全局匹配循环。                                                         | 当前源码与测试                                      |
| FR3 | 结构化匹配必须将标签、变体与图标的渲染委托给 Badge；自定义匹配必须仅在真实匹配时调用调用方的渲染器。                                | 当前源码、测试与文档                                |
| FR4 | 受支持的 ref、DOM/data/ARIA、className、style 与 xstyle 输入必须到达根 span 或在其上组合，同时 `chat-tokenized-text` 目标保持完好。 | `architecture:public-component-api/INV5–INV6, INV8` |
| FR5 | 组件必须保持仅渲染，不拥有任何状态、Effect、监听器、观察器、定时器或自有异步资源。                                                  | 当前源码                                            |

### Allowed variation

- **AV1 — 调用方 token。** 标签、变体、图标、自定义内容与已序列化值仍由调用方提供。
- **AV2 — 调用方样式。** 受支持的根样式输入可扩展该组件，而不替换其公共目标。
- **AV3 — 未匹配输入。** 不含任何匹配非空值的文本保持原样。

### Representative states

| State             | Required invariant                       | Allowed variation             |
| ----------------- | ---------------------------------------- | ----------------------------- |
| 纯文本            | 精确文本仍然可见。                       | 任意字符串内容。              |
| 结构化匹配        | 匹配的文本被替换为受委托的 Badge 内容。  | 标签、变体与图标。            |
| 自定义匹配        | 匹配的文本被替换为调用方渲染的内容。     | 调用方拥有的任意 React 节点。 |
| 重复匹配          | 每次出现都按阅读顺序被替换。             | 出现的数量与位置。            |
| 空 token 值       | 该值被忽略，渲染终止且文本得到保留。     | 与有效 token 并存的情况。     |
| 窄屏 / RTL 上下文 | 行内内容保持可读，并遵循周围文本的方向。 | 主题、方向与消息长度。        |

### Transformation and precedence order

- **ORD1 — 规范化候选。** 移除空的已序列化值，同时保留调用方顺序。
- **ORD2 — 字面匹配。** 为 RegExp 语法转义各个值，并从左到右扫描消息。
- **ORD3 — 渲染。** 保留未匹配的片段，并将每个匹配的 token 委托给 Badge 或调用方渲染器。
- **ORD4 — 组合根。** 应用组件目标与样式，然后组合可接受的使用方样式与根属性。

### Performance and resources

- **PR1 — 有限进展。** 每次成功匹配至少消耗一个 UTF-16 码元；空值无法进入匹配器。
- **PR2 — 仅渲染的投射。** 匹配在每次渲染时分配一个候选列表、一个查找映射和一个结果列表，且不拥有任何持久资源。

## Accessibility contract

- **AR1 — 阅读顺序。** 未匹配的文本与 token 内容在一个行内文本包装器内保持源阅读顺序。
- **AR2 — 受委托内容。** 结构化 token 的语义仍由 Badge 拥有；自定义 token 的语义仍由调用方拥有。
- **AR3 — 非交互根。** 该组件不引入任何 role、焦点目标、键盘命令、指针操作或实时区域行为。

## Design relationships

| Anatomy or state | Design requirement                | Representation authority   | Hierarchy role | Component contract |
| ---------------- | --------------------------------- | -------------------------- | -------------- | ------------------ |
| token 化文本     | 行内根保留周围的文本流。          | 当前源码与已发布文档       | 辅助           | FR1, FR5           |
| 渲染出的 token   | 将绘制委托给 Badge 或调用方内容。 | `component:Badge` 或调用方 | 辅助           | FR4, AR2           |

未记录任何组件本地的设计决策。

### Theme ownership

Chat family 文档拥有此子组件所继承的共享解剖结构与目标清单。现有的 `chat-tokenized-text` 目标仍位于行内根上。结构化 token 的绘制委托给 Badge，而自定义渲染的 token 内容仍由调用方拥有。尚未记录任何解剖结构与主题的映射；该区块在迁移期间是可选的，因此映射暂时推迟。

## Family and system relationships

- `component:Badge` 拥有结构化 token 的绘制、变体、图标与标签语义。
- `component:ChatComposerInput` 拥有 token 的插入、序列化、删除以及输入区选择行为。
- `architecture:public-component-api` 拥有已发布的导出、BaseProps 可达性、样式组合与 ref。
- `architecture:component-theming-surface` 拥有目标/解剖结构映射。
- `architecture:component-test-sufficiency` 拥有有界的、对变异敏感的证据。
- `spec:AST-029` 拥有本记录的验证映射所遵循的审计证据清单。

## Verification map

| Contract     | Verification                                                                                      | Representative states              | Mutation or failure expectation                     | Audit section                        |
| ------------ | ------------------------------------------------------------------------------------------------- | ---------------------------------- | --------------------------------------------------- | ------------------------------------ |
| FR1–FR3, PR1 | `ChatTokenizedText.test.tsx` 的纯文本、单个、多个、重复、特殊字符、周围文本、空值与自定义匹配测试 | 纯文本、结构化、自定义、重复、空值 | 丢失文本、零宽不终止，或错误的分支导致失败。        | `audit:ChatTokenizedText/behavior`   |
| FR4          | `ChatTokenizedText.test.tsx` 的 ref 与其余属性测试                                                | 纯文本根与 token 化根              | 丢弃的 ref 或属性会导致失败。                       | `audit:ChatTokenizedText/public-api` |
| FR1–FR4      | `ChatTokenizedText.a11y.chromium.spec.ts` 的渲染状态                                              | 纯文本、结构化、自定义             | 缺失或重复的 `chat-tokenized-text` 目标会导致失败。 | `audit:ChatTokenizedText/theming`    |
| RTL 关系     | `apps/storybook/rtl-audit/verified-not-applicable.json`                                           | 所有故事                           | —                                                   | `audit:ChatTokenizedText/i18n-rtl`   |

从源码读取，尚无针对性测试：

- ORD2：包含 RegExp 元字符的值按字面匹配。
- FR3：`variant` 与 `icon` 到达 Badge。
- FR4：`className`、`style` 与 `xstyle` 的组合。
- FR5、AR3：该组件自身没有状态、Effect 或交互。

## Decision log

未记录任何组件本地的决策。

## Open questions

- **OQ1 — 重叠或重复的 token 值应如何解析？** （`human-api`）目前在某一位置上，最先列出的值胜出，因此较短的前缀会拆分较长的值，而两个相同值中较晚的那个会被渲染。匹配是否应优先选择最长的值，以及重复值如何解析，会改变读者所看到的内容。

## Content boundary

本文件不重复使用方示例、Badge 策略、token 语法或输入区编辑行为。
