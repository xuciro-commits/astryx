---
schema_version: 3
template_version: 7
kind: component
id: component:InfoTip
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers: [public-api, behavior, accessibility]
verified_by:
  [
    packages/core/src/InfoTip/InfoTip.test.tsx,
    packages/core/src/InfoTip/InfoTip.pin.test.tsx,
    packages/core/src/InfoTip/__tests__/InfoTipTouch.a11y.chromium.spec.ts,
    packages/core/src/InfoTip/__tests__/InfoTipAudit.a11y.chromium.spec.ts,
    packages/core/src/Layer/__tests__/TouchTrigger.a11y.chromium.spec.ts,
    packages/lab/src/InfoTip/InfoTip.test.tsx,
    packages/core/src/Tooltip/Tooltip.test.tsx,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:public-component-api,
    architecture:icon-resolution-and-component-slots,
    architecture:component-theming-surface,
  ]
contributing: []
system_specs: [spec:AST-017, spec:AST-094]
---

# InfoTip component contract

<!-- path-applicability:v1 -->

```json
{
  "paths": ["packages/lab/src/InfoTip/index.ts"]
}
```

## Contract at a glance

| Area                    | Contract                                                                                                                                                                                                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Public contract         | 来自 `@astryxdesign/core` 的 `InfoTip`，具有 `content`、`label`（本地化的“More information”）、`size`（`sm`）、转发到按钮的 `ref`，以及 BaseProps 的 `xstyle`、`className` 与 `style`。`@astryxdesign/lab` 的导出是保留一个发布版本的已弃用再导出。                |
| Behavior                | 一个具名原生信息图标按钮，通过 `useTooltip` 的 `show()` 与 `hide()` 固定其帮助：悬停与聚焦会预览帮助，单击、轻点、Enter 或 Space 将其固定为打开，直到 Escape、第二次按压、外部按压或焦点离开，而在悬停显示的提示上按下鼠标或笔会将其保持在位，不会再次隐藏并显示。 |
| End-user impact         | 使用鼠标、触摸、键盘或屏幕阅读器的人可以打开、保持打开并关闭“i”背后的帮助，并在其固定时听到一次播报。                                                                                                                                                              |
| Builder impact          | 在标签、值或指标旁提供帮助时使用 InfoTip，而不是在 Tooltip 内组合一个图标。Lab 调用方需更改导入。                                                                                                                                                                  |
| Compatibility/readiness | 在 Core 0.7.7 中发布；`@astryxdesign/lab` 的导出是它的已弃用再导出，保留一个发布版本（FR4）。                                                                                                                                                                      |
| Review checks           | 否决 InfoTip 自有的层、文档监听器、计时器或关闭规则，按钮周围的包裹元素，不是具名原生按钮的触发器，会传导到其周围行、卡片或标签的固定按压，在鼠标或笔按压时闪烁的预览，未翻译的默认名称，或 FR3 所列之外的 prop。                                                  |
| Governing rules         | `component:Tooltip` FR9、FR10、FR12、AR6；`architecture:public-component-api` INV21；`spec:AST-094` FR42；`spec:AST-017`（生命周期）。                                                                                                                             |

本表是审查投影；下文正文具有权威性。

## Intent

InfoTip 是基于 `useTooltip` 的 `show()` 与 `hide()` 的信息图标预设。它拥有触发按钮、其图标、其名称、其默认值，以及固定并关闭帮助的按压操作，因此产品中每个“i”的读法与行为都一致；Tooltip 拥有预览、固定保持与播报。使用方用法见 `InfoTip.doc.mjs`。

## Compatibility and migration

