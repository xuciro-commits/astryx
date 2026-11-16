---
schema_version: 3
template_version: 5
kind: component
id: component:ChatComposerInput
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-14
owners: [cixzhang]
review_triggers: [public-api, behavior, accessibility, interaction, theming]
verified_by:
  [
    packages/core/src/Chat/ChatComposerInput.test.tsx,
    packages/core/src/Chat/ChatComposerInput.public.test.ts,
    packages/core/src/Chat/__tests__/ChatComposerReturnKey.a11y.chromium.spec.ts,
    packages/core/src/Chat/__tests__/ChatComposerImeCaret.a11y.chromium.spec.ts,
    apps/storybook/stories/ChatComposerInput.stories.tsx,
    apps/storybook/rtl-audit/verified-not-applicable.json,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:interaction-modality,
    architecture:public-component-api,
    architecture:knowledge-contracts,
  ]
contributing: []
system_specs: [spec:AST-002, spec:AST-029]
---

# ChatComposerInput component contract

## Contract at a glance

| 区域          | 契约                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 公共契约      | ChatComposerInput 仍是 ChatComposer 的可选富编辑界面，提供受控草稿、触发器、历史、粘贴、文件与命令式接缝。每个触发器定义可通过 `hasMultiWordQuery` 选择启用多词查询，默认 `false`。`enterKeyHint`（`EnterKeyHint`，默认 `send`）为触摸键盘的 Return 键提供标签（FR17）。                                                                                                                               |
| 行为          | 每条编辑路径都让序列化草稿保持可观察。粘贴或拖放的文件会到达 `onFiles`；使用方的 `onPaste` 在可选的粘贴转 token 转换之前，对纯文本拥有优先处理权。                                                                                                                                                                                                                                                     |
| 终端用户影响  | 通过听写或以其他编程方式插入的文本可发送，绝不会被空占位符遮蔽；拖放的文件会进入产品的附件流程。在手机上，Return 键显示为“发送”，与 Enter 的行为一致。                                                                                                                                                                                                                                                 |
| 构建者影响    | 现有 props、回调签名、导出与 token 序列化均未改变。依赖已记录的 `onPaste` 与 `onFiles` 路径的构建者会收到这些回调，但 FR5 与 FR6 记录了实施缺口的情形除外；`hasMultiWordQuery` 是新增的可选触发器字段，`enterKeyHint` 是新增的可选 prop，其默认值 `send` 会被让 Enter 插入换行的 composer 替换为 `enter`（FR17）。每个触发器都会获得兼容性与迁移一节中列出的触发器按键修正（FR10、FR13、FR15、FR16）。 |
| 兼容性/就绪度 | 补丁兼容。一个新增的可选触发器字段（DEC-1），一个新增的带键盘提示默认值的可选 prop（DEC-2，属于 `spec:AST-017` FR5、FR7 下的补丁 `[feat]`），以及适用于每个触发器的触发器按键修正（FR10、FR13、FR15、FR16）；无视觉决策。实施缺口记录在 FR5、FR6、FR10 与 PR2 上。                                                                                                                                     |
| 审查检查      | 驳回以下情况：在不更新序列化草稿的情况下改动 DOM 的编辑路径；可能离开页面或绕过 `onFiles` 的文件拖放；绕过使用方拦截的文本粘贴；被改变的提交/token 语义；会改动已输入文本的触发器查询；从更早的触发器查询中选取某一行的按键；发送后重新打开的菜单；改变 Enter 行为的 Return 键标签；接受任意字符串的 `enterKeyHint` 类型。                                                                             |
| 管辖规则      | `architecture:public-component-api/INV1`, `INV2`–`INV4`, `INV25`; `architecture:interaction-modality/INV1–INV4`; `architecture:knowledge-contracts/INV11, INV16`; `spec:AST-002`; `spec:AST-029`; `component:TextInput/FR16, DEC-1`; rubric B15.                                                                                                                                                       |

此表是审查视图；下文正文具有权威性。

## Intent

当纯自定义 textarea 不足时，ChatComposerInput 为 ChatComposer 提供富编辑界面。它拥有 contenteditable 文本与选区、序列化的行内 token、触发器菜单、历史召回、粘贴与文件接收，以及命令式编辑句柄。

## Compatibility and migration

