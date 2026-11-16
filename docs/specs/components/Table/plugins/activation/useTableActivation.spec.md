---
schema_version: 3
template_version: 4
kind: module
id: module:Table/useTableActivation
authority: current
archive_reason: null
superseded_by: null
approved_by: humbertovirtudes
approved_at: 2026-11-03
owners: [cixzhang]
review_triggers:
  [public-api, behavior, layout, theming, accessibility, interaction]
verified_by:
  [
    packages/core/src/Table/plugins/activation/useTableActivation.test.tsx,
    packages/core/src/Table/__tests__/TableActivation.a11y.chromium.spec.ts,
    packages/core/src/Table/Table.perf.test.tsx,
    scripts/check-knowledge.mjs,
  ]
parent_component: component:Table
references:
  [
    architecture:component-theming-surface,
    architecture:interaction-modality,
    architecture:public-component-api,
    spec:AST-002,
    spec:AST-009,
  ]
---

# useTableActivation module contract

## Contract at a glance

| Area                    | Contract                                                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | `useTableActivation<T>` 返回一个 `TablePlugin<T>`；其唯一的配置字段是受控的 `activeKey`、`onActivate` 以及可选的 `getIsItemActivatable`。   |
| Behavior                | 符合条件的扁平产品行在主体点击时，或在非归属处理器之后按 Enter/Space 时请求激活；规范身份、取消、后代控件以及相交的文本选区会对此请求设门。 |
| End-user impact         | 一个产品行锚定相邻的详情或预览状态，但不会成为选区、导航或焦点的所有者。                                                                    |
| Builder impact          | 调用方提供显式、稳定且唯一的 `idKey`，控制活动键，并拥有相邻内容；不存在第二个提取器、交互模式或主题状态作为公共内容。                      |
| Compatibility/readiness | 增量的且未发布。规范性模块与父级契约已完成；实现与发布验证仍是独立要求。                                                                    |
| Review checks           | 拒绝隐式身份、多个整行所有者、非扁平 opt-in、嵌套控件激活、竞争的绘制写入者、仅靠颜色的活动提示、固定单元格分歧，或杜撰的批准/证据。        |
| Governing rules         | `component:Table` 拥有组合，包括 FR16-FR21 与 DEC-4/DEC-5；共享的模态、公共 API、主题与证据规则保留其各自所有者。                           |

此表是审查投影；下文正文定义当前契约。

## Intent

`useTableActivation` 为扁平的数据驱动 Table 提供一个受控的当前产品行，用于主从、预览与检查器布局。它消费父级解析出的身份、请求激活，并通过既有的行解剖结构反映状态。激活既不是选中集合操作，也不是导航承诺，更不是焦点。

## Compatibility and migration

- 保留的发布默认值：`yes`；该能力为 opt-in，旧回调保留其既有参数与行为。
- 兼容性类别：增量的未发布 hook；不受支持的新能力组合会被中和，但不会禁用旧插件。
- 迁移决策：`module:Table/useTableActivation/DEC-1` 与 DEC-5。

使用方签名、导入、示例与迁移说明属于该模块的使用方文档。本当前记录定义完整的规范性模块契约；实现与发布验证仍与所有者批准相互独立。

## Ownership boundary

**拥有**

- 受控激活、产品行资格判定、请求边界，以及模块所拥有的活动状态反映。
- 主体点击与 Enter/Space 的对等性、既有处理器优先的取消，以及后代/portal/文本选区隔离。
- 对父级行绘制解析器、活动提示、有界更新与证据义务的贡献。

**不拥有 / 非目标**

- 插件聚合排序、规范身份校验、行种类/准入元数据、整行所有权、渲染计划、视口与绘制协调：`component:Table`。
- 选区与 `aria-selected` 仍归选区所拥有；导航专用的 `aria-current` 值（如 `page`、`step` 或 `location`）仍归导航所拥有。本模块只拥有 `aria-current="true"`，用以标识驱动相邻内容的符合条件产品行；详情内容及其加载仍归调用方所拥有。
- 树形、分组、展开详情、自定义行或子级模式的激活；悬停激活；自动焦点移动或预取。
- v1 中新增的公共主题目标，或由主题编写的 `active` 状态。

