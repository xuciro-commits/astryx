---
schema_version: 3
template_version: 7
kind: component
id: component:TextArea
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-27
owners: [cixzhang]
review_triggers:
  [
    public-api,
    behavior,
    layout,
    theming,
    accessibility,
    component-slots,
    react-runtime,
    interaction,
    styling,
    compatibility,
  ]
verified_by:
  [
    packages/core/src/TextArea/TextArea.test.tsx,
    packages/core/src/inputFontFloor.test.ts,
    packages/core/src/TextArea/TextArea.fr10.test.tsx,
    packages/core/src/TextInput/__tests__/TextInput.a11y.test.tsx,
    packages/core/src/TextInput/__tests__/TextInput.a11y.chromium.spec.ts,
    packages/core/src/theme/themingTargets.test.ts,
    scripts/check-knowledge.mjs,
    packages/core/src/__tests__/BusyOwnerAnnouncement.test.tsx,
    packages/core/src/hooks/useInputStatusIcon.test.tsx,
  ]
modules: []
families: [family:input-fields]
design_specs: []
architecture:
  [
    architecture:component-size-cascade,
    architecture:component-theming-surface,
    architecture:internationalization,
    architecture:public-component-api,
  ]
contributing: []
system_specs: [spec:AST-085, spec:AST-086]
---

# TextArea component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                                                                                                                                                                                                     |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | TextArea 是受控的多行字段，带有 Field props、`rows`、尺寸、状态、起始图标、`maxLength` 计数器、`onChange`、`changeAction`、`isLoading`、禁用与只读状态、`hasSpellCheck`、触摸键盘 props `enterKeyHint`、`inputMode`、`autoCapitalize` 与 `hasAutoCorrect`（FR13）、用于原生 `maxlength` 的 `htmlMaxLength`（FR14），以及输入族的分部 props。 |
| Behavior                | 输入会调用 `onChange`，然后可选地调用 `changeAction`，附带乐观值和一个忙碌 Spinner。`maxLength` 会增加可视字符计数器，它只警告，绝不阻止输入。                                                                                                                                                                                               |
| End-user impact         | 用户书写较长文本时能看到实时计数，只有在接近或超过上限时才播报。键盘与屏幕阅读器用户能够到达禁用字段及其原因。没有消息的错误没有任何文本。                                                                                                                                                                                                   |
| Builder impact          | 调用方可以选择触摸键盘、其回车键标签、大小写与纠错（FR13）；未设置 prop 时字段保持原样。                                                                                                                                                                                                                                                     |
| Compatibility/readiness | 触摸键盘 props 是增量式的，为补丁级 `[feat]`（`spec:AST-017` FR5、FR7）。除此之外，本记录陈述的是已交付行为。高表面上的附着状态、被丢弃的分组容器 props、计数器下方的文本、没有文本的错误，以及仅靠颜色的 `detached` 状态，都列在 Current-state impact 之下。                                                                                |
| Review checks           | 拒绝会截断输入或按代码单元计数的计数器、每次按键都播报、文本跑到图标或计数器下方、禁用字段脱离 Tab 顺序或被提交，以及根级样式 props。                                                                                                                                                                                                        |
| Governing rules         | `family:input-fields` FR4–FR6、FR8–FR10、AV3；`spec:AST-085` FR1–FR3、FR6；`spec:AST-086` FR8；`architecture:component-theming-surface`；`component:TextInput` FR16、DEC-1；`architecture:public-component-api` INV2、INV3、INV25。                                                                                                          |

该表是审查投影；下面的正文具有权威性。

## Intent

TextArea 收集多行文本。它在 `family:input-fields` 之下拥有原生 textarea、其变更与 Action 流水线、字符计数器、覆盖图标放置，以及禁用与只读行为。使用方用法见 `TextArea.doc.mjs`。

## Compatibility and migration

- 已发布的默认值保持不变：`yes`；`rows={3}`、拼写检查开启、`size="md"`、`statusVariant="attached"`
- 兼容类别：增量式；可选的触摸键盘 props（FR13）属于补丁级 `[feat]`（`spec:AST-017` FR5、FR7）。未设置时它们不渲染任何内容，因此已发布默认值和 DOM 输出都不变。TextArea 只发出 `text-area`、`text-area-control` 与 `text-area-counter` 三个目标
- 受控/非受控行为：仅受控；`value` 为必填，字段只在 `changeAction` 挂起期间显示乐观值
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 绘制的输入容器、原生 textarea 与字符计数器，以及它们的 `text-area`、`text-area-control` 和 `text-area-counter` 目标。
- 变更与 Action 流水线以及忙碌状态。
- 计数器的计数、超限提示与播报。
- 起始图标、Spinner、状态图标与计数器的覆盖放置，以及让文本避开它们的文本内边距。
- 禁用、禁用原因与只读行为。
- 原生 textarea 的触摸键盘属性（FR13）。

