---
schema_version: 3
template_version: 7
kind: component
id: component:CommandPaletteInput
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-14
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/CommandPalette/CommandPaletteInput.test.tsx,
    packages/core/src/Field/__tests__/SearchKeyboard.interaction.browser.spec.ts,
    apps/storybook/stories/CommandPaletteInput.stories.tsx,
    apps/storybook/rtl-audit/targets.json,
    packages/core/src/theme/themingTargets.test.ts,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:component-test-sufficiency,
    architecture:component-theming-surface,
    architecture:interaction-modality,
    architecture:public-component-api,
  ]
contributing: []
system_specs: [spec:AST-017, spec:AST-020, spec:AST-056]
---

# CommandPaletteInput component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                             |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | 一个查询字段，带有由上下文支撑的搜索状态、可选的尾部内容，以及拆分式的包裹层/字段属性边界。                                                                                      |
| 行为          | 不带弹层属性的独立用法是一个 searchbox；调用方提供的弹层属性或 CommandPalette 上下文提供 combobox 状态与关联关系。在触摸键盘上，该字段显示“搜索”键且不自动更正（FR6）。          |
| 终端用户影响  | 屏幕阅读器用户获得的 role 与弹层状态，与是否存在受控的结果弹层相符。                                                                                                             |
| 构建者影响    | 由上下文拥有的弹层语义不能通过原生透传 props 替换；独立用法中由调用方自有的弹层语义仍然受支持。                                                                                  |
| 兼容性/就绪度 | 一个 `[fix]` 在保留已发布的调用方自有弹层关联的同时恢复了无弹层语义，并默认将字段命名为 "Search commands" 而非其占位符；主回调命名仍待 OQ1 决定。                                |
| 审查检查      | 拒绝未关联的独立 combobox 状态、可被覆盖的受拥有弹层语义、空的尾部装饰，或改变的 input ref 路由。                                                                                |
| 治理规则      | `architecture:public-component-api/INV2,INV4,INV5`; `spec:AST-017/FR1,FR3,FR5,FR7,FR53`; `spec:AST-020/FR1,FR2`; `spec:AST-056/AR2`; `family:input-fields/FR12`; WCAG 2.2 4.1.2. |

本表是供审查用的投影；下方的正文具有权威性。

## Intent

CommandPaletteInput 呈现命令面板的文本查询。它可以绑定到 CommandPalette 的搜索与导航上下文，或在没有结果弹层上下文时充当独立的搜索字段。

## Compatibility and migration

- 已发布的默认值保持不变：对于无弹层的独立语义输出以及默认无障碍名称，均为 `no`；调用方自有的弹层关联与所有其他 CommandPalette 输出保持等价
- 兼容性类别：针对独立语义，属于 `spec:AST-017/FR1,FR3,FR5` 下的契约恢复，因为无弹层的独立用法没有可保留的已发布弹层关联；针对默认名称，属于 `spec:AST-017/FR53` 下的无障碍行为修复
- 搜索键盘提示：FR6 的 `enterkeyhint` 与 `autocorrect` 是 `spec:AST-017/FR5,FR7` 下的补丁 `[feat]`；它们不改变任何 API，Enter 保持 FR2 的路由
- 受控/非受控行为：不变
- 迁移决定：`role="combobox"` 保留更早的独立语义，`label` 或 `aria-label` 保留一个具体名称；主回调命名问题仍待 OQ1 决定

使用方迁移说明应放在使用方文档与发布说明中。

## Ownership boundary

**拥有**

- Input 内部的排布：Search glyph、原生 Query 字段、Loading spinner 的位置，以及 Trailing content。
- 在 CommandPalette 上下文存在时，查询字段的 role 与弹层状态。
- 搜索值、值更新与键盘导航的上下文回退。

**不拥有 / 非目标**

- 结果弹层、选项收集、选择或搜索编排——由 `component:CommandPalette` 及其 list/item 各部分拥有。
- Spinner 与 search glyph 的渲染——委托给 Spinner 与 Icon。
- 调用方提供的尾部内容行为——由产品调用点拥有。

## Public concepts

| 概念     | 封闭取值或状态                                                   | 含义                               | 按变体/朝向/状态的可可用性 | 默认值           | 拥有者                          | 稳定性 | 无效值行为                                       |
| -------- | ---------------------------------------------------------------- | ---------------------------------- | -------------------------- | ---------------- | ------------------------------- | ------ | ------------------------------------------------ |
| 查询绑定 | 显式；CommandPalette 上下文；原生                                | 查询文本变更的来源与去向。         | 所有用法                   | 上下文，其次原生 | `component:CommandPaletteInput` | 已发布 | 缺失处理函数时保留原生状态                       |
| 弹层语义 | 独立 searchbox；独立调用方自有弹层；上下文式 CommandPalette 弹层 | 查询字段是否控制结果弹层。         | 依上下文而定               | 独立 searchbox   | `component:CommandPaletteInput` | 稳定   | 独立覆盖会持续生效；CommandPalette 上下文优先    |
| 尾部内容 | 忙碌指示器；`endContent`；两者；缺省                             | 查询之后的支持性状态或调用方内容。 | 所有用法                   | 缺省             | `component:CommandPaletteInput` | 已发布 | 布尔值、空字符串、null 与 undefined 值均视为缺省 |