## Public API and concepts

公开 hook 返回 `TablePlugin<T>`。`activeKey` 接受 `string | number | null`；`onActivate(item, key)` 返回 `void`；可选的 `getIsItemActivatable(item)` 返回 `boolean`。v1 没有其他配置字段。调用方从不需要第二个键提取器或 DOM 标记约定。

| Concept      | Closed values or states              | Meaning                                  | Default                | Owner                  | Stability          |
| ------------ | ------------------------------------ | ---------------------------------------- | ---------------------- | ---------------------- | ------------------ |
| Active key   | 有效的规范字符串/有限数字，或 `null` | 与父级键严格相等；`null` 表示非活动。    | 受控                   | 通过本模块的调用方     | 未发布；契约已完成 |
| Eligibility  | 合格或惰性                           | 有效且已准入的产品行，加上调用方谓词。   | 所有已准入产品行均合格 | 本模块与父级准入       | 未发布；契约已完成 |
| Request      | `(item, key)`                        | 发出同一个规范键，且不修改调用方状态。   | 无隐式更新             | 通过本模块的调用方     | 未发布；契约已完成 |
| Input        | 主体点击、Enter、Space               | 仅按压激活；没有悬停或导航模式。         | 三者皆可               | 本模块                 | 未发布；契约已完成 |
| Presentation | 非活动或活动                         | 既有解剖结构、解析后的填充与非颜色标记。 | 非活动                 | 本模块；父级绘制解析器 | 未发布；契约已完成 |

## Behavioral contract

| ID   | Approved invariant                                                                                                                                                                                                                                                                                                                                      | Basis                 | Verification obligation          |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------------- |
| FR1  | 一个已挂载的 hook 返回一个稳定插件；已挂载的组合行处理器在读取当前配置时保持稳定。                                                                                                                                                                                                                                                                      | 父级身份契约；DEC-1   | 契约已完成；实现证据待补充       |
| FR2  | 激活要求显式、稳定且唯一的 `idKey`，以及父级提供的有效规范身份。属性名键用 `String` 转换有效的原始字符串或有限数字；函数键保留其字符串/有限数字类型。比较为严格比较，回调发出的正是该键。缺失、无效、重复或未知身份在所有构建中都保持惰性，并伴随父级拥有的去重开发诊断。                                                                               | 父级 FR16；DEC-1      | 契约已完成；父级审查与证据待补充 |
| FR3  | 只有与 `activeKey` 匹配的合格行才暴露模块拥有的 `data-active`、`aria-current="true"` 与活动呈现。其他行只移除这些模块拥有的贡献。当前项状态表达的是哪一行驱动相邻内容，而不是选区或导航；不会推断出 `aria-selected`、`aria-current="page"` 或替换的行角色。若已存在不兼容的当前状态所有者，则该行的激活变为非活动并给出开发诊断，而不是覆盖其语义状态。 | DEC-1/DEC-3           | 契约已完成；证据待补充           |
| FR4  | 资格判定同时管辖交互与呈现。匹配行一旦变为不合格，就失去激活处理器、模块键盘可供性、活动属性、填充与标记；它保留先前的 props，且绝不修改 `activeKey`。合成行无论谓词如何都保持惰性。                                                                                                                                                                    | DEC-1/DEC-5           | 契约已完成；证据待补充           |
| FR5  | 被允许的主体点击，或不重复的 Enter/Space，会在每个已组合的非归属处理器之后调用一次 `onActivate`。`preventDefault` 取消激活，同时保留先前的副作用；已累积的处理器不会被替换。                                                                                                                                                                            | 父级 FR17；DEC-4      | 契约已完成；证据待补充           |
| FR6  | 嵌套的原生控件（含只读控件）、可编辑内容、规范的交互角色边界，以及目标位于行之外的 portal 事件，都不会激活该行。当任一选中范围与本行相交时，未折叠的选区会抑制点击激活；无关的或持续存在的选区不会抑制 Enter 或 Space。                                                                                                                                 | DEC-4                 | 契约已完成；证据待补充           |
| FR7  | 只有当先前的 props 省略了 `tabIndex` 时，合格行才默认 `tabIndex=0`；显式的 `-1` 或其他焦点所有权得以保留。以编程方式获得焦点的合格行可以激活。`Enter Space` 与既有的 `aria-keyshortcuts` 组合，不产生重复令牌，也不替换行角色。                                                                                                                         | DEC-2                 | 契约已完成；证据待补充           |
| FR8  | 辅助点击、悬停与重复的 Enter 永不激活。重复的 Space 在通过相同的边界/取消门槛后阻止滚动，但不激活。被允许的不重复 Space 会阻止其滚动默认行为。                                                                                                                                                                                                          | DEC-4                 | 契约已完成；证据待补充           |
| FR9  | V1 只准入父级的扁平产品行渲染计划与一个已声明的整行所有者。树形/分组/详情/自定义模型以及竞争的展开/导航所有权，会在所有构建中中和激活，且与插件名称或插入顺序无关，并给出去重的开发诊断。旧有行为仍然可用。                                                                                                                                             | 父级 FR17-FR18；DEC-5 | 契约已完成；父级审查与证据待补充 |
| FR10 | 单一父级行绘制解析器将下矩阵应用于普通单元格与固定单元格。当行被选中且 `hasRowHighlight=true` 时，选区淡染优先于活动填充；否则活动填充优先于悬停/条纹。活动标记与焦点指示保持独立。不允许第二个命令式背景/覆盖层写入者。                                                                                                                                | 父级 FR21；DEC-3      | 契约已完成；父级实现与证据待补充 |
| FR11 | 子级模式、空状态行、合成行与被排除的行不会获得任何激活增添。卸载行或 hook 会释放资源，且不会在新行代际上留下回调或绘制。                                                                                                                                                                                                                                | DEC-5；资源边界       | 契约已完成；证据待补充           |
| FR12 | 在键有效且唯一时，仅改变 `activeKey` 不会替换插件、处理器、列或产品数据，也不会让无关行发生 React 重渲染。只有旧/新活动的已挂载行会改变激活反映；离屏行在被挂载时反映当前状态。                                                                                                                                                                         | 有界更新契约          | 契约已完成；证据待补充           |

