---
schema_version: 3
template_version: 2
kind: module
id: module:Markdown/softBreaks
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-09-22
owners: [cixzhang]
review_triggers: [public-api, behavior]
verified_by:
  [
    packages/core/src/Markdown/plugins/softBreaks.test.tsx,
    apps/storybook/.storybook/Markdown.remarkPlugins.test.ts,
    apps/sandbox/src/app/(fullscreen)/pages/markdown-perf/benchmarkProfiles.test.ts,
  ]
parent_component: component:Markdown
references: [spec:AST-036/DEC-1, spec:AST-036/DEC-11]
---

# Markdown soft-breaks module contract

## Contract at a glance

| 方面         | 契约                                                                                                                                                                                |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约     | `markdownSoftBreaksPlugin` 是 `@astryxdesign/core/Markdown/plugins` 导出的一个持久的第一方插件值。                                                                                  |
| 行为         | 可用行文中的每一个软 LF、CRLF 或单独 CR 行结尾都会变成一个规范的 Markdown `break` 节点，并通过 Astryx 的适配器与真实插件保持一致。                                                  |
| 终端用户影响 | 读者看到作者意图的换行，而无需两个行尾空格，同时受保护内容保持字面且可复制。                                                                                                        |
| 构建者影响   | 构建者只需向 `plugins` 添加一个值即可启用；没有设置项，也没有渲染器插槽。                                                                                                           |
| 兼容性       | 增量且可选启用；省略或为空的插件列表保留已发布的解析器、DOM、无障碍和流式行为。                                                                                                     |
| 审查检查     | 若缺少与 `remark-breaks` 的链接标签一致性，或在代码、图片、引用、数学或扩展节点内部发生匹配，或进行源码预处理，或使用自定义渲染器，或在完整输入与流式输入之间行为出现分歧，则否决。 |
| 管辖规则     | [`spec:AST-036` FR1–FR17、FR21–FR24、FR36、FR38、FR40](../../../AST-036/spec.md)；[`component:Markdown` FR12–FR16、FR21](../Markdown.spec.md)。                                     |

此表是审查投影；以下正文具有权威性。

## Intent

收到带有有意义单行结尾的散文文本的构建者，应当能够把这些结尾渲染为换行，而无需重写源码或更改 Markdown 的解析器。该插件是刻意固定的：一种稳定的行为使其易于识别、易于基准测试，并可用适配过的 `remark-breaks` 转换替换。

## Compatibility and migration

- 已发布的默认行为保持不变：`yes`
- 兼容性类别：增量且可选启用
- 迁移决策：`spec:AST-036/DEC-11`

## Ownership boundary

**拥有**

- 导出的插件值及其稳定的插件名称。
- 把可用的软行结尾转换为内置的 `break` 节点。
- 完整、流式、SSR、Storybook 一致性以及浏览器性能方面的证据。

**不拥有 / 非目标**

- 解析或渲染新的扩展节点。
- 行内代码与围栏代码、图片、引用、数学或扩展节点内部的不透明行结尾。
- CSS 空白（white-space）行为或源码预处理。
- 已用 Markdown 的双空格或反斜杠语法写出的硬换行。

## Public API and concepts

| 概念                       | 封闭取值或状态                                  | 含义                               | 默认值     | 所有者                       | 稳定性 |
| -------------------------- | ----------------------------------------------- | ---------------------------------- | ---------- | ---------------------------- | ------ |
| `markdownSoftBreaksPlugin` | 一个 `MarkdownPluginEntry<never>`               | 通过公共转换协议转换可用的软结尾。 | 不存在     | `module:Markdown/softBreaks` | 稳定   |
| 可用结尾                   | 行文文本内部的 LF、CRLF 或单独 CR，包括链接标签 | 被替换为一个内置的 `break` 节点。  | 字面软结尾 | `module:Markdown/softBreaks` | 稳定   |
| 不透明上下文               | 代码、图片、引用、数学或扩展内容                | 保持逐字节内容，而不是变成换行。   | 受保护     | `component:Markdown`         | 稳定   |

