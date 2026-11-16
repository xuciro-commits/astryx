// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for author-a-theme.doc.mjs.
export const docsZh = {
  "title": "创作主题",
  "description": "从这里开始：实验性的主题编辑器会替你创建和修改主题（`astryx experimental theme editor new <name> --like neutral`；参见主题文档），并对照组件实际读取的内容进行检查。手动方式：创建、自定义和构建主题：defineTheme、调色板生成、令牌覆盖、组件样式覆盖、自定义变体、响应式适配和生产构建。",
  "sections": [
    {
      "section": "Custom themes",
      "title": "自定义主题",
      "content": [
        {
          "type": "prose",
          "text": "把已安装的构建主题用作常规自定义的基础。将它导入源代码，并作为 `extends` 传给 `defineTheme({extends: importedTheme, ...})`。构建结果，然后添加本地 slug。只有在需要自己拥有并维护完整源码分支时才使用 eject。"
        },
        {
          "type": "prose",
          "text": "本地主题是 `src/themes/<slug>/` 下的一个文件夹，其中包含一个导出 `<name>Theme` 的 `<name>Theme.ts` 源文件，以及一个同名的 `<name>Theme.doc.mjs` 描述文件，供 `theme add` 读取。文件名主干必须是有效的导出名，因此带连字符的 slug 会去掉连字符：`brand-dark` 位于 `src/themes/brand-dark/brandDarkTheme.ts`，导出 `brandDarkTheme`，旁边是 `brandDarkTheme.doc.mjs`。描述文件的 `name` 是文件夹的 slug，并且必须声明其类型，否则 `theme add` 和 `theme list` 会拒绝它。{@command docs authoring theme-doc} 列出了所有字段。"
        },
        {
          "type": "code",
          "label": "src/themes/brand-dark/brandDarkTheme.doc.mjs"
        },
        {
          "type": "code",
          "label": "添加后即可使用，eject 后可派生分支"
        },
        {
          "type": "prose",
          "text": "想查看整个接口的带注释地图（每个 defineTheme 字段、令牌家族和组件覆盖语法，并附上打印其参考的 CLI 命令），请运行 `{@command theme template}`。它会把 `theme.template.ts` 写入你的项目，供阅读和复制（`{@command init --features theme}` 会在项目初始化时写入该文件）。"
        },
        {
          "type": "prose",
          "text": "要应用你创建的主题，参见 {@link generic:use-a-theme}。要从种子值生成颜色，参见下面的「调色板」一节。如果你打算改为 eject 一个包主题，请先参阅 {@link generic:use-a-theme} 中说明何时适合这样做的内容。"
        }
      ]
    },
    {
      "section": "Generate a palette",
      "title": "生成调色板",
      "content": [
        {
          "type": "prose",
          "text": "指定几个种子颜色，生成主题所需的全部色阶（浅色和深色）；{@link generic:generate-a-palette} 说明了调色板包含什么。"
        },
        {
          "type": "code",
          "label": "最小调色板配置（palette.config.json）"
        },
        {
          "type": "code",
          "label": "生成并预览"
        },
        {
          "type": "prose",
          "text": "该命令会写入一个 `.ts` 文件，为浅色和深色各导出 21 个色阶（色标 0–100），同时写入一个 `.receipt.json` 以便以后重新生成。让主题的令牌指向该调色板，然后运行 defineTheme（见下文）。"
        },
        {
          "type": "prose",
          "text": "完整的调色板配置字段和 CLI 标志，请运行 `{@command docs cli/commands/theme-palette-generate}`。关于把调色板连接到主题令牌的集成编写演练，请运行 `{@command docs authoring/building-blocks/themes/generate-a-palette}`。"
        }
      ]
    },
    {
      "section": "defineTheme",
      "title": "defineTheme",
      "content": [
        {
          "type": "prose",
          "text": "defineTheme 通过显式令牌覆盖和可选的比例配置创建主题。现有主题可以使用 `color` 把一个强调色种子扩展成中性色、表面色、文本色、边框色及相关值；它不是只修改强调色。在保留现有输出时，请保留该配置。对于新的完整调色板，请生成并审核一个已提交的调色板模块，然后导入它的 `palette` 导出，并从语义令牌引用稳定的色标。这样在重新生成已接受的调色板时，映射的角色仍能保持一致；生成本身不会重写主题。其他比例配置会根据参数生成排版、圆角和动效值。显式令牌覆盖始终逐令牌优先于比例生成的值。当现有 `color` 配置正在使用时，在 `tokens` 中覆盖 `--color-accent` 会重新指向 `--color-accent-muted`、`--color-text-accent` 和 `--color-icon-accent`，但 `--color-on-accent` 仍由 `color.accent` 种子烘焙生成。对于 `color.accent`，优先使用 `[light, dark]` 元组，而不是只覆盖 `--color-accent`。localTokens 接受任何有效的 CSS 自定义属性名；前缀并不建立所有权。"
        },
        {
          "type": "code",
          "label": "使用生成的调色板引用和非颜色比例配置的 defineTheme"
        },
        {
          "type": "table",
          "headers": [
            "配置",
            "生成",
            "参数"
          ],
          "rows": [
            [
              "color（现有主题）",
              "--color-accent, --color-background-*, --color-text-*, --color-border, etc.",
              "支持的宽泛比例：accent?（十六进制或 [light, dark] 元组）、neutralStyle?（warm|cool|neutral）、contrast?（standard|high）。新的完整调色板请使用 theme palette generate。"
            ],
            [
              "typography.scale",
              "--text-heading-*-size/weight/leading, --text-body-size/weight/leading",
              "base（px）、ratio"
            ],
            [
              "typography.body/heading/code",
              "--font-family-body, --font-family-heading, --font-family-code",
              "family、fallbacks?、url?、weight?"
            ],
            [
              "radius",
              "--radius-inner, --radius-element, --radius-container, --radius-page, --radius-chat",
              "base（px）、multiplier（0–2）"
            ],
            [
              "motion",
              "所有 --duration-* 令牌、--ease-entrance 和 --ease-move（tempo 也会为触摸弹簧计时）",
              "tempo?（0.75–1.5）、character?（crisp|standard|expressive）；和/或时长比例：fast（ms）、medium（ms）、ratio、slow?、easing?。比例对它设置的时长优先于 tempo，显式令牌则优先于两者。以下内容不受这些旋钮影响，始终固定：拖拽和动量、橡皮筋、键盘、按压开始/取消/闪烁、悬停意图、手势阈值、Spinner/Skeleton 循环、Reduce Motion 的 200 ms 上限。参见 {@link generic:motion}。"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "令牌值中的深色模式元组，请参见 {@link generic:use-a-theme} 的「深色模式」一节。"
        },
        {
          "type": "prose",
          "text": "只有一种颜色模式的主题会在旁边导出 `colorModes`：`export const colorModes = ['light'];`（或 `['dark']`）。`theme build` 会把这个导出复制到构建后的模块中，`theme add` 会读取它，让应用以该模式接入主题。同时具有两种模式的主题不会导出它。任何其他值都会被忽略且不产生警告，`--family` 构建也永远不会写入该导出。"
        }
      ]
    },
    {
      "section": "Extending a Theme",
      "title": "扩展主题",
      "content": [
        {
          "type": "prose",
          "text": "`extends` 让你从现有主题派生新主题，继承其令牌、组件覆盖、图标和字体。只需指定想改动的部分，其他内容都会从基础主题继承。"
        },
        {
          "type": "code",
          "label": "扩展 neutral 主题"
        },
        {
          "type": "table",
          "headers": [
            "字段",
            "合并行为"
          ],
          "rows": [
            [
              "tokens",
              "先复制基础令牌，再由子主题令牌覆盖。"
            ],
            [
              "components",
              "深度合并：子组件的规则会覆盖基础主题中匹配的键。"
            ],
            [
              "icons",
              "浅合并：子图标会覆盖基础主题中匹配的名称。"
            ],
            [
              "iconVariants",
              "替换而非合并：设置 iconVariants 的子主题会替换基础列表；省略它的子主题会继承该列表。"
            ],
            [
              "componentIcons",
              "按插槽合并：子条目会整体替换该插槽的基础条目；省略或值为 undefined 的条目会保留继承的条目。"
            ],
            [
              "indicators",
              "浅合并：子指示器会覆盖基础主题中匹配的名称。"
            ],
            [
              "onDark, onLight",
              "按表面深度合并：先使用基础主题解析后的表面，再应用子主题的覆盖。"
            ],
            [
              "motion",
              "逐字段处理：子主题的 `fast`、`medium` 和 `ratio` 会重新生成快、中两档时长令牌；未设置的 `slow` 和 `easing` 会保留基础主题的令牌，因此继承的慢速档保持基础主题的比例。子主题未设置的每个旋钮（`tempo`、`character`）都会保留基础主题的值。"
            ],
            [
              "typography, radius, color",
              "子配置会完全替换基础配置（这些是比例输入，不是叠加关系）。"
            ],
            [
              "adaptations",
              "宽度断点覆盖按固定名称合并。继承的有序规则保持其相对顺序；子规则会追加，并针对子主题根轴重新解析。"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "继承在定义主题时解析，因此扩展后的主题是扁平的：`{@command theme build}` 会输出一个自包含的样式表，包含子主题继承的一切，无需在旁边加载基础主题的 CSS。如果基础对象不是主题（最常见于导入失败），`defineTheme` 运行时会抛出错误，而不是生成一个静默地什么都没继承的主题。"
        },
        {
          "type": "prose",
          "text": "关于扩展时把调色板映射到令牌的集成专用指导，请参见 `{@command docs authoring/building-blocks/themes/define-the-theme}`。"
        }
      ]
    },
    {
      "section": "Component Style Overrides",
      "title": "组件样式覆盖",
      "content": [
        {
          "type": "prose",
          "text": "defineTheme 中的 `components` 字段使用语义化组件键和样式键，而不是原始 CSS 选择器。用 `base` 表示所有实例，用 `variant:value` 或 `stateName` 表示特定的属性/状态，并让主题管线选择底层选择器。对于原始外部 CSS 逃生舱，优先使用 {@link generic:styling-advanced} 中记载的 data 属性选择器接口。"
        },
        {
          "type": "code",
          "label": "使用标准 CSS 的组件覆盖"
        },
        {
          "type": "prose",
          "text": "运行 `{@command theme targets}` 查看系统中所有可主题化的键（`{@command theme targets <Name>}` 可限定范围，`--json` 可据此检查主题），运行 `{@command component <Name>}` 查看单个组件的主题化目标、公开 CSS 变量以及支持哪些标准 CSS 属性。"
        },
        {
          "type": "list",
          "items": [
            "写标准 CSS 属性（borderRadius、padding）；管线会把它们展开为内部变量。",
            "当不存在等价的标准属性时，直接设置公开 CSS 变量。"
          ]
        },
        {
          "type": "list",
          "items": [
            "直接设置私有 CSS 变量（以 --_ 为前缀）。请改用标准 CSS 属性，否则 `{@command theme build}` 会报错。",
            "设置组件未定义的公开 CSS 变量。它会编译成永远不会生效的 CSS，而且构建不会警告。请从 `{@command component <Name>}` 获取名称。"
          ]
        }
      ]
    },
    {
      "section": "Custom Variants",
      "title": "自定义变体",
      "content": [
        {
          "type": "prose",
          "text": "主题可以为任何组件添加新的属性值。任何 `prop:value` 键，只要值不是内置值，就会被视为新变体。使用 `{@command theme build}` 生成 TypeScript 类型增强，以获得类型安全。"
        },
        {
          "type": "code",
          "label": "添加自定义变体"
        },
        {
          "type": "code",
          "label": "使用自定义变体"
        },
        {
          "type": "prose",
          "text": "自定义变体只有在定义它们的主题处于活动状态时才有效。组件的变体映射会通过模块增强来扩展，无需修改组件源代码。"
        }
      ]
    },
    {
      "section": "Theme Adaptations",
      "title": "主题适配",
      "content": [
        {
          "type": "prose",
          "text": "使用 `adaptations` 在视口宽度、主指针精度、对比度偏好或动效偏好条件下，按需应用令牌、主题本地令牌和组件变更。同一个 `when` 中的条件为 AND 关系。规则是普通的有序对象，后匹配的写入优先。"
        },
        {
          "type": "code",
          "label": "宽度和指针适配"
        },
        {
          "type": "table",
          "headers": [
            "条件",
            "值"
          ],
          "rows": [
            [
              "width.from / width.below",
              "sm | md | lg | xl | 2xl"
            ],
            [
              "pointer",
              "coarse | fine"
            ],
            [
              "contrast",
              "more | less | no-preference"
            ],
            [
              "motion",
              "reduce | no-preference"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "`widthBreakpoints` 是固定的命名起始点。默认值为 640 / 768 / 1024 / 1280 / 1536 CSS 像素。`from` 包含该点；`below` 不包含。仅配置断点不会输出任何 CSS。"
        }
      ]
    },
    {
      "section": "Adaptation order and validation",
      "title": "适配顺序与校验",
      "content": [
        {
          "type": "prose",
          "text": "优先级遵循规则顺序。先应用根主题值，然后按声明顺序应用每条匹配的规则。后面的规则可以有意恢复某个根值。`onDark` 和 `onLight` 的媒体表面覆盖在适配之后应用，并在同一叶子节点上胜出。"
        },
        {
          "type": "prose",
          "text": "`extends` 保留基础规则的顺序，并追加子规则。继承的条件使用子主题的有效断点映射。空的子规则是空操作，不是删除操作符。"
        },
        {
          "type": "prose",
          "text": "只有当精确名称已由根 `localTokens` 或某个已注册的基础主题纳入时，规则才能替换主题本地令牌。规则中的组件写入与根 `components` 完全按相同方式校验：相同的目标、轴和值域。唯一的额外限制是，规则不能成为自定义值被纳入的唯一位置：某个值仅因主题纳入它而有效时，会生成无条件的类型增强，因此请先在根主题上声明它，再让规则重新设置其样式。内置值无需根声明。当多条规则可能同时匹配时，它们有序的可移植令牌和本地令牌写入会作为一个有效图来校验；任何可达的循环都会在输出 CSS 之前导致失败。"
        },
        {
          "type": "prose",
          "text": "适配会编译为 CSS 媒体查询，不需要 resize 监听器，也不会重新渲染样式。运行时和 `{@command theme build}` 使用同一个编译器，但在 SSR 应用中，只有构建后的主题能在首次绘制时就位。"
        }
      ]
    },
    {
      "section": "Build a theme",
      "title": "构建主题",
      "content": [
        {
          "type": "prose",
          "text": "`{@command theme build}` 会把 defineTheme 文件编译成可用于生产的产物。推荐用于 SSR 应用（Next.js、Remix），这类应用要求样式在首次绘制时就位。"
        },
        {
          "type": "code",
          "label": "构建主题"
        },
        {
          "type": "table",
          "headers": [
            "文件",
            "描述"
          ],
          "rows": [
            [
              "ocean.css",
              "预编译的 CSS，包含令牌覆盖、组件覆盖，以及 @scope 规则中的正文元素样式"
            ],
            [
              "ocean.js",
              "导出主题对象的 ES 模块，带有 `__built: true` 和预先解析的令牌值。"
            ],
            [
              "ocean.d.ts",
              "主题和图标注册表导出的 TypeScript 声明"
            ],
            [
              "ocean.variants.d.ts",
              "（可选）自定义组件属性值的模块增强"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "`__built: true` 标志告诉 Theme 跳过运行时 `<style>` 注入；由 CSS 文件负责。请在加载该模块的地方加载生成的 CSS。"
        },
        {
          "type": "code",
          "label": "使用自定义构建主题"
        },
        {
          "type": "prose",
          "text": "升级 Astryx 后，请为每个自定义预构建主题重新运行 `{@command theme build}`。将重新生成的文件一起部署。运行时会有意信任 `__built: true`，不会修复旧构建留下的过时 CSS。当主题声明了它未加载的字体家族时，构建也会给出警告。完整步骤见 {@link generic:font-setup}。"
        },
        {
          "type": "prose",
          "text": "关于运行时与构建版本的取舍，请参见 {@link generic:use-a-theme} 的「运行时与构建版本」一节。"
        }
      ]
    },
    {
      "section": "Built themes with an icon registry",
      "title": "带图标注册表的构建主题",
      "content": [
        {
          "type": "prose",
          "text": "当 `theme build` 检测到主题 `icons:` 字段使用的命名导入时，会输出一个图标导入。它不会编译那个注册表模块。请把注册表移到单独的模块，并使用命名导入。"
        },
        {
          "type": "code",
          "label": "编译图标注册表附属模块"
        },
        {
          "type": "prose",
          "text": "在上面的示例中，生成的主题会从 `dist` 导入 `./icons.mjs`。如果跳过第二条命令，`theme build` 仍可能成功，但由于缺少 `dist/icons.mjs`，加载或打包生成的模块会失败。`--icons-specifier` 只会改变输出的导入；它不会创建或验证目标文件。请让说明符匹配一个能从生成的 JS 文件解析到的模块。"
        },
        {
          "type": "prose",
          "text": "不使用 `--icons-specifier` 时，检测到的源导入说明符会原样输出。在没有 `--out` 的默认流程中，打包器可以把无扩展名的 `./icons` 解析到相邻的 `icons.tsx` 源文件，但 Node ESM 不会执行这种查找，并会报告 `ERR_MODULE_NOT_FOUND`。用 `--out` 移动输出位置也会改变相对导入的解析起点。"
        },
        {
          "type": "prose",
          "text": "请将 `react` 和图标库保持为外部依赖，以免注册表打包它们自己的这些依赖副本。"
        },
        {
          "type": "prose",
          "text": "注册表条目可以是 `{size, variant}` 的函数。构建后的主题会保留该函数，因此 `Icon` 会像运行时主题一样，按渲染时的尺寸和变体向它询问，包括从构建主题或包主题继承的条目。构建主题的 `icons` 字段及其模块重新导出的注册表是 React 节点，其中每个函数都按尺寸 `md` 读取。直接写在主题文件中的函数无法被携带，因此构建会失败；请把它移到注册表模块中。"
        },
        {
          "type": "prose",
          "text": "列出 `iconVariants` 的主题还会把 `IconVariantMap` 增强写入 `<theme>.variants.d.ts`，因此在加载该主题类型的任何地方，`Icon` 的 `variant` 都接受这些名称。其声明也携带该列表，因此扩展该构建主题的主题会按其列表为图标条目的 `variant` 提供类型。"
        },
        {
          "type": "prose",
          "text": "构建后的主题会保留其 `componentIcons`。名称、`null` 值和静态请求会被写入模块。插槽函数仍然是函数：模块会从主题源导入它的那个模块中导入它，因此组件插槽在构建主题和运行时主题中的解析结果相同。构建主题的 `componentIcons` 字段会像运行时主题一样省略插槽函数。定义在主题文件中的插槽函数会导致构建失败：请把它移到单独的模块并导入。在 `--family` 输出中，成员通过对其整个 `componentIcons` 映射的命名导入来提供自己的插槽函数。模块会按主题源中的写法保留每个插槽导入，`--icons-specifier` 不会改变它，因此当 `--out` 指向另一个目录时，要让某个模块从输出目录响应该说明符，就像图标注册表那样。"
        }
      ]
    },
    {
      "section": "Building a Theme Family",
      "title": "构建主题家族",
      "content": [
        {
          "type": "prose",
          "text": "当应用在一个基础主题及其选定的后代主题之间切换时，使用 family 模式。构建会在根源文件旁写入一个包含所有成员的可键控 CSS 文件，以及一个带键的 JavaScript 模块和一个声明文件。"
        },
        {
          "type": "code",
          "label": "构建一个主题家族"
        },
        {
          "type": "prose",
          "text": "家族样式表会预先下载每个选定的成员，使首次绘制完整。切换成员只改变主题标识；不会添加、移除或重新排序样式表。"
        }
      ]
    },
    {
      "section": "Token Utilities",
      "title": "令牌工具",
      "content": [
        {
          "type": "prose",
          "text": "当非 StyleX 样式库需要 CSS 变量引用时，使用 `tokenVar()`；当 JavaScript 需要在没有 React 上下文的情况下获取特定主题和模式的令牌值时，使用 `resolveThemeTokens()`。用 `defineTheme()` 创建的主题会按名称注册；对于需要基于名称进行 SSR 查找的预构建主题或对象字面量主题，请调用 `registerTheme(theme)`。"
        },
        {
          "type": "code",
          "label": "供样式库配置使用的 CSS 变量引用"
        },
        {
          "type": "code",
          "label": "无需 Hook 解析令牌值"
        },
        {
          "type": "prose",
          "text": "`@astryxdesign/core/theme/tokens` 子路径对服务端安全，不依赖 React。主入口 `@astryxdesign/core/theme` 也会重新导出这些辅助函数，供已经导入主题 API 的客户端代码使用。"
        },
        {
          "type": "prose",
          "text": "样式库互操作模式请参见 {@link namespace:styling-libraries}。"
        }
      ]
    },
    {
      "section": "useTheme Hook",
      "title": "useTheme Hook",
      "content": [
        {
          "type": "prose",
          "text": "`useTheme()` 从 React 上下文读取最近的 Theme 和有效颜色模式。对于支持 CSS 的 SVG 和 DOM 值，优先使用 `dataVars`。在 canvas、图表、地图、第三方配置对象，或需要具体 JavaScript 颜色而不是 `var(...)` 引用的 SVG API 中使用这个 Hook。"
        },
        {
          "type": "code",
          "label": "在 React 中访问已解析的令牌值"
        },
        {
          "type": "prose",
          "text": "常规样式优先使用 CSS 变量。Provider 的设置见 {@link generic:use-a-theme}，完整令牌参考见 {@link namespace:tokens}。"
        }
      ]
    }
  ]
};
