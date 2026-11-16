---
schema_version: 4
template_version: 1
kind: system-spec
id: spec:AST-043
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-09-24
phase: accepted
owners: [imdreamrunner]
affects_architecture: [architecture:public-component-api]
affects_families: [family:input-fields]
affects_contributing: []
affects_consumer_docs: []
---

# Date and time input presentation system spec

## Intent

一个 prop 问题——由哪个界面收集该值——目前有两种答案：

- `ContextMenu`、`DropdownMenu`、`MoreMenu`、`Selector` 和 `MultiSelector` 使用 `presentation`（`'popover' | 'bottom-sheet' | 'adaptive'`）。
- `DateInput`、`DateTimeInput` 和 `TimeInput` 使用 `nativePicker`（`'touch' | 'always' | 'never'`），这个名称只指向原生界面，却掩盖了以下事实：桌面端 Astryx、触摸端 Astryx（bottom sheet），以及——对 `TimeInput` 而言——没有任何选择器的纯文本字段，是不同的界面。

本规格为三个日期/时间输入提供 `presentation` prop，其取值能区分每一种界面；它精确保留当前的默认行为与废弃 prop 行为，并将 `nativePicker` 标记为废弃——但不移除。目前没有任何现存记录拥有这套跨组件词汇（检索范围：组件契约、`architecture:public-component-api`、`family:input-fields`，以及代码与记录中的 `nativePicker` / `presentation` / `AdaptivePresentation`）。

## Non-goals

- 任何界面的外观、解剖结构或交互——保持不变，且由各组件拥有，但 DEC-3 批准的新界面除外。资格/回退行为仅按 FR2 所述发生变化（针对 `native`）。
- 重命名菜单/选择器的 `presentation` 或它们的 `adaptive`（OQ1）。
- 移除 `nativePicker`——其具体映射仍由本记录拥有，而废弃记录、清理 id、Changeset、成对次版本处理以及迁移证据遵循 [`spec:AST-017` FR28–FR44](../AST-017/spec.md)，codemod 遵循 `spec:AST-040`。

## Requirements

- **FR1 — prop、取值与界面。** `DateInput`、`DateTimeInput` 和 `TimeInput` 必须接受可选的 `presentation`，默认值为 `'adaptive-native'`：

  | 取值                    | 精细指针        | 粗略指针        |
  | ----------------------- | --------------- | --------------- |
  | `text-input`            | 文本字段        | 文本字段        |
  | `popover`               | Astryx 桌面端   | Astryx 桌面端   |
  | `bottom-sheet`          | Astryx 底部面板 | Astryx 底部面板 |
  | `native`                | 原生            | 原生            |
  | `adaptive-bottom-sheet` | Astryx 桌面端   | Astryx 底部面板 |
  | `adaptive-native`       | Astryx 桌面端   | 原生（FR2）     |

  | 界面            | `DateInput`               | `DateTimeInput`                  | `TimeInput`                                                        |
  | --------------- | ------------------------- | -------------------------------- | ------------------------------------------------------------------ |
  | 文本字段        | —（不接受）               | —（不接受）                      | 可输入字段（当前的 `never`）                                       |
  | Astryx 桌面端   | 可输入字段 + 日历弹出层   | 可输入字段 + 日期/时间弹出层     | —（精细指针经文本字段解析；`popover` 不是 `TimeInput` 的独立界面） |
  | Astryx 底部面板 | BottomSheet 日历          | BottomSheet 日期/时间滚轮        | BottomSheet 时间滚轮（DEC-3）                                      |
  | 原生            | 浏览器/操作系统日期选择器 | 浏览器/操作系统日期 + 时间选择器 | 浏览器/操作系统时间选择器                                          |

  `text-input` 仅适用于 `TimeInput`（维护者确认：imdreamrunner，2026-09-25）——它只为 `TimeInput` 已发布的 `never` 而存在（FR3）；一个没有选择器的日期字段没有已发布的需求，并且会静默丢掉日历可供性：`DateInput` 和 `DateTimeInput` 不得接受它——它们导出的 `presentation` 类型将其排除，因此它会是编译期错误，且没有为它定义任何运行时界面。它们的五个取值为 `popover | bottom-sheet | native | adaptive-bottom-sheet | adaptive-native`；只有 `TimeInput` 接受全部六个。

  粗略指针沿用这些输入既有的指针判定，不含宽度条件。强制取值（粗略指针下的 `popover`、当前尚未触达的 `bottom-sheet`，以及 `TimeInput` 上的 `text-input`）必须渲染所命名的界面，绝不静默替换成另一个界面。在非 `gregory` 或 `iso8601` 的日历下，`DateInput` 和 `DateTimeInput` 在精细指针上把 `native` 与 `adaptive-native` 解析为 Astryx 桌面端，在粗略指针上解析为 Astryx 底部面板（FR2，`spec:AST-111` FR15）。

