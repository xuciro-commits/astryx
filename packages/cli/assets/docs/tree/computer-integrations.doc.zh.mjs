// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for computer-integrations.doc.mjs.
export const docsZh = {
  "title": "全局安装的集成",
  "description": "与全局安装一起安装的集成可在任何项目之外的文件夹中工作。在项目内，只有项目安装的集成才生效，其他集成会被列为可添加项。",
  "sections": [
    {
      "section": "Install one globally",
      "title": "全局安装一个集成",
      "content": [
        {
          "type": "prose",
          "text": "用安装 CLI 的同样方式安装集成，让两者位于同一目录："
        },
        null,
        {
          "type": "prose",
          "text": "如果某个工具把 CLI 和集成安装到同一个文件夹，并从那里运行 CLI，也同样算数。`npx` 和项目版本的缓存永远不算。"
        }
      ]
    },
    {
      "section": "Outside a project, they work",
      "title": "在项目之外可以正常工作",
      "content": [
        {
          "type": "prose",
          "text": "在任何项目之外的文件夹中，Astryx 会像项目加载自身集成那样加载与全局安装相邻的每个集成：其组件、模板、文档、主题和 discover 来源都会出现，它声明的命令名会引出 Astryx 输出的命令。如果某个集成的 `@astryxdesign/core` 或 `@astryxdesign/cli` peer 范围不包含你的全局版本，它会被跳过，`{@command doctor}` 会说明原因。"
        }
      ]
    },
    {
      "section": "Inside a project, only the project's",
      "title": "在项目内，只使用项目自己的集成",
      "content": [
        {
          "type": "prose",
          "text": "项目的答案必须与它安装的内容一致：来自未安装包的组件将无法构建。因此在项目内，仅全局安装的集成不会添加任何内容。当它支持项目版本并能加载时，`{@command discover}` 会把它列在项目可添加的包中，并附上项目的安装命令。当项目安装了同一个集成时，使用的是项目中的副本。"
        }
      ]
    },
    {
      "section": "See which ones work",
      "title": "查看哪些集成可用",
      "content": [
        {
          "type": "list",
          "items": [
            "在项目之外，`{@command doctor}` 会列出它使用的全局集成，并对跳过的每个集成发出警告。",
            "在项目内，`{@command doctor}` 和 `{@command discover}` 会列出项目可以添加的集成。"
          ]
        }
      ]
    },
    {
      "section": "More on global mode",
      "title": "全局模式详解",
      "content": [
        {
          "type": "prose",
          "text": "本页属于 {@link namespace:global}，该命名空间说明全局模式是什么以及各个部分如何工作。构建集成：{@link generic:global-integrations}。"
        }
      ]
    }
  ]
};
