---
schema_version: 3
template_version: 3
kind: component
id: component:Selector
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-24
owners: [cixzhang, imdreamrunner]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Selector/Selector.test.tsx,
    packages/core/src/Selector/Selector.openHighlight.test.tsx,
    packages/core/src/Selector/Selector.source-build.test.mjs,
    packages/core/src/Selector/__tests__/Selector.listbox.a11y.test.tsx,
    packages/core/src/Selector/__tests__/Listbox.a11y.chromium.spec.ts,
    packages/core/src/Selector/__tests__/Selector.combobox.a11y.test.tsx,
    packages/core/src/Selector/__tests__/Selector.combobox.a11y.chromium.spec.ts,
    packages/core/src/Selector/__tests__/SelectorListboxName.a11y.chromium.spec.ts,
    apps/storybook/stories/Selector.stories.tsx,
    .github/scripts/story-play-guard.js,
  ]
modules: []
families: [family:input-fields]
design_specs: []
architecture:
  [
    architecture:component-theming-surface,
    architecture:icon-resolution-and-component-slots,
    architecture:interaction-modality,
    architecture:layer-runtime,
    architecture:public-component-api,
  ]
contributing: []
system_specs: [spec:AST-004/DEC-1, spec:AST-011/DEC-1]
---

# Selector component contract

## Intent

Selector 让用户从规模适中的列表中选择一个值，同时让触发器仍可作为表单字段或紧凑工具栏控件使用。它负责单值选择、选项导航、在给定选项内搜索，以及关闭状态的触发器与其选择表面之间的连接关系。

## Compatibility and migration

- 已发布的默认值与行为保持不变，但 `presentation` 默认值（由 DEC-1 设定）与 `adaptive` 的紧凑判定（见下文）除外。
- `indicatorPosition` 默认为 `end`；渲染出的选择标记在该逻辑边缘占据空间，而解析为空的指示器不占据任何空间。
- `presentation` 默认为 `adaptive`（DEC-1）：在紧凑的粗指针屏幕上使用模态底部面板，其他情况使用锚定弹出层。`popover` 与 `bottom-sheet` 在所有设备上固定为单一表面。该默认值属于稳定默认值变更，因此在 `spec:AST-017` 下以 `[breaking]` 随计划中的次版本发布；需要在所有设备上使用锚定弹出层的调用方传入 `popover`。
- `adaptive` 的紧凑判定改为 `spec:AST-012` FR9（宽度低于生效的 `md` 断点或高度低于 500），取代已发布的 `(max-width: 768px)` 查询：粗指针屏幕宽度恰为 768 像素且高度至少 500 时打开弹出层，而粗指针屏幕宽度大于 768 但高度低于 500 时打开底部面板。两种表面都保持选择可用，因此调用方无需改动源码，该变更在 `spec:AST-017` FR1 下不构成破坏性变更；`popover` 与 `bottom-sheet` 固定为单一表面。在共享解析器符合之前，该行为仍为待定；FR4 描述的是已发布的查询。
- `hasClear` 改变了值契约，使其包含 `null`；这一区分已经是公共类型的一部分。
- `isReadOnly` 为新增项，默认 `false`。它保留选中值、焦点与表单参与能力，同时移除选择表面与编辑相关的可供性。两者同时设置时，`isDisabled` 优先。
- `secondary` 是新增的触发器变体。`input` 仍为默认值；现有的 `input` 与 `ghost` 调用方保持其已发布行为。
- `spec:AST-004/DEC-1` 管辖 FR3 中由状态派生的指示器空间行为。
- 0.7.0 移除了 `selector-clear-icon` 别名；共享的清除图标仍可通过 `input-clear-icon` 获得。
- 迁移决策：将已移除的主题键与 CSS 类替换为 `input-clear-icon` 和 `.astryx-input-clear-icon`，或运行 `astryx upgrade --from 0.6.3 --apply --path .`。

### DEP-0011 — Deprecate the `popover` default presentation

