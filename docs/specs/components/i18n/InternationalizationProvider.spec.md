---
schema_version: 3
template_version: 7
kind: component
id: component:InternationalizationProvider
authority: current
archive_reason: null
superseded_by: null
approved_by: nynexman4464
approved_at: 2026-10-15
owners: [nynexman4464, cixzhang]
review_triggers: [public-api, behavior, accessibility]
verified_by:
  [
    packages/core/src/i18n/__tests__/resolve.test.ts,
    packages/core/src/i18n/__tests__/InternationalizationProvider.test.tsx,
    packages/core/src/i18n/__tests__/useDirection.test.tsx,
    packages/core/src/i18n/__tests__/getLocaleDirection.test.ts,
    packages/core/src/i18n/__tests__/useLocale.test.tsx,
    packages/core/src/i18n/useTranslator.test.tsx,
    packages/core/src/i18n/__tests__/calendarSystem.test.tsx,
  ]
modules: []
families: []
design_specs: []
architecture: [architecture:internationalization]
contributing: []
system_specs: [spec:AST-111/FR1, spec:AST-111/FR2]
---

# InternationalizationProvider component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | `messages` 接受 `ProviderMessagesByLocale`：每个 locale 映射到一个富 `Catalog` 或一个生成的 `RuntimeCatalog` 字符串映射。`RuntimeCatalog` 与 `ProviderMessagesByLocale` 从 `@astryxdesign/core/i18n` 导出。可选的 `calendar` 接受一个 `CalendarSystem`，同样从那里导出；上下文将解析后的日历作为可选的 `calendar` 携带。现有 props 与富 `MessagesByLocale` 上下文形状保持不变。                                           |
| Behavior                | Astryx 字符串按 override → 提供的 catalog → 随附英文的顺序解析，查找路径从精确 locale → 父 locale。富 catalog 与 runtime catalog 的解析结果完全一致；上下文始终暴露富形状。任意 provider prop 变化都会更新其子树。嵌套 provider 会替换其父上下文。日历从 `calendar` 解析，否则为 `gregory`；locale 绝不选择它，即使带有 `-u-ca-` 关键字。没有 provider 时：locale 为 `en`，方向为 `ltr`，使用随附英文，日期为格里高利历。 |
| End-user impact         | 使用已翻译 locale 的用户，在存在翻译的地方会看到该 locale 的 Astryx 界面与辅助文本，否则看到有意义的英文；缺失的翻译绝不会移除可访问名称或播报。                                                                                                                                                                                                                                                                          |
| Builder impact          | 可选：导入 `@astryxdesign/core/locales/<tag>.generated.js` 以获得更小的包体；`<tag>.json` 仍然可用。渲染一次 provider，自由提供部分 catalog，并保持 DOM `dir` 与 provider 方向一致。                                                                                                                                                                                                                                      |
| Compatibility/readiness | 已发布的默认行为保持不变；provider、子路径、props、hooks 与富上下文形状都是稳定的公共 API；runtime-catalog 输入是增量的。重新渲染、嵌套 provider 以及 runtime-catalog 行为由针对性测试覆盖。                                                                                                                                                                                                                              |
| Review checks           | 拒绝重排回退顺序（FR1、ORD1）；拒绝隐藏一个在所有适用来源（包括随附英文）中都缺失的键（FR2）；拒绝会合并父上下文的嵌套 provider（FR8）；拒绝 provider 设置 DOM `lang`/`dir`（FR5）或持久化 locale（FR4）；拒绝非字符串的 translator 结果（FR7）；拒绝在没有 provider 时输出宿主 locale（FR6）；拒绝暴露字符串映射条目或以不同方式解析富输入与 runtime 输入的上下文值（FR9）。                                             |
| Governing rules         | `architecture:internationalization` INV2–INV5, INV7, INV12, INV13, INV15; `spec:AST-111` FR1, FR2.                                                                                                                                                                                                                                                                                                                        |

本表是审查视角的投影；以下正文具有权威性。

## Intent

InternationalizationProvider 将一棵子树绑定到 Astryx 的活动 locale、翻译 catalog、稀疏的 Astryx 字符串覆盖以及方向默认值。它让 Astryx 组件本地化自身的界面，同时让应用保留对产品文案与 locale 持久化的所有权。

