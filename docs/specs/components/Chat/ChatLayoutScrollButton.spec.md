---
schema_version: 3
template_version: 7
kind: component
id: component:ChatLayoutScrollButton
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers: [public-api, behavior, accessibility, theming, testing]
verified_by:
  [
    packages/core/src/Chat/ChatLayoutScrollButton.test.tsx,
    packages/core/src/Chat/__tests__/ChatLayoutScrollButton.a11y.chromium.spec.ts,
    packages/core/src/Chat/__tests__/ChatLayoutScrollButtonSurface.a11y.chromium.spec.ts,
    apps/storybook/stories/ChatLayout.stories.tsx,
    apps/storybook/rtl-audit/verified-not-applicable.json,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:public-component-api,
    architecture:component-style-authoring,
    architecture:component-theming-surface,
    architecture:theme-tokens,
    architecture:component-test-sufficiency,
    architecture:knowledge-contracts,
  ]
contributing: []
system_specs: [spec:AST-029]
---

# ChatLayoutScrollButton component contract

## Contract at a glance

| Area          | Contract                                                                                                                                                                                        |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公开契约      | 带必填 `isVisible` 与 `onClick`、可选 `label`，以及根 `div` 透传、样式与 ref 的 `ChatLayoutScrollButton`。                                                                                      |
| 行为          | 一个承载单个 ghost Button 的胶囊。隐藏状态不绘制任何内容并离开 Tab 顺序；非空 `label` 展开胶囊并成为可见文本；省略或为空则渲染为仅图标。                                                        |
| 最终用户影响  | 向上滚动的读者获得一个回到最新消息的控件，而当他们已在最新消息处时，该控件被隐藏且不在 Tab 顺序中；重新设定其目标样式的主题会重绘他们看到的胶囊。                                               |
| 构建者影响    | 无。                                                                                                                                                                                            |
| 兼容性/就绪度 | 记录已发布的行为；无公开变更。三个实现缺口（FR1a、FR3a、FR6a）列在 Current-state impact 之下；八个所有者问题仍处于开放状态。                                                                    |
| 审查检查      | 拒绝把目标放在居中行上、拒绝保持键盘焦点的隐藏胶囊、拒绝对非空标签不给出可访问名称的做法，或拒绝与相反状态绘制得完全相同的状态。FR1a、FR3a 与 FR6a 是已记录的缺口，而非已接受项。               |
| 治理规则      | `architecture:component-theming-surface/INV4`；`architecture:component-style-authoring/INV1, INV5`；`architecture:public-component-api/INV5, INV6, INV8`；WCAG 2.2 SC 2.4.7 与 SC 2.5.8（AA）。 |

此表是审查用的投影；下面的正文才是权威。

## Intent

ChatLayoutScrollButton 是聊天对话记录中浮动的“回到最新”可供性。它负责胶囊的外观及其可见/隐藏呈现；它不负责任何滚动状态。ChatLayout 默认将其与 `useChatStreamScroll` 和 `useChatNewMessages` 组合，调用方可以通过 `ChatLayout` 的 `scrollButton` 插槽替换或移除它。

## Compatibility and migration

- 保留已发布默认值：`yes`
- 兼容性类别：记录已发布的行为；无公开变更
- 受控/非受控行为：可见性是调用方必填的输入，且该组件不持有任何状态
- 迁移决策：无；DEC-1 记录目标所在的位置

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **空标签使控件失去名称（FR1a）。** `label=''` 渲染出仅图标、可访问名称却为空的控件；WCAG 2.2 SC 4.1.2 要求有名称（OQ7）。
- **焦点环被裁剪掉了（FR3a）。** 胶囊的 `overflow: hidden` 裁掉了 Button 向外偏移的焦点环，因此处于焦点中的控件看起来与静止时相同；WCAG 2.2 SC 2.4.7 要求有可见的指示器（OQ8）。
- **主题无法针对胶囊的状态（FR6a）。** 胶囊的可见与展开状态会改变其绘制，但目标并未暴露其中任一状态，因此主题只能整体重新设定胶囊的样式（OQ1）。

