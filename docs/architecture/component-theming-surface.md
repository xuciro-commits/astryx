---
schema_version: 1
template_version: 1
kind: architecture
id: architecture:component-theming-surface
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-24
owners: [cixzhang, imdreamrunner]
applies_to:
  [
    packages/core/src/,
    packages/lab/src/,
    packages/charts/src/,
    packages/richtext/src/,
    packages/core/src/utils/themeProps.ts,
    packages/core/src/theme/themingTargets.test.ts,
    packages/core/src/theme/extensibleAxes.test.ts,
    packages/core/src/theme/derivedVarRegistry.test.ts,
    docs/contributing/api-conventions.md,
    docs/templates/knowledge/component-spec.md,
    scripts/check-knowledge.mjs,
  ]
verified_by:
  [
    scripts/check-knowledge.mjs,
    packages/core/src/theme/themingTargets.test.ts,
    packages/core/src/theme/extensibleAxes.test.ts,
    packages/core/src/theme/derivedVarRegistry.test.ts,
  ]
deciding_specs:
  [
    spec:AST-012/DEC-2,
    spec:AST-012/DEC-3,
    spec:AST-012/DEC-5,
    spec:AST-017/DEC-1,
    spec:AST-017/DEC-26,
    spec:AST-087/DEC-9,
  ]
---

# Component theming surface

<!-- review-applicability:v1 -->

```json
{
  "scope": "global",
  "triggers": {
    "theming": [
      "INV3",
      "INV4",
      "INV5",
      "INV6",
      "INV7",
      "INV8",
      "INV9",
      "INV10",
      "INV12",
      "INV14",
      "INV15"
    ]
  }
}
```

本记录定义组件解剖结构与公共主题 API 之间的关系。

## Purpose

主题作者需要为它们可以设置样式的可见组件部件提供稳定的名称，而不把每个包装元素、插槽、状态或实现细节都暴露为永久选择器。

组件解剖结构是语义清单。主题表面是该清单的一份显式、受约束的投影——并非一对一的副本。

## System model

每个组件规格中的机器可读块把每个面向使用方的解剖结构条目映射到一项主题处置。该映射不包含在生成的使用方文档中：

1. **`target`** —— 此组件为该可见部件承诺一个稳定的公共目标，例如 `selector-popup`。
2. **`inherits`** —— 该部件没有独立目标。它使用此组件父目标的样式，例如 Button 标签继承自 `button`。
3. **`delegatesTo`** —— 另一个 Astryx 组件拥有该部件及其目标，例如 Selector 标签使用 `Field/field-label`。
4. **带分类理由的 `none`** —— 没有当前公共目标能到达这个稳定的解剖结构部件。必需的理由以一个且仅一个事实分类开头：
   - `intentional:` —— 一项已批准的边界使该部件当前不可主题化；
   - `reachability-gap:` —— 某个当前目标本应到达该部件，但并未到达；
   - `unsettled:` —— 是否或如何暴露该部件仍需要所有者决策。

`none` 记录的是当前可达性。它本身既不决定某部件必须保持不可主题化，也不授权未来的公共目标。

每个当前且未废弃的公共目标都映射到一个解剖结构条目或一个显式的家族所有者。使用方 `.doc.mjs` 文件仍然拥有解剖结构名称、描述与公共目标文档。组件规格拥有精确映射，并且只解释非显而易见的理由或例外。

视觉 prop 轴与状态是目标的选择器能力。它们不是独立的解剖结构部件，也不是独立的目标。运行时 `themeProps()` 反射、公共 `.doc.mjs` `theming.targets[].visualProps` / `states` 元数据，以及受检查的组件规格元数据都描述这些选择器轴，同时不向使用方暴露维护者处置；它们并不声明哪些 CSS 属性具有受保证的行为。

适配规则使用与根 `components` 相同的组件目标、轴、值域与扩展校验；它不会创建一套并行的组件值策略。内置值以及由权威开放原语域接受的值只能在一个规则内部设置样式，且不需要匹配的根样式声明。其有效性取决于主题登记的自定义值，在生效的根 `components` 映射上引入，这样构建工具才能生成无条件的模块增强；随后适配规则可以在条件下为该值重新设置样式。