### Transformation and precedence order

- **ORD1 — 准入与资格判定。** 在应用调用方谓词之前，先消费父级校验过的身份、产品/合成种类以及扁平/所有权准入。不受支持或不合格的行保留先前贡献，只移除激活所拥有的状态。
- **ORD2 — 受控状态。** 严格比较所提供的规范键；发出同一个键。不要在激活中强制转换、使用索引兜底，或从焦点或事件推断活动状态。
- **ORD3 — 既有处理器。** 先组合非归属处理器，无论命名插件的顺序如何，都保留其副作用与取消能力。
- **ORD4 — 事件边界。** 在接受按压之前，检查目标包含关系以及共享的交互/可编辑边界。仅对点击检查选中范围相交；持续存在的文本选区不阻止 Enter 或 Space。复用或抽取规范的共享守卫；不要复制选择器目录，也不要为此导入完整的导航 hook。
- **ORD5 — 已接受的按压。** 只接受一次主体点击与不重复的 Enter/Space；仅对在其他方面合格的行手势应用 FR8 的 Space 默认处理。
- **ORD6 — 呈现。** 向父级唯一的绘制解析器贡献激活状态；保留先前的 refs、children、classes、styles、属性与焦点所有权。
- **ORD7 — 父级管线。** 声明 `rowModel: 'flat'` 与 `wholeRowOwner: 'activation'`；使用父级的顺序变换与声明式所有权/准入，而不是私有管线或插件名检查。

### Active, selection, and focus matrix

| Selection  | Activation | `hasRowHighlight` | Effective normal/pinned fill and cue                        |
| ---------- | ---------- | ----------------- | ----------------------------------------------------------- |
| Unselected | Inactive   | Either            | 既有的基础、条纹、悬停以及独立的焦点处理。                  |
| Selected   | Inactive   | `true`            | 既有的选区淡染；选区语义保留。                              |
| Selected   | Inactive   | `false`           | 无选区淡染；基础/条纹/悬停与选区语义保留。                  |
| Unselected | Active     | Either            | 组件拥有的活动兜底填充（高于悬停/条纹），外加行内起始标记。 |
| Selected   | Active     | `true`            | 选区主导的淡染加行内起始活动标记；选区语义保留。            |
| Selected   | Active     | `false`           | 活动兜底填充加标记；不会重新引入选区淡染；选区语义保留。    |

