// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for icon-set-files.doc.mjs.
export const docsZh = {
  "title": "图标集文件",
  "description": "图标集由哪些文件构成，以及每个文件的全部字段：描述文件、数据文件和图标定义。",
  "sections": [
    {
      "section": "IconSetDoc",
      "title": "IconSetDoc",
      "content": [
        {
          "type": "prose",
          "text": "实验性功能：可能在补丁版本中更改或移除。集成所附带某个图标集的强类型描述文件：这是人们针对该图标集编写的内容。图标集中的图标及其各自含义位于旁边的 `<name>.icons.json` 数据文件中。"
        },
        {
          "type": "prose",
          "text": "适用于：<iconSetsRoot>/<name>/<name>.doc.mjs"
        },
        {
          "type": "table",
          "headers": [
            "字段",
            "类型",
            "是否必需",
            "说明"
          ],
          "rows": [
            [
              "type",
              "'icon-set'",
              "是",
              "文档类型的判别字段。"
            ],
            [
              "name",
              "string",
              "是",
              "小写连字符（kebab）形式的图标集标识。必须与描述文件所在父目录一致。示例：'outline'。"
            ],
            [
              "displayName",
              "string",
              "是",
              "`astryx experimental icon --list` 显示的人类可读名称。示例：'Acme Outline'。"
            ],
            [
              "description",
              "string",
              "是",
              "`astryx experimental icon --list` 显示的一行摘要。"
            ],
            [
              "maintained",
              "boolean",
              "是",
              "所属包是否积极维护该图标集。"
            ],
            [
              "license",
              "string",
              "是",
              "图形素材的 SPDX 许可证表达式。示例：'MIT'。"
            ]
          ]
        },
        {
          "type": "code",
          "label": "位于 icons/outline/outline.doc.mjs 的图标集描述文件"
        },
        {
          "type": "prose",
          "text": "将清单的 `experimental.iconSets` 字段指向存放图标集的文件夹。其中的每个小写连字符文件夹就是一个图标集，以文件夹命名，包含 `<name>.doc.mjs`、`<name>.icons.json` 以及任意许可证声明文件。清单从不列出图标集或图标。"
        },
        {
          "type": "prose",
          "text": "将描述文件写成一个默认导出的对象，只包含字面量字符串和布尔值，放在 `/** @type {import('@astryxdesign/cli/authoring').IconSetDoc} */` 注释之下，文件中不要有其他内容。发现流程会读取它和数据文件，但不执行它们或图标模块。"
        },
        {
          "type": "prose",
          "text": "数据文件由 {@link schema:icon-set-data} 描述。运行 `astryx integration check` 可验证其中指定的每个导出都存在于模块中，并且主题映射与 `map` 的内置条目一致。"
        }
      ]
    },
    {
      "section": "IconSetData",
      "title": "IconSetData",
      "content": [
        {
          "type": "prose",
          "text": "实验性功能：可能在补丁版本中更改或移除。图标集的数据文件：存在哪些图标、绘制每个图标的导出、用户可能搜索的词，以及每个图标定义由哪个图标绘制（`map`）。`astryx experimental icon`、模板图标映射和各项检查只读取此文件，不读取其他内容。"
        },
        {
          "type": "prose",
          "text": "适用于：<iconSetsRoot>/<name>/<name>.icons.json"
        },
        {
          "type": "table",
          "headers": [
            "字段",
            "类型",
            "是否必需",
            "说明"
          ],
          "rows": [
            [
              "schemaVersion",
              "1",
              "是",
              "数据文件格式版本。"
            ],
            [
              "module",
              "string",
              "是",
              "读取每个 `export` 时使用的导入说明符：图标集自身的包名，或其 package.json `exports` 中的某个子路径。绝不能是文件路径。示例：'@acme/outline-icons'。"
            ],
            [
              "source",
              "{package: string, version: string}",
              "否",
              "生成该文件所依据的上游库及其版本。无上游的图标集请省略此项。"
            ],
            [
              "exclude",
              "string[]",
              "否",
              "不是图标的库导出。`experimental icon new-set --from` 每次包装或刷新图标集时都会排除它们；`--exclude` 会追加到列表中。若某个 CLI 的参考实现未列出此键，则该 CLI 会撤下设置了此键的图标集，并指出该键名；对于这些 CLI 必须读取的图标集，请省略此键。"
            ],
            [
              "generated",
              "string",
              "否",
              "`astryx experimental icon add` 写入的模块，表示为从包根目录起的 `./` 路径：每个图标一个导出，库组件的重新导出或对库导出应用适配器后的结果，以及 `themeIcons`——来自 `map` 内置条目的主题映射。CLI 会在其旁边写入声明文件。包的入口会重新导出它。示例：'./icon-sets/outline/outline.generated.js'。"
            ],
            [
              "adapter",
              "{module: string, export: string}",
              "否",
              "包中的一个函数 `(source) => Component`，将不是组件的库导出（图标数据、SVG 字符串或 URL）转换为组件。`module` 是从包根目录起的 `./` 路径。示例：{module: './src/adapt.js', export: 'adapt'}。"
            ],
            [
              "variants",
              "string[]",
              "否",
              "图标集提供的命名外观，使用小写连字符格式，例如 `outline` 和 `filled`。图标尺寸绝不是变体：由 CSS 设置。如果图标集只有一种外观，请省略此项。项目的 `experimental.iconVariant` 会引用其中之一，因此请按每种外观实际绘制的效果命名，而不要沿用库的叫法。示例：['outline', 'filled']。"
            ],
            [
              "default",
              "{variant?: string}",
              "否",
              "每个图标自身 `export` 绘制所用的变体；必须是 `variants` 之一。示例：{variant: 'outline'}。"
            ],
            [
              "themeMap",
              "string",
              "否",
              "将每个内置图标定义映射到其图形素材的导出，键恰好为 `map` 中的内置定义。当它为 `themeIcons` 时，由生成的模块写入；同时还会为图标绘制的其他每个变体各生成一个映射 `themeIcons<Variant>`（如 `themeIconsFilled`），其条目绘制该变体；若图标没有该变体，则使用图标自身的导出。示例：'themeIcons'。"
            ],
            [
              "map",
              "Record<string, string>",
              "否",
              "该图标集中哪个图标绘制每个图标定义：定义名称到图标 `id` 的映射。键为 Astryx 的定义（`astryx docs cli/experimental/icon-definitions`），或图标集在其 `definitions` 文件夹中声明的定义（每个定义一个文件）。一个图标可以绘制多个定义；每个定义映射到一个图标。所有内置定义都必须映射。示例：{\"close\": \"x\", \"delete\": \"trash\", \"remove\": \"trash\"}。"
            ],
            [
              "icons",
              "IconSetIcon[]",
              "是",
              "图标集中的所有图标。"
            ],
            [
              "icons[].id",
              "string",
              "是",
              "小写连字符形式的标识，在图标集中唯一。示例：'trash'。"
            ],
            [
              "icons[].export",
              "string",
              "是",
              "绘制图标默认变体的命名导出，命名为 `<Name>Icon`：一个接收 SVG 属性并使用 `currentColor` 绘制的 React 组件。示例：'TrashIcon'。"
            ],
            [
              "icons[].module",
              "string",
              "否",
              "当导入说明符与图标集的 `module` 不同时使用。"
            ],
            [
              "icons[].words",
              "string[]",
              "是",
              "用户可能搜索的小写词条，包括图标自身名称中的词；至少一个。不要照抄 `map` 中该图标所对应定义的关键词：搜索已可依据这些定义匹配该图标。示例：['trash', 'delete', 'remove', 'bin']。"
            ],
            [
              "icons[].variants",
              "{variant, export, module?}[]",
              "否",
              "图标的其他变体：每个都指定 `variants` 之一（绝不能是默认变体）以及绘制该变体的导出。每个变体至多一个导出。"
            ],
            [
              "icons[].matches",
              "{set, export, variant?, confidence: 'exact' | 'strong' | 'likely'}[]",
              "否",
              "经过审核的、在其他图标集或库中的等价图标，例如 `{set: 'lines', export: 'CrossIcon', variant: 'solid', confidence: 'exact'}`。当复制的模板从该已安装图标集导入匹配的图标时，`exact` 和 `strong` 匹配会优先于其他任何规则；`likely` 匹配仅作建议。匹配项绝不能指向本图标集自身。"
            ]
          ]
        },
        {
          "type": "code",
          "label": "位于 icons/outline/outline.icons.json 的数据文件"
        },
        {
          "type": "prose",
          "text": "文件如果不满足此 schema、重复了 id、某个图标没有 words、`map` 键不是 camelCase 或 `map` 值不是文件中的图标 id，或者指定的变体未在 `variants` 中声明，则该文件无效，其所属图标集会在修复前从所有界面撤下。`astryx doctor` 会说明原因。"
        },
        {
          "type": "prose",
          "text": "模板会声明其导入的每个图标所绘制的图标定义。使用项目图标集时，每个声明的图标会映射到 `matches` 中以 `exact` 或 `strong` 置信度命名的图标（针对其他已安装图标集提供的图标），否则映射到此文件 `map` 中为其定义指定的图标。不会根据名称或词语进行任何猜测。"
        },
        {
          "type": "prose",
          "text": "使用 CLI 编写：`astryx experimental icon add` 注册一个图标及其 `map` 条目，`astryx experimental icon map` 更改条目，`astryx experimental icon new-set --from` 包装整个库。"
        }
      ]
    },
    {
      "section": "IconDefinitionDoc",
      "title": "IconDefinitionDoc",
      "content": [
        {
          "type": "prose",
          "text": "实验性功能：可能在补丁版本中更改或移除。图标可表示的一种含义，例如 `close` 或 `delete`。Astryx 为每个定义提供一个文件；图标集可按相同格式添加自己的定义。图标集数据文件的 `map` 注册其哪个图标绘制每个定义。"
        },
        {
          "type": "prose",
          "text": "适用于：<iconSetsRoot>/<set>/definitions/<name>.doc.mjs"
        },
        {
          "type": "table",
          "headers": [
            "字段",
            "类型",
            "是否必需",
            "说明"
          ],
          "rows": [
            [
              "type",
              "'icon-definition'",
              "是",
              "文档类型的判别字段。"
            ],
            [
              "name",
              "string",
              "是",
              "camelCase 标识：数据文件 `map` 使用的键。必须与文件名一致。示例：'delete'。"
            ],
            [
              "description",
              "string",
              "是",
              "一句话说明：使用此定义的图标用于什么。示例：'Delete something permanently.'。"
            ],
            [
              "words",
              "string[]",
              "是",
              "用户可能搜索的小写词条；至少一个。示例：['trash', 'bin', 'discard']。"
            ],
            [
              "builtIn",
              "true",
              "否",
              "仅用于 Astryx 自身的定义：该定义是 Core 渲染的共享图标名称，因此每个图标集都会映射它。"
            ],
            [
              "stability",
              "'experimental'",
              "否",
              "将定义标记为实验性：图标定义列表会将其显示为 `[experimental]`。对于打算长期保留的定义，请省略此项。"
            ]
          ]
        },
        {
          "type": "code",
          "label": "位于 icon-sets/outline/definitions/random.doc.mjs 的图标集自定义定义"
        },
        {
          "type": "prose",
          "text": "图标集自身的定义放在其目录下的 `definitions` 文件夹中，每个定义一个文件。其 `map` 会像为 Astryx 的定义一样为这些定义注册图标。`astryx docs cli/experimental/icon-definitions` 会列出所有定义：Astryx 的定义，以及设置了 `experimental.iconSet` 的项目中每个已安装图标集的定义。定义文件会拒绝它不认识的字段。"
        },
        {
          "type": "prose",
          "text": "IconDefinitionDoc 是静态元数据：一个默认导出的对象，只包含字面量字段，直接放在 `/** @type {import('@astryxdesign/cli/authoring').IconDefinitionDoc} */` 注释之下。发现流程读取它但不执行它。"
        },
        {
          "type": "prose",
          "text": "要将定义共享给所有图标集，请在拉取请求中将其文件复制到 Astryx 的定义文件夹中。"
        }
      ]
    }
  ]
};
