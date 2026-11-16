// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for quick-start.doc.mjs.
export const docsZh = {
  "title": "快速开始",
  "description": "创建新的集成包，或把 Astryx 添加到你已经发布的包中。",
  "sections": [
    {
      "section": "Quick start",
      "title": "快速开始",
      "content": [
        {
          "type": "heading",
          "text": "创建包"
        },
        {
          "type": "prose",
          "text": "集成包一开始只是一个普通的 npm 包。为它创建一个文件夹，在文件夹内创建 package.json，给包命名，将其设为 ES 模块，然后安装 Astryx CLI、Core 和 TypeScript 用于开发。"
        },
        null,
        {
          "type": "list",
          "items": [
            "设置 `\"type\": \"module\"`：CLI 生成的 `.js` 文件（例如构建后的主题）是 ES 模块，如果包被标记为 `\"type\": \"commonjs\"`，Node 会加载失败；在 npm 11 上，`{@pm-only npm \"writes package.json\" init -y}` 会写入该标记。",
            "从 `\"exports\": {}` 开始：之后每添加一个组件或模板，都会写入 `integration verify` 解析的公开导入。",
            "以 `astryx` 运行 CLI，它会运行你作为 devDependency 安装的 `@astryxdesign/cli`。",
            "组件命令会读取 Core，因此需要安装 `@astryxdesign/core`。",
            "这些检查通过 TypeScript 的 JavaScript 编译器 API 比较文档与代码，该 API 存在于 `typescript` 5.0 到 6。TypeScript 7 不提供该 API：在 TypeScript 7 上，还要安装 `@typescript/typescript6`（其 TypeScript 6 API 包），检查会使用它。"
          ]
        },
        {
          "type": "heading",
          "text": "添加第一个集成项"
        },
        {
          "type": "prose",
          "text": "一个集成包可以发布多种类型的项。先从名为 `AcmeCarousel` 的组件开始。"
        },
        null,
        null,
        {
          "type": "prose",
          "text": "`integration add` 会创建组件源代码、其 `.doc.mjs`、包导出和 `astryx.integration.mjs`。更新生成的文档，让 CLI 理解该组件，然后编写组件本身。"
        },
        {
          "type": "prose",
          "text": "像应用那样把它读回来。"
        },
        null,
        {
          "type": "prose",
          "text": "现在你有一个包含一个导出组件的集成包。"
        },
        {
          "type": "heading",
          "text": "在每次构建中检查（必需）"
        },
        {
          "type": "prose",
          "text": "在每次构建中运行 `integration check --strict`（{@link generic:checks}）：这样，与代码脱节的文档、属性、模板或链接会让你的构建失败，而不是用户的应用。现在就把它设置为 `typecheck` 脚本并运行。"
        },
        null,
        null,
        {
          "type": "list",
          "items": [
            "在 CI 中和每次发布前运行 `typecheck`。当你添加 `tsconfig.json` 时，把 `tsc --noEmit && ` 放在检查之前，让同一个脚本也检查类型。",
            "每项检查覆盖什么，以及 `--strict` 增加了什么：{@link generic:checks}。"
          ]
        },
        {
          "type": "heading",
          "text": "验证并打包"
        },
        {
          "type": "prose",
          "text": "运行 `integration verify` 检查应用是否能看见该组件，然后制作接下来要安装的 `.tgz` 文件。`--pack-destination ..` 会把它写在包文件夹旁边，这样下次打包不会把它打进去。"
        },
        null,
        null,
        {
          "type": "prose",
          "text": "`integration verify` 会把打包好的包安装到一个临时应用中，并确认组件能通过其公开导入在其中解析（{@link generic:checks}）。它不发布任何内容，也不会留下 `.tgz` 文件，因此 `{@pm-only npm \"builds the publish tarball\" pack}` 会为下一步写入 `../acme-astryx-widgets-1.0.0.tgz`。"
        },
        {
          "type": "heading",
          "text": "在应用中使用"
        },
        {
          "type": "prose",
          "text": "在新应用中安装 Core、CLI 和你的 `.tgz` 文件。由于它是依赖项，应用无需任何配置就会加载你的包。"
        },
        null,
        null,
        {
          "type": "prose",
          "text": "接下来的小节会解释每个包字段和集成文件。要构建真正的组件，请继续阅读 {@link namespace:components}。"
        }
      ]
    },
    {
      "section": "Fill in package.json",
      "title": "填写 package.json",
      "content": [
        {
          "type": "prose",
          "text": "集成包就是普通的 npm 包。以下六个字段控制它的命名、开发、检查和发布方式。"
        },
        {
          "type": "prose",
          "text": "`peerDependencies` 是应用提供的包。`devDependencies` 是你在构建集成包时使用的包。"
        },
        {
          "type": "table",
          "headers": [
            "字段",
            "设为",
            "原因"
          ],
          "rows": [
            [
              "`name`",
              "你的包名，例如 `@acme/astryx-widgets`",
              "每次添加都会把它写入所生成文档的 `import` 中。请在添加前重命名，或在添加后更新每个 `import`。"
            ],
            [
              "`version`",
              "你发布的版本，例如 `1.0.0`",
              "应用可以看到它；`astryx.integration.mjs` 从不会重复它。"
            ],
            [
              "`exports`",
              "从 `{}` 开始",
              "每次添加组件和模板都会把其公开导入写在这里，`integration verify` 会解析它。"
            ],
            [
              "`files`",
              "可选：要发布的路径",
              "把私有文件排除在外。当该列表存在时，每次添加都会追加其根目录和 `astryx.integration.mjs`。"
            ],
            [
              "`peerDependencies`",
              "当你的代码导入它时，为 `@astryxdesign/core`；当你要发布需要更新 CLI 的功能时，可选 `@astryxdesign/cli`（{@link generic:versioning}）",
              "应用为你的集成包提供这些包。"
            ],
            [
              "`devDependencies`",
              "`@astryxdesign/cli`、`@astryxdesign/core` 和 `typescript`",
              "让你在开发集成包时运行 CLI、构建组件并运行检查。"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "对等版本范围和发布见 {@link generic:versioning}；`files` 和发布见 {@link generic:publishing}。把 `\"typecheck\": \"tsc --noEmit && astryx integration check --strict\"` 添加到 `scripts`，使每次运行都检查类型，并检查文档、属性和链接是否仍与代码一致。它需要 `typescript` 和 `tsconfig.json`；见 {@link generic:checks}。"
        }
      ]
    },
    {
      "section": "The integration file",
      "title": "集成文件",
      "content": [
        {
          "type": "prose",
          "text": "第一次 `integration add` 会创建 `astryx.integration.mjs`，之后每次添加都会更新它。在快速开始过程中，你不需要编写或编辑这个文件。"
        },
        {
          "type": "heading",
          "text": "包中的文件"
        },
        {
          "type": "list",
          "items": [
            "`package.json` 定义 npm 包，包括其名称、版本、依赖、发布文件和导出。",
            "`astryx.integration.mjs` 告诉 CLI 包中各类集成项分别存放在哪里。",
            "集成项文件位于这些根目录下。例如，一个组件可以用 `AcmeWidget.tsx` 作为源代码，用 `AcmeWidget.doc.mjs` 作为文档。"
          ]
        },
        {
          "type": "heading",
          "text": "集成文件中的字段"
        },
        {
          "type": "code",
          "label": "astryx.integration.mjs"
        },
        {
          "type": "prose",
          "text": "该文件告诉 CLI 此包把集成项存放在哪里。只有当你想要自定义根目录或其他可选设置时才编辑它。路径相对于 package.json，后续添加会保留你已设置的自定义路径。"
        },
        {
          "type": "prose",
          "text": "所有字段见 {@link schema:integration}。"
        },
        {
          "type": "heading",
          "text": "使用 CLI"
        },
        {
          "type": "prose",
          "text": "你可以手动编辑包文件，但常规工作流由 CLI 处理。这些链接始终打开规范的命令文档。"
        },
        null,
        null,
        null
      ]
    },
    {
      "section": "In global mode",
      "title": "全局模式",
      "content": [
        {
          "type": "prose",
          "text": "全局模式：用户也可以把包安装到自己的电脑上，与全局 CLI 并存（`{@pm install @astryxdesign/cli your-package --global}`）。此后它适用于任何项目之外的文件夹；在项目内，只有项目安装了它才适用。见 {@link namespace:global} 和 {@link generic:global-integrations}。"
        }
      ]
    }
  ]
};