| 字段             | 值                                                                                                                                       |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| id               | `DEP-0011`                                                                                                                               |
| cleanup          | `CLN-0020`                                                                                                                               |
| package          | `@astryxdesign/core`                                                                                                                     |
| surface          | `Selector`、`MultiSelector` 与带 `items` 的 `DropdownMenu`（以及转发到它的 `MoreMenu`）的默认 `presentation`：在所有设备上使用锚定弹出层 |
| old contract     | 未指定 `presentation` 时，选项列表或操作列表在所有设备上以锚定的非模态弹出层打开                                                         |
| replacement      | `presentation="popover"` 在所有设备上保持锚定弹出层；`adaptive` 已发布并已被接受                                                         |
| direct authority | `component:Selector` DEC-1。所有者：`cixzhang`、`imdreamrunner`。`MultiSelector` 与 `DropdownMenu` 没有设定此默认值的当前契约            |
| warning          | 使用方文档与发布说明中注明 `DEP-0011` 与 `presentation="popover"`。无运行时警告（`spec:AST-017` FR29）                                   |
| migration        | 在需要所有设备都使用弹出层的场景中属机械改动：添加 `presentation="popover"`                                                              |
| codemod          | 默认无：在所有地方固定 `popover` 会让每个调用方都退出该变更。若有所有者需要，保留现有行为的 codemod 属机械改动                           |
| downstream       | 指导建议保留默认值，仅在产品策略需要时固定 `popover`                                                                                     |
| transition       | 无先前过渡                                                                                                                               |
| state            | `proposed`                                                                                                                               |
| open decision    | `MultiSelector` 与 `DropdownMenu` 默认值的当前权威                                                                                       |
| target plan      | `CLN-0020`，在下一个次版本发布                                                                                                           |

### CLN-0020 — Selector, MultiSelector, and data-driven DropdownMenu default to `adaptive`

| 字段      | 值                                                                                                                                                                      |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id        | `CLN-0020`                                                                                                                                                              |
| lifecycle | `DEP-0011`                                                                                                                                                              |
| delta     | 未指定 `presentation` 时，紧凑的粗指针屏幕打开模态底部面板（触发器 `aria-haspopup="dialog"`，焦点移入，关闭时返回）；其他所有设备保持锚定弹出层。复合 DropdownMenu 不变 |
| rollback  | 从最终补丁基线恢复 `popover` 默认值                                                                                                                                     |
| state     | `pending` —— 随声明的次版本与其 `[breaking]` Changeset 落地                                                                                                             |

## Ownership boundary

**负责**

- 从给定的选项中选取一个值。
- 触发器、列表框、选项、搜索、空状态、加载与禁用行为。
- 该选择流程的键盘导航与播报。
- 针对 Selector 的共享 Field、Layer、自适应呈现与指示器行为的组合。

**不负责 / 非目标**

- 操作菜单或导航菜单；由 DropdownMenu 负责。
- 多值选择；由 MultiSelector 负责。
- 调用方从 `renderOption` 或 `renderValue` 返回的 `SelectorOption` 内容行 —— 由 `component:SelectorOption` 负责。
- 在给定选项列表之外执行的产品特定选项内容或过滤。
- 家族范围的输入状态展示、行为、外观、尺寸、尾部控件、状态位置与禁用原因策略 —— 由当前的 `family:input-fields` 负责。

## Public concepts

本表列出审查者需要的语义概念。Prop 语法、完整默认值与示例仍保留在 `Selector.doc.mjs` 中。

