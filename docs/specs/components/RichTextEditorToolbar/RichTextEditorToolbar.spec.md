---
schema_version: 3
template_version: 7
kind: component
id: component:RichTextEditorToolbar
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-11-06
owners: [cixzhang]
review_triggers: [behavior, layout, theming, accessibility]
verified_by:
  [
    packages/richtext/src/RichTextEditorToolbarLink.test.tsx,
    packages/richtext/src/__tests__/RichTextEditorToolbar.a11y.chromium.spec.ts,
  ]
modules: []
families: []
design_specs: []
architecture: [architecture:icon-resolution-and-component-slots]
contributing: []
system_specs: [spec:AST-061, spec:AST-087/FR11]
---

# RichTextEditorToolbar component contract

<!-- path-applicability:v1 -->

```json
{
  "paths": [
    "packages/richtext/src/internal/ToolbarLinkPopover.tsx",
    "packages/richtext/src/linkForm.tsx"
  ]
}
```

## Contract at a glance

| 方面          | 约定                                                                                                                                                     |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | 除 `spec:AST-061` 之外没有其他公共契约；本记录拥有链接控件的交互。                                                                                       |
| 行为          | Link 按钮，或编辑器中的 Cmd/Ctrl+K，会打开一个附着在 Link 按钮上的非模态浮层，其中包含一个 URL 输入框，以及 Apply、Remove（选区位于链接中时）和 Cancel。 |
| 最终用户影响  | 人们添加或编辑链接时，正在被链接的文字上方不会弹出模态对话框，并且他们能保持原位：浮层关闭时，焦点与选区回到编辑器。                                     |
| 构建者影响    | 无。`promptForUrl` 仍会替换内置浮层。                                                                                                                    |
| 兼容性/就绪度 | 链接 UI 是非模态浮层，而不是模态对话框；没有 prop 变更。                                                                                                 |
| 审查检查项    | 拒绝模态的链接界面、关闭后让焦点或选区留在编辑器之外的浮层、为表单按钮新增 `richtext:*` 图标键，或脱离其按钮的浮层。                                     |
| 治理规则      | `spec:AST-061`；`spec:AST-087` FR11；`architecture:icon-resolution-and-component-slots` INV10。                                                          |

本表是审查投影；下文正文具有权威性。

## Intent

RichTextEditorToolbar 是 RichTextEditor 的格式化工具栏。本记录拥有它的链接控件：一个人如何从工具栏添加、编辑和移除链接。工具栏的其余部分遵循 `spec:AST-061`。

使用方语法与示例属于 `RichTextEditor.doc.mjs`。

## Compatibility and migration

- 保留的已发布默认值：`no` —— 链接控件打开的是浮层而不是对话框。
- 兼容性类别：交互变更，没有 prop、默认值或 API 变更。
- 受控/非受控行为：不变。
- 迁移决策：DEC-1。

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 链接浮层：它何时打开、它的位置、它的表单，以及它关闭时焦点与选区去往何处。

**不拥有 / 非目标**

- 工具栏的 props —— 由 `spec:AST-061` 拥有。
- 链接 URL 净化 —— 由 `@astryxdesign/richtext` 中的 `sanitizeUrl` 拥有。
- 在文本选区处锚定 —— Core Popover 只锚定到按钮。

## Public concepts

