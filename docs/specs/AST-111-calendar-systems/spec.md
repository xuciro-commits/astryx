---
schema_version: 4
template_version: 2
kind: system-spec
id: spec:AST-111
authority: current
archive_reason: null
superseded_by: null
approved_by: nynexman4464
approved_at: 2026-11-04
phase: accepted
owners: [nynexman4464]
affects_architecture:
  [architecture:internationalization, architecture:public-component-api]
affects_families: [family:input-fields]
affects_contributing: []
affects_consumer_docs:
  [
    internationalization,
    Calendar,
    DateInput,
    DateRangeInput,
    DateTimeInput,
    Timestamp,
  ]
---

# Calendar systems system spec

<!-- path-applicability:v1 -->

```json
{
  "paths": [
    "packages/core/src/i18n/**",
    "packages/core/src/utils/plainDate.ts",
    "packages/core/src/utils/dateParser.ts",
    "packages/core/src/Calendar/**",
    "packages/core/src/DateInput/**",
    "packages/core/src/DateRangeInput/**",
    "packages/core/src/DateTimeInput/**",
    "packages/core/src/Timestamp/**",
    "packages/core/src/PowerSearch/formatFilterValue.ts",
    "packages/charts/src/formatters.ts",
    "packages/lab/src/Chart/formatters.ts",
    "packages/lab/src/Schedule/**"
  ]
}
```

<!-- Describe the system, not the project: present tense, what it does. No proposals, history, pull requests, or research in the record; see docs/contributing/spec-writing.md and report its rubric results in the pull request. -->

## Intent

使用非公历日历的人在该日历中查看、键入和浏览日期。波斯用户选择 1405 年 Aban 月 8 日，希伯来用户在闰年看到 Adar I 和 Adar II，泰国用户看到佛历年。由应用选择日历。存储的值不变：每个日期组件读写的都是公历 ISO 日期，因此应用数据、表单和服务器代码保持日历中立。

## Non-goals

- 从没有指明日历的区域设置标签推断日历。仅写 `fa-IR` 时仍为公历。
- 自带日历的值，例如 `2024-02-10[u-ca=hebrew]`。
- 公开的日历适配器或插件 API。
- 由 Astryx 拥有的日历运算。日历运算归 Temporal 所有。
- FR1 之外的日历标识符，包括观测式伊斯兰历（Hijri）日历。
- 明治（1868 年）之前的日本年号。
- 对 1900 年之前日期的保证行为。这类日期按 `Temporal` 计算的结果尽力显示和浏览；键入输入、回读和年号显示仅针对 1900 年至 2100 年做规格说明和测试。更好的支持，尤其是键入输入，要等到有证据表明应用需要它。
- 作为键入输入的传统数字：希伯来字母数字、中国历法的日期数字，以及干支纪年名称。
- `DateRangeInput` 中的键入范围输入。
- ISO 8601 以外的周编号。
- 满足本契约的等价内部实现仍然有效。
- 内部模块、文件、函数名、算法、数据结构、存储布局、清单、日志、锁、事务协议，以及 CI 作业/工作流拓扑属于架构或实现，除非调用方或互操作的系统有意将该确切机制作为公开协议来依赖。在这种情况下，要说明谁依赖它，以及为什么等价实现无法满足契约。

## Public contract

```tsx
<InternationalizationProvider locale="fa-IR" calendar="persian">
  {/* value and onChange stay Gregorian ISO, for example '2026-10-30' */}
  <DateInput label="Start date" value={date} onChange={setDate} />
  {/* one component can use a different calendar */}
  <Calendar calendar="gregory" value={day} onChange={setDay} />
</InternationalizationProvider>;

{
  /* a -u-ca- keyword in the locale does not select the calendar */
}
<InternationalizationProvider locale="th-TH-u-ca-buddhist" calendar="buddhist">
  …
</InternationalizationProvider>;
```

```ts
// Calendars other than the Gregorian, Buddhist, Minguo, and Japanese calendars
// need Temporal. Where the runtime lacks it, the application loads a
// polyfill on the server and in the browser.
import 'temporal-polyfill/full/global';
```