共享的受保证属性目录如下：

| Category  | Exact authoring keys                                                                                                                                                                                            |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 绘制      | `color`, `backgroundColor`, `opacity`, `outlineColor`, `outlineOffset`, `outlineStyle`, `outlineWidth`, `boxShadow`, `textShadow`                                                                               |
| 边框/形状 | `borderColor`, `borderStyle`, `borderWidth`, `borderRadius`                                                                                                                                                     |
| 文字排版  | `fontFamily`, `fontSize`, `fontStyle`, `fontWeight`, `letterSpacing`, `lineHeight`, `textAlign`, `textDecorationColor`, `textDecorationLine`, `textDecorationStyle`, `textDecorationThickness`, `textTransform` |
| 内边距    | `padding`, `paddingBlock`, `paddingBlockStart`, `paddingBlockEnd`, `paddingInline`, `paddingInlineStart`, `paddingInlineEnd`                                                                                    |

初始目录包含七个已发布包主题所使用的每一个标准 CSS 键，但不含 `height`：`backgroundColor`、`borderColor`、`borderRadius`、`borderStyle`、`borderWidth`、`color`、`fontFamily`、`fontSize`、`fontWeight`、`lineHeight`、`padding`、`paddingBlock` 和 `paddingInline`。它补充了显式的绘制、文字排版与逻辑内边距键，使这些类别保持连贯。`height` 仍是特定目标的追加项，因为它会改变布局。

目录只是一套词汇，而不是对每个目标的自动保证。每个目标的 `guaranteedProperties` 列出它从此目录中支持的确切合例子集，以及任何确切受审查的特定目标追加项。省略意味着尽力而为；不需要任何例外条目。

这份清单是字面意义上的。列出某个简写并不蕴含其展开属性；列出某个逻辑属性并不蕴含其物理对应属性；列出一个属性也不蕴含诸如 `background`、`inlineSize` 或 `outline` 之类的别名。目录之外的属性——包括 `height`、`width`、`gap`、定位、溢出以及 grid/flex 结构——需要显式的目标追加项才能成为受保证属性。

每个声明的属性都必须在目标所拥有的解剖结构部件上产生合理且可观察的结果。通用组件样式设置可以接受其他 CSS 属性，但仅接受本身只是尽力而为，不是兼容性承诺。

## Boundaries and invariants

