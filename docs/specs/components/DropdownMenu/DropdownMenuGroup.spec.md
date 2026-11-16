---
schema_version: 3
template_version: 7
kind: component
id: component:DropdownMenuGroup
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers: [public-api, behavior, accessibility, theming]
verified_by: [packages/core/src/DropdownMenu/DropdownMenu.test.tsx]
modules: []
families: []
design_specs: []
architecture:
  [architecture:public-component-api, architecture:component-theming-surface]
contributing: []
system_specs: [spec:AST-020]
---

# DropdownMenuGroup component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                     |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | 复合模式下由行组成的组，带可选的 `title`、`children`、根输入以及 ref。                                                                   |
| 行为          | 渲染一个由其可见标题命名的 `role="group"`；该标题是纯文本，漫游焦点与 typeahead 都会跳过它。无标题的组是未命名的组，除非调用方为其命名。 |
| 终端用户影响  | 屏幕阅读器用户把带标题的行簇听成一个命名组，与视力正常用户所见一致；方向键跨组边界移动，如同这些行是扁平的。                             |
| 构建者影响    | 构建者用与数据模式 section 相同的标题外观为复合行加标题。                                                                                |
| 兼容性/就绪度 | 记录已发布行为；无 API、默认值或 DOM 变更。                                                                                              |
| 审查检查      | 拒绝以下情形：标题变成菜单项或焦点停留点，带标题的组未由其标题命名，或 section 标题目标丢失。                                            |
| 治理规则      | `component:DropdownMenu/DEC-6`；`architecture:public-component-api`；`architecture:component-theming-surface`。                          |

本表是审查投影；下面的正文才是权威。

## Intent

DropdownMenuGroup 为复合模式菜单提供带标题的分组，数据模式的 `{type: 'section'}` 条目已经具备这种分组（`component:DropdownMenu/DEC-6`）。

## Compatibility and migration

- 已发布的默认值保持不变：是。
- 兼容性类别：记录已发布行为；无公共 prop、默认值、导出或 DOM 变更。
- 受控/非受控行为：不适用。
- 迁移决策：无。

使用方的迁移说明应放在使用方文档与发布说明中。

## Ownership boundary

**拥有**

- 一个 `role="group"` 根、由标题得到的名称，以及带有 `dropdown-menu-section-heading` 目标的标题本身。
- ref、宿主属性与处理函数的根组合。

**不拥有 / 非目标**

- 漫游焦点与 typeahead —— 由 `component:DropdownMenu` 拥有。
- 内部的行 —— 由各行的组件拥有。
- 标题内可获焦点的内容：方向键无法到达它。

## Public concepts

| 概念  | 封闭取值或状态        | 含义                 | 可用性   | 默认值 | 所有者    | 稳定性 | 无效值行为                           |
| ----- | --------------------- | -------------------- | -------- | ------ | --------- | ------ | ------------------------------------ |
| Title | 缺省；任意 React 节点 | 为组命名的可见标题。 | 复合模式 | 缺省   | component | 稳定   | 缺省时不渲染标题，也没有自己的名称。 |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                         | 依据                                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------- |
| FR1 | 带 `title` 时，该组是一个 `role="group"`，其 `aria-labelledby` 命名其可见标题；该标题带有 `dropdown-menu-section-heading`，是纯文本而非菜单项，并被漫游焦点与 typeahead 跳过。 | `component:DropdownMenu` 的 DEC-6；当前测试   |
| FR2 | 不带 `title` 时，该组是未命名的 `role="group"`，或采用调用方提供的名称。                                                                                                       | 当前测试                                      |
| FR3 | 方向键跨组边界步进，如同这些行是扁平的；标题内可获焦点的节点无法由它们到达。                                                                                                   | 当前测试                                      |
| FR4 | ref 与宿主属性、处理函数会到达组元素，同时它保留其角色与标题名称。                                                                                                             | `architecture:public-component-api`；当前测试 |

### Allowed variation

- **AV1 — 标题内容。** 标题可以是任意 React 节点。

### Representative states

| 状态   | 必需的不变式             | 允许的变体 |
| ------ | ------------------------ | ---------- |
| 带标题 | 由其标题命名。           | 标题内容。 |
| 无标题 | 未命名，或由调用方命名。 | —          |

### Transformation and precedence order

- **ORD1 — 名称。** 标题文本 → 调用方名称 → 无。

### Performance and resources

- **PR1 — 仅渲染。** 该组不拥有任何状态、副作用、监听器或观察器。

## Accessibility contract

- **AR1 — 命名组。** 带标题的组以其标题文本被播报；该标题不是菜单项。

## Design relationships

| 结构或状态 | 设计要求                                  | 表示权威                 | 层级角色 | 组件契约 |
| ---------- | ----------------------------------------- | ------------------------ | -------- | -------- |
| 标题       | 像数据模式的 section 标题那样标识一组行。 | `component:DropdownMenu` | 辅助     | FR1      |

`component:DropdownMenu` 在其主题结构中映射 `dropdown-menu-section-heading` 目标，因此本记录不携带结构-主题映射。

## Family and system relationships

- `component:DropdownMenu` 拥有键盘模型与 section 标题目标映射。
- `architecture:public-component-api` 拥有根组合。

## Verification map

| 契约           | 验证                                                                                                                                                                                                                                                            | 代表性状态                   | 变更或失败预期                                                                  | 审计部分                                |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------- | --------------------------------------- |
| FR1, AR1, ORD1 | `DropdownMenu.test.tsx` 中 DropdownMenuGroup 的用例（"renders a role=\"group\" named by its heading"、"renders the heading with the data-mode theme class"、"the heading is not a menuitem and roving focus skips it"、"typeahead never lands on the heading"） | 带标题的组                   | 组未由其标题命名、标题目标缺失，或标题获得焦点或被 typeahead 匹配，均判为失败。 | `audit:DropdownMenuGroup/semantics`     |
| FR2            | `DropdownMenu.test.tsx` 的 "an untitled group is an unnamed role=\"group\"" 与 "an untitled group takes a caller-supplied accessible name"                                                                                                                      | 无标题，带与不带调用方名称   | 为无标题组臆造名称，或丢弃调用方提供的名称，均判为失败。                        | `audit:DropdownMenuGroup/semantics`     |
| FR3            | `DropdownMenu.test.tsx` 的 "arrow navigation steps across a group boundary as if the rows were flat" 与 "a focusable node in the heading is not reachable by the arrow keys"                                                                                    | 两个组；标题内可获焦点的内容 | 在边界处停留，或方向键到达标题内可获焦点的节点，均判为失败。                    | `audit:DropdownMenuGroup/accessibility` |
| FR4            | `DropdownMenu.test.tsx` 的 "forwards a ref to the group element" 与 "forwards host attributes to the group while keeping its role and heading name"                                                                                                             | Ref；宿主属性                | 丢弃 ref 或属性，或替换角色或名称，均判为失败。                                 | `audit:DropdownMenuGroup/api`           |
| PR1            | 证据缺口：没有测试断言生命周期资源不存在                                                                                                                                                                                                                        | —                            | —                                                                               | `audit:DropdownMenuGroup/behavior`      |

## Decision log

无组件本地决策；`component:DropdownMenu/DEC-6` 决定该组件。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表/示例、当前审计结果、实现步骤或父契约。它链接到它们的所有者。