`calendar` 接受一个 `CalendarSystem`，它从 `@astryxdesign/core/i18n` 导出。`InternationalizationProvider`、`Calendar`、`DateInput`、`DateRangeInput` 和 `DateTimeInput` 都接受它。`@astryxdesign/core/utils` 中的 `formatSharedDate`，以及 `@astryxdesign/charts` 和 Lab `Chart` 中的 `shortDate` 与 `monthYear`，接受一个可选的 `calendar` 参数，其默认值为 `gregory`（FR18）。`@astryxdesign/core/Calendar` 中公开的 `useCalendarDays` 和 `useCalendarNavigation` hook 接受一个可选的 `calendar`，其默认值为 `gregory`，并且绝不读取 Provider 的日历（FR20）。

## Requirements

### Calendar selection and values

- **FR1 — 支持的日历。** `CalendarSystem` 为 `gregory`、`iso8601`、`buddhist`、`roc`、`japanese`、`persian`、`indian`、`hebrew`、`chinese`、`dangi`、`coptic`、`ethiopic`、`ethioaa`、`islamic-civil`、`islamic-tbla` 或 `islamic-umalqura`：即 ECMA-402 和 Temporal 要求的日历。任何其他标识符都解析为 `gregory`，并在开发环境中警告一次。每个日历都以其 CLDR 名称命名（DEC-8）。
- **FR2 — 由应用选择日历。** 日期组件按以下顺序取值：组件自身的 `calendar` prop；其 `InternationalizationProvider` 的 `calendar` prop；否则为 `gregory`。区域设置绝不选择日历：它的默认日历不生效，其中的 `-u-ca-` 关键字也不生效。日历与语言、数字体系和方向相互独立：`locale="en" calendar="persian"` 用英文显示波斯日期，而不带日历的 `locale="fa-IR"` 用波斯文显示公历日期。
- **FR3 — 值保持公历 ISO。** 日历绝不改变组件读取或报告的内容。`value`、`defaultValue`、`onChange`、`min`、`max`、`focusDate`、`onFocusDateChange`、`dateConstraints` 收到的 `Date`、表单提交，以及每个 `system_*` 格式，在每个日历中都保持公历 ISO。
- **FR4 — 结构来自日历。** 月份长度、一年的月数、闰月和年号都来自日历。组件中的任何网格、滚轮、列表或步进，以及接受日历的 hook（FR20），都不假定为 12 个月或公历的月份长度。闰月是带自己名称的独立月份：希伯来闰年中的 Adar I 和 Adar II，或中国历法年与 Dangi 历法年的闰月。
- **FR5 — 部分日历需要 Temporal。** 公历、佛历、民国历和日本历在任何环境都可用。其他日历使用运行时的 `Temporal`，可以是原生的，也可以是应用加载的 polyfill；Astryx 不打包任何 polyfill。缺少它时，解析出这类日历的组件会显示并接受公历日期，并在开发环境中警告一次，且指出所需的 polyfill。当服务器与浏览器以相同方式解析日历时，两者的标记一致，因此在服务器端渲染的应用也在服务器上加载 `Temporal`。FR19 指出唯一的例外。

### Calendar

- **FR6 — 网格显示日历月份。** 月份标题、网格的无障碍名称、日期按钮名称和播报都使用日历。每个网格布置一个日历月：其第一天位于对应的星期列，外部日期填充其余单元格。默认的固定六行网格适用于每个月，包括科普特历和埃塞俄比亚历中只有五天或六天的第十三个月；`hasVariableRowCount` 只给每个月它需要的行数。在每个日历中，日期数字都使用区域设置的数字，标题也是如此。
- **FR7 — 导航按日历月和日历年前进。** Previous 和 Next 移动一个日历月。PageUp 和 PageDown 将聚焦的日期移动一个日历月，保持其月内日号，并钳制到目标月份的长度。Shift+PageUp 和 Shift+PageDown 将聚焦的日期移动一个日历年，到该年的同一个月；目标年份没有的闰月变为其平月对应项（Adar I 变为 Adar），目标月份缺少的日号钳制到其最后一天。在每个日历中，`min` 和 `max` 都按日限制导航。
- **FR8 — 周编号为 ISO 8601。** `hasWeekNumbers` 在每个日历中都显示 ISO 8601 周编号，其文档也如此说明。

