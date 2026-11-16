// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for publishing.doc.mjs.
export const docsZh = {
  "title": "发布集成",
  "description": "将你的包以正确的发布标签发布到 npm，并在发布前后进行检查。",
  "sections": [
    {
      "section": "Check before you publish",
      "title": "发布前检查",
      "content": [
        {
          "type": "prose",
          "text": "只发布通过所有检查的包，然后用 `{@pm-only npm \"publishing goes through npm, which every Node install carries\" publish --dry-run}` 预览上传内容。试运行会列出文件和标签，但不会上传。"
        },
        null,
        null,
        {
          "type": "prose",
          "text": "每次发布都设置新的 `version`；{@link generic:versioning} 说明了什么算作破坏性变更。每项检查能证明什么，见 {@link generic:checks}。"
        }
      ]
    },
    {
      "section": "Keep private files out",
      "title": "排除私有文件",
      "content": [
        {
          "type": "prose",
          "text": "如果没有 `files` 列表，npm 会打包忽略文件未排除的每个文件，包括旧的 `.tgz` 文件或 `.env` 文件。请改为列出要发布的内容。"
        },
        null,
        {
          "type": "list",
          "items": [
            "只列出你要发布的根目录，并且始终包含 `astryx.integration.mjs`。npm 会自动添加 package.json，以及你在项目中拥有的 README 和 LICENSE。",
            "之后每次 `integration add` 都会将其根目录追加到列表中。",
            "发布 `astryx.integration.mjs`，而不是 `.ts`：CLI 会在每台机器上首次读取时转译它加载的每个 `.ts` 文件，因此 `.mjs` 启动更快。只发布一个清单；两个会导致加载失败。文档文件和 codemod 也是如此：发布 `.mjs`。",
            "当列表缺少某个根目录时，`integration verify` 会失败，并指出要添加到 `files` 的根目录（该消息见 {@link generic:troubleshooting}）。"
          ]
        }
      ]
    },
    {
      "section": "Publish to npm",
      "title": "发布到 npm",
      "content": [
        {
          "type": "prose",
          "text": "带作用域的包默认是私有的，因此请使用 `--access public` 发布。没有 `--tag` 时，npm 会将版本标记为 `latest`，这正是 `{@pm install @acme/astryx-widgets}` 安装的内容。"
        },
        null,
        {
          "type": "prose",
          "text": "要让应用先试用某个版本，请将其发布到 `next` 下，准备就绪后再将 `latest` 指向它。"
        },
        null
      ]
    },
    {
      "section": "Check the published package",
      "title": "检查已发布的包",
      "content": [
        {
          "type": "prose",
          "text": "在一个干净的应用中安装你发布的版本，并运行与针对 `.tgz` 文件运行时相同的命令。"
        },
        null,
        {
          "type": "prose",
          "text": "在应用中运行的完整命令列表见 {@link generic:test-in-an-app}。要帮助应用迁移到新版本，请参阅 {@link generic:upgrading}。"
        }
      ]
    }
  ]
};
