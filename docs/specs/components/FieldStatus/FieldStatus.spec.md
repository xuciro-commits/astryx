---
schema_version: 3
template_version: 1
kind: component
id: component:FieldStatus
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-08-30
owners: [cixzhang, imdreamrunner]
review_triggers: [public-api, behavior, theming, accessibility]
verified_by:
  [
    packages/core/src/FieldStatus/FieldStatus.test.tsx,
    packages/core/src/FieldStatus/__tests__/StatusMessage.a11y.test.tsx,
    packages/core/src/FieldStatus/__tests__/StatusMessage.a11y.chromium.spec.ts,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: []
design_specs: []
architecture: [architecture:component-theming-surface]
contributing: []
system_specs: [spec:AST-009, spec:AST-020, spec:AST-021]
---

# FieldStatus component contract

## Intent

FieldStatus 为一个字段或类字段控件呈示一条校验消息。它拥有附加式与分离式呈现中可见消息的处理方式与播报行为；使用方用法仍记录在 `FieldStatus.doc.mjs` 中。

## Compatibility and migration

- 保留的已发布默认值：`yes`
- 兼容类别：仅新增文档；运行时、DOM、样式与公共 API 保持不变，唯一例外是挂载的 live 容器内的传递遵循 `spec:AST-086` FR4
- 受控/非受控行为：不适用
- 迁移决策：拒绝直接支持 `FieldStatus variant="tooltip"`。`tooltip` 仍是字段族的哨兵值，必须在渲染 FieldStatus 之前处理。收窄当前较为宽松的类型/运行时路径需要另行进行考虑兼容性的实现变更。

使用方迁移说明应归属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 附加式与分离式的校验消息呈现。
- 将可见消息经由持久播报通道进行路由。
- 分离式呈现中冗余的视觉状态字形。

**不拥有 / 非目标**

- 调用方是否渲染状态消息，或它描述哪个控件——由组合的字段组件或产品调用点拥有。
- 带边框控件的状态处理与字段内 tooltip 呈现——由组合的字段组件拥有。
- 一般警报与页面级通知——由相应的反馈组件拥有。

## Public concepts

| 概念     | 封闭取值或状态                | 含义                     | 按变体/方向/状态的可获得性                                                              | 默认值     | 所有者                  | 稳定性 | 无效值行为                                                                         |
| -------- | ----------------------------- | ------------------------ | --------------------------------------------------------------------------------------- | ---------- | ----------------------- | ------ | ---------------------------------------------------------------------------------- |
| 状态类型 | `error`、`warning`、`success` | 选择消息语气与播报通道。 | 所有已渲染的呈现。                                                                      | 必需       | `component:FieldStatus` | 稳定   | TypeScript 拒绝不受支持的取值。                                                    |
| 呈现     | `attached`、`detached`        | 选择消息呈现方式。       | 所有直接使用 FieldStatus 的场景。字段族的 `tooltip` 哨兵值在 FieldStatus 渲染前被处理。 | `attached` | `component:FieldStatus` | 稳定。 | TypeScript 拒绝可扩展变体映射中不存在的取值；其当前接受 `tooltip` 是一处实现缺口。 |

字段族的 `tooltip` 状态呈现会抑制 FieldStatus，并从控件的字段内图标展示该消息。`tooltip` 不是 FieldStatus 的呈现方式。公共的可扩展变体映射当前允许直接取 `tooltip` 值；这是一处实现缺口，而非受支持的行为。

## Behavioral and layout contract

草稿需求标明其依据，以免把观察到的代码误当作有意的决策。

| ID  | 候选不变式                                                                                                           | 依据                                | 草稿审查状态                           |
| --- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | -------------------------------------- |
| FR1 | FieldStatus 挂载时必须在单个可见消息框中渲染所提供的消息。                                                           | 已记录的承诺与当前测试。            | 已确定的意图。                         |
| FR2 | 附加式呈现必须在不带前置字形的情况下渲染消息；分离式呈现必须在其消息文本之前渲染状态字形。                           | 已记录的承诺、当前 DOM 与当前测试。 | 已确定的意图。                         |
| FR3 | 状态类型必须选择可区分的 error、warning 或 success 处理，并且必须反映在消息框目标上。                                | 当前行为与主题测试。                | 已确定的意图。                         |
| FR4 | 分离式字形必须在自身目标上反映状态类型；附加式呈现中该目标必须不存在。                                               | 当前行为与目标测试。                | 已确定的意图。                         |
| FR5 | 根元素必须继续转发其 ref、ID、受支持的 DOM props 以及使用方样式逃生舱口。                                            | 当前行为与测试。                    | 当前兼容行为；变更前须验证。           |
| FR6 | 消息与状态类型的更新必须更新可见输出，且不替换组件契约。                                                             | 当前行为与测试。                    | 当前兼容行为；变更前须验证。           |
| FR7 | 直接使用 FieldStatus 必须仅支持 `attached` 与 `detached`；字段族必须在渲染 FieldStatus 之前消费其 `tooltip` 哨兵值。 | 已批准的组件边界。                  | 已确定的意图；当前类型接受是一处缺口。 |

### Allowed variation

- **AV1 — 主题样式。** 主题与使用方覆盖可以通过现有目标与样式逃生舱口更改视觉 CSS 属性，而不改变结构、所有权或呈现行为。
- **AV2 — 消息长度。** 消息可以换行；分离式字形仍与第一行文本对齐。

### Representative states

| 状态           | 必需不变式                                    | 允许的变化                              |
| -------------- | --------------------------------------------- | --------------------------------------- |
| 附加式 error   | 消息框与文本渲染；不渲染分离式字形。          | `field-status` 上由主题控制的视觉属性。 |
| 分离式 warning | 消息框、前置 warning 字形，随后渲染消息文本。 | 两个当前目标上由主题控制的视觉属性。    |
| 分离式 success | 消息框、前置 success 字形，随后渲染消息文本。 | 消息长度与由主题控制的视觉属性。        |
| 空消息         | 根保持挂载并渲染所提供的空值。                | 不创建任何播报通道。                    |

### Transformation and precedence order

- **ORD1 — 呈现样式。** 先解析默认呈现，再通过 `themeProps` 反映状态与呈现，然后应用组件样式，最后按既有顺序合并 `xstyle`、`className` 与内联 `style`。
- **ORD2 — 分离式内容。** 在消息文本之前渲染装饰性状态字形，使用与字段控件相同的状态到字形映射。

### Performance and resources

- **PR1 — 通道更新工作。** 消息变更仅调度持久 live region 的更新；FieldStatus 不拥有任何全局事件监听器、观察器或测量。

## Accessibility contract

- **AR1 — 程序化播报通道。** 错误必须更新持久的 assertive 区域；警告与成功必须更新持久的 polite 区域，包括首次挂载时以及消息或类型变更时，且不移动焦点。在挂载的 live 容器内，适用 `spec:AST-086` FR4。
- **AR6 — 重复提交是表单的场合。** 字段的状态在其消息或类型变更时播报，对相同的值不再重复播报（`spec:AST-086` FR6）。提交是表单的场合（`spec:AST-086` FR1），因此当重复提交以未变化的错误失败时，表单通过 `useAnnounce` 播报一次，例如错误数量与第一个错误，而 FieldStatus 不再播报。
- **AR5 — 辅助技术输出。** 关于消息是否、何时或如何被朗读或以盲文呈现的断言，是 `spec:AST-009` 下建议的真实 AT 后续工作，而非合并或发布要求；DOM 与无障碍树检查可证明程序化暴露与路由。
- **AR2 — 可见描述。** 已渲染的消息框必须保持对辅助技术可用，以支持 `aria-describedby` 关联，且不得成为自身新挂载的 live region。
- **AR3 — 非颜色线索。** 分离式状态必须包含前置状态字形，使状态不仅依靠颜色或位置传达。
- **AR4 — 冗余字形。** 分离式字形必须对辅助技术保持隐藏，因为可见消息已用文字传达状态；播报输出仍归 AR5 所有。

## Design relationships

| 结构或状态 | 设计要求                             | 表现权威                     | 层级角色 | 组件契约           |
| ---------- | ------------------------------------ | ---------------------------- | -------- | ------------------ |
| 消息框     | 承载可见的校验处理。                 | 当前行为与已批准的组件意图。 | 支撑性   | FR1、FR3           |
| 分离式图标 | 仅在分离式呈现中添加非颜色状态线索。 | 当前行为与已批准的组件意图。 | 支撑性   | FR2、FR4、AR3      |
| 消息文本   | 用文字传达校验结果。                 | 当前行为与已批准的组件意图。 | 突出     | FR1、AR1、AR2、AR5 |

当前行为将分离式图标渲染在消息文本之前。预期的公共主题所有权即下面的确切映射；它不新增目标，也不改变任一呈现。

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Message box": {"target": "field-status"},
  "Detached icon": {"target": "field-status-icon"},
  "Message text": {"inherits": "field-status"}
}
```

## Family and system relationships

- `architecture:component-theming-surface` 拥有这两个目标与继承消息文本的资格与校验规则。
- 类字段控件组合 FieldStatus，但继续拥有控件渲染、状态放置决策以及与该控件的关联。

## Verification map

| 契约                | 验证                                                                   | 代表性状态                                | 变更或失败预期                                                                        | 审计小节                          |
| ------------------- | ---------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------- |
| FR1、FR2、AR3、AR4  | `FieldStatus.test.tsx` 渲染与分离式图标套件                            | 附加式与分离式；所有状态类型              | 移除或重排呈现部件会导致 DOM 与无障碍断言失败。                                       | `audit:FieldStatus/anatomy`       |
| FR3、FR4            | `FieldStatus.test.tsx` 主题目标套件                                    | 附加/分离；error/warning/success          | 移除某个目标或状态反映会导致 class/data-attribute 断言失败。                          | `audit:FieldStatus/theming`       |
| FR5、FR6            | `FieldStatus.test.tsx` 转发与更新套件                                  | 初次渲染与重渲染                          | 破坏已发布的根或更新行为会导致兼容性断言失败。                                        | `audit:FieldStatus/behavior`      |
| AR1                 | `StatusMessage.a11y.test.tsx` 与 `StatusMessage.a11y.chromium.spec.ts` | error、warning 与 success；挂载后消息替换 | 移除持久通道、更改其 role/urgency，或丢弃挂载后更新，都会导致共享的状态消息契约失败。 | `audit:FieldStatus/accessibility` |
| AR1                 | `FieldStatus.test.tsx` 通道路由套件                                    | 首次非空挂载；同一实例的消息与类型变更    | 破坏 FieldStatus 的首次使用 hook 调用或严重性重路由会导致组件特定的断言失败。         | `audit:FieldStatus/accessibility` |
| AR5                 | `spec:AST-009` 下建议的真实 AT 后续工作                                | 首次挂载；消息替换；类型/紧急度变更       | 在获得真实 AT 回执之前，语音与盲文输出保持未验证；这不阻塞合并或发布。                | `audit:FieldStatus/accessibility` |
| AR2                 | `FieldStatus.test.tsx`                                                 | 附加/分离的可见消息与空消息               | 可见描述变成第二个 live region，或对辅助技术隐藏。                                    | `audit:FieldStatus/accessibility` |
| Theming anatomy map | `scripts/check-knowledge.mjs`                                          | 使用方结构与当前目标                      | 缺失、多余、重复、带前缀或过期的映射会导致仓库校验失败。                              | `audit:FieldStatus/theming`       |

## Decision log

### DEC-1 — Presentation-specific anatomy remains explicit

**引用：** `component:FieldStatus/DEC-1`

**决策者：** cixzhang, 2026-08-30

分离式图标是独立的结构部件，因为只有分离式呈现才渲染它，且它拥有一个不同于消息框的目标。消息文本继承消息框目标，而不创建冗余的子目标。

已否决：将字形合并进通用的消息行，那会隐藏其呈现条件与独立的主题所有者。

### DEC-2 — `tooltip` is not a FieldStatus presentation

**引用：** `component:FieldStatus/DEC-2`

**决策者：** cixzhang, 2026-08-30

直接使用 FieldStatus 仅支持 `attached` 与 `detached`。字段族可以将 `tooltip` 用作内部呈现哨兵值，但它必须在渲染 FieldStatus 之前消费该值，并改由控件的字段内状态处理来展示消息。

已否决：定义直接的 `FieldStatus variant="tooltip"` 渲染语义。那会把一种字段组合机制暴露为 FieldStatus 的第三种呈现方式，并保留当前并非有意产生的输出。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 示例、当前审计结果、实现步骤或族/系统规则。它以链接指向其所有者。
