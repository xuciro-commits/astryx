---
schema_version: 3
template_version: 7
kind: component
id: component:TopNavMegaMenuFeaturedCard
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-25
owners: [cixzhang]
review_triggers: [public-api, behavior, accessibility]
verified_by:
  [
    packages/core/src/TopNav/TopNav.test.tsx,
    apps/storybook/rtl-audit/targets.json,
    apps/storybook/stories/TopNavMenu.stories.tsx,
  ]
modules: []
families: [family:navigation-destinations]
design_specs: [design:bidirectionality]
architecture:
  [architecture:interaction-modality, architecture:component-theming-surface]
contributing: []
system_specs: []
---

# TopNavMegaMenuFeaturedCard component contract

## Contract at a glance

| Area          | Contract                                                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | `TopNavMegaMenuFeaturedCard`，含 `title`、`description`、`image`、`imageAlt`、`linkLabel`、`linkHref` 和 `children`；目标 `top-nav-mega-menu-featured-card`。 |
| 行为          | 用于 mega menu 精选位的推广卡片：可选图片、标题、描述、可选的行动号召链接，然后是调用方内容。                                                                 |
| 终端用户影响  | 用户看到一个高亮的目的地；屏幕阅读器用户会跳过装饰性图片，除非 `imageAlt` 为其命名。                                                                          |
| 构建者影响    | 无。                                                                                                                                                          |
| 兼容性/就绪度 | 记录已发布行为；无公共变更。存在一处实现缺口（见当前状态影响）。                                                                                              |
| 审查检查      | 拒绝暴露给辅助技术却没有 `imageAlt` 的图片，或仅在 `linkLabel` 与 `linkHref` 之一被设置时渲染的链接。                                                         |
| 管辖规则      | `design:bidirectionality` DR4；`architecture:interaction-modality`；`architecture:component-theming-surface`。                                                |

此表是审查投影；下文正文具有权威性。

## Intent

TopNavMegaMenuFeaturedCard 用一张推广单个目的地的卡片填充 TopNavMegaMenu 的精选位。使用方用法见 `TopNavMegaMenuFeaturedCard.doc.mjs`。

## Compatibility and migration

- 已保留发布的默认值：`yes`
- 兼容性类别：记录已发布行为；无公共变更
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档和发布说明。

## Current-state impact

- **浏览器默认焦点环。** 行动号召链接不使用共享焦点轮廓；键盘焦点绘制浏览器默认焦点环。`architecture:interaction-modality` 提供了它所绕过的共享指示器。

## Ownership boundary

**拥有**

- 卡片的内容顺序、图片语义和链接条件（FR1–FR4）。

**不拥有 / 非目标**

- 该组件渲染的每个 `href` 的目的地接受与阻止 —— 由 `family:navigation-destinations` 拥有。
- 面板与抽屉中的放置 —— 由 `component:TopNavMegaMenu` 拥有。
- 调用方 `children` 内容。

## Public concepts

除使用方 props 外，无组件本地概念。

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                           | 依据           |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| FR1 | 根 `div` 携带 `top-nav-mega-menu-featured-card`、转发的 `ref` 和其他 DOM props，并显示：当设置了 `image` 时显示图片（全宽，140 px 高），然后是标题、描述、链接和 `children`。    | 当前源码与测试 |
| FR2 | 没有 `imageAlt` 时图片是装饰性的：`alt=""`、`role="presentation"` 和 `aria-hidden="true"`。有 `imageAlt` 时它是带该替代文本的普通图片。                                          | 当前源码与测试 |
| FR3 | 仅当 `linkLabel` 和 `linkHref` 都被设置时才渲染链接，通过 `LinkProvider` 链接组件，形式为 `linkLabel` 后跟 ` →`；箭头在从右到左布局中镜像一次（`design:bidirectionality` DR4）。 | 当前源码与测试 |
| FR4 | `className`、`style` 和 `xstyle` 在组件样式之后合并。                                                                                                                            | 当前源码       |

### Allowed variation

- **AV1 — 可选部分。** 图片、描述、链接和 children 均可缺失。

### Representative states

| 状态       | 必需不变式                 | 允许的变化 |
| ---------- | -------------------------- | ---------- |
| 装饰性图片 | 图片对辅助技术隐藏。       | 图片。     |
| 已描述图片 | 通过 `imageAlt` 暴露图片。 | —          |
| 带链接     | 描述之后的链接。           | 标签。     |

### Transformation and precedence order

- 无优先级规则。

### Performance and resources

- 无资源规则。

## Accessibility contract

- **AR1 — 图片语义。** FR2。

## Design relationships

| 结构或状态 | 设计要求                           | 表示权威           | 层级角色 | 组件契约 |
| ---------- | ---------------------------------- | ------------------ | -------- | -------- |
| 卡片       | 图片位于标题、描述、链接正文之上。 | 当前源码与公共文档 | 支撑性   | FR1、FR3 |

`TopNavMegaMenuFeaturedCard.doc.mjs` 未声明自己的结构，因此不记录结构-主题映射。

## Family and system relationships

- `family:navigation-destinations` 拥有该组件渲染的每个目的地的接受/阻止决策。
- `component:TopNavMegaMenu` 在其精选区域渲染该卡片。
- `design:bidirectionality` DR4 管辖链接字形。

## Verification map

| 契约            | 验证                                                                                                                | 代表性状态                                                       | 变异或失败预期                                                                                                                                                       | 审计小节                                         |
| --------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| FR1             | `TopNav.test.tsx` 精选卡片 rest 转发测试                                                                            | 根 props                                                         | 丢弃 props 会失败。                                                                                                                                                  | `audit:TopNavMegaMenuFeaturedCard/behavior`      |
| FR2, FR3        | `TopNav.test.tsx` 精选卡片图片测试                                                                                  | 有和没有 `imageAlt`                                              | 暴露装饰性图片或丢失链接会失败。                                                                                                                                     | `audit:TopNavMegaMenuFeaturedCard/accessibility` |
| FR3（RTL 箭头） | `TopNav.test.tsx` 精选卡片箭头镜像测试，加上真实浏览器证据                                                          | 带标签的链接，LTR 与 RTL                                         | 在 RTL 中指向右侧的箭头，或发生变化的链接名称，会失败。缺口：单元测试能看到镜像类，但看不到 transform 所需的内联块盒子；没有已提交的浏览器检查会在箭头未镜像时失败。 | `audit:TopNavMegaMenuFeaturedCard/i18n-rtl`      |
| RTL 关系（FR3） | RTL 审计中的精选 D4 目标（`apps/storybook/rtl-audit/targets.json`），针对 `TopNavMenu / Featured card / Link arrow` | 链接箭头与其标签（测试夹具的链接盒子就是标签和箭头）；LTR 与 RTL | 在 RTL 中箭头仍停留在标签的 LTR 一侧会失败 D4。字形镜像本身由 FR3（RTL 箭头）行覆盖。                                                                                | `audit:TopNavMegaMenuFeaturedCard/i18n-rtl`      |

从源码读取，尚无聚焦测试：内容顺序（FR1）；转发的 `ref` 和 `top-nav-mega-menu-featured-card` 目标（FR1）；仅当 `linkLabel` 和 `linkHref` 都被设置时才渲染链接（FR3）；图片尺寸（FR1）、`LinkProvider` 链接（FR3）以及 FR4。

## Decision log

未记录组件本地决策。

## Open questions

无。

## Content boundary

本文件不复制使用方 props 表格或示例。它链接到它们的拥有者。
