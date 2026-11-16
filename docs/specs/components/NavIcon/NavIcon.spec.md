---
schema_version: 3
template_version: 7
kind: component
id: component:NavIcon
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-26
owners: [cixzhang]
review_triggers: [theming]
verified_by:
  [
    packages/core/src/NavIcon/NavIcon.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    apps/storybook/stories/NavIcon.stories.tsx,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: []
design_specs: []
architecture:
  [architecture:component-theming-surface, architecture:public-component-api]
contributing: []
system_specs: []
---

# NavIcon component contract

## Contract at a glance

| Area                    | Contract                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------ |
| Public contract         | `NavIcon`，必需的 `icon`；目标 `nav-icon`。                                                |
| Behavior                | 一个仅用于显示的圆形强调色容器，尺寸为一个中等元素尺寸的正方形，用于展示调用方提供的图标。 |
| End-user impact         | 用户在导航标题中看到一致的产品标记；除调用方的图标之外，NavIcon 不向无障碍树添加任何内容。 |
| Builder impact          | 无。                                                                                       |
| Compatibility/readiness | 记录已发布的行为；无公共变更。                                                             |
| Review checks           | 拒绝发出 `nav-icon` 之外的任何目标，或向容器添加交互语义。                                 |
| Governing rules         | `architecture:component-theming-surface`；`architecture:public-component-api`。            |

此表是评审投影；下文正文具有权威性。

## Intent

NavIcon 在圆形导航容器内渲染调用方提供的图标内容，通常作为 TopNavHeading 或 SideNavHeading 的标志。使用方用法见 `NavIcon.doc.mjs`。

## Compatibility and migration

- 保留的已发布默认值：`yes`
- 兼容性类别：记录已发布的行为；容器只发出规范的 `nav-icon` 目标
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 圆形容器及其当前 `nav-icon` 主题化目标。

**不拥有 / 非目标**

- 通过 `icon` 提供的图形素材或组件——由调用方拥有，包括其无障碍名称或装饰性状态。
- 交互语义——NavIcon 保持为仅用于显示的容器。
- 标题在 NavIcon 周围施加的间距——由 `component:TopNavHeading` 与 `component:SideNavHeading` 拥有。

## Public concepts

除使用方 props 之外，没有组件本地概念。

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                   | Basis                |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| FR1 | NavIcon 渲染一个 `<span>` 圆形容器，居中，两个轴向均按 `--size-element-md` 设定尺寸，使用强调色与强调色上的前景色绘制，其中包含 `icon`。    | 当前源码、文档与测试 |
| FR2 | 容器只携带规范的 `nav-icon` 目标。                                                                                                          | 当前源码、文档与测试 |
| FR3 | 容器转发其 `ref`、`data-testid` 与其他 DOM props，并在组件样式之后合并 `className`、`style` 与 `xstyle`。它不添加 role、name 或焦点停靠点。 | 当前源码与测试       |

### Allowed variation

- **AV1 — 图形素材。** 调用方提供的图标图形与实现可以变化，而不会成为 NavIcon 拥有的解剖结构。

### Representative states

| State    | Required invariant     | Allowed variation |
| -------- | ---------------------- | ----------------- |
| 任意图标 | 相同的圆形容器与目标。 | 图形素材。        |

### Transformation and precedence order

- 无优先级规则。

### Performance and resources

- 无资源规则。

## Accessibility contract

- **AR1 — 透明容器。** NavIcon 不贡献任何语义；调用方的图标决定辅助技术感知到什么（FR3）。

## Design relationships

| Anatomy or state | Design requirement         | Representation authority | Hierarchy role | Component contract |
| ---------------- | -------------------------- | ------------------------ | -------------- | ------------------ |
| 容器             | 呈现圆形强调色绘制的表面。 | 当前源码与公共文档       | 支撑性         | FR1, FR2           |
| 图标             | 呈现调用方提供的视觉内容。 | 调用方提供的内容         | 依上下文而定   | FR1                |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Container": {"target": "nav-icon"},
  "Icon": {"inherits": "nav-icon"}
}
```

## Family and system relationships

- `architecture:component-theming-surface` 拥有该目标及其限定条件。
- `architecture:public-component-api` 拥有被转发输入的组合方式。

## Verification map

| Contract            | Verification                                              | Representative states  | Mutation or failure expectation                                                                                         | Audit section           |
| ------------------- | --------------------------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| FR1, FR3            | `NavIcon.test.tsx` 内容、ref 与 test-id 套件              | 调用方提供的图标       | 移除容器、内容、ref 或 test id 会失败。                                                                                 | `audit:NavIcon/anatomy` |
| FR2                 | `NavIcon.test.tsx` 目标名称套件；`themingTargets.test.ts` | 规范目标类             | 规范目标缺失或被重命名，或被移除的 `navicon` 别名，都会使目标断言失败；多出额外目标会使 `themingTargets.test.ts` 失败。 | `audit:NavIcon/theming` |
| Theming anatomy map | `scripts/check-knowledge.mjs`                             | 规范解剖结构与当前目标 | 缺失、多余、带前缀、陈旧或由别名支撑的映射会使仓库校验失败。                                                            | `audit:NavIcon/theming` |

从源码读取、尚无针对性测试：容器的圆形形状、尺寸与强调色（FR1）；以及其他 DOM props、`className`、`style` 与 `xstyle` 的合并，以及 role、name 或焦点停靠点的缺失（FR3）。

## Decision log

未记录组件本地决策。

## Open questions

无。

## Content boundary

本文件不重复使用方 props 表、示例、实现步骤或系统规则。它链接到其拥有者。
