// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for use-integrations.doc.mjs.
export const docsZh = {
  "title": "使用集成",
  "description": "安装、发现并使用集成包，为你的应用添加组件、模板、主题和文档。",
  "sections": [
    {
      "section": "Discover integrations",
      "title": "发现集成",
      "content": [
        {
          "type": "prose",
          "text": "集成包为 Astryx 扩展额外的组件、模板、主题、文档和代码修改。它们以常规 npm 包的形式发布。"
        },
        {
          "type": "prose",
          "text": "搜索你需要的内容："
        },
        null,
        {
          "type": "prose",
          "text": "`search` 会搜索 CLI 所知道的一切（组件、文档、模板、主题和 Hook），因此像 \"carousel\" 这样的词，无论对应的是组件、模板还是文档页面，都能被找到。`discover` 会列出项目拥有的每个集成，并且在指定发现源时，还会列出它可以添加的包。"
        }
      ]
    },
    {
      "section": "Install an integration",
      "title": "安装集成",
      "content": [
        {
          "type": "prose",
          "text": "用你的包管理器安装该包。集成会自动链接：CLI 会在你的依赖中找到它们，因此安装即可："
        },
        null,
        {
          "type": "prose",
          "text": "运行 `astryx doctor` 确认一切已接通。如果需要加载不是直接依赖的包，请把它显式添加到 `astryx.config.mjs` 中："
        },
        {
          "type": "code",
          "label": "可选：显式配置条目"
        }
      ]
    },
    {
      "section": "Use what it adds",
      "title": "使用它带来的内容",
      "content": [
        {
          "type": "prose",
          "text": "安装后，该集成的贡献会与 Core 一起出现："
        },
        {
          "type": "list",
          "items": [
            "`astryx component --list` 会在 Core 组件旁边显示它的组件。",
            "`astryx template --list` 会包含它的页面和区块模板。",
            "`astryx theme list` 会列出它的主题；用 `astryx theme add <slug> --package @acme/brand-integration` 添加一个。",
            "`astryx docs` 会显示它提供的所有指南。",
            "`astryx search <query>` 会从每个已安装的集成中查找所有内容。"
          ]
        },
        {
          "type": "prose",
          "text": "从集成文档所述的子路径导入组件。运行 `astryx component <Name>` 查看确切的导入方式："
        },
        null,
        {
          "type": "prose",
          "text": "关于主题，参见 {@link generic:use-a-theme}。要构建自己的集成，参见 {@link namespace:authoring}。"
        }
      ]
    },
    {
      "section": "Check for problems",
      "title": "检查问题",
      "content": [
        {
          "type": "prose",
          "text": "运行 `astryx doctor` 查看集成问题：缺少根、无效贡献或 CLI 版本不匹配。doctor 检查是列出每个包所有问题的唯一位置。"
        },
        null
      ]
    }
  ]
};
