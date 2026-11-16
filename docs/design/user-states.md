---
schema_version: 1
template_version: 1
kind: design
id: design:user-states
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-09-19
owners: [ernestt, cixzhang]
review_triggers: [visual, interaction, accessibility]
verified_by:
  [
    packages/core/src/__tests__/PressedState.a11y.chromium.spec.ts,
    packages/core/src/CheckboxInput/CheckboxInput.test.tsx,
    packages/core/src/Collapsible/Collapsible.test.tsx,
    packages/core/src/Field/__tests__/TextFieldFocusTiming.interaction.browser.spec.ts,
    packages/core/src/Field/__tests__/textFieldFocusTiming.test.tsx,
    packages/core/src/Link/Link.test.tsx,
    packages/core/src/RadioList/RadioList.test.tsx,
    packages/core/src/SegmentedControl/SegmentedControl.test.tsx,
    packages/core/src/Slider/Slider.test.tsx,
    packages/core/src/Switch/Switch.test.tsx,
    packages/core/src/TabList/TabList.test.tsx,
    packages/richtext/src/RichTextEditor.focusTiming.test.tsx,
  ]
architecture: [architecture:interaction-modality, architecture:theme-tokens]
components:
  [
    component:CheckboxInput,
    component:Collapsible,
    component:Link,
    component:Slider,
    component:Switch,
    component:TabList,
    component:RadioList,
    component:SegmentedControl,
  ]
families: []
deciding_specs: []
---

# User states design specification

## User intent

持有或拖动已启用控件的指针用户，应在正在操作的表面上获得即时、一致的反馈。该反馈不得暗示已禁用控件作出了响应，也不得抹去持久选中的表面。

## Design principles

- **DR1 — 按压被操作的表面。** 在指针按住或拖动期间，下方矩阵中的每个已启用表面必须在指定的视觉部分绘制 `--color-overlay-pressed`。该覆盖层是瞬态的，并必须在按压或拖动结束时清除。覆盖层的时序在每种指针下遵循 `spec:AST-094` FR11 的按压配置。
- **DR2 — 禁用意味着无响应。** 矩阵中的已禁用控件必须保持不可操作，且不得获得按压视觉处理。
- **DR3 — 持久选中优先。** 选中的 SegmentedControl 项在指针按住期间必须保留其凸起的选中表面；只有未选中项接受按压覆盖层。在触控呈现下，该表面会抬起，如同 UISegmentedControl 所做的那样（`component:SegmentedControl` FR14）；在精细主指针下则保持不变。其按压时序遵循 `spec:AST-094` FR11。

## Anatomy and hierarchy

| 角色         | 用途                     | 必需关系                                         |
| ------------ | ------------------------ | ------------------------------------------------ |
| 交互目标     | 接收指针按住或拖动       | 拥有或控制矩阵中指定的绘制表面                   |
| 按压覆盖层   | 确认当前操作处于活动状态 | 在现有填充之上合成，不替换内容或持久状态         |
| 持久选中表面 | 传达已选中的分段         | 在指针按住期间不接受按压覆盖层；在触控呈现下抬起 |

## State representation

| 组件             | 已启用指针按住或拖动                                                             | 已禁用指针按住                   |
| ---------------- | -------------------------------------------------------------------------------- | -------------------------------- |
| CheckboxInput    | 指示器绘制 `--color-overlay-pressed`                                             | 指示器保持不变                   |
| Collapsible      | 触发行绘制 `--color-overlay-pressed`                                             | 触发行保持不变，且不展开或折叠   |
| Link             | 文本表面绘制 `--color-overlay-pressed`                                           | 文本表面保持不变且不激活         |
| Slider           | 仅被拖动的滑块拇指绘制 `--color-overlay-pressed`                                 | 滑块拇指保持不变，值不改变       |
| Switch           | 轨道与滑块拇指均绘制 `--color-overlay-pressed`                                   | 轨道与滑块拇指保持不变，值不改变 |
| TabList Tab      | 标签表面绘制 `--color-overlay-pressed`                                           | 标签表面保持不变，选择不改变     |
| RadioList        | 指示器绘制 `--color-overlay-pressed`                                             | 指示器保持不变，选择不改变       |
| SegmentedControl | 未选中项绘制 `--color-overlay-pressed`；选中项保留其凸起表面，并在触控呈现下抬起 | 项表面保持不变，选择不改变       |

该表是当前完整的声明。它不批准其他组件的按压处理，也不决定其状态设计。

## Responsive and input behavior

- **DR4 — 遵循真实交互。** 按住驱动的控件仅在指针按下时保留覆盖层。Slider 遵循其现有拖动状态，因此覆盖层保留在被拖动的滑块拇指上，包括拖动从轨道开始时。
- **DR5 — 保留静止结果。** 在释放或取消后，组件必须返回到原本应具有的相同视觉状态；按压反馈不会创建持久状态。

## Accessibility intent

按压反馈补充而非替代控件的语义状态、标签、焦点指示或禁用行为。一个在语义上暴露为禁用的控件必须保持不可操作，即使其实现为解释不可用原因而保持其可聚焦。

## Representative examples

- 按住已启用的 CheckboxInput 行会加深其指示器；在外部释放且未激活时，恢复原始指示器像素。
- 拖动范围 Slider 仅绘制当前正在移动的滑块拇指。
- 按住选中的 SegmentedControl 项不会在其凸起表面上绘制按压覆盖层，该表面在触控呈现下抬起；按住未选中项会绘制按压覆盖层。

## Visual references

由 `packages/core/src/__tests__/PressedState.a11y.chromium.spec.ts` 生成的真实 Chromium 证据，捕获这八个组件的匹配静止、按住指针、释放、禁用和选中例外表面。CI 在 `pressed-state-evidence` 产物中发布这些 PNG、像素差异、Chromium 版本、视口、story ID、哈希和确切的 PR 头 SHA。生成的证据验证此记录，但不是规范性设计资产。

## Component contract links

`components` frontmatter 列表是 DR1–DR5 的机器可读采用矩阵。组件记录不重复这一跨组件决策。

## Decision log

### DEC-1 — Use the system pressed overlay on the bounded eight-component matrix

**参考：** `design:user-states/DEC-1`
**决策者：** `cixzhang`, 2026-09-19

一致的反馈帮助指针用户理解哪个已启用表面正在积极响应。该决策有意限定在矩阵中的表面，保留禁用行为，并保持已选中分段凸起表面的稳定。

### DEC-2 — A tapped text field shows its focus look at once

**参考：** `design:user-states/DEC-2`
**决策者：** `cixzhang`, 2026-11-07

被点按的文本字段会立即显示其焦点外观，没有淡入效果，与 web 的即时焦点外观一致，同时保持性能：在 Chromium 中为 2 次重绘，而非 18 次；在 iPhone 的 Safari 中，焦点停顿已经掩盖了大部分淡入效果。

设备的主指针决定时序，因此在配备硬件键盘的平板上按下 Tab 键也会立即显示焦点外观。

## Open questions

对于限定的按压状态决策或 DEC-2，没有任何待决问题。悬停、DEC-2 之外的焦点、选中分段例外之外的选择处理，以及其他组件的采用，仍在此记录当前声明的范围之外。

## Content boundary

本文件定义了已批准的跨组件按压状态意图及其限定采用矩阵，以及被点按文本字段的焦点时序（DEC-2）。组件实现拥有选择器和事件机制；架构记录拥有交互模态和 token 行为；测试和 CI 产物拥有当前一致性证据。
