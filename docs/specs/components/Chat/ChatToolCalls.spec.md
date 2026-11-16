---
schema_version: 3
template_version: 7
kind: component
id: component:ChatToolCalls
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-11-01
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility, testing]
verified_by:
  [
    packages/core/src/Chat/ChatToolCalls.test.tsx,
    apps/storybook/stories/ChatToolCalls.stories.tsx,
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
    architecture:interaction-modality,
    architecture:theme-tokens,
    architecture:knowledge-contracts,
  ]
contributing: []
system_specs: [spec:AST-009, spec:AST-029]
---

# ChatToolCalls component contract

## Contract at a glance

| Area          | Contract                                                                                                                                                                                                                                                                                |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | `ChatToolCalls`，具有必需的 `calls`（每项含 `name`、可选的 `status`、`target`、`node`、`duration`、`additions`、`deletions`、`stats`、`errorMessage`、`resultDetail`、`data` 与 `key`），可选的 `label`、`isExpanded`、`defaultIsExpanded`、`onExpandedChange`，以及根 div 属性与 ref。 |
| 行为          | 无调用时不渲染任何内容；单次调用直接渲染；多次调用暴露一个展开控件，其折叠表面显示最新调用，其展开表面显示每一次调用。                                                                                                                                                                  |
| 最终用户影响  | 读者看到助手运行了哪些工具，以及每个工具处于待处理、运行中、已完成还是已失败状态；一组调用会折叠为其最新调用，并使隐藏行不进入键盘与屏幕阅读器导航。                                                                                                                                    |
| 构建者影响    | 无。                                                                                                                                                                                                                                                                                    |
| 兼容性/就绪度 | 记录已发布行为；无公共变更。一个实现缺口，列在“当前状态影响”下；两个所有者问题仍未解决。                                                                                                                                                                                                |
| 审查检查      | 拒绝被忽略的标签、折叠组内可聚焦的后代元素、丢失的键盘激活、不可读的辅助文本、被丢弃的根输入，或调用顺序/默认值发生变化。                                                                                                                                                               |
| 治理规则      | `architecture:public-component-api/INV5–INV6, INV8–INV9`；`architecture:interaction-modality`；`spec:AST-009/FR7`；WCAG 2.2 SC 1.4.3 与 2.4.7。                                                                                                                                         |

此表是审查投影；下文为权威内容。

## Intent

ChatToolCalls 在助手消息内呈现工具或函数调用，包括执行状态、可选元数据以及可检查的结果详情。

## Compatibility and migration

- 保留已发布默认值：`yes`；省略 status 表示 complete，且组以折叠状态开始，除非 `defaultIsExpanded` 为 true
- 兼容性类别：记录已发布行为；无公共变更
- 受控/非受控行为：提供 `isExpanded` 时它保持权威；否则本地状态从 `defaultIsExpanded ?? false` 开始。
- 迁移决策：无

使用方迁移说明应放在使用方文档与发布说明中。

## Current-state impact

- **带符号的统计数字可能达不到文本对比度。** 用于带符号 `+N` 和 `-N` 统计的成功与错误前景色令牌在每一种已发布的浅色和深色表面上都达不到 4.5:1；WCAG 2.2 SC 1.4.3 要求文本满足该对比度（FR5、OQ2）。

## Ownership boundary

**拥有**

- 将有序调用数据投影为单次调用或分组呈现。
- 组级与每次调用的展开控件，包括键盘操作与焦点处理。
- 状态、元数据、时长、统计数字与结果详情的放置位置。
- 根 div、`chat-tool-calls` 目标、受支持的 BaseProps 组合，以及 ref。

**不拥有 / 非目标**

- 工具执行、流式传输、结果解析或错误恢复。
- 调用方提供的 `stats` 或 `resultDetail` 内容内部的语义与交互。
- Badge、Icon、Spinner 或 CodeBlock 的内部实现。
- 关于哪些工具调用可以展示的产品策略。

## Public concepts

