# @xds/theme-neutral

# 0.7.16

#### 文档

- 修正主题 README 中的用法示例，改为从 `@astryxdesign/core/theme` 导入 `Theme`，而不是已移除的 `XDSTheme` 别名；同时刷新包索引和贡献者指南中的内置主题列表。([#11016](https://github.com/meta/astryx/pull/11016))

#### 贡献者

感谢所有为本版本做出贡献的人：

- @josephfarina
- @karlmoriaty

---

# 0.7.15

---

# 0.7.14

---

# 0.7.13

#### 修复

- 依赖下限提升至当前版本：构建包需要 autoprefixer 10.6.2、browserslist 4.29.5 和 lightningcss 1.33.0；CLI 需要 ignore 7.0.14、jscodeshift 17.4.0、linkedom 0.18.15、zod 4.6.7 和 @stylexjs/babel-plugin 0.19.1；每个主题需要 lucide-react 1.66.0。同级依赖范围不变。(#10709)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang

---

# 0.7.12

#### 修复

- Neutral：未选中的 SegmentedControl 标签在深色模式下于 AppShell 的表面上达到 4.5:1。轨道是半透明的，会提亮标签下方的表面：`#9e9e9e` 在 `#3c3c3c` 上测得 4.11:1。标签现在采用 `neutral.dark[80]`（6.46:1），与 Neutral 已在其选中行和胶囊上为次要文字提供的提亮相同。浅色模式不变，CLI 的 Neutral 主题模板保持一致。(#10881)
- 主题包现在会发布其 `./theme.css` 导出的声明文件。该导出将 `types` 指向 `theme.css.d.ts`，但包中并未随附该文件，导致 TypeScript 找不到 `import '@astryxdesign/theme-<name>/theme.css'` 的类型。导出保持不变；该文件现已发布。(#10903)
- 主题包声明 `"type": "module"`，因此打包工具和 Node 会将 `./built` 入口按 ES 模块读取。此前，它是在一个没有 `type` 字段的包中以 `.js` 文件形式存在的 ES 模块，遵循包 `type` 的工具会将其读作 CommonJS。所有导出子路径保持不变。源码入口的 CommonJS 构建现在为 `dist/source.cjs`，位于相同的 `require` 条件之后，并带有自己的 CommonJS 声明（`dist/source.d.cts`），因此 TypeScript 会按各条件加载的格式为其提供类型。与之前一样，`require('…/built')` 加载的是 ES 模块，因此需要支持 `require(esm)` 的 Node 版本（22.12 或更高）。深入 `exports` 之外访问 `dist/` 的深层导入也有变化：`dist/source.js` 现在是 `dist/source.cjs`，而 `require` `dist/<theme>.js` 会得到 ES 模块（`require(esm)`，Node 22.12 或更高）。(#10876)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang

---

# 0.7.11

---

# 0.7.10

---

# 0.7.9

#### 修复

- 在 Neutral 主题下，选中行、日历范围以及 Neutral 表面上的其他选中填充再次可见，高亮代码行也更强。`--color-accent-muted` 在深色模式下与表面相同，在浅色模式下与悬停色调几乎没有区别；它现在在浅色模式下为 `#d4d4d4`，在深色模式下为 `#474747`。在深色模式下，选中的 Item、TreeListItem 或勾选的 CheckboxListItem 行、编号 Citation 和 FileInput 拖放区会提亮其次要文字，使其在填充色上保持可读；拖放区的提示在静止状态下也略微变亮。Neutral 的代码注释、运算符和标点略微减少灰化，以便在高亮行上保持可读。CLI 的 Neutral 主题模板包含相同的值。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang

---

# 0.7.8

---

# 0.7.7

---

# 0.7.6

#### 修复

- 已发布的包不再包含仓库的测试和基准测试文件，在不改变导出的前提下减小了安装体积。(#9153)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @parinith-web

---

# 0.7.5

#### 新功能

- 状态颜色在其出现的所有位置都清晰可读，并且 Info 成为了独立的状态。每个状态（info、success、warning、error）现在都有一个强填充色（`--color-<status>`）及其上的内容色（`--color-on-<status>`，至少 4.5:1）、一个浅填充色（`--color-<status>-muted`）及其内容色（`--color-on-<status>-muted`），以及用于页面和卡片的可读文字色（`--color-text-<status>`）。状态图标（`--color-icon-<status>`）和边框（`--color-border-<status>`）默认使用可读文字色。Info 角色（`--color-info`、`--color-on-info`、`--color-info-muted` 等）是新增的，不再借用你的强调色。

  `--color-success`、`--color-warning` 和 `--color-error` 以及 `bg-<status>` 保持作为强填充色的含义。在 Tailwind 中，`bg-info`、`bg-info-muted`、`text-on-<status>`、`text-on-<status>-muted` 和 `text-status-<status>` 是新增的；`text-`、`decoration-`、`placeholder-` 和 `caret-<status>` 现在使用可读文字色阶，`border-`、`divide-`、`outline-` 和 `ring-<status>` 使用边框色阶，而 `bg-`、`accent-`、`fill-`、`stroke-<status>`、阴影和渐变保持强填充色。例如，Core 浅色模式下的 `text-warning` 现在是 `#753F07`，而不是 `#E9AF08`。若要在文字上保留填充色，请写 `text-[var(--color-warning)]`。

  屏幕上的变化：

  - Core 深色模式下的 Error 内容色（`--color-on-error`）现在是 `#0A1317`，而不是白色，因此深色模式错误填充色上的文字达到 4.5:1。Core 的 Info Badge 使用 `#0064E0`，而不是强调色（深色模式下为 `#2694FE`）。
  - 状态图标（Icon `color="info|success|warning|error"`）、Stepper 状态字形和 Chat 工具调用状态图标使用可读色阶。Core 浅色模式下的成功图标现在是 `#09441F`，而不是 `#0D8626`。
  - Input 和 FileInput 的状态边框使用边框色阶。Core 浅色模式下的警告边框现在是 `#753F07`，而不是 `#E9AF08`，Butter 浅色模式下的成功和警告输入边框达到 3:1。
  - Banner 使用 on-muted 颜色绘制其标题、描述、图标和控件，并用 `--color-info-muted` 填充 Info。
  - 状态填充色在强制颜色模式下保持可见边缘。
  - Chocolate 和 Matcha 的成功与错误填充色，以及 Stone 的成功、警告和错误填充色上的内容，现在达到 4.5:1。
  - 每个第一方主题都设置了蓝色 Info。Chocolate 和 Matcha 的 Info Badge 从强调色改为该蓝色；Butter 保留自己的 Info Badge 颜色。
  - Neutral 的 `--color-success`、`--color-warning` 和 `--color-error` 现在是其 Badge 一直显示的填充色，其 `--color-info` 为 `#0074E2`（深色模式下为 `#6D9CFE`）。其 Badge、StatusDot、进度填充和 Stepper 徽章外观不变；其强调色 ProgressBar、StatusDot 和 Stepper 现在使用 Neutral 的强调色，而不是蓝色。
  - Neutral 不再定义其未文档化的本地状态令牌。请改用标准角色：`--astryx-theme-neutral-color-status-fill-success`、`-status-fill-warning` 和 `-status-fill-error` → `--color-success`、`--color-warning`、`--color-error`；`-status-muted-accent` → `--color-info-muted`；`-on-tint-neutral` → `--color-neutral`；`-on-tint-overlay-*` 和 `-destructive-overlay-*` 令牌 → `--color-overlay-hover` 和 `--color-overlay-pressed`。`--astryx-theme-neutral-color-status-fill-accent` 保留其值，但已弃用。

  自定义主题会获得它们未设置的内容色和文字色角色：这些角色由主题的状态填充色派生。若要保留组件此前的颜色，请设置匹配的角色，例如将 `--color-icon-success` 设为你旧的 `--color-success`。

#### 文档

- 包链接现在指向项目的 GitHub 主页 `meta/astryx`。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @rubyycheung

---

# 0.7.4

---

# 0.7.3

---

# 0.7.2

---

# 0.7.1

---

# 0.7.0

#### 破坏性变更

- 在窄于 `lg` 断点的触摸设备上（`(width < 1024px) and (pointer: coarse)`），采用 14px 基准的第一方主题现在会将字号基准下限提升到 16px，并重新推导比例，使 Display 1 保持其桌面尺寸：neutral 和 chocolate（base 14，ratio 1.2 → 1.1736），以及 butter 和 stone（base 14，ratio 1.25 → 1.2225）。在手机上，正文、标签和代码文字从 14px 提升到 16px；辅助文字、标题以及 Display 2 和 3 增大 1–2px；只有 Display 1 保持其桌面尺寸。桌面尺寸不变。gothic、matcha 和 y2k 已经使用 16px 基准，无需规则。CLI 的主题模板包含相同的规则，因此新创建的主题也会获得它。(#6699)
  扩展这四个主题之一并设置自己的 `typography.scale` 或字号令牌的应用主题会继承此规则，在触摸 + 窄屏上，该规则会替换这些值（base-18 的子主题会降为 16px 正文和 42px Display 1）。为相同条件追加你自己的规则并填入所需的值；同一条件的较后规则会生效。

  迁移：无需更改即可采用新的手机字号比例。若要在应用中保留之前的 14px 手机字号比例，请扩展主题并为相同条件追加一条较后的规则：`defineTheme({name: 'app', extends: neutralTheme, adaptations: {rules: [{when: {pointer: 'coarse', width: {below: 'lg'}}, value: {typography: {scale: {base: 14, ratio: 1.2}}}}]}})`。对于 butter 和 stone，请使用 `ratio: 1.25`，并在该规则的值中设置 `tokens: {'--text-supporting-size': '12px'}`，因为这些主题将辅助文字固定为 12px，而不是仅靠比例得出的 11px。此变更无法由 codemod 重写：应用是否希望采用下限是产品选择。

#### 修复

- 根据 Neutral 主题使用的色阶生成其运行时调色板引用，并在包或 CLI 模板副本发生偏差时使验证失败。(#7255)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @imdreamrunner
- @rubyycheung

---

# 0.6.8

---

# 0.6.7

#### 新功能

- 每个主题包现在除了 `/built` 和 `/theme.css` 之外，还会导出 `/fonts.css`。当主题使用非系统字体时，请导入它。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @josephfarina

---

# 0.6.6

#### 新功能

- 新增共享的 `upload` 图标，并将其用于 FileInput 的上传提示，替代有方向性的 `arrowUp`
  主题通过 `icons.upload` 绘制 `upload`，与 `arrowUp` 分开，因此排序箭头和所有其他 `arrowUp` 用法保持不变。每个内置主题和主题模板都以各自的图标风格绘制 `upload`。FileInput 在两种模式下保持其图标大小、位置、颜色和无障碍性；没有 `upload` 图形的主题会在此处显示默认的上传到托盘字形。

  完整的 `IconRegistry` 在本版本中仍可省略 `upload`。下一个次要版本会将其设为必需项，因此请为你类型化为 `IconRegistry` 的任何注册表添加 `upload` 条目。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @rubyycheung

---

# 0.6.5

---

# 0.6.4

#### 新功能

- 在每个第一方主题源码旁附带一个带类型的 `ThemeDoc` 描述符。(#6498)

#### 文档

- 将 Neutral 描述为 Figtree 字体并添加字体加载片段；README 曾声称使用系统字体，而主题实际声明的是 Figtree。(#5991)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @AKnassa
- @josephfarina

---

# 0.6.3

---

# 0.6.2

---

# 0.6.1

#### 修复

- 在维护中的主题和新示例中优先使用规范组件目标名称，同时在 0.7.0 移除窗口之前保留已弃用的运行时别名和已发布的裸 prop/state 选择器类。主题发现会标记已弃用的目标，主题构建会针对每个确切的规范替换发出警告，`astryx upgrade --apply` 提供向前兼容的裸选择器迁移。(#6126)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang

---

# 0.6.0

#### 破坏性变更

- 作为协调稳定版本的一部分，需要 `@astryxdesign/core@0.6.0`。请一起升级 Core 和此主题。

#### 新功能

- 新增创作时的 OKLCH 调色板生成器，具有纯 API、终端和 HTML 预览、带类型的调色板输出、自定义色阶、确定性回执以及覆盖保护。
  [feat] 将精确的纯黑和纯白值暴露为 `neutralPalettes.black` 和 `neutralPalettes.white`，用于语义主题令牌。

#### 修复

- 将 Neutral 浅色模式的前景色对齐到更深的调色板色阶。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @rubyycheung

---

# 0.5.4

---

# 0.5.3

#### 新增组件

- 在徽章、状态点、步骤指示器和进度条中复用 Neutral 拥有的本地令牌作为语义状态填充。(#5854)
- 添加 Neutral 的可复现、主题拥有的 OKLCH 调色板，而不更改
  其运行时令牌映射。请求、回执、生成结果和 CLI 模板产物一并提交以供评审。(#5987)

#### 新功能

- 降低 Neutral 深色彩色调色板低色调边缘的饱和度，同时保留其浅色和中性色阶。(#6069)

#### 修复

- 修正 Neutral Banner 的交互色调，使浅色模式使用半透明浅色叠加层，深色模式使用半透明深色叠加层。(#5936)
- 为 Neutral 破坏性按钮使用由调色板支持的红色交互叠加层、深色调色板的
  tone-25 纯色背景（灰色为 tone 20），以及更平静的深色模式文字颜色。为深色 info 横幅使用由调色板支持的柔和蓝色色调，同时保留现有的浅色模式非语义颜色映射。(#6049)
- 给 Neutral 的分段控件更宽敞的内缩，同时保持其外部高度。(#5851)
- 重命名内置语法主题标识符。(#5847)
- 通过具名色阶引用，将 Neutral 的语义、语法和分类颜色令牌重新映射到
  经过评审的主题自有调色板。保持维护中的 CLI 模板同步。(#6034)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @rubyycheung

---

# 0.5.2

---

# 0.5.1

#### 修复

- 主题包不再附带未使用的 CommonJS `icons.js` 产物。其根入口保留其宣称的 CommonJS 和 ESM 输出，而 `/built` 使用的独立图标配套文件仅以 `icons.mjs` 形式生成。(#5512)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @jiunshinn

---

# 0.5.0

#### 修复

- neutral 主题：将浅色模式错误红色从 `#e33f4a` 加深到 `#c9303a`，使填充的 `Badge variant="error"` 标签通过 WCAG 2.1 AA。白色在 `#e33f4a` 上为 4.14:1，而徽章标签为 12px/字重 500，因此适用 4.5:1 的正文阈值，而不是 3:1 的大字豁免；`#c9303a` 提供 5.29:1 并保持色相（OKLCH H 21.9 -> 22.8，C 0.200 -> 0.189）。StatusDot 和 ProgressBar 的 `--color-error` 重绑定也随之调整——两者都被文档化为跟随徽章填充色，因此圆点与其徽章读作同一种状态语言。深色模式未动（`#ff705d` 上的深色文字，6.60:1）。新增 `scripts/check-badge-contrast.test.mjs`，它通过 `light-dark()`、`var()` 间接引用和 alpha 合成来解析每个主题的徽章标签/填充配对，并将它们全部保持在 4.5:1 (#4446)。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @AKnassa

---

# 0.4.7

---

# 0.4.6

---

# 0.4.5

---

# 0.4.4

---

# 0.4.3

#### 修复

- Banner：关闭后的横幅不再丢失焦点，自定义状态不再丢失其 ARIA 角色，info 横幅在 neutral 主题下也恢复绘制。
  关闭操作会卸载已聚焦的关闭按钮，因此焦点落到 `<body>`，键盘用户会丢失页面中的位置。Banner 现在会记录焦点从何处进入，并将焦点返回到那里，与 `ToastViewport` 为已关闭 toast 执行的交接相同。在 Chromium 中测得：`document.activeElement` 过去是 `BODY`，现在是用户通过 Tab 进入的那个控件。

  `BannerStatusMap` 被文档化为可扩充，但四个状态查找都是封闭的 `Record<BannerStatus, ...>` 映射。添加文档所展示的扩充会在 `Banner.tsx` 内部产生四个 TypeScript 错误，消费者无法修复；而且在运行时，未知状态会将其图标、背景和 ARIA 角色解析为 `undefined`，导致横幅完全不再是 live region。现在这些查找是部分映射：未识别的状态会渲染为无状态填充、无默认字形，并使用 `role="status"`。

  主题无法触及横幅的圆角。`--_banner-radius` 在文档文件和 `derivedVarRegistry.ts` 中声明，但没有任何规则读取它，因此主题在 `banner` 目标上设置的 `borderRadius` 会展开为一个无人使用的变量。四个卡片轮廓圆角现在会读取它，并回退到 `--radius-container`。

  在 `@astryxdesign/theme-neutral` 下，info 横幅在浅色和深色模式下都完全没有背景：覆盖层直接设置 `background-color`，并将 `--color-accent-muted` 强制设为 `transparent`，而主题写入的普通 CSS 属性会落入 `@layer astryx-theme`，被 StyleX 的 `@layer priority4` 压过。Info 现在与其他三种状态以及 stone 主题已有的做法一样，通过 `--color-accent-muted` 实现。

  此变更还包含：`children={false}`（常见的 `{cond && <ul/>}` 写法）不再产生一个会打开空盒子的展开切换开关，`description=""` 不再留下空的 20px 行，两者都通过 `isRenderable` 实现；标题或描述中一个很长的连续单词不再在 320px 视口下迫使页面出现水平滚动，此前测得 `document.scrollWidth` 为 529px；内容区域的底部边框与它的内联同级边框一样，使用逻辑属性 `border-block-end`。

- `/built` 入口现在可在 Node ESM 和外部化 SSR（Vite `--ssr`、Remix / React Router v7）下加载：它导入 `./icons.mjs`，而不是 Node 无法解析的无扩展名 `./icons`。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @AKnassa
- @cixzhang

---

# 0.4.2

---

# 0.4.1

---

# 0.4.0

#### 修复

- `--radius-none` 不再被覆盖为 `0.25rem`。`--radius-none` 和 `--radius-full` 被文档化为始终固定（从不按主题缩放），与 `@astryxdesign/core` 自身的默认值一致——此主题的圆角组调整曾误将 `--radius-none` 一并扫入。在此主题下通过 `--radius-none` 选择退出圆角的任何内容，现在会再次以真正的 `0px` 圆角渲染，而不是静默的 4px。(#4856)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @HelloOjasMutreja

---

# 0.3.0

#### 修复

- neutral 主题：将浅色模式 `--color-text-secondary` 从 neutral-500（#737373）加深到 neutral-600（#525252）。500 在 T95 正文背景（#f1f1f1）上仅达到 4.19:1，刚好低于 WCAG AA 1.4.3（4.5:1）；600 通过。深色模式不变。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @humbertovirtudes

---

# 0.2.0

#### 修复

- Neutral 主题：将浅色模式 `--color-border` 表示为 `#00000014`（半透明黑），而不是不透明的 `#ebebeb`。在白色表面上的渲染颜色相同，但现在可以叠加混合到任何背景上——与半透明的深色模式值一致。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @kentonquatman

---

# 0.1.9

---

# 0.1.8

---

# 0.1.7

#### 修复

- StatusDot 现在在 neutral 主题中使用与填充徽章相同的鲜艳填充色。此前圆点映射到深色文字/图标色阶（深绿、栗色、棕色），在浅色模式下显得浑浊；success/warning/error/accent 现在与其徽章对应项匹配，因此圆点与其徽章共享同一状态颜色。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @ernestt

---

# 0.1.6

---

# 0.1.5

---

# 0.1.4

---

# 0.1.3

---

# 0.1.2

---

# 0.1.1

---

# 0.1.0

---

# 0.0.15

#### 变更

- 跟踪 `@xds/core@0.0.15`（裸名称迁移 + 数据属性选择器接口）。

# 0.0.13

#### 变更

- 图标重命名：`checkCircle`/`xCircle` → `success`/`error` (#1503)

#### 补丁变更

- 更新依赖
  - @xds/core@0.0.13

---

# 0.0.5

#### 变更

- 更新令牌名称以匹配命名审计（shadow、radius、elevation 重命名）
- 动效令牌原语：duration 和 easing 值
- 通过 `defineTheme` 配置支持动态圆角和字号比例

#### 补丁变更

- 更新依赖
  - @xds/core@0.0.5

---

# 0.0.4

#### 补丁变更

- 更新依赖——与 @xds/core@0.0.4 对齐

---

# 0.0.3

#### 补丁变更

- 修复主题包以通过 tsup 生成正确的 JS/TS 模块输出 (#541)

---

# 0.0.2

#### 变更

- 迁移到基于 CSS 的主题体系，使用 `defineTheme()`

---

# 0.0.1

- 初始版本——中性主题，使用 Lucide 图标
