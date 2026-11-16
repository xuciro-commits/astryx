---
schema_version: 3
template_version: 7
kind: component
id: component:Kbd
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers: [public-api, behavior, theming, accessibility]
verified_by: [packages/core/src/Kbd/Kbd.test.tsx, scripts/check-knowledge.mjs]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:component-theming-surface,
    architecture:internationalization,
    architecture:public-component-api,
  ]
contributing: []
system_specs: [spec:AST-102]
---

# Kbd component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                      |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | 无变更。Kbd 接收一个 `keys` 字符串和基础 props。                                                                                                          |
| 行为          | Kbd 按 `+` 拆分 `keys`，为每个按键绘制一个隐藏的按键徽章并采用感知平台的字形，并用按键的朗读名称整体命名该快捷键一次。                                    |
| 最终用户影响  | 视力正常的用户看到熟悉的按键字形；屏幕阅读器用户听到以词语表述的快捷键。这些词语在每个语言环境下都是英文。                                                |
| 构建者影响    | 无。                                                                                                                                                      |
| 兼容性/就绪度 | 记录已发布的行为；无 API、默认值或 DOM 变更。`kbd` 目标位于不绘制的快捷键组上；列在 Current-state impact 下。                                             |
| 审查检查项    | 拒绝以下情况：徽章暴露给辅助技术；调用方的 `role` 或 `aria-label` 替换了计算出的值；重复按键产生重复的 React key；`mod` 忽略平台。                        |
| 管辖规则      | `architecture:component-theming-surface`；`architecture:internationalization` INV1、INV1a；`architecture:public-component-api` INV5；`spec:AST-102` FR4。 |

本表是审查视角的投影；下方正文具有权威性。

## Intent

Kbd 将一个键盘快捷键呈现为一个或多个绘制的按键徽章。它负责解析快捷键字符串、为每个按键提供感知平台的字形、快捷键的无障碍名称，以及 `kbd` 目标。使用方用法见 `Kbd.doc.mjs`。

## Compatibility and migration

- 已发布的默认值保持不变：`yes`
- 兼容性类别：记录已发布的行为；无公共 prop、默认值、导出或 DOM 变更
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档和发布说明。

## Ownership boundary

**负责**

- 快捷键组、其当前的 `kbd` 目标，以及它根据所提供快捷键字符串绘制的按键徽章。
- 按键解析、别名、感知平台的字形以及朗读名称。

**不负责 / 非目标**

- 与快捷键关联的操作，或快捷键如何被发现——由产品调用点负责。
- 单个按键徽章是否应获得公共目标——待定（OQ1）。
- 监听或处理快捷键——不提供；Kbd 仅用于展示。
- 组上的调用方 DOM props、`ref`、`className`、`style` 和 `xstyle`——已发布并记录，除 FR4 的 role 与 label 优先级之外，此处不作约定。

## Public concepts