每个行在“选区优先”与“激活优先”的更新中都应用相同结果，包括在两种状态同时存在时切换 `hasRowHighlight`。焦点始终独立：焦点轮廓从不是活动提示。标记是既有行/单元格解剖结构上的可见行内起始装饰，独立于颜色，不引入额外的数据列、控件或公共目标。它遵循文本方向，在固定单元格遮挡下仍可见，并在浅色、深色与强制颜色模式下保持可区分。`hasRowHighlight=false` 只回收选区所拥有的淡染；它不会禁用激活，也不改变任何选区语义。

### Performance and resources

- **PR1 — 恒定的本地工作。** 键比较、状态反映与普通事件守卫增加 O(1) 的行本地协调；选中范围检查随选中范围的数量缩放，而不随数据集规模缩放。每次相关的行更新最多解析一次资格。激活不会重复父级的全数据集校验。
- **PR2 — 稳定身份。** 插件与已挂载处理器在键/回调/谓词变化时保持稳定，同时观察其当前值。
- **PR3 — 有界的活动更新。** FR12 的旧/新行界限适用于仅键更新；资格、数据、选区或主题变化保留各自的作用域。
- **PR4 — 有界生命周期。** 保留的资源随已挂载行缩放，并在行/hook 卸载时完全释放，包括虚拟行回收。

## Accessibility contract

- **AR1 — 原生语义。** 行保留原生 table 角色；激活不添加 button/link 角色或选区语义。活动合格行上的 `aria-current="true"` 暴露其当前项关系，而不使用导航专用值。DOM 与计算无障碍树检查会验证该暴露；不承诺任何特定的朗读短语或虚拟光标行为。
- **AR2 — 键盘对等。** 默认顺序焦点、更早的 roving/编程焦点、组合快捷键、Enter/Space，以及可见且未被遮挡的焦点，满足所准入的键盘模型。有代表性的大型未虚拟化表格需要浏览器焦点顺序证据。
- **AR3 — 独立控件。** 原生只读控件、交互角色后代、可编辑内容与 portal 保持可独立到达并可操作，无需激活行。
- **AR4 — 状态诚实。** 不合格、缺失或不匹配的行不暴露任何模块拥有的当前状态；最多一个合格且键唯一的行暴露 `aria-current="true"`。改变受控键会同时移动当前状态暴露与可见标记；`activeKey=null` 会移除两者。既有的选区/导航语义仍由各自所有者独立拥有。
- **AR5 — 非颜色状态。** 行内起始标记在浅色/深色/强制颜色以及普通/固定状态下，独立于填充与焦点传达活动状态（WCAG 2.2 SC 1.4.1）。
- **AR6 — 模态对等。** 主体指针、触摸生成的点击与键盘共享按压所拥有的激活；悬停永不改变活动状态。
- **AR7 — 证据层次。** 单元、DOM、无障碍树、axe 与浏览器证据仍待补充。只有在 `spec:AST-009` 下出现依赖 AT 的结果或已记录分歧时，才需要真实 AT；本模块不引入任何播报声明。

## Design relationships

| Anatomy or state | Design requirement                      | Representation authority | Module contract  |
| ---------------- | --------------------------------------- | ------------------------ | ---------------- |
| 可激活行         | 原生结构与独立的单元格控件。            | 本模块；共享模态所有者   | FR5-FR9, AR1-AR3 |
| 活动行           | 可追溯的标记与一个一致的普通/固定填充。 | DEC-3；当前契约          | FR3, FR10, AR5   |
| 获得焦点的行     | 焦点与受控活动状态保持可区分。          | 既有焦点所有者           | FR7, AR2, AR5    |
| 选区             | 淡染的退出机制与语义保持独立。          | 选区所有者；父级解析器   | FR9-FR10         |