- **FR2 — `native` 的回退拆分。** 显式的 `presentation="native"` 必须始终显示原生界面，不设任何资格回退——原生控件无法表达的状态（秒、非默认步长/增量、预置时间选项、没有可用的原生控件）是调用方显式的选择。唯一的例外是日历：在非 `gregory` 或 `iso8601` 的日历下，显式 `native` 使用 Astryx 界面，并在开发环境下发出警告（`spec:AST-111` FR15）。`presentation="adaptive-native"`——包括默认值与 `nativePicker="touch"`——必须保留已发布的回退：在相同的这些状态下，它回退到该组件的 Astryx 界面（对 `DateTimeInput` 而言是逐段回退：日期可以走原生，而时间回退），与当前已发布的行为完全一致。已废弃的 `nativePicker="always"` 且没有显式 `presentation` 是第三种情况（FR3）：它必须保留自身已发布的回退，因此其行为不变——只有显式的 `presentation="native"` 才选择无回退。

- **FR3 — 精确保留默认值与 `nativePicker`。** 两个 prop 都省略时必须等同于当前的 `nativePicker="touch"`。`nativePicker` 及其导出的类型必须保留，标记为 `@deprecated`，对未迁移与已迁移的调用点都按已发布的方式精确解析：

  | `nativePicker` | `DateInput` / `DateTimeInput` | `TimeInput`           |
  | -------------- | ----------------------------- | --------------------- |
  | `touch`        | `adaptive-native`             | `adaptive-native`     |
  | `always`       | `native`（旧版，FR2）         | `native`（旧版，FR2） |
  | `never`        | `adaptive-bottom-sheet`       | `text-input`          |

  `always` 在每种指针上都映射到 `native` 界面，但在非 `gregory` 或 `iso8601` 的日历下除外（FR2）；同时它保留已发布的资格回退（FR2）：`hasSeconds`、非默认步长/增量、预置时间选项，或没有可用的原生控件时，都保持 Astryx 界面，与已发布的行为完全一致。因此它并不等同于显式的 `presentation="native"`，后者从不回退；迁移（通过 codemod 或手工）到 `presentation="native"` 才会改变那些状态，而且是刻意为之。（`TimeInput` 已发布的 `never` 在每种指针上都是可输入字段；`TimeInput` 的面板只来自显式的 `presentation="bottom-sheet" | "adaptive-bottom-sheet"`。）以等价含义保留该 prop 是非破坏性的（`spec:AST-017` FR4）。

- **FR4 — 优先级。** 如果两个 prop 都设置，`presentation` 必须胜出，`nativePicker` 必须被忽略，与顺序或指针无关。每当使用 `nativePicker` 时，仅限开发环境的警告应当指出 FR3 的替代方案，并且不得在生产环境触发。