### Typed entry

这些要求适用于 `DateInput` 和 `DateTimeInput` 的文本字段。

- **FR9 — 字段读取以日历书写的日期。** 字段接受按 `Intl.DateTimeFormat` 为该区域设置和日历书写的方式写出的日期。全数字输入遵循区域设置的数值字段顺序；存在月份名时，三位及以上的数字无论在哪个位置都是年份。字段接受任意 Unicode 十进制数字（可混合文字系统），以及区域设置和英文产生的各种宽度的月份名与年号名，忽略大小写和拉丁变音符号。键入的月份数字的含义与该区域设置在该日历中的数值月份一致：对希伯来历，是月份在键入年份中的位置；对中国历法和 Dangi 历法，是带区域设置闰月标记的月份数字。为希伯来闰年键入的普通 Adar 就是 Adar II。在公历中，不匹配上述任何形式、或指称了该区域设置数值顺序并不存在的日期的文本，只要 `parseDateInput` 能读取，仍会在按下 Enter 或失焦时提交：`en-US` 中的 `13/5/2026` 提交为 2026 年 5 月 13 日。否则适用 FR11。即使 `parseDateInput` 能读取，一位数的年份也不是日期。
- **FR10 — 年份是日历的年份。** 键入的年份是当前日历的年份，绝不转换为公历年：佛历字段中的 `2026` 是佛历 2026 年。当区域设置的格式包含年号时，格式提示和已提交文本会显示年号，例如 `พ.ศ.`（B.E.，佛历纪元）或 `民國`（Minguo，民国历的年号），并在仅凭年份会产生歧义时补上年号，遵循 ICU4X 的年份歧义模型：日历纪元之前的年份总是显示其年号；在日本历和民国历中，年号在 1900 年至 2100 年之间发生变更，省略年号的格式会补上年号，当这样能保持区域设置的字段顺序时用窄式写法；若任何宽度的年号都会重排字段，则只有最新年号之前的日期才补上年号，因为不带年号的年份按最新年号解读。没有键入年号时，一位或两位数的日本年份属于当前年号，四位数的日本年份按公历解读，最多三位数的民国年份属于 民國（Minguo）年号，埃塞俄比亚年份属于 AM 年号。两位数年份解析为日历当前年份之前 80 年与之后 19 年范围内的年份。超出其年号范围的日本年号年份会被拒绝。不适用默认年份范围；`min` 和 `max` 能捕获在错误的日历中键入的年份。
- **FR11 — 日历中不存在的日期会被拒绝。** 字段会拒绝并播报日历中不存在的日期，例如波斯平年的 Esfand 月 30 日、希伯来平年的 Adar I，或埃塞俄比亚历平年第十三个月的第 6 天。它绝不调整该日期。超出 `min`、`max` 或 `dateConstraints` 的键入日期会显示并播报一个越界错误，该错误以日历书写边界。
- **FR12 — 每个完整日期只触发一次 `onChange`。** 在用户键入时，只有当每个字段都存在、年份完整或是带年号的年号年份、末尾没有分隔符，且最后一个字段无法再接受数字时，`onChange` 才会触发。两位数年份和不带年份的输入在按下 Enter 或失焦时提交。对每个不同的值，`onChange` 最多触发一次。此规则同样适用于公历。
- **FR13 — 已提交文本回读为同一日期。** `date`、`date_long` 和 `date_weekday` 以日历渲染。`system_date` 保持公历 ISO，字段也接受它的 ISO 输入。对每个日历、区域设置和具名格式，字段都能把已提交文本回读为同一日期，涵盖 1900 年至 2100 年的每一天。中国历法和 Dangi 历法的已提交文本包含相关的公历年，且其月份和日期在同一环境下与字段自身的运算一致。
- **FR14 — 自定义显示文本仅用于显示。** 来自自定义 `format` 函数、字段无法回读的文本，在编辑后无法被重新提交。

### Presentations