- **INV1 — 参与基于能力。** 核心组件参与。Lab 组件在主动选择加入公共组件主题化或准备好晋升之前豁免。到那时，它们必须提供与其他参与组件相同的目标、元数据、解剖结构处置与校验。仅消费语义令牌并不使组件登记。
- **INV2 — 解剖结构锚定公共目标。** 每个当前目标都代表一个稳定的语义部件，无论是在本地还是通过一个显式的家族所有者。
- **INV3 — 解剖结构并不蕴含目标增殖。** 每个参与的解剖结构条目都有一项组件规格映射，但继承、委托与符合事实的 `none` 都是有效结果。`none` 的理由区分有意的当前边界、可达性缺口与尚未确定的未来暴露；它从不悄悄决定未来的可主题化。当桌面与触摸渲染不同部件或使用不同的主题所有者时，它们使用各自独立的解剖结构行。这些行描述的是互斥的替代方案，除了在呈现方式切换期间的那一份瞬时副本之外，它们从不一起挂载，并且两者都遵循 `architecture:component-style-authoring` INV7 的最小构造。
- **INV4 — 目标负责绘制。** 目标应当落在一个稳定的可见元素上，该元素绘制由主题控制的输出——而不是事件包装器、推测性的内部结构，或仅为布局管道而创建的节点。
- **INV5 — 组合保留所有权。** 由共享 Astryx 原语渲染的部件委托给该原语的目标，除非父级保证了一份不同的公共视觉契约。
- **INV6 — 状态留在拥有它的目标上。** 变体、尺寸、选中、禁用与交互状态通过 `themeProps` 反映为目标能力；它们不会仅为每个状态创建并行目标。图形资源请求（例如 `Icon.variant`）选择的是所提供的图形资源而非样式，因此不被反映。
- **INV7 — 保证使用单一目录与精确的目标声明。** 共享目录定义受支持的词汇，而不是自动的目标承诺。每个目标的 `guaranteedProperties` 列出它所保证的合理目录子集，以及任何受审查的特定目标追加项。列出的每个属性都必须在所拥有的解剖结构部件上产生可观察的结果，并附有代表性的编译期与运行时证据。
- **INV8 — 名称除自身之外不蕴含任何东西。** 除非某个简写、展开属性、逻辑/物理对应属性、别名或自定义属性的确切编写键出现在该目标的声明中，否则它不受保证。省略的属性保持尽力而为；不需要任何例外机制。
- **INV9 — 通用样式设置属于尽力而为。** 目标可能通过通用样式管道接受其声明保证集之外的 CSS 属性。这种接受并不承诺产生有用的效果，也不承诺跨版本兼容。
- **INV10 — 公共语义变量是被准许的，而非被推断的。** 当没有任何受保证的 CSS 属性能够表达调用方自有的需求时，组件可以暴露一个经审查的公共自定义属性，它要具有基于用途的含义、稳定的默认值或回退值、已定义的目标/状态范围、使用方文档以及兼容性覆盖。它必须通过 `architecture:public-component-api` 中的准入标准；实现缺口不会自动成为新变量的正当理由。
- **INV11 — 私有展开保持私有。** 编译器可以把一个受保证的公共属性转换成一个或多个私有 `--_*` 变量，以便拥有该属性的组件能在其内部绘制器之间路由、组合或转换该值。按照契约，使用方不得直接编写或依赖这些变量。精确映射保留在受检查的代码/元数据中，而不是复制到正文里；已知的执行缺口记录在 `architecture:theme-compilation` 中。
- **INV12 — 别名属于兼容性，而非解剖结构。** 已移除的目标别名不计为当前语义部件。从 0.7.0 起，运行时目标输出、组件元数据、CLI 发现、主题构建与生成的文档都只暴露规范目标。受维护的主题、CLI 模板与可复制示例使用规范键。这个破坏性版本在 `spec:AST-017` 下保留下方完整的旧到新映射与迁移路径。
- **INV13 — 家族所有权是显式的。** 家族文档可以为多个组件拥有一个共享目标，但本地文档应链接到该所有者，而不是把所有权留给推断。
- **INV14 — 可扩展轴需要与主题无关的回退。** 只有当某个 prop 轴是视觉性的，并且某个不可用的自定义值存在一个不依赖当前主题的安全、确定性的基线时，该轴才可以主题扩展。`Heading.type` 符合条件，因为必需的 `Heading.level` 提供了该基线。`Icon.variant` 符合条件，因为未列出的变体在渲染请求时不带变体，这对每个主题都相同。它是图形资源请求，而非样式选择器：`icon` 目标不反映它，因此它没有 `themeProps()` 反射、没有 `visualProps` 条目，也没有组件样式映射。`Icon.size` 不符合：缺失的自定义尺寸无法在不悄悄改变几何、对齐或组合的情况下被推断。行为、结构、放置、方向与状态机轴无论何种情况都保持关闭。主题可以在关闭的轴上重新定义已有值，但不得新增值。
- **INV15 — 条件样式并不产生条件 API。** 适配组件写入使用与根组件写入相同的共享校验。规则可以为一个独立有效的内置值或开放原语值设置样式，而无需在根 `components` 中重复该目标或值。仅通过主题登记才变得有效的自定义值，必须在规则使用它之前登记到生效的根表面上，这样生成的类型就永远不会依赖媒体条件。未解析的共享校验结果会原样带入适配，并在共享契约成为权威时自动收紧；它不是永久的适配豁免，也不是扩展点。

## Approved deprecated-surface removal

