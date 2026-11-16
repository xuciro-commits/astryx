---
schema_version: 3
template_version: 7
kind: component
id: component:CheckIndicator
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers: [public-api, behavior, theming, accessibility, visual]
verified_by:
  [
    packages/core/src/Indicator/Indicator.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:public-component-api,
    architecture:component-theming-surface,
    architecture:component-test-sufficiency,
  ]
contributing: []
system_specs: []
---

# CheckIndicator component contract

## Contract at a glance

| Area          | Contract                                                                                                                                                                           |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | `CheckIndicator` 从 `@astryxdesign/core/Indicator` 导出；`state` 为必填，`size` 默认为 `md`，`isDisabled` 默认为 `false`，`children` 可以替换内置标记。                            |
| 行为          | 组件仅在选中时绘制一个装饰性对勾字形。可浅层渲染的 `children` 在任一状态下都会替换该字形；未选中且无替换内容时不渲染任何元素。                                                     |
| 最终用户影响  | 用户从所属控件获得一个选择提示，不会出现重复的无障碍对象，未选中行旁也不会出现空占位符。                                                                                           |
| 构建者影响    | 构建者可以替换名为 `check` 的指示器，或组合宿主自有的类和样式，而无需接管所属控件的语义。                                                                                          |
| 兼容性/就绪度 | 记录已发布行为；无 API、默认值或 DOM 变更。选中字形的路径会丢弃已声明的 `ref`；已列在当前状态影响中，修复项待定（OQ1）。                                                           |
| 审查检查项    | 拒绝以下情况：丢失 `aria-hidden`、未选中默认态出现标记、选中态缺少标记、丢弃受支持的 DOM/样式透传、替换优先级被改变、新增组件自有的主题目标，或在 OQ1 决定后选中路径仍丢弃 ref。   |
| 治理规则      | `architecture:public-component-api/INV1,INV5,INV6,INV8,INV9`; `architecture:component-theming-surface/INV3–INV6`; `architecture:component-test-sufficiency/INV1–INV7,INV10–INV11`. |

本表是审查视图；下方正文具有权威性。

## Intent

渲染宿主用于表示某个选项已被选中的可替换装饰性对勾，但不接管选择语义、交互或持久控件外框装饰。

## Compatibility and migration

- 已发布的默认值保留：是
- 兼容性类别：记录已发布行为；无公共 prop、默认值、导出或 DOM 变更
- 受控/非受控行为：不适用；`state` 由拥有者提供
- 迁移决策：无；公共组件与 `check` 注册名均保持不变

使用方迁移说明属于使用方文档与发行说明。

## Ownership boundary

**拥有**

- 选中字形、未选中时的空缺、禁用颜色、尺寸映射、替换内容优先级以及装饰性根元素。
- 每个已渲染根元素上受支持的中性 DOM 与样式透传。替换内容的 span 会接收已声明的 ref；选中态的 Icon 路径目前不会。

**不拥有 / 非目标**

- 选择角色、无障碍名称、状态、焦点、键盘、激活或忙碌语义——由组合它的控件拥有。
- 持久复选框或单选按钮外框装饰——由 `component:CheckboxIndicator` 或 `component:Indicator` 拥有。
- 行放置与逻辑边缘布局——由宿主组件拥有。
- 使用方提供的替换内容的行为或无障碍性。

## Public concepts