| 概念                   | 封闭取值或状态                        | 含义                                 | 按变体/方向/状态的可用性 | 默认值     | 所有者   | 稳定性                     | 无效值行为              |
| ---------------------- | ------------------------------------- | ------------------------------------ | ------------------------ | ---------- | -------- | -------------------------- | ----------------------- |
| trigger variant        | `input`、`secondary`、`ghost`         | 表单字段式或与按钮对齐的工具栏呈现   | 所有触发器状态           | `input`    | Selector | 已发布；`secondary` 为新增 | TypeScript 拒绝其他取值 |
| size                   | `sm`、`md`、`lg`                      | 触发器与选项行的密度                 | 所有呈现方式             | `md`       | Selector | 已发布                     | TypeScript 拒绝其他取值 |
| selected-mark position | `start`、`end`                        | 包含渲染出的选择标记的逻辑边缘       | 每个选项行               | `end`      | Selector | 已发布                     | TypeScript 拒绝其他取值 |
| presentation           | `popover`、`bottom-sheet`、`adaptive` | 锚定指针表面或模态紧凑触控表面       | 所有触发器变体           | `adaptive` | Selector | 已发布                     | TypeScript 拒绝其他取值 |
| popup semantics        | `listbox`；包含一个列表框的模态对话框 | 语义跟随活动的呈现方式               | 弹出层；底部面板         | `listbox`  | Selector | 已发布                     | 不公开单独的 role prop  |
| option-row state       | `selected`、`disabled`                | 每个选项行上稳定的主题状态           | 每个渲染出的选项         | 两者皆无   | Selector | 已发布                     | 不输出未知状态          |
| read-only state        | `false`、`true`                       | 在没有选择可供性的情况下保留并提交值 | 关闭的触发器             | `false`    | 调用方   | 新增                       | 布尔归一化              |

## Behavioral and layout contract

这些需求描述当前 `main` 上已发布的行为。

| ID   | 已发布不变式                                                                                                                                                                                                                                                                                                                                                                    | 证据                                                                     |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| FR1  | 选择已启用的选项会更新那一个选中值，关闭活动的呈现方式，并使触发器回到其稳定的关闭状态。                                                                                                                                                                                                                                                                                        | 使用方文档与选择交互测试                                                 |
| FR2  | 未显式指定放置位置时，非搜索型弹出层将选中行对齐到触发器之上，并将其限制在视口内、位于任何软键盘之上（`spec:AST-059` FR9）；弹出层打开期间键盘收起不会移动其顶部。搜索型弹出层与显式指定的放置位置使用常规的 Layer 定位。                                                                                                                                                       | 使用方文档、实现与几何测试                                               |
| FR3  | 解析后的选择指示器不绘制任何内容的选项不预留标记列空间。可见的选中指示器或主题替换指示器仍在 `indicatorPosition` 处保留在布局中；由此产生的随状态变化的标签位置或可用宽度是有意为之，行内容保持其现有的溢出行为。                                                                                                                                                               | `itemMarkColumn`、聚焦指示器测试与 Chromium 证据故事                     |
| FR4  | `popover` 使用锚定的 Popover。`bottom-sheet` 使用模态 BottomSheet。`adaptive` 在紧凑的粗指针屏幕上解析为模态底部面板，其他情况解析为 Popover。                                                                                                                                                                                                                                  | 呈现控制器与自适应呈现测试                                               |
| FR5  | `isLoading` 为 true 时，触发器暴露忙碌状态，列表框抑制空状态与无结果输出。                                                                                                                                                                                                                                                                                                      | 加载、空状态与播报测试                                                   |
| FR6  | `isReadOnly` 为 true 时，选中值仍可聚焦并可随表单提交，而选择表面、清除操作、展开指示器以及所有值变更路径均不可用。                                                                                                                                                                                                                                                             | 只读交互、表单与无障碍测试                                               |
| FR7  | 列表框带有 `data-astryx-menu-press`，并遵循 `module:DropdownMenu/useMenuPress` 的 FR1–FR3、FR5 与 AR2：指针释放处下方的选项即为被选中的选项；按住指针时，高亮通过 `aria-activedescendant` 跟随指针，而 DOM 焦点保持在组合框上；鼠标在列表外释放会关闭列表，手指在列表外抬起则保持打开；浏览器产生的杂散点击永不触发选择。触发器打开、方向键夹取与关闭触发器的键入匹配保持不变。 | `module:DropdownMenu/useMenuPress`；`Selector.test.tsx` 按压模型测试套件 |
| FR8  | 打开已关闭的列表时，若选中选项处于启用状态，则高亮该选项。否则按下 ArrowUp 高亮最后一个已启用选项，而以其他任何方式打开（ArrowDown、按压、Enter、Space）都高亮第一个已启用选项；没有已启用选项时不设高亮。打开时永不把高亮落在禁用选项上。通过按压、Enter 或键入打开的搜索列表不设置任何高亮。                                                                                  | WAI-ARIA 列表框与仅选择组合框模式；`Selector.openHighlight.test.tsx`     |
| FR9  | 在搜索列表中，查询的每次变更都会清除高亮，因此 `aria-activedescendant` 永不指向上一个列表中的选项；此时按下 ArrowDown 从第一个已启用选项开始，而无高亮时按 Enter 不选择任何内容。                                                                                                                                                                                               | WAI-ARIA 组合框模式；`Selector.searchHighlight.test.tsx`                 |
| FR10 | 高亮按值跟随其选项：当选项移动或重新加载时，被高亮的选项只要仍在列表中就会保持高亮；若它离开列表，高亮移动到列表顺序中它之后的第一个仍存在的选项，若其后没有剩余选项，则移动到其前一个仍存在的选项。禁用选项永不以此方式被高亮，且当没有已启用选项剩余时不设置高亮。                                                                                                            | WAI-ARIA 列表框模式；`Selector.highlightFollowsValue.test.tsx`           |

