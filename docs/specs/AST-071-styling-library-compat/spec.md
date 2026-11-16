---
schema_version: 4
template_version: 2
kind: system-spec
id: spec:AST-071
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-11
phase: accepted
owners: [cixzhang]
affects_architecture: [architecture:public-component-api]
affects_families: []
affects_contributing: []
affects_consumer_docs: []
---

# Styling-library compatibility system spec

<!-- path-applicability:v1 -->

```json
{
  "paths": [
    "packages/core/src/**",
    "packages/lab/src/**",
    "packages/charts/src/**",
    "packages/richtext/src/**",
    "packages/vega/src/**"
  ]
}
```

## Intent

产品用其代码库已有的方式为 Astryx 组件设置样式：StyleX、类名 CSS（CSS modules、工具类、全局样式表）或内联样式。组件接受的每一种样式输入，都能从这些系统中的任意一种到达其元素，因此组件的任何部分都不能只靠 StyleX 来设置样式。

## Non-goals

- 组件究竟是否为某个部件暴露样式设置，不在本规格范围内。部件输入是一个新的公共 prop，须依据 `spec:AST-002/DEC-1` 接纳；本规格只在部件输入被接纳之后塑造它。
- 多个样式输入在同一元素上组合的顺序，由 `architecture:public-component-api` INV6 拥有。
- 主题 token 与主题目标，由 `architecture:theme-tokens` 和主题相关记录拥有。
- 满足本契约的等效内部实现仍然有效。

## Requirements

- **FR1 — 部件的样式输入以一套的形式提供。** 一个组件如果为其根元素之外的元素接受样式输入，就必须为该元素同时接受 `<part>Xstyle`、`<part>ClassName` 和 `<part>Style` 三者，且三者使用相同的 `<part>` 词。三者都必须到达同一个元素，并在该元素上像根元素的 `xstyle`、`className` 和 `style` 那样组合。
- **FR2 — 不允许仅支持 StyleX 的样式输入。** 为某个元素设置样式的公共 prop 不得接受 StyleX 样式，除非同一元素也通过公共 prop 接受类名和内联样式。

### Platform support

- 受支持的功能/引擎下限：不变；本契约不新增任何 CSS 功能。
- 不支持的行为：无；类名和内联样式在所有受支持的引擎中都能工作。
- 浏览器证据：不需要；FR1 与 FR2 在声明层与渲染层即可证明。

## Current-state impact

- `architecture:public-component-api` 新增一条不变式：部件的样式输入以一套的形式提供，由 `spec:AST-071/DEC-1` 决定。
- 已发布但不遵守 FR1 与 FR2 的公共 prop 为 `ComplexSelector.contentXstyle`、`ContextMenu.triggerXstyle` 和 `BaseTypeahead.inputXStyle`。它们是已知缺口，而非先例：不得通过引用它们来接纳新的部件输入。

## Verification

| Contract | Verification                                            | Representative states                             | Mutation or failure expectation                                                   |
| -------- | ------------------------------------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------------- |
| FR1      | 对生成的声明清单做公共 API 审查；组件渲染测试           | 一个部件输入分别由 StyleX、类名和内联样式设置样式 | 缺少 `<part>ClassName` 与 `<part>Style` 的 `<part>Xstyle`，或落到别处的输入，失败 |
| FR2      | 对每个以 StyleX 样式标注类型的导出 prop 做公共 API 审查 | 导出组件中的根输入与部件输入                      | 某个以 StyleX 标注类型的 prop 在其元素上没有类名与内联样式的对应项，失败          |

已知验证缺口：没有自动化检查强制 FR1 或 FR2；由公共 API 审查来应用它们。

## Decision log

### DEC-1 — Every styling input works from every styling system

**Reference:** `spec:AST-071/DEC-1`

**Decider:** `cixzhang`, 2026-10-09

Astryx 被那些不使用 StyleX 的产品所采用。若某个部件只能通过 `xstyle` 触达，那么用类名或内联样式来设置样式的代码库就无法触达该部件，而每个这样的 prop 都会成为下一个部件照抄的先例。因此，部件的样式输入要么是根元素已经接受的那一整套，要么就不予接纳。

已否决：只接纳部件的 `xstyle`，再在有人请求时补上其对应项——非 StyleX 调用方会被挡在外面，直到有人提出请求。

## Open questions

- **OQ1 — 已知不合规的 prop 如何达到合规**（`human-api`）：`ComplexSelector.contentXstyle`、`ContextMenu.triggerXstyle` 和 `BaseTypeahead.inputXStyle`。
