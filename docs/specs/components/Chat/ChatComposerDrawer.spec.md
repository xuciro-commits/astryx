---
schema_version: 3
template_version: 5
kind: component
id: component:ChatComposerDrawer
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-09-21
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Chat/ChatComposerDrawer.test.tsx,
    apps/storybook/stories/ChatComposerDrawer.stories.tsx,
    apps/storybook/rtl-audit/verified-not-applicable.json,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:component-theming-surface,
    architecture:interaction-modality,
    architecture:knowledge-contracts,
    architecture:public-component-api,
  ]
contributing: [contributing:api-conventions]
system_specs: [spec:AST-002/DEC-1, spec:AST-002/DEC-2]
---

# ChatComposerDrawer component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                     |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | 添加一个可选的 `collapsedSummary?: ReactNode` 插槽，命名取自规范的 **Collapsed summary** 解剖结构部件，用于承载使用方组合的视觉内容。                    |
| 行为          | `count` 继续启用该展开/收起控件。省略 `collapsedSummary` 时保留中性的 Badge 计数加上解析后的标签；提供它则替换该完整的视觉摘要，而不改变收起行为或命名。 |
| 最终用户影响  | 默认情况下，用户保留既有的 Badge 层级。需要更安静或以不同方式组合收起行的产品，可以提供一个本地化的视觉摘要，而不削弱展开/收起的语义。                   |
| 构建者影响    | 现有调用点不变。选择该插槽的构建者拥有其视觉内容与本地化，而 `label` 继续标识受控内容，供组件自身的无障碍名称使用。                                      |
| 兼容性/就绪度 | 增量式且保持默认值不变。此记录是当前权威；该插槽及其映射实现、使用方文档、测试与渲染证据尚未发布。                                                       |
| 审查检查项    | 拒绝纯文本默认值、第二个摘要 API、改变命名或收起状态的自定义内容、视觉摘要中可到达的交互式后代，以及对无插槽路径和无 `count` 路径的任何回退。            |
| 管辖规则      | `component:ChatComposerDrawer/FR1–FR10, AR1–AR4, DEC-1–DEC-2`；`architecture:public-component-api/INV3–INV4, INV9, INV13`；`spec:AST-002/DEC-1, DEC-2`。 |

此表是审查投影；以下正文具有权威性。

## Intent

ChatComposerDrawer 在 ChatComposer 输入上方组合补充内容。当 `count` 存在时，构建者可以让人收起该内容，同时保持一个紧凑摘要可用。

两个在其他方面完全相同的抽屉，在收起状态下可能需要不同的视觉层级。产品构建者知道，是既有的计数 Badge 还是更安静的、产品特定的摘要更适合该上下文，而 ChatComposerDrawer 无法从 count、内容、布局、区域设置或收起状态中推导出这一区别。因此，该组件暴露一个视觉组合接缝，同时保留其现有默认值，并拥有全部展开/收起行为。

## Compatibility and migration

- 已发布的默认值保持不变：是。省略 `collapsedSummary` 时保留中性的计数 Badge，其后跟解析后的标签。
- 兼容性类别：增量式可选组合插槽，默认值不变。
- 受控/非受控行为：不变。
- 迁移决策：无。现有调用点无需修改。

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 抽屉表面、可选的展开/收起状态、展开/收起关联，以及收起态后代的可达性。
- 受控与非受控的收起请求。
- 保留 Badge 的默认摘要，以及由一个使用方组合的收起摘要的仅呈现边界。
- 展开/收起控件本地化的无障碍名称，独立于视觉摘要内容。

**不拥有 / 非目标**

- 使用方提供的抽屉子内容或自定义摘要内容的含义、样式或本地化。
- 自定义摘要内部的交互行为；摘要仅用于呈现，绝不创建另一个焦点或激活目标。
- ChatComposer 的输入、提交、状态与操作行为。
- 呈现枚举、Badge 开关、渲染回调、摘要专用的主题目标，或第二个无障碍名称 prop。

## Public concepts