**不拥有 / 非目标**

- 标签与 attached/detached 校验消息的呈现——由 `family:input-fields`（共享所有者小节）下的 Field 与 `component:FieldStatus` 拥有。
- tooltip 变体的状态表面——由 Tooltip 拥有。
- 标准起始图标呈现与共享的字段内状态图标——分别由 `component:Icon` 与 `family:input-fields` 下的共享输入字段状态图标拥有。
- 加载指示器呈现——由 `component:Spinner` 拥有。
- Icon 支持来源形式之外的、由调用方提供的自定义起始内容。
- InputGroup——TextArea 未被接纳（`family:input-fields` 采纳）。
- 强制执行 `maxLength`——计数器仅是可视的。

## Public concepts

| Concept        | Closed values or states                                                                                                     | Meaning                                                                       | Availability by variant/orientation/state | Default               | Owner                 | Stability | Invalid-value behavior  |
| -------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------- | --------------------- | --------------------- | --------- | ----------------------- |
| Rows           | 正整数                                                                                                                      | 初始可见行数；用户可向上调整得更长。                                          | 始终。                                    | `3`                   | `component:TextArea`  | 稳定      | 传递给原生属性。        |
| Size           | `sm`, `md`, `lg`                                                                                                            | 文本内边距；`lg` 会增加块级内边距。                                           | 始终。                                    | 继承的尺寸，否则 `md` | `family:input-fields` | 稳定      | TypeScript 拒绝其他值。 |
| Counter        | under, near, over                                                                                                           | 针对 `maxLength` 的字符计数。                                                 | 设置 `maxLength` 时。                     | 无                    | `component:TextArea`  | 稳定      | 不适用。                |
| Busy           | idle, busy                                                                                                                  | 值正在加载或正在保存。                                                        | `isLoading`，或 `changeAction` 挂起期间。 | idle                  | `family:input-fields` | 稳定      | 不适用。                |
| Availability   | editable, read-only, disabled                                                                                               | 值能否变化以及是否提交。                                                      | 始终；disabled 优先。                     | editable              | `component:TextArea`  | 稳定      | 不适用。                |
| Touch keyboard | `enterKeyHint` (`EnterKeyHint`), `inputMode` (`InputMode`), `autoCapitalize` (`AutoCapitalize`), `hasAutoCorrect` (boolean) | 触摸键盘、其回车键标签、大小写与纠错，定义方式同 `component:TextInput` FR16。 | 始终。                                    | 未设置：无属性        | `component:TextArea`  | 稳定      | TypeScript 拒绝其他值。 |

## Behavioral and layout contract

