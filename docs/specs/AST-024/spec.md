---
schema_version: 4
template_version: 1
kind: system-spec
id: spec:AST-024
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-09-04
phase: accepted
owners: [rubyycheung]
affects_architecture: [architecture:theme-authoring-contract]
affects_families: []
affects_contributing: []
affects_consumer_docs: [theme, typography]
---

# Theme-extensible Heading visual roles system spec

## Intent

产品主题有时需要在 Astryx 内置的三个 display 视觉角色之外，再提供具名的标题处理方式。一个主题可能需要 hero 样式、紧凑的分节标题，或其他本地命名的视觉角色，同时仍渲染正确的 `h1`–`h6` 元素。作者也可能需要在不创建新视觉角色的情况下，更改某一处 Heading 用法中的字重。

Astryx 已支持主题定义的 `Text` 类型，并在 `astryx theme build` 期间生成对应的 TypeScript 增强。`Heading` 没有提供同样的扩展点：它的 `type` 是封闭联合类型，也没有 `weight` prop。本规格让 Heading 的视觉角色可被主题扩展，使文档语义独立于外观，并为生成的类型主题 CSS 与生成的类型提供一份可靠的契约。

## Non-goals

- 不把产品特定的标题名称加入 Astryx 在每个主题中都提供的选项中。
- 不从视觉类型名称或字号推断 `h1`–`h6` 层级。
- 不允许视觉样式修复不正确的文档大纲。
- 不在没有主题声明或本地来源的情况下新增任意 Heading 尺寸。
- 不替换 `Text`、排版令牌或现有的字号阶梯生成器。
- 不定义额外排版值的计算方式；主题本地的字号阶梯扩展编写仍属于单独的提案。
- 不在本次变更中扩大每个主题可用的字重选项。

## Terms

- **Semantic level:** `Heading.level` 的值，用于选择 `h1`–`h6` 以及该元素在文档大纲中的位置。
- **Visual type:** 一种具名处理方式，控制字号、行高、字体系列、字重或其他经批准的视觉属性，而不改变语义层级。
- **Built-in type:** `display-1`、`display-2` 或 `display-3`。
- **Custom type:** 由主题拥有、通过 Heading 组件覆盖声明的视觉类型，并通过可增强的映射暴露给 TypeScript。
- **Weight override:** 为某一次渲染的标题显式指定的 `Heading.weight` 值；它优先于视觉类型或语义层级的默认值，且不改变其中任何一方。

## Current limitation

`HeadingType` 目前是封闭字面量联合 `'display-1' | 'display-2' | 'display-3'`。TypeScript 模块增强无法拓宽类型别名。因此，主题构建器在生成 `.variants.d.ts` 时会跳过诸如 `heading['type:hero']` 的主题规则；输出一个新的、无关的接口也不会改变 `HeadingProps.type`。

浏览器可以匹配生成的 `data-type="hero"` 选择器，但应用源码无法在不产生类型错误的情况下传入 `type="hero"`。若绕过该错误，Heading 对该名称也没有已定义的基线 StyleX 条目。因此，当前系统允许出现公共组件 API 无法安全使用的 CSS。

## Requirements

### Extensible visual types

- **FR1 — Heading 暴露真正的增强点。** 公共 Heading 子路径 MUST 导出一个接口，其键构成 `HeadingType` 的自定义部分。内置类型无需增强即可使用。生成的声明 MUST 拓宽 `HeadingProps.type` 所使用的同一个接口；仅针对桶导出或未被使用的接口生成的声明是无效的。
- **FR2 — 主题构建登记已声明的自定义类型。** 当主题包含自定义 `heading['type:<name>']` 覆盖时，`astryx theme build` MUST 输出对应的类型增强，并在生成的类型主题声明中引用它。若该增强无法生成或加载，构建 MUST 以可操作的指引失败，而不是输出类型化源码无法使用的 CSS。
- **FR3 — 自定义类型由主题拥有，但 TypeScript 可用性是程序级的。** 使用方导入拥有该类型的主题生成的声明后，自定义名称才变得类型安全。TypeScript 模块增强作用于整个编译过程，因此它无法证明某个调用点上有匹配的 Theme 处于活动状态。文档 MUST 说明这一区别。对于未导入它的应用，自定义名称 MUST NOT 扩大 Heading 的内置类型集合。
- **FR4 — 运行时样式是确定性的。** 有效的自定义类型 MUST 通过与内置类型相同的主题选择器路径反映其名称。在主题 CSS 生效之前，它 MUST 保留所选语义层级的安全基线，而不是变成无样式或继承无关的环境字号。若应用源码在未定义该名称的主题下使用已导入的自定义名称，则应用安全基线。当开发工具能确定活动主题并识别出不匹配时，SHOULD 发出警告，且不增加生产运行时开销。
- **FR5 — 部分自定义类型是有效的。** 自定义 Heading 类型 MUST 包含至少一个有意义的视觉声明。字号、行高、字体系列、字重、字距、颜色及其他受支持的属性 MAY 被独立更改；省略的属性继承自所选语义层级的基线。空或完全无效的自定义类型在输出前即失败。
- **FR6 — 现有类型不变。** 未声明任何自定义 Heading 类型的主题 MUST 保留其当前类型、运行时输出和生成的产物。现有的 `display-1` 到 `display-3` 行为保持兼容。