## Compatibility and migration

- 已发布的默认行为保持不变：`yes`——没有 provider 的树继续以 locale `en` 和方向 `ltr` 渲染随附英文字符串。
- 兼容性类别：已发布的 provider 名称、`@astryxdesign/core/i18n` 子路径、props、上下文行为以及 hooks 都是稳定的公共 API。
- 受控/非受控行为：受控。调用方在每次渲染时提供 locale、messages、overrides 以及可选的 direction。
- 迁移决策：替换 provider 或 hook 需要在 `architecture:internationalization/INV2` 下已接受的兼容性与迁移决策。

使用方的迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 一个 React 子树的活动 Astryx locale 以及可选的显式方向。
- 将提供的 locale catalog（富或生成式）与稀疏 overrides 绑定到稳定的 translator 函数，并以富形状将它们暴露给使用方。
- 从 `calendar` 解析子树的日历系统，并在上下文上暴露它。
- 当任意 provider 输入变化时更新 provider 使用方。
- 由 i18n 入口点暴露的无 provider 英文/LTR 上下文默认值。

**不拥有 / 非目标**

- 应用的 locale 选择、路由、持久化或账户偏好——由产品拥有。
- 产品创作的字符串与应用 catalog——由产品调用点或其选定的 i18n 运行时拥有。
- DOM `lang` 或 `dir` 属性——由应用文档或区域拥有。
- 服务器/RSC 翻译上下文——尚未解决的独立 API 工作。
- 富 React 节点/函数消息——超出受支持的字符串 catalog 模型。

## Public concepts

| Concept   | Closed values or states                     | Meaning                                                                                                                  | Availability by variant/orientation/state | Default                                | Owner                                    | Stability | Invalid-value behavior                                                                                                                   |
| --------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- | -------------------------------------- | ---------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Locale    | 有效的 BCP 47 locale 字符串                 | 选择查找、ICU 格式化以及 provider 感知的 locale 操作                                                                     | 每个 provider 子树                        | provider 上必填；否则为 `en`           | `component:InternationalizationProvider` | stable    | 调用方必须传入有效标签；格式错误的标签在格式化或排序时可能抛出，而静态键查找仍可能到达英文                                               |
| Messages  | locale → `Catalog` 或 `RuntimeCatalog`      | 添加已翻译的或应用提供的 catalog，形式为富 `{defaultMessage, description?}` 条目或生成的键到字符串映射，且不替换随附英文 | 每个 locale                               | `{}`                                   | `component:InternationalizationProvider` | stable    | 缺失条目会沿活动 locale 的父链回退，然后回退到随附英文；提供的 `en` catalog 仅当该链包含 `en` 时才被读取；同一次调用中的混合形状可被接受 |
| Overrides | locale → 稀疏键/字符串映射                  | 在 catalog 查找之前改写单个 Astryx 字符串                                                                                | 每个 locale                               | 无                                     | `component:InternationalizationProvider` | stable    | `null` 不会成为可见内容；未解析的键继续走回退                                                                                            |
| Direction | `ltr` 或 `rtl`                              | 暴露 provider 的语义方向默认值                                                                                           | 每个 provider 子树                        | 从 locale 派生；无 provider 时为 `ltr` | `component:InternationalizationProvider` | stable    | 无效值会被类型契约拒绝                                                                                                                   |
| Calendar  | 一个 `CalendarSystem`（`spec:AST-111` FR1） | 子树中的 `Calendar`、`DateInput`、`DateRangeInput` 与 `DateTimeInput` 所显示的日历系统；值保持为格里高利 ISO 日期        | 每个 provider 子树                        | `gregory`                              | `spec:AST-111`                           | stable    | `CalendarSystem` 之外的标识符解析为 `gregory` 并在开发环境警告一次；`locale` 中的 `-u-ca-` 关键字不会选择日历                            |

使用方的 prop 语法与示例保留在 `InternationalizationProvider.doc.mjs` 与 `astryx docs internationalization` 中。

## Behavioral and layout contract

