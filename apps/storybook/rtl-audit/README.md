# RTL 语义审计

一个由 Playwright 驱动的审计，按照 astryx RTL 契约给组件 story 评分。它在**同一次运行中将每个目标 story 渲染两次**——一次 LTR，一次 RTL（通过 Storybook 的 `globals=direction:rtl` 开关）——并断言两次渲染之间的_关系_。**没有黄金/基线截图**：不会向 git 提交任何内容，也不会因操作系统/字体差异而产生漂移。它复用 `pr-a11y` 任务已经安装的 `@playwright/test` chromium，并沿用该任务的 build-storybook → serve → drive 形态。在 CI 中它就是 `pr-rtl` 任务——`pr-a11y` 的 RTL 兄弟任务。

## 三层

### A. 自动发现——覆盖组件包注册表中的每个 story 前缀

审计的重点是自动捕获**新增或变更**的组件，因此自动发现层以**零精选选择器**运行。共有三个独立的自动检查遍：**D1（图标镜像）**、**D5（位置镜像）**和 **D6（方向性装饰）**。

> **CI 中的作用范围。** `pr-rtl` 在合并到 `main` 之后以及发布检查中以完整范围运行，在 PR 上则仅在带有 `ci:run-rtl` 标签时运行（spec:AST-030 FR12）。在带标签的 PR 上，它传入 `--filter`，值为该 PR 触及的组件（来自 `analysis.json`），与 `pr-a11y` 一致。资格由从可信基准 ref 加载的组件策略和包注册表分类；策略缺失、路径集为空或不匹配、组件列表无法解析，或注册表/分类器/工作流被改动时，会运行完整审计而不是接受空范围。CI 将该完整范围划分为每个规范包一个有界分片，每个分片有八个浏览器 worker。最大的 Core 分为三部分运行（`--shard i/3`，每第三个 D1 目标、story 和精选目标），由 `pr-rtl-merge` 通过 `--merge-shards` 合并为完整 Core 分支本应写出的报告；缺少或不匹配的部分会使合并失败。稳定的 `pr-rtl` 上下文只有在全部五个范围清单到达、且每个适用包都产出一份报告时才成功，报告中被请求的包/过滤条件、无重复的精确 D1/D5/D6 身份以及非零的计划/已完成扫描都匹配。当可信策略要求完整范围时，每个清单都必须能以空过滤条件运行，且全部五个包报告都必须到达。抛出异常的 D1 或 D5/D6 扫描（ERROR：导航或页面超时、崩溃；无判定）会在新页面上再运行一次；已判定的结果绝不重试。报告、其任务摘要以及一行 `rtl-audit-retries: <n> [story ids]` 日志会列出每个重试过的 story 及其首次 ERROR。计划中的扫描在重试后仍以 ERROR 结束即为不完整。分析/索引/清单输入缺失或格式错误、非规范所有者、过期输出、缺失或意外的报告，以及全部跳过的必需矩阵，都会按失败关闭处理。仅改动 RTL harness 且带有 `ci:run-rtl` 标签的 PR 会运行固定的 `Chart,ChartLegend` 路由冒烟范围，这样包发现和精选别名就无法跳过自身的检查；没有该标签时，`main` 的 `release-check` 会在合并后覆盖该 harness（spec:AST-030 FR12）。完整的未过滤扫描在该 release-check 中运行。省略 `--filter` 即可在本地运行。阻塞性无障碍审计使用相同的按包限定的 owner-to-story 路由，如果任何选定的 owner 解析为零个 story 则失败。

### A.1 D1 图标镜像

方向性图标镜像。对于每个被审计的 story，它会：