## Behavioral and layout contract

| ID  | 候选不变式                                                                                                                                                                                       | 依据                                                         | 草稿审查状态                           |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ | -------------------------------------- |
| FR1 | 显式的 `value` 与 `onValueChange` 优先；否则由 CommandPalette 上下文提供搜索状态；两者都不存在时保留原生非受控状态。                                                                             | 已发布的源码、文档与测试                                     | 已验证当前行为                         |
| FR2 | 使用方的 `onKeyDown` 在上下文导航之前运行；阻止该事件，或处于活动中的 IME 组合状态，都会阻止上下文委托。                                                                                         | 已发布的源码与测试                                           | 已验证当前行为                         |
| FR3 | `ref` 与原生透传属性到达原生查询字段；独立用法中由调用方自有的弹层语义持续存在，而 CommandPalette 上下文拥有其弹层 role 与关联关系；`xstyle`、`className` 与 `style` 定制外围的 Input。          | 已发布的源码与文档；`architecture:public-component-api/INV5` | 已验证当前路由                         |
| FR4 | 待定状态与可渲染的 `endContent` 共用一个尾部内容组；布尔值、空字符串、null 与 undefined 不会产生空的尾部装饰。                                                                                   | React 渲染语义与当前工具契约                                 | 已验证当前行为                         |
| FR5 | 自动聚焦默认启用，并在内联 Dialog 内被抑制；`hasAutoFocus={false}` 同时抑制聚焦工作与 autofocus 标记。                                                                                           | 已发布的源码、文档与测试                                     | 已验证当前行为；浏览器时序证据仍待补充 |
| FR6 | 查询字段携带 `enterkeyhint="search"` 与 `autocorrect="off"`，无论独立使用还是在 CommandPalette 内，正如 `family:input-fields` FR12 对搜索输入所规定；无论按键显示什么，Enter 都保持 FR2 的路由。 | `family:input-fields/FR12, DEC-10`                           | 已验证当前行为                         |

### Allowed variation

- **AV1 — 查询内容。** 值、占位符、标签以及调用方提供的尾部内容可以变化，而不改变语义归属。
- **AV2 — 委托的视觉元素。** Icon 与 Spinner 可以在保持其公共契约的前提下改变内部标记。

### Representative states

| 状态             | 必需不变式                                                   | 允许的变化                  |
| ---------------- | ------------------------------------------------------------ | --------------------------- |
| 独立，无弹层     | 具名 searchbox，不带仅弹层用的 ARIA 状态。                   | 显式的值与变更处理函数。    |
| 独立，调用方弹层 | 调用方的 role、状态、关联关系与 active descendant 持续存在。 | 调用方自有的弹层模型。      |
| 上下文式，关闭   | 具名 combobox 引用该列表并报告折叠状态。                     | 查询值与尾部内容。          |
| 上下文式，无结果 | 具名 combobox 报告折叠状态且不引用任何列表。                 | 空消息或待定消息。          |
| 上下文式，打开   | 具名 combobox 引用该列表并报告展开状态。                     | 高亮选项与结果数量。        |
| 上下文式，已高亮 | Active descendant 命名由上下文拥有的高亮选项。               | 高亮索引。                  |
| 待定或尾部       | 支持性内容保持在逻辑上的尾部边缘。                           | Spinner、调用方内容或两者。 |
| 内联 Dialog      | 挂载不会从周围页面抢占焦点。                                 | 查询内容与结果内容。        |

### Transformation and precedence order

- **ORD1 — 搜索状态。** 显式 props → CommandPalette 上下文 → 原生非受控状态。
- **ORD2 — 键盘处理。** 使用方处理函数 → 默认阻止或 IME 组合检查 → CommandPalette 上下文处理函数。
- **ORD3 — 无障碍名称。** 原生 `aria-label` → `label` → 译后的默认名称 "Search commands"（DEC-1）。占位符文本永远不是名称。

### Performance and resources

- **PR1 — 聚焦调度。** 一个已挂载且符合条件的字段最多安排一次动画帧聚焦请求；不保留任何监听器或观察器。

## Accessibility contract

- **AR1 — 名称。** 原生查询字段始终从 ORD3 获得显式的无障碍名称，且永不从占位符文本取得名称，满足 `spec:AST-056/AR2` 与 WCAG 2.2 4.1.2。
- **AR2 — Role 与弹层状态。** 不带弹层属性的独立用法暴露一个不带仅弹层状态的 `searchbox`。提供自有弹层关联的独立调用方保留这些语义。CommandPalette 上下文暴露一个 `combobox`，带有上下文拥有的展开状态、列表关联、自动完成模式与 active descendant，遵循 `spec:AST-020/FR1,FR2` 与 WAI-ARIA combobox 模式。当面板中没有任何可选结果时，该字段报告折叠状态，且没有列表关联或 active descendant，而 active descendant 始终命名一个已存在的选项。
- **AR3 — 语义归属。** 在有 CommandPalette 上下文时，该字段拥有 `role`、`aria-expanded`、`aria-autocomplete`、`aria-controls` 与 `aria-activedescendant`，并且这些会替换相同的原生透传 props；其他 ARIA props（包括 `aria-haspopup` 与 `aria-owns`）照常透传。独立用法中调用方自有的 role 与关联关系保持完好。