| ID   | Candidate invariant                                                                                                                                                                                                                                                                                                                                                                       | Basis                                                                             | Draft review state |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------ |
| FR1  | provider 必须按精确 locale overrides → 父 locale overrides → 精确/父提供的 catalogs → 随附英文的顺序解析 Astryx 字符串。                                                                                                                                                                                                                                                                  | 当前解析器与针对性测试                                                            | settled            |
| FR2  | 缺失的已翻译键必须静默回退；一个在所有适用来源（包括随附英文）中都缺失的键必须在开发环境警告一次，并可见地渲染该键。                                                                                                                                                                                                                                                                      | 已发布的解析器与测试                                                              | settled            |
| FR3  | 以变更后的 locale、messages、overrides 或 direction 重新渲染时，必须更新上下文值以及后代使用的 translator。                                                                                                                                                                                                                                                                               | 已发布的 provider 与重新渲染测试                                                  | settled            |
| FR4  | provider 不得选择、持久化或变更应用的 locale 状态。                                                                                                                                                                                                                                                                                                                                       | 已发布的 API 所有权                                                               | settled            |
| FR5  | provider 不得设置 DOM `lang` 或 `dir`。其方向值与应用的 DOM 方向是应用需保持一致的独立输入。                                                                                                                                                                                                                                                                                              | `architecture:internationalization/INV12`                                         | settled            |
| FR6  | 没有 provider 时，公共上下文与 hooks 必须暴露 locale `en`、方向 `ltr`、空的自提供 catalog 映射，以及由随附英文支撑的 translator。                                                                                                                                                                                                                                                         | 已发布的上下文与测试                                                              | settled            |
| FR7  | provider 必须保留返回字符串的 translator，适用于可见文本与辅助属性。                                                                                                                                                                                                                                                                                                                      | 已发布的 catalog/runtime 契约                                                     | settled            |
| FR8  | 嵌套 provider 必须用仅来自子 provider 自身 props 的值替换 locale、messages、overrides、direction 与 calendar，而不是合并父上下文。                                                                                                                                                                                                                                                        | 已发布的 provider 与嵌套 provider 测试                                            | settled            |
| FR10 | provider 必须从其 `calendar` prop 解析日历，否则为 `gregory`，并在上下文上以 `calendar` 暴露。locale 不得选择日历，无论是通过其默认日历还是通过 `-u-ca-` 关键字：单独的 `fa-IR` 与 `th-TH-u-ca-buddhist` 都解析为 `gregory`。日历独立于语言、编号与方向。`Calendar`、`DateInput`、`DateRangeInput` 与 `DateTimeInput` 遵循解析后的日历，而组件自身的 `calendar` prop 优先于 provider 的。 | `spec:AST-111` FR1, FR2                                                           | settled            |
| FR9  | provider 必须按 locale 接受 `RuntimeCatalog` 字符串映射或富 `Catalog`，将两者解析为相同的字符串，并无论输入为何都在上下文上以富 `MessagesByLocale` 形状暴露 `messages`。                                                                                                                                                                                                                  | `architecture:internationalization/INV15`；provider 与解析器 runtime-catalog 测试 | settled            |

### Allowed variation

- **AV1 — Catalog 完整性。** 非英文的自提供 catalog 可以包含任意英文键子集；缺失条目使用回退。目前该回退仅到达随附英文，因此它覆盖 Astryx 键；见 OQ1。
- **AV2 — Locale 特异性。** 调用方可以提供区域、文字或基础 locale。解析器会规范化并遍历相应的父链。
- **AV3 — 应用集成。** 另一个 i18n provider 可以在本 provider 内部或外部包裹 Astryx，只要应用保持 locale 状态一致。
- **AV4 — Catalog 形式。** 调用方可以按 locale 传入随附的富 JSON、随附的生成式字符串映射，或任一形状的本地 catalog。

### Representative states

