---
title: 'Astryx v0.6.0：会响应的主题，会自适应的组件'
description: '响应式主题规则、能选择合适呈现层的 Selector、Neutral 的视觉焕新、六个新模板，以及一条由规范支撑的 v1 之路。'
date: '2026-09-10'
type: 'update'
authors:
  - 'team'
tags:
  - '发布'
  - '主题'
  - '组件'
  - '无障碍'
---

Astryx v0.6.0 为产品构建者带来响应式主题规则、自适应选择，以及更具设计意图的 Neutral 调色板。

记下你当前使用的版本，把项目中的每个稳定 Astryx 包更新到 `0.6.0`，然后运行新版 CLI 的升级命令：

```bash
OLD_VERSION=0.5.4 # replace with the Core version your project uses today
npm i @astryxdesign/core@0.6.0 @astryxdesign/cli@0.6.0 @astryxdesign/theme-neutral@0.6.0
npx @astryxdesign/cli upgrade --from "$OLD_VERSION" --apply
```

示例中包含了 Neutral；如果项目还使用了其他稳定的 Astryx 主题，请在同一次安装中一并更新。

## 主题在 CSS 中响应

主题现在可以根据具名视口宽度、指针精度、对比度偏好和减少动态效果偏好，调整 token、组件样式、排版、颜色、圆角和动效。

```ts
defineTheme({
  name: 'acme',
  adaptations: {
    widthBreakpoints: {sm: 640, md: 768, lg: 1024},
    rules: [
      {
        when: {width: {below: 'md'}, pointer: 'coarse'},
        value: {
          tokens: {'--size-element-md': '44px'},
          components: {
            button: {base: {fontWeight: 'var(--font-weight-bold)'}},
          },
        },
      },
      {
        when: {motion: 'reduce'},
        value: {tokens: {'--duration-medium': '0ms'}},
      },
    ],
  },
});
```

一个主题可以同时响应多个条件——例如小屏幕加触摸指针。当规则重叠时，后面的规则优先。由于结果是 CSS，浏览器会立即适配，无需等待 JavaScript 布局循环。

![同一个评审卡片从同一个 Astryx 主题按两种宽度渲染。宽屏处理使用蓝色强调色、紧凑控件和更紧的圆角。紧凑版本使用主题的窄宽度规则：洋红色强调色、更大的控件、更粗的按钮和更圆的圆角。](/blog/astryx-v0-6-0/responsive-theme.png)

`AppShell` 的具名移动端导航断点使用同一套主题自有的宽度映射，包括新增的 `xl` 和 `2xl` 值。主题家族也可以定义局部 token，而无需把每个主题特有的概念都变成永久的 Core token。

## Selector 自适应其呈现方式

响应式设计不只是间距。在紧凑界面上，同一个选择用带触摸尺寸行的模态底部抽屉可能体验更好；在更宽的界面上，则可以保持为锚定的 popover。`Selector` 和 `MultiSelector` 在 v0.6.0 中提供了这种 `presentation="adaptive"` 行为，同时保留相同的选项和已选值。

它们还新增了可播报的空状态和 `isReadOnly`，因此已选值可以保持可聚焦、可随表单提交，同时不暴露编辑控件。

![一个紧凑的项目表单中，打开 Owning team Selector 时其自适应底部抽屉动画进入视野，然后被关闭。Reviewers MultiSelector 在同一产品环境中保持可见。](/blog/astryx-v0-6-0/adaptive-inputs.webp)

## 六个新起点

Astryx 0.6 新增五个向导模板和一个工作项详情页。每个都解决一种不同的产品形态：

- [结账向导](/templates/checkout-wizard) — 带实时订单摘要的分步结账流程。
- [表单向导](/templates/form-wizard) — 全页面流程，每一步都占用完整内容宽度。
- [对话框向导](/templates/form-wizard-dialog) — 简短的引导流程，同时让底层页面保持可见上下文。
- [内联向导](/templates/form-wizard-inline) — 手风琴式流程，已完成的步骤会围绕当前步骤收起。
- [垂直向导](/templates/form-wizard-vertical) — 长表单流程，带有常驻进度和情境引导。
- [工作项详情](/templates/work-item-detail) — 跟踪事项视图，包含子任务、属性、附件和活动记录。

每个模板都可以从链接页面预览或在 Playground 中打开，也可以用 `astryx template <name>` 添加。

## Neutral 的视觉焕新

Neutral 已围绕一套可复现、主题自有的 OKLCH 调色板重建。语义色、语法高亮色和分类色现在引用具名调色板色阶，因此调色板源文件、生成的颜色、运行时主题和 CLI 模板可以一起接受审查。

可见变化都是有意为之：浅色模式的前景使用更深的色阶；深色模式的有彩色阶拥有更平静的低色调；危险操作按钮使用调色板支撑的红色交互色；深色状态表面更加实在；信息横幅使用更柔和的蓝色调。语义状态填充现在通过 Neutral 自有的局部 token，在徽章、状态点、Stepper 指示器和进度条之间共享。

![同样的发布就绪度（release-readiness）模式在当前配色模式下按 Neutral 更新前后渲染。它比较了信息、成功、警告和错误这几种处理在横幅、徽章、状态点、进度条、复选框，以及主要、次要和危险操作上的表现。](/blog/astryx-v0-6-0/neutral-makeover.png)