| 概念     | 封闭取值或状态         | 含义                                                            | 按状态的可达性        | 默认值            | 所有者                         | 稳定性         | 无效值行为                                        |
| -------- | ---------------------- | --------------------------------------------------------------- | --------------------- | ----------------- | ------------------------------ | -------------- | ------------------------------------------------- |
| 抽屉内容 | 任意 React 节点        | 组合在聊天输入上方的补充内容。                                  | 始终                  | 无                | `component:ChatComposerDrawer` | 稳定           | 缺失内容会被必需类型拒绝。                        |
| 收起支持 | 不可用、已展开、已收起 | `count` 的存在（包括零）启用一个展开/收起控件并提供其摘要计数。 | 省略 `count` 时不可用 | 不可用            | `component:ChatComposerDrawer` | 稳定           | 没有 `count` 时，收起输入没有可见效果。           |
| 收起控制 | 非受控、受控           | 内部状态或 `isCollapsed` 决定当前的展开/收起状态。              | 收起支持可用时        | 非受控            | `component:ChatComposerDrawer` | 稳定           | 受控状态优先于初始默认值。                        |
| 收起摘要 | 默认、使用方组合       | 为收起态展开/收起控件显示的视觉内容。                           | 收起支持可用时        | 中性 Badge 加标签 | 使用方选择；组件接缝           | 已接受，未发布 | 省略时使用默认值；没有 `count` 时不暴露任何摘要。 |
| 收起请求 | 下一状态               | 激活时请求相反的有效收起状态。                                  | 收起支持可用时        | 无                | `component:ChatComposerDrawer` | 稳定           | 没有展开/收起控件时不会发出请求。                 |

`collapsedSummary` 是规范的 **Collapsed summary** 解剖结构部件的 camelCase 公共 API 投影。它是完整的自定义视觉摘要，而不是默认值之前或之后的追加内容。该组件不会解析、克隆、装饰该节点，也不会向其提供数据。构建者已经拥有他们作为 `count` 和 `label` 传入的值；当自定义摘要构成一句话或格式化一个数字时，其调用点拥有完整的本地化消息。

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                      | 依据                                                                      |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| FR1  | 当 `count` 存在时（包括其为 `0` 时），组件必须暴露一个具名的展开/收起控件，带有 `aria-expanded` 以及可解析的 `aria-controls` 关系。                                                                                                         | 已发布 API 与实现；WAI-ARIA 展开/收起语义                                 |
| FR2  | 指针激活、Enter 与 Space 必须恰好一次请求相反的有效收起状态。                                                                                                                                                                               | 已发布实现与公共回调契约                                                  |
| FR3  | 在受控模式下，`isCollapsed` 必须保持权威；在非受控模式下，激活必须在下一次渲染之前更新内部状态。                                                                                                                                            | 已发布实现与使用方文档                                                    |
| FR4  | 收起态的抽屉内容可以为了网格过渡而保持挂载，但其后代必须从键盘与辅助技术导航中缺席。                                                                                                                                                        | WAI-ARIA 展开/收起语义；WCAG 2.4.3 与 2.4.7                               |
| FR5  | 展开/收起控件上的键盘焦点必须通过共享的焦点指示机制保持可见可感。                                                                                                                                                                           | `architecture:interaction-modality/INV1–INV4`                             |
| FR6  | 省略 `count` 时必须直接渲染抽屉内容，不得创建展开/收起控件，也不得暴露 `collapsedSummary`。在此状态下，现有收起输入继续没有可见效果。                                                                                                       | 已发布的无 count 行为与兼容性                                             |
| FR7  | 根元素必须继续转发其 ref、BaseProps 属性与样式接缝，不得将它们移到内部子元素。                                                                                                                                                              | 已发布公共表面与 `architecture:public-component-api/INV5–INV6, INV8–INV9` |
| FR8  | `collapsedSummary` 必须保持为规范的 **Collapsed summary** 解剖结构部件的 camelCase 公共名称。省略时，收起态的展开/收起控件必须保留现有包含 `count` 的中性 Badge，其后跟解析后的 `label`；提供时，该节点必须恰好一次替换该完整解剖结构部件。 | 已批准的、与解剖结构对齐的使用方组合边界以及已发布默认值                  |
| FR9  | 自定义摘要必须只影响视觉内容。它不得改变收起是否可用、有效收起状态、切换激活、回调值、受控区域，或组件自身的无障碍名称。                                                                                                                    | 受约束的插槽契约与 `spec:AST-002/DEC-2`                                   |
| FR10 | 摘要子树必须保持仅用于呈现：展开/收起控件是唯一的焦点与激活目标，摘要后代必须从 Tab 顺序与无障碍树中缺席，自定义内容不得增加另一个操作。                                                                                                    | WAI-ARIA 展开/收起语义与组件自身的无障碍边界                              |

### Allowed variation