- 已发布的默认值保持：是。Core 在 0.7.7 中发布 InfoTip，0.7.8 移除了它的包裹元素（DEC-1，已修订）；Lab 组件的 props 保持其含义
- 兼容类别：新增式 Core 导出；Lab 组件以相同的 props 迁入 Core，并通过 `useTooltip` 的 `show()` 与 `hide()` 固定，而不是通过 `touchTrigger="tap"` 打开
- 受控/非受控行为：仅非受控；打开状态属于 Tooltip
- 迁移决策：DEC-1；`@astryxdesign/lab` 的 `InfoTip` 导出保留一个发布版本，作为 Core 组件的已弃用再导出，随后被移除

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- 在标准间距下，细指针下 sm 盒子为 20×20 px（某些主题渲染为 22×22 px）；当调用方让其他目标保持 24 px 距离时，它通过间距例外满足 WCAG 2.5.8，且 `spec:AST-094` FR42 保持桌面盒子不变。

## Ownership boundary

**拥有**

- 触发按钮、其信息图标、其无障碍名称与默认值，以及其触摸命中区域（FR1、AR1）。
- 通过 `useTooltip` 的 `show()` 与 `hide()` 固定并关闭帮助的按压操作，以及按钮的 `aria-describedby`、`aria-expanded` 与 `aria-controls`（FR2）。

**不拥有 / 非目标**

- 帮助何时预览、已固定的帮助如何关闭、其播报、其表面以及其 Escape 顺序——由 `component:Tooltip` FR3–FR10 与 FR12，以及 `family:overlay-dismissal` 拥有。
- 信息图稿解析——由图标注册表拥有（`architecture:icon-resolution-and-component-slots`）。
- 富文本或交互式帮助——`component:HoverCard`。

## Public concepts

| Concept | Closed values or states | Meaning                               | Availability by variant/orientation/state | Default | Owner               | Stability | Invalid-value behavior    |
| ------- | ----------------------- | ------------------------------------- | ----------------------------------------- | ------- | ------------------- | --------- | ------------------------- |
| 尺寸    | `xsm`、`sm`、`md`、`lg` | 信息图标的大小：12、16、20 或 24 px。 | 每个 InfoTip。                            | `sm`    | `component:InfoTip` | 稳定      | TypeScript 拒绝其他取值。 |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Basis                                                                                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| FR1 | InfoTip 渲染一个 `<button type="button">`，其名称由 `label` 提供，否则使用已翻译的 `@astryx.infoTip.label`（“More information”），其中包含注册表的 `info` 图标，大小为 `size`。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | DEC-1；WCAG 2.2 SC 4.1.2；`architecture:icon-resolution-and-component-slots`          |
| FR2 | InfoTip 通过一次带 `content` 的 `useTooltip` 调用渲染其按钮与该层，没有包裹元素；Tooltip 的 ref 与命中区域的 ref 在按钮上合并。按钮带有指明该帮助的 `aria-describedby`、`aria-expanded`（仅在已固定时为 `true`），以及帮助显示时指明其表面的 `aria-controls`。单击、轻点、Enter 或 Space 通过 `show()` 固定帮助，而对已固定帮助的同一按压通过 `hide()` 将其关闭；该按压在 React 树中停止，因此按钮周围的行、卡片或标签不会随之动作。在悬停显示的提示上按下鼠标或笔时，它在 pointer-down 时通过 `show()` 将其保持在位，因此 Tooltip 的按压关闭（`component:Tooltip` FR6）让它保持打开：它不会再次隐藏并显示，随后该单击会将其固定。触摸与键盘仅通过单击固定。InfoTip 不添加自己的层、文档监听器、计时器、播报或关闭规则：预览、已固定帮助如何关闭以及播报都是 Tooltip 的 FR3–FR10 与 FR12。 | DEC-1；`component:Tooltip` FR9、FR10、FR12；`architecture:public-component-api` INV21 |
| FR3 | 公共 props 为 `content`（必填；简短、非交互式帮助）、`label`、`size`、转发到按钮的 `ref`，以及 BaseProps 的 `xstyle`、`className` 与 `style`；InfoTip 不接受打开状态、放置或触发器 props。宿主的 `data-*` 属性会到达按钮；其名称与 FR2 的属性仍由组件拥有。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | DEC-1                                                                                 |
| FR4 | `@astryxdesign/lab` 的 `InfoTip` 导出再导出 Core 组件，以静态元数据标记为已弃用，保留一个发布版本，随后被移除。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `spec:AST-017` FR29、FR29a                                                            |