对于主题作者，0.6 还新增了创作时的 OKLCH 调色板生成器，带终端和 HTML 预览、类型化输出、自定义色阶、确定性生成记录以及覆盖保护。

## 一条由规范支撑的 v1 之路

在可见的版本背后，随着 Astryx 迈向 v1 强化阶段，我们正在为组件和共享系统编写可长期存续的规范。这些记录定义了一个组件拥有什么：它的公开 API、行为、无障碍要求、解剖结构、主题目标、状态表示，以及允许的变化。

当一份已批准的记录被标记为 current 时，它为该记录所拥有的行为提供了贡献者和维护者的唯一事实来源；草案或仍未定稿的决定则继续需要人工审查。current 记录还为 agent 提供了可具体验证的依据：它们可以把实现与已接受的契约进行比较，发现测试或文档中的漂移，并区分 bug 修复与新的系统级决策。

实际目标是保持一致性与速度：减少组件之间的矛盾处理、更清晰的评审反馈，以及更快回应社区贡献，因为常规的正确性可以对照已经定下的决策来检查。新的设计和 API 方向仍然由人类掌握；一旦方向被记录，agent 会帮助实现保持一致。

## 迁移到 0.6.0

使用上面展示的先安装、后升级的顺序。先安装 `0.6.0` 很重要：CLI 会从已安装的 Core 版本推导升级目标，因此如果 Core 仍是 `0.5.x`，运行升级会报告项目已是最新并跳过 v0.6 迁移。

codemod 处理常见的焦点 Hook、IME 导入、Resizable 和 Astryx 选择器迁移。主要的 CSS 变化是：视觉 props 和状态现在使用反射式 `data-*` 属性，而不是裸类名：

```css
.astryx-button.primary
/* becomes */
.astryx-button:is(.primary, [data-variant='primary'])
```

运行后，请检查以下情况：

- 未限定或自定义的选择器，以及存储在 JavaScript 或 TypeScript 中的选择器；
- 动态的焦点 Hook 和 Resizable 配置对象、对象展开以及计算属性；
- `isImeKeyEvent` 的非标准导入，它现在来自 `@astryxdesign/core/utils`；
- 自定义 Stepper 集成：`minimumStepWidth` 是以像素为单位的数字，`registerStep` 接受 `{getIsDisabled}`，紧凑布局的内部实现不再公开；
- 读取生成选择器的自定义主题工具；以及
- 预构建的自定义主题，必须使用 Core 0.6.0 重新构建并部署。

在 `AppShell` 的移动端断点上，正好处于边界时现在渲染更宽的布局；移动模式仅适用于边界以下。主题作者还应预期，无效的适配值和可达的 token 循环会在输出 CSS 之前失败。

## 本次发布的其他内容

- CheckboxListItem 和 RadioListItem 上的富标签与描述现在会生成正确的无障碍名称和描述。
- TextInput 和 TextArea 会转发 `autoComplete`。
- Popover 的焦点和同手势重开保护现在适用于每一条打开路径。
- 悬停高亮的选项列表在指针静止时不再反复自动滚动。
- Carousel 的边缘渐隐在 RTL 下会镜像。
- CLI 集成可以添加受管理的 agent 指导，`doctor integration` 会检查它们的结构和冲突。
- 调试记录现在会在 `schemaVersion: 3` 下，为整个命令树填充 `resultCount`、`emptyResult`、`resultKind` 和 `directMatch`。
- `withAstryx()` 会拒绝 Turbopack 配置，而不是完成一次没有样式的构建。

## 致谢

感谢以下为本篇文章所涉改动做出贡献的贡献者：[@AKnassa](https://github.com/AKnassa)、[@Astro-Han](https://github.com/Astro-Han)、[@bhamodi](https://github.com/bhamodi)、[@cixzhang](https://github.com/cixzhang)、[@ernestt](https://github.com/ernestt)、[@faga295](https://github.com/faga295)、[@freddymeta](https://github.com/freddymeta)、[@Geervan](https://github.com/Geervan)、[@gonzoblasco](https://github.com/gonzoblasco)、[@harjothkhara](https://github.com/harjothkhara)、[@Hashim1999164](https://github.com/Hashim1999164)、[@HelloOjasMutreja](https://github.com/HelloOjasMutreja)、[@imdreamrunner](https://github.com/imdreamrunner)、[@jiunshinn](https://github.com/jiunshinn)、[@joaodotwork](https://github.com/joaodotwork)、[@josephfarina](https://github.com/josephfarina)、[@kentonquatman](https://github.com/kentonquatman)、[@Kyujenius](https://github.com/Kyujenius)、[@Lee-Dongwook](https://github.com/Lee-Dongwook)、[@lexs](https://github.com/lexs)、[@ManoharPaturi](https://github.com/ManoharPaturi)、[@mattandryc](https://github.com/mattandryc)、[@ngolin](https://github.com/ngolin)、[@nynexman4464](https://github.com/nynexman4464)、[@PRIEYAN](https://github.com/PRIEYAN)、[@rubyycheung](https://github.com/rubyycheung)、[@trakshan-mishra](https://github.com/trakshan-mishra) 和 [@yyq1025](https://github.com/yyq1025)。

在 [Astryx v0.6.0 发布页面](https://github.com/meta/astryx/releases/tag/v0.6.0)阅读完整的逐包说明。
