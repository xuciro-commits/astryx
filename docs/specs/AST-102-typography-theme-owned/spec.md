---
schema_version: 4
template_version: 2
kind: system-spec
id: spec:AST-102
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-25
phase: accepted
owners: [cixzhang]
affects_architecture: [architecture:theme-tokens]
affects_families: [family:input-fields]
affects_contributing: []
affects_consumer_docs: []
---

# Typography stays theme-owned system spec

<!-- path-applicability:v1 -->

```json
{
  "paths": ["packages/core/src/**", "packages/lab/src/**", "packages/themes/**"]
}
```

<!-- Describe the system, not the project: present tense, what it does. No proposals, history, pull requests, or research in the record; see docs/contributing/spec-writing.md and report its rubric results in the pull request. -->

## Intent

自行设置文字大小的用户，在每个 Core 与 Lab Web 组件中都能看到该设置生效，无论使用哪个主题；而未设置的用户看到的正是主题所选的字体族与字号。没有任何组件换用平台字体或自己的文字大小。当 Astryx 随附主题没有用于正文的品牌字体时，该主题可以使用平台自带的正文字体，让文字读起来与用户设备的其余部分一致。

## Non-goals

- 品牌主题使用哪种字体；品牌保有自己的选择。
- 字号阶梯本身：`design:typography-hierarchy` 与 `design:mobile-typography` 负责角色、字号以及移动端阅读基准。

## Requirements

- **FR1 — 组件从不覆盖排版。** 除通过主题的排版 token 之外，任何 Core 或 Lab Web 组件都不设置其渲染文字的字体族、字号或行高；从周围文字继承的值视为符合。这包括 `-apple-system-body` 之类的平台字体关键字与系统字体栈：组件在任何指针下都绝不直接应用它们。仅用于测量某种平台文字样式的隐藏内部元素不渲染文字，视为符合。用于设定图标尺寸的字号，例如在 `spec:AST-087` FR10 尺寸下使用 `1em` 的图标，不属于文字排版。原生组件遵循平台自身的文字设置（`spec:AST-082` FR11）。组件所设置的值只来自主题。唯一例外是当前 family 记录所要求的最小尺寸，例如 `family:input-fields` FR9 中 iOS 16 px 的文字输入下限。
- **FR2 — 无品牌的随附主题可以使用系统正文字体。** 正文未做品牌化的 Astryx 随附主题，可以把其正文字体 token 设为平台的系统正文字体族，例如 `system-ui` 或 Apple 的系统字体。品牌主题为正文保留其品牌字体。该选择存在于主题的 token 值中，因此组件无需改动即可取得（FR1）。

- **FR3 — 用户设置的文字大小优先；否则以主题为准。** 当用户已设置文字大小，通过 iOS Dynamic Type、浏览器默认字号或缩放，Core 与 Lab Web 的文字在每个主题中都遵循它，品牌主题也包括在内：主题的字号按用户设定的尺寸缩放，每个角色保持其层级顺序，字体族仍是主题的。当用户未设置，或平台没有给出信号时，文字正好使用主题的字体族与字号。遵循该设置不新增公开的主题选项、prop 或文档属性，也不改变文档根字体大小（`design:mobile-typography` DR4）。用户设置的尺寸取代 `design:mobile-typography` DR1 的移动端阅读基准，更小或更大皆然，并且 DR2 的固定值不适用：每个角色都从该尺寸缩放；未设置时 DR1 与 DR2 适用，而 `family:input-fields` FR9 的 iOS 文字输入下限仍然有效。在 Android 上，Core 从 `env(preferred-text-scale)` 读取系统字体缩放，并据此缩放每个字号，因此整个阶梯随之变化而无需开关（DEC-3、DEC-4）。携带 `<meta name="text-scale" content="scale">` 的页面已在其根字体大小上带有系统字体缩放，而 Astryx 正是从该位置设定尺寸，因此 Core 不再叠加（在 Android 上的 Chromium 159.0.8142.0 中，根字体大小随该 meta 变化；带该 meta 的 Android 上的 Chrome 在当前稳定版上尚未验证）。
- **FR4 — 更大的文字仍然可用。** 在主题字号的 200% 以内，每个组件都保留其全部内容与功能（WCAG 2.2 成功准则 1.4.4）。超过 200% 时，阅读文字继续增大；密集控件内的标签，例如 tab、badge、表格单元格或分段控件，可以在 200% 处停止增大。控件随其文字增长，而不是保持固定高度，因此其高度绝不会裁切标签；组件记录已定义的截断仍然适用，例如 `component:Badge` FR3、`component:Button` FR5 或 `component:Token` FR7 的省略号。