| ID   | Invariant                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Basis                                                            |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| FR1  | TextArea 渲染在 Field 内（标签、描述、可选或必填标记、标签 tooltip、状态、`width`），并把原生 textarea 放在其绘制的输入容器内。它没有分组适配：在 InputGroup 内它仍渲染自己的 Field 盒与标签，而 `container*` props 会被丢弃（FR12）。                                                                                                                                                                                                                                                                                           | `family:input-fields` 采纳；当前源码与测试                       |
| FR2  | 输入容器携带 `text-area` 以及 `data-size`、`data-status`、`data-disabled` 和 `data-readonly`；textarea 携带 `text-area-control`；计数器携带 `text-area-counter`。占位符文本属于 textarea；超限字形属于计数器。                                                                                                                                                                                                                                                                                                                   | `architecture:component-theming-surface`；当前源码与测试         |
| FR3  | textarea 显示 `rows` 行（默认 3），仅可纵向调整大小，并使用正文文本，仅在 iOS 触摸路径上以 16 CSS px 为下限。`lg` 会增加块级内边距；`sm` 与 `md` 共享默认内边距。                                                                                                                                                                                                                                                                                                                                                                | `family:input-fields` FR9、AV3；当前源码与测试                   |
| FR4  | 编辑会调用 `onChange(value, event)`；除非该调用阻止默认行为，否则随后在 transition 中运行 `changeAction(value, event)`，字段在 Action 挂起期间显示提议的值，结束后显示 `value`。在 `isLoading` 期间，或显示的值与 `value` 不同时，textarea 会设置 `aria-busy`，显示一个装饰性 Spinner，并只播报一次忙碌开始。                                                                                                                                                                                                                    | `family:input-fields` FR5、FR6；`spec:AST-086` FR8；当前测试     |
| FR5  | 设置 `maxLength` 时，一个显示字符数与上限的计数器会渲染在容器底部的末端，并描述该 textarea。它按用户感知的字符计数，因此多码点 emoji 只计一次。它从不设置原生 `maxLength`，也从不阻止输入。超过上限时它变为错误色、添加装饰性警告图标，并设置 `aria-invalid`。计数器文本 MUST 来自同一条 catalog 消息（`architecture:internationalization` INV1a），两个数字都使用该区域设置的数字格式。                                                                                                                                         | 当前测试；`architecture:internationalization` INV1a              |
| FR6  | 只有当一次编辑落入与上一次编辑不同的区域时，才会发生计数器播报：进入上限的最后 20% 时以礼貌方式播报剩余字符数；超过上限时以断言方式播报超出量；回到上限以下则不播报。区域跟踪初始为未设置，因此挂载后的第一次编辑会播报它所落入的 near 或 over 区域，即使挂载时值已在其中。                                                                                                                                                                                                                                                      | 当前测试                                                         |
| FR7  | 起始图标渲染在顶部起始处，Spinner 与字段内状态图标渲染在顶部末端；textarea 为每一个会渲染的元素预留行内内边距（两端元素都显示时更多），并为计数器预留底部内边距，因此文本绝不会跑到它们下方；计数器的底部内边距只在滚动范围末端时才让文本避开。实现缺口：当值长于 `rows` 时，除非字段滚动到末端，否则最后一行可见文本会绘制在计数器下方。detached 状态不预留末端空间，因为它不渲染字段内图标。                                                                                                                                   | `family:input-fields` FR2；当前源码与测试                        |
| FR8  | 状态会绘制状态边框；`error` 会设置 `aria-invalid`。字段内状态图标在 `attached` 与 `tooltip` 放置下显示；`detached` 状态只在消息框中显示其字形，而消息框仅在有消息时渲染。消息通过 Field 按选定的放置方式渲染。每个状态 MUST 显示颜色之外的提示（WCAG 2.2 1.4.1），错误 MUST 以文本标识（WCAG 2.2 3.3.1）。实现缺口：TextArea 提供 `attached` 放置方式，既作为默认也允许显式指定，尽管 `family:input-fields` FR8 与 AV6 只允许在固定高度控件上使用 `attached`；错误状态可能没有消息；而没有消息的 `detached` 状态只显示彩色边框。 | `family:input-fields` FR8；当前测试                              |
| FR9  | 禁用：textarea 上有 `aria-disabled="true"` 与 `readOnly`，保留 Tab 停靠点，没有 `name`（不提交），值不可变，不触发 `onPaste`，除 focus 与 blur 外不调用调用方处理器，容器变暗，并有键盘焦点环。设置 `disabledMessage` 时，原因 tooltip 会在悬停与键盘聚焦时打开并描述该 textarea。                                                                                                                                                                                                                                               | `spec:AST-085` FR1–FR3、FR6；`family:input-fields` FR4；当前测试 |
| FR10 | 只读：`readOnly`、完全不透明、可聚焦、仍会提交、从不调用 `onChange`。两者都设置时禁用优先。                                                                                                                                                                                                                                                                                                                                                                                                                                      | 当前测试                                                         |
| FR11 | `hasSpellCheck`（默认开启）设置 `spellcheck`；`htmlName`、`autoComplete`、`hasAutoFocus` 与 `onPaste` 会到达 textarea。点击容器内 textarea 之外的区域会使其获得焦点，禁用或忙碌时除外。                                                                                                                                                                                                                                                                                                                                          | 当前测试                                                         |
| FR12 | 基础 props 会到达 textarea，`aria-describedby` 会并入 TextArea 的描述；`container*` 在会渲染 Field 盒的地方到达该 Field 盒（在 `horizontal-labels` 的 FormLayout 中不渲染任何 Field 盒，`container*` 无效并给出警告），`control*` 到达输入容器；根级 `xstyle`、`className` 与 `style` 不被接受。实现缺口：在 InputGroup 内 Field 盒仍会渲染，但 `container*` 被丢弃，并给出“不渲染 Field 盒”的开发警告。                                                                                                                         | `family:input-fields` FR10；当前测试                             |
| FR13 | `enterKeyHint`、`inputMode`、`autoCapitalize` 与 `hasAutoCorrect` 在 textarea 上遵循 `component:TextInput` FR16：已设置的 prop 渲染其原生属性（`hasAutoCorrect` 渲染为 `autocorrect="on"` 或 `"off"`），未设置的 prop 不渲染任何属性，值类型是相同的导出封闭联合 `EnterKeyHint`、`InputMode` 与 `AutoCapitalize`，它们只改变触摸键盘。无论该键标签说什么，Enter 都插入换行。`hasSpellCheck` 保持 FR11。                                                                                                                          | `component:TextInput` FR16、DEC-1                                |
| FR14 | `htmlMaxLength` 只透传到原生 `maxlength` 属性，除此之外不做任何事：不计数、不截断、不校验。未设置的 prop 不渲染 `maxlength`。`maxLength` 仍是只警告不阻止的计数器（FR5）。                                                                                                                                                                                                                                                                                                                                                       | 所有者决策（DEC-1）                                              |

