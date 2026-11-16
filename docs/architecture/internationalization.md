---
schema_version: 1
template_version: 3
kind: architecture
id: architecture:internationalization
authority: current
archive_reason: null
superseded_by: null
approved_by: nynexman4464
approved_at: 2026-10-15
owners: [nynexman4464, cixzhang]
applies_to:
  [
    packages/core/src/i18n/,
    packages/core/locales/,
    packages/core/src/i18n/generated-locales/,
    packages/core/src/i18n/generated-english/,
    scripts/generate-i18n-runtime.mjs,
    scripts/i18n-english-fallback.mjs,
    packages/build/src/vite.ts,
    packages/core/src/utils/plainDate.ts,
    packages/core/src/utils/calendarSystem.ts,
    packages/core/src/utils/dateParser.ts,
    packages/core/src/PowerSearch/formatFilterValue.ts,
    packages/core/src/Timestamp/tooltipEntries.ts,
    packages/core/src/utils/characters.ts,
    packages/core/src/hooks/useStreamingText.ts,
    packages/core/src/utils/typeaheadMatch.ts,
    internal/eslint-plugin-astryx/,
    scripts/check-i18n-catalog.mjs,
  ]
verified_by:
  [
    packages/core/src/i18n/__tests__/resolve.test.ts,
    packages/core/src/i18n/__tests__/InternationalizationProvider.test.tsx,
    packages/core/src/i18n/__tests__/useLocale.test.tsx,
    packages/core/src/i18n/__tests__/useDirection.test.tsx,
    packages/core/src/i18n/__tests__/getLocaleDirection.test.ts,
    packages/core/src/i18n/__tests__/useCollator.test.tsx,
    packages/core/src/i18n/__tests__/calendarSystem.test.tsx,
    packages/core/src/utils/calendarSystem.test.ts,
    packages/core/src/i18n/useTranslator.test.tsx,
    packages/core/src/i18n/__tests__/englishFallback.test.ts,
    scripts/i18n-english-fallback.test.mjs,
    scripts/check-i18n-catalog.test.mjs,
    scripts/generate-i18n-runtime.test.mjs,
    packages/build/src/vite.test.ts,
    packages/build/src/vite.build.test.ts,
    internal/eslint-plugin-astryx/no-hardcoded-i18n-string.test.mjs,
    internal/eslint-plugin-astryx/no-raw-intl-locale.test.mjs,
    packages/core/src/PowerSearch/formatFilterValue.test.ts,
    packages/core/src/Timestamp/tooltipEntries.test.ts,
    packages/core/src/utils/typeaheadMatch.test.ts,
    packages/core/src/hooks/useTypeahead.test.tsx,
    packages/core/src/hooks/useTreeFocus.test.tsx,
  ]
deciding_specs: []
---

# Internationalization architecture

<!-- review-applicability:v1 -->

```json
{
  "scope": "global",
  "triggers": {
    "accessibility": ["INV1", "INV1a", "INV3a", "INV7"],
    "behavior": [
      "INV1",
      "INV1a",
      "INV3",
      "INV3a",
      "INV4",
      "INV5",
      "INV7",
      "INV8",
      "INV9",
      "INV10",
      "INV17"
    ],
    "compatibility": ["INV2", "INV9", "INV10"],
    "layout": ["INV11", "INV12"],
    "public-api": ["INV1", "INV1a", "INV2", "INV3a", "INV7", "INV9", "INV10"],
    "react-runtime": ["INV3", "INV4", "INV11", "INV12", "INV13"]
  }
}
```

## Contract at a glance