### Platform support

- 支持的功能/引擎下限：该包所支持的浏览器（`spec:AST-013` FR1、FR3）。引擎无法识别的平台字体关键字回退到主题字体栈的其余部分。
- 不支持的行为：除上述字体回退之外没有其他。
- 浏览器证据（`spec:AST-013` FR10）：iOS 上的 Safari 证明 FR2 主题的正文以系统正文字体呈现，并在各 Dynamic Type 类别下证明 FR3；模拟器中 Android 上的 Chromium 159.0.8142.0 在带与不带 text-scale meta 两种情况下，以系统字体缩放证明 FR3 的 Android 行为；Pixel 8 设备上 Android 17 的 Chrome 156 在不带该 meta、系统字体缩放为 1.0、1.3 与 2.0 时证明该行为；桌面浏览器以默认字号与缩放证明 FR3，并在 200% 及以上证明 FR4；token 与源码检查证明 FR1。

## Current-state impact

- Core 的默认正文字体是系统字体栈，这是 FR2 所允许的无品牌值。每个随附主题包都设置品牌正文字体并保留该字体。
- 目前有些组件在主题之外设置排版，例如 Lab 的 Sankey 标签直接使用 `system-ui`，以及若干 Core 与 Lab 组件设置自己的字号或行高；在 FR1 下这些属于一致性缺口。
- `architecture:theme-tokens`：在每个第一方主题中，文字大小 token 保持 rem。设置尺寸时，间距与元素尺寸 token 保持其值；在 FR4 下控件随其文字增长。
- FR3 与 FR4 下的缺陷：
  - iPhone 上的 Safari 在每个主题中都遵循 Dynamic Type，已按当前实现记录在 iOS 模拟器中。iPad 上的 Safari 与其他 iOS 浏览器尚未验证，macOS Safari 在其默认文字大小下的情况是一项已记录的后续验证。
  - 控件保持固定高度，例如 40 px 的元素、`component:Badge` FR1 的块尺寸、`component:Token` FR1 的元素尺寸，以及 `family:input-fields` 中 InputGroup 的行高，因此更大的标签可能溢出；在 FR4 下这些记录把其尺寸视为最小值。

## Verification