### Allowed variation

- **AV1 — 高度。** 用户可以向上拖动 textarea 使其更高；内容可以超出 `rows` 增长。
- **AV2 — 起始内容。** Icon 支持的值或调用方内容可以填充起始槽位。

### Representative states

| State        | Required invariant                                       | Allowed variation      |
| ------------ | -------------------------------------------------------- | ---------------------- |
| 默认可编辑   | 标签、输入容器与 textarea 渲染。                         | 值、占位符、行数与尺寸 |
| 接近上限     | 计数器可见；一次礼貌的剩余字符播报。                     | 计数。                 |
| 超过上限     | 错误色计数器带警告图标；`aria-invalid`；一次断言式播报。 | —                      |
| 忙碌且带状态 | Spinner 与状态图标都在顶部末端；额外的末端内边距。       | 状态变体。             |
| 带原因的禁用 | 可聚焦；只读；不提交；原因 tooltip。                     | —                      |

### Transformation and precedence order

- **ORD1 — 可用性。** 禁用，然后只读，然后可编辑。
- **ORD2 — 变更。** 计数器区域检查、`onChange`，然后是乐观值与 `changeAction`（除非被阻止）。
- **ORD3 — 描述。** 调用方描述，然后是描述、状态消息（或状态 tooltip）、计数器与禁用原因。

### Performance and resources

- **PR1 — 计数开销。** 只在设置 `maxLength` 时计数：对每次编辑提议的值计数，并在显示的值或 `maxLength` 变化时再计一次。

## Accessibility contract

- **AR1 — 名称与描述。** textarea 由 Field 标记，并按 ORD3 描述，包括计数器。
- **AR2 — 计数器播报。** 见 FR6；朗读输出遵循 `spec:AST-009`。
- **AR3 — 超限提示。** 超限状态有颜色之外的提示（FR5）。
- **AR4 — 禁用。** FR9 满足 `spec:AST-085` FR1、FR5 与 FR6。

## Design relationships