| Concept  | Closed values or states | Meaning                                                                                                                    | Availability by variant/orientation/state  | Default      | Owner                      | Stability                   | Invalid-value behavior        |
| -------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ------------ | -------------------------- | --------------------------- | ----------------------------- |
| state    | `unchecked`, `checked`  | 选择内置对勾字形是缺失还是存在。                                                                                           | 所有渲染路径。                             | 必填         | `component:CheckIndicator` | 稳定                        | 由公共类型拒绝                |
| size     | `sm`, `md`              | 选择共享的指示器尺寸；当前两个取值都使用 `sm` Icon 字形。                                                                  | 选中态与替换内容的根元素。                 | `md`         | `component:CheckIndicator` | 稳定                        | 由公共类型拒绝                |
| 禁用外观 | 启用、禁用              | 镜像所属控件的禁用颜色，但不产生语义。                                                                                     | 选中态与替换内容的根元素。                 | 启用         | `component:CheckIndicator` | 稳定                        | 仅布尔值                      |
| 替换内容 | 可浅层渲染或为空        | 当 `isRenderable(children)` 返回 true 时，在任一状态下替换内置标记。React 元素与容器会走这一分支，即使后代不渲染任何内容。 | 所有状态；替换内容会创建一个 span 根元素。 | 内置标记路径 | `component:CheckIndicator` | 稳定；空容器策略待定（OQ2） | 不支持的值遵循 React 渲染行为 |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                                                                                                      | Basis                                                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| FR1 | 当 `state="checked"` 且无替换内容时，组件必须渲染一个装饰性对勾字形，并必须在调用方透传之后设置自身的 `aria-hidden="true"`。                                                                                                                                                   | 已发布源码；`architecture:public-component-api/INV5`           |
| FR2 | 当 `state="unchecked"` 且无替换内容时，默认组件必须不渲染任何元素。                                                                                                                                                                                                            | 已发布源码、文档、测试与 stories                               |
| FR3 | 替换在两种状态下都使用浅层 `isRenderable(children)` 优先级：nullish 值、布尔值和空字符串保留内置状态行为；React 元素与容器即使后代不渲染任何内容也会替换它（OQ2）。                                                                                                            | 已发布源码与回归测试                                           |
| FR4 | 每个已渲染根元素必须保留受支持的 DOM props、`className`、`style` 与 `xstyle`，同时保持组件自有的无障碍优先级，并且已声明的 ref 必须到达已渲染的根元素（`architecture:public-component-api/INV8`）。实现缺口：替换内容的 span 会接收 ref，但选中态的 Icon 路径会丢弃它（OQ1）。 | `architecture:public-component-api/INV5,INV6,INV8`；当前源码   |
| FR5 | 内置的选中标记必须保持为 Icon 拥有的绘制者，并与宿主提供的类位于同一元素；未经批准的契约变更，CheckIndicator 不得添加包装元素或独立的公共目标。                                                                                                                                | 已发布源码；`architecture:component-theming-surface/INV3–INV5` |
| FR6 | 禁用颜色与替换内容颜色必须继续使用语义 token，而不是原始颜色值。                                                                                                                                                                                                               | 已发布源码；当前 token 与主题架构                              |

### Allowed variation

- **AV1 — 主题绘制。** Icon 目标与宿主自有的类可以更改受支持的绘制，而不改变状态或语义所有权。
- **AV2 — 替换组件。** 当替换项保留此公共 prop 与装饰所有权契约时，主题可以替换名为 `check` 的指示器。

### Representative states

| State    | Required invariant                                           | Allowed variation           |
| -------- | ------------------------------------------------------------ | --------------------------- |
| 未选中   | 不渲染任何内置元素。                                         | 替换组件可以绘制。          |
| 选中     | 渲染一个装饰性对勾字形。                                     | Icon 与宿主自有的主题绘制。 |
| 禁用     | 选中态或替换内容保持所请求的状态，并使用禁用语义颜色。       | 主题自有的非激活处理。      |
| 替换内容 | 可浅层渲染的内容在居中的固定尺寸装饰性根元素中替换内置标记。 | 调用方自有的装饰内容。      |

### Transformation and precedence order

- **ORD1 — 渲染优先级。** 浅层替换内容判定 → 未选中空缺或选中的 Icon → 调用方透传 → 组件自有的 `aria-hidden` → 合并后的主题/样式输入。

### Performance and resources

- **PR1 — 纯渲染。** 组件不拥有任何 state、Effect、监听器、观察器、定时器或外部资源。

## Accessibility contract

- **AR1 — 装饰所有权。** 每个已渲染根元素保持 `aria-hidden`；组合它的控件拥有角色、名称、状态、焦点、键盘、激活与表单语义。
- **AR2 — 替换边界。** 替换内容在隐藏根元素内是装饰性的，且不得成为所属控件选中或忙碌状态的唯一语义表达。

