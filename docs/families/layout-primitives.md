---
schema_version: 1
template_version: 1
kind: family
id: family:layout-primitives
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-08-30
owners: [cixzhang, imdreamrunner]
review_triggers: [public-api, layout, theming]
verified_by:
  [
    packages/core/src/Stack/Stack.test.tsx,
    packages/core/src/Stack/StackItem.test.tsx,
    packages/core/src/Grid/Grid.test.tsx,
    packages/core/src/Center/Center.test.tsx,
  ]
members:
  [
    component:Stack,
    component:HStack,
    component:VStack,
    component:StackItem,
    component:Grid,
    component:GridSpan,
    component:Center,
  ]
architecture:
  [
    architecture:container-padding,
    architecture:public-component-api,
    architecture:component-theming-surface,
  ]
contributing: []
deciding_specs: []
---

# Layout primitives contract

## Intent

构建者应当能够在一维或二维中排列任意内容、将其居中、设置其布局盒子的尺寸，并用同一套小词汇表达空间关系。选择 Stack、Grid 或 Center 只会改变排列模型；它不会创建第二套间距刻度，也不会为共享的 prop 名称带来新的含义。

## Membership rule

当组件的主要公共职责是通过共享的布局原语词汇排列任意子内容时，该组件即属于本家族。当修饰符改变某个子级在这种排列中的参与方式时，该修饰符与其父级归为一类。

- **成员：** Stack 及其 HStack、VStack 便捷形式、StackItem、Grid、GridSpan 和 Center。
- **协作者：** 共享的 `SpacingStep` 和 `SizeValue` 类型；Stack 和 StackItem 的样式工具；`padding.stylex.ts`；容器内边距架构；组件的 `.doc.mjs` 主题元数据与运行时 `themeProps()` 输出。
- **排除：** Section、Layout 及其命名区域，以及 Toolbar，拥有的是结构区域契约，而不是本家族的任意子级流、网格和居中词汇。Layout 是通用原语，但其公共模型是五个命名槽位，而不是不受限制的子级排列。FormLayout 拥有字段排列和表单级可选性。AspectRatio 约束单个子级的盒子，而不是排列任意子级。Card 和 Dialog 是表面。AppShell 拥有页面外壳和应用导航组合。

成员资格遵循公共职责，而不是实现机制。组件不会仅仅因为其源码使用 flexbox 或 grid 就加入本家族。

## Shared owner

- `SpacingStep` 拥有成员 gap 和 padding prop 所使用的公共数字间距词汇。
- `SizeValue` 拥有成员盒子尺寸的“数字即像素、字符串即 CSS 值”契约。
- Stack 拥有一维方向、换行以及主轴/交叉轴对齐。HStack 和 VStack 是该契约的固定方向形式。
- Grid 拥有固定和固有/流体轨道的构建。GridSpan 拥有单个子级的行和列参与。
- Center 拥有沿一个或两个轴的居中。
- `architecture:container-padding` 拥有出血几何。应用本地内边距本身不会发布该协议。

## Canonical concepts

| 概念     | 取值或状态                                                 | 默认语义                                             | 稳定性          |
| -------- | ---------------------------------------------------------- | ---------------------------------------------------- | --------------- |
| 间距档位 | `0`, `0.5`, `1`, `1.5`, `2`, `3`, `4`, `5`, `6`, `8`, `10` | 受支持的 gap 或 padding prop 的、由 token 支撑的距离 | current         |
| 盒子尺寸 | 数字或 CSS 值字符串                                        | 数字是像素；字符串作为 CSS 值原样传递                | current         |
| 流动方向 | 水平或垂直                                                 | Stack 默认为垂直；HStack/VStack 固定方向             | current         |
| 对齐     | 主轴/交叉轴或物理水平/垂直别名                             | 当前生效的排列模型解析坐标轴                         | current         |
| 间隙     | 支持时，统一、行或列                                       | 排列项之间的空间，而非容器内缩                       | current         |
| 内边距   | 支持时，统一、轴向或逻辑边缘                               | 成员自身盒子内部的空间                               | current         |
| 条目参与 | 固有、填充、自对齐、列跨度或行跨度                         | 修饰符改变单个子级在其父级排列中的角色               | current         |
| 响应性   | 固有、换行或使用方编写                                     | 每个成员自行记录其可用的机制                         | component-owned |

## Cross-component invariants