| 概念     | 封闭取值或状态         | 含义                                                     | 按变体/方向/状态的可用性   | 默认值 | 拥有方                            | 稳定性 | 无效值行为                                |
| -------- | ---------------------- | -------------------------------------------------------- | -------------------------- | ------ | --------------------------------- | ------ | ----------------------------------------- |
| 链接浮层 | 已关闭、添加中、编辑中 | 链接表单是否显示，以及它是用于新链接还是选区所在的链接。 | 带 Link 按钮的可编辑编辑器 | 已关闭 | `component:RichTextEditorToolbar` | stable | 被拒绝的 URL 会让表单保持打开并显示错误。 |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                             | 依据                                                                          |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| FR1 | 工具栏的链接控件打开一个锚定的、附着在其 Link 按钮上的非模态浮层，而不是对话框；它包含 URL 输入框与 Apply/Cancel，并且在按 Enter、Escape 或 Cancel 时，焦点与选区会回到编辑器中的该链接处。当选区位于链接中时，浮层还包含 Remove。 | 所有者决策，2026 年 11 月 6 日（Cindy）（DEC-1）                              |
| FR2 | 浮层在工具栏上方打开，仅当上方没有空间时才翻转到其下方，因此它不会遮住编辑器的前几行。                                                                                                                                             | 设计决策（Ernest，设计所有者）（DD1）                                         |
| FR3 | 编辑器中的 Cmd/Ctrl+K 会打开同一个浮层。它会先把 Link 按钮带入视图——在页面中以及在工具栏的行内——以便浮层在其旁边打开。                                                                                                             | 当前行为                                                                      |
| FR4 | Apply 与 Cancel 使用共享的 `check` 与 `close` 图标，因此主题可通过 `icons` 重设它们的样式。Remove 使用固定的组件图形。该表单不新增任何 `richtext:*` 图标键。                                                                       | `spec:AST-087` FR11；`architecture:icon-resolution-and-component-slots` INV10 |
| FR5 | 浮层最宽 320 px，且绝不宽于视口的留白，因此在手机宽度下，输入框及其按钮仍留在屏幕内的一行上。                                                                                                                                      | 当前行为                                                                      |
| FR6 | URL 输入框初始为空，带有 `example.com` 占位符，在触摸屏上请求 URL 键盘，不做拼写标记，并在浮层打开时获得焦点。无法链接的 URL 会在输入框下方显示错误，并让焦点留在那里。                                                            | 当前行为                                                                      |

## Accessibility contract

- **AR1 — Link 按钮为其弹出层命名。** 它带有 `aria-haspopup="dialog"` 与 `aria-expanded`，并控制浮层；该浮层是一个带标签的非模态对话框（"Insert link" 或 "Edit link"），位于工具栏的 roving tab stop 之外，因此 Tab 会穿过表单移动。

## Design relationships

### Design decisions

<!-- design-decisions:v1 -->

| ID  | Decision                   | Intent or reason                                 | Applies to | Allowed variation          |
| --- | -------------------------- | ------------------------------------------------ | ---------- | -------------------------- |
| DD1 | 链接浮层在工具栏上方打开。 | 被链接的文字常常就在编辑器首行，正好位于其下方。 | 链接浮层   | 上方没有空间时翻转到下方。 |

## Family and system relationships

- `spec:AST-061` 拥有工具栏的 props；本记录拥有链接控件的交互。

## Verification map

| 契约     | 验证                                                                                                                                    | 代表性状态                         | 变更或失败预期                                                      | 审计小节 |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------- | -------- |
| FR1, AR1 | `RichTextEditorToolbarLink.test.tsx` 中的浮层、Enter、Escape、Cancel、编辑与 Remove 用例；`RichTextEditorToolbar.a11y.chromium.spec.ts` | 添加中、编辑中、被拒绝的 URL       | 模态界面，或焦点/选区被留在编辑器之外，即视为失败。                 | —        |
| FR3      | `RichTextEditorToolbarLink.test.tsx` 的 Cmd/Ctrl+K 用例                                                                                 | 按钮在视图内、按钮已滚出视图       | 打开时未把按钮带入视图即视为失败。                                  | —        |
| FR4      | `RichTextEditorToolbarLink.test.tsx` 的共享图标用例                                                                                     | 默认图标、已注册的 `check`/`close` | 新增 `richtext:*` 键，或 Apply 与 Cancel 忽略共享图标，即视为失败。 | —        |
| FR6      | `RichTextEditorToolbarLink.test.tsx` 的输入框与被拒绝 URL 用例                                                                          | 空、被拒绝                         | 缺少原生提示，或被拒绝 URL 时焦点离开输入框，即视为失败。           | —        |
| FR2, FR5 | 证据缺口：没有自动化测试断言位置或宽度；桌面与 390 px 下的真实浏览器截图为其提供支持。                                                  | 桌面、手机宽度                     | —                                                                   | —        |

## Decision log

### DEC-1 — The link control opens a popover on its Link button

**参考：** `component:RichTextEditorToolbar/DEC-1`

**决策者：** `cixzhang`，`2026-11-06`

添加链接的人能始终看到其正在链接的文字：链接表单是附着在 Link 按钮上的小型非模态浮层，而不是模态对话框。

已否决：精细指针下使用浮层，而在手机上使用对话框或底部面板。

## Open questions

无。

## Content boundary

本文件不复制使用方 prop 表/示例、当前审计结果、实现步骤或 family/system 规则。它链接到它们的拥有者。