版本 **0.7.0** 移除本节中已废弃的组件主题化兼容表面。这是 `spec:AST-017` 下的破坏性变更；该版本包含精确的旧到新映射以及分阶段的迁移 codemod。

已批准的目标别名映射如下：

| Deprecated target             | Canonical target         |
| ----------------------------- | ------------------------ |
| `base-table`                  | `table`                  |
| `checkbox`                    | `checkbox-indicator`     |
| `codeblock`                   | `code-block`             |
| `codeblock-copy-button`       | `code-block-copy-button` |
| `codeblock-header`            | `code-block-header`      |
| `codeblock-title`             | `code-block-title`       |
| `date-input-clear-icon`       | `input-clear-icon`       |
| `date-range-input-clear-icon` | `input-clear-icon`       |
| `hovercard`                   | `hover-card`             |
| `multi-selector-clear-icon`   | `input-clear-icon`       |
| `navicon`                     | `nav-icon`               |
| `popover-surface`             | `popover`                |
| `progressbar`                 | `progress-bar`           |
| `progressbar-fill`            | `progress-bar-fill`      |
| `progressbar-mark`            | `progress-bar-mark`      |
| `progressbar-track`           | `progress-bar-track`     |
| `radio`                       | `radio-indicator`        |
| `radio-dot`                   | `radio-indicator-dot`    |
| `selector-clear-icon`         | `input-clear-icon`       |
| `statusdot`                   | `status-dot`             |
| `textarea`                    | `text-area`              |

0.7.0 的移除还会删除仅用于这些别名的兼容机制：`themeProps(..., {legacyNames})` 选项、`ThemePropsOptions.legacyNames`、`ComponentThemingTarget.deprecatedFor`，以及仅针对别名的过滤或发现行为。

诸如 `.primary`、`.sm` 与 `.checked` 这样已废弃的裸 prop/值与状态选择器类不再输出。它们稳定的替代方案是规范的 `astryx-*` 目标加上其显式反映的 `data-*` 属性。语义化的 `defineTheme({components})` 键仍然受支持；只有上表中的 21 个已废弃目标拼写会迁移到其规范键。由于未限定的裸类无法标识其 prop/状态轴，且可能由使用方编写，codemod 会把它留给人工审查。

规范目标名称、语义化组件键、反映的 `data-*` 选择器以及当前目标行为不在本次移除授权之内，仍然受支持。内置主题与生成的主题必须在别名消失之前迁移到规范目标。静态内联主题键会获得受支持的迁移；动态主题对象与自定义 CSS 则获得上方完整映射。

本记录不拥有语义令牌定义、主题编写优先级、主题如何成为输出，或组件外观的设计理由。

### DEP-0013 — Deprecate the 21 component-theming target aliases

| Field            | Value                                                                                                                                                                                                                                                                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id               | `DEP-0013`                                                                                                                                                                                                                                                                                                                          |
| cleanup          | `CLN-0022`                                                                                                                                                                                                                                                                                                                          |
| package          | `@astryxdesign/core`, `@astryxdesign/cli`                                                                                                                                                                                                                                                                                           |
| surface          | 主题目标名称：上表映射中的 21 个别名，作为 `defineTheme({components})` 键以及 `.astryx-<alias>` CSS 类，再加上只为它们而存在的机制：`themeProps(..., {legacyNames})`、`ThemePropsOptions.legacyNames`、`ComponentThemingTarget.deprecatedFor`，以及仅针对别名的发现与过滤                                                           |
| old contract     | 每个别名与它的规范目标一起输出在同一元素上，被主题构建接受，并由 CLI 发现列出                                                                                                                                                                                                                                                       |
| replacement      | 上表映射中的规范目标，同时作为主题键与 CSS 类                                                                                                                                                                                                                                                                                       |
| direct authority | `architecture:component-theming-surface` INV12 与本节。所有者：`cixzhang`、`imdreamrunner`                                                                                                                                                                                                                                          |
| warning          | 主题构建会警告 `Deprecated component target "<alias>". Use "<canonical>" instead.`；CLI 发现会为每个别名标注其替代项                                                                                                                                                                                                                |
| migration        | 运行 `astryx upgrade --from <0.6 version> --apply --path .`；审查它添加的每个 `TODO(astryx upgrade)`                                                                                                                                                                                                                                |
| codemod          | `migrate-deprecated-theme-surface`：重命名主题 `components` 映射中的静态键以及 CSS 中的别名类。当旧键与规范键共存时，它会添加一个 TODO。四个 clear-icon 别名在 CSS 中借助 `:where(.astryx-<owner> *)` 保留其所有者作用域；主题键无法承载该作用域，因此 codemod 会添加一个 TODO。计算键与字符串内的 CSS 属于被报告的案例，不会被改写 |
| downstream       | 受维护的主题、CLI 模板与可复制示例只使用规范键；捆绑主题与探针主题构建时不使用任何别名                                                                                                                                                                                                                                              |
| transition       | `no prior transition`                                                                                                                                                                                                                                                                                                               |
| state            | `proposed`                                                                                                                                                                                                                                                                                                                          |
| target plan      | `CLN-0022` 于 0.7.0                                                                                                                                                                                                                                                                                                                 |