- **FR1 — 共享名称保持共享的取值语义。** 类型为 `SpacingStep` 或 `SizeValue` 的成员 prop 遵循共享的取值与强制转换契约。成员只暴露其排列模型支持的能力。
- **FR2 — 逻辑间距遵循书写方向。** 行内起始和结束是逻辑边缘。成员不会将它们重新解释为固定的左和右。
- **FR3 — 内边距优先级按边缘生效。** 对于具备完整内边距阶梯的成员，显式边缘值优先于其轴向值，轴向值优先于统一 `padding`；覆盖只改变该边缘。
- **FR4 — 间隙与内边距保持区分。** 间隙分隔排列项。内边距在成员内部收缩内容。Grid 的 `rowGap` 和 `columnGap` 仅在其轴向上覆盖统一 gap。
- **FR5 — 对齐遵循排列模型。** Stack 根据方向解析主轴和交叉轴。Grid 在轨道中对齐条目。Center 控制居中一个还是多个轴。当一个成员的 prop 含义会不同时，它不会复制另一个成员的 prop。
- **FR6 — 修饰符组件需要其父级模型。** StackItem 控制对 Stack 的参与；GridSpan 控制对 Grid 的参与。它们的组件契约拥有在预期父级之外的行为。
- **FR7 — 响应式行为是显式的。** Grid 可能根据固有轨道计算重新流动；Stack 仅在配置时换行；Center 不创建断点。本家族不承诺共享断点或自动区域切换。
- **FR8 — 本地内边距不是出血信号。** Stack 和 Center 当前应用内边距而不发布容器内缩几何。后代只有在 `architecture:container-padding` 指定的发布者之下才能依赖出血补偿。
- **FR9 — 公共契约不规定源码结构。** 只要可观察的 API 和行为保持正确，组件可以使用成员工具或直接使用平台布局。

## Allowed component variation

- **AV1 — 排列模型。** Stack 使用一维流，Grid 使用二维轨道，Center 使用单轴或双轴对齐。
- **AV2 — 可用 prop。** Stack、HStack、VStack 和 Center 暴露完整的逻辑边缘内边距阶梯。Grid 暴露按轴区分的间隙。修饰符组件暴露父级特定的参与方式，而不是盒子级布局控制。
- **AV3 — 元素所有权。** Stack、HStack、VStack 和 StackItem 是多态的。Grid、GridSpan 和 Center 当前拥有固定的 div 元素。
- **AV4 — 溢出。** Stack、HStack、VStack 和 StackItem 暴露其当前的滚动行为；Grid 和 Center 不会通过家族成员资格获得该行为。
- **AV5 — 响应性。** Grid 的固有列、Stack 的换行以及使用方编写的响应式样式仍然因组件而异。
- **AV6 — 实现。** 原始 flex/grid 和共享工具都允许。家族成员资格不会为仅涉及实现的选择制造迁移债务。
- **AV7 — 主题。** 当前的组件 `.doc.mjs` 元数据记录已发布的目标和能力，运行时 `themeProps()` 调用会输出它们。`architecture:component-theming-surface` 拥有跨组件规则。组件规范可以在解剖结构映射存在时添加可选的映射元数据；本家族不假定或替代此类规范。

## Representative matrix

| 成员与状态                | 共享不变量                         | 有意差异                                                                   |
| ------------------------- | ---------------------------------- | -------------------------------------------------------------------------- |
| Stack / 垂直或水平        | 共享间距和尺寸取值；方向解析对齐轴 | 可以换行、滚动或渲染选定的元素                                             |
| HStack 或 VStack          | 固定方向的同一 Stack 契约          | 更窄的对齐类型匹配固定轴                                                   |
| StackItem / `size="fill"` | 一个子级可以占用 Stack 的剩余空间  | `isScrollable` 将溢出与 StackItem 的 flex 最小值重置配对                   |
| Grid / 固定列             | 共享尺寸和间隙取值                 | 显式的 `1fr` 轨道数量（`columns={N}`）；从不重新流动；最小内容可能撑宽轨道 |
| Grid / 固有列             | 共享尺寸和间隙取值                 | `{minWidth, max?, repeat?}` 构建可重新流动的流体轨道                       |
| GridSpan / 列或行         | 修饰符参与 Grid                    | 跨越轨道，而不是控制父级几何                                               |
| Center / 一个或两个轴     | 共享尺寸和内边距取值               | 在居中可被观察之前，需要该轴上有可用尺寸                                   |

## Adoption and exceptions