### Design decisions

<!-- design-decisions:v1 -->

| ID  | Decision                                         | Intent or reason                                   | Applies to       | Allowed variation                                                                   |
| --- | ------------------------------------------------ | -------------------------------------------------- | ---------------- | ----------------------------------------------------------------------------------- |
| DD1 | 活动行具有可见的行内起始标记，独立于颜色与焦点。 | 当前驱动详情的状态在选中行与固定单元格旁仍可识别。 | 所有活动的合格行 | 在既有解剖结构内进行 token/像素调优；不新增列、控件、目标或公共 `active` 主题状态。 |

## Parent and system relationships

- `component:Table` FR16 与 DEC-4 拥有全数据集身份校验与去重诊断。新能力路径用带类型的内部 React 键区分函数键 `0` 与 `"0"`；激活仍发出原始规范键。旧有键行为不变。
- 父级 FR17 向 `transformBodyRow` 提供可选的第四个 `TableRowContext`：规范 `key`、`identityStatus`、`kind`（`product`、`synthetic`、`unknown`）、`logicalIndex`、`logicalRowCount`、`headerRowCount` 以及渲染上下文。FR18 拥有单元格前的计划/扁平准入。只有已准入的扁平行具有产品种类；不受支持的结构模型会在变换之前禁用扁平能力，并且可能暴露未知种类。缺失/未知的上下文或非产品种类会让激活保持惰性；旧回调保持不变。
- 父级可选的 `rowModel: 'flat' | 'tree' | 'grouped' | 'detail' | 'custom'` 与 `wholeRowOwner: 'activation' | 'expansion' | 'navigation'` 声明在没有名称/顺序的情况下决定准入。未声明的自定义 body 修饰符需要显式的父级兼容声明。本模块不发明其语法。
- 父级 FR19-FR21 与 DEC-5 拥有共享的双轴视口、虚拟的完整逻辑元数据以及唯一的绘制协调。必需的源码改动仍是未实现的证据目标，而不是来自既有并行选区写入者的证明。
- 父级与模块契约共同定义联合的扁平选区、排序、过滤、固定列、上下文菜单、行索引、加载与窗口化准入。非扁平的旧插件在激活准入之外保留其自身行为。
- 共享模态、公共 API、主题与 `spec:AST-009` 证据规则保留 frontmatter 中所列的所有者。父级新增内容仍归 `component:Table` 拥有。

## Verification map

下文每个条目都是必需的验证目标，而不是已完成的实现证据；frontmatter 的文件列表保留这些目标，但不声称它们已存在或通过。

| Contract                    | Verification                                                                       | Representative states                                                                                                    | Mutation or failure expectation                                                                |
| --------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| FR1-FR4, FR11-FR12, PR1-PR4 | 待补充的激活单元测试套件与 `Table.perf.test.tsx`：身份、计数、受控状态、生命周期。 | 空/缺失/无效/重复键；属性 `"42"` 与 `42`；函数 `0` 与 `"0"`；资格翻转；回收。                                            | 频繁变动、强制转换、多个活动重复项、不合格呈现、无关重渲染、超过两次仅键改动或泄漏均判定失败。 |
| FR5-FR9, ORD1-ORD7          | 待补充的单元/浏览器组合测试与已发布的交互路径测试。                                | 主体/辅助点击，Enter/Space/重复；只读/可编辑/portal 控件；锚点在行外但与本行相交的选中范围；无关选区；取消。             | 替换处理器、重复请求、重复 Space 滚动、嵌套激活、仅按锚点抑制，或丢失先前的 `-1` 均判定失败。  |
| FR10, DD1, AR5-AR6          | 待补充的规范视觉覆盖与浏览器证据。                                                 | 所有六个矩阵行、两种更新顺序、高亮切换、悬停/焦点、浅色/深色/强制颜色、LTR/RTL、普通/固定。                              | 依赖顺序的淡染、隐藏或仅靠颜色的标记、用焦点作为活动提示，或固定状态不匹配均判定失败。         |
| AR1-AR7                     | 待补充的 `TableActivation.a11y.chromium.spec.ts`、DOM/树、axe、浏览器键盘/触摸。   | 小型/大型扁平表格；默认、roving、编程焦点；控件；活动/空/不合格/已移除键、单一当前状态暴露、不兼容的既有当前状态所有者。 | 虚假角色/状态、不可用快捷键、不一致的焦点顺序，或后代激活均判定失败。                          |
| Plugin composition          | 待补充的聚焦集成测试，加上既有的选区/排序/过滤/固定/上下文菜单套件。               | 两种插件顺序；扁平加载/窗口组合；非扁平与自定义修饰符；竞争所有者。                                                      | 按名称/顺序准入、不受支持的新能力，或丢失旧处理器/props 均判定失败。                           |
| Public API and docs         | 待补充的编译测试夹具、清单、`.doc.mjs`、Storybook 与 recipe。                      | 三字段的泛型受控配置；显式身份；所有按压路径。                                                                           | 第二个提取器、公共模式/主题状态、缺失导出，或悬停承诺均判定失败。                              |
| Structural ownership        | `pnpm check:knowledge` 结构检查；实现证据另行处理。                                | 当前模块、父级反向链接、schema 3/template 4。                                                                            | 缺失、孤立、重复、种类错误或命名错误的记录必须判定失败。                                       |

