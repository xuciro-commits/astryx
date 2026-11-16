---
schema_version: 3
template_version: 7
kind: component
id: component:Timestamp
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-27
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/hooks/useClipboard.test.tsx,
    .github/visual-baseline/manifest.json,
    packages/core/src/Timestamp/Timestamp.test.tsx,
    packages/core/src/Timestamp/tooltipEntries.test.ts,
    packages/core/src/theme/themingTargets.test.ts,
    apps/storybook/stories/Timestamp.stories.tsx,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:component-theming-surface,
    architecture:internationalization,
    architecture:public-component-api,
    architecture:react-component-runtime,
    architecture:icon-resolution-and-component-slots,
  ]
contributing: []
system_specs: [spec:AST-009, spec:AST-013/FR12, spec:AST-085, spec:AST-111/FR18]
---

# Timestamp component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | 一个 `time` 元素，用十二种 `format` 之一呈现 `value`（Unix 秒、毫秒或 ISO 8601），并可选地提供实时更新、时区后缀和可复制的悬停卡片。                                                                                                                                                                                                                                                                                                  |
| 行为          | 相对输出以完整绝对日期作为其默认无障碍名称；相对输出，或配置了 `tooltipEntries` 时，附加一张可键盘到达的、由可复制行组成的悬停卡片。                                                                                                                                                                                                                                                                                                  |
| 最终用户影响  | 读者以其区域设置看到紧凑或精确的时间；屏幕阅读器用户听到完整日期和时区；键盘用户可以打开并复制精确时间。                                                                                                                                                                                                                                                                                                                              |
| 构建者影响    | 可选：在 `InternationalizationProvider` 上设置 `calendar`，以其他历法书写日期。可选：通过 `timestamp-copy` 图标槽映射悬停卡片的复制字形（FR10）。                                                                                                                                                                                                                                                                                     |
| 兼容性/就绪度 | 没有 prop 或默认值变更；FR10 新增可选启用的 `timestamp-copy` 主题槽，该槽为 current 状态并等待实现。没有 provider 历法时输出不变；在 provider 历法下，含日期的格式会切换历法，而需要 `Temporal` 的历法在缺失处回退到 Gregorian（`spec:AST-013` FR12 例外）。带 `-u-ca-` 关键字的 provider 区域设置保留 Gregorian 日期（`spec:AST-111` DEC-2）；设置 provider 的 `calendar` 以选择其一。在 Current-state impact 一节列出一处实现缺口。 |
| 审查检查      | 若调用方未命名而相对时间戳缺少完整绝对名称、若悬停卡片没有 Tab 停靠点、若某项改动使更多服务端标记依赖服务器时区，或若无法解析的值导致崩溃，则予以否决。                                                                                                                                                                                                                                                                               |
| 治理规则      | `architecture:internationalization/INV4,INV8,INV10`；`spec:AST-111/FR18`；`spec:AST-013` FR12；`architecture:react-component-runtime/INV1,INV3,INV5`；`architecture:public-component-api/INV5,INV6,INV8`；`architecture:icon-resolution-and-component-slots/INV2,INV4–INV8`。                                                                                                                                                         |

该表是审查投影；下文正文具有权威性。

## Intent

Timestamp 把单个时刻显示为带机器可读语义的人类可读文本。它负责选择并格式化显示、保持相对输出为最新、无障碍名称，以及揭示并复制精确时间的悬停卡片。

## Compatibility and migration

- 已发布的默认值保持：`yes`
- 兼容性类别：无公共 prop、默认值、DOM 或样式变更；含日期的文本遵循 provider 的历法，除非应用另选，该历法为 Gregorian。带 `-u-ca-` 关键字的 provider 区域设置保留 Gregorian 日期（`spec:AST-111` DEC-2）；设置 provider 的 `calendar` 以选择其一
- 受控/非受控行为：不适用；当前时钟是内部状态
- 附加主题表面（FR10）：主题可以通过 `componentIcons['timestamp-copy']` 映射复制字形；没有条目时，字形不变。
- 迁移决策：无

使用方迁移说明应放在使用方文档和发布说明中。

## Current-state impact

