---
schema_version: 3
template_version: 4
kind: component
id: component:FileInput
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-09-14
owners: [cixzhang, imdreamrunner]
review_triggers: [theming]
verified_by:
  [
    packages/core/src/FileInput/FileInput.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: [family:input-fields]
design_specs: []
architecture: [architecture:component-theming-surface]
contributing: []
system_specs: []
---

# FileInput component contract

## Intent

FileInput 以紧凑的输入形式或拖放区形式呈现一个带标签的文件选择字段。本契约记录其当前的使用方解剖结构，并为 FileInput 通过 Icon 绘制的上传提示元素批准独立的主题所有权。

## Compatibility and migration

- 已发布的默认值保持不变：`no`；在拖放区模式下，未设置的 `statusVariant` 解析为 `detached` (FR6, DEC-2)
- 兼容性类别：新增式公共主题目标；不改变任何现有目标、DOM、prop、交互或无障碍行为
- 受控/非受控行为：不变；FileInput 仍为受控组件
- 迁移决策：`component:FileInput/DEC-1`
- 拖放区状态放置 (FR6)：拖放区默认 `detached`；显式的 `statusVariant="attached"` 保留已发布的 attached 渲染，直到下一个次版本发布 (DEC-2)

使用方迁移说明应放在使用方文档与发布说明中。

## Ownership boundary

**拥有**

- 可见的文件选择表面及其输入/拖放区模式。
- 上传提示元素是否出现、出现在何处，以及以何种默认尺寸出现。
- 在由其本地拥有的主题目标上反映 FileInput 的模式。

**不拥有 / 非目标**

- 上传图形，或 Icon 的基础颜色、尺寸与无障碍语义——由 `component:Icon` 拥有。
- 标签、描述、清除控件与校验消息的呈现——由 `component:Field` 与 `component:FieldStatus` 拥有。
- 加载指示器的呈现——由 `component:Spinner` 拥有。
- 新增 prop、变体、图标插槽或自定义属性。

## Public concepts

使用方 prop 无变化。`file-input-icon` 目标为主题在同一元素上提供了一个接缝来定位上传图标，并反映现有的 `mode` 轴。现有的 `file-input` 目标仍位于可见的选择表面上，并保留其 `mode` 与 `status` 轴。

## Behavioral and layout contract

| ID  | 候选不变式                                                                                                                                                                                                                                                                                                                             | 依据                                                                      | 审查状态                                                                                     |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| FR1 | 可见的选择表面携带 `file-input`，并反映现有的 `mode` 与解析后的状态。                                                                                                                                                                                                                                                                  | 当前源码、公共文档与聚焦测试                                              | 已验证为当前行为                                                                             |
| FR2 | 未处于加载状态时，输入模式以 Icon 的小尺寸渲染上传提示元素。拖放区模式仅在没有选中文件时以 Icon 的中等尺寸渲染它。                                                                                                                                                                                                                     | 当前源码与聚焦测试                                                        | 已验证为当前行为                                                                             |
| FR3 | Icon 拥有渲染字形的基础尺寸、颜色与无障碍语义；FileInput 拥有提示元素随模式变化的放置位置与默认尺寸。                                                                                                                                                                                                                                  | 当前组合关系与组件边界                                                    | 已验证为当前组合                                                                             |
| FR4 | 渲染出的上传提示元素 MUST 携带 `file-input-icon` 并反映现有的 `mode`，以便主题无需结构化选择器、也无需改动每个使用同一图形的 Icon 就能重新设置字形盒的样式。                                                                                                                                                                           | 所有者批准的目标契约                                                      | 已批准的附加契约                                                                             |
| FR5 | 新增该目标 MUST NOT 改变默认图形、计算布局、交互、文件选择行为、无障碍名称或装饰性 Icon 语义。                                                                                                                                                                                                                                         | 兼容性策略与聚焦回归测试                                                  | 必需的兼容性行为                                                                             |
| FR6 | 拖放区模式不提供 `attached` 状态放置：其高大的自定义表面无法满足 `family:input-fields` FR8 的 attached 条件，因此在 AV6 下它提供 `detached` 与 `tooltip`。拖放区默认 `detached`；显式的 `attached` 保留已发布的 attached 渲染，直到下一个次版本发布，届时拖放区会把 `attached` 解析为 `detached`。输入模式仍以 `attached` 作为默认值。 | 所有者 2026-11-10 指示：默认值在补丁版本中变更；attached 清理留待次版本。 | 已批准；默认值在补丁版本中发布，显式 `attached` 在下一个次版本解析（所有者 2026-11-10 指示） |

### Allowed variation

- **AV1 — 主题绘制。** 主题可以通过 `file-input-icon` 更改上传字形尺寸或颜色等标准视觉属性；FileInput 仍拥有提示元素是否渲染以及渲染在何处。
- **AV2 — 图形。** Icon 注册表与未来的图标插槽决策可以更改图形，而不会改变该 CSS 目标对绘制字形盒的所有权。

### Representative states

| 状态                 | 必需不变式                                 | 允许的变体                   |
| -------------------- | ------------------------------------------ | ---------------------------- |
| 输入模式，空或已选中 | 未加载时，输入表面渲染小型上传提示元素。   | 文件、占位符、状态、主题绘制 |
| 拖放区，空           | 未加载时，占位符上方渲染中型上传提示元素。 | 拖拽状态、占位符、主题绘制   |
| 拖放区，已选中       | 文件名替换上传提示元素。                   | 文件名与状态                 |
| 加载中               | Spinner 替换上传提示元素。                 | 模式与加载呈现               |

### Transformation and precedence order

- **ORD1 — 内容选择。** 先解析加载与选中文件状态，选择输入或拖放区内容，然后仅在 FR2 记录的状态中渲染与模式尺寸对应的上传提示元素。
- **ORD2 — 主题合成。** Icon 先应用其基础尺寸与颜色，然后同一元素上的 FileInput 目标参与现有的主题层与标准 Icon 样式合并顺序。

### Performance and resources

- **PR1 — 无新增工作。** 该附加目标不执行任何测量、监听器、观察器、状态更新或额外渲染趟次。

## Accessibility contract

上传提示元素仍为装饰性。现有的可聚焦文件选择触发器、标签、描述、必填/无效状态、禁用说明以及选择播报均保持不变。

## Design relationships

| 解剖结构或状态 | 设计要求                                                  | 呈现权威                   | 层级角色 | 组件契约      |
| -------------- | --------------------------------------------------------- | -------------------------- | -------- | ------------- |
| 拖放区         | 以输入或拖放区形式呈现可见的文件选择表面。                | 当前源码与公共文档         | 显著     | FR1           |
| 上传图标       | 提示上传操作，并随所选模式改变默认尺寸。                  | 当前源码与所有者批准的目标 | 辅助     | FR2, FR3, FR4 |
| 共享反馈       | 使用 Field、FieldStatus 与 Spinner 处理标签、校验与加载。 | 当前共享组合               | 辅助     | FR5           |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Label": {
    "delegatesTo": {"owner": "component:Field", "target": "field-label"}
  },
  "Description": {
    "none": {
      "reason": "unsettled: No current public target reaches the stable Description; future exposure still needs an owner decision"
    }
  },
  "Drop zone": {"target": "file-input"},
  "Upload icon": {"target": "file-input-icon"},
  "Placeholder": {"inherits": "file-input"},
  "File name display": {"inherits": "file-input"},
  "Clear button": {
    "delegatesTo": {
      "owner": "component:Field",
      "target": "input-clear-button"
    }
  },
  "Spinner": {
    "delegatesTo": {"owner": "component:Spinner", "target": "spinner"}
  },
  "Status message": {
    "delegatesTo": {
      "owner": "component:FieldStatus",
      "target": "field-status"
    }
  }
}
```

`file-input-icon` 的处置记录的是已批准的目标状态。Icon 仍拥有通用的 `icon` 目标与基础字形语义；FileInput 更窄的目标仅拥有这个稳定的上传位置及其现有的模式区分。

## Family and system relationships

- `family:input-fields` 拥有共享的带标签字段与校验行为。
- `architecture:component-theming-surface` 拥有目标资格认定、解剖结构映射，以及“公共目标位于稳定的绘制部件上”这一要求。
- Field、FieldStatus、Icon 与 Spinner 在被 FileInput 组合时，保留其现有的公共目标契约。

## Verification map

| 契约             | 验证                                                                                                                                                                                                                            | 代表性状态                                | 变异或失败预期                                                                                                                                              | 审计章节                  |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| FR1, FR2         | `FileInput.test.tsx` 的渲染与目标测试套件                                                                                                                                                                                       | 输入/拖放区；空/已选中/加载中             | 移动根部目标，或改变提示元素渲染的时机与尺寸，都会破坏聚焦断言。                                                                                            | `audit:FileInput/theming` |
| FR3, FR4, FR5    | `FileInput.test.tsx`、`themingTargets.test.ts`、探测主题检查                                                                                                                                                                    | 两种模式与同一元素上的 Icon 目标          | 缺少该目标、反映错误的模式，或将其移出字形，都会导致源码/文档/探测覆盖失败。                                                                                | `audit:FileInput/theming` |
| FR6              | `FileInput.test.tsx` 的 "defaults a dropzone status to detached" 与 "keeps an explicit attached on a dropzone until the next minor release"；`FileInput.doc.mjs` 的 `statusVariant` 条目以及 `FileInput.tsx` 中该 prop 的 JSDoc | 未设置的拖放区与显式 `attached`；输入模式 | 拖放区未设置的放置不是 detached、拖放区在次版本之前就丢弃显式 `attached`，或文档/JSDoc 把 `attached` 当作拖放区默认值、或将其从输入模式中移除，均视为失败。 | —                         |
| 主题解剖结构映射 | `scripts/check-knowledge.mjs`                                                                                                                                                                                                   | 九个解剖结构条目与两个本地拥有的目标      | 缺失、多余、带前缀、过时或未声明的当前映射都会导致校验失败。                                                                                                | `audit:FileInput/anatomy` |

## Decision log

### DEC-1 — Upload icon is stable FileInput theme anatomy

**参考：** `component:FileInput/DEC-1`

**决策者：** cixzhang, 2026-09-14

上传图标是稳定的、使用方可识别的 FileInput 提示元素，其随模式变化的放置位置与默认尺寸属于 FileInput。它在绘制字形的同一个 Icon 元素上获得 `file-input-icon` 目标，同时 Icon 保留其通用目标与基础字形语义。

### DEC-2 — The dropzone default changes in a patch; the attached cleanup waits for the minor

**参考：** `component:FileInput/DEC-2`

**决策者：** cixzhang, 2026-11-10

拖放区默认 `detached`。显式的 `attached` 保留其已发布的渲染，直到下一个次版本发布，届时它会被解析为 `detached`。所有者问道：“9259 能否有一个不破坏兼容的版本，只更新默认值，然后把 attached 版本的清理留到次版本”。

已否决：在下一个次版本中为默认值和显式 `attached` 同时做一次破坏性变更。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表、示例、实现步骤或共享组件契约。它链接到这些内容的所有者。
