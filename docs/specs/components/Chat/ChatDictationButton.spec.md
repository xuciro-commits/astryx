---
schema_version: 3
template_version: 7
kind: component
id: component:ChatDictationButton
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers: [public-api, behavior, accessibility, theming, testing]
verified_by:
  [
    packages/core/src/Chat/ChatDictationButton.test.tsx,
    apps/storybook/stories/ChatDictation.stories.tsx,
    apps/storybook/rtl-audit/verified-not-applicable.json,
  ]
modules: []
families: []
design_specs: [design:reduced-motion]
architecture:
  [
    architecture:public-component-api,
    architecture:component-style-authoring,
    architecture:theme-tokens,
    architecture:component-test-sufficiency,
    architecture:knowledge-contracts,
  ]
contributing: []
system_specs: [spec:AST-029, spec:AST-027]
---

# ChatDictationButton component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                                                                                                                  |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | `ChatDictationButton`，带有必需的 `dictation` 状态（`isSupported`、`isListening`、`volume`、`bands`、`toggle`）、`size`（`sm`、`md`；默认 `md`）、`isHiddenWhenUnsupported`（默认 true）、`label`、`ref`、`xstyle`、`className`、`style` 以及 span 属性。 |
| Behavior                | 一个仅含图标的麦克风 Button，用于切换听写。监听期间，它显示五个随音量变化的竖条，而不是麦克风图标；不受支持的听写不渲染任何内容，或在保持可见时渲染一个禁用的 Button。                                                                                    |
| End-user impact         | 语音输入就是一个带名称的按钮，它会说明自己是开始还是停止听写；不支持语音识别的浏览器看不到无法运行的操作。                                                                                                                                                |
| Builder impact          | 无。                                                                                                                                                                                                                                                      |
| Compatibility/readiness | 记录已发布的行为；无公共变更。两处实现缺口列在“当前状态影响”之下。                                                                                                                                                                                        |
| Review checks           | 拒绝以下情况：启用一个不受支持的操作、开始/停止名称缺失或过时、竖条暴露给辅助技术，或剪裁颜色无法被主题重新着色。                                                                                                                                         |
| Governing rules         | `architecture:public-component-api`；`architecture:theme-tokens` INV3；`architecture:component-style-authoring` INV7；`design:reduced-motion`。                                                                                                           |

本表是评审用的投影，正文为准。

## Intent

ChatDictationButton 是语音识别状态所有者面向用户的可见控件。它把该所有者的支持状态与监听状态转换成一个仅含图标的 Button 和五条竖条的音量显示。使用方用法见 `ChatDictationButton.doc.mjs`。

## Compatibility and migration

- 已发布的默认值保持不变：`yes`
- 兼容性类别：记录已发布的行为；无公共变更
- 受控/非受控行为：监听状态由传入的 `dictation` 值拥有
- 迁移决策：无

使用方迁移说明应放在使用方文档与发布说明中。

## Current-state impact

- **音量竖条是额外元素。** 监听显示是一个容器和五个竖条 `span` 元素，没有任何主题目标会绘制它们。`architecture:component-style-authoring` INV7 要求每个语义角色或可主题化部件渲染一个元素。

- **竖条设置了 z-index 却没有隔离。** 竖条容器带有 `z-index: 1`，而包装元素没有隔离它，因此竖条参与页面的层叠顺序。`spec:AST-027` FR1 让 z-index 保持局部化，并把这种情况列为隔离缺口。

## Ownership boundary

**拥有**

- 开始与停止名称，以及调用方的 `label` 覆盖（FR1、FR2）。
- 在语音识别不受支持时隐藏或禁用该控件（FR3）。
- 所提供 `bands` 的五条竖条显示及其剪裁颜色（FR2、FR4）。
- 包装 span 的 ref、属性与样式（FR5）。

**不拥有 / 非目标**

- 语音识别支持检测、生命周期、转写文本、错误以及麦克风权限——由 `dictation` 状态所有者拥有。
- 激活、焦点、禁用语义以及仅图标呈现——由 `component:Button` 拥有。
- 在 ChatComposer 中的放置——调用方的组合。
- 公共的颜色、阈值或竖条形状选项。

## Public concepts

| Concept | Closed values or states                | Meaning                                | Availability by variant/orientation/state | Default        | Owner                           | Stability | Invalid-value behavior  |
| ------- | -------------------------------------- | -------------------------------------- | ----------------------------------------- | -------------- | ------------------------------- | --------- | ----------------------- |
| 支持    | 受支持；不受支持且隐藏；不受支持且显示 | 该控件是否渲染，以及它能否操作。       | 每个控件。                                | 不受支持时隐藏 | `component:ChatDictationButton` | 稳定      | TypeScript 拒绝其他值。 |
| 监听    | 空闲；监听                             | 选择开始或停止名称，以及麦克风或竖条。 | 受支持的控件。                            | 空闲           | `dictation` 所有者              | 稳定      | 不适用。                |
| 尺寸    | `sm`、`md`                             | 同时决定 Button 与竖条的尺寸。         | 每个控件。                                | `md`           | `component:ChatDictationButton` | 稳定      | TypeScript 拒绝其他值。 |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                       | Basis                             |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| FR1 | 受支持且空闲时，该控件是一个启用的、仅含图标的 ghost Button，带麦克风图标，以 `label` 或翻译后的开始标签命名，激活时调用 `dictation.toggle`。                   | 当前源码与测试                    |
| FR2 | 监听期间，Button 以 `label` 或翻译后的停止标签命名，不显示图标，并且五个对辅助技术隐藏的竖条随传入的 `bands` 缩放。                                             | 当前源码与测试                    |
| FR3 | 当听写不受支持时，该控件不渲染任何内容；使用 `isHiddenWhenUnsupported={false}` 时渲染一个禁用的 Button。                                                        | 当前源码与测试                    |
| FR4 | 竖条使用 `--color-accent`，随着 `volume` 越过剪裁阈值而向 `--color-error` 混合，因此主题可以重新着色两端（`architecture:theme-tokens` INV3）。                  | 当前源码与测试                    |
| FR5 | `ref`、DOM、data 与 ARIA 属性、`className`、`style` 和 `xstyle` 到达包装 span，该 span 带有 `chat-dictation-button` 目标；`size` 同时决定 Button 与竖条的尺寸。 | 当前源码与测试                    |
| FR6 | 在减弱动效下，竖条同时改变缩放与颜色，没有过渡。                                                                                                                | `design:reduced-motion`；当前源码 |

