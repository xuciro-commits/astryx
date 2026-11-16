// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for icon-sets.doc.mjs.
export const docsZh = {
  "title": "图标集",
  "description": "发布图标集：把每个图标注册到一个图标定义上，让应用按含义查找图标，并让模板使用你的图标。",
  "sections": [
    {
      "section": "Experimental",
      "title": "实验性",
      "content": [
        {
          "type": "prose",
          "text": "图标集是实验性功能：`astryx experimental icon` 命令、astryx.config 中的 `experimental.iconSet` 键、集成清单中的 `experimental.iconSets` 键、数据文件、图标定义，以及它们全部的输出和 JSON，都可能在任何补丁版本中变更或移除，且不提供弃用期。未设置 `experimental.iconSet` 的项目不会看到任何稳定命令的变化，除了以下几点：帮助信息和 `astryx manifest` 中标记为 `experimental` 的组（其命令，以及它的 `responseTypes` 和 `jsonSupported` 条目）；CLI 参考列表中标记为实验性的条目；以及搜索 \"experimental\" 时，也会找到字段参考中稳定的 `stability` 字段。模板、discover 和 doctor 的应答与未安装图标集时相同。安装了一个包含图标集的包但未启用时，旧版 CLI 针对清单键 `experimental` 给出的警告（出现在 `astryx doctor` 和 `astryx doctor integration validate <package>` 中，以及其他命令打印到 stderr 的一行提示）不再出现。`astryx search` 永远不会返回图标或这些文档；要按含义查找图标，请使用 `astryx experimental icon <words>`。"
        }
      ]
    },
    {
      "section": "How it works",
      "title": "工作原理",
      "content": [
        {
          "type": "prose",
          "text": "Astryx 维护一份图标定义列表：每个含义一个文件，例如 `close` 或 `delete`（`astryx docs cli/experimental/icon-definitions`）。图标集在其数据文件的 `map` 中注册自己用哪个图标绘制每个定义；一个图标可以绘制多个定义（`file` 和 `document` 都可以由你的 `document` 图标来绘制）。模板会说明其每个图标绘制哪个定义，因此使用你的图标集的项目，在你映射的每个定义上都会得到你的图标。每个图标集都会映射内置定义，也就是 Core 自己渲染的名称。"
        },
        {
          "type": "prose",
          "text": "CLI 不认识任何图标库。由你或你的代理从所要封装的图标库中挑选每个图标；下面的命令会验证选择、写入文件并检查图标集。"
        }
      ]
    },
    {
      "section": "Add an icon set",
      "title": "添加图标集",
      "content": [
        null,
        {
          "type": "prose",
          "text": "`outline.doc.mjs` 是描述符：包含名称、显示名称和描述（`--display-name`、`--description`），以及 `license`，即图形素材的 SPDX 许可证（初始值为你的包自身的许可证）。`outline.icons.json` 初始没有图标，`map` 为空；其 `module` 是你的包名。重命名包之后，下一条写入数据文件的命令（对现有集合运行 `new-set`，无论是否带 `--from`，或运行 `add`、`map`、`new-definition --icon`）会写入新名称，并保留子路径（`@acme/old-icons/outline` 变成 `@acme/new-icons/outline`），其回执会说明这一点。`outline.generated.js` 是该集合的生成模块，还有其声明文件 `outline.generated.d.ts`：CLI 会写入这两个文件，每个图标和主题映射都是它的导出。所有字段参见 {@link schema:icon-set-doc} 和 {@link schema:icon-set-data}。"
        },
        {
          "type": "prose",
          "text": "该集合的图标会按名称从你的包导入，因此你的包入口必须重新导出生成模块。该命令只写入集合自身的文件：你的入口、`exports`、`main`、`types`、`files`、对等依赖和脚本都由你管理，回执会以可复制的文本形式列出每一处需要做的改动。对于包内的入口文件（以及 package.json 指定的声明文件），这一行是 `export * from './icon-sets/outline/outline.generated.js';`，相对于该文件；对于没有入口的包，需要创建包含该行的 `index.js` 和 `index.d.ts`，并在 package.json 的 `main`、`types` 和 `exports` 中指向它们；对于已构建或 CommonJS 入口，需要把该行添加到其构建来源中。在你完成之前，`integration check` 会一直指出同样的改动，回执还会列出需要添加的对等依赖和 `typecheck` 脚本。`integration check --strict` 会用你的包的 TypeScript 对集合的文档文件做类型检查；缺少 TypeScript 时回执会说明（`npm install -D typescript@6`）。"
        }
      ]
    },
    {
      "section": "Add icons one at a time",
      "title": "逐个添加图标",
      "content": [
        {
          "type": "prose",
          "text": "从图标库中选择一个图标，并询问哪些定义适合它。此时还不会写入任何内容。要读取集合已有的每个图标（每个图标一行，包含其关键词和它绘制的定义），请运行 `astryx experimental icon --set <set> --all-icons`；`astryx experimental icon <set>/<id>` 读取一个图标，若 id 不存在则会说明："
        },
        null,
        {
          "type": "prose",
          "text": "每一行是一个 Astryx 定义（或你的集合声明的定义），以及为该定义添加图标的确切命令。运行其中一条："
        },
        null,
        {
          "type": "prose",
          "text": "CLI 会读取图标库的导出而不运行它们，并拒绝模块未导出的名称，同时会建议相近的名称。它会将该图标添加为 `BinIcon`（id 为 `bin`，关键词来自其名称），把 `export {Bin as BinIcon} from '@acme/glyph-library';` 写入集合的生成模块，并设置 `map.delete = \"bin\"`。再次运行不会产生任何变化。不要把定义的关键词复制到图标上：`astryx experimental icon` 会按图标自身的关键词，以及它映射到的每个定义的名称和关键词来匹配图标。"
        },
        {
          "type": "prose",
          "text": "如果没有合适的 Astryx 定义，可以在同一条命令中添加你自己的定义。这不需要提交拉取请求："
        },
        null,
        {
          "type": "prose",
          "text": "`experimental icon map <definition> <icon>` 会把一个定义指向集合已有的图标（定义可以用 camelCase 名称 `eyeSlash`，或定义列表显示的 kebab id `eye-slash` 指定；图标可以用其 id、任意大小写的导出名称，或其图标库导出它的其他名称（例如 `trash-2`）指定，绝不能只用其 id 中的一个词），`experimental icon map --pairs close=x-mark,search=magnifying-glass` 可以一次写入多个条目（一起校验，全部成功或全部失败；映射中已有的条目会被替换，回执会显示原来的值），`--remove` 会删除一个条目。`experimental icon new-definition <name> --description ... --words ... --icon <id>` 为你已有的图标添加自己的定义。`experimental icon --definitions` 列出每个 Astryx 定义（无论是否内置）及其关键词（脚本可使用 `--json`）。"
        }
      ]
    },
    {
      "section": "Or wrap a whole library",
      "title": "或者封装整个图标库",
      "content": [
        null,
        {
          "type": "prose",
          "text": "图标库导出的每个组件都会成为一个图标（同一组件的别名只记录一次），命名为 `<Name>Icon`，id 取自其名称（`Squares2X2Icon` 对应 `squares-2x2`：表示尺寸的词保持为一个词）。导出名称不能以数字开头，因此如果去掉图标库前缀后某个图标的 id 会以数字开头，该图标就保留前缀（`fa0` 的 id 是 `fa-0`，导出为 `Fa0Icon`），你用 `--id` 指定的 id 必须以字母开头。只有当一个定义的名称等于某个图标的 id 时，`map` 才会被填充（`delete` → 图标 `delete`），回执会在 \"Mapped by name\" 下列出这些条目：图标库可能在同一名称下绘制另一种含义（某个图标库的 `delete` 其实是退格键），所以要逐一核对。如果某个图标的 id 只是某个定义关键词之一（`delete` 对应 `trash`），它在这个图标库中可能另有含义，因此回执会在 \"Suggestions\" 下列出它，并给出每个定义对应的 `experimental icon map <definition> <icon>` 命令，且不会为它写入任何内容：先确认含义，再运行合适的命令。图标库发布新版本后再次运行，可刷新该库提供的图标；图标仍然存在的 `map` 条目会保留，回执会列出图标库移除的图标、被 `--exclude` 排除的图标，以及它们各自带走的 `map` 条目。你从自己的文件或另一个图标库添加的图标会保持原样。你从同一个包逐个文件添加的图标（`--from <package>/dist/XIcon`），在从包根刷新且包根导出同一图标时会迁移到根导入；每个图标在该次及之后每次刷新时都会保留其 id、导出、`map` 条目、变体和关键词，回执会在 `moved` 下列出它。如果某个图标库图标的 id 或名称已被某个迁移过的图标占用，该图标库图标会被略过。如果集合中另一个图标已经读取同一个根导出，该图标会保留在自己的文件上，回执会说明原因。你已有的图标通过它重新导出的图标库导出来识别，因此即使新版 CLI 对它的 id 拼写不同，或你的 `--exclude` 让新 id 去掉了图标库前缀，它仍会原样保留导出名称、`map` 条目、变体和关键词；回执会在 `renamed` 下列出每个发生变化的 id。你选择的、并非图标库名称某种拼写的 id（例如 `XIcon` 的 `dismiss`）会保留。带 `--dry-run` 的刷新不会写入任何内容，并会再次打印 \"Mapped by name\" 和 \"Suggestions\" 列表；在刷新时使用 `--display-name` 和 `--description` 会重写描述符。用 `add --variant … --all` 添加的变体也会保留；再次运行该 `add` 可以获取该版本新增的图标。`experimental icon --list` 会显示该集合映射了多少个定义。"
        },
        {
          "type": "prose",
          "text": "如果指定的是包或包子路径，它还会把已安装的图标库及其版本记录为数据文件的 `source`，这样当你的依赖切换到其他版本时 `integration check` 会发出警告；它会把图标库的 LICENSE（和 NOTICE）文件复制到集合目录；并把描述符的 `license` 设为图标库的许可证。通过不带 `--from` 创建的集合，在首次刷新记录其来源时会得到相同结果，除非你已修改过 `license`：你设置的 `license` 会保留（回执会注明图标库的许可证），之后每次刷新也会保留。你的 package.json 中的 `license` 永远不会被更改。当图形素材的许可证与图标库包的许可证不同时，请编辑 `license`。当图标库没有可复制的许可证文件时，回执会在 `licenseNoticeMissing` 下及其备注中说明，CLI 不会写入任何内容：请向集合目录（`icon-sets/<set>/NOTICE`）添加一个 `NOTICE` 文件，写明图标库、其版本和许可证。`integration check` 接受名为 `LICENSE`、`LICENCE`、`NOTICE` 或 `COPYING` 的文件（大小写不限，可带可选后缀，如 `NOTICE.md` 或 `LICENSE-MIT`），位于集合目录或包根目录；若没有这样的文件，它会报告 `icon_license_notice_missing`。"
        },
        {
          "type": "prose",
          "text": "每个样式一个模块的图标库会提供变体。在创建集合时声明这些变体，然后一次为所有图标添加某个变体。按绘制效果为每种外观命名，例如 `outline` 或 `filled`，而不是沿用图标库对它的叫法（Heroicons 把它的填充外观称为 `solid`）：应用会按该名称给所有图标选择同一种外观，该名称会作用到其列表中每个使用它的集合（参见 \"让所有图标采用同一种外观\"）。"
        },
        null,
        {
          "type": "prose",
          "text": "为小尺寸重新绘制图形素材的图标库（Heroicons 的 20px mini 和 16px micro）会把每种尺寸作为独立包中的独立集合发布（它们的导出名称与 24px 的对应），而不是作为变体：变体的尺寸由 CSS 决定。`--variants` 列出变体；`--default-variant` 指定每个图标自身导出所绘制的外观（省略时，使用为外观命名的图标库所绘制的外观；否则使用集合当前的默认值；若集合没有图标，则使用第一个变体；有图标的集合只能通过 `--from` 更改它，且仅限为外观命名的图标库）。`--all` 会为 `--from` 的某个导出具有其 id 的每个图标添加该变体（solid 模块中的 `TrashIcon` 会变成 `TrashFilledIcon`，即 `trash` 的 filled 变体），回执会列出该模块没有导出对应的图标。图标库可能把每种外观作为独立的包发布（Font Awesome 的 solid 和 regular 包）：此时 `--from` 可以指定另一个包，图标会从那里同名导出获得该变体；回执会列出该包没有导出对应的图标。再次运行不会产生任何变化。"
        },
        {
          "type": "prose",
          "text": "图标为数据（对象或 SVG 字符串）的图标库没有组件可供查找：请编写一个适配器（参见“图标库形态”），并传入它，例如 `experimental icon new-set fa --from @acme/glyph-data --adapter ./src/adapt.js#adapt`；随后每个数据导出都会通过该适配器成为一个图标。如果每个图标导出都共享一个前缀词，例如 `featherEye` 和 `featherSun` 中的 `feather`，则 id 和导出名称会省略它：`featherEye` 的 id 变为 `eye`，导出为 `EyeIcon`。前缀只会在类图标导出中识别：SCREAMING_CASE 常量（`README`、`VERSION`）、数字和布尔导出，以及（在组件或图标对象旁边出现的）普通字符串都不会被视为图标。名为 `…Provider` 或 `…Context` 的组件也永远不是图标，包对象同样不是：包对象的键都是模块的其他导出，例如 `faXmark` 旁边的 `fas`。用 `--exclude meta,version` 排除任何其他不是图标的导出：数据文件会把列表保存在 `exclude` 中，因此刷新时也会排除它们。当图标库以多个名称导出一个图标时（`Trash2` 和 `Trash`），该图标只记录一次，其他名称会成为关键词，因此 `experimental icon trash-2` 能查到它，`experimental icon map delete trash-2` 能映射它。`experimental icon add` 以相同方式识别前缀，并复用某个导出已有的图标，因此其命令无需 `--id`。"
        }
      ]
    },
    {
      "section": "How icons are exported",
      "title": "图标如何导出",
      "content": [
        {
          "type": "prose",
          "text": "每个图标都是你的包公共入口的命名导出，因此应用、模板和主题映射都从同一处导入组件："
        },
        {
          "type": "list",
          "items": [
            "数据文件的 `module` 是你的包名或其 package.json `exports` 的某个子路径，绝不能是文件路径。否则 `integration check` 会失败。",
            "变体是集合提供的一种具名外观（例如 outline 或 solid）；尺寸由 CSS 决定。在数据文件的 `variants` 中列出名称，并在 `default` 中列出每个图标自身导出所绘制的外观。",
            "每个导出命名为 `<Name>Icon`，变体为 `<Name><Variant>Icon`，例如 `TrashSolidIcon`。`experimental icon add` 会按这种方式命名；`integration check` 会对其他名称发出警告。",
            "每个导出都是一个 React 组件：函数、类、`forwardRef` 或 `memo`，或适配器返回的内容。`integration check` 遇到普通对象或字符串会失败。",
            "它接受 SVG 属性（`className`、`style`、`aria-*`、`width`、`height`），使用 `currentColor` 绘制，并填满其盒子（`1em` 或 `100%`），因此 `<Icon icon={TrashIcon} size=\"sm\" />` 会像内置图标一样设置其尺寸和颜色。CLI 无法静态检查这一点；下面的测试可以。"
          ]
        },
        {
          "type": "prose",
          "text": "`experimental icon add` 会写入集合的生成模块（数据文件中的 `generated`）及其声明文件；声明文件会重新导出每个组件自身的类型，并把每个经适配器转换的图标标注为 `ComponentType<SVGProps<SVGSVGElement>>`。把这一行添加到你的包入口及其类型中；`experimental icon new-set` 会在回执中指明确切的代码行和文件（参见“添加图标集”）："
        },
        null,
        {
          "type": "prose",
          "text": "以下是一个可复制使用的可选渲染测试。把它保存在你的包目录中并在那里运行，因为它会通过包的 `exports` 按名称导入你的包，并请先安装 `react-dom`（`npm install -D react-dom`）。图标库可能会在你的类名之外添加自己的类名，因此测试会检查类名列表。即使某个组件写入了自己的 `width` 和 `height` 属性（例如根据 `size` 属性写入 24），只要它把 `style` 传递给其 svg，仍然会填满盒子：`Icon` 组件和 `themeIcons` 会用 CSS 设置 svg 尺寸，从而覆盖尺寸属性。测试也会检查这一点。"
        },
        null
      ]
    },
    {
      "section": "Library shapes",
      "title": "图标库形态",
      "content": [
        {
          "type": "prose",
          "text": "`--from` 可以是任意导入说明符：包、包子路径，或包内的 `./` 路径。使用与你的图标库匹配的那一行："
        },
        {
          "type": "table",
          "headers": [
            "图标库提供的形式",
            "命令"
          ],
          "rows": [
            [
              "单个模块中的组件",
              "`experimental icon add Bin --from @acme/glyph-library --definition delete`"
            ],
            [
              "每种样式一个子路径",
              "一次为所有图标运行 `experimental icon add --variant solid --from @acme/glyph-library/solid --all`，或为单个图标运行 `experimental icon add Bin --from @acme/glyph-library/solid --id bin --variant solid`（集合必须声明该变体：`new-set --variants`）"
            ],
            [
              "每种外观体现在导出名称中（`XOutline24WGHT500Icon`、`XFilled24WGHT500Icon`）",
              "`experimental icon new-set meta --from @acme/vector-icons` 会把每个字形按 `x`（`XIcon`）封装一次，采用 `--default-variant` 指定的外观或图标库的常用默认外观（outline，中间字重）。要使用另一种外观：先运行 `experimental icon new-set meta --variants outline,filled` 就地声明它，然后运行 `experimental icon add --variant filled --from @acme/vector-icons --all`"
            ],
            [
              "每个图标一个文件，默认导出",
              "`experimental icon add Rocket --from @acme/glyph-library/rocket --default --definition rocket`"
            ],
            [
              "图标数据对象",
              "声明 `adapter`，然后运行 `experimental icon add Rocket --from @acme/glyph-data --definition rocket`"
            ],
            [
              "SVG 字符串或 URL",
              "声明一个能渲染它们的 `adapter`，然后如上所述运行 `experimental icon add`"
            ],
            [
              "你自己的组件文件",
              "`experimental icon add Rocket --from ./src/icons/rocket.js --definition rocket`，其他外观使用 `--id rocket --variant solid`。该文件导出的组件按原样命名（不会去掉图标库前缀），旁边有声明文件（`rocket.d.ts`）或用 TypeScript 编写，因为集合的类型会重新导出其自身类型；当 package.json 列出 `files` 但没有覆盖它时，回执会给出发布其所在文件夹的 `files` 数组。"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "不是组件的导出会经过你的适配器：包中的一个函数把它转换成组件。以 `--adapter ./src/adapt.js#adapt` 把它传给 `experimental icon new-set`，这会在数据文件中将其声明为 `\"adapter\": {\"module\": \"./src/adapt.js\", \"export\": \"adapt\"}`；配合 `--from`，每个数据导出都会通过它成为图标，`experimental icon add` 会写入 `export const RocketIcon = adaptIcon(RocketIconSource);`："
        },
        null
      ]
    },
    {
      "section": "The theme map",
      "title": "主题映射",
      "content": [
        {
          "type": "prose",
          "text": "生成模块还会导出 `themeIcons`：`map` 中每个内置定义对应一个条目，每个条目都是你自己的图标元素，对辅助技术隐藏，并通过其属性和 CSS（其 `style`）设为 `1em`，因此即使你的组件写入自己的尺寸属性，它也会填满主题的图标盒子。CLI 会在每次 `experimental icon add` 和 `experimental icon map` 时重写它，因此你永远不需要手写；`integration check` 会验证它与 `map` 一致。主题可以在一行中使用它："
        },
        null,
        {
          "type": "prose",
          "text": "`themeIcons` 绘制你的默认外观。对于你的某个图标所绘制的其他每种变体，模块还会导出一个以该变体命名的映射 `themeIcons<Variant>`（`filled` 对应 `themeIconsFilled`）：键相同，每个键对应你的图标在该变体下的导出；若没有该变体，则使用其自身导出。如果应用的图标采用那种外观，就改为设置 `icons: themeIconsFilled`。`integration check` 也会核对这些映射与 `map` 是否一致；当旧模块缺少某个映射时，它会给出写入该映射的 `experimental icon add --variant <variant> --from <module> --all` 命令。"
        }
      ]
    },
    {
      "section": "Check the set",
      "title": "检查图标集",
      "content": [
        {
          "type": "prose",
          "text": "`astryx integration check` 会读取图标集而不运行你的图标。未映射的内置定义会报错，错误中会给出该定义的描述和关键词，以及修复它的 `experimental icon map <definition> <icon id>` 命令，这样你或你的代理就可以选择图标。只有当搜索能找到图标时，它才会给出对集合的搜索命令（`experimental icon <word> --set <set>`），并建议一个图标：即 `experimental icon new-set` 为该定义给出的第一个建议。它从不匹配词的一部分，也从不写入建议。其图标集错误码如下："
        },
        {
          "type": "list",
          "items": [
            "`invalid_icon_set`（错误）：描述符、数据文件或某个定义文件无效，例如重复的 `id`、没有关键词的图标，或 `map` 键既不是 Astryx 定义，也不在 `definitions` 文件夹中。该集合会被撤下：应用看不到它。",
            "`icon_builtin_definition_missing`（错误）：某个内置定义不在 `map` 中。",
            "`icon_definition_unused`（警告）：你声明的某个定义不在 `map` 中。",
            "`icon_definition_shadowed`（警告）：你声明的某个定义现在已存在于 Astryx 中；请映射到 Astryx 的定义并移除你自己的定义。",
            "`icon_module_not_public`（错误）、`icon_export_name`（警告）、`icon_not_component`（错误）：上述导出约定。",
            "`icon_export_missing`（错误）：某个导出、生成模块或适配器不存在。",
            "`icon_module_invalid`（错误）：集合的模块、它重新导出的某个文件或生成模块无法解析；只报告一次，而不是为每个图标报告缺失导出。",
            "`icon_generated_types_mismatch`（错误）：生成模块的声明文件缺失或与其不一致。",
            "`icon_theme_map_mismatch`（错误）：主题映射与 `map` 的内置条目不一致。",
            "`icon_source_version_drift` 和 `icon_license_notice_missing`（警告）：数据中指定的图标库版本与包所依赖的版本不同，或带有上游来源的集合没有附带许可证声明。"
          ]
        },
        {
          "type": "prose",
          "text": "你的集合未映射的其他 Astryx 定义不算问题：图标库不必绘制每个定义。它们会列在 \"Unmapped icon definitions (optional)\" 下，并在 JSON 中作为验证结果的 `iconSets` 列出：对每个集合，列出 `unmappedDefinitions`（每个为 `{name, description, words}`）和 `suggestions`（每个为 `{definition, icon}`，针对任何适合你的某个图标的未映射定义）。它们永不计入，也不会导致检查失败。"
        },
        {
          "type": "prose",
          "text": "模板使用的含义比内置定义更多，例如 `document` 和 `share`。复制后的模板会为你的集合未映射的每个含义显示一个占位符。要查看是哪些含义，请在你的包中运行 `astryx experimental icon --definitions`：每个定义会显示有多少模板使用它，以及你的集合是否映射了它。`new-set`、`add` 和 `map` 最后会输出一行，列出集合仍未映射的模板含义（按使用频率从高到低），`integration check` 会在 \"Template icon meanings not mapped\" 下列出它们（在 JSON 中为每个集合的 `templateMeanings.unmapped`，每项为 `{definition, templates}`）。该列表永远不会导致检查失败。"
        },
        {
          "type": "prose",
          "text": "只有在读取器证明某个导出不存在时，该导出才会失败；它无法判断的内容也不会判为失败。如果某个图标导出的模块是你尚未构建的 `exports` 目标；如果某个图标或适配器导出无法证明其存在或不存在（位于它无法跟随的重新导出之后、绑定到默认导入或命名空间导入，或从尚未安装的包导入）；以及某个主题映射或主题映射条目无法读取，这些都会列在 \"Not checked\" 下，并在 JSON 中作为每个集合的 `unchecked` 列出（每项为 `{icon}`、`{adapter}` 或 `{entry}`，并带有 `reason`）。请构建包、安装它导入的包、按名称导出图标，或以绑定或元素形式写入该条目，以便进行检查。你的已构建模块缺少某个导出仍然会报错。"
        },
        {
          "type": "prose",
          "text": "错误会导致检查失败。警告仅在 `--strict` 下失败。映射了每个内置定义及其声明的每个定义的集合可以通过 `--strict`，各集成会在构建中运行该检查（{@link generic:checks}）。完整流程：`experimental icon new-set` → 当回执要求时运行 `npm install -D typescript@6` → `integration check` → 对其列出的每个定义运行 `experimental icon add`（或 `experimental icon map`）→ `integration check` 通过。"
        }
      ]
    },
    {
      "section": "Before you publish",
      "title": "发布之前",
      "content": [
        {
          "type": "list",
          "items": [
            "发布前请自行运行 `astryx integration verify`。不要把它放进 `prepublishOnly`：在 `npm publish --dry-run` 下，它自己的 `npm pack` 也会变成试运行，因而不会检查任何内容。",
            "把 `@astryxdesign/cli` 声明为可选对等依赖（`peerDependenciesMeta`）。应用无法满足的必需对等依赖会让 npm 悄无声息地移除应用的 CLI。图标集是实验性的，因此没有任何版本范围对其作出承诺，格式可能在补丁版本中变化。CLI 只有在认识集合数据文件使用的每个键时才会读取该集合：不认识的键会使集合被撤下，并指出该键。`exclude` 只会被数据文件参考中列出它的 CLI 读取（{@link schema:icon-set-data}）；不带 `exclude` 的集合可以被所有具有 `astryx experimental icon` 的 CLI 读取。没有该命令的 CLI 会把 `experimental` 当作不认识的清单键：那里的 `astryx doctor` 会警告你的包是针对较新的 Astryx CLI 发布的，其他命令会打印一行提示让你运行它，而你的图标、图标定义和模板图标映射都不会出现（{@link generic:versioning}）。",
            "每个内置定义都需要一个图标，因为 Core 会渲染它。如果你的图标库没有完全符合该含义的图标，请映射最接近的一个，或把你的图形素材作为组件文件添加到包中（`experimental icon add <Name> --from ./src/icons/<name>.js --definition <definition>`；`./` 路径按原样命名）。你绘制的图形素材归你所有：请在图标库的许可证旁注明其许可证，例如写在集合目录的 NOTICE 文件中。",
            "生成的声明文件会导入 React 类型，因此请为 TypeScript 用户把 `@types/react` 声明为可选对等依赖。",
            "把所封装的图标库保留在 `dependencies` 中：你的生成模块会重新导出它的组件，因此应用会随你的包一起获得它，`integration check` 会将其版本范围与数据文件记录的版本进行比较。",
            "`integration check --strict` 会对集合的文档文件进行类型检查；它不会针对 React 的类型检查生成的声明文件。请安装 `@types/react` 并运行 `tsc` 来检查这些声明。",
            "你的包需要把 `react` 作为对等依赖（主题映射和适配器会用到它），就像 Core 一样。`experimental icon new-set` 的回执会列出你的 package.json 尚未声明的对等依赖，以及要添加的 JSON：`react`（`>=18`），以及作为可选对等依赖的 `@types/react` 和 `@astryxdesign/cli`（来自写入该集合的版本）；如果没有 `typecheck` 脚本，还会给出该脚本（`astryx integration check --strict`）。"
          ]
        }
      ]
    },
    {
      "section": "Share a definition with every set",
      "title": "在所有集合间共享定义",
      "content": [
        {
          "type": "prose",
          "text": "你自己的定义不需要改动 Astryx。要与所有集合共享某个定义，请提交一个拉取请求，把其文件复制到 CLI 的图标定义文件夹中，并附上描述和关键词。其名称不得与其他定义冲突。"
        }
      ]
    },
    {
      "section": "How apps use it",
      "title": "应用如何使用",
      "content": [
        null,
        {
          "type": "prose",
          "text": "模板在其描述符的 `icons` 中声明每个导入图标绘制的定义（`{TrashIcon: 'delete'}`）。一旦项目在 astryx.config 中设置 `experimental.iconSet`（`experimental icon use` 会写入它），每个已声明的图标就会变成项目列表中第一个映射该定义的集合所提供的对应图标。列表中没有任何集合拥有的图标会改为绘制占位符（见下文“当没有集合拥有该图标时”），除非它来自列表中某个集合所封装的图标库（集合数据中的 `source`）。这类图标已经是你的项目选定的：使用主集合自身图标库编写的模板会按原样保留其图标，而来自备用集合的图标库、且没有任何集合映射的图标会保留其导入。复制报告会把每个图标标记为已映射、占位符或保留。不会根据名称做任何猜测。已映射的图标会失去其图标库的尺寸属性（`size`、`strokeWidth`、`absoluteStrokeWidth`），因为集合的图标从 CSS 获取尺寸；报告会将其标记为 `dropped`。被重写的导入行上的注释会保留。"
        },
        {
          "type": "prose",
          "text": "每个 `icons` 键都是模板从其模块导入的名称，而不是本地别名。当模板从两个模块导入相同名称时（例如从某个图标库的 outline 和 solid 模块导入 `TrashIcon`），一个键就覆盖两者：它们绘制同一个定义。当模块属于某个已安装且声明了该变体的集合时，每个图标都会变成所选集合中同名变体（因此 solid 保持 solid）。当所选集合的图标没有该变体时，它会绘制集合的默认外观，报告会用 `variant: {asked, used}` 标出两种外观。缺少某个外观绝不会把图标移到备用集合。当项目选择了一种外观（`experimental.iconVariant`）时，每个图标都会改为请求该外观。"
        }
      ]
    },
    {
      "section": "Choose a main set and backups",
      "title": "选择主图标集和备用图标集",
      "content": [
        {
          "type": "prose",
          "text": "一个项目使用一个主图标集。备用图标集会按你列出的顺序填补主集合未映射的含义。每个图标只来自一个集合：列表中第一个映射其含义的集合。两个都映射同一含义的集合不会混合使用；由列表顺序决定。"
        },
        null,
        {
          "type": "prose",
          "text": "`use` 会写入 astryx.config 中的 `experimental.iconSet`。不带 `--backup` 时，它把集合名称写成字符串。带备用集合时，它写入一个列表，主集合在前。集合可以写作 `<set>`，当两个包发布了同名集合时写作 `<package>/<set>`。列表中的每个集合都必须已安装，且每个集合只能出现一次。当项目的 `@astryxdesign/cli` 范围也允许某个会拒绝所写入值的旧版本时，`use` 会发出警告并指出需要要求的范围；你当前运行的 CLI 无论如何都能读取它。"
        },
        {
          "type": "code",
          "label": "astryx.config.mjs"
        },
        {
          "type": "prose",
          "text": "`astryx experimental icon --list` 显示顺序：项目的 `order`（每个集合为 `<package>/<set>`），以及每个集合的 `role`（`main`、`backup` 或未列出）和 `rank`。其覆盖列会统计每个集合映射的定义：`builtIn` 表示内置名称（有效的集合会全部映射，`missing` 会列出缺少的名称），`definitions` 表示所有 Astryx 定义。当安装了两个或更多集合且没有主集合时，`--list` 会说明这一点并给出要运行的命令：`astryx experimental icon use <main> --backup <set>`。`use` 回执（`icon.use`）会列出主集合（`iconSet`、`set`）和每个备用集合（`backups`），并列出未包含在列表中的已安装集合（`unlisted`）及添加它们的命令（`next`）：对于安装了多个集合却把其中一个排除在列表外的项目，`astryx doctor` 会判定失败。"
        },
        {
          "type": "prose",
          "text": "只有主集合的主题映射会提供给 `defineTheme({icons})`。备用集合从不改变主题。复制报告会列出它使用的每个集合及其许可证（`icons.sets`）。"
        }
      ]
    },
    {
      "section": "Draw every icon in one look",
      "title": "让所有图标采用同一种外观",
      "content": [
        {
          "type": "prose",
          "text": "集合可以以多种外观（即其变体）提供每个图标，例如 outline 和 filled。项目使用 `--variant` 为其所有图标选择一种外观，这会把 `experimental.iconVariant` 写在 `experimental.iconSet` 旁边。该外观必须是主集合的变体之一；`experimental icon --list` 会显示每个集合的 `variants`。"
        },
        null,
        {
          "type": "code",
          "label": "astryx.config.mjs"
        },
        {
          "type": "prose",
          "text": "各集合按名称匹配外观。列表中的每个集合会绘制其名为 `filled` 的变体；没有该变体的集合会绘制其默认外观，回执会显示每个已列出集合的外观（`looks`）。如果某个集合把同一种外观叫作别的名称（例如 `solid` 或 `regular`），它会绘制默认外观，直到把该变体重命名为 `filled`。复制后的模板会在图标有 `filled` 导出时导入该导出（`TrashFilledIcon`）。如果没有，副本会保留集合的默认导出，并报告 `variant: {asked, used}`；它绝不会为了外观而从备用集合获取该图标。选择了外观后，从主集合自身图标库取得的图标会变成该外观下的主集合图标：即 `map` 为其含义指定的图标，或重新导出同一图标库导出的那个图标（报告为 `by: 'variant'`）。已经从某个已列出集合以另一种外观导入的图标会迁移到其 `filled` 导出（同样为 `by: 'variant'`）。复制报告会把该外观记为 `icons.variant`。"
        },
        {
          "type": "prose",
          "text": "组件从主题获取内置图标。如果主集合的某个图标绘制该外观，该集合的包会为它导出一个主题映射 `themeIconsFilled`，回执会指出该导出及其模块（`themeMap`）："
        },
        null,
        {
          "type": "prose",
          "text": "`use` 每次都会写入完整的选择：运行时带上所有集合和你想要的外观；不带 `--variant` 则回到每个集合的默认外观，这会移除 `experimental.iconVariant`。当主集合未声明该名称的变体时，`astryx doctor` 会判定失败，并列出其变体以及选择变体的命令。早于 0.7.16 的 CLI 会拒绝设置了 `experimental.iconVariant` 的 astryx.config，因此当项目的 `@astryxdesign/cli` 范围允许这类旧版本时，`use` 会发出警告。"
        }
      ]
    },
    {
      "section": "When no set has an icon",
      "title": "当没有集合拥有该图标时",
      "content": [
        {
          "type": "prose",
          "text": "当列表中没有集合映射某个图标的含义，且列表中没有集合封装模板导入该图标所用的图标库时，复制后的文件会从模板的图标库导入中移除该图标。它会声明一个小型 `MissingIcon` 组件（如果文件中已使用 `MissingIcon`，则使用另一个未被占用的名称），并在原来使用该图标的每个位置渲染它，因此页面仍可构建，也不需要新增包。占位符是一个 1em 大小的虚线方框，使用当前文本颜色。除非该处提供了 `aria-label`，否则它对屏幕阅读器隐藏。每个使用位置旁边的注释会记录其含义。"
        },
        null,
        {
          "type": "prose",
          "text": "`astryx template` 会为每个占位符打印一条说明，JSON 报告会在 `icons.placeholder` 中列出它及其 `definitions` 和 `fixes`。可以通过以下任一方式为该含义提供真实图标："
        },
        {
          "type": "list",
          "items": [
            "添加一个具有该含义的备用集合：`astryx experimental icon use <main> --backup <set>`。`astryx discover --type icon-set` 会列出你的源提供的集合及其各自映射的定义；请先安装一个。",
            "如果你自己编写主集合（其包归你所有，而不是已安装的依赖），就在那里映射该含义：`astryx experimental icon map cut <icon> --set <main>`。",
            "对于内置含义（`astryx experimental icon --definitions` 会标出），改为按名称渲染主题图标：`<Icon icon=\"close\" />`。每个集合都会映射内置名称，因此不需要导入。",
            "否则，编写你自己的图标组件，并在原来使用 `MissingIcon` 的地方传入它（`astryx docs icons custom-icons`）。"
          ]
        },
        {
          "type": "prose",
          "text": "采用前两种方式后，请重新复制模板，或把每个 `MissingIcon` 用法替换为 `astryx experimental icon <meaning>` 打印的图标（一旦列表中的某个集合映射了该含义，它就能找到该图标），并删除 `MissingIcon` 声明。当复制后的代码仍在使用占位符时，`astryx doctor` 会发出警告（`icon-placeholders` 检查），并指出每个文件和含义。"
        }
      ]
    },
    {
      "section": "Label every template icon",
      "title": "为每个模板图标添加标注",
      "content": [
        {
          "type": "prose",
          "text": "模板只会针对其 `icons` 声明的图标遵循项目的图标集。在模板声明了 `icons` 的包中，`astryx integration check` 会指出模板导入但未声明的每个图标（`template_icon_undeclared`）。该提示目前会在 `--strict --next` 下导致失败，从下一个次要版本起会在 `--strict` 下导致失败。如果包中的某个模板声明了来自同一模块的图标，并且模板将其渲染为无子元素的元素（`<Scissors />`）或作为值传递（`icon={Scissors}`），则该模块的导入会被计为图标。来自该模块的任何其他导入（例如类型、模板调用的函数或带子元素的 provider）会被列为未检查：声明它会让 `astryx template` 将其替换为图标。来自任何其他模块、名称以 `Icon` 结尾的导入仅按名称匹配，因此检查会将其列为未检查。通用渲染器（裸 `Icon`，或每次使用时都会接收 `icon`、`iconNode`、`name` 或 `src` 属性的组件，例如 lucide 的 `DynamicIcon`）不绘制任何特定定义，因此无论其来自哪个模块，也会被列为未检查。两者都不会导致失败。请添加键及其绘制的定义；`astryx experimental icon --definitions` 列出所有定义，`astryx experimental icon new-definition` 可添加你的集合所需的定义。"
        }
      ]
    },
    {
      "section": "Where icon sets show up",
      "title": "图标集出现的位置",
      "content": [
        {
          "type": "prose",
          "text": "CLI 读取或报告图标集的所有位置，均为实验性功能。在 `astryx experimental icon` 之外，每一项都只出现在设置了 `experimental.iconSet` 的项目中；`astryx search` 永远不会返回图标："
        },
        {
          "type": "table",
          "headers": [
            "位置",
            "说明"
          ],
          "rows": [
            [
              "astryx.config 中的 `experimental.iconSet`",
              "项目的主图标集，可以是集合名称或 `<package>/<set>`，也可以是一个列表：主集合在前，然后按顺序列出备用集合。它是启用开关：只有设置后，模板、discover 和 doctor 才会读取图标集。`astryx experimental icon` 会把主集合的图标排在前面；未设置时，会把唯一已安装的集合视为项目的集合。`astryx experimental icon use <main> --backup <set>` 会写入它。"
            ],
            [
              "astryx.config 中的 `experimental.iconVariant`",
              "项目所有图标绘制的外观，必须是主集合的变体之一；它需要 `experimental.iconSet`。复制后的模板会在其集合具有该外观时导入每个图标；`astryx experimental icon use <main> --variant <variant>` 会写入它。"
            ],
            [
              "集成清单中的 `experimental.iconSets`",
              "存放包中图标集的文件夹，相对于 package.json。`astryx experimental icon new-set` 会声明它。"
            ],
            [
              "模板描述符的 `icons`",
              "每个导入图标绘制的图标定义（`{TrashIcon: 'delete'}`）：命名导入按导入的名称指定，默认导入按本地名称指定。`astryx template` 在展示或复制时会从列表中第一个具有各含义的集合写入图标，并报告 `icons`（status、set、order、variant、mapped、placeholder、kept、sets）：每个键要么已映射，要么在没有集合具有其含义时成为占位符，要么保留并说明原因（命名空间导入或仅类型导入、重新导出、Astryx 导入或来自列表中某个集合的导入、来自列表中某个集合所封装图标库的导入、根本没有导入，或绘制不到定义且没有匹配项的图标）。`integration check` 会指出模板源代码从未导入的键（`template_icon_not_imported`），这不会导致失败；也会指出包的模板未声明但被导入的图标（`template_icon_undeclared`），后者会在 `--strict --next` 下失败。"
            ],
            [
              "`astryx discover`",
              "包的集合（`iconSets`），以及 `@scope/name/<set>` 的显示名称、许可证、图标数量和定义；`--type icon-set` 只保留集合。"
            ],
            [
              "`astryx doctor`",
              "在应用中，`icon-sets` 检查：当 `experimental.iconSet` 指定的主集合或备用集合未安装、已被撤下（无效集合，或其模块无法解析），或两个包发布了同名集合时，会判定失败并说明原因；当安装的集合多于一个而列表遗漏其中一个时会失败；当 `experimental.iconVariant` 指定的变体不在主集合中声明时会失败；当另一个已安装的集合被撤下时会发出警告。`icon-placeholders` 检查会在复制后的代码仍为缺失图标使用占位符时发出警告，并指出每个文件和含义。在你的图标集包中，请改用 `astryx integration check` 检查：普通的 `doctor` 用于诊断应用。"
            ],
            [
              "JSON 类型",
              "`icon.search`、`icon.detail`、`icon.list`、`icon.setIcons`、`icon.definitions`、`icon.use`、`icon.map`、`icon.mapMany`、`icon.add`、`icon.addVariants`、`icon.definitionMatches`、`icon.newSet` 和 `icon.newDefinition`，来自对应的 `astryx experimental icon` 命令。"
            ]
          ]
        }
      ]
    }
  ]
};