- **绝对格式依赖服务器时区（FR3）。** 除 `unix_seconds` 之外的绝对格式会在宿主时区中渲染，除非调用方传入 `timezoneID`；因此没有它时，同一时刻在 UTC 服务器上读作 “Mar 25”，在 Tokyo 服务器上读作 “Mar 26”，而位于其他时区的查看者会遇到水合文本不匹配。显式的 `timezoneID` 会在服务器和客户端上同样固定渲染。

## Ownership boundary

**拥有**

- `time` 元素、其 `datetime` 属性，以及承载 `timestamp` 目标的 Text 包装器。
- 值解析、格式选择、格式化、时区后缀和实时更新。
- 相对输出的无障碍名称。
- 悬停卡片的行、布局、复制按钮和复制播报。

**不拥有 / 非目标**

- 悬停卡片的打开、放置和关闭——由 HoverCard 拥有。
- 排版——委托给 `component:Text`。
- 区域设置与历法解析——由 `architecture:internationalization` 辅助函数拥有。
- 剪贴板写入及其 live region 播报机制——由共享剪贴板 hook 拥有。

## Public concepts

| 概念       | 封闭值或状态                                                                                                                                                     | 含义                                       | 按变体/方向/状态的可用性     | 默认值  | 拥有者                | 稳定性 | 无效值行为                                         |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ---------------------------- | ------- | --------------------- | ------ | -------------------------------------------------- |
| 值         | Unix 秒（低于 10¹²）、Unix 毫秒，或 ISO 8601 字符串                                                                                                              | 所显示的时刻。                             | 始终                         | 必需    | `component:Timestamp` | 稳定   | 无法解析的值不渲染任何内容，并在开发环境发出警告。 |
| 格式       | `relative`、`relative_short`、`auto`、`date`、`date_long`、`date_weekday`、`date_time`、`time`、`system_date`、`system_date_time`、`system_time`、`unix_seconds` | 时刻的书写方式。                           | 始终                         | `auto`  | `component:Timestamp` | 稳定   | TypeScript 拒绝其他值。                            |
| 悬停卡片行 | default（一行可复制的完整日期）；配置的 `tooltipEntries`                                                                                                         | 悬停卡片显示的内容；每一行可选择启用复制。 | 相对输出，或任何带条目的输出 | default | `component:Timestamp` | 稳定   | 空的条目列表视为无配置。                           |
| 实时       | 开；关                                                                                                                                                           | 相对输出是否刷新。                         | 相对输出                     | 关      | `component:Timestamp` | 稳定   | —                                                  |

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 依据                                                                      |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| FR1  | Timestamp 渲染一个 Text 元素（默认 `type="supporting"`、`color="secondary"`，并透传 `size` 与 `weight`），承载 `timestamp` 目标；该目标在 Text 的 type 和 color 反映之外，还反映解析后的格式。其内部的内联 `time` 元素继承排版，并承载该时刻的 ISO 8601 `datetime`。无法解析的值不渲染任何内容，并记录一条开发警告。                                                                                                                                                                                                                                                                                                                                                                                                                                               | 当前源码与测试                                                            |
| FR2  | 当时刻距现在 `autoThreshold` 秒以内（默认七天）时，`auto` 显示 `relative`，否则显示 `date_time`。`relative` 使用区域设置的长相对措辞，`relative_short` 使用其窄措辞；未来几秒的值读作“now”。绝对格式使用 provider 区域设置中的共享时刻格式化器。含日期的格式（`date`、`date_long`、`date_weekday`、`date_time`，以及 FR5 与 FR7 的完整日期）以 provider 解析出的历法书写日期（`spec:AST-111` FR2、FR5、FR18），除非应用另选，该历法为 Gregorian；区域设置的默认历法绝不适用，且 `date_time` 保留其一天中的时间。每一种都给出 `component:Calendar` 所显示的月份和日期。`time`、相对格式、`system_*` 和 `unix_seconds` 不依赖历法。`system_*` 格式是机器可读的 Gregorian ISO，`unix_seconds` 与时区无关。`isTimezoneShown` 仅向 `date_time` 和 `time` 追加时区缩写。 | 当前源码与测试                                                            |
| FR3  | 服务端标记不依赖服务器的时区，且水合时不会产生不匹配。在客户端能读取时钟之前，需要时钟的格式以 UTC 和 Gregorian 历法渲染 `date_time`，并显示时区；客户端随后显示解析后的格式，且不提交 UTC 占位内容。需要 `Temporal` 的历法仅在服务器与浏览器以相同方式解析它时才能无水合不匹配（`spec:AST-013` FR12 例外）。实现缺口：除 `unix_seconds` 之外的绝对格式在宿主时区中渲染，除非调用方传入 `timezoneID`；因此没有它时，其服务端标记依赖服务器时区，在其他时区水合会产生文本不匹配（见 Current-state impact）。                                                                                                                                                                                                                                                        | 当前源码与测试                                                            |
| FR4  | 在 `isLive` 与相对输出下，时钟在一分钟以内每秒刷新、一小时以内每 30 秒刷新、一天以内每分钟刷新、超过一天每五分钟刷新；在卸载时或输入变化时清除定时器。区域设置变更会实时更新输出。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 当前源码与测试                                                            |
| FR5  | 除非调用方命名该元素，相对输出以完整绝对日期和长时区名称命名；绝对输出不添加名称。调用方显式的 `aria-label` 会到达该元素（`architecture:public-component-api` INV5）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 当前源码与测试                                                            |
| FR6  | 当 `hasTooltip` 为 true 且输出为相对格式或 `tooltipEntries` 非空时，一张名为 “Timestamp details” 的惰性加载 HoverCard 附加到时间戳上方，在悬停和键盘聚焦时打开；`time` 元素获得 `tabIndex={0}`。否则不渲染卡片，也不添加 Tab 停靠点。卡片附加时，放在时间戳上的焦点保持在那里（`spec:AST-085` FR4）。                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 当前源码与测试                                                            |
| FR7  | 卡片是网格中的描述列表：可选的标签列（当任一行有标签时存在）、值列，以及末尾的操作列（当任一行可复制时存在）。没有条目时，它有一行可复制行，包含查看者时区中的完整绝对时间。每个配置的条目按给定顺序成为一行，在其自身的时区和格式中渲染，除非 `isCopyable` 否则为只读。某条目没有自己的 `timezoneID` 时，若设置了 Timestamp 的 `timezoneID` 则以其渲染，否则用查看者的时区。未知时区不会崩溃。描述列表只容纳名称-值组（WCAG 2.2 1.3.1）。每一行是一个名称-值组；没有标签的行以其时区的长名称命名，该名称在视觉上隐藏。复制按钮位于其行的值内。                                                                                                                                                                                                                    | 当前源码与测试                                                            |
| FR8  | 复制按钮是 `timestamp-copy-button` 目标上的小型幽灵 IconButton，名为 “Copy {value}”，并带有 “Copy” 工具提示；激活它会把该行的值写入剪贴板，在 1.5 秒内切换到已复制字形（`check`，除非主题映射了 `timestamp-copy`，FR10）以及 “Copied” 名称和工具提示，并以礼貌方式播报 “Copied”。写入失败时在相同的 1.5 秒内显示 `close` 字形（无主题映射）以及名称和工具提示 “Failed to copy value to clipboard.”，并播报该文本一次；错误本身不显示（拥有者决策，2026 年 11 月 6 日（Cindy））。                                                                                                                                                                                                                                                                                  | 当前源码与测试                                                            |
| FR9  | `ref`、`data-testid` 以及其他受支持的 DOM、ARIA、data 和事件 prop 会到达 `time` 元素；`xstyle`、`className` 和 `style` 到达 Text 包装器。调用方的 `aria-labelledby` 取代 FR5 的名称来命名该元素。调用方显式的 `tabIndex` 会到达该元素（`architecture:public-component-api` INV5）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 当前源码与测试                                                            |
| FR10 | 复制按钮的字形通过 `timestamp-copy` 组件图标槽解析，传入 `{copied}`，在已复制状态（FR8）显示期间为 true。没有主题条目时，字形为 `copy`，已复制时为 `check`，复制失败显示期间为 `close`；失败期间 `copied` 为 false，因此主题映射的槽在此时保持其静止字形。当该槽解析为无图标时（主题值为 `null`、槽函数返回 `null`，或请求带 `icon: null`），只隐藏字形：按钮保持其尺寸、名称、工具提示和复制行为，并在静止、已复制和复制失败显示时都不显示字形。请求的 `size` 只改变字形，绝不改变按钮。                                                                                                                                                                                                                                                                          | 提议中；`architecture:icon-resolution-and-component-slots/INV2,INV4–INV8` |