| 领域             | 契约                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 管辖契约         | `component:InternationalizationProvider` 负责 Provider 行为。本记录定义预期的国际化契约以及已实现的运行时目录交付边界；它并不证明每个现有使用方都符合该契约。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 系统行为         | Astryx 自有的字符串依次通过按 locale 的覆盖、提供的目录、随包发布的英文来解析，并按精确 locale → 父级 locale 逐级查找。locale 敏感的操作（日期、时间、数字、列表、排序）直接接收 Provider 的 locale，不经过目录或覆盖步骤；带可选 locale 参数的旧版纯辅助函数确定性地默认使用英文，但 INV9 记录的已知 `currency()` 缺口除外。没有 Provider 时，结果为确定性的英文。编写的目录是富格式的（`defaultMessage` + `description`）；随包发布的运行时目录是由它们生成的字符串映射。消息是 ICU MessageFormat 1 字符串。`PlainDate` 保持公历。渲染方向来自 DOM。                                                                                                       |
| 对最终用户的影响 | 使用非英文 locale 的人会看到该 locale 下的 Astryx 界面文本、格式和排序顺序（只要存在翻译），否则看到英文；布局和镜像方向遵循他们正在阅读的文档方向。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 对构建者的影响   | 渲染一个 `InternationalizationProvider`，并让 DOM 的 `dir` 与其保持一致。从 `@astryxdesign/core/locales/<tag>.generated.js`（字符串映射）或 `<tag>.json`（富格式）导入随包发布的 locale；两者都受支持。把 Provider 的 locale 传给 Astryx 自有的 `Intl` 调用。将 Astryx 字符串连同描述添加到 `en.json`；绝不要编辑生成模块。没有单独的 locale 包，也没有第二个 Astryx 运行时。                                                                                                                                                                                                                                                                                |
| 兼容性/就绪情况  | 已发布的 Provider、hooks、子路径、富格式 JSON 导出和富格式上下文形状均保持不变；`RuntimeCatalog`、`ProviderMessagesByLocale` 和 `*.generated.js` 导出属于新增内容。服务端/RSC 翻译运行时和外部运行时适配器仍是独立的决策（INV13、INV14）。`useTypeahead` 和 `useTreeFocus` 通过 INV17 的共享折叠进行匹配，这取代了它们已发布的朴素“以……开头”匹配。                                                                                                                                                                                                                                                                                                           |
| 审查检查项       | 拒绝由字面量、字符串拼接或手写复数拼装而成的 Astryx 自有文本或播报，而不是目录消息（INV1a）；在指定的共享辅助函数之外调用 locale 敏感的 `Intl` 或原型方法，或调用公共日期辅助函数时未传 Provider locale 参数（INV8）；没有迁移决策就引入并行或替代运行时（INV2）；隐式读取宿主 locale（INV3）；消息输出不是字符串（INV7）；翻译目录添加过期键或更改 ICU 契约（INV6）；手改、提交或携带 description 的生成模块，或更改的富格式导出路径（INV15）；locale 悄悄改变 `PlainDate` 日历语义（INV10）；渲染时由 Provider 方向驱动几何布局（INV11）；Provider 修改 DOM `dir`（INV12）；type-to-select 漏掉带标记或带斜杠的首字母，或折叠影响排序或显示文本（INV17）。 |
| 适用规则         | 无决定性的系统规格。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

此表是审查投影；以下正文具有权威性。

## Purpose

Astryx 为其组件的系统自有文本、格式、比较和文本方向提供本地化，而不会成为通用的应用国际化框架。应用继续拥有产品文案，并可以在 Astryx 之外使用任何应用 i18n 运行时。

本记录定义该库的目录和 locale 边界。使用方设置和示例保留在 `astryx docs internationalization` 中。

### Cross-cutting component contract

当组件和模块的语义触发器匹配时，全局路由会把共享的 i18n 主张投射到它们的审查中。它们不要求每个组件重复这些规则，也不要求仅仅为了接收这些规则而添加反向链接。无障碍审查加载字符串所有权和字符串输出主张；行为审查还会加载 locale、回退、格式化和日历主张。目录生成和 Provider 内部实现不会仅仅因为共享本记录就成为所有组件的普遍要求。

组件和模块契约负责界定哪些内容是 Astryx 编写的、哪些是调用方编写的、内容 prop 的语义角色、本地格式化输入、依赖状态的行为，以及证明这些本地结果的证据。共享字符串所有权、辅助函数边界、确定性的 locale 默认值和日历要求保留在这里。`component:InternationalizationProvider` 拥有 Provider 的本地 API 和优先级契约，而不是为每个组件再提供一套规则。