| State                        | Required invariant | Allowed variation                |
| ---------------------------- | ------------------ | -------------------------------- |
| 无 provider                  | FR6                | 无                               |
| 英文 provider                | FR1–FR4, FR7       | messages 与 overrides 可省略     |
| 精确已翻译 locale            | FR1–FR4, FR7, FR9  | 完整或部分 catalog，富或 runtime |
| 带基础 catalog 的区域 locale | FR1–FR4, FR7       | 父标签数量                       |
| 运行时 locale 切换           | FR3                | 应用持久化机制                   |
| 显式方向覆盖                 | FR3, FR5           | 为测试目的 locale 可保持 LTR     |
| 嵌套 provider                | FR1–FR8            | 子 props 完全替换父上下文        |
| 生成的 runtime catalog 输入  | FR9                | 混合富与 runtime locale          |

### Transformation and precedence order

- **ORD1 — 消息解析。** 读取精确 locale override → 遍历父 locale overrides → 读取精确 locale 的自提供 catalog → 遍历父自提供 catalogs → 读取随附英文 → 若到处缺失则警告并渲染该键。
- **ORD1a — 输入规范化。** 在 ORD1 运行之前，`RuntimeCatalog` 条目被当作以该字符串为 `defaultMessage` 且无描述的富条目；上下文接收规范化后的富映射。
- **ORD2 — 方向解析。** 提供了显式 `dir` 时使用它；否则从 locale 派生方向；provider 之外使用 `ltr`。
- **ORD3 — 日历解析。** 提供了 `calendar` 时使用它；否则为 `gregory`，locale 带有 `-u-ca-` 关键字时也是如此；provider 之外使用 `gregory`（FR10）。

### Performance and resources

- **PR1 — 稳定的 translator 标识。** 输入引用未变化的 provider 渲染应保留其记忆化的上下文值与 translator。
- **PR2 — 已解析消息复用。** 只要输出与全新格式化等价，ICU 格式化器实例可以按 locale 与消息缓存。

## Accessibility contract

- **AR1 — 辅助字符串使用相同的解析契约。** `aria-label`、`title`、实时播报以及其他面向 AT 的 Astryx 字符串必须使用活动 translator 并保持为字符串；用片段拼装它们或手写复数形式，属于 `architecture:internationalization/INV1a` 下的绕过行为。
- **AR2 — 缺失翻译仍可用。** 预期的非英文缺口必须回退到有意义的英文，而不是移除可访问名称或播报。
- **AR3 — 方向仍对浏览器语义可用。** provider 必须说明应用需设置 DOM `dir`；仅靠上下文值无法修正浏览器文本流、标点、焦点顺序或平台双向行为。

## Design relationships

