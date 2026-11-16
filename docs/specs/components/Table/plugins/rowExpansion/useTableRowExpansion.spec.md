---
schema_version: 3
template_version: 4
kind: module
id: module:Table/useTableRowExpansion
authority: current
archive_reason: null
superseded_by: null
approved_by: humbertovirtudes
approved_at: 2026-11-04
owners: [cixzhang]
review_triggers: [public-api, behavior, accessibility]
verified_by:
  [
    packages/core/src/Table/plugins/rowExpansion/useTableRowExpansion.test.tsx,
    apps/storybook/stories/TableRowExpansion.stories.tsx,
    scripts/check-i18n-catalog.mjs,
    scripts/check-knowledge.mjs,
  ]
parent_component: component:Table
references:
  [
    architecture:internationalization,
    architecture:public-component-api,
    spec:AST-009,
    module:Table/useTableTreeData,
  ]
---

# useTableRowExpansion accessible-name contract

## Contract at a glance

| 区域          | 契约                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------- |
| 公共契约      | 可选的 `getRowLabel?: (item: T) => string` 提供行身份，而不是动作措辞。                     |
| 行为          | 经 trim 的非空标签会给出带本地化名称的具名展开控件；省略或空白的标签保留通用名称。          |
| 最终用户影响  | 可访问名称标识出由展开/折叠按钮所控制的那一行。                                             |
| 构建者影响    | 仅当调用方拥有可供人阅读的行身份时才选择启用。                                              |
| 兼容性/就绪度 | 增量的可选 API；既有展开行为与通用标签保持不变。实现的版本验证另行进行。                    |
| 审查检查项    | 拒绝在 hook 调用点捕获 locale、新增视觉内容、选择语义或具名上下文菜单文案。                 |
| 管辖规则      | Table FR7 管辖放置；internationalization 管辖目录与 provider 作用域；本模块仅管辖命名切片。 |

本表是审查用的投影；下方正文具有权威性。

## Intent

明细行展开控件为其作用的行命名，而不让调用方自己承担动词、展开状态措辞或本地化。本记录仅对既有 hook 的这一可访问名称切片作出约定。

## Compatibility and migration

- 已发布的默认行为保持不变：是；省略该选项会保留本地化的通用展开/折叠名称。
- 兼容性类别：增量的可选回调，不改变 row key、面板、动效或交互。
- 迁移决策：DEC-1。使用方用法属于 `useTableRowExpansion.doc.mjs`。

## Ownership boundary

**拥有：** 可选的 row-label 回调、空白规范化、具名控件消息、对渲染控件翻译上下文的消费，以及命名验证。

**不拥有：** internationalization provider 的作用域与更新语义、Table 的渲染/组合、展开状态、row key、面板结构、动效、交互处理函数、选择，或完整的 hook 配置。Table 及其既有所有者保留这些契约。本记录不改变选择插件的回调行为。

## Public API and concepts

| 概念       | 取值                         | 含义                         | 默认值           | 所有者 | 稳定性               |
| ---------- | ---------------------------- | ---------------------------- | ---------------- | ------ | -------------------- |
| 行身份文本 | 为该行项返回的字符串         | 人类可读的身份，不含动作动词 | 回调缺失         | 调用方 | 自首个版本起即为增量 |
| 生效标签   | 经 trim 的非空字符串，或缺失 | 具名或通用的控件标签         | 通用             | 本模块 | 稳定                 |
| 名称状态   | 折叠或展开                   | 本地化的展开或折叠动作       | 跟随受控展开状态 | 本模块 | 稳定                 |

## Behavioral contract

| ID  | 不变式                                                                                                                                                                                         | 依据                                 | 证据状态             |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | -------------------- |
| FR1 | `UseTableRowExpansionConfig<T>` 接受可选的 `getRowLabel?: (item: T) => string`。该 hook 提供既有的行项；它不会从列或 DOM 推断文本，也不会把该文本用作 row key。                                | 调用方拥有的身份；DEC-1              | 已批准；实现另行验证 |
| FR2 | 去除首尾空白。非空结果会按展开状态向 `@astryx.tableRowExpansion.expandRowNamed` 或 `collapseRowNamed` 提供 `{label}`。回调缺失或结果仅为空白时，使用既有的 `expandRow` 或 `collapseRow` 消息。 | DEC-1；internationalization 消息归属 | 已批准；实现另行验证 |
| FR3 | 本模块在渲染控件的翻译上下文中解析名称；`architecture:internationalization` 管辖该 provider 的作用域以及 locale/覆盖更新，包括它仅包裹 hook 调用方内部 Table 的情形。                          | Internationalization provider 边界   | 需要验证             |
| FR4 | 该行的上下文菜单动作保留通用的本地化展开/折叠措辞。行标签不新增可见文本、不改变布局，也不改变控件角色、`aria-expanded`、键盘操作、焦点或面板行为。                                             | Table FR7；增量兼容性                | 需要验证             |

### Transformation and precedence order

- **ORD1:** 调用方身份文本在消息插值之前被规范化；受控展开状态选择动作，而控件的 provider 提供其翻译。
- **ORD2:** 空白文本回退到通用动作，而不是空或仅含空白的可访问名称。该边界适用于展开控件，不适用于选择控件。

### Performance and resources

- **PR1:** 命名不增加数据集扫描、观察、异步工作或独立的展开状态。既有 hook 的生命周期仍由该 hook 拥有。

## Accessibility contract

- **AR1:** 原生按钮拥有完整的本地化动作/行名称；其展开状态仍通过 `aria-expanded` 独立暴露。
- **AR2:** 没有可用标签的调用方仍可使用通用回退。计算得到的可访问名称/浏览器证据并不承诺特定的屏幕阅读器措辞。

## Design relationships

| 结构     | 要求                                       | 所有者                | 契约    |
| -------- | ------------------------------------------ | --------------------- | ------- |
| 展开控件 | 在不新增视觉文本或控件结构的前提下改变命名 | Table FR7；本命名切片 | FR2-FR4 |

## Parent and system relationships

`component:Table` 管辖聚合协议与放置。`architecture:internationalization` 管辖 ICU 插值、provider 更新与缺失消息回退。`module:Table/useTableTreeData` 为树展开控件定义相同的规范化边界，但不合并 hook 的生命周期。

## Verification map

| 契约    | 验证                                     | 状态                               | 失败预期                                         |
| ------- | ---------------------------------------- | ---------------------------------- | ------------------------------------------------ |
| FR1-FR2 | 行展开测试与 Storybook 可访问名称探测    | 省略、空白、具名、折叠、展开       | 移除插值或空白回退会产生错误的名称               |
| FR3     | Provider 放置/locale 更新的回归测试      | provider 仅包裹 Table；locale 变更 | 在调用方的 hook 上下文中解析会使控件名称断言失败 |
| FR4     | 既有面板/菜单/键盘测试与匹配的浏览器检查 | 具名控件与上下文菜单动作           | 具名菜单文案或改变状态/焦点会使兼容性检查失败    |

## Decision log

### DEC-1 — Row identity is caller text; action wording is component text

**参考：** `module:Table/useTableRowExpansion/DEC-1`

**决策者：** humbertovirtudes，2026-11-04。

可选回调仅提供身份。经 trim 的空白文本使用通用名称，因此选择启用从不需要调用方重复动词或本地化。已否决：提供完整动作标签的回调，或从显示列推断。

## Open questions

无。

## Content boundary

本记录不规定完整的展开 hook、树结构、使用方示例、当前审计结果、实现步骤或共享系统规则。