## Ownership boundary

**负责**

- 胶囊表面：其填充、elevation、圆角、解析后的高度，以及折叠/展开的宽度上限。
- 可见/隐藏的呈现，包括隐藏时从顺序焦点导航中移除。
- 调用方未提供 `label` 时的默认可访问名称。
- 在其父元素中的居中，以及胶囊与其下方内容之间的间距。

**不负责 / 非目标**

- 滚动位置、锁定状态与新消息检测——由 `useChatStreamScroll` 与 `useChatNewMessages` 负责。
- 在聊天停靠区中的位置，以及该可供性是否渲染——由 `component:ChatLayout` 通过其 `scrollButton` 插槽负责。
- 动作语义、焦点环、按压反馈、尺寸几何与变体表面——由本组件所组合的 `component:Button` 负责。

## Public concepts

| 概念           | 封闭取值或状态              | 含义                                                    | 按变体/方向/状态的可用性 | 默认值       | 所有者                              | 稳定性 | 无效值行为                          |
| -------------- | --------------------------- | ------------------------------------------------------- | ------------------------ | ------------ | ----------------------------------- | ------ | ----------------------------------- |
| `isVisible`    | `true`、`false`             | 该可供性是否被呈现且可操作                              | 始终                     | 必填         | `component:ChatLayoutScrollButton`  | 稳定   | 必填布尔值；无回退                  |
| `label` — 省略 | `undefined`                 | 仅图标；翻译后的默认值成为可访问名称                    | 始终                     | 这就是默认值 | `component:ChatLayoutScrollButton`  | 稳定   | —                                   |
| `label` — 非空 | 任意非空字符串              | 可见文本，同时也是可访问名称                            | 始终                     | —            | `component:ChatLayoutScrollButton`  | 稳定   | —                                   |
| `label` — 空   | `''`                        | 仅图标，可访问名称为空——见 FR1a                         | 始终                     | —            | `component:ChatLayoutScrollButton`  | 稳定   | 不应用回退；控件没有名称            |
| `onClick`      | `() => void`                | 激活回调；其类型声明不接受参数                          | 始终                     | 必填         | `component:ChatLayoutScrollButton`  | 稳定   | 必填；无默认动作                    |
| 根 `div`       | `BaseProps<HTMLDivElement>` | `ref`、`xstyle`、`className`、`style` 以及其余 DOM 透传 | 始终                     | 无           | `architecture:public-component-api` | 稳定   | `onClick` 从继承的 DOM props 中省略 |