| Concept  | Closed values or states                        | Meaning                                  | Availability | Default  | Owner                               | Stability | Invalid-value behavior       |
| -------- | ---------------------------------------------- | ---------------------------------------- | ------------ | -------- | ----------------------------------- | --------- | ---------------------------- |
| 调用列表 | empty; single; multiple                        | 选择不呈现、直接成行或分组呈现。         | 每次渲染     | required | `component:ChatToolCalls`           | Stable    | 空列表不渲染任何内容。       |
| 状态     | pending; running; complete; error              | 选择可见且可访问的执行状态。             | 每次调用     | complete | `component:ChatToolCalls`           | Stable    | 类型非法的值会被拒绝。       |
| 组标签   | 省略；提供的字符串                             | 为展开的组命名；省略时使用已翻译的计数。 | 多次调用     | 省略     | 调用方与组件                        | Stable    | 提供的字符串按原样渲染。     |
| 组状态   | 受控；非受控且折叠；非受控且展开               | 控制分组行是否暴露。                     | 多次调用     | 折叠     | 调用方或组件                        | Stable    | 避免相互冲突的控制。         |
| 结果详情 | 省略；调用方 React 节点                        | 添加一个可独立操作的每次调用展开控件。   | 任意调用     | 省略     | 调用方与组件                        | Stable    | 省略内容不添加任何控件。     |
| 根表面   | ref；受支持的 DOM/data/ARIA/class/style/xstyle | 扩展根而不替换其拥有的目标。             | 非空调用列表 | 省略     | `architecture:public-component-api` | Stable    | 不受支持的输入保持不受支持。 |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                             | Basis                                                  |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| FR1 | 空的调用列表 MUST 不渲染根；单次调用 MUST 直接渲染；多次调用 MUST 渲染一个组展开控件，并在其完整列表中保留调用方顺序。                                                                | 当前源码、测试与文档                                   |
| FR2 | 提供的 `label` MUST 在展开的组表面上替换已翻译的计数；省略时 MUST 保留已翻译的计数回退。                                                                                              | 当前源码、测试与文档                                   |
| FR3 | 折叠的组 MUST 使其后代调用展开控件不进入键盘与无障碍导航；展开 MUST 恢复它们。                                                                                                        | 当前源码与测试                                         |
| FR4 | 每个组件拥有的展开控件 MUST 能用 Enter、空格与指针输入激活，暴露展开状态，并绘制共享的键盘焦点环。                                                                                    | `architecture:interaction-modality`；WCAG 2.2 SC 2.4.7 |
| FR5 | 中性的辅助标签、目标、时长与自定义统计数字 MUST 使用可读的次级前景色；带符号的新增与删除计数使用成功与错误文本颜色。实现缺口：这些颜色可能达不到文本对比度要求（当前状态影响；OQ2）。 | WCAG 2.2 SC 1.4.3 与当前令牌架构                       |
| FR6 | 受支持的根 ref、DOM/data/ARIA、className、style 与 xstyle 输入 MUST 到达根或在其上组合，同时公共目标保持完好。                                                                        | `architecture:public-component-api/INV5–INV6, INV8`    |

### Allowed variation

- **AV1 — 调用内容。** 工具名称、目标、节点名称、时长、统计数字、错误消息与结果详情仍由调用方提供。
- **AV2 — 组控制。** 调用方可以控制展开，或仅提供其初始非受控值。
- **AV3 — 样式。** 受支持的根样式输入可以扩展组件，而无需替换其公共目标。

### Representative states

| State             | Required invariant                                                         | Allowed variation                                                                |
| ----------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 空                | 不渲染任何根。                                                             | 空数组的标识可以不同。                                                           |
| 单次              | 出现一行，不带组外壳。                                                     | 元数据与结果详情可以缺失。                                                       |
| 多次，折叠        | 出现最新调用与计数；完整行不可交互。                                       | 调用数量与最新状态可以不同。                                                     |
| 多次，展开        | 每次调用按源码顺序出现；提供的标签或已翻译计数为组命名。                   | 标签文本与行元数据可以不同。                                                     |
| 详情关闭/打开     | 该行暴露其状态，并按条件挂载调用方拥有的详情。                             | 任意调用方 React 节点。                                                          |
| 状态              | 所有状态都暴露已翻译的可访问文本；complete 与 error 还保留不同的语义标记。 | 主题可以改变语义图形；pending 与 running 共享同一个细微的 spinner，待 OQ1 决定。 |
| 窄幅 / RTL 上下文 | 行在截断时不产生水平溢出，并遵循逻辑行内方向。                             | 内容长度、主题与方向。                                                           |

### Transformation and precedence order

- **ORD1 — 选择呈现方式。** 空、单次与分组分支由列表长度选择。
- **ORD2 — 解析状态。** 受控展开优先；否则本地状态从初始默认值开始。
- **ORD3 — 解析标签。** 提供的组标签优先；否则使用已翻译的计数。
- **ORD4 — 组合行。** 保留调用顺序，渲染状态与元数据，然后在存在时添加调用方拥有的详情展开控件。
- **ORD5 — 组合根。** 应用组件目标与样式，然后合并受支持的使用方输入。

### Performance and resources

- **PR1 — 仅本地状态。** 该组件拥有展开控件状态，且没有 Effect、监听器、观察器、定时器或外部资源。
- **PR2 — 线性投影。** 组渲染只遍历提供的调用列表一次，且不改变调用方数据。

## Accessibility contract

- **AR1 — 展开控件的操作。** 组与详情展开控件暴露 `aria-expanded`，可用指针、Enter 与空格操作，并使用共享的可见焦点环。
- **AR2 — 折叠后的归属。** 折叠的组内容不可交互；隐藏的详情内容被卸载。
- **AR3 — 状态的语义。** 每个状态都暴露已翻译的视觉隐藏文本。complete 与 error 还使用不同的语义标记；pending 与 running 共享同一个细微的 spinner（OQ1）。错误消息暴露给辅助技术，并且在调用行中会回显在状态图标的悬停提示中。
- **AR4 — 静态证据。** 焦点外观、键盘行为、不可交互性与 DOM 关系使用 `spec:AST-009/FR7` 下的单元测试与 Storybook play-function 证据；本记录不做任何播报声明。