审查只在其声明的范围内应用匹配的主张，并针对确切的增量解析直接的组件、模块或家族所有者。本地例外必须指明其语义边界，并与当前的共享主张保持一致；缺失的本地规格或现有实现不会产生豁免。草稿路由不提供管辖权威。

## System model

```text
consumer content prop
  → wins when the component exposes semantic specialization

packages/core/locales/<tag>.json          (authored, rich: defaultMessage + description)
  → scripts/generate-i18n-runtime.mjs
  → packages/core/src/i18n/generated-locales/<tag>.generated.ts   (derived, ignored)
  → @astryxdesign/core/locales/<tag>.generated.js                  (published string map)
  → @astryxdesign/core/locales/<tag>.json                          (published rich, unchanged)

InternationalizationProvider
  → active locale
  → optional locale catalogs, rich or generated (ProviderMessagesByLocale)
      → normalized to the rich context shape (MessagesByLocale)
  → optional per-locale Astryx overrides
  → optional direction override

Astryx-owned string
  → provider-bound translator
  → exact locale
  → parent locale(s)
  → shipped English fallback
      → each Core module's derived English map for the keys it names
        (packages/core/src/i18n/generated-english/, ignored; scripts/i18n-english-fallback.mjs)
      → the whole generated English catalog on public paths that resolve any Astryx key

Locale-sensitive formatting or comparison
  → active provider locale passed directly to the shared formatter
```

`@astryxdesign/core/i18n` 是规范的公共入口点。已发布的接口面由 `InternationalizationProvider`、`InternationalizationContext`、它们的公共值/Prop 类型、`useTranslator`、`TranslatorFn`、`useLocale`、`useCollator`、`useDirection`、`getLocaleDirection`，类型 `Locale`、`Catalog`、`MessageEntry`、`RuntimeCatalog`、`MessagesByLocale`、`ProviderMessagesByLocale` 和 `Overrides`，以及 `Translator` 接口组成。随包发布的目录发布在 `@astryxdesign/core/locales/` 下：`<tag>.json` 是编写好的富格式目录，`<tag>.generated.js` 是其运行时字符串映射，覆盖全部 30 种随包发布的 locale 以及 `pseudo`。

## Boundaries and invariants

