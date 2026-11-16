---
schema_version: 3
template_version: 7
kind: component
id: component:CommandPalette
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-11-01
owners: [cixzhang]
review_triggers: [behavior, theming, accessibility]
verified_by:
  [
    packages/core/src/CommandPalette/CommandPalette.test.tsx,
    packages/core/src/CommandPalette/CommandPaletteInput.test.tsx,
    packages/core/src/CommandPalette/CommandPaletteList.test.tsx,
    packages/core/src/CommandPalette/CommandPaletteItem.test.tsx,
    packages/core/src/CommandPalette/CommandPaletteGroup.test.tsx,
    packages/core/src/CommandPalette/CommandPaletteFooter.test.tsx,
    packages/core/src/CommandPalette/__tests__/CommandPalette.a11y.chromium.spec.ts,
    packages/core/src/CommandPalette/__tests__/CommandPaletteFooter.a11y.chromium.spec.ts,
    packages/core/src/theme/themingTargets.test.ts,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: [family:overlay-dismissal]
design_specs: []
architecture:
  [
    architecture:component-theming-surface,
    architecture:interaction-modality,
    architecture:public-component-api,
  ]
contributing: []
system_specs: [spec:AST-056, spec:AST-092/FR4, spec:AST-092/FR9]
---

# CommandPalette component contract

## Contract at a glance

| 区域          | 契约                                                                                                                                                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 公开契约      | `CommandPalette` 及其文档化的 props 与插槽，由 `CommandPaletteInput`、`CommandPaletteList`、`CommandPaletteItem`、`CommandPaletteGroup`、`CommandPaletteEmpty` 和 `CommandPaletteFooter` 组合而成，置于 Dialog 内部。          |
| 行为          | Dialog 内可搜索的命令：一个 combobox 查询字段；仅当存在可选结果时才有的结果 listbox；否则为空消息；以及一个键盘指引页脚。模态下的 Escape 属于 Dialog 的共享关闭。                                                              |
| 终端用户影响  | 键盘与屏幕阅读器用户可在原生文本编辑保持完整的情况下搜索并运行命令，听到所显示的空消息，并一次一个 Escape 地关闭嵌套层。                                                                                                       |
| 构建者影响    | 无。                                                                                                                                                                                                                           |
| 兼容性/就绪度 | 记录已发布的行为；无公开变更。AR1 的调用方 `aria-label` 规则在 `component:CommandPaletteList` 中是一处实现缺口，列在其“当前状态影响”中；两个所有者问题仍未决（OQ2 询问 INV5 是否应在整个 family 范围内陈述这一复合语义解读）。 |
| 审查检查项    | 拒绝本地处理的模态 Escape、IME 路由、Home/End 结果导航、空 listbox、过期的活动后代、仅靠 placeholder 的名称、不匹配的 Empty 播报，或缺口。                                                                                     |
| 管辖规则      | `family:overlay-dismissal/FR1`, `FR2`, `FR4`, `FR5`; `spec:AST-056/FR3`, `AR1`, `AR2`; `spec:AST-092/FR4`; `spec:AST-092/FR9`（仅其结果；FR10）；现有的公开组件与委派所有者契约。                                              |

本表是审查投影；以下正文具有权威性。

## Intent

CommandPalette 在 Dialog 内呈现可搜索的命令。它拥有搜索与选择的编排，以及聚合使用方解剖结构，同时将其表面与模态关闭的次序委派给 Dialog。

## Compatibility and migration

- 保留已发布默认值：`yes`
- 兼容性类别：记录已发布的行为；无公开变更
- 受控/非受控行为：如 `CommandPalette.doc.mjs` 中所记录
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **List 会取代调用方的名称（AR1）。** 构建者显式设置的 `aria-label` 目前并不会为 List 命名；`component:CommandPaletteList` 记录了该缺口。

## Ownership boundary

**拥有**

- 搜索编排，以及当前 Input、List、Item、Group、Group heading、Empty 和 Footer 各部分与其目标的组合。
- 在默认 Input 内渲染的原生 Query field 的组合；该字段的语义与原生透传由 `component:CommandPaletteInput` 拥有。

**不拥有 / 非目标**

- Dialog 的表面、Icon 的字形、Spinner 的加载指示器或 Kbd 的快捷键徽标——由各自组件拥有。
- 调用方提供的替代 Input、Footer、条目内容或尾部输入内容——由产品调用点拥有。
- Item option 的透传、指针、禁用、选中、高亮与独立滚动语义——由 `component:CommandPaletteItem` 拥有。
- `command-palette` 根目标——不存在这样的目标。
- 超出下文所链接的现有记录的共享层托管、定位或生命周期规则。
- List 根的可访问名称、list-id 应用、原生透传与溢出滚动——由 `component:CommandPaletteList` 拥有。
- Group 的角色、名称与标题——由 `component:CommandPaletteGroup` 拥有；Footer 的指引——由 `component:CommandPaletteFooter` 拥有；Empty 表面——由 `component:CommandPaletteEmpty` 拥有。

## Public concepts

不引入新的公开概念。使用方的 props、插槽与用法仍记录在 `CommandPalette.doc.mjs` 及其子组件文档中。

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 依据                                                    |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| FR1  | 默认渲染在委派的 Dialog 内将 Input 与 Footer 置于结果表面周围。当存在 Item 时，该表面是 List listbox；否则是普通的 Empty 容器。在第一次查询的结果提交之前、该查询处于待定状态时，结果表面保持 Empty 容器的尺寸且不显示任何消息；一旦某个答案已提交，后续的待定查询在自身结果提交之前保持当前结果或搜索无结果消息（“待定搜索”状态行；`component:CommandPaletteEmpty` FR2）。仅当 `footer` 被省略、为 `null` 或 `undefined` 时才渲染默认 Footer；任何其他 `footer` 都会替换它，因此 `footer={false}` 不显示 Footer 指引，而 Footer 区域仍保留其分隔线（`architecture:react-component-runtime` INV16）。 | 当前源码、文档、测试与 ARIA 必需子项规则                |
| FR2  | Input、List、Item、Group、Group heading、Empty 和 Footer 承载下文记录的七个当前 `command-palette-*` 目标；不存在 `command-palette` 根目标。                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 当前源码与目标文档                                      |
| FR3  | 默认 Input 将其 Search 字形委派给 Icon，将待定的 Loading 加载指示器委派给 Spinner；默认 Footer 将键盘快捷键委派给 Kbd；承载表面委派给 Dialog。                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 当前源码与组件文档                                      |
| FR4  | Query field 是 Input 内部一个独立的原生文本字段，且没有单独的公开目标。`command-palette-input` 目标位于其外围搜索区域上，而非原生字段上。                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 当前源码与目标文档                                      |
| FR5  | 模态调色板不为 Escape 声明处理，将其留给 Dialog 的共享关闭栈，以便嵌套成员处理第一次按下；内联预览在本地关闭，因为它们不会注册为层。                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `family:overlay-dismissal/FR1`, `FR2`, `FR4`, `FR5`     |
| FR6  | 可编辑的查询字段保留 Home 与 End 用于原生光标移动，使用 PageUp 与 PageDown 进行首个/最后一个结果的导航，且不会将活动的 IME 组键路由到命令。                                                                                                                                                                                                                                                                                                                                                                                                                                                           | WAI-ARIA 可编辑 combobox 约定；客观的 IME 完整性        |
| FR7  | 已提交的结果集在暴露前重置高亮；查询输入仅对存在于当前可选集合中的索引发出 active-descendant。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | WAI-ARIA active-descendant 完整性                       |
| FR8  | 空搜索播报镜像所渲染的 `emptySearchText`，包括调用方的富内容；查询输入的默认可访问名称独立于其 placeholder。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `spec:AST-056/FR3`, `AR1`, `AR2`                        |
| FR9  | 调色板打开期间，新的 `searchSource` 会针对它重新运行当前查询，或在查询为空时运行 bootstrap：查询文本保留，来自先前来源的结果作为过期结果被拒绝（`spec:AST-092` 的过期查询规则），且高亮按 FR7 的要求重置。                                                                                                                                                                                                                                                                                                                                                                                            | 与 `spec:AST-092/FR4`（SearchSource 契约）的一致性      |
| FR10 | 被拒绝的 `search()` 以空答案落定并显示无结果状态，正如 typeahead 失败的答案在没有任何显示时那样；被拒绝的 `bootstrap()` 以无初始条目落定并显示初始空状态。二者都不会向错误边界抛出。                                                                                                                                                                                                                                                                                                                                                                                                                  | 与 `spec:AST-092/FR9` 要求 typeahead 达到的结果的一致性 |

### Allowed variation

- **AV1 — 结果。** 条目数量、分组、选中内容与空状态可以变化，而不改变聚合解剖结构。
- **AV2 — 插槽。** 调用方提供的 Input 与 Footer 内容可以替换默认内容，而不成为 CommandPalette 拥有的子部件。
- **AV3 — 委派渲染。** Dialog、Icon、Spinner 与 Kbd 可以改变其内部元素形态，同时保持各自的公开契约。

### Representative states

| 状态              | 必需不变式                                                  | 允许的变化                         |
| ----------------- | ----------------------------------------------------------- | ---------------------------------- |
| 无分组结果        | List 包含 Item 实例。                                       | 条目数量与调用方渲染的内容。       |
| 分组结果          | List 包含 Group、Group heading 与 Item 实例。               | Group 名称、数量、顺序与条目内容。 |
| 空 bootstrap/搜索 | Empty 取代 listbox 语义；搜索无结果文本按所渲染的内容播报。 | 调用方提供的富内容，包括普通控件。 |
| 待定搜索          | 默认 Input 可能包含 Loading 加载指示器。                    | 无搜索待定时 Spinner 不存在。      |
| 默认插槽          | Input 与 Footer 渲染其文档化的默认内容。                    | Footer 快捷键文本与已翻译的标签。  |
| 调用方替换的插槽  | 插槽内容替换对应的默认内容。                                | 替换结构仍归调用方所有。           |

### Transformation and precedence order

- 除 FR1–FR10 之外，没有搜索、选择、布局或样式方面的优先级规则。

### Performance and resources

- 无资源规则。

## Accessibility contract

- **AR1 — 具名复合体。** 承载的 Dialog、combobox、已填充的 listbox、组、选项、忙碌状态、空状态与键盘指引保留其各自拥有的可访问名称与角色。调用方显式的 `aria-label` 为 List 或 Group 命名（`architecture:public-component-api` INV5）；`listbox` 与 `option` 角色及选项状态保持组件所有，正如 `component:CommandPaletteInput` AR3 所记录。`component:CommandPaletteList` 记录了当今的 List 在何处替换了调用方的名称。当不存在可选结果时，结果表面与 combobox 省略 listbox、expanded、controls 与 active-descendant 语义，使富 Empty 内容保持为普通的非嵌套内容。
- **AR2 — 最顶层 Escape。** 模态调色板将未声明处理的 Escape 按下委派给 Dialog 的共享关闭栈。已注册的嵌套表面处理第一次按下；宿主调色板在成为最顶层之前保持打开。
- **AR3 — 内联预览。** 仅用于文档的内联渲染保持在共享层栈之外，并保留其本地的 Escape 关闭行为。
- **AR4 — 可编辑查询按键。** Home 与 End 保留原生光标移动；PageUp 与 PageDown 导航到首个与最后一个结果；活动的 IME 组键仍归输入法所有。
- **AR5 — 已渲染的空消息。** 搜索的无结果状态播报由 `emptySearchText` 渲染出的文本，包括调用方组件与链接产生的文本。
- **AR6 — 查询字段名称。** 默认查询字段名称是一个本地化的“Search commands”标签，独立于其 placeholder；调用方 `label` 与原生 `aria-label` 覆盖仍受支持。
- **AR7 — 已有活动选项。** 结果变化会重置高亮，且仅当被索引的选项存在于当前可选集合中时才存在 `aria-activedescendant`。

## Design relationships

| 解剖结构或状态     | 设计要求                                           | 表示权威            | 层级角色 | 组件契约      |
| ------------------ | -------------------------------------------------- | ------------------- | -------- | ------------- |
| Dialog             | 呈现承载的模态表面。                               | `component:Dialog`  | 支撑     | FR1, FR3      |
| Input              | 绘制查询字段周围的搜索区域与辅助视觉。             | 当前源码与公开文档  | 突出     | FR1, FR2, FR4 |
| Search 字形        | 在默认 Input 中呈现搜索符号。                      | `component:Icon`    | 支撑     | FR3           |
| Query field        | 在 Input 内接受原生文本查询。                      | 当前源码与公开文档  | 突出     | FR1, FR4      |
| Loading 加载指示器 | 在默认 Input 中指示待定搜索。                      | `component:Spinner` | 支撑     | FR3           |
| List               | 呈现当前结果集合或 Empty 状态。                    | 当前源码与公开文档  | 支撑     | FR1, FR2      |
| Item               | 呈现一个可选择的命令结果。                         | 当前源码与公开文档  | 突出     | FR1, FR2      |
| Group              | 将相关的 Item 编排在一起。                         | 当前源码与公开文档  | 支撑     | FR1, FR2      |
| Group heading      | 在视觉上为一个 Group 加标签。                      | 当前源码与公开文档  | 支撑     | FR1, FR2      |
| Empty              | 呈现无结果或无查询的消息。                         | 当前源码与公开文档  | 突出     | FR1, FR2      |
| Footer             | 呈现默认指引或调用方提供的页脚内容。               | 当前源码与公开文档  | 支撑     | FR1, FR2      |
| Keyboard shortcut  | 在默认 Footer 中将一个快捷键呈现为绘制的按键徽标。 | `component:Kbd`     | 支撑     | FR3           |

原生 Query field 与承载 `command-palette-input` 的 Input 区域是分开的。它没有直接目标；它是否应该有，是 OQ1。

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Dialog": {
    "delegatesTo": {"owner": "component:Dialog", "target": "dialog"}
  },
  "Input": {"target": "command-palette-input"},
  "Search glyph": {
    "delegatesTo": {"owner": "component:Icon", "target": "icon"}
  },
  "Query field": {
    "none": {
      "reason": "unsettled: No current public target is applied directly to the native query field; future exposure still needs an owner decision"
    }
  },
  "Loading spinner": {
    "delegatesTo": {"owner": "component:Spinner", "target": "spinner"}
  },
  "List": {"target": "command-palette-list"},
  "Item": {"target": "command-palette-item"},
  "Group": {"target": "command-palette-group"},
  "Group heading": {"target": "command-palette-group-heading"},
  "Empty": {"target": "command-palette-empty"},
  "Footer": {"target": "command-palette-footer"},
  "Keyboard shortcut": {
    "delegatesTo": {"owner": "component:Kbd", "target": "kbd"}
  }
}
```

七个本地目标是当前的公开接缝。被委派的部分保留其现有的组件所有者。Query field 的 `none` 处置尚未确定（OQ1），并不授权新的目标。

## Family and system relationships

- `architecture:component-theming-surface` 拥有解剖结构限定、目标映射、委派以及事实性的 `none` 处置。
- `architecture:public-component-api` 拥有稳定的 props 与组合表面。
- `architecture:interaction-modality/INV4` 拥有受支持模态路径的可达性；确切的查询按键细节遵循客观的可编辑 combobox 与 IME 组键标准。
- `spec:AST-056/FR3`、`AR1` 与 `AR2` 拥有已渲染空搜索播报的一致性，以及独立于 placeholder 文本的可访问查询字段名称。
- `family:overlay-dismissal` 拥有最顶层 Escape 与关闭请求的次序；CommandPalette 通过 Dialog 采纳它，同时保留本地内联预览关闭，因为内联模式不会注册为层。
- `architecture:layer-runtime` 记录：模态路径将 Escape 委派给 Dialog 的共享关闭注册，而未注册的内联预览保留本地关闭。

## Verification map

| 契约          | 验证                                                                                                                                                            | 代表状态                                                                       | 变更或失败预期                                                                                                                                                                                                                                                                                | 审计小节                           |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| FR1, AR1      | CommandPalette 根与子组件测试套件；`CommandPalette.test.tsx` 的待定状态用例；`CommandPalettePending.a11y.chromium.spec.ts`（待定状态保持空表面的高度）          | 默认、分组、空、待定、富 Empty 与替换的插槽                                    | 暴露空的 listbox、留下空的 Input 弹出属性，或将富 Empty 控件嵌套在 option 语义下，都会使聚焦的角色断言失败。证据缺口：FR1 的 `footer` 规则（仅当 `footer` 被省略、为 `null` 或 `undefined` 时才有默认页脚；`footer={false}` 会留下空的页脚条）是经源码检查的；没有测试传入 `footer={false}`。 | `audit:CommandPalette/anatomy`     |
| FR2           | 聚焦的子组件测试套件与 `themingTargets.test.ts`                                                                                                                 | 七个本地目标位于其所属元素上                                                   | 移除或移动一个当前目标会使聚焦的放置断言或全局清单失败。                                                                                                                                                                                                                                      | `audit:CommandPalette/theming`     |
| FR3           | `CommandPaletteInput.test.tsx` 与 `CommandPaletteFooter.test.tsx`                                                                                               | 默认 Search 字形、待定 spinner 与 Footer Kbd                                   | 替换或移除被委派的 Icon、Spinner 或 Kbd 实例，会使组合所有者断言失败。                                                                                                                                                                                                                        | `audit:CommandPalette/theming`     |
| FR4           | `CommandPaletteInput.test.tsx`                                                                                                                                  | 原生查询字段，Input 处于空闲与待定状态                                         | 移除该字段会使 combobox 测试失败；新增字段目标需要显式更新映射。                                                                                                                                                                                                                              | `audit:CommandPalette/anatomy`     |
| FR5, AR2, AR3 | `CommandPalette.test.tsx`                                                                                                                                       | 带嵌套层的模态宿主；内联预览                                                   | 恢复本地模态 Escape 处理会关闭宿主而非嵌套表面；移除内联分支会失去预览关闭。                                                                                                                                                                                                                  | `audit:CommandPalette/interaction` |
| FR6, AR4      | `CommandPalette.test.tsx` 与 `CommandPaletteInput.test.tsx`                                                                                                     | Home、End、PageDown、Enter 与活动的 IME 组键                                   | 将 Home/End 路由到结果，或转发组键中的命令键，都会使用户事件与原生组键断言失败。                                                                                                                                                                                                              | `audit:CommandPalette/interaction` |
| FR7, AR7      | `CommandPalette.test.tsx` 与 `CommandPaletteInput.test.tsx`                                                                                                     | 已填充、空与重新填充的结果集                                                   | 保留越界的高亮，或发出其不存在的活动后代，会使转换与直接边界断言失败。                                                                                                                                                                                                                        | `audit:CommandPalette/a11y`        |
| FR8, AR5, AR6 | `CommandPalette.test.tsx`、`CommandPaletteInput.test.tsx` 与 i18n 检查                                                                                          | 调用方的富 Empty 内容；默认与调用方查询名称                                    | 在已渲染的调用方内容之上播报目录文案，或仅通过 placeholder 文本为查询命名，会使实时区域、名称与目录断言失败。                                                                                                                                                                                 | `audit:CommandPalette/a11y`        |
| FR9           | `CommandPalette.test.tsx` 的 “a new searchSource while open” 测试套件：在打开状态下分别带查询与带空查询地更换来源；新来源被查询一次，不显示过期行，且高亮重置。 | 以已输入查询与空查询的打开状态；来自旧来源的迟到结果；一行高亮；已关闭的调色板 | 新来源未被查询、被查询两次、显示了旧来源的行、查询文本丢失，或高亮被保留，都会失败。                                                                                                                                                                                                          | —                                  |
| FR10          | `CommandPalette.test.tsx` 的 “a rejected search source” 测试套件                                                                                                | bootstrap 拒绝；某次搜索拒绝或抛出；被取代的查询拒绝                           | 到达错误边界的拒绝、使忙碌状态保持开启、保留过期行，或让被取代的查询清除当前结果，都会失败。                                                                                                                                                                                                  | `audit:CommandPalette/interaction` |
| 主题解剖映射  | `scripts/check-knowledge.mjs`                                                                                                                                   | 规范化解剖结构与七个当前本地目标                                               | 缺失、多余、带前缀、过期或别名支持的映射会使仓库校验失败。缺口：若某个被映射的部分停止绘制，没有任何检查会失败。                                                                                                                                                                              | `audit:CommandPalette/theming`     |

聚焦的目标放置断言覆盖所有七个本地目标。组合的 Input 与 Footer 测试还固定了被委派的 Search Icon、待定 Spinner 与四个默认 Kbd 快捷键。

## Decision log

未记录组件本地决策。

## Open questions

- **OQ1 — Query field 是否应获得一个稳定的公开主题目标？**（`human-api`）它目前没有直接目标，也没有所有者决定它是否应该有。
- **OQ2 — `architecture:public-component-api` INV5 是否应在整个 family 范围内陈述该复合语义解读？**（`human-api`）在 CommandPalette 这样的复合体内部，诸如 `combobox`、`listbox` 与 `option` 的角色以及选项状态归组件所有并取代调用方的，正如 `component:CommandPaletteInput` AR3 所记录，而调用方显式的名称仍然优先。在 INV5 中陈述它会使每个复合体都遵循；留在此处则使其保持为一种其他复合体未必共享的 CommandPalette 解读。

## Content boundary

本文件不重复使用方属性表/示例、共享层或模态规则，或实现步骤。它链接到其所有者。