| 组件或关注点          | 采用情况               | 当前差距或例外                                             |
| --------------------- | ---------------------- | ---------------------------------------------------------- |
| Stack、HStack、VStack | 共享的一维契约         | gap token 映射与 Grid 的映射分开实现                       |
| StackItem             | 共享的修饰符契约       | 不存在家族范围的 flex-item grow/shrink/basis 词汇          |
| Grid、GridSpan        | 共享的二维契约         | 没有跨组件测试证明 Grid 和 Stack 同等地解析相同的 gap 档位 |
| Center                | 共享的尺寸和内边距词汇 | 与 Stack 一样，其内边距是本地行为，不发布出血几何          |
| 共享验证              | 按组件划分的单元覆盖   | 没有计算样式矩阵证明每个共享间距和尺寸取值在所有成员中一致 |

这些是已发布的覆盖或采用差距，并不授权在文档拉取请求中添加 prop 或更改布局行为。

## Change coupling

- 添加或更改共享空间 prop 时，检查其名称、值类型、强制转换、逻辑方向和优先级是否仍与本家族一致。
- 更改 `SpacingStep` 或 `SizeValue` 时，审查每个暴露受影响类型的成员，并更新代表性的跨组件证据。
- 更改 Stack 的方向/对齐时，在同一次受审查的变更中更新 HStack 和 VStack。
- 更改 Grid 的固有轨道构建时，通过聚焦测试保留其已记录的固定、填充、适配和上限状态。
- 将成员纳入容器出血是一项单独的 `architecture:container-padding` 变更，需要渲染后的兼容性证据。
- 新组件只有在其公共职责满足成员资格规则时才加入；使用 flexbox、grid 或共享工具并不充分。

## Verification map

| 契约     | 验证                                             | 证据证明了什么                                                                                            | 缺失的证据                                                                                           |
| -------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| FR1、FR3 | Stack 和 Center 源码及其 padding class-set 测试  | 对已覆盖的取值，当前合并顺序选择边缘优先于轴向、轴向优先于统一内边距，且等价写法输出相等的功能性 class 集 | 没有浏览器矩阵跨成员或两种书写方向比较计算值                                                         |
| FR2      | Stack 和 Center 中的逻辑属性源码声明             | 实现使用 inline-start/end 属性，而不是物理 left/right 属性                                                | 当前测试未在 LTR 和 RTL 下渲染内边距阶梯                                                             |
| FR4      | Stack/Grid 源码及其本地测试                      | API 将 gap 与 padding 保持分离；Grid 接受统一和轴向 gap prop                                              | Grid 的 gap/rowGap/columnGap 测试断言渲染成功，而不是计算出的间距，且没有测试将某个档位与 Stack 比较 |
| FR5      | Stack、Grid 和 Center 源码以及本地渲染测试       | 每个成员当前通过其自己的排列模型路由对齐                                                                  | Stack/Grid 测试未对已接受取值断言计算出的对齐                                                        |
| FR6      | StackItem 和 GridSpan 源码以及本地测试           | 源码将 `size="fill"` 映射到 StackItem 的填充样式；滚动会改变 class 输出；GridSpan 断言精确的行内行/列跨度 | StackItem 的填充测试仅断言渲染内容，而不是填充行为；没有集成测试证明修饰符在每种父级状态下都有效     |
| FR7      | 精确的 Grid 轨道输出测试以及 Stack/Center 源码   | Grid 的固定和固有轨道字符串被固定；Stack 仅在配置时换行；Center 没有断点路径                              | 不存在跨成员的响应式集成矩阵                                                                         |
| FR8      | 对照 `architecture:container-padding` 的源码审查 | Stack 和 Center 应用本地内边距而不发布容器内缩变量                                                        | 没有浏览器断言证明 Divider/Table 后代因此产生的非出血行为                                            |

这些测试是组件局部的，其中一些只断言渲染成功或 class 变化。它们不证明计算出的 gap、对齐、逻辑方向或跨组件一致性。那些是明确命名的验证差距，不是隐含的覆盖。

## Decision links

### DEC-1 — Composition primitives and structural regions have separate owners

**决策者：** `cixzhang`，`2026-08-30`

Stack、Grid、Center 及其修饰符构成布局原语家族。Section、Layout 区域和 Toolbar 拥有单独的结构区域所有者。这使成员资格具有可预测性：原语规则描述任意子级组合，而不把槽位、表面或工具栏语义强行塞进同一契约。

## Open questions

无。采用表中列出了缺失的能力和验证；它不会把它们变成未解决的家族政策。

## Content boundary

本记录仅拥有共享的组合词汇和行为。它不重复组件 prop 表，不规定实现机制，不定义结构区域，不分配响应式断点，也不拥有主题解剖结构和目标。