- **FR15 — 公历以外的日历使用 Astryx 选择器。** `<input type="date">` 按规范是公历的，其选择器显示的日历来自设备而不是应用。当日历不是 `gregory` 或 `iso8601` 时，每个会显示原生控件的呈现方式都改用 Astryx 界面：精细指针上使用 popover，粗略指针上使用底部面板。这涵盖 `adaptive-native`、默认值、已弃用的 `nativePicker` 取值，以及会额外在开发环境中警告的显式 `presentation="native"`。
- **FR16 — 底部面板遵循日历。** 其可滚动的月历按 FR6 对 `Calendar` 的要求显示日历月份、标签和数字，并保持固定的单一面板高度。其月份滚轮列出所选日历年的月份，闰月按名称列出。年份变化时，若新一年有该月则保留该月，否则变为其平月对应项。在有年号的日历中，年份标签包含年号，例如 `令和8`（Reiwa 8）。被年号更替切分的年份取所选日期的年号，与 iOS 原生选择器一致：选中一月时 2019 读作 `平成31`（Heisei 31），选中七月时读作 `令和元`（Reiwa 1，该年号的第一年）。
- **FR17 — `DateRangeInput` 以日历显示范围。** 其触发文本和日历都使用该日历。它没有键入输入。

### Shared formatters

- **FR18 — 内置日期格式遵循 Provider 的日历。** Timestamp 中带日期的格式、PowerSearch 的日期值，以及 Schedule 的日期标签，都以各自 `InternationalizationProvider` 的日历渲染（FR2，无需组件 prop）。仅时间的格式、相对格式和 `system_*` 格式不变。纯日期辅助函数保持公历默认值并接受显式日历：`plainDateFormat` 通过其现有的 `calendar` 格式选项，`formatSharedDate`、`shortDate` 和 `monthYear` 通过可选的 `calendar` 参数。Astryx 的调用点会传入解析出的日历。
- **FR20 — 公开的日历 hook 接受显式日历。** `useCalendarDays` 和 `useCalendarNavigation` 接受一个可选的 `calendar`，其默认值为 `gregory`；它们绝不读取 Provider 的日历，因此当应用增加 Provider 日历时，调用方的数字仍保持原有含义。星期名称和 `monthYearLabel` 仍使用 Provider 的区域设置。给定日历时，`useCalendarDays` 把 `year` 和 `month` 读作日历的年份与该月在该年中的位置，与 `Temporal.PlainDate` 的编号方式一致（希伯来闰年中为 1 到 13），每天保持其公历日期，而 `dayNumber` 是其在日历月中的日号。`useCalendarNavigation` 按日历月步进，以日历书写 `monthYearLabel`，并以日历的数字报告可见月份，从而可传给 `useCalendarDays`。没有 `calendar` 时，两者的行为与已发布版本一致。

### Lunisolar calendars

- **FR19 — 阴阳合历日期遵循运行时。** 中国历法和 Dangi 历法的月份起点来自运行时的 `Temporal`。原生 `Temporal` 在 1900 年至 2100 年之间与官方天文台数据一致。读取平台 `Intl` 数据的 polyfill 在该范围内可能让九个中国历法月和四个 Dangi 历法月的起点相差一天，其中包括 2027 年中国历法年的第一个月。当服务器和浏览器使用的实现对某个月份起点判断不一致时，浏览器对该月的渲染与服务器标记不同，React 会在水合期间在客户端重新渲染该部分。国际化指南和日期组件文档会说明这一点。它们建议仅在缺少 `Temporal` 时加载 polyfill，并且当服务器端渲染的应用需要在中国历法或 Dangi 历法中获得相同标记时，在服务器和浏览器中加载相同的实现。

### Accessibility contract

