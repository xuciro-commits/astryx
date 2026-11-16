// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for codemods.doc.mjs.
export const docsZh = {
  "title": "代码改写脚本",
  "description": "发布由 `{@command upgrade}` 运行以迁移应用代码的 codemod，并了解应用会运行哪些 codemod。",
  "sections": [
    {
      "section": "Add a codemod",
      "title": "添加代码改写脚本",
      "content": [
        {
          "type": "prose",
          "text": "`integration add codemod` 会把 codemod 写入以版本号命名的文件夹。应用通过 `{@command upgrade}` 运行它来迁移代码。"
        },
        null,
        null,
        {
          "type": "prose",
          "text": "首次添加时，需要在 `astryx.integration.mjs` 中声明 `codemods: './codemods'`。codemod 的 id 是其在版本文件夹内的路径（不含扩展名）：`rename-delay`。id 在该包的所有版本文件夹中必须唯一。"
        },
        {
          "type": "prose",
          "text": "加载器会跳过 `*.test.*`、`*.spec.*` 和 `*.fixture.*` 文件以及 `__tests__/` 或 `__fixtures__/` 下的所有内容，因此测试可以放在 codemod 旁边。文件夹名称决定应用何时运行该 codemod；参见「选择 codemod 的运行时机」。"
        }
      ]
    },
    {
      "section": "Write the transform",
      "title": "编写转换逻辑",
      "content": [
        {
          "type": "prose",
          "text": "codemod 默认导出一个普通对象，包含 `type`、`title` 和 `transform` 函数。`transform` 返回新的源码，或返回 `null` 以保持文件不变。"
        },
        null,
        {
          "type": "prose",
          "text": "`type: 'code'` 会改写应用中匹配 `fileExtensions` 的源文件。`type: 'config'` 则改写应用的 `astryx.config` 文件，并在代码 codemod 之前运行。`title` 会显示在升级输出中，`api.jscodeshift` 是用于该文件的 jscodeshift 实例。所有字段见 {@link schema:codemod}。"
        }
      ]
    },
    {
      "section": "Choose when a codemod runs",
      "title": "选择 codemod 的运行时机",
      "content": [
        {
          "type": "prose",
          "text": "有两条规则决定应用的 `{@command upgrade}` 是否运行你的 codemod：应用使用的 Core 版本，以及应用是否指定了你的包。"
        },
        {
          "type": "list",
          "items": [
            "版本文件夹是依据应用的 `@astryxdesign/core` 版本进行匹配的，而不是你所在包的版本。`upgrade --from <version>` 会运行 `--from` 之上的每个文件夹，直至并包括应用中安装的 Core 版本。在安装 Core 0.7.0 的情况下，`--from 0.6.3` 会运行 `0.7.0/`，而 `--from 0.7.0` 不会运行任何内容。以你自己的发布版本命名的文件夹（例如 `1.0.0/`）会等到应用使用 Core 1.0.0 时才运行。",
            "只有当应用在其 `astryx.config` 的 `integrations` 中列出你的包，或传入 `--integration @acme/astryx-widgets` 时，`upgrade` 才会运行你的 codemod。仅安装你的包还不够：此时运行会静默跳过你的 codemod，不给出任何警告。"
          ]
        }
      ]
    },
    {
      "section": "Run codemods in an app",
      "title": "在应用中运行 codemod",
      "content": [
        {
          "type": "prose",
          "text": "应用通过 `{@command upgrade}` 预览 codemod，并使用 `--apply` 写入更改。不使用 `--apply` 时，磁盘上的内容不会发生任何变化。"
        },
        null,
        null,
        {
          "type": "prose",
          "text": "`<n>` 也会计入 Core 针对相同版本的 codemod：它们先运行，并打印在 `Integrations:` 之上。若要只运行你的 codemod（例如测试时），请添加 `--codemod rename-delay`。"
        },
        {
          "type": "prose",
          "text": "`--from` 是应用升级前使用的 Core 版本。除非应用传入 `--path`，否则运行会扫描 `./src`；它绝不会写入应用标记为生成、内置或忽略的文件；参见 {@link command:upgrade}。`upgrade --list` 只显示 Core 的 codemod。"
        },
        {
          "type": "prose",
          "text": "集成清单没有 `hooks` 字段。在 codemod 之后运行的命令（例如格式化程序）应由应用在其 `astryx.config` 的 `hooks.postCodemod` 中设置。"
        }
      ]
    },
    {
      "section": "In global mode",
      "title": "全局模式",
      "content": [
        {
          "type": "prose",
          "text": "在全局模式下：在应用内部，无论用户启动的是哪一份 CLI，`upgrade` 都会以与应用 Core 相同的发布版本运行，并且只运行应用所安装集成的 codemod。在项目之外，`upgrade` 只列出 codemod，不执行任何迁移。参见 {@link namespace:global} 和 {@link command:upgrade}。"
        }
      ]
    }
  ]
};
