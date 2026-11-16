# @xds/theme-chocolate

# 0.7.16

#### 文档

- 修正主题 README 的用法示例，改为从 `@astryxdesign/core/theme` 导入 `Theme`，而不是已移除的 `XDSTheme` 别名；并刷新包索引和贡献者指南中的随附主题列表。([#11016](https://github.com/meta/astryx/pull/11016))

#### 贡献者

感谢所有为本次发布做出贡献的人：

- @karlmoriaty

---

# 0.7.15

---

# 0.7.14

---

# 0.7.13

#### 问题修复

- 依赖下限已提升到当前发布版本：构建包需要 autoprefixer 10.6.2、browserslist 4.29.5 和 lightningcss 1.33.0；CLI 需要 ignore 7.0.14、jscodeshift 17.4.0、linkedom 0.18.15、zod 4.6.7 和 @stylexjs/babel-plugin 0.19.1；每个主题需要 lucide-react 1.66.0。peer 版本范围不变。(#10709)

#### 贡献者

感谢所有为本次发布做出贡献的人：

- @cixzhang

---

# 0.7.12

#### 问题修复

- 主题包现在会发布其 `./theme.css` 导出的声明。该导出将 `types` 指向 `theme.css.d.ts`，但包中并未附带该文件，因此 TypeScript 找不到 `import '@astryxdesign/theme-<name>/theme.css'` 的类型。导出本身不变；该文件现在已发布。(#10903)
- 主题包声明了 `"type": "module"`，因此打包器和 Node 会把 `./built` 入口当作它实际所属的 ES 模块来读取。以前，它是一个没有 `type` 的包中 `.js` 文件里的 ES 模块，遵循包 `type` 的工具会将其读作 CommonJS。所有导出的子路径保持不变。源码入口的 CommonJS 构建现在是在同一 `require` 条件下提供的 `dist/source.cjs`，并带有自己的 CommonJS 声明（`dist/source.d.cts`），因此 TypeScript 会按各条件实际加载的格式为其提供类型。与以前一样，`require('…/built')` 加载的是 ES 模块，因此需要支持 `require(esm)` 的 Node 版本（22.12 或更高）。越过 `exports` 深入 `dist/` 的深层导入也会变化：`dist/source.js` 现在是 `dist/source.cjs`，而 `require` `dist/<theme>.js` 得到的是 ES 模块（`require(esm)`，Node 22.12 或更高）。(#10876)

#### 贡献者

感谢所有为本次发布做出贡献的人：

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

#### 问题修复

- 已发布的包不再包含仓库中的测试和基准测试文件，在不改变导出的情况下减小安装体积。(#9153)

#### 贡献者

感谢所有为本次发布做出贡献的人：

- @parinith-web

---

# 0.7.5

#### 新功能

- 状态色在所有出现的位置都清晰可读，并且 Info 成为独立的状态。每个状态（info、success、warning、error）现在都有一个强填充色（`--color-<status>`）及其上的内容色（`--color-on-<status>`，至少 4.5:1）、一个浅填充色（`--color-<status>-muted`）及其内容色（`--color-on-<status>-muted`），以及用于页面和卡片的可读文本色（`--color-text-<status>`）。状态图标（`--color-icon-<status>`）和边框（`--color-border-<status>`）默认为可读文本色。Info 角色（`--color-info`、`--color-on-info`、`--color-info-muted` 等）是新增的，不再借用你的强调色。

  `--color-success`、`--color-warning` 和 `--color-error` 以及 `bg-<status>` 继续保持其作为强填充色的含义。在 Tailwind 中，`bg-info`、`bg-info-muted`、`text-on-<status>`、`text-on-<status>-muted` 和 `text-status-<status>` 是新增的；`text-`、`decoration-`、`placeholder-` 和 `caret-<status>` 现在使用可读文本色，`border-`、`divide-`、`outline-` 和 `ring-<status>` 使用边框色，而 `bg-`、`accent-`、`fill-`、`stroke-<status>`、阴影和渐变保留强填充色。例如，Core 浅色主题的 `text-warning` 现在是 `#753F07`，而不是 `#E9AF08`。若要在文本上保留填充色，请写 `text-[var(--color-warning)]`。

  屏幕上会发生的变化：

  - Core 深色模式的 Error 内容色（`--color-on-error`）现在是 `#0A1317`，而不是白色，因此深色模式错误填充色上的文本达到 4.5:1。Core 的 Info Badge 使用 `#0064E0`，而不是强调色（深色模式下为 `#2694FE`）。
  - 状态图标（Icon `color="info|success|warning|error"`）、Stepper 的状态字形以及 Chat 的工具调用状态图标使用可读色。Core 浅色模式的 success 图标现在是 `#09441F`，而不是 `#0D8626`。
  - Input 和 FileInput 的状态边框使用边框色。Core 浅色模式的 warning 边框现在是 `#753F07`，而不是 `#E9AF08`，Butter 浅色模式的 success 和 warning 输入框边框达到 3:1。
  - Banner 使用 on-muted 颜色绘制其标题、描述、图标和控件，并用 `--color-info-muted` 填充 Info。
  - 在强制颜色（forced-colors）模式下，状态填充色保留可见的边缘。
  - Chocolate 和 Matcha 的 success 与 error 填充色上，以及 Stone 的 success、warning 和 error 填充色上的内容色，现在达到 4.5:1。
  - 每个第一方主题都设置了蓝色的 Info。Chocolate 和 Matcha 的 Info Badge 从强调色改为该蓝色；Butter 保留自己的 Info Badge 颜色。
  - Neutral 的 `--color-success`、`--color-warning` 和 `--color-error` 现在是其 Badge 早已显示的填充色，其 `--color-info` 为 `#0074E2`（深色模式下为 `#6D9CFE`）。其 Badge、StatusDot、进度填充和 Stepper 徽章外观不变；其强调色 ProgressBar、StatusDot 和 Stepper 现在使用 Neutral 的强调色，而不是蓝色。
  - Neutral 不再定义其未文档化的本地状态令牌。请改用标准角色：`--astryx-theme-neutral-color-status-fill-success`、`-status-fill-warning` 和 `-status-fill-error` → `--color-success`、`--color-warning`、`--color-error`；`-status-muted-accent` → `--color-info-muted`；`-on-tint-neutral` → `--color-neutral`；`-on-tint-overlay-*` 和 `-destructive-overlay-*` 令牌 → `--color-overlay-hover` 和 `--color-overlay-pressed`。`--astryx-theme-neutral-color-status-fill-accent` 保留其值，但已弃用。

  自定义主题会获得它们未设置的内容色和文本色角色：这些角色由主题的状态填充色推导而来。要保留某个组件之前的颜色，请设置对应的角色，例如将 `--color-icon-success` 设置为你原来的 `--color-success`。

#### 文档

- 包链接现在指向项目的 GitHub 主页 `meta/astryx`。

#### 贡献者

感谢所有为本次发布做出贡献的人：

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

#### 问题修复

- `secondary` 的 Selector、MultiSelector 或 ComplexSelector 现在与主题的 secondary Button 匹配：在 butter、chocolate、gothic、stone 和 y2k 下，它会采用该 Button 的边框、填充、文本颜色和悬停效果，而不是默认的无边框中性填充，因此混合使用 secondary 按钮和选择器的工具栏看起来是一组统一的控件。禁用和只读触发器在悬停时保持填充不变，与禁用的 Button 一样；位于 InputGroup 内的 Selector 或 MultiSelector 会保留该组的中性填充和边缘。默认主题不变，选择器文档现在说明 `secondary` 会跟随主题的 secondary Button，通过 CLI 添加的主题也会获得同样的一致性。(#7548)

#### 贡献者

感谢所有为本次发布做出贡献的人：

- @cixzhang

---

# 0.7.0

#### 破坏性变更

- 在窄于 `lg` 断点的触摸设备上（`(width < 1024px) and (pointer: coarse)`），以 14px 为基准的第一方主题现在将其字号基准下限提升到 16px，并重新推导比例，以便 Display 1 保持桌面端尺寸：neutral 和 chocolate（基准 14，比例 1.2 → 1.1736），butter 和 stone（基准 14，比例 1.25 → 1.2225）。在手机上，正文、标签和代码文本从 14px 提升到 16px；辅助文本、标题以及 Display 2 和 3 增大 1–2px；只有 Display 1 保持桌面端尺寸。桌面端尺寸不变。gothic、matcha 和 y2k 已经使用 16px 基准，无需此规则。CLI 的主题模板带有相同规则，因此新脚手架创建的主题也会获得该规则。(#6699)
  扩展这四个主题之一并设置了自身 `typography.scale` 或字号令牌的应用主题会继承此规则，在触摸 + 窄屏下该规则会替换这些值（以 18 为基准的子主题会降为 16px 正文和 42px 的 Display 1）。请为相同条件追加你自己的规则并写入你想要的值；相同条件下较晚的规则胜出。

  迁移：无需任何改动即可采用新的手机字号比例。若要在应用中保留之前的 14px 手机字号比例，请扩展主题并为相同条件追加一条较晚的规则：`defineTheme({name: 'app', extends: neutralTheme, adaptations: {rules: [{when: {pointer: 'coarse', width: {below: 'lg'}}, value: {typography: {scale: {base: 14, ratio: 1.2}}}}]}})`。对于 butter 和 stone，请使用 `ratio: 1.25`，并在该规则的 value 中同时设置 `tokens: {'--text-supporting-size': '12px'}`，因为这些主题将辅助文本固定为 12px，而不是仅靠比例得到的 11px。这无法通过 codemod 重写：应用是否需要该下限是一个产品决策。

#### 贡献者

感谢所有为本次发布做出贡献的人：

- @imdreamrunner

---

# 0.6.8

---

# 0.6.7

#### 新功能

- 每个主题包现在在 `/built` 和 `/theme.css` 之外还会导出 `/fonts.css`。当主题使用非系统字体时，请导入它。

#### 贡献者

感谢所有为本次发布做出贡献的人：

- @josephfarina

---

# 0.6.6

#### 新功能

- 新增共享的 `upload` 图标，并将其用于 FileInput 的上传提示，而不是有方向性的 `arrowUp`
  主题通过 `icons.upload` 绘制 `upload`，与 `arrowUp` 分离，因此排序箭头以及所有其他 `arrowUp` 用法保持不变。每个随附主题和主题模板都以自己的图标风格绘制 `upload`。FileInput 在两种模式下都保持其图标大小、位置、颜色和可访问性；没有 `upload` 图稿的主题会在该处显示默认的“上传到托盘”字形。

  完整的 `IconRegistry` 在本版本中仍可省略 `upload`。下一个小版本会将其设为必需项，因此请为你以 `IconRegistry` 类型声明的任何注册表添加 `upload` 条目。

#### 贡献者

感谢所有为本次发布做出贡献的人：

- @rubyycheung

---

# 0.6.5

---

# 0.6.4

#### 新功能

- 在每个第一方主题源码旁附带一个带类型的 `ThemeDoc` 描述符。(#6498)

#### 贡献者

感谢所有为本次发布做出贡献的人：

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

- 作为协同稳定发布的一部分，要求 `@astryxdesign/core@0.6.0`。请一起升级 Core 和该主题。

---

# 0.5.4

---

# 0.5.3

#### 问题修复

- 重命名内置语法主题标识符。(#5847)

#### 贡献者

感谢所有为本次发布做出贡献的人：

- @rubyycheung

---

# 0.5.2

---

# 0.5.1

#### 问题修复

- 主题包不再附带未使用的 CommonJS `icons.js` 产物。其根入口保留其对外公布的 CommonJS 和 ESM 输出，而 `/built` 使用的独立图标配套文件仅以 `icons.mjs` 形式生成。(#5512)

#### 贡献者

感谢所有为本次发布做出贡献的人：

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

#### 问题修复

- `/built` 入口现在可以在 Node ESM 和外部化 SSR（Vite `--ssr`、Remix / React Router v7）下加载：它导入 `./icons.mjs`，而不是 Node 无法解析的无扩展名 `./icons`。

#### 贡献者

感谢所有为本次发布做出贡献的人：

- @AKnassa

---

# 0.4.2

#### 问题修复

- `--radius-none` 不再被覆盖为 `0.125rem`。`--radius-none` 和 `--radius-full` 已在文档中说明为始终固定（从不随主题缩放），与 `@astryxdesign/core` 自身的默认值一致——这些主题的圆角组升级曾错误地把 `--radius-none` 也一并改动，这个问题与 #4856 中为 `theme-neutral` 修复的是同一个 bug。在这些主题下任何通过 `--radius-none` 选择不使用圆角的内容，现在会再次以真正的 `0px` 半径渲染，而不是悄悄变成 2px。

#### 贡献者

感谢所有为本次发布做出贡献的人：

- @is-jain

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

- 跟踪 `@xds/core@0.0.15`（裸名称迁移 + 数据属性选择器表面）。