| Anatomy or state      | Design requirement                       | Representation authority | Hierarchy role | Component contract |
| --------------------- | ---------------------------------------- | ------------------------ | -------------- | ------------------ |
| Input container       | 呈现当前绘制的字段边界。                 | 当前源码与公开文档       | 支撑           | FR1、FR2           |
| Text area             | 呈现并编辑当前的多行值。                 | 当前源码与公开文档       | 突出           | FR1、FR2、FR3      |
| Character counter     | 呈现当前与最大字符数。                   | 当前源码与公开文档       | 支撑           | FR2、FR5           |
| Shared field feedback | 呈现当前标签、标准图标、状态与加载内容。 | 当前共享组件源码         | 支撑           | FR7、FR8           |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Label": {
    "delegatesTo": {"owner": "component:Field", "target": "field-label"}
  },
  "Description": {
    "none": {
      "reason": "unsettled: No current public target reaches the stable Description; future exposure still needs an owner decision"
    }
  },
  "Input container": {"target": "text-area"},
  "Text area": {"target": "text-area-control"},
  "Placeholder": {"inherits": "text-area-control"},
  "Start icon": {
    "delegatesTo": {"owner": "component:Icon", "target": "icon"}
  },
  "Custom start content": {
    "none": {
      "reason": "intentional: Custom start content is caller-provided ReactNode content outside TextArea's public theming ownership"
    }
  },
  "Spinner": {
    "delegatesTo": {"owner": "component:Spinner", "target": "spinner"}
  },
  "Status icon": {
    "delegatesTo": {
      "owner": "component:Field",
      "target": "input-status-icon"
    }
  },
  "Character counter": {"target": "text-area-counter"},
  "Field status message": {
    "delegatesTo": {
      "owner": "component:FieldStatus",
      "target": "field-status"
    }
  },
  "Tooltip status message": {
    "delegatesTo": {"owner": "component:Tooltip", "target": "tooltip"}
  }
}
```

`Description` 仍是稳定的使用方解剖结构，但目前没有公开目标能到达它；未来是否暴露仍未确定。语义名称与图标组件值通过 Icon 渲染并委托给它的 `icon` 目标；任意 ReactNode 起始内容由调用方提供，有意留在 TextArea 的公开主题所有权之外。attached 与 detached 状态消息委托给 FieldStatus，而 tooltip 变体将其渲染表面委托给 Tooltip。

## Family and system relationships

- `family:input-fields` 拥有忙碌、Transition Actions、禁用原因、状态放置、聚焦缩放下限、prop 目标与块轴增长；TextArea 采纳它们，且不兼容 InputGroup。
- `architecture:component-theming-surface` 拥有解剖结构限定、事实性 `none` 处置、保留组合的所有权与别名排除。
- Field、FieldStatus、Icon、Spinner 与 Tooltip 在被 TextArea 组合时保留各自的目标契约。
- `spec:AST-085` 拥有禁用的可聚焦性；TextArea 满足它。

## Verification map

| Contract             | Verification                                                                                                                                                                                                                                                                                  | Representative states                        | Mutation or failure expectation                                                                                                                                             | Audit section                  |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| FR1、FR3             | `TextArea.test.tsx` 的结构、行数与尺寸用例；`inputFontFloor.test.ts`                                                                                                                                                                                                                          | 默认、自定义行数、`lg`                       | 移除或重组稳定部件会破坏角色、内容或 DOM 断言；缺少 iOS 下限会失败。证据缺口：没有测试在 InputGroup 内渲染 TextArea，也没有断言仅纵向调整大小、正文文本尺寸或 `lg` 内边距。 | `audit:TextArea/anatomy`       |
| FR2                  | `TextArea.test.tsx` 的根目标与主题状态套件；`themingTargets.test.ts`                                                                                                                                                                                                                          | 三个本地目标；禁用与只读                     | 缺少类名、缺少 `data-disabled` 或 `data-readonly`，或源码与文档漂移，都会失败。证据缺口：没有测试断言 `data-size` 或 `data-status`。                                        | `audit:TextArea/theming`       |
| FR4                  | `TextArea.test.tsx` 的变更与忙碌用例；`BusyOwnerAnnouncement.test.tsx` 的 TextArea 用例                                                                                                                                                                                                       | 输入；`isLoading`                            | `onChange` 载荷错误、缺少 `aria-busy`，或忙碌开始被播报多次，都会失败。证据缺口：没有测试断言 `onChange` 之后的 `changeAction`，也没有断言乐观值。                          | `audit:TextArea/behavior`      |
| FR5、FR6、AR2、AR3   | `TextArea.test.tsx` 的 maxLength 套件                                                                                                                                                                                                                                                         | under、near、over；emoji；受控输入           | 原生截断、按代码单元计数、缺少提示，或缺少区域播报，都会失败。证据缺口：没有测试在同一区域内输入两次或回到上限以下，因此重复播报也能通过。                                  | `audit:TextArea/accessibility` |
| FR7、FR8             | `TextArea.test.tsx` 的状态、带状态忙碌与 statusVariant 套件；`useInputStatusIcon.test.tsx` 的 TextArea tooltip 与放置用例                                                                                                                                                                     | attached、detached、tooltip；带状态忙碌      | 缺少状态图标或消息，或错误时缺少 `aria-invalid`，都会失败。证据缺口：没有测试测量预留内边距或计数器下方文本，也没有渲染不带消息的 `detached` 状态。                         | `audit:TextArea/layout`        |
| FR9、FR10、ORD1、AR4 | `TextArea.test.tsx` 的禁用、disabledMessage、只读与表单套件；禁用且无调用方处理器的用例（粘贴与按键）                                                                                                                                                                                         | 禁用、带原因、只读、两者                     | 丢失 Tab 停靠点、禁用的值被提交、调用方处理器被调用，或发生编辑，都会失败。                                                                                                 | `audit:TextArea/accessibility` |
| FR11                 | `TextArea.test.tsx` 的拼写检查、粘贴、autoComplete、自动聚焦、点击聚焦套件                                                                                                                                                                                                                    | 每个 prop                                    | 属性被丢弃或点击后未聚焦会失败。证据缺口：没有测试在禁用或忙碌时点击容器。                                                                                                  | `audit:TextArea/behavior`      |
| FR12                 | `TextArea.fr10.test.tsx`                                                                                                                                                                                                                                                                      | 独立；`horizontal-labels` FormLayout         | 基础 prop 未到达 textarea，或样式落在错误部件上，都会失败。                                                                                                                 | `audit:TextArea/api`           |
| FR13                 | `TextArea.test.tsx` 的触摸键盘特征套件（每个 prop 设置与未设置；在任何 `enterKeyHint` 下回车都保持换行）；由 `pnpm typecheck` 运行的 `textEntryTraits.public.test.ts`，用于共享联合拒绝任意或未收窄的字符串；`TextAreaKeyboardTraits.a11y.chromium.spec.ts`，用于点击聚焦的 textarea 上的属性 | 每个 prop 设置与未设置；带触摸仿真的手机视口 | 未设置时仍出现属性、属性被丢弃或重命名，或值类型接受 `string`，都会失败。                                                                                                   | `audit:TextArea/api`           |
| FR14                 | `TextArea.test.tsx` 的 htmlMaxLength 套件：原生属性设置、未设置与移除；没有 `maxLength` 时无计数器；计数器仍以 `maxLength` 为准；更长的受控值不被截断；服务端渲染标记                                                                                                                         | —                                            | —                                                                                                                                                                           | —                              |
| ORD2、ORD3、PR1      | 证据缺口：描述用例只检查每个 id 是否存在，不检查 ORD3 顺序，也没有测试断言计数器区域、变更与 Action 的顺序，或计数仅在设置 `maxLength` 时运行                                                                                                                                                 | —                                            | —                                                                                                                                                                           | `audit:TextArea/behavior`      |
| AR1                  | `TextInput.a11y.test.tsx` 与 `TextInput.a11y.chromium.spec.ts` 的 TextArea 状态                                                                                                                                                                                                               | 带占位符的空值；无消息的错误                 | 缺少名称或描述会失败；记录的已知失败在其缺口关闭时不再匹配。                                                                                                                | `audit:TextArea/accessibility` |
| 主题解剖映射         | `scripts/check-knowledge.mjs`                                                                                                                                                                                                                                                                 | 规范解剖与当前本地目标                       | 规范键漂移、无效处置或目标拼写、由别名支撑的本地声明，或未被认领的当前本地目标，都会使校验失败。                                                                            | `audit:TextArea/theming`       |

没有仓库检查会解析 `delegatesTo` 的所有者与目标对；上表中的对应当匹配当前的 Field、FieldStatus、Icon、Spinner 与 Tooltip 目标。

## Current-state impact

- **高表面上的附着状态（FR8）。** TextArea 提供 `attached` 状态放置，既作为默认也允许显式指定，而 `family:input-fields` FR8 与 AV6 只允许在固定高度控件上使用 `attached`。
- **分组容器 props（FR12）。** 在 InputGroup 内，TextArea 仍渲染其 Field 盒，但会丢弃 `container*` props，并警告不渲染 Field 盒。
- **计数器下方的文本（FR7）。** 当值长于 `rows` 时，除非字段滚动到末端，否则最后一行可见文本会绘制在计数器下方。
- **没有文本的错误。** TextArea 接受不带消息的错误状态，因此错误只通过颜色与图标显示，违反 WCAG 2.2 3.3.1。共享的文本输入无障碍套件将其记录为已知失败。
- **仅靠颜色的 detached 状态（FR8）。** 不带消息的 `detached` 状态只显示彩色边框，违反 WCAG 2.2 1.4.1。

## Decision log

TextArea 应用 `family:input-fields`、`spec:AST-085` 与 `component:TextInput` DEC-1。

### DEC-1 — `htmlMaxLength` only passes through

**决策者：** `cixzhang`，2026-11-11

**依据：** “htmlMaxLength 看起来没问题，我的预期是它唯一的目的就是透传到原生 max length，仅此而已”

**决策：** `htmlMaxLength` 渲染原生 `maxlength` 属性，不添加自己的任何行为（FR14）。浏览器自身的限制作用于输入；TextArea 不针对它计数、截断或校验。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤或族/系统规则。它链接到它们的所有者。