使用方语法与 prop 默认值仍保留在 `ChatLayoutScrollButton.doc.mjs` 中。

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                      | 依据                                                                 |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| FR1  | 控件必须在每个可达状态下暴露非空的可访问名称。                                                                                              | WCAG 2.2 SC 4.1.2                                                    |
| FR1a | `label` 省略时使用翻译后的默认值；非空 `label` 即为名称。实现缺口：`label=''` 两者都不满足（见 Current-state impact）。                     | 当前源码                                                             |
| FR2  | 当 `isVisible` 为 false 时，胶囊不得绘制任何内容，且不得接受焦点，无论程序化还是顺序焦点。                                                  | 当前源码与测试；WCAG 2.2 SC 2.4.7                                    |
| FR3  | 当 `isVisible` 为 true 时，胶囊必须保持键盘可达，并在按下 Enter 时激活。                                                                    | 当前源码与测试；WCAG 2.2 SC 2.1.1                                    |
| FR3a | 处于焦点中的控件必须绘制可见的焦点指示器。实现缺口：焦点环被完全裁剪掉（见 Current-state impact）。                                         | WCAG 2.2 SC 2.4.7；`spec:AST-020/FR1`                                |
| FR4  | **非空** `label` 必须渲染为可见文本；省略或为空则渲染为仅图标，不带可见文本。                                                               | 当前源码与测试                                                       |
| FR5  | 胶囊必须从元素尺寸 token 取得其解析高度，这样任何主题的比例都不会使它裁掉所包裹的 Button。                                                  | 当前源码与测试                                                       |
| FR6  | 公共主题目标必须位于胶囊上——即绘制填充、elevation 与圆角的元素——而不是居中它的那一行。                                                      | `architecture:component-theming-surface/INV4`                        |
| FR6a | 目标既不反映驱动其绘制的可见状态，也不反映展开状态。实现缺口：主题无法针对任一状态；目标是否应反映它们属于 OQ1（见 Current-state impact）。 | 当前源码                                                             |
| FR7  | 状态之间的过渡在 `prefers-reduced-motion: reduce` 下必须收缩为 `0s`。                                                                       | 当前源码                                                             |
| FR8  | 折叠状态的控件必须至少为 24 × 24 CSS 像素。                                                                                                 | WCAG 2.2 SC 2.5.8（AA）                                              |
| FR9  | 使用方的 `ref`、样式与其余 DOM props 必须到达组件的外层元素。                                                                               | 当前源码与测试；`architecture:public-component-api/INV5, INV6, INV8` |

**FR1a — 空标签的命名缺口。** `label=''` 被公共类型允许，而普通调用方代码在字符串为空或尚未加载时正是这样产生的。它以 `label=''`、`aria-label=''` 和 `isIconOnly={true}` 到达 Button，因为 `??` 让空字符串通过了。Button 只在 `label !== ''` 时才设置自己的 `aria-label`，因此调用方的空 `aria-label` 得以保留；仅图标不渲染任何可见文本；而箭头 Icon 不携带 `label`，因此它是 `aria-hidden="true"`。结果是一个可聚焦、可操作却没有可访问名称的控件。

本记录陈述该义务，并把当前行为记为违反它。要闭合这一缺口，需要在回退到默认名称、拒绝该值，或把空标签视为调用方错误之间作出选择——这是属于所有者的公共 API 与兼容性决策。见 OQ7。

**FR3a — 被裁剪的焦点环。** 所组合的 Button 以 `outline` 加正的 `outline-offset` 在其边框盒之外绘制焦点环。按钮填满胶囊，而胶囊用 `overflow: hidden` 裁剪，以让折叠/展开动画停留在其圆角形状之内，因此焦点环一点也没有被绘制出来。

键盘访问本身完好——控件能获得焦点并激活——因此这是可见性缺陷，而非可达性缺陷。补救办法是生产层面的改动：改变胶囊的裁剪方式，或改变焦点环的绘制位置；而在这些改动之间做选择会改变渲染几何，因此需要视觉审查。记为 OQ8。

**FR6a — 未被反映的状态轴。** `isVisible` 选择可见/隐藏样式，`label` 选择折叠/展开样式，两者都作用于绘制目标，而 `themeProps('chat-layout-scroll-button')` 调用时不带任何状态参数。因此主题可以重新设定胶囊的样式，却无法针对任一状态。为这些轴命名属于新增的公共主题表面，因此其形态由所有者决定。见 OQ1。

### Allowed variation

- **AV1 — 展开宽度。** 带标签胶囊的宽度上限是组件设计决策，而不是主题值。超过该上限的标签会怎样，此处并未确定；见 OQ3。
- **AV2 — 解析后的几何。** 高度、圆角、间距与时长由主题 token 解析而来，因此绝对值随主题而异，且不构成回归。
- **AV3 — 组合。** ChatLayout 默认渲染此组件，但调用方可以替换为任意节点，或完全移除该可供性。

### Representative states