1. 加载该 story 的 LTR 和 RTL。
2. 以通用方式查找**方向性**图标——通过以下方式将每个图标 SVG 分类为左/右：(a) lucide 类名（`lucide-chevron-left`、`lucide-arrow-right`、`lucide-chevrons-left`、`lucide-caret-right`、`lucide-move-left`，……），(b) 已知 fallback 注册表的路径特征（chevron-left `m15 18-6-6 6-6`，chevron-right `m9 18 6-6-6-6`），以及 (c) 外层按钮的 aria-label 上下文。**垂直字形（上/下 chevron、垂直 caret）被排除**，模糊字形按非方向性处理（宁可_不_标记——在软门禁窗口期间减少误报）。
3. 按 aria 上下文（回退：索引）将每个方向性图标配对为 LTR↔RTL 并评分：
   - **pass** —— 每个方向性图标都得到处理：要么包装元素的计算 `transform` 在 RTL 下变为水平翻转矩阵（`matrix(-1,0,0,1,…)`），在 LTR 下保持单位矩阵（共享的 `rtlStyles.mirror` `scaleX(-1)`），**要么**渲染后的字形方向左右互换（名称互换，例如 Pagination 的 `chevronLeft`↔`chevronRight`）。
   - **not-RTL（失败）** —— 存在方向性字形，但既未翻转也未互换（发布时未处理 RTL），或双重翻转（在_两个_方向都翻转，净效果是不镜像）。
   - **N-A** —— 该 story 没有方向性图标（不扣分）。

这是一张广泛的安全网：一个组件如果引入了方向性 chevron 却不支持 RTL，就会自动以 not-RTL 发现的形式出现。

D1 按稳定的 story 源文件和导出顺序为每个组件选择一个代表，而不是依赖生成的 `index.json` 对象顺序。故意保留调用方提供的方向性字形几何的参考夹具可以仅退出 D1，并附带同处存放的理由：

```ts
import {rtlAuditParameters} from '../rtl-audit/story-parameters';

export const ReferenceFixture: StoryObj = {
  parameters: rtlAuditParameters({
    D1: {
      applicable: false,
      reason: 'The samples are caller-supplied data, not directional controls.',
    },
  }),
};
```

审计在为 D1 选择代表之前，会验证每个范围内 story 的已渲染、已解析的 Storybook 参数。因此，story 级参数通过正常的 Storybook 优先级覆盖 meta 级默认值。`applicable: false` 没有非空理由即为错误，D5 和 D6 会继续扫描同一个 story。JSON 报告和 Markdown 评分卡会列出每个已声明的 D1 排除项及其组件、story ID、维度和理由——即使已选择了更早的适用 story——以便人工审查者确认该夹具是数据，而不是方向性控件或提示。

#### 交互显示的图标（popovers、dialogs、menus）

许多方向性图标位于默认关闭的内容中——例如 `DateInput`/`DateRangeInput`/`DateTimeInput` popover 内的 `Calendar` 导航 chevron。在关闭状态的 story 中，这些 chevron 已挂载但尺寸为 0×0，因此无法评估其镜像变换。为避免误报 not-RTL，自动发现会先运行一个**防御性显示步骤**：扫描前，点击第一个折叠的展开触发器（`aria-haspopup` / `aria-expanded="false"` / `role=combobox`），并短暂等待 popover/dialog/menu/`[popover]` 内容出现，然后扫描打开的 DOM。每个操作都有时间限制且错误被吞掉，因此绝大多数没有展开界面的 story 不受影响，也绝不会挂起。作为第二道防护，任何在显示后仍渲染为 0×0 的图标（确实不可达）**不会**被计为方向性发现——它计入 N-A，绝不会造成误报的 not-RTL。净效果：Date\*Inputs 正确获得 **pass**，因为一旦 popover 打开，其内嵌的 Calendar chevron 就会镜像。

### A.2 D5 位置镜像

第二个自动检查遍，覆盖**每个**被审计包的 story，捕获 D1 和 `@astryx/no-physical-properties` **lint 都会漏掉**的一类 bug：使用**逻辑锚点**（`insetInlineStart` / `insetInlineEnd`，在 RTL 下_确实会_翻转）定位的元素，搭配**未翻转的物理 transform**（`translate`/`translateX`，_不会_翻转）。物理 translate 会使盒子相对于其镜像后的锚点过度或不足偏移，导致元素在 RTL 下落在**错误的一侧**。