| Anatomy or state  | Design requirement                                  | Representation authority            | Hierarchy role | Component contract |
| ----------------- | --------------------------------------------------- | ----------------------------------- | -------------- | ------------------ |
| Provider 子树     | 产品一致地选择 locale 与区域方向。                  | 应用拥有                            | supporting     | FR3–FR5            |
| Astryx 系统字符串 | Astryx 提供本地化的默认值；调用方内容可以特化语义。 | `architecture:internationalization` | supporting     | FR1, FR7, AR1      |
| 缺失的翻译        | 界面通过英文回退保持可理解。                        | `architecture:internationalization` | supporting     | FR2, AR2           |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Provider boundary": {
    "none": {
      "reason": "intentional: InternationalizationProvider renders no DOM element and exposes no theming anatomy."
    }
  }
}
```

## Family and system relationships

- `architecture:internationalization` 拥有跨库的 catalog、locale、格式化器、日期日历、输出类型、外部运行时以及生成式 runtime-catalog 交付边界（哪些文件是创作的、哪些是派生的、它们如何发布与解析）。
- 组件契约拥有哪些字符串由 Astryx 创作、哪些内容由调用方创作。

## Verification map

| Contract       | Verification                                                                            | Representative states                                                                                                                 | Mutation or failure expectation                                                    | Audit section                                      |
| -------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------- |
| FR1, FR2, ORD1 | `resolve.test.ts`                                                                       | 精确、父级、英文、缺失源键                                                                                                            | 重排回退顺序或隐藏缺失的源键会使针对性测试失败                                     | `audit:InternationalizationProvider/behavior`      |
| FR3, PR1       | `useTranslator.test.tsx`, `useLocale.test.tsx`, `InternationalizationProvider.test.tsx` | 稳定输入；locale、message、override 与 dir 切换                                                                                       | 过期的 translator/方向或不必要的标识抖动会使这些测试失败                           | `audit:InternationalizationProvider/performance`   |
| FR5, ORD2      | `useDirection.test.tsx`, `getLocaleDirection.test.ts`                                   | 派生、显式、无效 locale、无 provider                                                                                                  | 设置 DOM 方向或忽略显式覆盖会使源码/测试失败                                       | `audit:InternationalizationProvider/rtl`           |
| FR6            | `useTranslator.test.tsx`, `useLocale.test.tsx`, `useDirection.test.tsx`                 | 无 provider                                                                                                                           | 宿主 locale 或缺失英文输出会使测试失败                                             | `audit:InternationalizationProvider/behavior`      |
| FR7, AR1, AR2  | 组件翻译测试与硬编码字符串 lint                                                         | 可见文本、aria 标签、播报、缺失翻译                                                                                                   | 非字符串输出或未翻译的自有文本会使测试/lint 失败                                   | `audit:InternationalizationProvider/accessibility` |
| FR8            | `InternationalizationProvider.test.tsx`                                                 | 父与子 provider                                                                                                                       | 父 messages、overrides 或 direction 泄漏到子级会使测试失败                         | `audit:InternationalizationProvider/behavior`      |
| FR9, ORD1a     | `useTranslator.test.tsx`、`resolve.test.ts` 的 runtime-catalog 用例                     | 生成式字符串映射、富 catalog、混合                                                                                                    | 被拒绝的字符串映射、上下文上的字符串映射条目，或两种形状之间输出不一致会使测试失败 | `audit:InternationalizationProvider/behavior`      |
| FR10, ORD3     | `i18n/__tests__/calendarSystem.test.tsx` 的解析顺序与标识符用例                         | 每个标识符；未知标识符（包括 `islamic`）；组件优先于 provider 优先于默认；裸 `fa-IR` 与 `th-TH`；带 `-u-ca-` 的 locale 保持 `gregory` | locale 选择日历、优先级改变，或未知标识符抛出或警告两次会使测试失败                | `audit:InternationalizationProvider/behavior`      |

## Decision log

### DEC-1 — Keep the released Astryx runtime narrow

**Reference:** `component:InternationalizationProvider/DEC-1`

**Decider:** `nynexman4464`, `2026-09-03`

Astryx 将 `InternationalizationProvider` 与已发布的 i18n hooks 保持为其规范运行时。Astryx 可以支持小型应用，但不会为了与完整 i18n 框架竞争而吸收应用拥有的富消息与函数。需求更大的应用在 Astryx 之外使用成熟的 i18n 运行时；适配器仍可作为增量后续工作。

已否决：一个平行的 provider/hook 运行时，它替换已发布的接口面，并把 Astryx 字符串所有权与应用富消息所有权混在一起。

## Open questions

- **OQ1 — 将提供的 `en` 作为非 Astryx 键的回退（已知缺陷）。** 随附英文 runtime catalog 是唯一的跨 locale 回退，且只包含 Astryx 键。因此，当调用方提供了 `en` catalog 时，活动 locale 中缺失的应用或库键仍会渲染为原始键。这是一个已知的跨 locale 回退缺陷。契约描述随附行为，但不认可该限制；要支持提供的英文回退，需要相应的 FR1/ORD1 修订，以及使用部分翻译的非 Astryx 键的回归测试。（`human-api`）
- **OQ2 — 格式错误的 locale 行为。** 决定未来版本是否应在 provider 边界拒绝无效的 BCP 47 标签，还是保留当前因格式化器而异的抛出行为。（`human-api`）
- **OQ3 — 外部运行时适配器。** 决定确切的增量式 `Translator` 适配器契约，包括谁拥有查找、回退与格式化器失败。（`human-api`）
- **OQ4 — 服务器翻译运行时。** 决定那小组原本服务器安全的使用方是否足以证明需要单独的 RSC 翻译 API 与请求隔离模型。（`human-api`）

## Content boundary

本文件不重复使用方的 prop 表格/示例、catalog 校验实现、runtime-catalog 生成、当前翻译覆盖范围或跨库 i18n 规则。它链接到它们的拥有者。
