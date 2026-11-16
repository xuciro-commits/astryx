---
schema_version: 4
template_version: 1
kind: system-spec
id: spec:AST-032
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-09-22
phase: accepted
owners: [cixzhang, imdreamrunner]
affects_architecture: [architecture:icon-resolution-and-component-slots]
affects_families: []
affects_contributing: []
affects_consumer_docs: [FileInput, ChatSendButton, Icon]
---

# Upload and send icon theming

## Intent

让主题为 FileInput 的上传可操作元素和 ChatSendButton 的发送动作选择图形，而无需重绘任何其他图标。上传是一个共享语义图标：任何执行上传的界面都可以渲染它，每个主题以自己的风格绘制它。发送是 ChatSendButton 的一个角色，由主题映射到某个共享图标。

## Non-goals

- 添加一个共享的 `send` 名称。
- 更改共享 `arrowUp` 图标的含义或图形。
- 更改 FileInput 或 ChatSendButton 的交互、布局、尺寸或无障碍表现。
- 移除或更改 ChatSendButton 现有的 `sendIcon` prop。
- 更改 ChatSendButton 的停止状态图标。
- 规定某种特定的上传、发送或方向性绘制方式。
- 决定还有哪些其他组件渲染 `upload`；这由每个组件自己的契约决定。

## Requirements

- **FR1 — 上传是一个共享图标。** `IconName` 必须包含 `upload`，其共享含义为从用户设备发送文件或内容。FileInput 的上传可操作元素必须在输入模式和拖放区模式下都渲染 `upload`。
- **FR2 — 发送是 ChatSendButton 的一个角色。** `ComponentIconSlotMap` 必须包含 `chat-send-button-send`。ChatSendButton 的发送状态必须解析该槽位，并以 `arrowUp` 作为回退。
- **FR3 — 现有的实例配置保持优先。** 显式的 `ChatSendButton.sendIcon` 必须继续优先于活动主题的组件槽位映射。FileInput 未为其上传图标提供实例 prop。
- **FR4 — 主题独立绘制 upload 并映射 send。** 主题可以通过其 `icons` 映射绘制 `upload`，就像它绘制任何共享名称一样，也可以通过 `componentIcons` 将 `chat-send-button-send` 映射到现有的共享 `IconName` 或 `null`。绘制 `upload` 不得更改 `arrowUp` 或任何其他共享名称，映射发送槽位也不得更改 `upload`。
- **FR5 — 默认值保持几何与无障碍表现。** 当没有为 `upload` 提供主题图形时，FileInput 必须渲染默认的 `upload` 图形，并保持其现有的尺寸、位置、颜色和无障碍行为。该默认图形必须描绘上传，且必须可与 `arrowUp` 区分。在没有槽位映射且没有 `sendIcon` 时，ChatSendButton 必须渲染 `arrowUp`，并保持其现有的尺寸、位置和无障碍行为。Sortable Table 以及所有其他 `arrowUp` 使用方必须保持不变。
- **FR6 — 每个随附的注册表都绘制 upload。** 默认注册表、每个捆绑主题以及每个 CLI 主题模板都必须以该注册表自身的风格提供 `upload` 图形。公共的 `IconRegistry` 类型描述一个完整的注册表，必须像要求其他每个共享名称一样要求 `upload`。使用方通过添加一个以自身注册表风格绘制的 `upload` 条目来完成迁移。
- **IR1 — 所有者界面保持同步。** 对于 upload：`IconName`、默认注册表、每个捆绑主题与 CLI 主题模板、文档中的共享图标名称清单、FileInput 源码与文档，以及针对性的注册表与 FileInput 测试必须一起更改。对于 send：公共组件槽位映射、ChatSendButton 源码、其组件文档与当前契约，以及针对性的解析器与组件测试必须一起更改。

### Platform support

- 支持的特性/引擎下限：与当前图标解析器相同，不变。
- 不支持的行为：不变；没有 `upload` 图形或发送槽位映射的主题会使用默认图形或组件回退。
- 浏览器证据：FileInput 的默认字形发生变化，因此真实浏览器视觉证据必须显示两种 FileInput 模式在已随附主题中都渲染上传图形，且几何不变。ChatSendButton 的默认值无需证据，因为其图形与几何都不变；解析器与组件测试覆盖槽位优先级和回退。

## Current-state impact

当前 `main` 为这两个角色直接渲染共享的 `arrowUp` 图标：

| 所有者                   | 实例覆盖   | 主题控制                     | 默认值             |
| ------------------------ | ---------- | ---------------------------- | ------------------ |
| FileInput 上传可操作元素 | 无         | `icons.upload`               | 默认 `upload` 图形 |
| ChatSendButton 发送状态  | `sendIcon` | `chat-send-button-send` 槽位 | `arrowUp`          |

FileInput 的默认字形从方向箭头变为上传图形；其尺寸、位置、颜色和无障碍行为保持不变。FileInput 不再遵循主题的 `arrowUp` 图形：主题通过 `upload` 重新设计它，而没有 `upload` 图形的主题会在该处显示默认上传图形。ChatSendButton 保留其默认图形，并在该槽位实现后解析自己的槽位。每个 Astryx 随附的注册表都会新增 `upload` 条目，而完整的注册表要求 `upload`（FR6）。

## Verification