- **FR5 — 文档与类型一致。** 每个组件的使用方文档（英文 + 中文）、导出的类型以及 Storybook controls 必须展示 FR1 的取值/默认值（`TimeInput` 六个取值，`DateInput`/`DateTimeInput` 五个），并且 `nativePicker` 只能作为废弃项连同其 FR3 替代方案出现。

### Platform support

- 下限：不变（`spec:AST-013`，各组件）；没有任何取值会渲染出没有选择器的界面（FR2 的 `adaptive-native` 回退保证总有一个 Astryx 界面）。
- 浏览器证据：在精细/粗略指针浏览器上验证每一个 FR1 取值，外加 FR2 的回退状态，因为 jsdom 既不报告指针类型，也不报告原生选择器。

## Current-state impact

- `packages/core/src/{DateInput,DateTimeInput,TimeInput}`：新增 `presentation`，废弃 `nativePicker`（FR1–FR4）；文档/类型（FR5）；DEC-3 新界面；实现该功能的 PR 会附带 `spec:AST-017` FR8 迁移 + 非破坏性 Changeset。菜单/选择器组件：不变。

## Verification

| 契约    | 验证                                | 代表性状态                                                                                                | 变异或失败预期                                                                         |
| ------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| FR1     | 每个输入的单元测试 + 真实浏览器检查 | 逐组件取值 × 精细/粗略指针，含强制取值与 `TimeInput` 底部面板；`text-input` 在 `TimeInput` 之外被类型拒绝 | 错误的或被替换的界面即失败                                                             |
| FR2     | 单元测试，请求原生                  | 秒、步长≠默认、预置选项、无可用原生：显式 `native` 保持原生；`adaptive-native` 与已废弃的 `always` 回退   | 在显式 `native` 下出现任何资格回退，或在 `adaptive-native`/`always` 下没有回退，即失败 |
| FR3–FR4 | 单元测试：默认、已废弃、双 prop     | 省略；逐组件的 `touch`/`always`/`never`；两个 prop，任意顺序                                              | 映射漂移（含 `TimeInput:never→sheet`）或 `nativePicker` 胜出，即失败                   |
| FR5     | 文档/类型一致性测试                 | 全部 3 个组件，英文 + 中文                                                                                | 有文档但无类型的取值/默认值，即失败                                                    |

## Decision log

### DEC-1 — Unify on `presentation`; values name the surface

**参考：** `spec:AST-043/DEC-1`

**决定者：** imdreamrunner，2026-09-24

构建者已经在这类问题上的菜单/选择器中接触到 `presentation`。已否决：字面重命名为 `'touch'|'always'|'never'`（掩盖了桌面端、面板与文本字段的差别）、使用单一的 `astryx` 取值（同样的信息丢失）、共用的 `'adaptive'`（掩盖了面板与原生的差别）、两个含义重叠的 prop 并存。

### DEC-2 — Default `adaptive-native`; deprecate, don't remove

**参考：** `spec:AST-043/DEC-2`

**决定者：** imdreamrunner，2026-09-24

`adaptive-native` 就是当前默认值的重命名；`nativePicker` 继续可用（FR3/FR4）——破坏性事件是移除，而不是重命名。已否决：默认改为 `adaptive-bottom-sheet`，以及让 `nativePicker` 胜过 `presentation`。

### DEC-3 — Forced surfaces and `TimeInput` sheet approved

**参考：** `spec:AST-043/DEC-3`

**决定者：** cixzhang，2026-09-24

粗略指针下的强制 `popover`、精细指针下的 `bottom-sheet`，以及新增的 `TimeInput` 底部面板（即 `DateTimeInput` 面板中的时间那一半）都是已批准的新界面。这关闭了此前关于 FR1 强制覆盖范围的开放问题；实现可以按 FR1 的写法依赖它。

## Open questions

- **OQ1 — 菜单/选择器重命名**（`human-api`）：日后是否按这套废弃模式把它们的 `adaptive` 重命名为 `adaptive-bottom-sheet`？超出范围。