### Allowed variation

- **AV1 — 区域措辞。** 短语、月份名和时区名遵循 provider 的区域设置。
- **AV2 — 主题涂装。** 主题可以按格式、type 和 color 重设 `timestamp` 以及 `timestamp-copy-button` 的样式，而不改变输出文本。

### Representative states

| 状态                 | 必需的不变式                                                                                                        | 允许的变化       |
| -------------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------- |
| 相对，近期           | 相对措辞；完整日期名称；Tab 停靠点；带一行可复制行的悬停卡片。                                                      | 区域设置。       |
| 自动，较旧           | `date_time`；无名称；除非配置了条目，否则无卡片。                                                                   | 阈值。           |
| 带条目的绝对格式     | 卡片附带配置的行；Tab 停靠点；不添加名称。                                                                          | 条目。           |
| 服务端渲染           | 标记在各服务器时区之间一致；依赖时钟的格式显示带时区的 UTC `date_time`（绝对格式目前使用服务器时区，即 FR3 缺口）。 | —                |
| 实时                 | 相对措辞按各层级的间隔刷新。                                                                                        | —                |
| 无法解析             | 不渲染任何内容；开发警告。                                                                                          | —                |
| provider 历法        | 该历法下的含日期输出、卡片的完整日期和相对名称；`date_time` 保留其时间；`system_*` 保持 Gregorian ISO。             | 历法、区域设置。 |
| `hasTooltip={false}` | 即使有条目，也无卡片且无 Tab 停靠点。                                                                               | —                |

