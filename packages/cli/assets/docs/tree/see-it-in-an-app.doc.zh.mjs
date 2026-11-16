// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for see-it-in-an-app.doc.mjs.
export const docsZh = {
  "title": "在应用中查看",
  "description": "确认应用能发现该组件、其包、其公开导入以及其文档。",
  "sections": [
    {
      "section": "Read the installed component",
      "title": "读取已安装的组件",
      "content": [
        {
          "type": "prose",
          "text": "安装了你的包的应用会在 Core 组件旁看到该组件，并显示其包名称和公开导入。应用无需任何配置。"
        },
        null,
        null,
        {
          "type": "prose",
          "text": "`component --list` 会将其显示为 `import: @acme/astryx-widgets/components/AcmeCarousel  [@acme/astryx-widgets]`。在构建包的过程中，同样的命令也能在你的包中运行。"
        }
      ]
    },
    {
      "section": "Test the packed package",
      "title": "测试打包后的包",
      "content": [
        {
          "type": "prose",
          "text": "发布之前，请在测试应用中安装打包后的包。然后在其中运行相同的 detail、list 和 search 命令。参见 {@link generic:test-in-an-app}。"
        }
      ]
    },
    {
      "section": "In global mode",
      "title": "全局模式",
      "content": [
        {
          "type": "prose",
          "text": "在全局模式下：要在应用中检查你的包，请将其安装到该应用中；为你的计算机安装的副本不会在项目内部使用。要在项目之外检查它，请将其与 CLI 一同安装到你的计算机上。参见 {@link namespace:global} 和 {@link generic:global-integrations}。"
        }
      ]
    }
  ]
};