### CLN-0022 — Canonical theme targets only

| Field     | Value                                                                                                                                                                      |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id        | `CLN-0022`                                                                                                                                                                 |
| lifecycle | `DEP-0013`                                                                                                                                                                 |
| delta     | 组件停止输出 21 个别名类。主题构建把别名键视为未知组件，并建议使用规范键。CLI 发现与生成的文档只列出规范目标。`legacyNames`、`ThemePropsOptions` 与 `deprecatedFor` 被移除 |
| rollback  | 从最终的 0.6 基线恢复别名输出、元数据与发现                                                                                                                                |
| state     | `pending` —— 在一个已声明的次要版本中连同其 `[breaking]` Changeset 落地                                                                                                    |

### DEP-0014 — Deprecate bare prop and state classes

| Field            | Value                                                                                                                                                                                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| id               | `DEP-0014`                                                                                                                                                                                                                                                                     |
| cleanup          | `CLN-0023`                                                                                                                                                                                                                                                                     |
| package          | `@astryxdesign/core`                                                                                                                                                                                                                                                           |
| surface          | 渲染出的 CSS 类：每个带主题元素上每个视觉 prop 或状态值对应一个裸类（`.primary`、`.sm`、`.checked`；以数字开头的值保留其 prop 前缀，例如 `.level-2`），并在别名目标上重复                                                                                                      |
| old contract     | 用裸值类限定 Astryx 目标的选择器（例如 `.astryx-button.primary`）会匹配该 prop 或状态                                                                                                                                                                                          |
| replacement      | 规范目标加上其反映的 `data-*` 属性，例如 `.astryx-button[data-variant="primary"]`。主题 `components` 键保持不变                                                                                                                                                                |
| direct authority | `architecture:component-theming-surface` 与本节。所有者：`cixzhang`、`imdreamrunner`                                                                                                                                                                                           |
| warning          | 使用方文档把这些类标记为已废弃，并指出替代方案                                                                                                                                                                                                                                 |
| migration        | 运行 `astryx upgrade --from <0.6 version> --apply --path .`。仅当未限定的裸类针对 Astryx 时，才手动替换它们                                                                                                                                                                    |
| codemod          | `migrate-deprecated-theme-surface`：把 `.css` 文件中带目标限定的裸类改写为反映的 `data-*` 选择器，使用最终 0.6 版本输出的每一个裸类。当 Astryx 曾经输出的某个类在其限定的目标上没有已知含义时，它会添加一个 TODO。未限定的类无法被分类，因为裸类不指明其轴，且可能属于应用本身 |
| downstream       | 每个受维护主题生成的 CSS 都不含带目标限定的裸类；探针主题与视觉闸门只使用 `data-*` 选择器                                                                                                                                                                                      |
| transition       | `no prior transition`                                                                                                                                                                                                                                                          |
| state            | `proposed`                                                                                                                                                                                                                                                                     |
| target plan      | `CLN-0023` 于 0.7.0                                                                                                                                                                                                                                                            |