| 契约    | 验证                                                                                  | 代表性状态                                                 | 变异或失败预期                                                                                          |
| ------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| FR1     | Icon 公共类型与注册表测试；渲染后的 FileInput 测试                                    | 默认注册表、主题 `icons.upload`、输入与拖放区模式          | `IconName` 中缺少 `upload`、FileInput 读取另一个名称，或主题 `upload` 图形未到达 FileInput，均失败。    |
| FR2–FR3 | 组件槽位类型与解析器测试；渲染后的 ChatSendButton 优先级测试                          | 默认主题、已映射名称、显式 `null`、显式 `sendIcon`         | 槽位缺失或拼写错误、直接查找 `arrowUp`、忽略映射，或主题覆盖调用方内容，均失败。                        |
| FR4     | 带独立主题覆盖的注册表解析测试                                                        | 仅绘制 `upload` 的主题；仅映射发送槽位的主题               | 改变 `arrowUp` 或其他名称的主题 `upload` 图形，或改变 `upload` 的发送映射，均失败。                     |
| FR5     | 针对性的 FileInput 与 ChatSendButton 测试；现有 Table 测试；真实浏览器视觉证据        | 未主题化与已随附主题；浅色与深色；输入、拖放区、发送与排序 | 几何或无障碍输出发生变化、`upload` 默认图形与 `arrowUp` 相同，或任何 `arrowUp` 使用方发生变化，均失败。 |
| FR6     | 公共类型测试；针对默认注册表、捆绑主题与 CLI 主题模板的注册表完整性测试；主题回退测试 | 完整注册表；没有 `upload` 图形的主题                       | 随附注册表缺少 `upload`、缺少 `upload` 的完整注册表仍能编译，或省略 `upload` 后渲染出空白，均失败。     |
| IR1     | `pnpm check:knowledge`、针对性的文档/源码一致性断言                                   | 共享图标名称清单、组件文档、当前契约、公共类型             | 所有者界面过期或存在未记录的共享名称，会阻止实现。                                                      |

## Decision log

### DEC-1 — Send is a ChatSendButton role

**Reference:** `spec:AST-032/DEC-1`

**Decider:** `cixzhang`, `2026-09-22`; amended `2026-10-05`

ChatSendButton 的发送动作是组件拥有的角色。在当前组件图标架构下，它获得 `chat-send-button-send` 槽位，并以 `arrowUp` 作为兼容回退，而现有的 `sendIcon` prop 仍保持最高优先级。

已否决：继续直接读取 `arrowUp`，因为那样主题就无法在不重绘每个 `arrowUp` 的情况下选择发送图标。

### DEC-2 — Upload is a shared icon

**Reference:** `spec:AST-032/DEC-2`

**Decider:** `cixzhang`, `2026-10-05`

上传是一个通用动作，其常规字形与方向箭头不同。作为共享名称，`upload` 在每个主题中按该主题的风格绘制一次，每个执行上传的界面都渲染同一个由主题绘制的字形。共享名称是永久的公共词汇，因此新增共享名称依据所有者的设计方向，而不是当前使用方的数量。`upload` 满足这一标准：设计者需要绘制真正的上传字形，而现有的共享名称无法承载它。

已否决：`file-input-upload` 组件槽位，因为槽位只能映射到现有的共享名称，因此无法拥有自己的上传图形。

### DEC-3 — Complete registries require upload

**Reference:** `spec:AST-032/DEC-3`

**Decider:** `cixzhang`, `2026-10-05`

完整的注册表列出每个共享名称，因此 `IconRegistry` 像要求其他名称一样要求 `upload`：通过类型检查的完整主题注册表以自己的风格绘制上传，而不是静默借用默认图形。

已否决：永久可选的 `upload`，因为它会成为完整注册表唯一可以省略的共享名称。

## Deprecation and cleanup records

### DEP-0012 — Deprecate complete `IconRegistry` types that omit `upload`

| Field            | Value                                                                             |
| ---------------- | --------------------------------------------------------------------------------- |
| id               | `DEP-0012`                                                                        |
| cleanup          | `CLN-0021`                                                                        |
| package          | `@astryxdesign/core`                                                              |
| surface          | 接受省略 `upload` 的完整注册表的公共 `IconRegistry` 类型                          |
| old contract     | 类型为 `IconRegistry` 的完整注册表可以省略 `upload`；被省略的条目会解析为默认图形 |
| replacement      | 以注册表自身的风格添加 `upload` 条目；`IconRegistry` 已经接受它                   |
| direct authority | FR6 与 DEC-3。所有者：`spec:AST-032`：`cixzhang`、`imdreamrunner`                 |
| warning          | 使用方文档与发布说明会指出 `DEP-0012`。无运行时警告（`spec:AST-017` FR29）        |
| migration        | 非机械性：以注册表的风格绘制 `upload` 图形                                        |
| codemod          | 无：图标图形因每个主题而异，无法合成                                              |
| downstream       | 默认注册表、每个捆绑主题以及每个 CLI 主题模板都提供 `upload`                      |
| transition       | 无先前过渡                                                                        |
| state            | `deprecated`                                                                      |
| open decision    | 除了在次要版本计划中列出 `CLN-0021` 之外，无                                      |
| target plan      | `CLN-0021` 在下一个次要版本中，如 FR6 所安排                                      |

### CLN-0021 — `IconRegistry` requires `upload`

| Field     | Value                                                                                       |
| --------- | ------------------------------------------------------------------------------------------- |
| id        | `CLN-0021`                                                                                  |
| lifecycle | `DEP-0012`                                                                                  |
| delta     | `IconRegistry` 为 `Record<IconName, ReactNode>`：省略 `upload` 的完整注册表无法通过类型检查 |
| rollback  | 从最终补丁基线恢复过渡期的可选 `upload`                                                     |
| state     | `pending` —— 在已声明的次要版本中随其 `[breaking]` Changeset 落地                           |

## Open questions

无。