## Design relationships

| Anatomy or state | Design requirement                      | Representation authority | Hierarchy role | Component contract |
| ---------------- | --------------------------------------- | ------------------------ | -------------- | ------------------ |
| 外框装饰         | CheckIndicator 刻意不拥有持久外框装饰。 | 已观察到的发布表示       | 不适用         | FR2, FR5           |
| 状态标记         | 选中状态渲染共享的装饰性对勾 Icon。     | Icon 自有的当前主题架构  | 辅助状态提示   | FR1, FR5–FR6       |

共享的 `Indicator.doc.mjs` 将 CheckboxIndicator、CheckIndicator 与 RadioIndicator 的结构和目标一并列出，因此本记录不携带结构-主题映射。CheckIndicator 不拥有持久外框装饰，并将内置的选中标记委托给 Icon。

## Family and system relationships

- `architecture:component-theming-surface` 拥有目标放置与组合绘制者所有权。
- `architecture:public-component-api` 拥有导出、透传、样式组合、ref 与兼容性要求。
- `architecture:component-test-sufficiency` 拥有每个关键承诺与不同风险分区所需的证据。

## Verification map

| Contract      | Verification                                                                  | Representative states                              | Mutation or failure expectation                                                                                                                                                                                                                          | Audit section                        |
| ------------- | ----------------------------------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| FR1, FR2, FR3 | `Indicator.test.tsx` 的 CheckIndicator 状态与替换用例；falsy-children 用例    | 选中、未选中、空标量、可见子元素、`0`              | 移除字形、添加未选中外框装饰或选择错误的 children 分支都会失败。                                                                                                                                                                                         | `audit:CheckIndicator/behavior`      |
| FR1, AR1      | `Indicator.test.tsx` 装饰契约用例                                             | 字形与替换根元素；调用方传入 `aria-hidden={false}` | 调用方能将其暴露的根元素会失败。证据缺口：没有测试断言替换内容不是唯一的状态表达（AR2）。                                                                                                                                                                | `audit:CheckIndicator/accessibility` |
| FR4           | `Indicator.test.tsx` "forwards caller props and styling on both render paths" | 两条渲染路径                                       | 调用方的 DOM prop 不再到达任一渲染根元素，或 `className` 不再到达替换 span 的，都会失败。证据缺口：没有测试断言选中字形路径上的 `className`、`style` 或 `xstyle`，替换 span 上的 `style` 或 `xstyle`，或两条路径上的 ref（选中路径的 ref 即 FR4 缺口）。 | `audit:CheckIndicator/api`           |
| FR5, FR6      | `themingTargets.test.ts`                                                      | 选中字形                                           | 已记录的目标中缺失某个已渲染类会失败。证据缺口：没有测试断言没有包装元素将宿主类与 Icon 绘制者分开，也没有测试断言禁用颜色与替换内容颜色使用语义 token。                                                                                                 | `audit:CheckIndicator/theming`       |
| ORD1, PR1     | 由 FR1–FR4 各行覆盖。证据缺口：没有测试断言不存在 state、Effect 或监听器      | —                                                  | —                                                                                                                                                                                                                                                        | `audit:CheckIndicator/behavior`      |

## Current-state impact

- **选中路径的 ref（FR4）。** 当 CheckIndicator 绘制其选中字形时，已声明的 ref 为 `null`，这与 `architecture:public-component-api` INV8 相悖；修复项是 OQ1。

## Decision log

无组件本地决策。

## Open questions

- **OQ1 — CheckIndicator 应在选中路径中拥有一个稳定的 span 根元素以保留其已声明的 `HTMLSpanElement` ref，还是应更改公共 ref 契约以匹配 Icon 自有的绘制者？**（`human-api`）当前选中路径返回 `null`；两种修正都会改变已发布的 DOM 或 ref 契约。
- **OQ2 — 空 React 容器是否应继续抑制内置状态标记？**（`human-api`）FR3 记录它们当前确实如此。

## Content boundary

本文件不重复使用方的 prop 表/示例、当前审计结果、实现步骤或家族/系统规则。它链接到它们的拥有者。