通过这种方式发现的真实实例（均为逻辑锚点 + 物理 translate）：Avatar **status-dot**、Table **sticky-column shadow**、**ResizeHandle** 命中区域，以及 Carousel **pill**。

对于每个 core story，它会：

1. 加载该 story 的 LTR 和 RTL（复用与 D1 相同的 `settle()` + **显示步骤**，因此交互受限的定位元素——dialogs/popovers/menus——也会被扫描，而不只是静态元素）。
2. 自动发现候选元素：计算样式为 `position: absolute|fixed` **且**计算 `transform` 具有非零水平 translate 分量的每个元素（从 `matrix()` 的 _e_ 值 / `matrix3d` 第 12 项解析）。没有逐组件选择器。
3. 记录每个候选元素**相对于其 `offsetParent` 的中心 X 坐标**，然后按 DOM 索引配对 LTR↔RTL 候选（在每个测试过的 story 中跨方向都稳定），并断言 RTL 中心相对于父级水平中心**镜像** LTR 中心：

   ```
   rtl_relCenterX  ≈  parentW − ltr_relCenterX      (within tolerance)
   ```

   - **pass** —— 每个定位候选元素都围绕其父级中心镜像。
   - **not-RTL（失败）** —— 某个候选的 RTL 中心_不是_其 LTR 中心的镜像：它停留在同一物理侧（或偏移过度）。报告会列出元素 class + LTR/RTL `relCenterX` + 差值，作为可操作的发现。
   - **N-A** —— 该 story 没有逻辑锚点 + 物理 transform 候选（常见情况——不扣分），或仅在一个方向发现候选，没有可比较的对象。

**LTR 优先短路。** 如果 LTR 渲染产生零个候选，该 story 立即返回 `N-A`，且永远不会加载 RTL 页面——没有可衡量的对象，第二次导航无法改变判定。大多数 story 没有候选（最近一次完整扫描中 1394 个里有 1378 个），因此这大约节省 D5 一半的页面加载。

**与 D6 共享一次 LTR 加载。** D5 和 D6 都扫描每个 story，因此一次 LTR 加载同时服务两者：D5 在显示步骤之前读取页面（除非使用 `--pm-reveal`），D6 在之后读取，与各自单独加载时的顺序相同。只有当任一维度在 LTR 中找到候选时才加载 RTL 页面。

这也是一项正确性修复：旧的 `ltr.length === 0 && rtl.length === 0` 防护会让单侧 story 落入比较循环，而该循环运行 `min(ltr, rtl) = 0` 次，在什么都没比较的情况下报告 **pass**。

**容差：3px。** 观察到的信号差距约为容差的 10 倍（真正的错位会偏差几十 px；正确居中的元素按构造在 Δ=0 时通过——例如用 `translateX(-50%)` 居中的 Slider 滑块镜像回自身）。3px 可以吸收亚像素舍入，同时不会放行该类 bug。

三道防护使 D5 在完整库规模下保持 **0 误报**。真正的错误侧 bug 是一个**小**元素（宽度 ≪ 父级）位于某个**边缘**；每道防护都会移除一种_不是_这种形状的良性形态：

**1. 强制退化父级防护。** 任何 `offsetParent` **宽度 < 8px** 的候选都会被跳过。约 1px 宽的父级（例如 ResizeHandle 分隔条）会使镜像目标 ≈ 元素自身的坐标，产生无意义的“已镜像”或“严重偏移”读数——纯噪声。在验证 spike 中，这道防护移除了唯一的误报。