- **AV1 — 抽屉子内容组合。** 构建者选择抽屉内容及其自身的语义。
- **AV2 — 自定义摘要组合。** 构建者可以组合任何符合仅呈现边界的视觉内容，包括本地化文本或现有 Astryx 展示组件。
- **AV3 — 摘要生命周期。** 组件可以在视觉上展开时保持默认或自定义摘要挂载，以保留动画。调用方不得依赖挂载或卸载时机。
- **AV4 — 自定义摘要样式。** 使用方组合的内容保留其所用组件的样式与主题接缝。ChatComposerDrawer 不添加摘要专用目标。

### Representative states

| 状态               | 必需不变式                                                                      | 允许的变化                       |
| ------------------ | ------------------------------------------------------------------------------- | -------------------------------- |
| `count` 省略       | 内容可见；不暴露展开/收起控件或摘要。                                           | 子内容与根样式。                 |
| 默认摘要，已收起   | 一个展开/收起控件显示中性的计数 Badge 加解析后的标签。                          | 计数值与本地化标签。             |
| 自定义摘要，已收起 | 一个展开/收起控件显示使用方节点，替代两个默认摘要部分。                         | 仅用于呈现的自定义内容与样式。   |
| 自定义摘要，已展开 | 展开/收起控件保留其状态与名称；自定义摘要可以保持挂载，但在视觉上与语义上隐藏。 | 内部交叉淡入淡出与挂载时机。     |
| 受控展开或收起     | 渲染状态遵循 `isCollapsed`；激活时报告请求的下一状态。                          | 父级的时机以及它是否接受该请求。 |

### Transformation and precedence order

- **ORD1 — 收起可用性。** `count` 存在 → 启用展开/收起控件；`count` 省略 → 无展开/收起控件或收起摘要。
- **ORD2 — 有效状态。** `isCollapsed` 已定义时 → 否则为从 `defaultIsCollapsed` 初始化的内部状态。
- **ORD3 — 视觉摘要。** 使用方提供的 `collapsedSummary` → 否则为 `count` 的中性 Badge，其后跟解析后的 `label`。
- **ORD4 — 无障碍名称。** 从 prop 或本地化目录解析 `label` → 使用目录中针对有效状态的展开或收起操作消息。视觉摘要内容绝不进入或覆盖此管道。

### Performance and resources

- **PR1 — 仅本地状态。** 摘要接缝不得需要 Effect、观察者、监听器、计时器或外部资源。

## Accessibility contract

- **AR1 — 展开/收起关系。** 切换控件暴露一个本地化名称、展开状态，以及一个可解析的受控内容 ID。
- **AR2 — 命名保持组件所有。** `label` 在展开/收起目录消息中标识受控的抽屉内容。默认或自定义视觉摘要文本不得替换、重复或拼接到该无障碍名称中。
- **AR3 — 隐藏内容不可用。** 视觉上收起的抽屉后代在展开之前不可用。
- **AR4 — 自定义摘要保持仅用于呈现。** 自定义内容不能在展开/收起控件内部增加第二个焦点停靠点、激活目标、角色或播报。

## Design relationships

此组件本地的表示没有当前设计规格管辖。

| 解剖结构或状态    | 设计要求                                               | 表示权威                     | 层级角色 | 组件契约          |
| ----------------- | ------------------------------------------------------ | ---------------------------- | -------- | ----------------- |
| 根表面            | 现有已发布表面在此决策下保持不变。                     | 已发布行为                   | 支撑     | FR7               |
| 展开/收起切换控件 | 一个可操作、具名的控件拥有收起交互。                   | 组件所有                     | 支撑     | FR1–FR5, AR1      |
| 收起摘要          | Badge 层级保持为默认；调用方可以选择一个视觉组合插槽。 | 组件默认值或调用方选择的组合 | 支撑     | FR8–FR10, AR2–AR4 |
| 内容区域          | 收起态后代对键盘与辅助技术仍不可用。                   | 组件所有                     | 支撑     | FR4, FR6, AR3     |

现有 `chat-composer-drawer` 目标保留在绘制根上。保留 Badge 的默认值将计数的绘制委托给 Badge。使用方组合的摘要内容保留其提供的组件的主题所有权。此决策不添加 ChatComposerDrawer 摘要目标，也不使任意插槽内部成为 ChatComposerDrawer 主题 API 的一部分。

## Family and system relationships

- `architecture:public-component-api` 拥有该增量插槽的可达性、命名语法与兼容性；此组件拥有其本地含义与默认值。
- `architecture:interaction-modality` 拥有共享的焦点可见性机制；此组件拥有作为其语义焦点所有者的展开/收起控件。
- `architecture:component-theming-surface` 拥有目标与解剖结构映射规则；自定义摘要不会创建新目标，也不会转移使用方内容的所有权。
- `architecture:knowledge-contracts` 将此当前权威限定在本记录中的明确声明之内。
- `spec:AST-002/DEC-1` 接纳该插槽，因为其他方面相同的抽屉可能需要一个组件无法推导的、使用方拥有的视觉层级。`DEC-2` 要求该接缝保持可靠、无障碍安全的结果。