### Per-use weight

- **FR7 — Heading 接受可选的按次字重覆盖。** `Heading` MUST 接受与 `Text` 相同的具名 `TextWeight` 值：`normal`、`medium`、`semibold` 和 `bold`。省略时，保留当前由层级或类型导出的默认值。
- **FR8 — 显式字重有明确的优先级。** 提供的 `weight` prop MUST 优先于内置或自定义视觉类型的默认字重。它 MUST NOT 改变 `level`、`accessibilityLevel` 或所选 HTML 元素。Heading MUST 通过其主题目标反映所选字重，且输出的层叠 MUST 保证该顺序与编写规则的顺序无关：显式字重，然后是视觉类型默认值，然后是语义层级默认值。
- **FR9 — 主题值保持权威。** 具名字重 prop 通过现有的字重令牌解析，因此主题可以更改 `bold` 或 `semibold` 的含义而不改动组件源码。第一版不会把原始数字或任意字重字符串加入组件 prop。

### Semantics and author guidance

- **FR10 — 层级与类型保持独立。** 每个自定义类型示例 MUST 包含显式的语义 `level`。工具和文档 MUST NOT 从 `hero`、`title` 或 `display` 等名称推断层级。
- **FR11 — 视觉复用不构成跳过层级的理由。** 指引 MUST 告诉作者先从文档大纲选择标题层级，再选择视觉类型。它 MUST NOT 建议仅仅为了获得不同字号而更改 `level`。
- **FR12 — 非标题文本继续使用 Text。** 若内容不是分节或页面标题，编写指引 MUST 使用 `Text`，即使想要相同的视觉处理方式。共享的视觉名称 MAY 为两个组件分别声明，但不会使非标题内容具备语义。

### Verification and generated artifacts

- **FR13 — 源码、运行时与构建一致。** 自定义 Heading 类型 MUST 通过 TypeScript 检查、渲染所请求的 `h1`–`h6`、暴露其 `data-type`、接收生成的声明，并在运行时注入和静态构建两种主题模式下计算预期的 CSS。
- **FR14 — 缺失声明会显式失败。** 使用自定义类型却未导入拥有该类型的主题声明的使用方 MUST 收到 TypeScript 错误。文档 MUST 展示所需的主题产物导入，并说明导入它无法证明运行时哪个 Theme 处于活动状态。
- **FR15 — 无障碍行为不变。** 添加视觉类型或字重 MUST NOT 改变无障碍名称、标题角色、语义层级、截断行为或 `aria-level` 处理。现有的 Heading 无障碍测试仍然适用。

## Accepted API

```ts
// Excerpt from @astryxdesign/core/Heading
export interface HeadingTypeMap {
  'display-1': true;
  'display-2': true;
  'display-3': true;
}

export type HeadingType = keyof HeadingTypeMap;

export interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  type?: HeadingType;
  weight?: TextWeight;
}
```

主题随后可以声明并构建一个本地角色：

```ts
defineTheme({
  name: 'product',
  localTokens: {
    '--astryx-theme-product-text-hero-size': '4.5rem',
    '--astryx-theme-product-text-hero-leading': '1.05',
  },
  components: {
    heading: {
      'type:hero': {
        fontSize: 'var(--astryx-theme-product-text-hero-size)',
        lineHeight: 'var(--astryx-theme-product-text-hero-leading)',
      },
    },
  },
});
```

导入构建好的主题产物后，应用源码可以使用该视觉角色而不改变其语义层级：

```tsx
<Heading level={1} type="hero">
  Product overview
</Heading>

<Heading level={2} type="hero" weight="bold">
  Featured report
</Heading>
```

## Current-state impact

已接受的规格本身不改变任何运行时或公共 API。其实现将用基于映射的公共联合替换 Heading 的封闭类型别名，教主题构建器增强该映射，为自定义类型提供语义层级基线，并把现有的具名字重词汇加入 `HeadingProps`。

仅使用三个内置 display 类型的主题和应用无需迁移。已经输出 `heading['type:<custom>']` CSS 的主题目前有一个无法使用的类型化选择器；在实现并重新构建之后，其生成的声明将使该现有本地名称对导入该主题产物的使用方可用。该增强在该 TypeScript 程序内处处可用，而自定义样式仍由活动主题拥有。没有任何自定义名称会成为每个 Astryx 应用都必须支持的选项。

## Verification