**2. 全跨度/原点防护。** 任何自身宽度 **≥ 父级宽度的 90%** 的候选都会被跳过：通栏条带横跨_整个_父级，因此占据两半，**没有左/右侧**可落错。这会捕获 `useResizable` 的**垂直**抓取区域（`ResizeHandle` 的 `hitAreaCenteredY`）：一个全宽条带，锚定为 `insetInlineStart:0; insetInlineEnd:0`，仅在块轴方向居中，因此其几何_中心_位于父级原点（relCenterX≈0），**在 LTR 和 RTL 中完全相同**。否则镜像断言会计算 `expected = parentW − 0 = parentW` 并触发虚假的 `Δ = parentW`。退化父级防护会漏掉它（父级约 850–1034 px，并不小），居中防护也会漏掉它（中心位于_边缘_，x≈0，而不是 `parentW/2`）——因此需要这道专门的防护。真正的 bug（Avatar status-dot：20–128 px 父级中的一个小点）满足 `elW ≪ parentW`，不受影响。

**3. 居中元素防护。** 已经位于父级水平中心（在父级宽度的 5% 以内）的候选镜像回自身，不可能表现出该 bug；跳过它可以移除良性的垂直控件噪声（例如垂直 Slider 滑块）。

启用全部三道防护后，该检查为 **6/6 真阳性（全部是 Avatar status-dot 变体），完整库中 0 误报**。

**为什么 lint 无法捕获。** `@astryx/no-physical-properties`（以及任何单属性 linter）孤立地看待每个声明：_逻辑_ inset 是_被鼓励_的，而 `transform` 不是物理 _inset_ 属性，因此两者都不会被标记。该 bug 只存在于两者在布局时的**交互**中，只有比较渲染后的 LTR 与 RTL 几何才能看到——这正是 D5 所做的。

### A.3 D6 方向性装饰

文本之所以具有方向性，可能是因为它在 **UI 中的角色**，而不仅仅是字符本身。散文中的 `/` 是中性的；同一个 `/` 作为重复面包屑项之间的 `aria-hidden` 分隔符渲染时，传达的是向前推进，必须镜像。

D6 对每个 story 运行，仅自动发现强装饰上下文：

- 元素为 `aria-hidden="true"`；
- 其去除空白后的内容是单个受支持字形；且
- 它属于重复的列表项，或位于同级元素之间。

该上下文可防止普通散文、日期、分数和路径变成误报。之后 D6 应用字形的实际 bidi 契约：

- `/`、`\\`、`→`、`←`、`>` 和 `<` 要求恰好一次显式 transform 镜像或一次左/右字形互换；
- `›`、`‹`、`»` 和 `«` 具有 Unicode `Bidi_Mirrored=Yes`，因此浏览器会镜像未更改的字形。再次互换或转换它们即为失败。

当 story 不包含上下文装饰时，D6 返回 **N-A**。下面的适用性层决定该 N-A 是否有解释；D6 本身不会把缺失变成通过。

### B. 精选精度——D2 / D3 / D4 / D7 / D8 / D9

`targets.json` 保存真正需要手写选择器的几何/行为维度，在自动发现之外**额外**运行：

- **D2 布局顺序翻转** —— prev/next 控件交换水平顺序（`boundingBox`）。_（Calendar、Lightbox。）_
- **D3 行为翻转** —— 方向性行为反转，例如 Carousel 的滚动轴：“next”使 `scrollLeft` 在 LTR 中变为正、在 RTL 中变为负。
- **D4 覆盖层侧边** —— 定位的可操作性元素翻转侧边（`boundingBox`）。
- **D7 粗略指针原生尺寸/对齐** —— 每个配置的原生 input 在其可见的粗指针包装元素下保持居中，接受中心点命中，并在每个配置尺寸下于 LTR/RTL 中同时满足目标 `minimumTargetSize` 的两个维度。该最小值属于组件/组合，而不是通用审计默认值；缺失或无效的维度是错误。报告分别保留原生和包装盒，以免大包装掩盖过小的 input。
- **D8 逻辑行内边缘镜像** —— 一个配置的、可见的、非零主体携带刻意不对称的逻辑 start/end padding 对，其逻辑值保持稳定，而解析后的物理行内轴两侧在 LTR 和 RTL 之间互换：横排书写中为左/右，竖排或侧向书写中为上/下。正交的物理边缘必须保持稳定。缺失、重复、隐藏、零尺寸、对称或改变书写模式的夹具会按失败关闭，因为它们无法证明该关系。真实的 Chromium 启动自检会在接受任何组件结果之前证明横排和竖排书写均通过，以及一个隐藏主体会失败。
- **D9 逻辑分组圆角** —— 配置的 first/middle/last 主体必须在一侧声明的逻辑行内边上收紧 end/both/start 圆角，保持每个对侧圆角完整，并在 LTR 和 RTL 之间镜像物理侧边。缺失、隐藏、对称、不一致或物理固定的分组会失败，而不是为父级对齐赢得覆盖。