## Verification map

| 契约                 | 验证                                                         | 代表状态                                              | 变更或失败预期                                                                                   | 审计小节                                 |
| -------------------- | ------------------------------------------------------------ | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| FR1–FR3, FR6, ORD1–2 | 针对性的 ChatComposerDrawer 状态与键盘测试                   | 无 count；零 count；受控；非受控；指针；Enter；Space  | 存在性或真值性判断改变收起可用性、状态权威发生变化，或回调报告错误的下一状态。                   | `audit:ChatComposerDrawer/behavior`      |
| FR8–FR9, ORD3        | 针对性的默认/自定义摘要测试与使用方文档投影检查              | 默认；自定义节点；已展开；已收起；无 count            | 默认 Badge 消失、默认内容与自定义内容一起渲染、自定义内容改变行为，或省略 count 时仍暴露它。     | `audit:ChatComposerDrawer/api`           |
| FR4, FR10, AR2–AR4   | 针对性的惰性状态与自定义后代测试，加上 exact-head 无障碍 CI  | 默认文本；自定义文本；自定义可聚焦后代；已收起/已展开 | 隐藏的抽屉内容或自定义摘要变得可聚焦、被播报，或成为第二个操作；视觉文本替换目录名称。           | `audit:ChatComposerDrawer/accessibility` |
| FR5, AR1             | `KeyboardFocus` Storybook play 与 exact-head 视觉/无障碍闸门 | 代表性浅色与深色主题中的键盘焦点                      | 焦点没有共享的可见指示器，或展开/收起关系/名称被破坏。                                           | `audit:ChatComposerDrawer/accessibility` |
| FR7                  | 针对性的 DOM/类型测试与包检查                                | ref、BaseProps、xstyle、className、style              | 根所有权或某个样式接缝移动或消失。                                                               | `audit:ChatComposerDrawer/api`           |
| AV4 与主题边界       | 对默认与自定义摘要进行源码/运行时主题检查                    | 默认 Badge；使用方组合的 Astryx 内容                  | 出现新的摘要目标、Badge 失去其目标，或使用方拥有的内容被重新定位为 ChatComposerDrawer 解剖结构。 | `audit:ChatComposerDrawer/theming`       |

## Decision log

### DEC-1 — One visual slot preserves the Badge default

**引用：** `component:ChatComposerDrawer/DEC-1`

**决策者：** `cixzhang`, `2026-09-21`

ChatComposerDrawer 接纳一个可选的 `collapsedSummary` 节点，作为完整的视觉摘要。产品构建者拥有决定权：某个特定收起行需要既有的 Badge 层级，还是更安静的本地化组合；而组件无法推导出这一视觉层级。省略该插槽会保留现有中性 Badge 加标签，因此没有任何现有构建者会得到新选择或迁移负担。

已否决：用 `{count} {label}` 句子替换默认值、添加 Badge 布尔值或有限的呈现枚举、为调用方已拥有的值添加渲染回调，或暴露平行的摘要接缝。这些形态要么破坏已发布默认值，要么把呈现机制编码进去，要么引入区域设置不安全的字符串拼接，要么添加超出使用方拥有的区别所需的 API。

### DEC-2 — Visual composition does not own disclosure semantics

**引用：** `component:ChatComposerDrawer/DEC-2`

**决策者：** `cixzhang`, `2026-09-21`

自定义摘要仅用于呈现。现有 `label` 与本地化目录继续命名展开/收起操作；`count` 继续启用展开/收起控件；组件保持摘要后代处于焦点、激活与辅助技术导航之外。该接缝不能替换这些义务。

已否决：从任意摘要内容推导无障碍名称，或让自定义摘要在展开/收起控件内部引入另一个操作。两者都使正确的语义依赖于组件无法验证的使用方标记。

## Open questions

此契约切片没有未决问题。

## Content boundary

本文件拥有 ChatComposerDrawer 的收起摘要组合边界、保留 Badge 的默认值、收起门控与状态行为、无障碍命名、兼容性以及所需证据。它不重复完整的使用方 prop 参考、实现步骤、当前审计得分或无关的组件缺口。当前权威按声明范围限定于上述明确需求，并不证明 ChatComposerDrawer 的每一项行为。