## Design relationships

| Anatomy or state | Design requirement                                               | Representation authority | Hierarchy role | Component contract |
| ---------------- | ---------------------------------------------------------------- | ------------------------ | -------------- | ------------------ |
| 调用行           | 紧凑的行内状态与元数据保持可读。                                 | 当前源码与 WCAG 对比度   | supporting     | FR5, AR3           |
| 展开控件         | 键盘焦点保持可见，且不改变布局。                                 | 当前交互架构             | supporting     | FR4, AR1           |
| 状态             | 已翻译的隐藏文本保留可访问含义；complete 与 error 保留语义标记。 | 当前源码与客观无障碍     | supporting     | FR5, AR3           |

未记录组件本地的设计决策。

### Theme ownership

现有的 `chat-tool-calls` 目标仍位于根上。Badge、Icon 与 Spinner 拥有其嵌套目标与绘制。尚未记录任何解剖结构主题映射；该块在迁移期间是可选的，因此该映射被推迟。

## Family and system relationships

- `architecture:public-component-api` 拥有已发布的导出、可接受的输入、样式组合与 ref。
- `architecture:component-theming-surface` 拥有目标与委派的解剖结构契约。
- `architecture:interaction-modality` 拥有共享的键盘焦点处理。
- `architecture:component-test-sufficiency` 拥有有界的、对变异敏感的证据。
- `spec:AST-009` 将这些静态语义、键盘、焦点与对比度声明分配给较低的证据层级，而不是真实的辅助技术。
- `spec:AST-029` 拥有本记录的验证映射所遵循的审计证据清单。

## Verification map

| Contract     | Verification                                                                                                                     | Representative states            | Mutation or failure expectation                      | Audit section                       |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ---------------------------------------------------- | ----------------------------------- |
| FR1          | `ChatToolCalls.test.tsx` 的空、单次、默认折叠、切换，以及 “includes the latest status in a collapsed group accessible name” 测试 | 空；单次；分组                   | 渲染空的根、单次调用带组外壳，或表面错误，都会失败。 | `audit:ChatToolCalls/behavior`      |
| FR2          | `ChatToolCalls.test.tsx` 的 “renders the public custom group label when expanded”                                                | 提供的标签                       | 被忽略的标签会失败。                                 | `audit:ChatToolCalls/behavior`      |
| FR3, AR2     | `ChatToolCalls.test.tsx` 的 “removes collapsed call rows from keyboard and accessibility navigation”                             | 折叠；展开                       | 折叠行可操作会失败。                                 | `audit:ChatToolCalls/accessibility` |
| FR4, AR1     | `ChatToolCalls.test.tsx` 的焦点环、展开控件语义与 `aria-controls` 测试                                                           | 组头部；详情行                   | 缺少焦点环、展开状态或 controls 引用会失败。         | `audit:ChatToolCalls/accessibility` |
| AR3          | `ChatToolCalls.test.tsx` 的状态标记、状态名称与错误消息测试                                                                      | 每种状态；带详情与不带详情的错误 | 缺少状态文本、标记或错误文本会失败。                 | `audit:ChatToolCalls/accessibility` |
| FR6          | `ChatToolCalls.test.tsx` 的 “forwards the root ref and supported DOM props”                                                      | 单个根                           | 被丢弃的 ref 或属性会失败。                          | `audit:ChatToolCalls/public-api`    |
| FR4, AR4     | `ChatToolCalls.stories.tsx` 的 `FocusedGroupedDetail` 与 `Narrow` play 函数                                                      | 聚焦的分组详情；320 CSS px       | 焦点环变细或脱离，或出现水平溢出，都会失败。         | `audit:ChatToolCalls/accessibility` |
| RTL relation | `apps/storybook/rtl-audit/verified-not-applicable.json`                                                                          | 所有 story                       | —                                                    | `audit:ChatToolCalls/i18n-rtl`      |

从源码读取，尚无聚焦的测试：

- FR1：展开列表中的调用方顺序。
- FR2：省略 `label` 时已翻译计数的回退。
- FR4：Enter 与空格激活。
- FR5：辅助文本上的次级前景色。
- FR6：`xstyle` 组合。
- PR1–PR2：没有 Effect 或外部资源，且不改变调用方数据。

## Decision log

未记录组件本地的决策。

## Open questions

- **OQ1 — pending/running 的视觉区分。** pending 与 running 渲染相同的细微 spinner，仅在已翻译的可访问文本上不同。应采用哪种已批准的可见处理来区分它们，同时又不发明组件本地的状态策略？
- **OQ2 — 语义统计数字的对比度。** 用于带符号 `+N`/`-N` 统计的已发布成功/错误前景色令牌在每一种已发布的浅色/深色表面上都达不到 4.5:1。应使用哪个系统级语义文本令牌替换它们，同时保留新增/删除的含义？在该所有者决策落地之前，五个受影响的 axe 基线保持不变。

## Content boundary

本文件不重复使用方示例、工具执行策略或委派的组件契约。
