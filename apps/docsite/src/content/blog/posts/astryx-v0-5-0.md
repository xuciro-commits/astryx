---
title: 'Astryx v0.5.0：30 种语言环境、一个 Escape 键，以及进入核心包的 Bottom Sheet'
description: '0.4.0 以来的一切汇于一个版本：覆盖层的共享关闭栈、附带 codemod 的 Banner API 变更、28 个新增语言环境目录，以及一直作用到 CSS 的主题继承。'
date: '2026-08-24'
type: 'update'
authors:
  - 'team'
tags:
  - '发布'
  - '无障碍'
  - '国际化'
---

Astryx v0.5.0 发布了，汇集了 0.4.0 以来的八个版本。

```bash
npm i @astryxdesign/core@0.5.0
```

所有稳定的 `@astryxdesign/*` 包都以同一版本发布，因此请将它们全部升级到 `0.5.0` 以保持一致。仅以 canary 发布的包——`lab`、`charts`、`richtext`、`vega`——则按各自的版本线发行。

## 两个破坏性变更

先预览迁移：

```bash
npx @astryxdesign/cli upgrade --from <your-version>
```

这是一次试运行。加上 `--apply` 才会将更改写入磁盘。

### Banner 的折叠轴合并为一个 `collapsible` prop

`defaultIsExpanded` 已被移除，内容也可以完全选择不折叠——这正是横幅最常需要的情况（[#5255](https://github.com/meta/astryx/pull/5255)）。`collapsible` 接受布尔值或配置对象，沿用 `SideNav.collapsible` 定下的约定：

```tsx
// `status` and `title` are required on every Banner
<Banner status="error" title="Check 3 fields">…</Banner>                                 // unchanged: starts closed
<Banner status="error" title="Check 3 fields" collapsible={false}>…</Banner>             // always visible, no toggle
<Banner status="error" title="Check 3 fields" collapsible={{defaultIsOpen: true}}>…</Banner>   // replaces defaultIsExpanded
<Banner status="error" title="Check 3 fields" collapsible={{isOpen, onOpenChange}}>…</Banner>  // controlled
```

默认渲染保持不变，codemod 会重写每个显式传入该 prop 的调用处。它看不到对象展开（spread）——TypeScript 也看不到，因为后者不会对展开做多余属性检查——所以运行后请 grep `defaultIsExpanded`，并手动迁移 `<Banner {...props} />`。

### 一个 Escape 只关闭一层

过去每个覆盖层都拥有自己的 Escape 监听器，因此一次按键可能同时关闭 Popover _和_承载它的 Dialog。现在覆盖层共享同一个关闭栈，每次按键只会路由到最顶层，而不会影响其他层（[#4881](https://github.com/meta/astryx/pull/4881)）。Dialog 内的 Tooltip 只会关闭该 tooltip。

最顶层由 React 树的嵌套关系决定，因此即使经过 portal 也仍然成立。层通过 `useLayerDismissal` 的 `escapeBehavior` 声明按下按键时的行为——`close`，或对必须吞掉按键的必填 Dialog 使用 `block`。受控层、IME 组合输入，以及 Android 返回手势等浏览器发起的关闭，都遵循同一条最顶层规则。

这里没有 codemod，因为没有 prop 迁移。如果你自己监听 Escape，需要知道一点：关闭栈会用 `preventDefault()` 认领按键，但不干预传播，因此 `window` 上的 `keydown` 监听器现在会看到一个曾被焦点陷阱层拦截的 Escape，且此时 `defaultPrevented` 已经是 `true`。

### 其他移除项

UMD 包（`dist/astryx.umd.js`，以及 `unpkg` 和 `jsdelivr` 的包字段）已被移除。它绑定到 `window.React`，而 React 19 不再提供定义该全局变量的构建，因此没有可供迁移的可用配置；`astryx template --cdn` 会生成替代它的 import-map 页面。三个已废弃的页面模板也被移除：`table-page-chart`、`table-page-heatmap-status` 和 `table-page-shoe-store-heatmap`。

## 三个晋升

晋升意味着某个组件离开了实验性的 `lab` 包，进入可以依赖的正式包。它总会改变导入路径，因此是版本发布中最可能需要你留意的部分。

### Bottom Sheet → core（v0.4.4）

`BottomSheet` 和 `BottomSheetSwitcher` 现在来自 `@astryxdesign/core`（[#5080](https://github.com/meta/astryx/pull/5080)），`snapPoints` 让拖拽停靠点由宿主决定——可以是视口比例（`0.5`）、百分比（`'50%'`）或长度（`'320px'`）。当滑动超出内容范围时，抽屉会继续被拉动并展开，而不是猛然停住；停在某个档位上的抽屉会在窗口调整大小或设备旋转时重新解析几何；移动端键盘也不再推动页面，或把档位从抽屉下方挪走。

![同一个打开的 Bottom Sheet 渲染两次，左侧为浅色模式，右侧为深色模式。每张图展示窄视口下抽屉的顶部：圆角顶边，内容上方居中的小抓取手柄，一行说明文字，一条分隔线，以及一个可滚动的附近地点列表，其距离一直延伸出画面底部。](/blog/astryx-v0-5-0/bottomsheet.png)

### Stepper → core（本次发布）

`Stepper` 和 `Step` 现在来自 `@astryxdesign/core`（[#5201](https://github.com/meta/astryx/pull/5201)），支持水平和垂直布局、分离式与轨道上指示器、语义状态、密度以及非线性导航。前进一步时连接线会有动画——强调色填充从该段的前缘生长出来，因此向前移动看起来像进度沿轨道行进。后退、跨多步跳转、在流程中途挂载以及 `prefers-reduced-motion` 等情形都会一并得到处理。

![同一个五步 Stepper 渲染两次，左侧为浅色模式，右侧为深色模式。这是一个垂直的工作区设置流程，指示器直接位于连接轨道上：前两步已完成，显示填充的对勾指示器；第三步为当前步骤，显示填充圆环和加粗标签；最后两步尚未到达，显示为淡化的数字圆圈。轨道在已完成步骤处为实线，在未到达步骤处为淡色，每一步的标签下方都有一行描述。](/blog/astryx-v0-5-0/stepper.png)

### RichTextEditor → `@astryxdesign/richtext`（v0.4.1）

这个基于 Lexical 的编辑器从 `lab` 移出，成为独立包（[#4678](https://github.com/meta/astryx/pull/4678)），因此可以单独进行 canary 发布。**这次并不是稳定化**——`@astryxdesign/richtext` 仅在 `@canary` 下发布，和 `lab` 完全一样。对你来说变化在于导入路径：`RichTextEditor`、`RichTextView` 和 `RichTextEditorToolbar` 现在来自 `@astryxdesign/richtext`。

![同一个 RichTextEditor 渲染两次，左侧为浅色模式，右侧为深色模式。每一侧都是一个标有 "Notes" 的字段，顶部有格式化工具栏——撤销、重做、段落块类型菜单，然后是粗体、斜体、下划线、删除线、代码和链接——下方编辑区中有一句 "Release notes for v0.5.0 — now in its own package."，其中版本号为粗体。](/blog/astryx-v0-5-0/richtexteditor.png)

## 亮点

### 30 种语言环境，日期遵循你的 Provider

Core 最初只随附 `en` 和 `fr-FR`，现在带有 30 个语言环境目录。`DateInput`、`DateTimeInput`、`DateRangeInput` 和 `Calendar` 通过环境中的 `InternationalizationProvider` 语言环境进行格式化和解析，而不再使用浏览器语言环境；Calendar 的星期标题使用 CLDR 独立短名称。Selector、MultiSelector、Typeahead、FileInput、Tokenizer 和 Lightbox 的实时区域播报现在来自目录，并使用 ICU 复数规则，而不是在英文后追加一个 “s”。新增的 `useLocale` 和 `useCollator` 导出让你自己的代码也能获得相同的语言环境用于格式化和比较。

CJK 输入同样安全。`Selector`、`MultiSelector`、`Typeahead`、`DateInput`、`DateTimeInput`、`TimeInput` 和 `NumberInput` 会让 IME 先完成组合，再把 keydown 读作命令，因此用于确认组合的 Enter 不再连带提交字段——而取消组合的 Escape 也不会关闭任何层。

### 主题现在通过 `extends` 继承

以前用 `extends` 构建的主题只会输出自身的声明，因此继承链上的每个使用者得到的都是默认几何形状上刷了一层新配色。现在基主题会解析进子主题的输出，`defineTheme` 在 `extends` 无效时会抛出错误，而不是什么都不继承。

焦点环也成为了 token——`--focus-outline-width`、`--focus-outline-style`、`--focus-outline-color` 和 `--focus-outline-offset` 驱动 core 与 lab 中的所有焦点环，因此一次覆盖就能在全系统范围内重塑焦点样式。此外，`color.accent` 接受 `[light, dark]` 元组，为每种配色方案派生一套调色板。

### 键盘、指针与触摸

当你声明 `role="tablist"` 时，`TabList` 遵循 WAI-ARIA tabs 模式；比其标签更窄的条带会滚动，而不是溢出容器——每个标签仍然是标签，没有任何内容藏进菜单。`ButtonGroup` 是一个单一的 Tab 停靠点，成员之间用方向键移动。`Breadcrumbs` 用半粗字重而不只是颜色标记当前面包屑，这是 WCAG 1.4.1 的要求，旧的仅靠色调的处理方式未能满足。core 和 lab 中的禁用元素不再绘制悬停状态和交互光标。在粗指针设备上，Slider 轨道、`sm` 复选框、单选按钮和开关，以及共享的清除按钮都满足 WCAG 2.5.8 AA 的 24×24 最小值——仅点击区域，可见部分没有任何移动。

### 更多可用来构建的内容

- `FormLayout` 接受 `defaultOptionality`，因此表单只需标记例外项。
- `DateRangeInput` 接受 `minRangeSpan` 和 `maxRangeSpan`。
- `DateTimeInput` 接受 `timeOptionInterval`，用于预设时间下拉。
- `MultiSelector` 通过 `formatValue` 格式化整个触发器行。
- `Table` 插件可以抑制表体单元格的内容。
- `AspectRatio` 将 `ratio` 作为类级声明输出，因此可以按断点覆盖。
- PowerSearch 可浏览最多 1,000 个字段而不是 10 个，按每个字段的 `group` 分组，将 `menuWidth` 应用于字段菜单和搜索菜单，并在值 typeahead 中遵循 `maxOperatorMenuItems`。
- Markdown 解析器会拒绝 `javascript:`、`vbscript:` 和 `data:text/html` URL。增量解析会在代码围栏尚未闭合时保留已稳定的块：在流式传输的 500 段响应中，重建的块数从 126,756 降到 1,869。

### CLI

`astryx theme targets` 列出每个组件主题化目标——它的 `defineTheme` 键、所绘制的类、接受的 props 和状态——并通过 `--json` 供 lint 和审计脚本使用。`astryx theme template` 会写入一个带注释的空白主题，`astryx theme build` 可在同一进程中接受任意数量的主题文件。`astryx template --cdn` 会写入一个无需构建步骤、并固定到你已安装版本的页面。模板集新增五个仪表板页面模板。集成还可以贡献参考文档主题，由 `astryx docs` 提供并供 `astryx search` 索引。

## 致谢

衷心感谢在 0.4.0 以来的八个版本中做出贡献的每一个人：[@AKnassa](https://github.com/AKnassa)、[@andrskr](https://github.com/andrskr)、[@arham766](https://github.com/arham766)、[@Astro-Han](https://github.com/Astro-Han)、[@athz](https://github.com/athz)、[@bhamodi](https://github.com/bhamodi)、[@cixzhang](https://github.com/cixzhang)、[@ejhammond](https://github.com/ejhammond)、[@Eloitor](https://github.com/Eloitor)、[@ernestt](https://github.com/ernestt)、[@freddymeta](https://github.com/freddymeta)、[@Geervan](https://github.com/Geervan)、[@gonzoblasco](https://github.com/gonzoblasco)、[@Han5991](https://github.com/Han5991)、[@HelloOjasMutreja](https://github.com/HelloOjasMutreja)、[@imdreamrunner](https://github.com/imdreamrunner)、[@is-jain](https://github.com/is-jain)、[@jiunshinn](https://github.com/jiunshinn)、[@josephfarina](https://github.com/josephfarina)、[@kentonquatman](https://github.com/kentonquatman)、[@Kevinjohn](https://github.com/Kevinjohn)、[@lexs](https://github.com/lexs)、[@nynexman4464](https://github.com/nynexman4464)、[@potatowagon](https://github.com/potatowagon)、[@rubyycheung](https://github.com/rubyycheung)、[@Sunil56224972](https://github.com/Sunil56224972) 和 [@Unmesh100](https://github.com/Unmesh100)。

特别感谢 [@Sunil56224972](https://github.com/Sunil56224972) 提供 Markdown 安全报告并完成修复（[#4330](https://github.com/meta/astryx/pull/4330)）。

完整变更日志见 [v0.5.0 发布页面](https://github.com/meta/astryx/releases/tag/v0.5.0)。