- **AR1 — 播报的日期与可见日历一致。** 日期按钮名称、网格名称、选择与导航播报、错误消息，以及错误消息中的边界，都使用该日历。
- **AR2 — 字段描述其格式。** 当日历不是 `gregory` 或 `iso8601` 时，空的聚焦字段若没有调用方提供的 `placeholder`，会以日历的数值模式显示一个示例日期：字段接受今天时显示今天，否则显示它在 `min`、`max` 和 `dateConstraints` 内接受的最接近日期。调用方的 `placeholder` 始终优先。字段的描述仅在该日历与其 Provider 的日历不同时，才按区域设置的 CLDR 显示名称（DEC-8）指明其日历，因此单一日历的页面不会重复它，而混用日历的页面会说明哪个字段使用哪个日历。
- **AR3 — 每种拒绝都有自己的消息。** 无法读取的文本、日历中不存在的日期，以及越界日期，各自播报不同的消息。日历中不存在的日期所用的消息，仅当字段的日历与其 Provider 的日历不同时才指明日历，如 AR2 对描述所述。

### Platform support

- 支持的特性/引擎下限：与公历对齐的日历在所有受支持的浏览器和渲染器中都可用。其他日历需要 `Temporal`：运行时的原生实现，或应用加载的 polyfill。国际化指南列出了自带它的运行时。
- 不支持的行为：没有 `Temporal` 时，采用 FR5 的公历回退和开发环境警告。macOS 和 iOS 上的 Safari 缺少 `Temporal`，且 `spec:AST-013` FR3 明确点名 iOS Safari，因此每个解析日历的组件都记录一条 `spec:AST-013` FR12 例外：`Calendar`、`DateInput`、`DateRangeInput`、`DateTimeInput`，以及 FR18 的 `Timestamp` 和 `PowerSearch`。该例外指明能力（需要 `Temporal` 的日历）、缩减（FR5 的回退，除非应用加载 polyfill；在服务器端渲染的应用也在服务器上加载它）、保留的义务（`spec:AST-013` FR7 和 FR8，以及只要服务器与浏览器以相同方式解析日历就保留 FR9，FR19 所述的中国历法与 Dangi 历法情形除外）、证据（移除 `Temporal` 后的真实浏览器运行，带 polyfill 与不带 polyfill）、所有者（`nynexman4464`），以及复查条件（Safari 发布 `Temporal`）。
- 浏览器证据：带原生 `Temporal` 的真实 Chromium 和 Firefox；移除 `Temporal` 的真实 Chromium、Firefox 和 WebKit，带 polyfill 与不带 polyfill；带与不带 `Temporal` 的服务器渲染和水合。

## Current-state impact