- 已发布默认值保持不变：是
- 兼容性类别：补丁兼容；一个新增的可选触发器字段，一个新增的可选 prop `enterKeyHint`（其 `send` 默认值是触摸键盘提示，不改变 Enter 的行为；属于补丁 `[feat]`，`spec:AST-017` FR5、FR7；`enterKeyHint="enter"` 保留普通 Return 键），以及适用于每个触发器的触发器按键修正
- 受控与组合行为：未改变
- 迁移决策：无
- 触发器查询形态：`hasMultiWordQuery` 是新增的可选触发器字段；省略它则保持单 token 查询
- 每个触发器，无论是否选择启用，也都会获得以下补丁兼容修正：
  - FR13，修正：按键绝不会选取为更早查询返回的行；在发送、清空、选取或关闭之后到达的结果会被丢弃，而不是重新打开菜单。
  - FR15，修正：IME 组合期间的按键绝不会选取某行或移动高亮行。
  - FR16，修正：按下 Escape 后，在同一查询持续增长期间菜单保持隐藏，而不会在下次按键时重新打开。
  - FR10，修正：触发器字符之前的制表符是边界，与空格或换行相同。

## Ownership boundary

**拥有**

- contenteditable 界面、其无障碍编辑语义，以及序列化。
- 编辑器内触发器菜单的调用与 token 插入。
- Enter 提交、历史导航、粘贴优先级、文件接收，以及命令式编辑的可观察性。
- 向 ChatComposer 注册编辑焦点控件。
- 编辑器上触摸键盘的 Return 键标签（FR17）。

**不拥有 / 非目标**

- ChatComposer 布局、发送按钮状态、状态放置，或外壳的层级提升。
- 针对文件的产品校验、上传、进度或错误处理。
- 调用方提供的搜索结果数据、自定义 token 含义或自定义 token 交互语义。
- 编辑器、token、菜单或放置目标的新视觉表现形式。

## Public concepts

