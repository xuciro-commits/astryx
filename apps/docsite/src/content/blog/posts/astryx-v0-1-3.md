---
title: 'Astryx v0.1.3：更好的表格、键盘导航与无障碍'
description: 'Table 支持插件贡献的右键菜单，完整的 WAI-ARIA 键盘交互模式，InputGroup 组合能力，以及更多内容——另有一项轻松的破坏性变更。'
date: '2026-07-04'
type: 'update'
authors:
  - 'team'
tags:
  - '发布'
  - '无障碍'
  - '组件'
---

Astryx v0.1.3 已发布。本次发布在无障碍、键盘导航和数据表格方面迈出了一大步。安装方式：

```bash
npm i @astryxdesign/core@0.1.3
```

所有包以同一版本一起发布，请将每个 `@astryxdesign/*` 包都升级到 `0.1.3` 以保持一致。

## 亮点

### Table 的右键上下文菜单

表格现在支持由插件贡献的上下文菜单。右键点击列标题或行，就能获得真正的操作——例如升序排序、降序排序和清除排序——而不是浏览器默认菜单。插件通过现有的 cell transforms 添加自己的操作，表格会汇总所有已启用插件的操作，因此无需改动核心即可扩展菜单。

### 键盘导航

`TabList`、`TreeList`、`Toolbar`、`SegmentedControl` 和各菜单现在都遵循 WAI-ARIA APG 模式：单一 Tab 停留点、方向键导航、Home/End 键、typeahead 和 roving focus。新的构建块——`useListFocus`、`useGridFocus`、`useTypeahead`、`useKeyboardHint` 和 `useAnnounce`——让你可以自行构建无障碍的复合组件；新的 `VisuallyHidden` 原语则让添加仅屏幕阅读器可见的上下文变得轻而易举。

### 在 InputGroup 中组合输入控件

`Selector`、`MultiSelector`、`DateInput`、`TimeInput` 和 `Typeahead` 现在可以放入 `InputGroup`，共享标签、描述，并连成一体化的边框。

### 解释禁用控件的原因

为选择类、选择器和文本输入类控件添加 `disabledMessage`，即可通过工具提示告诉用户该控件*为什么*被禁用——同时保持控件可聚焦，让键盘用户也能读到这条说明。

### 布局易用性

`Stack`、`Grid` 和 `Center` 新增 padding、尺寸和滚动相关 props，常见的框架式布局不再需要内联 `style={{}}`。

### Popover 关闭控制

新增的 `hasLightDismiss` 和 `hasEscapeDismiss` props 让你可以构建需要显式关闭的浮层，例如新手引导提示。图层动画现在会遵循 `prefers-reduced-motion`。

### 更多

新增 **Kanban Board** 模板，以及**博客 RSS 订阅和纯文本（`.txt`）文章**。

## 一项破坏性变更（很简单）

`hasAutoFocus` 已从 `DropdownMenu`、`ContextMenu` 和 `MoreMenu` 中移除。菜单现在打开时始终聚焦第一项——这才是符合 APG 的正确行为。无需迁移；如果你之前传入了这个 prop，直接删掉即可。

## 感谢

衷心感谢每一位为本次发布做出贡献的人：[@AKnassa](https://github.com/AKnassa)、[@arham766](https://github.com/arham766)、[@athz](https://github.com/athz)、[@cixzhang](https://github.com/cixzhang)、[@durvesh1992](https://github.com/durvesh1992)、[@ejhammond](https://github.com/ejhammond)、[@ernestt](https://github.com/ernestt)、[@harshavardhan194](https://github.com/harshavardhan194)、[@humbertovirtudes](https://github.com/humbertovirtudes)、[@IFAKA](https://github.com/IFAKA)、[@imdreamrunner](https://github.com/imdreamrunner)、[@josephfarina](https://github.com/josephfarina)、[@kentonquatman](https://github.com/kentonquatman)、[@mohitWeb-lab](https://github.com/mohitWeb-lab)、[@pollychen-lab](https://github.com/pollychen-lab) 和 [@thedjpetersen](https://github.com/thedjpetersen)。

同样感谢 [@aarongarciah](https://github.com/aarongarciah) 对无障碍方面的反馈，以及 [@aurorascharff](https://github.com/aurorascharff)，她推动了利用最新 Next.js 特性优化文档站的工作。

完整变更日志见 [v0.1.3 发布页面](https://github.com/meta/astryx/releases/tag/v0.1.3)。