- `architecture:internationalization` INV10 以 FR2 的日历解析、FR3 的公历 ISO 值和 FR5 的 `Temporal` 边界取代仅公历的日期语义。INV8 中具名的区域设置敏感辅助函数包含日历系统辅助函数。
- `component:InternationalizationProvider` 增加 `calendar` prop 和 FR2。
- `component:Calendar`、`component:DateInput`、`component:DateRangeInput` 和 `component:DateTimeInput` 增加 `calendar` prop，投影 FR4–FR17 和 AR1–AR3，并记录 `spec:AST-013` FR12 例外。
- `component:Timestamp` 和 `component:PowerSearch` 遵循 FR18，并记录 `spec:AST-013` FR12 例外。Schedule 遵循 FR18，图表格式化函数接受 FR18 的可选 `calendar` 参数。
- `spec:AST-043` FR1–FR3 指明日历例外：在不是 `gregory` 或 `iso8601` 的日历下，`adaptive-native`、已弃用的 `nativePicker` 取值，以及显式 `presentation="native"` 对 `DateInput` 和 `DateTimeInput` 使用 Astryx 界面（FR15）。
- `architecture:public-component-api` INV16 规定调用方的显式呈现选择优先于默认值，它指明了同一日历例外：在不是 `gregory` 或 `iso8601` 的日历下，显式 `presentation="native"` 会按指针类型解析为 Astryx 界面，因为没有任何原生日期选择器会显示应用的日历（FR15，DEC-7）。
- 带 `-u-ca-` 关键字的 Provider 区域设置保留最新稳定版本显示的公历日期（FR2）。遵循该关键字会在不改代码的情况下改变输出，`spec:AST-017` FR1 将其归类为破坏性变更，因此它等待次要版本（DEC-2）。
- 发生变化的公历行为及其 `spec:AST-017` 分类：
  - `component:Calendar` AR1 已经用 Shift+PageUp 和 Shift+PageDown 按公历年步进，并把缺失的日号钳制到该月最后一天。FR7 将该步进扩展到日历年与闰月：新增性（FR5）。
  - FR12 的 `onChange` 时机不再为不完整的输入报告日期，这恢复了 `component:DateInput` FR1 的下一个 ISO 日期契约：非破坏性修复（FR5）。
  - AR3 的消息是对字段已经拒绝的输入的新增播报（FR5）。
  - FR11 将越界的键入文本连同其错误保留在字段中，而最新稳定版本在失焦时回退该文本。两种情况下的值都不变：非破坏性交互变更（FR5）。
  - `@astryxdesign/core/utils` 中的 `parseDateInput` 不变，公历文本字段仍提交它能读取的任何文本，一位数年份除外（FR9）。
  - 两位数年份遵循区域设置的字段顺序：`en-GB` 中的 `1/5/26` 提交为 2026 年 5 月 1 日，而最新稳定版本按月份在前提交为 2026 年 1 月 5 日。这恢复了 `parseDateInput` 应用于四位数年份的区域设置顺序：修复（FR5）。
  - 在月份在前的区域设置中，两位数年份在 FR10 的窗口内解读，而最新稳定版本使用运行时的 `Date` 解析：在 2026 年，`en-US` 中的 `1/5/46` 到 `1/5/49` 提交为 1946 到 1949，而不是 2046 到 2049。`component:DateInput` FR6 将 `Date` 回退记录为实现缺口，因此这恢复了 FR6：非破坏性（FR5）。
  - 一位数年份不是日期：`1/5/2` 不会提交，而最新稳定版本通过运行时的 `Date` 将其读作 2002 年 1 月 5 日。这也恢复了 `component:DateInput` FR6，该记录将该回退记为一个缺口：非破坏性（FR5）。
  - `formatSharedDate`、`shortDate` 和 `monthYear` 增加一个可选参数：新增性（FR5）。
  - `useCalendarDays` 和 `useCalendarNavigation` 增加一个默认为 `gregory` 的可选 `calendar`（FR20）：新增性（FR5）。
- 使用方文档：国际化指南涵盖选择日历、在服务器和浏览器中加载 `Temporal` polyfill，以及 FR19 的注意事项。`Calendar` 将 `hasWeekNumbers` 记录为 ISO 8601，并说明 `hasVariableRowCount` 用固定高度换取紧凑网格。`DateInput` 系列记录 FR15 的回退，并建议为佛历和民国历字段设置 `min` 和 `max`。

## Verification