D1、D5 和 D6 有意**不**放在 `targets.json` 中；自动发现会普遍覆盖它们。

### C. 适用性：没有无法解释的全 N-A 组件

报告将规范组件包注册表中的每个公开组件归入三种状态之一。包根、布局、story 前缀和公开组件名来自 `scripts/component-packages.cjs`；Storybook 标题会投射到该规范名册上，覆盖 Core、Lab、Charts、Rich Text 和 Vega，包括 `Charts/Chrome/Axes & Grids` 这样一对多的分组标题。当标题无法指明其所有者时，精选目标仍使用精确别名。`dims` 数组为空的条目仅为路由：它将公开所有者绑定到一个渲染它的 story，用于通用 D1/D5/D6 扫描，而不虚构精选测量。

- **measured（已测量）**：至少一个 D1/D5/D6 或精选维度适用；
- **verified N-A（已验证不适用）**：`verified-not-applicable.json` 记录了该组件没有方向敏感视觉、布局或行为的具体原因；
- **coverage gap（覆盖缺口）**：每个维度都返回 N-A 且未记录原因。

覆盖缺口就是发现。此规则适用于 main 上现有的完整库 release-check 扫描和每次发布前，也适用于带标签 PR 的 CI 中每个新增或变更的组件。当某个组件被 `--filter` 指名时，即使它没有 story 也算缺口；它不能仅仅因为没有可渲染内容就从报告中消失。

verified-N/A 声明不是允许列表。如果某个自动或精选维度后来变得适用，该声明会被报告为 **stale-verified-na**，必须移除或替换为真实覆盖。

只有在阅读组件源码和每个 story 之后才能添加声明：

```json
[
  {
    "component": "core/Text",
    "reason": "No direction-sensitive visual, positioned element, order, scroll, drag, overlay, or keyboard behavior."
  }
]
```

没有此类已提交理由的全 N-A 评分卡意味着**未测量**，而不是 RTL 就绪。

## 为什么基于关系，而不是像素基线

方向性 RTL bug 是_语义性_的（“chevron 没有镜像”、“prev/next 没有交换侧边”、“滚动轴没有反转”），而不是“这些像素变了”。审计按维度断言 LTR→RTL 关系，正好捕获这一类回归，同时避开字形覆盖在照片上的像素 diff 的不稳定性。

## 本地运行

```bash
# 1. Build the packages + a static Storybook (root build MUST run first, or the
#    storybook build fails to resolve @astryxdesign/build/dist/vite.mjs).
pnpm build
pnpm -F @astryxdesign/storybook build

# 2. Install the Playwright browser (once).
npx playwright install chromium

# 3. Run the audit against the built Storybook.
pnpm rtl:audit
#   -> prints the scorecard and writes rtl-audit-report.json

# Scope to one component while iterating. Note the `--`: pnpm -F IS --filter,
# so without it pnpm eats the flag as a workspace filter.
pnpm rtl:audit -- --filter Pagination

# Comma-separated, matched case-insensitively (accepts analysis.json's
# PascalCase names — this is what pr-rtl passes):
pnpm rtl:audit -- --filter Avatar,TableTree

# An absent or EMPTY --filter audits the whole library: ~1400 stories.

# Parallelise the sweep across N browser pages (default 1 = serial). Results
# are ordered by input, so the report is byte-identical at any N.
pnpm rtl:audit -- --concurrency 4

# Just the broad auto-discovery net, or just the curated dims:
pnpm rtl:audit -- --auto-only
pnpm rtl:audit -- --curated-only
```