| 概念          | 封闭值或状态                                                                | 含义                                                                             | 按状态可用性         | 默认           | 所有者                        | 稳定性 | 无效值行为                                          |
| ------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------- | -------------- | ----------------------------- | ------ | --------------------------------------------------- |
| 草稿存储      | DOM 所有；`value` 受控；ChatComposer 上下文受控                             | 选择序列化草稿的来源与可观察的变更通道。                                         | 每个编辑器           | 上下文或空 DOM | `component:ChatComposerInput` | stable | 显式 `value` 优先；不支持的值会被 TypeScript 拒绝。 |
| 提交          | Enter；Shift+Enter；IME Enter；使用方取消的 Enter                           | 仅在未取消、未按 Shift 且非组合状态的 Enter 上提交一份去除首尾空白后的非空草稿。 | 已启用的编辑器       | Enter 提交     | `component:ChatComposerInput` | stable | 空或组合中的提交会被忽略。                          |
| 触发器菜单    | 省略；一个或多个触发器定义                                                  | 在配置的字符处打开建议，并插入文本或序列化 token。                               | 配置了触发器时       | 省略           | `component:ChatComposerInput` | stable | 未知的触发器字符保持为普通文本。                    |
| 触发器查询    | 单 token；多词                                                              | 设定活动触发器查询结束的位置，如 FR10 与 FR11 所述。                             | 触发器处于活动状态时 | 单 token       | `component:ChatComposerInput` | stable | 省略 `hasMultiWordQuery` 保持单 token 查询。        |
| 历史          | 已启用；已禁用                                                              | 在文本边界处用 ArrowUp 与 ArrowDown 召回已提交的草稿。                           | 已启用且存在历史时   | 已启用         | `component:ChatComposerInput` | stable | 文本中部的方向键保留原生光标行为。                  |
| 文本粘贴      | 使用方处理；粘贴转 token；纯文本                                            | 先让 `onPaste` 优先处理，然后是可选的 token 转换，最后插入纯文本。               | 已启用的编辑器       | 长粘贴转 token | `component:ChatComposerInput` | stable | 已处理的回调会阻止后续的插入路径。                  |
| 文件接收      | 粘贴；拖放                                                                  | 阻止浏览器导航并将文件传给 `onFiles`。                                           | 提供了文件时         | 无回调         | `component:ChatComposerInput` | stable | 空的拖放不做任何事；禁用的输入不会发出文件。        |
| 命令式编辑    | 插入 token；展开 token；插入文本；聚焦；获取值                              | 让听写等组合类功能通过编辑器拥有的行为运行。                                     | 挂载期间             | 无             | `component:ChatComposerInput` | stable | 未挂载编辑器时的调用是空操作，或返回空值。          |
| Return 键标签 | `EnterKeyHint`：`enter`、`done`、`go`、`next`、`previous`、`search`、`send` | 触摸键盘的 Return 键显示的内容；它不改变 Enter 的行为。                          | 每个编辑器           | `send`         | `component:ChatComposerInput` | stable | TypeScript 会拒绝其他值。                           |

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                   | 依据                                                              |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| FR1  | 每个改变序列化内容的用户编辑或命令式编辑都必须更新空状态，并通过活动的 `onChange` 通道发出生效值。命令式 `handleRef.insertToken` 与键入一样只发出一次。                                                                                                                                                                                                                                                                  | 已发布的 `onChange` 契约、命令式句柄，以及 ChatDictation 调用点。 |
| FR2  | 不带 Shift 的 Enter 必须提交一份去除首尾空白后的非空草稿并清空它，除非事件处于组合中、触发器菜单消费了它，或使用方阻止了默认行为。                                                                                                                                                                                                                                                                                       | 已发布的实现与使用方文档。                                        |
| FR3  | Shift+Enter 与文本中部的历史方向键必须保留原生多行编辑行为。                                                                                                                                                                                                                                                                                                                                                             | 已发布的实现与针对性测试。                                        |
| FR4  | 直接提供给 ChatComposerInput 的 `value` 必须优先于 ChatComposer 上下文，而发出的回显不得重建 DOM 或移动光标。                                                                                                                                                                                                                                                                                                            | 已发布的受控优先级与回归测试。                                    |
| FR5  | 纯文本粘贴的优先级必须是使用方 `onPaste` → 已配置/默认的粘贴转 token → 纯插入。实施缺口：选区起始于某个 token 内部的粘贴会将文本插入该 token 之后，且不调用 `onPaste`。                                                                                                                                                                                                                                                  | 公共回调含义与客观的回调组合。                                    |
| FR6  | 文件粘贴与文件拖放必须阻止原生插入/导航，并将相同顺序的 `File[]` 传给 `onFiles`；禁用的编辑器不得发出文件回调。实施缺口：选区起始于某个 token 内部的文件粘贴永远不会到达 `onFiles`。                                                                                                                                                                                                                                     | 已发布的公共 `onFiles` 契约与使用方文档。                         |
| FR7  | 触发器菜单的键盘处理必须在使用方与内置编辑器处理之前运行；IME 组合绝不能提交。                                                                                                                                                                                                                                                                                                                                           | 已发布的交互契约与测试。                                          |
| FR8  | 历史召回必须仅在草稿边界处生效，并且在越过最新条目后必须恢复待处理草稿。                                                                                                                                                                                                                                                                                                                                                 | 已发布的行为与测试。                                              |
| FR9  | 根元素必须继续转发其 ref、BaseProps 属性与样式接缝；命令式句柄仍单独位于 `handleRef` 中。                                                                                                                                                                                                                                                                                                                                | 已发布的公共 API 与 `architecture:public-component-api`。         |
| FR10 | 触发器在其字符位于文本开头，或跟随空格、制表符或换行时激活，其查询从该字符之后延伸到光标处。在活动的多词查询内部，FR11 限制哪些字符会激活。不换行空格（例如插入 token 之后的那一个）不是边界。单 token 查询在空格、制表符或换行处结束。实施缺口：位于文本节点开头的触发器字符会激活它前面的内容，例如紧跟在插入的 token 之后、其尾部不换行空格之前键入的 `@`。                                                           | 已发布的触发器检测；DEC-1。                                       |
| FR11 | `hasMultiWordQuery: true` 的触发器会在空格与标点之间保持其查询。查询仅在换行处、超过实现自有的至少 64 个字符的长度界限，或同一触发器的字符在空格、制表符或换行之后开始新查询时结束；不适用词数、标点列表或终止回调。在活动的多词查询内部，另一个触发器的字符不会按 FR10 激活，因此查询会继续穿过它。                                                                                                                     | DEC-1。                                                           |
| FR12 | 结束触发器查询必须使已输入文本保持不变。只有显式选取当前行才会替换从触发器字符到光标的范围。                                                                                                                                                                                                                                                                                                                             | DEC-1。                                                           |
| FR13 | 当针对活动查询的较新搜索尚未完成时，不带 Shift 的 Enter 按原样提交草稿，且不得选取任何行；任何键都不会选取为更早查询返回的行。已被取代的查询的结果，或在选取、关闭、提交或查询结束之后到达的结果会被丢弃，因此菜单绝不会在已发送或已清空的草稿之上重新打开。这适用于每个触发器。                                                                                                                                         | DEC-1；参考聊天 composer 行为。                                   |
| FR14 | 当多词查询结束且没有匹配项时，除非触发器提供了 `emptySearchText`，否则菜单隐藏。无匹配项的单 token 查询会显示空消息。                                                                                                                                                                                                                                                                                                    | DEC-1。                                                           |
| FR15 | IME 组合期间按下的键不得选取某行或移动高亮行。                                                                                                                                                                                                                                                                                                                                                                           | DEC-1；FR7。                                                      |
| FR16 | 在可见菜单上按 Escape 会将其关闭，并且在同一查询从同一触发器持续增长期间，菜单保持隐藏。菜单打开时，在编辑器上或菜单内按下会保持打开，在别处按下则关闭（`architecture:layer-runtime`）。                                                                                                                                                                                                                                 | DEC-1。                                                           |
| FR17 | 编辑器带有 `enterkeyhint`：设置了 `enterKeyHint` 值时使用该值，否则为 `send`，因为 Enter 执行发送（FR2）。`enterKeyHint` 采用封闭联合类型 `EnterKeyHint`（`component:TextInput` FR16），因此 TypeScript 会拒绝任何其他值。该提示仅用于标注该键：无论它显示什么，Enter 与 Shift+Enter 的行为由 FR2 与 FR3 决定，因此 `onKeyDown` 会让 Enter 插入换行的 composer 会传入 `enter`。ChatComposer 的默认输入带有相同的默认值。 | DEC-2；`component:TextInput` DEC-1                                |
| FR18 | 当光标位于某个 token 尾随空格内或紧随其后，且该空格之后没有文本时，按一次 Backspace 会一步移除该 token 与该空格，并使文本恢复到插入该 token 之前的状态，不产生额外换行；被清空的最后一行会保留浏览器的占位符。                                                                                                                                                                                                           | 当前源代码与测试                                                  |