### Allowed variation

- **AV1 — 图标图稿。** 主题可以替换注册表的 `info` 图稿。
- **AV2 — 帮助文本。** `content` 可变；它保持简短且非交互式。

### Representative states

| State  | Required invariant                                   | Allowed variation |
| ------ | ---------------------------------------------------- | ----------------- |
| 关闭   | 一个带信息图标的具名按钮；`aria-expanded="false"`。  | 尺寸。            |
| 预览   | Tooltip 在悬停或键盘聚焦时显示并描述该按钮。         | —                 |
| 已固定 | Tooltip 保持打开，`aria-expanded="true"`，播报一次。 | —                 |

### Transformation and precedence order

- **ORD1 — 名称。** `label`，然后是已翻译的默认值。

### Performance and resources

- **PR1 — 没有自己的资源。** 除了其按钮的 click 与 pointer-down 处理器以及 AR1 要求的共享命中区域监视之外，InfoTip 不添加任何文档监听器、观察器、计时器或层；它带来的其他资源只有 Tooltip 的。

## Accessibility contract

- **AR1 — 触发器是一个具名按钮。** 该按钮在 Tab 顺序中、具有名称（FR1），并且在粗指针下，在邻居留出空间时通过不可见命中区域达到 44 px：命中区域绝不与邻居的目标重叠，并被限制在近邻之间间隙的一半（`spec:AST-094` FR42）。
- **AR2 — 该帮助是一个 toggletip。** `component:Tooltip` AR6：键盘与触摸用户无需悬停即可固定并关闭帮助，按钮报告 `aria-expanded`，帮助在固定时播报一次。

## Design relationships