### CLN-0023 — Reflected attributes only

| Field     | Value                                                                               |
| --------- | ----------------------------------------------------------------------------------- |
| id        | `CLN-0023`                                                                          |
| lifecycle | `DEP-0014`                                                                          |
| delta     | `themeProps()` 输出一个规范目标类与反映的 `data-*` 属性；不渲染任何裸 prop 或状态类 |
| rollback  | 从最终的 0.6 基线恢复裸类输出                                                       |
| state     | `pending` —— 在一个已声明的次要版本中连同其 `[breaking]` Changeset 落地             |

## Change coupling

- 新增或重命名 `themeProps()` 目标会一并更新其组件规格映射、`.doc.mjs` 公共目标元数据、生成/CLI 发现与校验。可复制示例与受维护主题使用规范键。
- 0.7.0 的废弃表面移除保留每个规范目标与语义键，先迁移内置/生成的主题，并提供上文所述的确切别名与裸选择器迁移证据。
- 新增使用方解剖结构需要一份有意的组件规格映射，指向目标、继承、委托或符合事实的 `none`。它不会自动创建 CSS API。`none` 条目把当前状态分类为 `intentional`、`reachability-gap` 或 `unsettled`；改变可达性会更新该映射，而未来的暴露仍遵循常规的公共目标审查。
- 把某个 prop 轴向主题定义的值开放，需要对该轴分类，并在拥有的组件契约或主管的系统规格中记录其无匹配回退。审查需要证明该轴是视觉性的、回退是安全且与主题无关的，并且每个不合格的轴保持关闭。一个聚焦的组件测试会覆盖在没有匹配的活动主题规则时的自定义值。`extensibleAxes.test.ts` 只检查结构性接线：公共映射、`themeProps()` 反射与使用方元数据。图形资源轴保留公共映射检查，因为它的映射正是主题构建所增强的那一个，但它没有样式接线：守卫通过一份显式的图形资源请求映射清单（当前是 `IconVariantMap`）仅豁免其 `themeProps()` 反射与 `visualProps` 检查。它的聚焦回退测试会渲染一个未列出的名称。
- 向目标的 `guaranteedProperties` 添加属性，会记录其用途与范围，证明在拥有的解剖结构部件上产生合理可观察的效果，并补充代表性的编译期/运行时覆盖。仅属于目录成员并不会添加目标保证；目录之外的特定目标行为也通过同一份受审查声明被准许。常见的属性到变量行为属于主题编译。
- 添加公共语义自定义属性，首先要说明为什么没有受保证的 CSS 属性可以表达该需求，然后一并更新其组件契约、使用方文档、稳定回退/默认值、范围、运行时证据与兼容性覆盖。它不是对不受支持属性的默认回应。
- 把目标所有权移交给某个家族，会在同一次受审查的变更中更新每个成员的处置与链接。
- 把参与范围扩展到另一个包，首先要一致性守卫扩展到该包；缺少元数据的不完整公共目标是缺陷。

## Owning code