### Allowed variation

- **AV1 — 指示器渲染。** 主题可以替换勾选指示器。在选中与未选中两种状态下都绘制的替换指示器在两种状态下都保留其标记空间；只有解析为空的输出才会折叠。
- **AV2 — 选项内容。** `renderOption` 可以替换可见的选项内容，而 Selector 保留行角色、选择、禁用状态、导航与主题状态。
- **AV3 — 选中值内容。** `renderValue` 可以替换关闭状态的值显示，而不改变其组合框身份，无论其可编辑还是只读。

### Representative states

| 状态                     | 必需不变式                                                 | 允许的变化                                   |
| ------------------------ | ---------------------------------------------------------- | -------------------------------------------- |
| closed with no value     | 标签与占位符标识该字段                                     | 使用方提供的占位符文本                       |
| closed with a value      | 选中的选项在触发器中得到呈现                               | 自定义 `renderValue` 内容                    |
| pointer / popover        | 锚定表面在不带模态对话框语义的情况下暴露列表框             | 默认或显式放置位置                           |
| compact coarse pointer   | BottomSheet 暴露一个包含列表框的模态对话框                 | 默认或显式 `adaptive`，或显式 `bottom-sheet` |
| searching                | 可见选项、键盘导航与播报的结果数量使用同一个过滤器         | 使用方提供的搜索文本与空文本                 |
| loading                  | 触发器处于忙碌状态；空状态与无结果输出被抑制               | 使用方提供的加载时长                         |
| disabled with reason     | 触发器仍可聚焦（`spec:AST-085`）并暴露原因；激活保持被阻止 | 使用方提供的原因文本                         |
| read-only                | 值仍可聚焦且可提交；菜单、清除与展开可供性均不存在         | 值渲染、状态与忙碌呈现                       |
| selected/unselected rows | 空标记不占宽度；可见标记在逻辑边缘保留空间                 | 随状态变化的标签位置/宽度与主题指示器        |

### Transformation and precedence order

- **ORD1 — 选项归一化先于过滤与选择。** 字符串与选项对象在搜索、键盘匹配、渲染与值比较之前统一成一种选项形状。
- **ORD2 — 调用方选定的内容有意优先。** `startIcon` 优先于选中选项的图标；显式放置位置优先于选中项覆盖对齐。

### Performance and resources

- **PR1 — 搜索不增加由 effect 驱动的结果数量渲染。** 下一个过滤计数在输入变更时派生，并针对该查询只播报一次。
- **PR2 — 几何计算的作用域限于打开的弹出层。** 选中项对齐可以在打开时读取浏览器布局；关闭时它不施加全文档或持续性的观察。