## Decision log

### DEC-1 — Controlled canonical identity and eligibility

**参考：** `module:Table/useTableActivation/DEC-1`

**决策者：** `humbertovirtudes`，`2026-11-03`

一个由调用方拥有的活动键严格匹配并发出父级已校验的规范键。资格判定同时控制请求与呈现，但不改变调用方键。缺失、无效、未知与重复身份均保持惰性。已否决：第二个提取器、索引兜底、激活侧强制转换，或从选区/焦点推导活动状态。

### DEC-2 — Native rows support press activation

**参考：** `module:Table/useTableActivation/DEC-2`

**决策者：** `humbertovirtudes`，`2026-11-03`

合格行保留原生语义，仅当不存在更早的焦点所有者时才默认顺序焦点，并使用组合的 Enter/Space 快捷键。焦点保持独立。已否决：行 button/link 角色、仅指针操作、`aria-current="page"`，或推断的选区属性。

### DEC-3 — Selection-dominant fill and a separate active marker

**参考：** `module:Table/useTableActivation/DEC-3`

**决策者：** `humbertovirtudes`，`2026-11-03`

六状态矩阵固定了填充优先级；活动状态具有行内起始的非颜色标记，以及原生行上匹配的 `aria-current="true"`。同一个受控键同时驱动视觉暴露与计算语义暴露，即使选区在填充上胜出。一个父级解析器以任一更新顺序协调选区、激活与固定覆盖层。v1 不接纳任何公共 `active` 主题状态。导航专用的当前值与选区状态保持独立。已否决：竞争的命令式绘制写入者、仅靠焦点的活动提示，或新的激活目标/列。

### DEC-4 — Earlier handlers and gesture boundaries precede activation

**参考：** `module:Table/useTableActivation/DEC-4`

**决策者：** `humbertovirtudes`，`2026-11-03`

非归属处理器先运行，且可以取消。共享交互守卫与 portal 包含关系对主体点击和 Enter/Space 设门。选中范围相交只抑制点击；持续存在的选区不阻止键盘激活。已否决：悬停激活、复制的选择器目录、整份导航 hook 导入，或仅按锚点的选区检查。

### DEC-5 — Flat admission and declarative ownership

**参考：** `module:Table/useTableActivation/DEC-5`

**决策者：** `humbertovirtudes`，`2026-11-03`

父级上下文与声明准入带有单一整行所有者的扁平产品行。非扁平、未知自定义 body 与竞争所有者的组合会确定性地中和激活，同时保留旧插件行为。已否决：从插件名称、插入顺序、键前缀或 DOM 标记推断行种类/所有权。

## Open questions

无。规范性契约已完成。实现与发布验证仍与契约批准相互独立。

## Content boundary

本记录以链接方式引用而不复制使用方示例、父级协议、共享模态/主题规则、审计结果、实现计划，或产品选区/导航/详情/加载的所有权。