| 契约 | 验证                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 代表性状态                                                                                                                                                                                                                                                          | 变更或失败预期                                                                                                                                                                                 |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR1  | 对 Core 与 Lab 组件样式做源码检查，并辅以 token 审查                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 组件样式中渲染文字的字体族、字号与行高；一个继承值；一个 `1em` 图标尺寸；粗指针与细指针；一个平台字体关键字；iOS 文字输入下限                                                                                                                                       | 某个 Core 或 Lab Web 组件在排版 token 之外且非通过继承，设置了其渲染文字的字体族、字号或行高，或直接应用平台字体关键字；图标尺寸设定、字体族下限，以及仅测量平台文字样式的隐藏内部元素不算失败 |
| FR2  | 主题 token 审查，加上 iOS 上 Safari 的顶层文档                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 使用系统正文字体族的无品牌随附主题；品牌主题；默认主题                                                                                                                                                                                                              | 品牌主题的正文被系统字体替换，或系统正文字体由组件而非主题 token 应用                                                                                                                          |
| FR3  | iOS 上的 Safari 跨 Dynamic Type 类别；模拟器中 Android 上的 Chromium 159.0.8142.0 在系统字体缩放 1.3 下，带 `<meta name="text-scale" content="scale">`（实测根为 21 px；rem 尺寸随它缩放）、不带它（根 16 px），以及不带它但 Default 缩放 133%（根 16 px，页面缩放）；Pixel 8 硬件设备上 Android 17 的 Chrome 156，不带 text-scale meta，在系统字体缩放 1.0、1.3 与 2.0 下，配一个无品牌主题与一个品牌主题（无品牌正文为 16 px、20.8 px 与 32 px，只缩放一次；在 1.0 时文字保持主题的字号）；带该 meta 的 Android 上的 Chrome 在当前稳定版上尚未验证；`dynamicType.test.ts`（引擎没有 `-apple-system-body` 时，每个缩放都读取 `env(preferred-text-scale)`；带 text-scale meta 的页面上没有）；Android 上 Chromium 159.0.8142.0 在系统字体缩放 1.3 下配合 Core 的读取：不带该 meta 时根 16 px、正文 20.8 px、`display-1` 54.6 px；带该 meta 时根 21 px、正文 21 px、`display-1` 55.125 px，没有双重缩放；在 1.0 时，带与不带该 meta 的字号都与 main 一致；使用更大默认字号并缩放的桌面浏览器；主题审查；`scripts/check-theme-text-size-units.test.mjs`（没有任何第一方主题以 px 设置文字或字体尺寸） | 一个品牌主题与一个无品牌主题；未设置尺寸；默认类别；在每个平台上设置尺寸；带与不带 text-scale meta 的 Android；macOS Safari 在其默认文字大小下，其固定的 13 px Body 不指名任何类别，因此每个缩放都保持 1（`dynamicType.test.ts`；浏览器读数是一项已记录的后续工作） | 忽略用户所设置尺寸的文字；未设置尺寸时与主题的字体族或字号不一致的文字，`family:input-fields` FR9 的 iOS 文字输入下限除外；主题字体族被替换；出现公开选项、prop 或文档属性；根字体大小被改变   |
| FR4  | 桌面浏览器在 200%、250% 与 300% 文字大小下，加上 iOS 上 Safari 在辅助功能类别下                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 阅读文字；按钮、文本输入框、tab、badge、表格单元格与分段控件                                                                                                                                                                                                        | 在 200% 或更低时丢失内容或功能；任何尺寸下标签被控件高度裁切；控件在文字增长时仍保持固定高度                                                                                                   |

## Decision log

### DEC-1 — Typography is the theme's; unbranded shipped themes may use the system body font

**引用：** `spec:AST-102/DEC-1`

**决定者：** `cixzhang`，`2026-10-24`

换用平台字体或自己的文字大小的组件，会在那一处表面上破坏主题的排版，而产品无法看到或调整它。把组件文字的字体族、字号与行高保留在主题 token 中，意味着由主题为这些文字做决定。当随附主题没有品牌字体时，系统正文字体对阅读的用户来说是最熟悉的选择，因此这些主题可以通过自己的 token 使用它；品牌则保有自己的字体。

已否决：组件直接应用诸如 `-apple-system-body` 的平台字体。

### DEC-2 — A text size the person set wins in every theme

**引用：** `spec:AST-102/DEC-2`

**决定者：** `cixzhang`，`2026-10-25`

设置了文字大小的用户期望在任何地方都看到它；没有设置的用户则期望看到应用所选的字体。因此每个主题，品牌主题也包括在内，都遵循用户设置的尺寸，保持自己的字体族以及相对于该尺寸的缩放，并在未设置时给出自己的确切字号。大号文字在所有地方直到 200% 都可保持使用，密集控件可以在 200% 处停止增大而不截断文字。

已否决：仅由无品牌或选择加入的主题遵循用户设置的尺寸。

### DEC-3 — Following the person's size adds no public surface

**引用：** `spec:AST-102/DEC-3`

**决定者：** `cixzhang`，`2026-10-25`

用户设置的尺寸默认即被遵循，因此产品无需开关来启用它。在平台仅通过系统文字样式暴露该尺寸的地方，例如 iOS，Core 直接读取它，在其他地方则让根字体大小承载它；这两种读取都不是主题选项、prop 或文档属性。

已否决：为该尺寸提供公开的选择加入选项或文档属性。

### DEC-4 — Android's system font scale is read the same way

**引用：** `spec:AST-102/DEC-4`

**决定者：** 规格一致性裁决，`2026-11-09`，应用 DEC-3

在平台仅通过 `env(preferred-text-scale)` 暴露用户设置的尺寸的地方，例如 Android 上的 Chromium，Core 也在那里读取它，因此产品仍然无需开关；携带 `<meta name="text-scale" content="scale">` 的页面已在其根字体大小上带有该尺寸，因此 Core 不再叠加。与 DEC-3 的读取一样，它不是主题选项、prop 或文档属性。

## Open questions

无。