### Transformation and precedence order

- **ORD1 — 显示格式。** 时钟待定 → UTC `date_time`；否则 `auto` → 按阈值决定相对或 `date_time`；否则用 `format`。
- **ORD2 — 卡片行。** 非空的 `tooltipEntries` 取代默认的完整日期行。
- **ORD3 — time 元素属性。** 先设置 `datetime` 和 `data-testid`，再应用调用方 prop；相对名称和卡片的 Tab 停靠点仅在调用方未设置 `aria-label` 或 `tabIndex` 时适用。

### Performance and resources

- **PR1 — 有界工作。** 只有带 `isLive` 的相对输出会运行定时器，每个实例至多一个，在变化或卸载时清除；悬停卡片模块仅在卡片附加时加载；复制状态仅为可复制的行存在。

## Accessibility contract

- **AR1 — 机器可读的时刻。** `time` 元素在 `datetime` 中承载 ISO 8601 时刻。
- **AR2 — 相对输出的完整名称。** 相对输出以完整绝对日期和拼写出的时区命名（WCAG 2.2 3.1.4）。
- **AR3 — 可键盘到达的卡片。** 卡片附加时，时间戳是一个 Tab 停靠点，卡片在聚焦时打开。没有卡片时没有 Tab 停靠点。可聚焦的 `time` 是卡片的锚点，并在卡片加载和附加期间保持焦点。卡片打开时，`time` 通过 `aria-controls` 命名它；它不携带 `aria-haspopup` 或 `aria-expanded`，因为 `time` 角色不支持它们。`time` 上的悬停和聚焦会打开卡片；其周围的空白布局区域不会。
- **AR4 — 复制反馈。** 复制按钮以其值命名，复制以礼貌方式播报。

## Design relationships