## Accessibility contract

- **AR1 — 语义跟随呈现方式。** 锚定呈现通过 Popover 暴露列表框，触发器使用 `aria-haspopup="listbox"`。触控呈现暴露一个包含列表框的模态 BottomSheet 对话框，触发器使用 `aria-haspopup="dialog"`。在每种呈现方式中，列表框的可访问名称是字段的标签（`label`），而不是触发器的值。使用 `hasSearch` 时，可编辑触发器是按钮，搜索输入框拥有组合框。关闭状态触发器的可访问名称是其标签后接选中值的文本。未选中任何值时，该文本是占位符。调用方的 `aria-label` 在该名称中取代标签，而调用方的 `aria-labelledby` 优先于它，与组合框形状上的行为相同。使用 `hasSearch` 时，可编辑触发器不带 `aria-required`；列表打开期间由搜索输入框携带它，关闭状态触发器的可访问名称或描述包含字段的必填文本，因此在列表打开之前就会播报该状态。
- **AR2 — 焦点跟随活动的交互模型。** 锚定呈现把组合框关系保持在触发器/搜索控件处。模态触控呈现将焦点移入其搜索控件或列表框。关闭时，仅当焦点否则会丢失时才把焦点返回触发器（`family:overlay-dismissal` FR9）；由把焦点移到别处导致的关闭会把焦点留在那里。
- **AR3 — 键盘选择与可见集合一致。** 方向键、Home/End、键入匹配、搜索、Enter、Escape 与 Tab 的行为都作用于用户当前可感知的选项。
- **AR4 — 只读语义与可用性一致。** 只读值保持可聚焦，保留 `role="combobox"`，并暴露 `aria-readonly="true"` 与 `aria-expanded="false"`。其渲染内容仍是组合框的值。它不暴露 `aria-controls`、`aria-activedescendant` 或活动的选择表面。隐式的列表框弹出层描述该部件的选择能力；只读状态传达其值当前无法变更。Chromium 的按钮宿主组合框映射省略 ARIA 只读属性，因此本地化的可访问描述也会播报该状态。搜索与非搜索模式使用相同的只读组合框语义，因为在此状态下两者都不暴露搜索控件。
- **AR5 — 活动选项的可感知性。** 键盘输入之后，活动选项在其边缘内侧绘制共享焦点环；该焦点环的颜色在浅色与深色下对列表框均达到 3:1（`spec:AST-020` FR1，WCAG 2.2 1.4.11）。指针输入之后，活动选项仅保留覆盖填充，与获得焦点的 DropdownMenu 行相同（`component:DropdownMenuItem` AR4）。

## Design relationships

未链接任何当前设计规格。

| 解剖结构或状态                   | 当前呈现要求                                                                                                 | 呈现权威                 | 层级角色           | 组件契约 |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------ | ------------------ | -------- |
| selected mark and option spacing | 解析为空的标记折叠；可见标记保留空间，因此行标签几何可随状态变化                                             | `spec:AST-004/DEC-1`     | 支撑               | FR3      |
| trigger variants                 | `input` 读起来像表单字段；`secondary` 与相邻的 secondary `Button` 匹配；`ghost` 与相邻的 ghost `Button` 匹配 | `component:Selector/DD1` | 表单或同级操作控件 | 公共概念 |

第一行实现了 `spec:AST-004/DEC-1` 中由状态派生的间距决策。

### Design decisions

<!-- design-decisions:v1 -->