| 状态                   | 必须满足的不变式                                                                    | 允许的变化           |
| ---------------------- | ----------------------------------------------------------------------------------- | -------------------- |
| 隐藏                   | 不绘制任何内容、拒绝焦点、保留其布局盒（FR2）                                       | 过渡时长             |
| 可见，省略 label       | 名称来自默认值、可聚焦、至少 24 × 24 CSS 像素、无可见文本（FR1、FR3、FR4、FR8）     | 解析后的胶囊尺寸     |
| 可见，非空 label       | 标签既是可见文本，也是可访问名称（FR1、FR4）                                        | 展开宽度，至多到上限 |
| 可见，空 label         | **未满足 FR1**——仅图标且可访问名称为空（FR1a）                                      | 无；这是已记录的缺陷 |
| 可见，悬停             | 指针绘制出与静止状态不同的状态                                                      | 主题解析出的叠加层   |
| 可见，键盘聚焦         | **未满足 FR3a**——焦点被持有且 `:focus-visible` 匹配，但焦点环被裁掉、不绘制任何内容 | 无；这是已记录的缺陷 |
| 可见，按下             | 按下绘制出与悬停和静止都不同的状态                                                  | 按下的处理           |
| 任一可见状态，已设主题 | 文档化目标重绘胶囊（FR6）；其状态轴不可达（FR6a）                                   | 主题声明哪些属性     |

### Performance and resources

- **PR1 — 无状态、无副作用、无观察者。** 组件在渲染期间从其 props 推导每一处渲染差异，并且不注册任何监听器、定时器、观察者或动画帧。

## Accessibility contract

- **AR1 — 有名称。** 控件必须在每个可达状态下暴露非空的可访问名称（WCAG 2.2 SC 4.1.2）（FR1）。省略与非空 `label` 满足此要求；`label=''` 不满足，而该缺口记为 FR1a，而不是在此解决。
- **AR2 — 焦点跟随绘制。** 不绘制任何内容的控件不得可聚焦，因为焦点落在其上将没有可见的指示器（WCAG 2.2 SC 2.4.7）。`opacity` 与 `pointer-events` 无法实现这一点；`visibility` 可以（FR2）。
- **AR3a — 焦点可见。** 处于焦点中的控件必须绘制焦点指示器（WCAG 2.2 SC 2.4.7）。焦点环已声明却被裁剪掉；记为 FR3a，而不是在此解决。
- **AR3 — 目标尺寸。** 折叠状态的控件必须至少为 24 × 24 CSS 像素（WCAG 2.2 SC 2.5.8 AA）（FR8）。
- **AR4 — 减弱动效。** 在 `prefers-reduced-motion: reduce` 下，状态过渡必须收缩为 `0s`（FR7）。
- **AR5 — 翻译后的字符串。** 默认可访问名称必须通过翻译器目录解析，绝不能是字面量。

## Design relationships

| 结构或状态 | 设计要求                   | 表征权威 | 层级角色 | 组件契约 |
| ---------- | -------------------------- | -------- | -------- | -------- |
| 胶囊表面   | 悬浮于对话记录之上的可供性 | 未定     | 支撑性   | FR5, FR6 |
| 隐藏状态   | 缺席而非变暗               | 未定     | 支撑性   | FR2, AR2 |
| 带标签状态 | 文本与字形位于同一胶囊上   | 未定     | 支撑性   | FR4      |

本组件实现设计要求，但不复制其理由。`unsettled` 的表征仍然是人类决策；原则不允许 agent 臆造答案。今天没有任何 `authority: current` 的设计记录覆盖浮动的滚动可供性，因此这些行记录的是缺口，而非要求。

## Family and system relationships

- `family:buttons` 拥有本组件通过 `component:Button` 组合的动作表面。本组件不是其成员：它的公共目的是一个包含按钮的对话记录可供性，而该家族的成员规则排除仅把 Button 用作动作插槽的组件。见 OQ4。
- `architecture:component-theming-surface` 拥有本组件主题化必须满足的目标/结构关系；FR6 直接采用 INV4。
- `spec:AST-029` 拥有本记录的验证映射所遵循的审计证据清单。