### Allowed variation

- **AV1 — 搜索内容。** 构建者拥有触发器字符、搜索源、条目渲染与插入值。
- **AV2 — token 内容。** 构建者可以使用结构化 Badge 形式或自定义渲染的逃生通道，并拥有自定义语义。
- **AV3 — 产品文件工作流。** 在 `onFiles` 接收文件之后，构建者拥有接受的类型、校验、上传、进度与错误处理。

### Representative states

| 状态                   | 必需不变式                                                                            | 允许的变化           |
| ---------------------- | ------------------------------------------------------------------------------------- | -------------------- |
| 空                     | 占位符可见且序列化值为空。                                                            | 占位符文案。         |
| 键入或命令式插入的文本 | 占位符不存在，且相同的序列化值对 ChatComposer 与回调可观察，包括命令式 token（FR1）。 | 草稿内容。           |
| 受控更新               | 外部值被反映，且不破坏活动光标，也不把过期回显当作权威。                              | 父级更新时机。       |
| 触发器菜单打开         | 暴露 combobox 语义与活动选项关联；菜单交互拥有其按键。                                | 搜索源与条目渲染。   |
| 触发器搜索待处理       | Enter 按原样提交草稿；无法选取更早查询的行。                                          | 加载文案与源延迟。   |
| 触发器菜单隐藏         | 编辑器报告折叠的 combobox，菜单不消费任何按键。                                       | 菜单隐藏的原因。     |
| 文件粘贴或拖放         | 阻止原生插入/导航，文件一次性到达 `onFiles`（FR6 记录了一个实施缺口）。               | 文件类型与产品处理。 |
| 已禁用                 | 编辑与文件回调不可用，且禁用状态被暴露。                                              | 产品原因与周边状态。 |

### Transformation and precedence order

- **ORD1 — 草稿来源。** 显式 `value` → ChatComposer 上下文值 → 编辑器 DOM。
- **ORD2 — 变更通道。** `value` 为显式时使用显式受控输入回调 → ChatComposer 上下文回调 → 独立的本地回调。
- **ORD3 — 按键处理。** 触发器菜单 → 使用方 `onKeyDown` → IME/提交/历史行为。
- **ORD4 — 纯文本粘贴。** 使用方 `onPaste` → 粘贴转 token 行为 → 纯插入（FR5 记录了一个实施缺口）。
- **ORD5 — 文件接收。** 剪贴板或数据传输中的文件 → 阻止原生行为 → 启用时发出 `onFiles`（FR6 记录了一个实施缺口）。

### Performance and resources