### Allowed variation

- **AV1 — 标签。** 调用方可以替换翻译后的开始与停止名称。
- **AV2 — 竖条。** 竖条高度与剪裁强度跟随传入的 `bands` 与 `volume`。
- **AV3 — 主题颜色。** 主题可以更改强调色与错误色。

### Representative states

| State              | Required invariant                | Allowed variation |
| ------------------ | --------------------------------- | ----------------- |
| 受支持，空闲       | 启用的麦克风 Button，带开始名称。 | 标签、尺寸。      |
| 监听               | 停止名称；五条隐藏的竖条。        | 竖条高度。        |
| 剪裁               | 竖条从强调色向错误色混合。        | 主题颜色。        |
| 不受支持，默认     | 不渲染任何内容。                  | —                 |
| 不受支持，保持可见 | 一个禁用的 Button。               | 标签。            |

### Transformation and precedence order

- **ORD1 — 名称。** 先是调用方的 `label`，然后是监听状态下翻译后的开始或停止标签。
- **ORD2 — 支持。** 不受支持且隐藏时，在任何其他状态生效之前不渲染任何内容。

### Performance and resources

- 无资源规则。

## Accessibility contract

- **AR1 — 名称。** 该控件始终有一个名称，说明它是开始还是停止听写，除非调用方覆盖它（FR1、FR2）。
- **AR2 — 装饰性竖条。** 竖条对辅助技术隐藏（FR2）。
- **AR3 — 不可用的操作。** 可见的不受支持控件是禁用的（FR3）；Button 拥有如何传达禁用状态。

## Design relationships

| Anatomy or state | Design requirement                 | Representation authority | Hierarchy role | Component contract |
| ---------------- | ---------------------------------- | ------------------------ | -------------- | ------------------ |
| Button           | 仅含图标的麦克风操作。             | `component:Button`       | 显著           | FR1、FR3           |
| 音量竖条         | 五条显示实时输入电平与剪裁的竖条。 | 当前源码                 | 支撑           | FR2、FR4、FR6      |

尚未记录解剖-主题映射；该块在迁移期间是可选的，因此映射被延后。

## Family and system relationships

- `component:Button` 拥有激活、焦点、禁用语义以及仅图标呈现。
- `architecture:theme-tokens` 拥有竖条使用的强调色与错误色角色。
- `design:reduced-motion` 拥有 FR6 遵循的减弱动效规则。
- 字形与居中的竖条方向中立；RTL 审计将其记录为不适用。

## Verification map

| Contract | Verification                                                                                          | Representative states | Mutation or failure expectation                        | Audit section                             |
| -------- | ----------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------------ | ----------------------------------------- |
| FR1, AR1 | `ChatDictationButton.test.tsx` "labels and toggles the idle button"                                   | 空闲                  | 名称缺失，或激活后未切换，则失败。                     | `audit:ChatDictationButton/behavior`      |
| FR2, AR2 | `ChatDictationButton.test.tsx` "shows five hidden visualizer bars and the stop label while listening" | 监听                  | 竖条数量错误、竖条暴露，或监听时使用开始名称，则失败。 | `audit:ChatDictationButton/behavior`      |
| FR3, AR3 | `ChatDictationButton.test.tsx` 不受支持相关测试                                                       | 不受支持，隐藏与显示  | 渲染或启用不受支持的控件，则失败。                     | `audit:ChatDictationButton/accessibility` |
| FR4      | `ChatDictationButton.test.tsx` "uses theme-owned colors for clipping feedback"                        | 剪裁                  | 用原始颜色替代主题角色，则失败。                       | `audit:ChatDictationButton/theming`       |
| FR5      | `ChatDictationButton.test.tsx` "forwards the root ref and accepted span props"                        | ref 与 span 属性      | 丢失 ref 或属性，则失败。                              | `audit:ChatDictationButton/api`           |
| RTL N/A  | `apps/storybook/rtl-audit/verified-not-applicable.json`                                               | —                     | —                                                      | `audit:ChatDictationButton/rtl`           |

从源码读取，尚无针对性测试：

- FR1：ghost 变体与麦克风图标。
- FR2：监听时不显示图标、竖条随 `bands` 缩放，以及监听时调用方的 `label`。
- FR4：低于剪裁阈值时使用纯强调色。
- FR5：ARIA 属性到达包装元素，`className`、`style` 和 `xstyle` 在包装元素上组合，`chat-dictation-button` 目标，以及 `sm` 尺寸。
- FR6：移除减弱动效过渡。

## Decision log

未记录组件本地的决策。

## Open questions

无。

## Content boundary

本文件不重复使用方的属性表、语音识别行为或 Button 的规则。它链接到它们的所有者。