对于 D7 门禁的原生宽度、原生高度、对齐、命中测试和最小契约变异（需要 Chromium）：

```bash
ASTRYX_RTL_BROWSER=1 pnpm exec vitest run --project node .github/scripts/rtl-audit-coarse-hit.browser.test.mjs --maxWorkers=1
```

如果自动发现找到 not-RTL 组件、精选维度失败、适用性注册表无效，或完整模式运行存在覆盖缺口或过期的 verified-N/A 声明，退出码为非零。CI 仍为软门禁（见下文），因此该信号尚未硬性阻塞。

## 添加精选目标

编辑 `targets.json`，保持按 `component`、再按 `storyId` 排序，这样并行 PR 可以在不同位置添加条目。`node apps/storybook/rtl-audit/sort-targets.mjs --fix` 会对其排序；RTL 审计的 node 测试会在文件未排序时失败。每个条目如下：

```jsonc
{
  "component": "MyComponent", // explicit alias for grouped story titles
  "storyId": "core-mycomponent--some-story", // must exist in dist/index.json
  "dims": ["D2", "D3", "D9"], // D2/D3/D4/D7/D8/D9 only (D1/D5/D6 are auto)
  "setup": {
    "args": {"position": "start"}, // optional: drive Storybook args
    "click": "img", // optional: reveal the target after args settle
  },
  "selectors": {
    "prev": "button[aria-label=\"Prev\"]", // D2
    "next": "button[aria-label=\"Next\"]",
    "scroller": "[aria-roledescription=\"carousel\"] > div:first-child", // D3
    "nextButton": "button[aria-label=\"Scroll right\"]",
    "overlay": "…",
    "overlayRoot": "…", // D4
    "groups": [
      // D9
      {
        "name": "primary",
        "logicalSide": "inline-start",
        "first": "[data-testid=group-first]",
        "middle": "[data-testid=group-middle]",
        "last": "[data-testid=group-last]",
      },
    ],
  },
}
```

## 无允许列表——任何 not-RTL 都是失败

RTL 迁移已完成：每个组件的方向性图标都正确镜像，因此审计以**无允许列表**的方式运行。任何被自动发现评为 not-RTL 的组件都是真正的回归（一个**意外**），应当修复，而不是找借口。这里刻意不提供将 not-RTL 组件标记为“预期”的机制——这样的机制会成为压制未来真实回归的内置手段。

### D5 位置镜像在 `main` 上尚未干净

D5 目前在 `main` 上会标记 Avatar **status-dot**：它用物理 `right` + `translate(50%, 50%)` 锚定圆点，因此在 RTL 下圆点仍位于底部**右侧**，而不是镜像到**左侧**——这是真正的 RTL bug。修复位于尚未合并的独立分支（**#4564**），因此从 `main` 切出的任何分支上，D5 都会将 Avatar status-dot 的 story 报告为 positional-mirror 失败。**这是真实发现，不是误报**，并且有意**不**被压制——软门禁（见下文）使其保持非阻塞，一旦 #4564 合入就会自动清除。_其他_所有组件都通过 D5（0 个其他标记），与验证 spike 中仅在 Avatar 上 6/6 的结果一致。

## 软门禁——等待稳定性窗口

`pr-rtl` CI 任务以 `continue-on-error: true` 运行：发现会在任务摘要中呈现评分卡，但在稳定性窗口内观察审计是否有偶发失败期间不阻塞合并。正是这道软门禁让 Avatar 的 D5 发现（上文）能够如实呈现而不破坏 CI。一旦稳定，要提升为必需检查：在 `.github/workflows/ci.yml` 的 `pr-rtl` 任务中移除 `continue-on-error`，并将其加入必需检查。
