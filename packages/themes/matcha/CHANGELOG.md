# @xds/theme-matcha

# 0.7.16

#### 文档

- 修正主题 README 中的用法示例，改为从 `@astryxdesign/core/theme` 导入 `Theme`，而不是已移除的 `XDSTheme` 别名；同时刷新包索引和贡献者指南中的内置主题列表。([#11016](https://github.com/meta/astryx/pull/11016))

#### 贡献者

感谢所有为本版本做出贡献的人：

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

- 主题包现在会发布其 `./theme.css` 导出的声明文件。该导出将 `types` 指向 `theme.css.d.ts`，但包中并未随附该文件，导致 TypeScript 找不到 `import '@astryxdesign/theme-<name>/theme.css'` 的类型。导出保持不变；该文件现已发布。(#10903)
- 主题包声明 `"type": "module"`，因此打包工具和 Node 会将 `./built` 入口按 ES 模块读取。此前，它是在一个没有 `type` 字段的包中以 `.js` 文件形式存在的 ES 模块，遵循包 `type` 的工具会将其读作 CommonJS。所有导出子路径保持不变。源码入口的 CommonJS 构建现在为 `dist/source.cjs`，位于相同的 `require` 条件之后，并带有自己的 CommonJS 声明（`dist/source.d.cts`），因此 TypeScript 会按各条件加载的格式为其提供类型。与之前一样，`require('…/built')` 加载的是 ES 模块，因此需要支持 `require(esm)` 的 Node 版本（22.12 或更高）。深入 `exports` 之外访问 `dist/` 的深层导入也有变化：`dist/source.js` 现在是 `dist/source.cjs`，而 `require` `dist/<theme>.js` 会得到 ES 模块（`require(esm)`，Node 22.12 或更高）。(#10876)
- Matcha：浅色模式下的次要文字略微加深（Neutral Light 30），因此在正文（5.11:1，原为 3.83:1）、表面和卡片上均达到 4.5:1。(#10932)
  [fix] Y2K：浅色模式下的次要文字略微加深（Neutral Light 35），因此在 Periwinkle 正文上达到 4.5:1（5.14:1，原为 4.25:1）。CLI 的 Matcha 和 Y2K 主题模板保持一致。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang

---

# 0.7.11

---

# 0.7.10

---

# 0.7.9

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

#### 新功能

- 将 Matcha 现有的颜色角色迁移到其经过评审的浅色和深色调色板，包括 Tea Gold。Warning 和 Yellow 从 `#FFB600` / `#FFC940` 变为 `#F2C000` / `#F6D066`；相关的语法颜色和警告内嵌环也跟随同一调色板。需要旧外观的消费者可以扩展 `matchaTheme`，并用之前的值为受影响的颜色、语法、阴影和组件令牌设置覆盖。完整的 Matcha 调色板仍是私有的创作数据，CLI 模板包含相同的请求、回执和运行时尺寸的引用。(#7671)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @rubyycheung

---

# 0.7.3

---

# 0.7.2

---

# 0.7.1

---

# 0.7.0

#### 破坏性变更

- matcha 和 y2k 的间距步进使用 rem（`--spacing-2: 0.75rem`），因此它们的间隙和内边距会像核心比例一样跟随读者的根字号。在默认 16px 根字号下，每一步的像素值相同；根字号更大的读者现在会在这两个主题上看到按比例增大的间距。CLI 的两个主题模板副本以及带注释的主题模板的间距示例也以同样方式变化。(#7374)
  迁移：无需更改即可采用新行为。若要在其中一个主题上保持固定像素间距，请扩展它并以 px 覆盖这些步进，会按原样生效：`defineTheme({name: 'app', extends: matchaTheme, tokens: {'--spacing-2': '12px'}})`。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang

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

#### 贡献者

感谢所有为本版本做出贡献的人：

- @josephfarina

---

# 0.6.3

---

# 0.6.2

---

# 0.6.1

---

# 0.6.0

#### 破坏性变更

- 作为协调稳定版本的一部分，需要 `@astryxdesign/core@0.6.0`。请一起升级 Core 和此主题。

---

# 0.5.4

---

# 0.5.3

#### 修复

- 重命名内置语法主题标识符。(#5847)

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

- `/built` 入口现在可在 Node ESM 和外部化 SSR（Vite `--ssr`、Remix / React Router v7）下加载：它导入 `./icons.mjs`，而不是 Node 无法解析的无扩展名 `./icons`。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @AKnassa

---

# 0.4.2

---

# 0.4.1

---

# 0.4.0

---

# 0.3.0

---

# 0.2.0

---

# 0.1.9

---

# 0.1.8

---

# 0.1.7

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

- 主题打磨——使字号比例与其他主题对齐（base 16，ratio 1.25），并柔化浅色模式下的 sage 边框令牌。(#2856)
- 跟踪 `@xds/core@0.0.15`（裸名称迁移 + 数据属性选择器接口）。

# 0.0.13

#### 新增

- 初始版本——大地绿色调色板，搭配 Figtree 字体 (#1803)