| 概念 | 封闭值或状态                                               | 含义             | 按变体/方向/状态的可用性 | 默认值 | 所有者          | 稳定性 | 无效值行为                         |
| ---- | ---------------------------------------------------------- | ---------------- | ------------------------ | ------ | --------------- | ------ | ---------------------------------- |
| 键   | 以 `+` 分隔的按键名称；`mod`、具名按键、别名、任意其他文本 | 要显示的快捷键。 | 始终。                   | 必需   | `component:Kbd` | 稳定   | 未知按键按所输入内容转为大写显示。 |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 依据                                                            |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| FR1 | 当前渲染包含一个快捷键组，并为每个解析出的按键片段包含一个绘制的按键徽章。`keys` 按 `+` 拆分；每个片段去除首尾空白并转为小写，`esc` 读作 `escape`，`return` 读作 `enter`，重复的按键获得各自的徽章。每个徽章至少为 `--spacing-5` 尺寸，并且必须随设定的文本大小增长，以便其字形永不被裁切（`spec:AST-102` FR4）。                                                                                                                                                                                                          | 当前源码、文档和测试；`spec:AST-102` FR4                        |
| FR2 | 快捷键组携带当前的 `kbd` 目标；单个按键徽章当前不携带公共目标（OQ1）。                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 当前源码、文档和测试                                            |
| FR3 | 每个徽章显示一个字形：在 Apple 平台上 `mod` 为 ⌘，在其他平台以及水合之前为目录中的 Control 短文本（英文为 “Ctrl”）；`ctrl`、`alt` 和 `shift` 遵循相同规则，在 Apple 平台上为 ⌃ ⌥ ⇧，在其他平台以及水合之前为目录中的短文本（英文为 “Ctrl”、“Alt”、“Shift”）；在 Apple 平台上 `meta` 显示 ⌘，在其他平台以及水合之前显示目录中的 Windows 键短文本（英文为 “Win”）；朗读名称保持不变；`escape` 显示目录中的 Escape 短文本（“Esc”）；`enter`、`backspace`、`tab` 和方向键显示其符号；`plus` 显示 “+”；任何其他按键以大写显示。 | `architecture:internationalization` INV1a；当前源码和测试       |
| FR4 | 该组具有 `role="img"` 以及一个由每个按键的朗读名称构建的 `aria-label`，名称取自 Astryx 目录（`mod` 在 Apple 平台上为 “Command”，在其他平台以及水合之前为 “Control”；未知按键以其大写形式朗读），并通过目录的 shortcut 消息两两连接（英文为 “ + ”，例如 “Command + K”）；每个徽章都是 `aria-hidden`。调用方的 `role` 和 `aria-label` 绝不会替换计算出的值；其他调用方 ARIA 属性（例如 `aria-labelledby` 和 `aria-hidden`）仍会到达该组。                                                                                    | `architecture:internationalization` INV1、INV1a；当前源码和测试 |

### Allowed variation

- **AV1 — 快捷键内容。** 平台特定的按键文本和调用方提供的快捷键组合可以变化，而不改变此处记录的两部分解剖结构。

### Representative states

| 状态       | 必需不变式                                                 | 允许的变化 |
| ---------- | ---------------------------------------------------------- | ---------- |
| 单个按键   | 一个徽章；名称为该按键的朗读名称。                         | 按键。     |
| Mod + 按键 | 依平台为 ⌘ 或 Ctrl；名称为 “Command” 或 “Control” + 按键。 | 平台。     |
| 重复按键   | 每次出现一个徽章。                                         | —          |

### Transformation and precedence order

- **ORD1 — 按键解析。** 按 `+` 拆分 → 去除首尾空白 → 转小写 → 别名 → 字形和朗读名称。

### Performance and resources

- **PR1 — 无监听器。** Kbd 不附加任何事件监听器。

## Accessibility contract

- **AR1 — 单一名称。** 该快捷键是一个图像，由其各按键的朗读名称命名，除非调用方的 `aria-labelledby` 为其命名；字形徽章是隐藏的（FR4）。
- **AR2 — 本地化。** 可见的短文本和朗读名称通过目录跟随提供方的语言环境（FR3、FR4）。

## Design relationships