- **PR1 — 选区工作。** 选区的读取与写入限定在已挂载的可编辑元素内，且仅在直接编辑操作或受控同步时运行。
- **PR2 — 异步触发器工作。** 搜索取消通过提供的 `SearchSource` 及其可选的 `cancel` 进行，`debounceMs` 设定异步搜索开始前的延迟。实施缺口：每次改变查询的按键也会立即调用 `search('')` 以检测源是否为异步，因此异步源会收到一次无延迟的搜索。
- **PR3 — Portal 清理。** 内容变化或卸载时，token portal 会通过现有的 token 钩子清理。

## Accessibility contract

- **AR1 — 编辑语义。** 没有触发器时，该界面是一个具名多行文本框；有触发器时，它暴露所采用的 combobox 语义，且不使用无效的多行 ARIA。
- **AR2 — 禁用状态。** 禁用的编辑通过 `aria-disabled` 暴露，且不能接受内容或文件回调。
- **AR3 — 键盘归属。** IME、触发器菜单按键、使用方取消、Enter 提交与仅限边界的历史不会互相抢占按键。
- **AR4 — 焦点可见性。** 在 ChatComposer 中组合时，语义编辑器的焦点所有者驱动外壳共享的键盘焦点指示器。
- **AR5 — 折叠的建议。** 菜单隐藏时，编辑器报告 `aria-expanded="false"`，不暴露活动后代，且方向键、Enter 与 Escape 会到达编辑器及其周围。

## Design relationships

| 解剖结构或状态 | 设计要求                  | 表示权威             | 层级角色 | 组件契约            |
| -------------- | ------------------------- | -------------------- | -------- | ------------------- |
| 输入根元素     | 现有的主题目标            | 所观察到的实现       | 支撑性   | FR9                 |
| 可编辑界面     | 普通 composer 编辑界面    | ChatComposer 系列    | 突出     | FR1–FR4, AR1–AR4    |
| 占位符         | 为空时的次要文本          | 当前 token 角色      | 支撑性   | FR1                 |
| 触发器菜单     | 委托的 Typeahead 行为     | Typeahead 所有者     | 浮动     | FR7, FR10–FR16, AR5 |
| 行内 token     | 结构化 Badge 或调用方内容 | Badge 或调用方所有者 | 支撑性   | AV2                 |

现有的 `chat-composer-input` 目标仍保留在根元素上。本记录不新增主题目标，也不决定新的视觉状态。

## Family and system relationships

- `component:ChatComposer` 拥有布局、提交编排、发送状态与外壳焦点环；本组件拥有编辑界面及其变更通道。
- Typeahead 与 SearchSource 拥有结果收集行为；ChatComposerInput 拥有触发器菜单何时参与编辑器按键优先级。
- `architecture:interaction-modality` 拥有共享的焦点可见性机制。
- `spec:AST-029` 拥有观察性审计回填边界。

## Verification map