## Verification map

| 契约       | 验证                                                                                                                                                                                               | 代表性状态                     | 变异或失败预期                                                                 | 审计小节                                  |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------ | ----------------------------------------- |
| FR1、FR4   | `ChatLayoutScrollButton.test.tsx` 的角色/名称与可见文本用例                                                                                                                                        | label 省略；非空 label         | 去掉 `isIconOnly` 会把翻译后的名称渲染为被裁剪的可见文本，而名称用例仍然通过   | `audit:ChatLayoutScrollButton/a11y`       |
| FR1a       | 无针对性测试；从三个文件的源码读出（`??` 让 `''` 通过、Button 的 `label !== ''` 守卫、Icon 的装饰性默认值）。                                                                                      | label 为空                     | 在此处添加回退会使推导失效，而没有任何测试失败                                 | `audit:ChatLayoutScrollButton/a11y`       |
| FR2、FR3   | `ChatLayoutScrollButton.test.tsx` 的 Tab 用例；`ChatLayoutScrollButton.a11y.chromium.spec.ts`                                                                                                      | 静止时隐藏；向上滚动；重新隐藏 | 仅用 `opacity` 替换 `visibility` 会让不可见控件仍留在 Tab 顺序中               | `audit:ChatLayoutScrollButton/a11y`       |
| FR3a       | `ChatLayoutScrollButtonSurface.a11y.chromium.spec.ts` 交互检查：将聚焦帧的字节与同页捕获的静止帧比较，并按裁剪祖先的余量测量焦点环向外延伸的距离（记为 `ringChangedPixels`、`outreach`、`roomPx`） | 折叠与带标签，浅色与深色       | 结果是记录并附注的，而非断言的，因此修复裁剪不会让该检查变红                   | `audit:ChatLayoutScrollButton/a11y`       |
| FR5        | `ChatLayoutScrollButton.a11y.chromium.spec.ts` 双主题几何对照                                                                                                                                      | neutral 与 butter              | 字面量高度会让更大的元素比例把胶囊所包裹的 Button 裁掉                         | `audit:ChatLayoutScrollButton/theming`    |
| FR6        | `ChatLayoutScrollButtonSurface.a11y.chromium.spec.ts` 的放置与探针主题可达性测试                                                                                                                   | 可见、折叠、neutral 与 probe   | 把目标移回居中行会使胶囊在探针主题下保持不变                                   | `audit:ChatLayoutScrollButton/theming`    |
| FR6a       | 源码：调用 `themeProps()` 时不带状态参数，且 `Chat.doc.mjs` 声明目标时没有 `visualProps`/`states`                                                                                                  | 可见/隐藏；折叠/展开           | 添加任一轴都是新增的公共主题表面，因此在所有者决定前，任何测试都不得断言其形态 | `audit:ChatLayoutScrollButton/theming`    |
| 悬停、按下 | `ChatLayoutScrollButtonSurface.a11y.chromium.spec.ts` 交互检查——每一帧都断言伪类已匹配，且捕获的字节与该页静止帧不同                                                                               | 折叠与带标签，浅色与深色       | 在释放之后捕获的帧，或指针在别处的帧，都会使其自身的参与断言失败               | `audit:ChatLayoutScrollButton/design`     |
| FR8        | `ChatLayoutScrollButtonSurface.a11y.chromium.spec.ts` 测量得到的目标盒                                                                                                                             | 可见、折叠                     | 更小的解析尺寸会把控件降到 AA 最低要求之下                                     | `audit:ChatLayoutScrollButton/a11y`       |
| FR9        | `ChatLayoutScrollButton.test.tsx` 透传用例                                                                                                                                                         | 任意                           | 丢掉 `...rest` 会静默丢弃调用方设置的 `data-*`、`id` 与 ARIA                   | `audit:ChatLayoutScrollButton/public-api` |