| 解剖结构或状态 | 设计要求                                   | 呈现权威           | 层级角色 | 组件契约      |
| -------------- | ------------------------------------------ | ------------------ | -------- | ------------- |
| 快捷键         | 对完整快捷键进行分组，并携带其无障碍名称。 | 当前源码和公开文档 | 辅助     | FR1、FR2、FR4 |
| 按键徽章       | 为所提供组合中的每个按键绘制一个可见徽章。 | 当前源码和公开文档 | 主要     | FR1–FR3       |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Shortcut": {"target": "kbd"},
  "Key badge": {
    "none": {
      "reason": "unsettled: No current public target reaches this part"
    }
  }
}
```

`none` 处置记录当前的可达性，而目标暴露仍待确定。它并不决定按键徽章应继续保持没有公共目标。

## Family and system relationships

- `architecture:component-theming-surface` 负责解剖结构认定、目标映射，以及事实可达性与预期的公共主题化 API 之间的区别。
- `architecture:internationalization` 负责由目录支撑的 Astryx 文本；FR3 和 FR4 从中获取其短文本、朗读名称和连接消息。

## Verification map

| 契约                | 验证                                                                                                                                           | 代表性状态                                                         | 变异或失败预期                                                                                                                                                                                                                                                                           | 审计小节                  |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| FR1                 | `Kbd.test.tsx` 的单键、多键、空白、别名和重复键用例                                                                                            | 单个和多个按键；带空格和大小写混合的输入；重复的别名               | 缺失或多出的徽章、未去除空白或大小写错误的按键，或丢失的别名，均判定失败。`KbdAudit.a11y.chromium.spec.ts` 的大字号用例测量每个徽章在设定文本大小时增长越过 `--spacing-5`。                                                                                                              | `audit:Kbd/anatomy`       |
| FR2                 | `Kbd.test.tsx` 的主题类用例                                                                                                                    | 根目标和子徽章                                                     | 缺失根 `kbd` 目标判定失败。证据缺口：没有测试断言徽章不携带目标。                                                                                                                                                                                                                        | `audit:Kbd/theming`       |
| FR3, FR4            | `Kbd.test.tsx` 的字形、平台、无障碍名称、覆盖和本地化用例（“localizes visible key text and the spoken shortcut combination”）                  | Mac 和非 Mac；特殊按键和未知按键                                   | `mod`、`ctrl`、`alt`、`shift`、`enter`、`escape`、`plus` 或未知按键的字形错误、徽章被暴露、调用方 `role` 或 `aria-label` 替换了计算出的值，或文本跳过目录，均判定失败。证据缺口：没有测试断言 `backspace`、`tab` 或方向键的字形，也没有测试断言水合之前的 “Ctrl” 文本和 “Control” 名称。 | `audit:Kbd/accessibility` |
| FR3 修饰键          | `Kbd.test.tsx` 的修饰键用例：Apple 符号、Windows 和 Linux 目录文本、在 Mac 上的服务端渲染、本地化短文本；使用 Windows 用户代理的真实浏览器渲染 | Apple（`MacIntel`）；非 Apple（`Win32`、`Linux x86_64`）；水合之前 | 在非 Apple 平台或水合之前，`ctrl`、`alt` 或 `shift` 显示符号；在非 Apple 平台或水合之前，`meta` 显示目录中 Windows 键文本以外的任何内容；朗读名称发生变化；或修饰键文本跳过目录，均判定失败。                                                                                            | `audit:Kbd/accessibility` |
| 主题化解剖结构映射  | `scripts/check-knowledge.mjs`                                                                                                                  | 规范的解剖结构和目标                                               | 缺失、多余、带前缀、过期或由别名支撑的映射无法通过仓库校验。                                                                                                                                                                                                                             | `audit:Kbd/theming`       |
| ORD1, PR1, AR1, AR2 | ORD1 由 FR1 和 FR3 行覆盖，AR1 和 AR2 由 FR3、FR4 行覆盖。证据缺口：没有测试断言监听器不存在                                                   | —                                                                  | —                                                                                                                                                                                                                                                                                        | `audit:Kbd/behavior`      |

## Current-state impact

- **目标位于不绘制的组上（FR2）。** `kbd` 目标位于快捷键组上，而该组自身不绘制任何内容，这违反了 `architecture:component-theming-surface` INV4；绘制内容的是按键徽章。在 OQ1 决定之前，它按 `architecture:public-component-api` INV21a 保持已发布状态。

## Decision log

无组件本地决策。

## Open questions

- **OQ1 — 每个按键徽章是否应获得稳定的公共主题化目标？**（`human-api`）当前的可达性缺失并不决定答案。

## Content boundary

本文件不重复使用方的 prop 表/示例、当前审计结果、实现步骤或系统规则。它链接到这些内容的所有者。
