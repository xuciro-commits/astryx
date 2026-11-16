// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for add-a-component.doc.mjs.
export const docsZh = {
  "title": "添加组件",
  "description": "选择一个稳定的组件名称，并生成其源码、文档、包导出和集成入口。",
  "sections": [
    {
      "section": "Pick a component name",
      "title": "选择组件名称",
      "content": [
        {
          "type": "prose",
          "text": "选择一个唯一的 PascalCase 名称，例如 `AcmeCarousel`。该名称就是组件的公开导出和 CLI 身份标识，因此请保持稳定。如果只想更改用户看到的标签，请使用 `displayName`。"
        },
        {
          "type": "list",
          "items": [
            "优先选择能描述组件在你的产品中用途的名称。",
            "除非有意替换某个 Core 组件，否则避免使用该 Core 组件的名称。",
            "如果确实需要替换，请阅读 {@link generic:replace-a-core-component}。"
          ]
        }
      ]
    },
    {
      "section": "Run the add command",
      "title": "运行添加命令",
      "content": [
        {
          "type": "prose",
          "text": "在包中带上名称运行 `integration add component`。它会写入组件、组件的文档文件，以及应用使用的公开导入。"
        },
        null,
        null,
        {
          "type": "prose",
          "text": "`integration add` 从一个源码导出和一个单组件 `.doc.mjs` 开始。对于单个公开组件，请保持这种形态。如果源码暴露的是一个组件家族，请在 {@link namespace:describe-the-component} 中选择正确的形态。"
        },
        {
          "type": "prose",
          "text": "添加命令永远不会覆盖文件，`--dry-run` 会显示它将写入的内容。组件命令需要读取 Core，因此请先在包中安装 `@astryxdesign/core`（{@link generic:quick-start}）。"
        }
      ]
    },
    {
      "section": "Document a component you already have",
      "title": "为已有组件编写文档",
      "content": [
        {
          "type": "prose",
          "text": "要为包中已有的组件编写文档，请把文档写在源码文件旁边，并以该文件命名文档，例如将 `acme-gallery.doc.mjs` 放在 `acme-gallery.tsx` 旁边。将 `name` 设为应用导入的导出名，例如 `name: 'AcmeGallery'`，并让两个文件都位于 `astryx.integration.mjs` 声明的组件根目录内。文件不必以组件命名；{@link generic:component-imports} 说明了应用随后如何找到它。"
        }
      ]
    },
    {
      "section": "In global mode",
      "title": "全局模式",
      "content": [
        {
          "type": "prose",
          "text": "全局模式：当用户为他们的计算机安装你的包时（与全局 CLI 并列），你的组件会出现在任何项目之外的文件夹中；在项目内，只有项目安装了你的包时才会显示。参见 {@link namespace:global} 和 {@link generic:global-integrations}。"
        }
      ]
    }
  ]
};