| 解剖结构或状态 | 设计要求                                   | 表现权威       | 层级角色 | 组件契约       |
| -------------- | ------------------------------------------ | -------------- | -------- | -------------- |
| 格式化文本     | 紧凑或精确形式的时刻，默认使用支持性排版。 | 当前源码与文档 | 显著     | FR1–FR5        |
| 悬停卡片       | 一张可复制的卡片，含精确时间或配置的行。   | 当前源码与文档 | 支持性   | FR6、FR7、AR3  |
| 悬停卡片行     | 时刻的一种渲染旁边的可选标签。             | 当前源码与文档 | 支持性   | FR7            |
| 复制按钮       | 复制某一行的值并给出简短确认。             | 当前源码与文档 | 支持性   | FR8、FR10、AR4 |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Formatted text": {"target": "timestamp"},
  "Hover card": {
    "delegatesTo": {"owner": "component:HoverCard", "target": "hover-card"}
  },
  "Hover card row": {
    "none": {
      "reason": "reachability-gap: rows render inside the hover card content without a component-owned class"
    }
  },
  "Copy button": {"target": "timestamp-copy-button"}
}
```

## Family and system relationships

- `architecture:internationalization` 拥有区域设置解析、实时区域设置变更、共享格式化器，以及带 Gregorian 默认值的历法解析；`spec:AST-111` FR18 规定哪些格式遵循历法。FR2 与 FR4 依赖它们。
- `architecture:react-component-runtime` 拥有有效的初始渲染和定时器清理；FR3 与 FR4 应用它们。
- HoverCard 拥有卡片表面；Timestamp 提供其内容、名称和触发器的可聚焦性。

### `spec:AST-013` FR12 exception — calendars that need `Temporal`

- **能力：** 在 Gregorian、Buddhist、Minguo 和 Japanese 之外的历法中的含日期输出，这些历法需要运行时的 `Temporal`。
- **缩减：** 当 `Temporal` 缺失或不支持该历法时，例如在 macOS 和 iOS 上的 Safari 中，此类历法会在首次渲染前解析为 `gregory`，并在开发环境中于服务器和浏览器各警告一次，指出 `temporal-polyfill/full/global`（`spec:AST-111` FR5）。含日期的格式、卡片的完整日期和相对名称随后书写 Gregorian 日期。加载 `Temporal` polyfill 的应用获得完整历法。没有 `Temporal` 的服务器渲染 Gregorian 文本，而带 `Temporal` 的浏览器与之不匹配，因此服务端渲染的应用也要在服务器上加载 `Temporal`。
- **保留的义务：** `spec:AST-013` FR7 和 FR8，以及 FR9——只要服务器与浏览器以相同方式解析历法，且不属于 `spec:AST-111` FR19 中中文和 Dangi 历法的情况。Gregorian 输出保留时刻、其无障碍名称、悬停卡片和复制；没有任何东西抛出。
- **证据：** `Timestamp.test.tsx` 中带 `Temporal` polyfill 以及移除 `Temporal` 的历法系统测试，还有 “hydrates a clock format rendered on a server without Temporal”。证据缺口：没有真实浏览器运行，也没有在需要 `Temporal` 的历法下对绝对日期格式的水合测试。
- **拥有者：** `nynexman4464`。
- **审查条件：** Safari 发布 `Temporal`。

## Verification map

| 契约             | 验证                                                                                                                                                                                                                                            | 代表性状态                                                                                                                                                                           | 变更或失败预期                                                                                                                                                                                                                                                                                                                                    | 审计小节                   |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| FR1、FR2         | `Timestamp.test.tsx` 的格式、auto、区域设置、历法系统和无效值测试；`tooltipEntries.test.ts` 的历法测试；稳定视觉基线 `core-timestamp--default`                                                                                                  | 每种格式；阈值；区域设置；在英语和母语区域设置下、带与不带 `Temporal` 的 `persian`、`hebrew` 和 `buddhist`；`iso8601`；`Intl` 与 `Temporal` 不一致时的 `chinese`；无法解析的值；默认 | 错误的措辞、跨越层级、没有 provider 历法却出现非 Gregorian 年份、含日期的格式忽略 provider 历法或给出与 `component:Calendar` 不同的日期、`system_*` 或 `time` 输出改变、缺少 `time` 元素或 `datetime`、崩溃，或无法解析的值缺少开发警告，均判为失败；默认 type 或 color 改变会作为变更返回审查。缺口：没有测试断言 `timestamp` 目标或其格式反映。 | `audit:Timestamp/behavior` |
| FR3              | `Timestamp.test.tsx` 的服务器渲染套件和 “hydrates a clock format rendered on a server without Temporal”                                                                                                                                         | 服务器时区；水合                                                                                                                                                                     | 依赖时区的标记、水合不匹配，或提交的占位内容判为失败。缺口：没有测试覆盖在其他时区的服务器上渲染的绝对格式。                                                                                                                                                                                                                                      | `audit:Timestamp/behavior` |
| FR4、PR1         | `Timestamp.test.tsx` 的实时更新和区域设置测试                                                                                                                                                                                                   | 实时相对输出；区域设置变更                                                                                                                                                           | 缺少刷新或区域设置过时判为失败。缺口：各层级的刷新间隔以及卸载或输入变化时的定时器清理没有自动化检查。                                                                                                                                                                                                                                            | `audit:Timestamp/behavior` |
| FR5、AR2         | `Timestamp.test.tsx` 的命名测试                                                                                                                                                                                                                 | 相对、绝对、时区拼写                                                                                                                                                                 | 缺少名称、使用短时区名称，或在绝对输出上添加名称，判为失败。在相对输出上被替换的调用方 `aria-label` 判为失败。                                                                                                                                                                                                                                    | `audit:Timestamp/a11y`     |
| FR6、AR3         | `Timestamp.test.tsx` 的键盘可达性套件；`Timestamp.a11y.browser.spec.ts`（Chromium 和 WebKit）：在惰性附加过程中焦点保持在 `time` 上，`aria-controls` 命名打开的卡片，且 axe 通过                                                                | 相对、绝对、禁用、移除条目                                                                                                                                                           | 缺少 Tab 停靠点、触发器上出现 `aria-expanded`，或出现多余的 Tab 停靠点，判为失败。                                                                                                                                                                                                                                                                | `audit:Timestamp/a11y`     |
| FR7、FR8、AR4    | `Timestamp.test.tsx` 的悬停卡片套件，包括 “keeps a copyable labelled card a valid description list” 和默认卡片的隐藏时区名称，以及 “names and announces a failed copy, then returns to rest”；`tooltipEntries.test.ts`；`useClipboard.test.tsx` | 默认行、条目、可复制行、未知时区、失败的复制                                                                                                                                         | 错误的行数或顺序、未配对的标签、只读行上的复制按钮、错误的复制值、缺少已复制状态，或缺少播报，均判为失败；复制失败却保留静止名称或工具提示，或未以断言方式播报，同样判为失败。缺口：没有检查在打开的卡片上运行 `definition-list` 结构规则；网格列和 1.5 秒重置没有自动化检查。                                                                    | `audit:Timestamp/behavior` |
| FR9              | `Timestamp.test.tsx` 的 `ref`、test-id 和透传测试                                                                                                                                                                                               | `ref`、test id、调用方 prop                                                                                                                                                          | `time` 元素上缺少 `ref`、test id 或调用方 prop 判为失败。卡片附加时调用方 `tabIndex` 被替换判为失败。缺口：没有测试断言 `xstyle`、`className` 和 `style` 到达 Text 包装器，也没有覆盖调用方 `aria-labelledby`。                                                                                                                                   | `audit:Timestamp/behavior` |
| FR10             | `Timestamp.test.tsx` 的复制图标槽套件；槽清单测试                                                                                                                                                                                               | 无条目（包括复制失败的 `close`）、在两种状态下以及跟随成功之后的失败期间的槽函数、`null`、尺寸请求                                                                                   | 字形忽略槽或其状态、复制失败时在无条目下绘制 `close` 之外的任何内容或向槽传入 `copied: true`、`null` 移除按钮、其名称或其复制动作、尺寸请求改变按钮尺寸，或使用方文档未列出该槽。                                                                                                                                                                 | `audit:Timestamp/theming`  |
| 主题解剖结构映射 | `scripts/check-knowledge.mjs`                                                                                                                                                                                                                   | 使用方解剖结构、目标、HoverCard 委托                                                                                                                                                 | 缺失、多余或过时的映射会使仓库验证失败。                                                                                                                                                                                                                                                                                                          | `audit:Timestamp/theming`  |
| AR1              | `Timestamp.test.tsx` 的 `datetime` 测试                                                                                                                                                                                                         | `date_time`；`date`                                                                                                                                                                  | `date_time` 上缺少或错误的 ISO `datetime`，或 `date` 上缺少它，判为失败。缺口：没有测试断言相对格式或其他绝对格式上的确切 `datetime`。                                                                                                                                                                                                            | `audit:Timestamp/a11y`     |
| AR2、AR4         | 无障碍树证据（`spec:AST-009` FR3）                                                                                                                                                                                                              | 相对输出；复制按钮                                                                                                                                                                   | 缺口：没有无障碍树检查证明相对输出的计算名称或复制按钮名称；单元测试查询 DOM。                                                                                                                                                                                                                                                                    | `audit:Timestamp/a11y`     |

## Decision log

无记录。该记录描述已交付的行为。

## Open questions

无。

## Content boundary

本文件不会重复使用方 prop 表格/示例、当前审计结果、实现步骤或家族/系统规则，而是链接到这些内容的归属方。