## Design relationships

| 结构或状态      | 设计要求                                                                 | 表征权威             | 层级角色 | 组件契约         |
| --------------- | ------------------------------------------------------------------------ | -------------------- | -------- | ---------------- |
| Input           | 内联排布 Search glyph、Query 字段、Loading spinner 与 Trailing content。 | 当前源码与公共文档   | 显著     | FR3、FR4         |
| Search glyph    | 标识查询入口，而不添加名称。                                             | Icon 组件            | 辅助     | AR1              |
| 查询字段        | 接收文本、焦点、名称与弹层语义。                                         | 当前源码与无障碍标准 | 显著     | FR1–FR3、AR1–AR3 |
| Loading spinner | 在 Trailing content 之前指示待定的上下文搜索。                           | Spinner 组件         | 辅助     | FR4              |
| 尾部内容        | 将调用方内容保持在逻辑上的行内末端。                                     | 当前源码与公共文档   | 辅助     | FR4              |

## Family and system relationships

- `component:CommandPalette` 拥有结果弹层上下文、聚合组合，以及开放的“主题可达性”问题；本组件拥有默认 Input 的查询字段语义，并将它们绑定到该上下文。
- `spec:AST-017` 拥有针对已发布的独立调用方弹层与无弹层情形的兼容性分类。
- `spec:AST-020` 提供 WCAG 2.2 与所采用模式的证据边界。
- `spec:AST-056/AR2` 要求查询字段名称与占位符文本不同；ORD3 与 AR1 满足该要求。

## Verification map

| 契约     | 验证                                                                                                                                  | 代表性状态                                   | 变异或失败预期                                                                                    | 审计章节                             |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------ |
| FR1–FR3  | `CommandPaletteInput.test.tsx`                                                                                                        | 显式、上下文、被阻止的按键、原生、调用方弹层 | 反转状态优先级、重定向 ref、丢弃独立弹层关联，或允许上下文语义被覆盖，都会使聚焦的 DOM 测试失败。 | `audit:CommandPaletteInput/testing`  |
| FR4      | `CommandPaletteInput.test.tsx`                                                                                                        | 数值、空、忙碌、调用方内容                   | 真值路由会创建空的装饰，或把数值内容移离尾部边缘。                                                | `audit:CommandPaletteInput/behavior` |
| FR5      | 聚焦的单元测试加上精确 head 的浏览器证据                                                                                              | 启用、禁用、内联                             | 符合条件时焦点丢失、禁用的聚焦被安排，或内联模式抢占焦点。                                        | `audit:CommandPaletteInput/behavior` |
| FR6      | `CommandPaletteInput.test.tsx` 的属性与 Enter 用例，独立与上下文中；在触摸仿真手机上运行 `SearchKeyboard.interaction.browser.spec.ts` | 独立；上下文式；带触摸仿真的手机视口         | 缺少 `enterkeyhint` 或 `autocorrect`，或 Enter 路由改变，都会失败。                               | `audit:CommandPaletteInput/behavior` |
| AR1–AR3  | 单元测试、精确 head 的 axe/浏览器运行，以及源码审查                                                                                   | 独立、打开、关闭、已高亮                     | 错误的 role/状态、使用方覆盖受拥有的属性，或源自占位符的名称，都会使语义与名称断言失败。          | `audit:CommandPaletteInput/a11y`     |
| 主题/RTL | 目标清单、Storybook 测试夹具与 RTL D2 审计                                                                                            | 独立尾部内容、上下文式                       | 目标丢失或物理顺序错误都会使受拥有的测试夹具失败。                                                | `audit:CommandPaletteInput/theming`  |

## Decision log

### DEC-1 — The query field's default name is "Search commands"

**引用：** `component:CommandPaletteInput/DEC-1`

**决策者：** `cixzhang`, 2026-10-14

屏幕阅读器用户到达该字段时听到的是它的用途，无论占位符说了什么，也无论是否设置了占位符。默认值是固定的、可本地化的 "Search commands"；`label` 与 `aria-label` 替换它，而占位符文本永远不是名称。

已否决：回退到占位符；占位符由调用方写为视觉提示，而 AST-056 AR2 不接受其作为名称。

## Open questions

- **OQ1 — 已发布的 `onValueChange(value)` 主回调与原生事件 `onChange(event)` 例外，应如何迁移到共享的 `onChange` 回调语法，而不破坏现有使用方？** (`human-api`)

## Content boundary

本文件不重复使用方 prop 表格/示例、当前审计结果、实现步骤，或 family/system 规则。它链接到各自的所有者。
