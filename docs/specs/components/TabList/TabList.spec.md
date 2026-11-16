---
schema_version: 3
template_version: 5
kind: component
id: component:TabList
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-09-21
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, accessibility]
verified_by:
  [
    packages/core/src/TabList/TabList.test.tsx,
    apps/storybook/stories/TabList.stories.tsx,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: []
design_specs: []
architecture:
  [architecture:container-padding, architecture:public-component-api]
contributing: [contributing:api-conventions]
system_specs: [spec:AST-002/DEC-1, spec:AST-002/DEC-2, spec:AST-017/DEC-1]
---

# TabList component contract

## Contract at a glance

| 区域            | 契约                                                                                                                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 公共契约        | 从共享的 `edge` 词汇表出发，将现有模式规范化为 `edge?: 'padded' \| 'bleed'`（默认 `'padded'`）；将 `isFullBleed` 弃用为 `edge="bleed"` 的别名，并在下一个小版本中移除。              |
| 行为            | 将第一个和最后一个可见标签页的内容向宿主内容线移动，当宿主内缩至少等于边缘标签页内边距时到达该线，同时保留标签页交互内边距、焦点环空间、溢出控件、选中指示器几何，以及可选的分隔栏。 |
| 终端用户影响    | 在宿主几何允许的地方，边缘标签页失去不必要的额外内缩，并保持完全可交互，焦点、选中、溢出或分隔线处理不会被裁剪。                                                                     |
| 构建方影响      | 现有 `isFullBleed` 调用点在弃用窗口期内继续工作，并机械地迁移到 `edge="bleed"`。                                                                                                     |
| 兼容性/就绪状态 | 当前行为已发布；规范别名是增量式的，而移除已发布的旧属性则是下一个小版本中单独实现的破坏性变更。                                                                                     |
| 审查检查        | 拒绝伪装成重命名的行为变更、缺少溢出/指示器证明的方向性取值，或提前移除旧属性。                                                                                                      |
| 治理规则        | `architecture:container-padding/INV9–INV11`；`spec:AST-002/DEC-1–DEC-2`；`spec:AST-017/DEC-1`。                                                                                      |

此表是审查投影；下面的正文具有权威性。

## Intent

TabList 当前的按需启用是共享的 `bleed` 边缘处理：它消耗完整的继承宿主内缩，将可见的边缘标签页内容向周围内容线移动，并保留 Tab 拥有的交互内边距以及 TabList 拥有的分隔线、溢出与指示器几何。只有当该内缩至少等于边缘标签页自身的内边距时，内容才到达宿主线。公共名称 `isFullBleed` 具有误导性，因为条带会保留一条内容线：它在外层盒子扩展之后恢复未被覆盖的内容内缩，而 `architecture:container-padding` 将之命名为 `bleed`。

## Compatibility and migration

- 已发布的默认值保持不变：`yes`；省略时保持当前 TabList 几何。
- 兼容性类别：在已发布的 `isFullBleed` 属性仍然保留期间，规范别名是增量式的；移除该属性是下一个小版本中依据 `spec:AST-017/DEC-1` 的破坏性变更。
- 受控/非受控行为：活动值控制保持不变。
- 迁移决策：`component:TabList/DEC-1`。

在兼容性窗口期内：

- `edge="bleed"` 是规范拼写，省略 `edge` 表示 `padded`；
- 省略 `edge` 加上 `isFullBleed={true}` 会选择 `bleed`；
- `isFullBleed` 已被弃用，维护中的示例使用规范属性；
- 如果同时提供两个属性，显式的 `edge` 具有规范性，旧布尔属性无法覆盖它。

移除版本必须包含针对 `@astryxdesign/core` 的 `[breaking]` Changeset、使用方发布说明，以及将 `isFullBleed` 改写为 `edge="bleed"` 的 `astryx upgrade` codemod。

## Ownership boundary

**拥有**

- TabList 范围内的 `bleed` 边缘处理及其兼容性别名。
- 外层 TabList 盒子、内部条带内边距、边缘标签页、焦点环空间、溢出控件与选中指示器之间的关系。
- 公共模式支持哪些逻辑边缘。

**不拥有 / 非目标**

- 宿主内边距的发布、嵌套或覆盖层重置——由 `architecture:container-padding` 拥有。
- Button 或 List 的边缘投影。
- `flush` 或 `outset` 取值，或逐边缘应用——除非有单独的证明与所有者批准。
- 对导航/标签页语义、选中状态、键盘行为或溢出所有权的更改。

## Public concepts

| 概念     | 封闭取值或状态          | 含义                                                                                                                      | 按变体/方向/状态可用性                | 默认值           | 所有者              | 稳定性                | 无效取值行为                            |
| -------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ---------------- | ------------------- | --------------------- | --------------------------------------- |
| 边缘处理 | 省略、`padded`、`bleed` | `bleed`：消耗两个继承的内联宿主内缩，将边缘标签页内容移向宿主线，同时保留本地交互与条带拥有的几何；`padded`：当前默认几何 | 当前布局/溢出状态下的导航与标签页模式 | 省略（`padded`） | `component:TabList` | 已接受；规范 API 待定 | 其他取值会被公共类型拒绝                |
| 旧别名   | 省略、`false`、`true`   | `padded` 或 `bleed` 的兼容拼写                                                                                            | 直到下一个小版本                      | 省略/`false`     | `component:TabList` | 已弃用                | `true` 映射到 `bleed`；显式 `edge` 优先 |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                       | 依据                                                              | 状态                             |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- | -------------------------------- |
| FR1 | 当前按需启用必须保持为 `bleed` 处理：外层 TabList 盒子消耗完整的继承内联宿主内缩，任何 `hasDivider` 分隔栏都跨越该扩展后的宽度；内部条带在每个逻辑边缘恢复 `max(host inset - edge-tab padding, 0)`。仅当宿主内缩至少等于标签页内边距时，可见的边缘标签页内容才到达宿主线；否则它向该线移动但不越过宿主边界。 | 当前源码与 `component:TabList/DEC-1`                              | 已发布行为                       |
| FR2 | 补偿必须保留 Tab 交互内边距、焦点环空间、溢出检测与控件、滚动访问、选中指示器几何，以及可选分隔栏扩展后的内联跨度。                                                                                                                                                                                          | 当前源码加上所有者指示                                            | 已发布行为；重命名时需要扩展证据 |
| FR3 | `edge?: 'padded' \| 'bleed'` 必须成为规范 API，其中 `bleed` 选择 FR1–FR2 几何，`padded` 为省略时的默认值，且二者均不改变。                                                                                                                                                                                   | `architecture:container-padding/INV10`；`component:TabList/DEC-1` | 已接受的契约；实现待定           |
| FR4 | 在弃用窗口期内，省略 `edge` 加上 `isFullBleed={true}` 必须产生规范的 `bleed` 行为。当两个属性同时提供时，显式的 `edge` 必须保持权威。                                                                                                                                                                        | 兼容性决策                                                        | 已接受的契约；实现待定           |
| FR5 | 只有在维护中的文档/示例改用 `edge`、两条路径都有兼容性证据，并且移除包含 `[breaking]` Changeset 以及用于机械迁移使用方的 `astryx upgrade` codemod 之后，才可在下一个小版本中移除 `isFullBleed`。                                                                                                             | `component:TabList/DEC-1`；`spec:AST-017/DEC-1`                   | 已接受的契约；实现待定           |
| FR6 | `flush`、`outset` 与逐边缘应用必须保持被拒绝，直到溢出、裁剪、滚动控件、焦点环、指示器、方向与主题内边距的证据获得所有者批准。                                                                                                                                                                               | 共享边缘词汇表与 TabList 边界                                     | 已接受的边界                     |

### Allowed variation

- 布局、尺寸、角色、选中值、标签、标签页内容与溢出模式可以变化，同时保持相同的 `bleed` 含义。
- 实现可以保留当前的外层盒子/内部条带技术，或将其替换为满足 FR1–FR2 的等效几何。
- 只有当 TabList 的组件特定证据证明外层盒子、裁剪、焦点与指示器行为安全时，宿主才可以被绘制或限定边界。

### Representative states

| 状态             | 必需的不变式                                                                       | 允许的差异                                                      |
| ---------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| 默认/省略        | 当前 TabList 盒子、条带与标签页几何保持不变。                                      | 任何当前布局、角色或溢出模式。                                  |
| 规范 `bleed`     | 外层盒子消耗每个宿主内缩；仅当该内缩至少等于标签页内边距时，边缘内容才到达宿主线。 | 宿主内缩小于、等于或大于边缘标签页内边距；不对称内缩；LTR/RTL。 |
| 分隔线           | `hasDivider` 分隔栏跨越扩展后的外层内联宽度。                                      | 适配或溢出的条带。                                              |
| 旧别名           | 在兼容性窗口期内，`isFullBleed={true}` 与规范 `bleed` 几何一致。                   | 规范属性也可以同时存在。                                        |
| 溢出条带         | 滚动访问、边缘渐隐、控件与选中标签页的展示保持正确。                               | 起始/结束端独立溢出。                                           |
| 聚焦的边缘标签页 | 焦点环保持可见且局限于标签页。                                                     | 键盘或指针焦点。                                                |

### Transformation and precedence order

- **ORD1 — 公共输入。** 解析显式的 `edge`；否则在兼容性窗口期内将 `isFullBleed={true}` 映射到 `bleed`；否则使用 `padded`。
- **ORD2 — 宿主几何。** 读取匹配的继承逻辑宿主内缩，缺失值回退为零。
- **ORD3 — 组件几何。** 从 TabList 拥有的来源解析边缘标签页内边距与焦点/指示器余量，恢复每个内容内缩中不重叠的部分，并保留交互内边距与拥有的可供性。

### Performance and resources

- **PR1 — CSS 优先的几何。** 重命名不得新增观察器、监听器、状态、Effect 或渲染过程。现有溢出测量保持不变。

## Accessibility contract

- **AR1 — 交互保持稳定。** `bleed` 处理不得改变标签页/导航模式、可访问名称、选中状态、键盘移动、Tab 停靠点、焦点目标或受控值行为。
- **AR2 — 溢出保持可达。** `bleed` 几何不得裁剪或隐藏焦点环、选中指示器、可见的标签页内容，或到达屏幕外标签页所需的溢出控件。

## Design relationships

| 结构或状态        | 设计要求                                                                       | 表达权威                  | 层级角色 | 组件契约         |
| ----------------- | ------------------------------------------------------------------------------ | ------------------------- | -------- | ---------------- |
| 外层 TabList 盒子 | 消耗完整的继承内联宿主内缩；配合 `hasDivider` 时，其分隔栏跨越该扩展后的宽度。 | `component:TabList/DEC-1` | 支撑性   | FR1–FR3          |
| 内部条带          | 恢复 `max(host inset - edge-tab padding, 0)`，并拥有滚动/渐隐。                | 当前 TabList 行为         | 结构性   | FR1–FR2          |
| 边缘 Tab          | 保留交互内边距与可见的焦点/选中处理。                                          | Tab 组合                  | 显要     | FR1–FR2, AR1–AR2 |

## Family and system relationships

- `architecture:container-padding` 拥有宿主发布、共享 `edge` 词汇表、逻辑边缘语义与覆盖层重置。
- `architecture:public-component-api` 与 `spec:AST-002` 拥有公共 API 准入；`spec:AST-017/DEC-1` 拥有在已发布别名被移除时所需的破坏性分类与迁移证据。
- TabList 拥有其专门的宿主、溢出、焦点与指示器投影。

## Verification map

| 契约             | 验证                                                                                                                    | 代表性状态                                                                                               | 变异或失败预期                                                          | 审计章节               |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------- |
| FR1–FR4          | `TabList.test.tsx` 与类型/文档测试                                                                                      | 省略、规范、旧版、两者同时提供以及 `hasDivider`                                                          | 别名漂移、默认值改变、优先级错误或分隔栏跨度丢失会失败                  | `audit:TabList/api`    |
| FR1–FR6, AR1–AR2 | 真实浏览器的 TabList 几何与交互证据                                                                                     | LTR/RTL；宿主内缩小于/等于/大于边缘标签页内边距；不对称/零内缩；分隔线；适配/溢出；选中/聚焦的边缘标签页 | 边界移动错误、焦点/指示器/分隔线被裁剪、溢出不可访问或滚动回归会失败    | `audit:TabList/visual` |
| FR5 与文档       | `TabList.doc.mjs`、Storybook、`[breaking]` Changeset、`astryx upgrade` codemod 测试，以及 `scripts/check-knowledge.mjs` | 规范示例、已弃用别名与移除迁移                                                                           | 缺少迁移指南、Changeset 类别错误、缺少 codemod 重写或规范用法过时会失败 | `audit:TabList/docs`   |

## Decision log

### DEC-1 — TabList migrates from full-bleed wording to edge compensation

**参考：** `component:TabList/DEC-1`

**决策者：** cixzhang, 2026-09-21

TabList 的当前模式消耗完整的继承内联宿主内缩，在该扩展宽度上保留可选的分隔线，并且只恢复边缘标签页内边距尚未提供的那部分内容内缩。因此，面向用户的意图是边缘补偿，而不是承诺标签页内容本身到达外边缘。DEC-2 设定规范拼写；`isFullBleed` 在下一个次版本以 `[breaking]` 移除之前保持为兼容别名，并附有所需的 codemod 与发布证据。

### DEC-2 — TabList spells its mode with the shared edge vocabulary

**参考：** `component:TabList/DEC-2`

**决策者：** cixzhang, 2026-10-16

`architecture:container-padding` 将 TabList 的几何命名为 `bleed`：绘制到达宿主的 padding 边缘，内容保持在宿主内容线上；当宿主内缩更小时，则停在边缘标签页自身的 padding 处。`edge="bleed"` 是规范拼写，因此 TabList 与 List 共享一个属性名和一组取值。

## Open questions

无。

## Content boundary

本声明范围的契约不重复 TabList 完整的导航、选中、溢出或主题契约、使用方示例、实现步骤，或 List/Button 投影。那些仍归其指定的所有者。