| Contract  | Verification                                            | Representative failure                                                                     |
| --------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| FR1–FR3   | 公共子路径增强与生成声明的类型测试                      | CSS 构建通过但 `type="hero"` 仍然报错，或文档声称 TypeScript 知道哪个 Theme 处于活动状态。 |
| FR4–FR6   | Heading 单元测试与前后 CSS 快照                         | 自定义类型丢失其层级基线、一处有意为之的部分角色失败，或内置主题改变输出。                 |
| FR7–FR9   | 针对层级、内置类型和自定义类型的字重目标与层叠测试      | `weight="bold"` 输给类型默认值、依赖编写规则的顺序，或绕过主题字重令牌。                   |
| FR10–FR12 | 文档与编写测试夹具                                      | 工具从 `hero` 推断 `h1`、为字号跳过层级，或把 Heading 用于非标题文案。                     |
| FR13–FR15 | 使用方类型检查、运行时/静态构建一致性、DOM 与无障碍测试 | 构建产物未被加载、选择器因构建路径而异，或视觉 prop 改变标题语义。                         |

### Completion criteria

本规格只有在以下条件满足时，才从 `accepted` 迁移到 `shipped`：

- Heading 暴露并消费一个公共可增强的类型映射；
- 主题构建输出并加载自定义 Heading 类型声明；
- 自定义类型具有安全的语义层级基线和至少一个有效的视觉声明；
- Heading 以文档化的优先级接受现有的具名字重值；
- 显式字重通过运行时与构建主题层叠胜出，与编写规则的顺序无关；
- 运行时和静态主题构建产生等价的自定义类型样式；
- 内置 Heading 行为以及未使用自定义类型的主题保持不变；以及
- 示例和测试保持语义层级独立于视觉处理方式。

## Open questions

无。

## Decision log

### DEC-1 — Make Heading type extensible through a public map

**Reference:** `spec:AST-024/DEC-1`

**Decider:** `rubyycheung`, `2026-09-04`

使用与其他可扩展组件 prop 相同的、已被验证的基于映射的模块增强模型。封闭类型别名无法被拓宽，而生成一个无关的接口会错误地暗示类型安全，却不改变 `HeadingProps`。

### DEC-2 — Keep semantic level separate from visual type

**Reference:** `spec:AST-024/DEC-2`

**Decider:** `rubyycheung`, `2026-09-04`

自定义名称仅控制外观。作者继续从文档结构选择 `level`。这使得同一视觉角色可以在不同的有效层级使用，而不把排版与无障碍语义耦合。

### DEC-3 — Add weight parity with Text

**Reference:** `spec:AST-024/DEC-3`

**Decider:** `rubyycheung`, `2026-09-04`

把现有的具名 `TextWeight` 词汇加入 Heading，并让显式 prop 覆盖类型或层级默认值。在首次变更中不要新增第二套字重词汇或原始数字值。

### DEC-4 — Enroll visual roles independently by component

**Reference:** `spec:AST-024/DEC-4`

**Decider:** `rubyycheung`, `2026-09-04`

一个视觉角色名称不会自动同时对 `Text` 和 `Heading` 可用。作者在他们打算使用的语义所在的每个组件上分别登记它。底层主题本地的排版值可以共享，编写工具可以提议一并创建两个映射，但必须展示并确认每一处使用。

这可以防止 Text 处理方式悄悄变成标题处理方式，同时仍避免重复的值定义。

### DEC-5 — Keep component weight choices consistent across themes

**Reference:** `spec:AST-024/DEC-5`

**Decider:** `rubyycheung`, `2026-09-04`

`Heading.weight` 和 `Text.weight` 在每个主题中继续使用相同的具名选项。活动主题决定诸如 `bold` 这样的名称解析为 700、750 还是其他受支持的值。自定义视觉类型也可以在主题源码中声明确切的字重。

已否决：在各组件调用点直接接受任意数字值，这会令应用源码耦合于某一种字体并绕过主题所有权。

### DEC-6 — State the limit of theme-generated TypeScript clearly

**Reference:** `spec:AST-024/DEC-6`

**Decider:** `rubyycheung`, `2026-09-04`

导入主题生成的声明会使它的自定义 Heading 名称在整个 TypeScript 程序中可用。它并不证明匹配的 Theme 在每次使用周围都处于活动状态。运行时样式仍以主题为作用域，不匹配时保留语义层级基线，开发工具在能够可靠识别时发出警告。

已否决：承诺 TypeScript 模块增强无法强制执行的、感知 provider 的静态类型。

### DEC-7 — Permit partial visual roles

**Reference:** `spec:AST-024/DEC-7`

**Decider:** `rubyycheung`, `2026-09-04`

自定义 Heading 类型可以有意只更改一个受支持的视觉属性，其余继承自其语义层级。它必须包含至少一个有效声明，但不必重述字号和行高。

已否决：要求每个自定义类型都成为完整的排版替代，这会使小的主题变体变得不必要地重复。