- 组件 `.doc.mjs` 的 `usage.anatomy[]` 拥有面向使用方的语义部件清单，且不包含主题处置或维护者理由。
- 组件 `.doc.mjs` 的 `theming.targets[]` 拥有可发现的规范公共目标及其视觉 prop/状态选择器轴。已移除的别名不出现在此元数据中，也不计为解剖结构。`visualProps` 不声明 CSS 属性支持。
- 已批准的属性目录由本记录拥有。一旦编写 schema 支持，目标 `guaranteedProperties` 声明将存放在组件 `.doc.mjs` 的 `theming.targets[]` 中；目前还没有机器可读字段。
- 组件 `.doc.mjs` 的 `theming.vars[]` 拥有已记录的自定义属性，并标记私有实现变量；`theming.derived[]` 记录受检查的公共属性展开元数据。
- 组件记录（`docs/specs/components/`）中的 `### Theming anatomy` 块拥有精确、机器可读的解剖结构到目标处置。它在迁移期间是可选的，会与使用方解剖结构对照检查，并被排除在生成的使用方文档之外。附近的组件规格正文拥有非显而易见的理由、例外与链接。
- 运行时 `themeProps()` 调用输出一个规范目标与反映的 `data-*` 状态/prop 选择器。
- CLI 发现与主题构建消费规范目标元数据；可复制示例省略已移除的别名。
- `scripts/check-knowledge.mjs`、`themingTargets.test.ts`、`extensibleAxes.test.ts` 与 `derivedVarRegistry.test.ts` 强制维护源码/元数据/生成产物之间的关系。`extensibleAxes.test.ts` 只证明结构一致性；组件契约、审查与聚焦的组件测试证明某个轴是否可以开放，以及它的回退是否安全。
- 当多个组件采用同一部件契约时，家族契约拥有共享目标语义。

## Deciding specs

- `spec:AST-012/DEC-2` 与 `spec:AST-012/DEC-3` 把适配组件写入约束到封闭的有序规则模型。`spec:AST-012/DEC-5` 使组件校验与根主题共享，并为有效性取决于主题登记的值保留生效根存在性。
- `spec:AST-087/DEC-9` 使 `Icon.variant` 成为一个主题可扩展轴，其名称由每个主题列出一次，其回退是不带变体的请求。
- `spec:AST-017/DEC-26` 用最小 DOM 构建组件；除那一份瞬时切换副本外，桌面与触摸行从不一起挂载（INV3）。
- `spec:AST-017/DEC-1` 拥有已发布的兼容性分类与迁移：移除兼容路径属于破坏性变更。本记录拥有确切的已废弃主题化群组及其已批准的 0.7.0 移除窗口。

## Verification

| Invariant    | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                 | Failure signal                                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| INV1         | 跨包目标/文档清单                                                                                                                                                                                                                                                                                                                                                                                                        | 参与包中导出的目标对元数据或 CLI 校验不可见                                                                                                        |
| INV2, INV3   | 双向的解剖结构处置/目标检查                                                                                                                                                                                                                                                                                                                                                                                              | 一个当前目标没有语义部件所有者、解剖结构机械地创建目标，或 `none` 悄悄变成未来政策；或者在呈现方式切换的那份瞬时副本之外，桌面与触摸两行被同时挂载 |
| INV4, INV5   | 组件审查加上渲染后的 DOM 检查                                                                                                                                                                                                                                                                                                                                                                                            | 公共目标落在不绘制的管道上，或者在没有独立语义的情况下把某个子原语别名化                                                                           |
| INV6         | `themingTargets.test.ts` 与 `extensibleAxes.test.ts`；视觉闸门的探针主题为每个声明的目标、每个声明的状态，以及每个反映式 prop 的每个枚举值分别赋予自己的探针颜色，因此一次捕获就能显示哪个条目最后绘制了每个元素；同一目标上的多个条目设置同样的四个颜色属性，因此捕获证明的是获胜条目到达了该元素，而不是它下面的每个条目；它无法枚举的 prop 会被报告为未探测（`.github/scripts/visual-gate/generate-probe-theme.mjs`） | 状态/变体对所属目标不可见，或者变成不必要的并行目标                                                                                                |
| INV7, INV8   | 现有属性测试夹具（部分；缺口见下文）                                                                                                                                                                                                                                                                                                                                                                                     | 一个声明的属性缺少证据，或者一个未列出的对应属性被当作隐含保证                                                                                     |
| INV9         | API 文档与兼容性审查                                                                                                                                                                                                                                                                                                                                                                                                     | 通用属性接受被呈现为一项受支持的兼容性承诺                                                                                                         |
| INV10, INV11 | 现有的注册表/公共变量/运行时测试（部分；缺口见下文）                                                                                                                                                                                                                                                                                                                                                                     | 公共语义变量绕过准入，或者使用方必须编写私有变量才能达到承诺的行为                                                                                 |
| INV12, INV13 | 仅规范目标的运行时输出与发现、已移除别名的拒绝、完整的 codemod 映射/测试、规范维护主题/模板清单，以及家族所有者测试夹具                                                                                                                                                                                                                                                                                                  | 一个已移除的别名被输出或被发现、迁移映射不完整、规范目标发生变化、已移除的兼容性元数据残留，或者所有权仍然隐含                                     |
| INV14        | 组件契约、所有者审查、聚焦的无匹配回退测试，以及带显式图形资源轴豁免清单的结构性 `extensibleAxes.test.ts` 覆盖                                                                                                                                                                                                                                                                                                           | 一个不合格的轴被开放、一条缺失的规则以不可预测的方式改变行为、映射/反射/文档接线发生漂移，或者图形资源轴获得反射或失去其豁免                       |
| INV15        | 共享的根/适配组件校验测试夹具，覆盖有限、开放、已登记与未解析的值域                                                                                                                                                                                                                                                                                                                                                      | 根与适配不一致、一个有效的开放值需要根样式、一条规则有条件地登记自定义值，或者未解析的行为变成适配专属                                             |

