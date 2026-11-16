---
schema_version: 3
template_version: 1
kind: module
id: module:Outline/parseOutlineFromMarkdown
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-03
owners: [cixzhang]
review_triggers: [public-api, behavior]
verified_by: [packages/core/src/Outline/parseOutlineFromMarkdown.test.ts]
parent_component: component:Outline
references:
  [
    architecture:public-component-api,
    component:Markdown,
    module:Markdown/headingLinks,
    spec:AST-036,
  ]
---

# parseOutlineFromMarkdown module contract

## Intent

`parseOutlineFromMarkdown` 与 `useOutlineFromMarkdown` 从渲染文档所使用的同一份 Markdown 解析配置、有序不可变变换、文本投影与冲突分配器中，派生同文档内的标题导航。这个聚焦的模块拥有该工具行为，但不决定 Outline 组件的解剖结构或主题。

## Compatibility and migration

- 保留的已发布默认行为：`yes`
- 兼容类别：增量式解析器选项；不传插件的调用保留已发布的标签、层级、ID 与返回类型
- 迁移决策：`spec:AST-036`

## Ownership boundary

**拥有**

- 从 Markdown 标题派生有序的 `OutlineItem` 值。
- 接受与 Markdown 相同的、影响解析器的选项以及相同的插件有序列表。
- 在选择标题之前应用相同的、经过校验的不可变变换。
- 使用与 Markdown 标题渲染相同的扩展文本投影和防冲突的 slug 分配。

**不拥有 / 非目标**

- Outline 组件的结构、活动状态、目标、布局或主题。
- 插件渲染、块扩展的导航条目，或渲染器派生的文本。
- 第二个解析器、插件注册表，或独立的标题 ID 策略。

## Public API and concepts

`parseOutlineFromMarkdown(source, options?)` 执行直接派生。`useOutlineFromMarkdown(source, options?)` 为 React 调用方记忆化同一派生。`options.plugins` 使用规范的不透明 Markdown 插件条目。相同的、有序的变换在标题选择之前运行；行内扩展节点的 `toText` 投影随后参与构成标题标签与 ID。当同一个第一方条目同时安装在这两个表面上时，本模块消费由 `module:Markdown/headingLinks` 拥有的投影；它不会复制该模块的选项或行为。

## Behavioral contract

| ID  | 不变式                                                                                                                                                                                                                                                         | 依据                            | 验收与实现状态 |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | -------------- |
| FR1 | 两个工具都接受与渲染的 Markdown 文档相同的 Markdown 解析器选项和有序插件列表。                                                                                                                                                                                 | `spec:AST-036` FR13, FR16       | 当前实现       |
| FR2 | 两个工具都在选择标题之前应用相同的、经过校验的不可变变换，且不允许渲染器输出影响标识。                                                                                                                                                                         | `spec:AST-036` FR13, FR16       | 当前实现       |
| FR3 | 启用插件时的标签与 ID 使用与 Markdown 相同的扩展 `toText` 投影、slugger 与跨基础冲突分配器，产生唯一且匹配的目标。                                                                                                                                             | `spec:AST-036` FR16             | 当前实现       |
| FR4 | 扩展节点永远不会自行创建一个 Outline 条目。Outline 的选择保持仅限根级；当安装 `module:Markdown/headingLinks` 时，本模块消费其单独拥有的标识投影，而不重述或修改该契约。容器永远不会重启或独立地界定所选投影的作用域。它在此处永远不会发出嵌套的 Outline 条目。 | `module:Markdown/headingLinks`  | 当前实现       |
| FR5 | 省略插件与传入空列表都会保留已发布的标题选择、标签、层级、ID、返回类型和记忆化行为。                                                                                                                                                                           | `spec:AST-036` FR2              | 当前实现       |
| FR6 | 该 hook 依据 source 以及每一个影响解析或影响变换的选项进行记忆化，因此配置变化不会返回过时的标题。                                                                                                                                                             | `component:Markdown` FR15–FR16  | 当前实现       |
| FR7 | 移除标题的变换会移除其 Outline 条目，插入合成标题的变换会新增一条，两个表面行为完全一致。有源码依据的标题深度不会改变，因此条目的层级始终与渲染后的标题匹配。                                                                                                  | `spec:AST-036` FR26             | 当前实现       |
| FR8 | 当插件失败时，派生使用与渲染文档相同的最后一个有效根，因此标签、层级与 ID 仍然一致。失败通过共享的诊断通道上报；本模块不新增任何失败模式、回退或自身的抛出。                                                                                                   | `spec:AST-036` FR12, FR29       | 当前实现       |
| FR9 | 派生通过共享解析路径在规范树上运行，不需要 DOM、渲染器、客户端边界或第二个解析器。由于变换在流式场景下是幂等的，由不断增长的源码前缀派生的 Outline 结果会收敛，而不是振荡。                                                                                    | `spec:AST-036` FR32, FR33, FR36 | 当前实现       |