从源码读出，尚无针对性测试：

- FR1a：`label=''` 产生空的可访问名称。
- FR6a：目标不反映任何状态。
- FR7：减弱动效下过渡收缩为 `0s`。

## Decision log

### DEC-1 — The public theming target rides the pill, not the row that centres it

**Reference:** `component:ChatLayoutScrollButton/DEC-1`

**Decider:** `cixzhang`, `2026-09-23`

组件渲染两个元素：一个全宽的行，用于居中胶囊并承载其下方的间距；以及胶囊本身，它绘制填充、elevation 与圆角。公共目标位于胶囊——即主题重新设定样式的元素——正如 `architecture:component-theming-surface/INV4` 所要求。使用方的 `ref`、样式与 DOM props 留在外层行上（FR9）。

已否决：为胶囊再设一个目标——为一个被绘制的部件新增主题表面。

已否决：把使用方透传移到胶囊——这会改变调用方 `id` 与 ref 的解析位置。

## Open questions

- **OQ1 — 目标是否应反映其驱动样式的状态？**（`human-api`）胶囊在可见/隐藏与折叠/展开样式对象之间选择，而 `themeProps` 两者都不反映，因此主题无法针对任一状态。暴露它们意味着向公共目标添加 `visualProps`/`states`，这是新增的主题表面，而非一次修补。
- **OQ2 — `isVisible` 是非层级组件上的正确名称吗？**（`human-api`）共享约定把 `isOpen`/`isVisible` 保留给层级组件。该 prop 已在 `@astryxdesign/core@0.6.3` 中发布，因此任何改动都是破坏性的，并需要一项兼容性决策。
- **OQ3 — 超过展开上限的标签应当如何处理？**（`human-design`）胶囊在其宽度上限处裁剪，既无省略号也不换行。可访问名称仍然保留，因此只有有视力的读者会丢失文本，而本地化扩展是现实中的触发因素。没有 `authority: current` 的设计记录覆盖此表面的截断。
- **OQ4 — 本组件属于 `family:buttons` 吗？**（`human-api`）其公共目的是对话记录可供性，且它不在该家族的成员列表中，但它只是一个组合的 Button，没有其他内容。家族契约中针对“仅把 Button 用作触发器或动作插槽的组件”的排除条款，即上文所采用的解读。
- **OQ5 — 对胶囊的 `max-width` 做动画可以接受吗？**（`human-design`）展开与折叠会对一个布局属性做动画。减弱动效已被遵循，且子树只有一个按钮，但本应管辖被动画属性的记录 `design:motion` 处于 `authority: draft`。
- **OQ6 — 使用方文档没有结构清单。**（`human-api`）`architecture:component-theming-surface` 将其记录为横跨 Core 的开放迁移工作，因此此处不写 `### Theming anatomy` 块：没有已发布的结构名称可供映射。

- **OQ8 — 焦点环应如何脱离胶囊的裁剪？**（`human-design`）胶囊需要 `overflow: hidden` 来实现其折叠/展开动画，而 Button 的焦点环绘制在其边框盒之外，因此两者直接冲突。候选方案——内缩按钮使焦点环放得下、在胶囊上绘制焦点环，或在另一个元素上裁剪——都会改变渲染几何，属于视觉审查。
- **OQ7 — `label=''` 应当做什么？**（`human-api`）它会产生一个无名称的控件（FR1a）。候选方案——回退到翻译后的默认值、在类型中拒绝该值，或将其视为调用方错误——是针对一个已发布 prop 的公共 API 与兼容性决策，因此本记录陈述缺口而不作选择。

## Content boundary

本文件不复制使用方的 prop 表格/示例、当前审计结果、实现步骤或家族/系统规则。它链接到它们的所有者。