已知的符合性与验证缺口：

- 组件校验仍有未解析的值域，而共享契约仍不完整。根表面与适配表面携带相同的结果与诊断；这是共享的校验债务，而不是适配专属的例外或 API 准入。当共享契约成为权威时，两个表面会自动收紧。各自独立有效的内置值与开放原语值不需要匹配的根样式声明。

- 组件 schema 没有机器可读的轴分类或回退字段。因此 `extensibleAxes.test.ts` 只检查结构一致性；它无法推断某个轴是否为视觉性的，或其回退在语义上是否安全。组件契约或主管的系统规格、所有者审查，以及聚焦的回退测试提供该证据，而不把结构守卫当作准入政策。
- 现有的基于映射的轴尚未全部按 INV14 审计。`Pagination.variant` 与 `Banner.container` 是已知的开放结构轴，在其词汇表关闭之前仍是一致性缺口。通过结构守卫并不能使它们有资格扩展。
- 共享目录已获批准，但组件文档编写 schema 没有 `guaranteedProperties` 字段。后续工作必须添加该确切名称字段，用其合理目录子集与经审查的追加项迁移每个当前目标，把声明暴露给发现机制，并拒绝未知或隐含的名称。在该迁移落地之前，目录不会自动保证任何目标上的任何属性。
- CI 尚未要求为每个声明的目标/属性对提供有代表性的编译器与运行时证据。后续工作必须让缺失的输出路径证据或可观察的运行时证据使校验失败；对布局敏感的追加项还需要内部耦合与方向性证据。
- 运行时/构建期的私有变量拒绝，以及媒体表面的派生展开，是各自独立的编译器符合性缺口，由 `architecture:theme-compilation` 拥有并规定。
- 探针主题只覆盖 Core 目标（例如 `rich-text-editor` 没有探针条目）。它只从目标组件所指文档的顶层 `props` 中解析反映式 prop 的值，因此记录在别处的 prop（例如在另一份文档上或某个子组件下）不会被探测；这解释了生成器报告为跳过的 83 个 prop 中的 76 个（例如 `button-group.size`、`avatar-status-dot.variant`）。其余 7 个的类型没有可枚举的字符串值，例如数字型的 `gap` 刻度或 `string | CodeLanguage`。每个条目也设置同样的四个颜色属性，因此后应用到同一元素上的条目会覆盖较早条目的绘制（在 Button 上，`elevation` 覆盖 base、`size` 与 `variant`）。

### Migration work from the 2026-08-30 audit

- 四十三个参与的 Core 组件文档没有解剖结构清单。
- 若干解剖结构文档依赖父级/家族拥有的目标，却没有显式的所有者链接。
- Lab 组件在声明公共主题化或准备晋升之前保持豁免。现有的晋升守卫会检查参与其中的 Lab 组件。

在使双向校验成为强制要求之前，回填组件规格映射与 Core 解剖结构。审计清单是迁移证据，而非政策。
