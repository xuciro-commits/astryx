---
schema_version: 1
template_version: 1
kind: design
id: design:mobile-typography
authority: current
archive_reason: null
superseded_by: null
approved_by: rubyycheung
approved_at: 2026-09-30
owners: [imdreamrunner, rubyycheung]
review_triggers: [visual, responsive, theming]
verified_by: [scripts/check-knowledge.mjs]
architecture: [architecture:theme-tokens, architecture:theme-authoring-contract]
components: []
families: []
deciding_specs: [spec:AST-102/DEC-2]
---

# Mobile typography design specification

## User intent

在粗指针 iOS 设备上，使其余文本样式与输入控件自动采用的 16px 参考基准下限保持平衡。

## Design principles

- **DR1 — 阅读基准。** 移动端基准必须为 `M = max(B, 16)`；16px 参考基准即 `1rem`。当用户已设置文本大小时，该设置会取代此基准，DR2 的固定目标不再适用（`spec:AST-102` FR3）。
- **DR2 — 固定目标。** 所选角色必须保留其桌面尺寸；其他角色则遵循推导出的比例。

## Anatomy and hierarchy

`B` 是桌面基准，`r` 是其比例，`k` 是原始步进，`a` 是选定的固定步进。

| 桌面比例 r         | 固定目标；步进 a | 设计意图                                           |
| ------------------ | ---------------- | -------------------------------------------------- |
| `r <= 1.25`        | Display 1；`+6`  | 在阅读基准增大时，保留紧凑比例的展示级尺寸。       |
| `1.25 < r < 1.414` | Heading 2；`+2`  | 保留 Heading 2，同时相对正文缩小更大的展示级角色。 |
| `r >= 1.414`       | Heading 3；`+1`  | 保留 Heading 3，使展示层级在窄屏上不压过正文。     |

要求的尺寸关系如下：

```text
M = max(B, 16)
r_pin = r * (B / M)^(1/a)
desktop(k) = round(B * r^k)
mobile(k) = round(M * r_pin^k)
```

四舍五入到最接近的整数参考像素，恰好在中间时向上取整；除以 16 得到 rem。位于固定点之上的角色会缩小；位于其下的角色会增大（`B < 16`，取整前）。

## State representation

在移动端条件之外，保留桌面尺寸。
当 `B >= 16` 且未设置文本大小时，移动端配置保留桌面基准与比例。

## Responsive and input behavior

- **DR3 — 激活条件。** 默认情况下，移动端必须匹配 `(width < 1024px) and (pointer: coarse)`。

宽度指布局视口；coarse 指主指针。
使用由 `spec:AST-012` 管辖的有效 `lg` 断点；默认值为 1024 CSS px，且上边界为开区间（不含）。
浏览器支持与回退遵循 `spec:AST-013`；浏览器特定行为需要来自该浏览器的证据。

## Accessibility intent

- **DR4 — 根字号。** 移动端配置不得更改文档根元素的字体大小。

## Representative examples

```text
B=14; r=1.333; a=2; M=16; r_pin=1.246907324142416
heading-2: 25→25px; body: 14→16px; display-1: 79→60px
```

### Verification

| 契约     | 验证方式             | 代表性状态                     | 失败信号               |
| -------- | -------------------- | ------------------------------ | ---------------------- |
| DR2      | 检查比例到目标的映射 | 低于、等于和高于 1.25/1.414    | 目标或边界错误         |
| DR1, DR2 | 比较要求尺寸         | 计算示例；B>=16                | 锚点或基准发生变化     |
| DR3      | 检查激活条件         | 窄/宽 × 粗/细指针；恰好 1024px | 逻辑组合或边界错误     |
| DR4      | 检查根字号           | 移动端配置启用/停用            | 文档根字体大小发生变化 |

## Visual references

未包含规范性资源。

## Component contract links

未引入组件特定的契约链接。

## Decision log

### DEC-1 — Mobile size relationships

**参考：** `design:mobile-typography/DEC-1`
**决策人：** `rubyycheung`，`2026-09-30`
**决策：** 应用 DR1–DR4，以在移动端文本样式与输入控件最小值之间取得平衡。

## Open questions

- **OQ1 — 本政策必须支持哪些桌面基准尺寸与比例？**

## Content boundary

本记录定义移动端文本字号关系，不定义 prop 语法、实现结构、当前审计评分或使用者用法示例。