| Anatomy or state | Design requirement                     | Representation authority | Hierarchy role | Component contract |
| ---------------- | -------------------------------------- | ------------------------ | -------------- | ------------------ |
| 触发按钮         | 一个容纳图标的小圆形按钮。             | 当前源码                 | 辅助           | FR1、AR1           |
| 信息图标         | 注册表中大小为 `size` 的 `info` 图稿。 | 图标注册表               | 辅助           | FR1                |
| 帮助表面         | 带 `content` 的 Tooltip 表面。         | `component:Tooltip`      | 突出           | FR2                |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Trigger button": {
    "none": {
      "reason": "unsettled: InfoTip's own button paints but has no public theming target yet; adding an `info-tip` target is a future owner decision"
    }
  },
  "Info icon": {"delegatesTo": {"owner": "component:Icon", "target": "icon"}},
  "Help surface": {
    "delegatesTo": {"owner": "component:Tooltip", "target": "tooltip"}
  }
}
```

`none` 处置记录当前可达性，而触发按钮的目标暴露仍未确定（`architecture:component-theming-surface` INV3）。信息图标的图稿来自图标注册表，帮助表面属于 Tooltip（`architecture:component-theming-surface` INV5）。

## Family and system relationships

- `component:Tooltip` 拥有预览、`show()` 保持、播报与表面；InfoTip 完全构建在 `useTooltip` 之上（DEC-1）。
- `family:overlay-dismissal` 通过 Tooltip 拥有 Escape 顺序。
- `architecture:icon-resolution-and-component-slots` 拥有 `info` 图稿。
- InfoTip 与 Tooltip 是同一个 API，原因见 DEC-1：InfoTip 完全构建在 `useTooltip` 的公共 `show()` 与 `hide()` 之上，不添加自己的层、计时器或关闭规则，正如 `component:MoreMenu` 构建在 DropdownMenu 之上。

## Verification map

| Contract            | Verification                                                                                                                                                                                                                                                                  | Representative states                                                                                                                                                   | Mutation or failure expectation                                                                                                                                                                  | Audit section                 |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------- |
| FR1、AR1            | `InfoTip.test.tsx` 的按钮、名称、目录默认值、图标尺寸与命中区域用例；`InfoTipTouch.a11y.chromium.spec.ts` 的粗指针可达性、邻居与细指针用例；`InfoTipAudit.a11y.chromium.spec.ts` 在细指针下、浅色与深色以及两个主题中的按钮、名称、图标尺寸、圆形盒子、聚焦轮廓与间距例外检查 | 默认与自定义名称；每种尺寸；标签旁的按钮                                                                                                                                | 不是具名按钮的触发器、未翻译的默认值、尺寸偏离的图标、在邻居留出空间时仍低于 44 px 或触及邻居目标的粗指针命中区域，或在 24 px 内存在相邻目标时细指针盒子低于 24 px，均失败。                     | `audit:InfoTip/accessibility` |
| FR2、AR2            | `InfoTip.pin.test.tsx`；`InfoTip.test.tsx` 的按压用例；`InfoTipAudit.a11y.chromium.spec.ts` 的悬停、键盘聚焦、点击固定、按键固定与 Escape 用例；`TouchTrigger.a11y.chromium.spec.ts` 的 InfoTip 按压固定与鼠标下已固定套件                                                    | 悬停与聚焦预览；单击、轻点、Enter、Space 固定；第二次按压、外部按压、焦点离开与 Escape 关闭；在悬停预览上按下鼠标或笔；位于 ClickableCard、Item 行与 `<label>` 内的按钮 | 不固定或不关闭的按压、在鼠标或笔按压时关闭并重新打开的预览、缺失或过期的 `aria-expanded` 或 `aria-controls`、还会激活卡片、行或带标签控件的按压，或 InfoTip 自有的包裹、层或文档监听器，均失败。 | `audit:InfoTip/behavior`      |
| FR3                 | `InfoTip.test.tsx` 的 props 用例：类型检查器拒绝其他 props，并且 `ref`、`xstyle`、`className`、`style` 与宿主 `data-*` 属性到达按钮                                                                                                                                           | `content`、`label`、`size`、`ref`、`xstyle`、`className`、`style`                                                                                                       | 超出这些的 prop，或未到达按钮的 `ref`，均失败。                                                                                                                                                  | `audit:InfoTip/api`           |
| FR4                 | Lab `InfoTip.test.tsx` 的身份与弃用用例                                                                                                                                                                                                                                       | Lab 导入                                                                                                                                                                | 不是 Core 组件的 Lab 导出，或缺少弃用元数据的 Lab 导出，均失败。                                                                                                                                 | `audit:InfoTip/api`           |
| Theming anatomy map | `scripts/check-knowledge.mjs`                                                                                                                                                                                                                                                 | 三个解剖部分及其处置                                                                                                                                                    | 缺失、多余或过期的映射，或委托给其所有者未声明的目标，均使仓库校验失败。                                                                                                                         | `audit:InfoTip/theming`       |

## Decision log

### DEC-1 — InfoTip is a preset over `useTooltip`'s show and hide

**引用：** `component:InfoTip/DEC-1`

**决策者：** `cixzhang`、`2026-10-31`；修订于 `2026-11-03`

“i”背后的帮助与按下时固定的 tooltip 是同一件事，因此 InfoTip 只提供具名按钮、其图标、其默认值以及执行固定的按压，并完全构建在 `useTooltip` 的公共 `show()` 与 `hide()` 之上（`component:Tooltip` FR12）。Tooltip 没有自己的切换选项：InfoTip 的固定方式与任何应用的切换式按钮相同。完全构建在另一个公共 API 上的组件与它同属一个 API（`architecture:public-component-api` INV21，`spec:AST-107` DEC-2 与 DEC-3 的推理适用于构建在公共工厂之上的组件），就像 `component:MoreMenu` 构建在 DropdownMenu 之上，因此 InfoTip 不添加完成 Tooltip 工作的第二条途径。

已否决：一个通用 toggletip 组件，它会重复 Tooltip 与 HoverCard 的预览。

## Open questions

无。

## Content boundary

本文件不重复 Tooltip 的打开、关闭或播报规则、使用方 props 表或示例。它链接到其所有者。