| 契约         | 验证                                                                             | 代表性状态                                                                                                                                                                             | 变更或失败预期                                                                                                        |
| ------------ | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| FR1–FR2      | Provider 与组件解析测试                                                          | 每个标识符；未知标识符；组件优先于 Provider 优先于默认值；裸 `fa-IR`；带 `-u-ca-` 的区域设置保持公历                                                                                   | 区域设置选择了日历、优先级发生变化，或未知标识符抛出错误                                                              |
| FR3          | 在非公历日历中的回调与表单测试                                                   | 在 `persian` 和 `hebrew` 中选择、键入、清除、`min`、`max` 和 `dateConstraints`                                                                                                         | 任何报告或提交的值不是公历 ISO                                                                                        |
| FR4, FR6–FR7 | 对照 `Temporal` 对每个日历做 1900 年至 2100 年的月份结构测试；真实浏览器网格检查 | 波斯历月边界、希伯来闰年、埃塞俄比亚历第十三个月、日本年号变更、中国历法闰月；PageUp、PageDown、Shift+PageUp、Shift+PageDown                                                           | 月份起点、长度或步进与 `Temporal` 不一致，或闰月消失                                                                  |
| FR5          | 移除 `Temporal` 的真实浏览器运行，带与不带 polyfill；服务器渲染与水合            | 带与不带 `Temporal` 的 `persian`；不带 `Temporal` 的 `buddhist` 和 `japanese`                                                                                                          | 崩溃、缺少警告，或水合不匹配                                                                                          |
| FR8          | 日历周编号测试                                                                   | 带 `hasWeekNumbers` 的 `persian` 和 `hebrew` 网格                                                                                                                                      | 周编号不是 ISO 8601                                                                                                   |
| FR9–FR14     | 解析器测试；往返矩阵；DateInput 和 DateTimeInput 交互测试                        | 每个日历在 1900 年至 2100 年间，使用本地区域设置、英文和瑞典文，覆盖每个具名格式；Adar；部分输入；混合数字；日本年号；无效日期；只有 `parseDateInput` 能读取的公历文本                 | 往返失败、无效日期被调整、`onChange` 在部分输入上触发，或 `parseDateInput` 能读取的公历文本（一位数年份除外）不再提交 |
| FR15–FR17    | 呈现测试与触摸交互测试                                                           | 带 `persian` 的 `adaptive-native` 和 `native`；希伯来闰年与平年的月数；年号年份标签；`DateRangeInput` 触发文本                                                                         | 在任何呈现方式下为非公历日历渲染原生日期输入，或滚轮为 13 个月的年份显示 12 个月                                      |
| FR18         | 格式化函数测试                                                                   | `persian` 中的 Timestamp 日期格式、PowerSearch 值、Schedule 标签和图表日期                                                                                                             | 内置日期格式忽略 Provider 的日历，或某个 `system_*` 格式发生变化                                                      |
| FR19         | 文档审查                                                                         | 国际化指南和日期组件文档                                                                                                                                                               | 缺少该注意事项                                                                                                        |
| FR20         | hook 测试                                                                        | 不带 `calendar` 的 `useCalendarDays` 与已发布输出一致；带 `calendar` 的 `persian` 和希伯来闰年（第 13 月）；`useCalendarNavigation` 按日历月步进并加标签；Provider 日历不改变任一 hook | hook 读取 Provider 的日历、改变已发布的公历输出，或在给定日历时假定 12 个月                                           |
| AR1–AR3      | 无障碍树与播报断言                                                               | `persian` 中的日期按钮和播报；每种拒绝类型                                                                                                                                             | 播报的日期使用的日历与网格不同，或两种拒绝类型共用一条消息                                                            |

## Decision log

### DEC-1 — Values stay Gregorian ISO

**Reference:** `spec:AST-111/DEC-1`

**Decider:** `nynexman4464`, 2026-11-02

日历只改变呈现和输入，因此应用数据、表单、服务器，以及现有调用方处理的值都保持不变。支持多种日历的日期库和平台出于同样的原因返回日历中立的值：在意外日历中回读日期是常见的缺陷来源。

已否决：为值标注其日历，因为那样每个使用方都需要日历感知的代码。

### DEC-2 — The application chooses the calendar, separately from language

**Reference:** `spec:AST-111/DEC-2`

**Decider:** `nynexman4464`, 2026-11-02

Provider 的 `calendar` 为子树设置日历，公历仍是默认值，因此 `fa`、`th` 和 `ar-SA` 的屏幕在应用主动选择之前保持公历日期。组件自身的 `calendar` 用于并排显示两种日历的屏幕，例如公历出生日期旁边是伊斯兰历日期；嵌套 Provider 会迫使调用方重复声明区域设置、目录和覆盖项，因为嵌套 Provider 会替换其父级的上下文。

已否决：跟随区域设置的默认日历，因为它会在默认日历不是公历的区域设置中悄然改变每个屏幕。

区域设置中的 `-u-ca-` 关键字同样不选择日历。像 `th-TH-u-ca-buddhist` 这样的区域设置在最新稳定版本中显示公历日期，因此遵循该关键字会在不改代码的情况下改变应用的输出，`spec:AST-017` FR1 将其归类为破坏性变更。该关键字可以在次要版本中成为选择器，并以 `calendar="gregory"` 作为恢复用的 prop。

已否决：在补丁版本中把遵循该关键字视为应用的显式请求，因为 `spec:AST-017` FR6 不允许一次批准将 FR1 认定为破坏性的变更重新分类。已否决：`calendar="from-locale"` 主动选择，因为它增加了一个公开取值，而该取值的唯一职责就是重复后续次要版本将设为默认值的内容。

### DEC-3 — Temporal does the calendar arithmetic, and the application loads any polyfill