## Behavioral contract

| ID  | 不变式                                                                                                                    | 依据                      |
| --- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| FR1 | 每一个可用的 LF、CRLF 或单独 CR 结尾都恰好变成一个规范的 `break` 节点。                                                   | `spec:AST-036` FR1、FR9   |
| FR2 | 该插件仅使用 `createMarkdownPlugin()` 和公共不可变转换契约，不引入任何扩展节点或渲染器。                                  | `spec:AST-036` FR1、FR40  |
| FR3 | 链接标签中的文本会参与转换，以实现与 `remark-breaks` 的一致性；行内代码与围栏代码、图片、引用、数学及扩展节点保持不透明。 | `spec:AST-036` FR7、FR15  |
| FR4 | 省略或为空的插件列表保留已发布的软结尾行为。                                                                              | `spec:AST-036` FR2、FR3   |
| FR5 | 每个流式前缀都是确定性的，且最终的流式树等于对同一源码的完整解析。                                                        | `spec:AST-036` FR13、FR36 |
| FR6 | 不含换行的源码返回原始树，且不分配替换节点。                                                                              | `spec:AST-036` FR21、FR23 |
| FR7 | 在受支持的 Astryx 子集上，原生输出与适配过的 `remark-breaks` 转换一致。                                                   | `spec:AST-036` FR20、FR40 |

## Accessibility contract

- **AR1 — 阅读顺序保持为源码顺序。** 换行不添加焦点目标，也不在语义容器之间移动文本。
- **AR2 — 链接含义保持完整。** 链接目标与无障碍名称保留其源码文本，同时视觉换行与 `remark-breaks` 一致。

## Design relationships

软换行不添加任何解剖结构或样式。现有的 Markdown 段落与换行渲染保持权威。

## Parent and system relationships

- `component:Markdown` 拥有解析、受保护上下文、渲染和回退。
- `spec:AST-036` 拥有插件协议与第一方一致性要求。
- `module:Markdown/remark` 拥有适配后的 `remark-breaks` 比较路径。

## Content boundary

本模块只识别已存在于可用规范行文文本中的 LF、CRLF 和单独 CR 字符。它不会在转换调用之外检查或持久化文档内容。

## Verification map

| 契约        | 验证                                                            | 代表性状态                                                                      | 失败预期                                                         |
| ----------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| FR1–FR4     | `softBreaks.test.tsx` AST 与 SSR 测试夹具                       | LF、CRLF、单独 CR、散文、强调、多行链接、行内代码、围栏、已写出的硬换行、无插件 | 多余、缺失、不透明上下文、重复硬换行或默认路径换行都会失败。     |
| FR5         | `softBreaks.test.tsx` 前缀序列                                  | 流式行结尾之前、之处和之后                                                      | 振荡或最终不一致都会失败。                                       |
| FR6         | `softBreaks.test.tsx` 同一性覆盖与 Markdown Perf 无声明性能配置 | 无换行                                                                          | 为缺失的源码分配变动的树都会失败。                               |
| FR7         | Storybook 原生/适配一致性故事                                   | 散文、强调、多行链接、受保护代码                                                | DOM 分歧都会失败。                                               |
| Performance | Markdown Performance 针对软换行工作负载配对的空运行/插件运行    | 无、稀疏和密集声明；完整与流式模式                                              | 一对运行之间源码不同、缺少基线增量或缺少密度控制，都会阻止接受。 |

## Decision log

### DEC-1 — Ship one fixed plugin value

**参考：** `module:Markdown/softBreaks/DEC-1`

**决策者：** `cixzhang`，`2026-09-22`

软换行只有一个既定含义，不需要任何产品特定的数据或呈现。固定值使 API 比一个其选项不会改变行为的工厂更小。

已否决：源码预处理；在 Markdown 上增加布尔值；渲染器回调；无可意义配置的工厂。

## Open questions

无。