- **INV1 — Astryx 拥有 Astryx 字符串，而不是应用文案。** 组件自有的标签、播报、说明和辅助文本使用 Astryx 目录。产品内容仍由调用方拥有。当 Astryx 暴露语义特化时，内容 prop 优先。
- **INV1a — Astryx 自有的文本以目录为后盾。** 每个 Astryx 自有的可见或辅助字符串，包括 live-region 播报和 `aria-*`/`title` 值，都必须是由规范 translator 解析的 `en.json` 键。运行时变化的文本，例如计数、范围或拼接的标签，必须是一条带占位符、复数或选择（select）的 ICU 消息；不得在调用点由字面量、字符串拼接或手写复数分支拼装。translator 是这条规则的执行边界：因为自有文本都汇聚到一个可识别的 API，lint 无需猜测意图就能拒绝文本型 JSX 子节点、字符串类型的 prop、属性或播报中的字面量或拼装字符串。通过内容 prop 提供的调用方自有产品文案不在此规则范围内。
- **INV2 — 已发布的 Provider 和 hooks 是规范实现。** `InternationalizationProvider` 以及 `@astryxdesign/core/i18n` 下的 hooks 仍是受支持的运行时。替换 Provider、hook、子路径或目录所有权模型需要明确的兼容性和迁移决策；按惯例不会添加并行的公共运行时。
- **INV3 — 没有 Provider 时确定性地使用英文。** 在 Provider 之外使用的组件从随包发布的英文目录解析 Astryx 字符串，暴露 locale `en`、方向 `ltr`，并且不会隐式读取浏览器或宿主 locale。
- **INV3a — 工厂函数为其播报或显示的每个字符串提供一个选项。** 一个公共的非 React 工厂（`architecture:public-component-api` INV22），如果播报或显示 Astryx 文本（live-region 播报、`aria-*` 或 `title` 值，或可见标签），则为其每个此类字符串提供一个选项。只有一个字符串的工厂接受一个扁平的可选字符串选项，例如 `createResizable` 的 `collapsedLabel`（调用方提供的无障碍名称，已经作为自己的选项存在，例如 `label`，保持扁平且不计入工厂的字符串）；有多个字符串的工厂将它们归入一个可选的 `labels` 对象，每个键都可选。缺少选项或键时回退到目录消息：当工厂的 React 包装器在 Provider 下运行时翻译，没有 Provider 时使用英文；给定的字符串会替换该消息，包括覆盖 Provider 的翻译。任何工厂都不接受 translator：翻译只能来自 Provider。该规则覆盖 INV22 的工厂。按消息选项是工厂机制；外部运行时适配器（INV14）仍是一个独立的、范围更广的决策。
- **INV4 — 运行时 locale 更改即时生效。** 用新的 locale、消息、覆盖或方向重新渲染 Provider 会更新该子树中的使用方。Astryx 不会持久化或选择应用的 locale。
- **INV5 — 回退是有序的，对预期缺口保持静默。** 对于有效的 BCP 47 locale，解析先检查按 locale 的覆盖（从精确 locale 到父级 locale），然后检查提供的目录（从精确 locale 到父级 locale），最后检查随包发布的英文。缺失的非英文翻译会静默回退。如果某个键在所有来源（包括英文）中都不存在，则是缺陷：开发模式会警告一次，并可见地渲染该键。格式错误的 locale 标签不在此回退保证范围内，在构造平台格式化器或排序器时可能抛出异常。已知 bug：最后一步只读取随包发布的英文，而不是提供的 `en` 目录，因此非 Astryx 键目前没有跨 locale 回退；参见 `component:InternationalizationProvider` OQ1。
- **INV6 — 英文是源契约。** `packages/core/locales/en.json` 定义 Astryx 的键集合、默认消息、描述和 ICU 运行时契约。翻译目录可以省略键并回退到英文；它们不得添加过期键，也不得更改已翻译条目的参数、选择、复数、序数、标签或嵌套契约。translator 的 `description` 文本只存在于编写的 JSON 中；运行时目录从不携带它。
- **INV7 — 消息产生字符串。** Astryx 目录使用 ICU MessageFormat 1 和 `intl-messageformat`。受支持的翻译结果是适合可见文本和属性（例如 `aria-label` 和 `title`）的字符串。富格式 React 节点、函数和应用自有的消息对象不在此运行时范围内，除非以后接受的契约增加它们。
- **INV8 — 共享辅助函数拥有 locale 敏感行为。** Astryx 自有的日期、时间、数字、相对时间、列表、排序、语音识别及类似操作显式接收当前活动的 Provider locale。组件代码调用共享的格式化器、解析器或排序辅助函数，而不是在任意调用点构造原始 `Intl` 格式化器或调用 locale 敏感的原型方法。仅提供名为 `locale` 的参数并不构成符合：仅语法 lint 无法证明它来自 Provider。命名的辅助函数边界使该来源可追溯、可审查。归属代码下列出的格式化器模块拥有对原始 locale 敏感 `Intl` 的访问权。Lint 守护模块访问和 locale 参数的存在性；审查守护工具函数和测试 oracle 的更窄用途。审查和回归测试仍要验证调用方传入 Provider locale。允许列表条目不是每个使用方都符合的证明。Astryx 自有的 locale 敏感调用点不得读取 `navigator.language`，也不得隐式替换为宿主默认值或硬编码的 locale。INV9 为旧版纯辅助函数的外部调用方保留确定性的兼容默认值。日期辅助函数还独立于语言和编号强制执行 INV10。locale 标签检查、与 locale 无关的字素分段、时区标识符验证和机器字段转换是独立的工具职责。当操作结果不依赖显示 locale 时，它们可以检查标签或使用确定性的固定 locale。这些用途不授权第二条用于 locale 敏感显示格式化的路径，也不授权在日期、数字、列表或排序辅助函数中省略 Provider locale。独立的测试 oracle 可以使用平台 `Intl` 来验证生产辅助函数。格式化值周围的本地化词语仍按 INV1a 以目录为后盾；格式化器不是替代的翻译运行时。
- **INV9 — 纯辅助函数具有确定性的兼容默认值。** 早于 Provider 参数传递的公共纯格式化器可以为了兼容性保留可选 locale，但省略该值时确定性地解析为英文。Astryx 自有的调用点显式传入 Provider locale。新的纯辅助函数要求显式 locale，除非当前契约记录了另一个默认值。charts 的 `currency()` 辅助函数尚未符合：省略 locale 时遵循宿主默认值。这是已知的符合性缺口，而不是已记录的默认值；使其确定性化是独立的兼容性变更。
- **INV10 — 由应用选择日历；值保持公历。** `Calendar` 显示它从自己的 `calendar` prop 或 Provider 的 `calendar` prop 解析出的日历，否则显示公历（`spec:AST-111` FR2）。`DateInput`、`DateRangeInput` 和 `DateTimeInput` 也是如此。locale 改变语言、编号和字段顺序；locale 从不选择日历，既不通过其默认日历，也不通过 `-u-ca-` 关键字。`PlainDate` 的值、约束和机器格式在每种日历中都保持公历 ISO。运行时的 `Temporal` 拥有月份非公历的每种日历的算术；在缺失它的地方，解析此类日历的日期组件会显示公历日期（`spec:AST-111` FR5）。共享的内置日期格式化器固定为公历，除非 Astryx 调用点传入解析后的日历。底层 `plainDateFormat` 的显示日历覆盖仍是受支持的显式调用方选择。
- **INV11 — 渲染方向来自 DOM。** Provider 公开一个语义方向默认值，但 Astryx 的布局、镜像和交互应通过 CSS 逻辑属性、以方向为条件的 CSS 或惰性 DOM 读取，从渲染区域解析。`useDirection()` 是渲染时的最后手段，不得取代 DOM 成为组件几何布局或行为的常规来源，因为 Provider 的方向可能与 `<html dir>` 不一致，并造成首次绘制或水合错误。
- **INV12 — locale 与方向相关但不同。** Provider 从 locale 派生默认方向，并接受显式覆盖。它不修改 DOM 的 `dir`。应用拥有页面或区域的 `dir`，并且当它们希望 Astryx 布局和浏览器文本流共享同一方向时，必须使其与 Provider 保持一致。
- **INV13 — 客户端上下文是当前的翻译运行时。** 随包发布的 translator 和 locale hooks 是客户端上下文 API。`getLocaleDirection` 等纯辅助函数仍可安全用于服务端。服务端/RSC 翻译运行时是一个独立的 API 决策，而不是当前 hooks 隐含的能力。
- **INV14 — 外部运行时集成是增量的。** 应用可以在 Astryx 之外运行另一个 i18n Provider。未来的适配器可以把 Astryx 格式化委托给应用运行时，同时保留 Astryx 键查找、回退、字符串结果和已发布 Provider 的兼容性。Astryx 不会仅仅为了提供通用 i18n 框架而吸收应用目录。
- **INV15 — 运行时目录是派生的，绝不手写。** 每种随包发布的 locale 都有一个编写的富格式目录（`packages/core/locales/<tag>.json`，原样导出为 `@astryxdesign/core/locales/<tag>.json`）和一个生成的运行时字符串映射（`@astryxdesign/core/locales/<tag>.generated.js`），其公共形状是 `RuntimeCatalog`，即键到消息的记录。生成的源文件位于 `packages/core/src/i18n/generated-locales/`，被版本控制忽略，并在安装、构建、测试、Storybook、文档站点和沙箱运行之前重新生成；长时间运行的开发服务器在编写的目录发生变化时重新生成它们，而在初始生成期间发生的编辑会排队进行另一轮处理，而不是被遗漏。没有字符串 `defaultMessage` 的富格式条目会导致生成失败；运行时映射不携带 `description` 或其他元数据。内置的英文回退读取源自生成的英文模块的英文：每个命名目录键的 Core 模块注册恰好包含这些键的派生映射，而解析任何 Astryx 键的公共路径注册整个模块。富格式目录的路径、形状或导出都不会因为生成模块的存在而改变。
- **INV16 — 标准构建集成可解析两种目录形式。** Astryx Vite 插件在源码模式下将 `@astryxdesign/core/locales/<tag>.json` 解析为编写的富格式文件，将 `@astryxdesign/core/locales/<tag>.generated.js` 解析为生成的源模块，因此应用和仓库自己的应用在开发和生产中以相同方式导入任一形式。
- **INV17 — type-to-select 忽略标记。** 在 Core 中，当人们输入条目的首字母而移到该条目时，输入的字母和每个条目的标签都会在折叠后进行比较，并且在每种 locale 中方式相同。这覆盖公共的 `useTypeahead` 和 `useTreeFocus` hooks，以及每个具有 type-to-select 的集合，包括 Selector、MultiSelector、DropdownMenu、ContextMenu 和 TreeList。折叠忽略大小写；移除规范分解留下的组合标记（U+0300–U+036F），适用于任何文字系统；将六个带斜杠或横线的拉丁字母映射到其基本字母（đ→d、ł→l、ø→o、ħ→h、ŧ→t、ƀ→b），无论大小写；并将土耳其语的无点 ı 和带点 İ 映射到 i。因此 "d" 能匹配到 "Đào"，"a" 能匹配到 "Ánh" 和 "Ä"，"l" 能匹配到 "Łódź"，"i" 或 "ı" 能匹配到 "Isparta" 和 "İzmir"。当输入的字母包含变音符号、带斜杠的字母、ı 或 İ 时，与它们精确匹配的条目排在最前；对于这种优先匹配，大小写对按土耳其语方式处理，ı 与 I 配对，İ 与 i 配对，因此 "ı" 在 "İzmir, Isparta" 上会落到 Isparta，而 "İ" 在 "Isparta, İzmir" 上会落到 İzmir。INV17 不改变排序、搜索过滤或显示文本。一个共享折叠辅助函数服务于所有路径，因此它们的匹配方式完全相同。