| 契约                  | 验证                                                                                                                                                                                                                                                                                                                                      | 代表性状态                                                      | 变异或失败预期                                                                                                                 | 审计章节                                |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------- |
| FR1, ORD1–ORD2        | 针对命令式插入（文本与 token）与受控同步的定向测试；`ImperativeInsertion` play                                                                                                                                                                                                                                                            | 空 → 插入文本；受控回显；外部覆盖                               | 文本仅出现在 DOM 中、占位符仍存在、回调过期，或光标跳跃。                                                                      | `audit:ChatComposerInput/behavior`      |
| FR2–FR3, FR7–FR8, AR3 | 针对键盘、IME、触发器与历史的定向测试                                                                                                                                                                                                                                                                                                     | Enter；Shift+Enter；组合；被取消的按键；边界与文本中部的方向键  | 某个键提交两次、在组合期间提交，或抢占原生编辑。                                                                               | `audit:ChatComposerInput/interaction`   |
| FR10–FR16, AR5        | 针对触发器查询与触发器键盘的定向测试；“在编辑器内或菜单内按下时保持触发器菜单打开，在别处按下时关闭它”                                                                                                                                                                                                                                    | 单 token；多词；换行；长度界限；待处理搜索；无匹配；IME；Escape | 查询过早结束或改动文本、Enter 在搜索待处理时选取更早查询的行或无法提交、发送之后迟到的结果重新打开菜单，或隐藏的菜单消费按键。 | `audit:ChatComposerInput/interaction`   |
| FR5, ORD4             | 针对长粘贴拦截的定向测试                                                                                                                                                                                                                                                                                                                  | 使用方已处理；token 转换；纯插入                                | 跳过使用方拦截，或运行了多条插入路径。                                                                                         | `audit:ChatComposerInput/behavior`      |
| FR6, ORD5, AR2        | 针对粘贴/拖放的定向测试与 `FileDrop` play                                                                                                                                                                                                                                                                                                 | 粘贴；拖放；禁用                                                | 文件导致页面离开、插入编辑器、绕过 `onFiles`，或在禁用时发出。                                                                 | `audit:ChatComposerInput/behavior`      |
| AR1, AR4              | role/name/ARIA 测试，加上 exact-head 无障碍与视觉门禁                                                                                                                                                                                                                                                                                     | 文本框；combobox；禁用；键盘焦点                                | 名称、角色、多行、展开、禁用或可见焦点语义回归。                                                                               | `audit:ChatComposerInput/accessibility` |
| FR9                   | ref、目标、包与仓库检查                                                                                                                                                                                                                                                                                                                   | ref；BaseProps；xstyle；className；style                        | 根元素的所有权或某个样式接缝被移动或消失。                                                                                     | `audit:ChatComposerInput/api`           |
| FR17                  | `ChatComposerInput.test.tsx` 触摸键盘 Return 键测试套件（默认 `send`、所设的值、ChatComposer 默认输入内为 `send`、在每种标签下 Enter 都提交）；由 `pnpm typecheck` 运行的 `ChatComposerInput.public.test.ts`，验证 `EnterKeyHint` 拒绝任意或未收窄的字符串；`ChatComposerReturnKey.a11y.chromium.spec.ts`，验证点击所聚焦编辑器上的该属性 | 默认；`enter`；ChatComposer 内；带触摸仿真的手机视口            | `enterkeyhint` 缺失或错误、标签导致 Enter 无法提交，或类型接受 `string` 时失败。                                               | `audit:ChatComposerInput/api`           |
| FR18                  | `ChatComposerInput.test.tsx` 的“在 token 之后按一次 Backspace 会移除该 token 及其空格”与“在以 token 开头的最后一行按一次 Backspace 会为光标保留该行”；`ChatComposerImeCaret.a11y.chromium.spec.ts`                                                                                                                                        | 插入 token 之后、其空格之后没有文本时；以 token 开头的最后一行  | 按一次 Backspace 后仍残留 token 或其尾随空格、在 token 之前的文本之外新增了换行，或被清空的最后一行丢失了该行，均为失败。      | `audit:ChatComposerInput/interaction`   |

## Decision log

### DEC-1 — Trigger queries are non-destructive and act only on current results

**Reference:** `component:ChatComposerInput/DEC-1`

**Decider:** `cixzhang`, `2026-10-06`; 待处理搜索时的 Enter，`2026-10-14`；跨触发器延续采用相同的参考 composer 方向，`2026-10-14`

只有调用方知道其建议是否包含空格，因此多词查询是按触发器选择启用的，像命令这样的单 token 触发器仍然在空白处结束。多词查询绝不会改变使用者键入的内容：它按 FR11 所述结束，且只有显式选取才会替换文本。建议仅作用于当前查询：搜索待处理时，Enter 按原样发送消息，绝不会选取更早查询的行；发送之后到达的结果会被丢弃，因此菜单绝不会在已清空的 composer 之上重新打开。这与参考聊天 composer 一致：消息完全可以仅以触发器开头。未匹配的多词短语会隐藏菜单，而不是用空面板遮住正文。在活动的多词查询内部，另一个触发器的字符不会启动查询，因此 `@Jordan /` 保持提及查询；而同一触发器的字符会按 FR11 所述启动新查询；两者都与参考聊天 composer 一致。

已否决：词数上限、标点终止符或终止回调；它们会截断真实姓名，且依赖语言。

已否决：将 Enter 保持到待处理搜索完成；这会阻止发送仅以触发器开头的消息。

### DEC-2 — The Return key says Send

**Reference:** `component:ChatComposerInput/DEC-2`

**Decider:** `cixzhang`, `2026-11-01`

Enter 发送草稿（FR2），因此编辑器将触摸键盘的 Return 键标注为“发送”，正如组件对它能推导出的内容作出决定（`architecture:public-component-api` INV4）。Enter 做其他事情的调用方会传入自己的 `enterKeyHint`。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表格、示例、当前审计分数或视觉设计理由。它记录已发布的行为、客观的修正，以及 DEC-1 中的触发器查询契约，且不决定新的视觉表现形式。