### Transformation and precedence order

Markdown 解析配置 → 有序不可变变换 → 标题节点 → 共享的可感知文本投影 → 所选标题投影 → 根标题选择 → Outline 条目。

### Performance and resources

- 该 hook 仅在 source 或解析/变换配置发生变化时重新计算。
- 渲染器输出不进入标题标识。
- 不需要 DOM、渲染器挂载、注册表、Remark 运行时或可选插件资源。

## Accessibility contract

每个派生标签都是用于 Markdown 标识的同一可感知标题文本，每个派生 ID 都指向匹配的渲染标题。本模块不新增任何交互或 ARIA 行为；导航呈现由 Outline 组件拥有。

## Design relationships

本解析器工具不拥有任何视觉表示。

## Parent and system relationships

- `component:Markdown` 拥有总体解析、标题渲染以及通用的共享投影调用接缝。
- `module:Markdown/headingLinks` 拥有其可选投影；本模块消费它，同时保持仅限根级的 Outline 选择。
- `spec:AST-036` 拥有规范的插件协议与跨表面一致性。
- `component:Outline` 拥有呈现、解剖结构与主题。

## Verification map

| 契约    | 验证                                                                         | 代表性状态                                                                            | 变异或失败预期                                                                                             |
| ------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| FR1–FR6 | Outline 解析器测试、插件变换一致性测试、标题链接模块测试，以及 Core 类型检查 | 省略/空/已安装的插件列表；所选投影变化；被变换与格式化的根标题；根/嵌套容器           | 某个变换被跳过、某个根标签/ID 与 Markdown 不一致、嵌套标题进入 Outline、所选投影过期，或默认输出发生变化。 |
| FR7–FR9 | 标题插入/移除一致性、失败一致性，以及流式派生                                | 移除标题且保留/不保留小节；插入的合成标题；失败的变换；不断增长的源码前缀；服务端派生 | Outline/文档不一致、回退分叉、抛出异常、过期 ID，或流式振荡。                                              |

## Decision log

### DEC-1 — Markdown owns heading identity; Outline projects it

**参考：** `module:Outline/parseOutlineFromMarkdown/DEC-1`

**决策者：** cixzhang，2026-09-15

Outline 工具消费 Markdown 的解析配置、有序变换、文本投影与冲突分配器，而不是定义第二套标题标识系统。这使标签与链接目标保持对齐，同时不把插件渲染器输出耦合到导航标识上。

### DEC-2 — One traversal survives containers and heading edits

**参考：** `module:Outline/parseOutlineFromMarkdown/DEC-2`

**决策者：** cixzhang，2026-09-16

扩展容器承载普通 Markdown，但不会选择第二套标识系统。Markdown 与本模块消费由已安装插件列表所选择的同一投影，因此 Outline 永远不会链接到 Markdown 未识别出的根标题。Outline 结果保持仅限根级，扩展节点永远不是 Outline 条目。

变换可以移除和插入标题，因此 Outline 跟随渲染后的文档而非源码：被丢弃的根标题消失，被插入的根标题出现，而不可变的、有源码依据的深度保持层级对齐。两个表面运行同一条流水线，而不是各自独立的规则。

已否决：仅容器的遍历例外；把扩展节点作为 Outline 条目；仅依据源码的派生；模块本地的插件失败回退。

## Open questions

无。

## Content boundary

本文件不重复插件协议细节、Markdown 解析器机制、使用方示例，或 Outline 组件的解剖结构与主题契约。