## Change coupling

对 Provider、上下文、公共 i18n barrel、解析器、目录 schema、源目录、运行时目录生成器或其监视器、locale 包导出、构建插件 locale 别名、locale 感知辅助函数、目录验证或 i18n lint 规则的更改都必须审查本记录。只有当其回退、所有权、确定性默认值、运行时更新行为和输出类型仍然成立时，变更才保持该架构。

新的公共 Provider 或 hook、应用目录所有权、富格式消息输出、服务端翻译运行时、隐式宿主 locale 行为，或超出 `spec:AST-111` 的日历语义，都是新的人工 API 或所有权决策。它不能从实现 pull request 中推断。

## Owning code

- `packages/core/src/i18n/` — Provider、上下文、公共 hooks、locale 方向派生、目录类型，以及查找/格式化运行时。
- `packages/core/src/utils/plainDate.ts`、`packages/core/src/utils/dateParser.ts`、`packages/core/src/utils/calendarDateParser.ts`、`packages/core/src/Timestamp/formatInstant.ts`、`packages/core/src/Timestamp/formatRelativeTime.ts`、`packages/core/src/PowerSearch/formatFilterValue.ts`、`packages/core/src/NumberInput/numberParser.ts`、`packages/core/src/utils/timeFormat.ts`、`packages/core/src/i18n/useCollator.ts`、`packages/charts/src/formatters.ts` — 共享的 locale 敏感格式化器、解析器和排序。组件使用方传入 Provider locale；在此命名某个模块并不批准重复的格式化路径或调用方中不完整的传播。
- `packages/core/src/Timestamp/tooltipEntries.ts` — 时区标识符验证，与本地化日期渲染隔离。
- `packages/core/src/utils/plainDate.ts` 的 `getTimeZoneParts` — 用于时刻/日历日期操作的确定性公历机器字段转换。
- `packages/core/src/i18n/resolve.ts`、`getLocaleDirection.ts` — locale 标签检查和方向派生，而不是日期/数字显示格式化。
- `packages/core/src/utils/characters.ts`、`packages/core/src/hooks/useStreamingText.ts` — 与 locale 无关的字素分段；这并不允许在没有 Provider locale 辅助函数契约的情况下进行 locale 敏感的词语/句子分段。
- `packages/core/src/utils/typeaheadMatch.ts` — type-to-select 匹配使用的共享折叠（INV17）：它忽略标记，折叠带斜杠的字母以及无点或带点的 i，并且不改变排序、过滤或显示文本。
- `packages/core/locales/en.json` — 源键集合、默认英文消息和 translator 描述。
- `packages/core/locales/*.json` — 部分翻译目录、富格式形状、Crowdin 往返接口。
- `scripts/generate-i18n-runtime.mjs` — 派生运行时字符串映射和伪 locale，验证每个编写的目录都投射为无元数据的映射（`check:repo` 中的 `check:i18n-runtime`），并在开发期间监视编写的目录。
- `packages/core/src/i18n/generated-locales/*.generated.ts` — 派生的运行时目录，被版本控制忽略，发布为 `@astryxdesign/core/locales/*.generated.js`。
- `scripts/i18n-english-fallback.mjs`、`packages/core/src/i18n/englishFallback.ts`、`packages/core/src/i18n/fullEnglishFallback.ts` — 将每个 Core 模块的英文映射派生到 `packages/core/src/i18n/generated-english/`（被忽略、内部使用、不导出），检查每个命名目录键的模块都注册自己的映射，并列出注册整个目录的公共路径：公共 `useTranslator`、公共 `InternationalizationContext` 导出和 PowerSearch 运算符标签。没有其他 Core 模块导入公共 `useTranslator` 或公共上下文导出。
- `packages/core/package.json` 的 `exports` — 同时发布 `./locales/*.json` 和 `./locales/*.generated.js`。
- `packages/build/src/vite.ts` — 在源码模式下解析两种目录导入形式。
- `scripts/check-i18n-catalog.mjs` — 源/翻译键、语法、运行时契约和复数验证。
- `internal/eslint-plugin-astryx/no-hardcoded-i18n-string.js` — 拒绝 JSX 文本、字符串类型 props 和 `announce()` 参数中 Astryx 自有的面向用户字面量和拼装文本，使每个自有字符串都是目录键。
- `internal/eslint-plugin-astryx/i18n-key-format.js` — 强制 `@astryx.` 命名空间和 camelCase 目录键段。该规则目前缺少自己的专项测试文件；添加一个是验证缺口。
- `internal/eslint-plugin-astryx/no-raw-intl-locale.js` — 通过语法检查和显式 locale 参数检查，强制共享的 locale 敏感辅助函数边界。上面单独的实用工具和测试 oracle 范围不会拓宽该显示格式化边界。新的格式化器模块需要针对边界的专项测试；仅通过 lint 并不能证明 Provider locale 的来源。
- 组件契约 — 拥有哪些语义内容是 Astryx 编写的、哪些是调用方编写的，以及哪些内容 prop 特化组件。