| ID  | Decision                                                             | Intent or reason                                                                            | Applies to                              | Allowed variation                                                      |
| --- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------- |
| DD1 | `secondary` 的 Selector 与相邻的 secondary `Button` 的视觉角色匹配。 | 混合工具栏或导航区域读起来是一个操作层级，而不是让 Selector 看起来像表单字段或 ghost 操作。 | 静止状态及贯穿各状态的 secondary 触发器 | 主题可以选择具体 token，同时保持与其 secondary `Button` 处理的一致性。 |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Field": {"delegatesTo": {"owner": "component:Field", "target": "field"}},
  "Trigger": {"target": "selector"},
  "Icon-rendered start icon": {
    "delegatesTo": {"owner": "component:Icon", "target": "icon"}
  },
  "Caller-rendered start content": {
    "none": {
      "reason": "intentional: Arbitrary ReactNode content is caller-owned and receives no Selector target."
    }
  },
  "Trigger clear button": {
    "delegatesTo": {
      "owner": "component:Field",
      "target": "input-clear-button"
    }
  },
  "Status icon": {
    "delegatesTo": {"owner": "component:Icon", "target": "icon"}
  },
  "Indicator icon": {"target": "selector-indicator-icon"},
  "Search row": {"target": "selector-search"},
  "Search icon": {
    "delegatesTo": {"owner": "component:Icon", "target": "icon"}
  },
  "Search clear button": {
    "delegatesTo": {
      "owner": "component:Field",
      "target": "input-clear-button"
    }
  },
  "Option row": {"target": "selector-option-row"},
  "SelectorOption-rendered content": {"target": "selector-option"},
  "Bare caller-rendered option content": {
    "none": {
      "reason": "intentional: Bare custom renderOption content is caller-owned and does not receive the SelectorOption target."
    }
  },
  "Option selection indicator": {"target": "selector-check"},
  "Option divider": {
    "delegatesTo": {"owner": "component:Divider", "target": "divider"}
  },
  "Section heading": {"target": "selector-section-heading"},
  "Empty state": {"target": "selector-empty-state"},
  "Pointer popup": {"target": "selector-popup"},
  "Touch sheet heading": {
    "delegatesTo": {"owner": "component:Text", "target": "heading"}
  },
  "Touch sheet": {
    "delegatesTo": {
      "owner": "component:BottomSheet",
      "target": "bottom-sheet"
    }
  }
}
```

`Field` 是有条件的：独立的 Selector 会渲染它，而 InputGroup 拥有那层外围外壳。`Pointer popup` 与两个触控面板部件是同一面板内容的替代呈现方式，而非同时存在的解剖结构。由图标渲染的起始内容委托给 Icon；任意的 `ReactNode` 起始内容归调用方所有。默认渲染器与返回 `SelectorOption` 的自定义 `renderOption` 函数保留其目标；只有裸的调用方渲染选项内容留在该目标之外，而带目标的选项行仍然保留。`input-clear-icon` 是清除图标共享的规范目标。

此图只记录已发布的可达性。它不把 `spec:AST-001` 中已接受但尚未实现的选项来源行为视为当前运行时行为。`spec:AST-004` 管辖 FR3 中已发布的指示器空间行为，且不新增主题目标。

## Family and system relationships

- frontmatter 中当前的架构链接拥有 Selector 所使用的公共 API、主题、图标解析、交互模态与 Layer 行为。
- `spec:AST-004/DEC-1` 拥有 FR3 中已发布的指示器空间行为。
- `spec:AST-011/DEC-1` 拥有新增的只读状态：调用方拥有的策略可以在不暴露选择控件的情况下保留可聚焦、可提交的值。
- `family:input-fields` 拥有家族范围的状态展示、行为、外观、尺寸、尾部控件、禁用原因与状态位置策略。Selector 保留其 DEC-1 的独立行内尺寸例外；本组件契约拥有该边界内的选择行为。
- `module:DropdownMenu/useMenuPress` 拥有 FR7 采用的列表框按压模型（释放即选择、高亮跟随指针、外部释放的区分、杂散点击吞没）；Selector 保留方向键夹取与其组合框焦点（模块 AR2）。

## Verification map

| 契约                               | 验证                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 代表性状态                                                                                                                                               | 变更或失败预期                                                                                                                                                                            | 审计章节                         |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| FR1, AR2, AR3                      | `Selector.test.tsx` 的选择、焦点与键盘测试套件，包括 “leaves focus on the field a press moved it to” 与 “returns focus to the trigger when the press lands on nothing focusable”                                                                                                                                                                                                                                                                                                                                                   | 关闭/打开、搜索/非搜索、禁用选项                                                                                                                         | 移除选择接线、焦点移动或键盘行为会使所列的交互测试失败                                                                                                                                    | `audit:Selector/behavior`        |
| FR2                                | 放置位置与选中项几何测试；`SelectorKeyboardInset.a11y.chromium.spec.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 默认、显式指定、RTL、变换过的入口、键盘弹起                                                                                                              | 使用错误的定位模型会使预期的 position-area 或 margin 检查失败                                                                                                                             | `audit:Selector/behavior`        |
| FR3, AV1                           | `Selector.test.tsx` 中聚焦的 computed-display 检查，加上受守卫的 Chromium Storybook 矩阵与稳定的视觉故事                                                                                                                                                                                                                                                                                                                                                                                                                           | popover/底部面板、窄/宽、start/end、LTR/RTL、选中/未选中、勾选/单选                                                                                      | 空输出仍预留宽度、可见输出被折叠、逻辑放置位置错误翻转，或行内容溢出                                                                                                                      | `audit:Selector/design-rendered` |
| FR4, AR1, AR2                      | 呈现测试，加上 `aria-haspopup` 的源码审查                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 指针、紧凑粗指针、搜索/非搜索                                                                                                                            | 错误的 Popover/对话框角色或焦点目标会使测试失败；`aria-haspopup` 取值需要源码/无障碍审查                                                                                                  | `audit:Selector/accessibility`   |
| AR1, AV2                           | `Selector.listbox.a11y.test.tsx` 与 `Listbox.a11y.chromium.spec.ts` 依据共享的 Listbox 契约；列表框名称由 `SelectorListboxName.a11y.chromium.spec.ts` 与 `Selector.test.tsx` 的 “names the listbox with the field label, not the trigger that shows the value” 覆盖；按钮触发器的名称由 `Selector.test.tsx` 的 “Selector with hasSearch: the closed trigger names the selection” 覆盖；无障碍树由 `SelectorListboxName.a11y.chromium.spec.ts` 的 “the closed searchable trigger is named by the label and the selected value” 覆盖 | 弹出层/面板、平铺/分组、选中/未选中、禁用、搜索、加载、自定义 RTL                                                                                        | 新增或更大范围地丢失角色、列表框/选项名称、状态或归属关系即触发校验拦截                                                                                                                   | `audit:Selector/accessibility`   |
| FR5, FR6, AR1, AR2 (anchored), AR4 | `Selector.combobox.a11y.test.tsx` 与 `Selector.combobox.a11y.chromium.spec.ts` 依据共享的 Combobox 契约                                                                                                                                                                                                                                                                                                                                                                                                                            | 关闭、以活动选项打开、只读、忙碌、底部面板打开、带活动选项的搜索输入                                                                                     | 触发器或搜索输入丢失其角色/名称/状态或弹出层类型，其打开的弹出层或活动选项关系被破坏，或只读状态暴露了选择表面；底部面板触发器的 `aria-controls` 指向内部列表框这一精确的已知债务保持不变 | `audit:Selector/accessibility`   |
| AR1（搜索时必填）                  | `Selector.searchRequired.test.tsx`；`SelectorListboxName.a11y.chromium.spec.ts`（Chromium 无障碍树：标签标记、必填表单默认值、调用方提供的 `aria-label`、一个 InputGroup）                                                                                                                                                                                                                                                                                                                                                         | 必填的搜索型 Selector 在关闭、打开、位于默认隐藏标记的表单内，以及只读等状态                                                                             | 在无角色的触发器上出现 `aria-required`、关闭的触发器不播报必填，或打开时的搜索组合框缺少该属性，均判定失败。                                                                              | `audit:Selector/accessibility`   |
| FR5                                | 加载、空状态与实时区域测试                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 空选项、无匹配搜索、加载中                                                                                                                               | 加载期间出现或播报空状态/无结果输出                                                                                                                                                       | `audit:Selector/behavior`        |
| FR6, AR4                           | 只读交互、表单、ARIA 与主题状态测试                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 搜索/非搜索、可清除、打开→只读、禁用优先级                                                                                                               | 值发生变更、弹出层或编辑可供性仍存在、表单值消失，或只读语义缺失                                                                                                                          | `audit:Selector/accessibility`   |
| FR7                                | `Selector.test.tsx` 的按压模型套件                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 手指在另一个选项上抬起、手指/鼠标在外部释放、列表框标记                                                                                                  | 按压的选项被选中、列表框取得焦点、手指在外部释放关闭了列表，或杂散点击触发选择                                                                                                            | `audit:Selector/behavior`        |
| FR8                                | `Selector.openHighlight.test.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 已选中、未选中、首个与末个选项禁用、选中选项被禁用、无已启用选项；ArrowDown、ArrowUp、Enter                                                              | 打开时高亮落在禁用选项上，或未落在已启用的选中选项上，均判定失败。                                                                                                                        | `audit:Selector/accessibility`   |
| FR9                                | `Selector.searchHighlight.test.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 方向键之后键入（ArrowDown 移到 Cherry，然后 `ap`）、键入后按 ArrowDown、唯一匹配项被禁用、搜索后重新打开                                                 | 高亮指向前一个列表中的选项、Enter 选中了用户未高亮的选项，或 ArrowDown 落在禁用选项上，均判定失败。                                                                                       | `audit:Selector/accessibility`   |
| FR10                               | `Selector.highlightFollowsValue.test.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 打开期间选项重排；选项作为新对象重新加载；被高亮的选项被移除（由后一个接替）；最后一个选项被移除（由前一个接替）；路径上有禁用选项；旧的选项已全部不存在 | 选项变化后高亮指向另一个选项、落在禁用选项上，或在旧的选项已全部不存在时仍然保留，均判定失败。                                                                                            | `audit:Selector/accessibility`   |
| AR5                                | `Selector.activeOption.test.tsx`：键盘输入后出现聚焦环、指针输入后不出现聚焦环、指针高亮之后跟随键盘输入时聚焦环重新出现；在浅色与深色模式下测量活动选项的指示器与列表框的对比                                                                                                                                                                                                                                                                                                                                                     | 键盘激活的选项、指针激活的选项                                                                                                                           | 移除聚焦环，或在指针输入后绘制它，均判定失败；任一模式下指示器与列表框的对比度低于 3:1 也判定失败（仅填充色在浅色下实测为 1.09:1，深色下为 1.15:1）                                       | `audit:Selector/accessibility`   |
| 源码构建契约                       | `Selector.source-build.test.mjs`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 由使用方 Babel 编译的包源码                                                                                                                              | 把求值后的 StyleX 值移到受支持的源码形式之外会导致编译失败                                                                                                                                | `audit:Selector/code-health`     |

## Decision log

FR3 实现由 `spec:AST-004/DEC-1` 拥有的系统决策。

### DEC-1 — Default presentation is `adaptive`

**Reference:** `component:Selector/DEC-1`

**Decider:** `cixzhang`, `2026-10-06`

省略 `presentation` 时解析为 `adaptive`（FR4）：在紧凑的粗指针屏幕上为模态底部面板，其他情况为锚定的弹出层，因此精细指针与大屏幕上的输出与 `popover` 一致。`adaptive` 依据 `spec:AST-094` FR13 解析：粗粒度的主指针加上 `spec:AST-012` FR9 的紧凑定义。已否决：继续把 `popover` 作为默认值，因为那样手机就会得到一个指针尺寸的锚定列表，除非调用方主动选用。

## Open questions

无。

## Content boundary

本文件不复制完整的 prop 参考、示例、当前审计评分、家族提案或未来的实现步骤。这些内容仍保留在其既有所有者处。