**Reference:** `spec:AST-111/DEC-3`

**Decider:** `nynexman4464`, 2026-11-02

Astryx 不拥有任何日历算法或数据表，因此正确性和维护都留在平台侧。Astryx 不打包 polyfill，因此公历应用不付出任何代价。在缺少 `Temporal` 的运行时中需要其他日历的应用，要在服务器和浏览器中加载 polyfill。

已否决：由 Astryx 拥有日历运算，因为其正确性和维护成本属于平台。已否决：打包 polyfill，因为每个应用都会为它付出代价。

### DEC-4 — One parser reads typed dates in every calendar

**Reference:** `spec:AST-111/DEC-4`

**Decider:** `nynexman4464`, 2026-11-02

`Temporal` 只解析机器字符串，而 `Intl` 没有解析器，因此 Astryx 自行读取键入文本。一个解析器基于 `Intl` 自身的输出构建并由 `Temporal` 校验，服务于包括公历在内的每个日历，因此字段显示的格式就是它读取的格式。年份在日历中按字面读取，与其他日期库的读取方式一致；可见的年号告诉人们应键入哪一年，`min` 和 `max` 能捕获错误。排除了默认年份范围，因为它会拒绝应用所接受的日期。

已否决：分段的日、月、年字段，因为它们会取代 `DateInput` 的自由文本交互。

### DEC-5 — The lunisolar calendars follow the runtime

**Reference:** `spec:AST-111/DEC-5`

**Decider:** `nynexman4464`, 2026-11-02

人们在使用这些日历，原生 `Temporal` 在其发布的任何地方都与天文台数据一致。剩余的分歧来自读取平台 `Intl` 数据的 polyfill，并在每个运行时都自带 `Temporal` 后消失，因此文档说明这一点，而不是不提供这些日历。

已否决：在所有地方强制使用同一个 polyfill，因为即插即用的 polyfill 读取宿主的 `Intl` 数据，会让原生环境变得不那么一致。

### DEC-6 — Week numbers stay ISO 8601, and a year step keeps the month

**Reference:** `spec:AST-111/DEC-6`

**Decider:** `nynexman4464`, 2026-11-02

`Temporal` 只为 `iso8601`（采用 ISO 8601 周编号的公历）定义周编号，因此 `hasWeekNumbers` 保持单一含义。在有十三个月的日历中，十二个月并非一年，因此按年步进会移动到下一日历年的同一个月。

### DEC-7 — A non-Gregorian calendar wins over the native picker

**Reference:** `spec:AST-111/DEC-7`

**Decider:** `nynexman4464`, 2026-11-02

原生日期控件在 Android 上是公历，在 iOS 上跟随设备自身的日历，因此无法显示应用的日历。在错误日历中显示的日期读起来就是一个错误的日期，这与原生控件在秒或步进上损失的精度不同，因此日历即使面对显式的 `native` 也胜出。

已否决：让显式的 `native` 保持原生，因为那样将由设备而不是应用来选择人们看到的日历。

### DEC-8 — Calendars go by their CLDR names

**Reference:** `spec:AST-111/DEC-8`

**Decider:** `nynexman4464`, 2026-11-10

Astryx 以 CLDR 命名日历的方式命名日历。指明日历的组件从 `Intl.DisplayNames`（类型为 `calendar`）读取区域设置的显示名称（AR2）。规格、文档、changeset 和源码注释使用 CLDR 的英文名称，例如用 Minguo calendar 表示 `roc`、用 Dangi calendar 表示 `dangi`、用 Chinese calendar 表示 `chinese`。只有在指 API 值本身时，才用代码字体书写 ECMA-402 标识符。`iso8601` 日历被 CLDR 命名为采用 ISO 8601 周编号的公历，在周编号无关的场合按公历计。`Intl` 书写的年号名称（例如 `民國`）是数据，按 `Intl` 书写的样子呈现。搜索关键词也可以列出其他常用名称，以便人们找到页面。

已否决：非 CLDR 的名称，例如用国家、州或节日来代表日历，因为标准名称保持中立，并与组件显示的内容一致。

## Open questions

无。