## Deciding specs

无决定性的系统规格。Provider 本地行为契约属于 `component:InternationalizationProvider`；本记录拥有共享的目录、格式化器和 DOM 方向边界。

## Verification

该映射列出预期契约的证据，而不是证明每个现有使用方或每个边界情况都符合。辅助函数准入定义职责；审查和回归测试验证调用方行为。缺失证据或违规的调用方仍是符合性工作，不会放松 INV1a、INV8、INV9 或 INV10。

| 不变量             | 证据                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 失败信号                                                                                                                                                                                                                      |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| INV1、INV1a、INV7  | 硬编码字符串 lint、目录测试、使用非英文 Provider 的组件翻译测试                                                                                                                                                                                                                                                                                                                                                                                                              | Astryx 自有文本绕过目录，播报或计数由片段或手写复数拼装，或非字符串输出到达可见/AT 属性                                                                                                                                       |
| INV2、INV13、INV14 | 导出漂移检查、公共 i18n 测试、兼容性审查                                                                                                                                                                                                                                                                                                                                                                                                                                     | 在没有迁移的情况下引入并行/替代运行时，或客户端 hooks 声称具备服务端行为                                                                                                                                                      |
| INV3–INV5          | 解析器和 Provider 重新渲染测试                                                                                                                                                                                                                                                                                                                                                                                                                                               | 无 Provider 时的输出依赖宿主、locale 切换后仍是旧值、回退顺序改变，或将格式错误的 locale 行为描述为优雅处理                                                                                                                   |
| INV3a              | 工厂单元测试：一个扁平选项或 `labels` 键替换其消息，包括在 Provider 下；在 Provider 外，其缺失会播报或显示随包发布的英文；包装器测试：在非英文 Provider 下，其缺失会给出翻译。证据缺口：尚无工厂测试覆盖 `labels` 键，也没有覆盖 Provider 下的扁平选项，然而                                                                                                                                                                                                                 | 工厂播报或显示没有任何选项或 `labels` 键可替换的 Astryx 文本，将多个字符串分组在一个 `labels` 对象之外，接受 translator，忽略给定的字符串，或在缺失时给出目录消息以外的内容                                                   |
| INV6               | `check:i18n-catalog`、键格式 lint 和专项变异测试                                                                                                                                                                                                                                                                                                                                                                                                                             | 过期/格式错误的键、格式错误的 ICU，或源/翻译运行时契约漂移通过 CI                                                                                                                                                             |
| INV15              | 生成器测试、`check:i18n-runtime`、包导出漂移检查、Provider/解析器运行时目录测试；按模块的英文解析一致性测试（每个 Core 模块命名的每个键，在每种随包发布 locale 的回退路径中，其自己的映射与整个目录的对比）；导入成本检查（组件 bundle 只携带其命名的英文；公共路径保留整个目录）                                                                                                                                                                                            | 生成模块携带描述或被提交、格式错误的条目被投射而不是失败、富格式导出路径改变、`RuntimeCatalog` 输入被拒绝或泄漏非富格式上下文形状、模块命名的键与整个目录的解析不同、组件 bundle 携带整个目录，或公共路径不再解析随包发布的键 |
| INV16              | 构建插件单元测试和真实构建测试                                                                                                                                                                                                                                                                                                                                                                                                                                               | 富格式或生成的 locale 导入无法通过标准插件解析                                                                                                                                                                                |
| INV8、INV9         | raw-Intl-locale lint（模块允许列表加日期辅助函数 locale 参数检查）和 Provider locale 回归测试，包括一对服务端/客户端渲染                                                                                                                                                                                                                                                                                                                                                     | Astryx 输出遵循宿主 locale、原始 `Intl` 出现在命名格式化器模块之外、自有调用省略 locale 参数，或同一 Provider locale 下服务端和客户端输出不同                                                                                 |
| INV10              | PlainDate 和内置日期格式化器测试，包括具有非公历默认值的 locale；日历解析和日历系统测试（`calendarSystem.test.tsx`、`calendarSystem.test.ts`）                                                                                                                                                                                                                                                                                                                               | locale（无论是否带 `-u-ca-`）选择了非公历日历、值或约束离开公历 ISO、需要 `Temporal` 的日历在缺失它的地方失败，或显式底层显示覆盖丢失                                                                                         |
| INV11、INV12       | 方向辅助函数/Provider 测试以及渲染后的 RTL 审查                                                                                                                                                                                                                                                                                                                                                                                                                              | 组件布局读取 Provider 方向而不是区域、Provider 改动 DOM，或覆盖停止组合                                                                                                                                                       |
| INV17              | `typeaheadMatch.test.ts`、`useTypeahead` 和 `useTreeFocus` 测试，以及 Selector、MultiSelector、DropdownMenu 和 TreeList 中的 type-to-select 测试，各一个用例：组合标记（"a" 匹配 "Ánh"）；每个带斜杠字母（đ、ł、ø、ħ、ŧ、ƀ）；ı 和 İ（"i" 和 "ı" 匹配 "Isparta" 和 "İzmir"）；以及输入的变音符号、带斜杠字母、ı 或 İ 优先精确匹配（"đ" 在 "Dung" 之前匹配 "Đào"，"ı" 在 "İzmir" 之前匹配 "Isparta"，"İ" 在 "Isparta" 之前匹配 "İzmir"）；在 en、vi、pl、sv 和 tr Provider 下 | 任何 locale 中普通字母漏掉带标记或带斜杠的首字母、i 或 ı 漏掉 İ 或 I 标签、输入的变音符号、带斜杠字母、ı 或 İ 不优先精确匹配、ı 或 İ 对按非土耳其语方式配对、两条路径不一致，或折叠影响排序或显示文本                         |
