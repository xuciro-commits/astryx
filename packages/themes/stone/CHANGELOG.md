# @xds/theme-stone

# 0.7.16

#### 文档

- 修复主题 README 中的用法示例，改为从 `@astryxdesign/core/theme` 导入 `Theme`，而不是使用已移除的 `XDSTheme` 别名；并更新包索引和贡献者指南中的内置主题列表。([#11016](https://github.com/meta/astryx/pull/11016))

#### 贡献者

感谢为本版本做出贡献的所有人：

- @karlmoriaty

---

# 0.7.15

---

# 0.7.14

---

# 0.7.13

#### 问题修复

- 依赖版本下限提升至当前版本：构建包需要 autoprefixer 10.6.2、browserslist 4.29.5 和 lightningcss 1.33.0；CLI 需要 ignore 7.0.14、jscodeshift 17.4.0、linkedom 0.18.15、zod 4.6.7 和 @stylexjs/babel-plugin 0.19.1；每个主题需要 lucide-react 1.66.0。peer 范围保持不变。(#10709)

#### 贡献者

感谢为本版本做出贡献的所有人：

- @cixzhang

---

# 0.7.12

#### 问题修复

- 主题包现在会发布其 `./theme.css` 导出的声明文件。此前该导出的 `types` 指向 `theme.css.d.ts`，但包中并未附带该文件，因此 TypeScript 无法为 `import '@astryxdesign/theme-<name>/theme.css'` 找到类型。导出本身未变；该文件现已发布。(#10903)
- 主题包声明 `"type": "module"`，因此打包器和 Node 会将 `./built` 入口按它实际所属的 ES 模块来读取。此前，它是一个位于没有 `type` 字段的包中的 `.js` 文件里的 ES 模块，遵循包 `type` 的工具会把它当作 CommonJS 读取。所有导出子路径保持不变。源码入口的 CommonJS 构建现在为 `dist/source.cjs`，仍位于相同的 `require` 条件之后，并带有自己的 CommonJS 声明（`dist/source.d.cts`），因此 TypeScript 会按各条件的加载格式为其标注类型。与之前一样，`require('…/built')` 加载的是 ES 模块，因此需要支持 `require(esm)` 的 Node 版本（22.12 或更高）。绕过 `exports` 深入 `dist/` 的深层导入也有变化：`dist/source.js` 现在为 `dist/source.cjs`，而 `require` 一个 `dist/<theme>.js` 会得到 ES 模块（`require(esm)`，Node 22.12 或更高）。(#10876)
- Butter、Stone 和 Y2K 主题将辅助文本（`--text-supporting-size`）设为 rem 而非固定的 12px，因此当读者调高浏览器默认字号时它会像其他文本一样随之增大。在默认字号下仍是 12px。CLI 中这些主题的副本也保持一致。(#10320)

#### 贡献者

感谢为本版本做出贡献的所有人：

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

- 已发布的包不再包含仓库的测试和基准测试文件，在不改变导出的情况下减小了安装体积。(#9153)

#### 贡献者

感谢为本版本做出贡献的所有人：

- @parinith-web

---

# 0.7.5

#### 新功能

- 状态颜色在所有出现的地方都清晰可读，Info 也成为独立的状态。每个状态（info、success、warning、error）现在都有一个实色填充（`--color-<status>`）及其上的内容色（`--color-on-<status>`，至少 4.5:1）、一个浅色填充（`--color-<status>-muted`）及其内容色（`--color-on-<status>-muted`），以及用于页面和卡片的可读文本色（`--color-text-<status>`）。状态图标（`--color-icon-<status>`）和边框（`--color-border-<status>`）默认使用可读文本色。Info 角色（`--color-info`、`--color-on-info`、`--color-info-muted` 等）是新增的，不再借用你的强调色。

  `--color-success`、`--color-warning`、`--color-error` 和 `bg-<status>` 保持其作为实色填充的含义。在 Tailwind 中，`bg-info`、`bg-info-muted`、`text-on-<status>`、`text-on-<status>-muted` 和 `text-status-<status>` 是新增的；`text-`、`decoration-`、`placeholder-` 和 `caret-<status>` 现在使用可读文本色，`border-`、`divide-`、`outline-` 和 `ring-<status>` 使用边框色，而 `bg-`、`accent-`、`fill-`、`stroke-<status>`、阴影和渐变仍使用实色填充。例如，Core 浅色模式下的 `text-warning` 现在是 `#753F07`，而不是 `#E9AF08`。若要在文本上保留填充色，请写 `text-[var(--color-warning)]`。

  屏幕上会有以下变化：

  - Core 深色模式下的 Error 内容色（`--color-on-error`）现在是 `#0A1317` 而不是白色，因此深色模式错误填充上的文本达到 4.5:1。Core 的 Info Badge 使用 `#0064E0`，而不是强调色（深色模式下为 `#2694FE`）。
  - 状态图标（Icon `color="info|success|warning|error"`）、Stepper 状态图标和 Chat 工具调用状态图标使用可读色。Core 浅色模式的 success 图标现在是 `#09441F`，而不是 `#0D8626`。
  - Input 和 FileInput 的状态边框使用边框色。Core 浅色模式的 warning 边框现在是 `#753F07`，而不是 `#E9AF08`，Butter 浅色模式的 success 和 warning 输入框边框达到 3:1。
  - Banner 的标题、描述、图标和控件使用 on-muted 颜色绘制，并用 `--color-info-muted` 填充 Info。
  - 强制颜色模式下，状态填充保持可见的边缘。
  - Chocolate 和 Matcha 的 success 与 error 填充上的内容，以及 Stone 的 success、warning 和 error 填充上的内容，现在都达到 4.5:1。
  - 每个第一方主题都设置了蓝色 Info。Chocolate 和 Matcha 的 Info Badge 从强调色改为该蓝色；Butter 保留自己的 Info Badge 配色。
  - Neutral 的 `--color-success`、`--color-warning` 和 `--color-error` 现在是其 Badge 此前已显示的填充色，`--color-info` 为 `#0074E2`（深色模式下 `#6D9CFE`）。其 Badge、StatusDot、进度填充和 Stepper 徽标外观不变；其强调色 ProgressBar、StatusDot 和 Stepper 现在使用 Neutral 的强调色而不是蓝色。
  - Neutral 不再定义其未文档化的本地状态 token。请改用标准角色：`--astryx-theme-neutral-color-status-fill-success`、`-status-fill-warning` 和 `-status-fill-error` → `--color-success`、`--color-warning`、`--color-error`；`-status-muted-accent` → `--color-info-muted`；`-on-tint-neutral` → `--color-neutral`；`-on-tint-overlay-*` 和 `-destructive-overlay-*` token → `--color-overlay-hover` 和 `--color-overlay-pressed`。`--astryx-theme-neutral-color-status-fill-accent` 保留其值，但已弃用。

  自定义主题会获得它们未设置的内容色和文本色角色：这些角色由主题的状态填充派生。若要保留某个组件之前的颜色，请设置对应的角色，例如将 `--color-icon-success` 设为旧的 `--color-success`。

#### 文档

- 包链接现在指向项目的 GitHub 主页 `meta/astryx`。

#### 贡献者

感谢为本版本做出贡献的所有人：

- @cixzhang
- @rubyycheung

---

# 0.7.4

#### 新功能

- 用经过审校的浅色和深色色阶替换 Stone 内部的共享色阶映射，同时保留公开的数字调色板查找以及 `hue`/`chroma` 元数据。浅色画布从 `#F3F3F5` 变为 `#F0F0F7`，深色弹出层从 `#25252A` 变为 `#302F36`，Green、Yellow、Teal 和 Cyan 使用重新设定的中间色（包括 Green 从 `#667D65` 到 `#528B49`）。七个色系的浅色 stop-90 表面、语法颜色和输入框状态边框发生变化；映射后的 success 和 warning 边框使用 `#609757` 和 `#A08C36`，语法属性使用 `#736419`，同时保持所需的对比度下限。现有应用可以通过扩展 `stoneTheme` 并用其之前的值为受影响的颜色、语法、阴影和组件 token 设置覆盖，来保留原来的外观。CLI 模板提供相同的可复现请求、回执和运行时尺寸引用。(#7669)

#### 贡献者

感谢为本版本做出贡献的所有人：

- @rubyycheung

---

# 0.7.3

#### 问题修复

- butter、stone 和 y2k 主题不再在禁用的 `ComplexSelector` 触发器上显示 secondary 悬停填充，无论该触发器是原生禁用还是暴露 `aria-disabled="true"`（这是所有禁用控件现在使用的可聚焦形式）。此前，该防护只识别原生禁用的触发器。这些主题的 `astryx theme eject` 副本也带有相同的防护。

#### 贡献者

感谢为本版本做出贡献的所有人：

- @cixzhang

---

# 0.7.2

---

# 0.7.1

#### 问题修复

- Stone、Y2K 和 Gothic 在自己的语法调色板中设置 `CodeBlock` 的 diff 行槽位，因此在这些主题上阅读 diff 的读者看到的添加行和删除行，其代码、行号和 `+`/`-` 字形都保持可读：在 Stone（浅色和深色）与 Y2K（浅色和深色）中，每个语法 token 在着色行上至少保持 4.5:1；在 Gothic 中，这些行采用与背景自身亮度相匹配的深绿色和深红色，因此每个 token 都保持其在纯背景上的对比度。变更行上的行号和字形使用各主题自己的绿色和红色。CLI 中这三个主题的内置副本（`astryx theme eject`）也带有相同的调色板。(#7428)
- `secondary` Selector、MultiSelector 或 ComplexSelector 现在会匹配主题的 secondary Button：在 butter、chocolate、gothic、stone 和 y2k 下，它采用该 Button 的边框、填充、文本颜色和悬停效果，而不是默认的无边框中性填充，因此混合了 secondary 按钮和选择器的工具栏看起来是一组统一的控件。禁用和只读触发器在悬停时保持静止填充，与禁用的 Button 一样；InputGroup 内的 Selector 或 MultiSelector 保持该组的中性填充和边缘。默认主题不变，选择器文档现在说明 `secondary` 会跟随主题的 secondary Button，用 CLI 添加的主题也获得相同的一致性。(#7548)

#### 贡献者

感谢为本版本做出贡献的所有人：

- @cixzhang

---

# 0.7.0

#### 破坏性变更

- 在窄于 `lg` 断点的触摸设备上（`(width < 1024px) and (pointer: coarse)`），以 14px 为基准的第一方主题现在将其字体基准下限设为 16px，并重新推导比例，使 Display 1 保持桌面尺寸：neutral 和 chocolate（base 14，ratio 1.2 → 1.1736）以及 butter 和 stone（base 14，ratio 1.25 → 1.2225）。在手机上，正文、标签和代码文本从 14px 升至 16px；辅助文本、各级标题以及 Display 2 和 3 增大 1–2px；只有 Display 1 保持桌面尺寸。桌面尺寸不变。gothic、matcha 和 y2k 已使用 16px 基准，无需规则。CLI 的主题模板带有相同规则，因此新脚手架生成的主题也会获得该规则。(#6699)
  扩展这四种主题之一并设置了自己的 `typography.scale` 或字号 token 的应用主题会继承此规则，而在触摸 + 窄屏上，该规则会替换这些值（base-18 的子主题会降为 16px 正文和 42px 的 Display 1）。为相同条件追加你自己的规则并填入所需的值；相同条件下后出现的规则优先。

  迁移：无需更改即可采用新的手机字号比例。若要在应用中保留之前的 14px 手机字号比例，请扩展主题并为相同条件追加一条较晚的规则：`defineTheme({name: 'app', extends: neutralTheme, adaptations: {rules: [{when: {pointer: 'coarse', width: {below: 'lg'}}, value: {typography: {scale: {base: 14, ratio: 1.2}}}}]}})`。对于 butter 和 stone，请使用 `ratio: 1.25`，并在该规则的 value 中设置 `tokens: {'--text-supporting-size': '12px'}`，因为这些主题将辅助文本固定为 12px，而不是仅靠比例得出的 11px。这无法通过 codemod 重写：应用是否需要该下限是一个产品选择。

#### 贡献者

感谢为本版本做出贡献的所有人：

- @imdreamrunner

---

# 0.6.8

---

# 0.6.7

#### 新功能

- 每个主题包现在在 `/built` 和 `/theme.css` 之侧导出 `/fonts.css`。当主题使用非系统字体时导入它。

#### 贡献者

感谢为本版本做出贡献的所有人：

- @josephfarina

---

# 0.6.6

#### 新功能

- 添加共享的 `upload` 图标，并将其用于 FileInput 的上传功能提示，而不是方向性的 `arrowUp`
  主题通过 `icons.upload` 单独绘制 `upload`，与 `arrowUp` 分开，因此排序箭头和所有其他 `arrowUp` 用法保持不变。每个内置主题和主题模板都以自己的图标风格绘制 `upload`。FileInput 在两种模式下都保持其图标大小、位置、颜色和可访问性；没有 `upload` 图形的主题会在那里显示默认的“上传到托盘”字形。

  在本版本中，完整的 `IconRegistry` 仍可省略 `upload`。下一个小版本会将其设为必需，因此请为任何标注为 `IconRegistry` 的注册表添加 `upload` 条目。

#### 贡献者

感谢为本版本做出贡献的所有人：

- @rubyycheung

---

# 0.6.5

---

# 0.6.4

#### 新功能

- 在每个第一方主题源码旁提供类型化的 `ThemeDoc` 描述符。(#6498)

#### 贡献者

感谢为本版本做出贡献的所有人：

- @josephfarina

---

# 0.6.3

---

# 0.6.2

---

# 0.6.1

#### 问题修复

- 在维护的主题和新示例中优先使用规范的组件目标名称，同时通过 0.7.0 移除窗口保留已弃用的运行时别名和已发布的裸 prop/state 选择器类。主题发现会标记已弃用的目标，主题构建会针对每个确切的规范替换发出警告，`astryx upgrade --apply` 提供向前兼容的裸选择器迁移。(#6126)

#### 贡献者

感谢为本版本做出贡献的所有人：

- @cixzhang

---

# 0.6.0

#### 破坏性变更

- 作为协调稳定版本的一部分，需要 `@astryxdesign/core@0.6.0`。请同时升级 Core 和此主题。

---

# 0.5.4

---

# 0.5.3

#### 问题修复

- 重命名内置语法主题标识符。(#5847)

#### 贡献者

感谢为本版本做出贡献的所有人：

- @rubyycheung

---

# 0.5.2

---

# 0.5.1

#### 问题修复

- Stone 主题：将 `--color-text-secondary` 移至规范的 T40/T70 配对，使普通次级文本在该主题的浅色和深色消费表面均满足 WCAG AA (#5505) (#5509)
- 主题包不再附带未使用的 CommonJS `icons.js` 产物。其根入口保留其公布的 CommonJS 和 ESM 输出，而 `/built` 使用的独立图标伴随文件仅以 `icons.mjs` 形式输出。(#5512)

#### 贡献者

感谢为本版本做出贡献的所有人：

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

- `/built` 入口现在可在 Node ESM 和外部化 SSR（Vite `--ssr`、Remix / React Router v7）下加载：它导入 `./icons.mjs`，而不是 Node 无法解析的无扩展名 `./icons`。

#### 贡献者

感谢为本版本做出贡献的所有人：

- @AKnassa

---

# 0.4.2

#### 问题修复

- `--radius-none` 不再覆盖为 `0.125rem`。`--radius-none` 和 `--radius-full` 被记录为始终固定（从不被主题缩放），与 `@astryxdesign/core` 自身的默认值一致——这些主题的 radius 组调整曾错误地连同 `--radius-none` 一起改动，这与 #4856 中为 `theme-neutral` 修复的 bug 相同。在这些主题下通过 `--radius-none` 选择不圆角的内容现在再次渲染为真正的 `0px` 圆角，而不是悄无声息的 2px。

#### 贡献者

感谢为本版本做出贡献的所有人：

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

#### 问题修复

- Stone 主题：深色模式 overlay/accent-muted token 缺少 alpha (#3624)
  `--color-accent-muted`、`--color-overlay-hover` 和 `--color-overlay-pressed` 的深色模式值是完全不透明的 `#f3f3f5`，而它们的浅色模式对应值则是半透明着色。由于这些 token 用于绘制绝对定位的悬停/按下覆盖层和 muted-accent 填充，不透明的深色值会覆盖下面的内容，而不是为其着色。现已将深色值改为带 alpha 后缀，遵循仓库中其他所有主题的约定：覆盖层与浅色对称（悬停 `#f3f3f50d` / 按下 `#f3f3f51a`，与 butter/chocolate/matcha/neutral/y2k 一致），accent-muted 在深色模式下强一档（`#f3f3f520`，与 chocolate/matcha/y2k 中的 `14`-浅色/`20`-深色模式一致）。修复 #3622。
- Stone 主题：恢复深色模式 overlay/border/shadow token 的 alpha (#3626)
  `--color-overlay`、`--color-border` 和 `--color-shadow` 的深色模式值是完全不透明的（`#28282a`、`#f3f3f5`、`#000000`），而它们的浅色模式对应值及其自身回归前的原始值都是半透明着色。不透明的覆盖层会用实心块遮住页面，而不是半透明遮罩；不透明的边框会画出实心近白线条，而不是细微的发丝线；不透明的阴影则没有衰减。已恢复 Stone 引入时的确切值（30e9d122f，#2020），这些值被后来的工具化处理（e2892c0ad，#2173）移除：`--color-overlay` 恢复为 `#28282acc`（80%），`--color-border` 恢复为 `#f3f3f51a`（T96 · 10%），`--color-shadow` 恢复为 `#0000004d`（30%）。修复 #3625。

#### 贡献者

感谢为本版本做出贡献的所有人：

- @let-sunny

---

# 0.1.3

---

# 0.1.2

---

# 0.1.1

#### 问题修复

- Stone 主题：为深色模式的 `--color-neutral` 添加约 10% 透明度
  深色模式值是完全不透明的 `#f3f3f5`，而其他所有主题都使用半透明（约 10% alpha）的中性着色。由于 `--color-neutral` 填充 secondary `Button` 变体，这在深色模式下渲染出实心近白表面配近白文本（无法阅读）。已将深色值改为 `#f3f3f51a`，以符合所有其他主题使用的约定。修复 #3119。

#### 贡献者

感谢为本版本做出贡献的所有人：

- @ernestt

---

# 0.1.0

---

# 0.0.15

#### 变更

- 跟踪 `@xds/core@0.0.15`（裸名称迁移 + 数据属性选择器界面）。
