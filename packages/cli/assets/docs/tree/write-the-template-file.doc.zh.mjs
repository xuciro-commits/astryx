// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for write-the-template-file.doc.mjs.
export const docsZh = {
  "title": "写入模板文件",
  "description": "Astryx 只会把这一个文件复制到应用中，因此编写时要确保它能在那里独立运行：它落在哪里、可以导入什么，以及导出什么。",
  "sections": [
    {
      "section": "Know what gets copied",
      "title": "了解会复制哪些内容",
      "content": [
        {
          "type": "prose",
          "text": "`{@command template}` 只复制一个源文件。它不会复制同级的辅助文件、样式表、字体、图标、图片或媒体。在添加支持文件之前，请为此做好规划。"
        },
        {
          "type": "table",
          "headers": [
            "模板",
            "目录目标",
            "显式文件目标"
          ],
          "rows": [
            [
              "页面",
              "写入 `<target>/page.tsx`",
              "写入精确的文件路径"
            ],
            [
              "区块",
              "写入 `<target>/<source-basename>.tsx`",
              "写入精确的文件路径"
            ]
          ]
        },
        null,
        {
          "type": "prose",
          "text": "Astryx 拒绝替换现有文件，除非调用方传入 `--overwrite` 或 `-f`。"
        }
      ]
    },
    {
      "section": "Keep edited code in one file",
      "title": "将可编辑代码保存在一个文件中",
      "content": [
        {
          "type": "prose",
          "text": "将应用预期会编辑的每个辅助文件都放在模板源文件中。小型本地组件、示例数据、常量和事件处理程序可以放在同一文件中默认组件的上方或下方。"
        },
        {
          "type": "list",
          "items": [
            "当辅助代码属于可编辑的起点时，将其内联。",
            "仅当辅助代码应由包拥有并随包更新时，才将其移入集成包。",
            "不要导入 `./helper`、`./styles` 或任何其他同级文件。",
            "不要在运行时创建路由、配置或额外文件。为应用提供一个明确拥有的源文件。"
          ]
        }
      ]
    },
    {
      "section": "Use imports that work in the app",
      "title": "使用在应用中可用的导入",
      "content": [
        {
          "type": "prose",
          "text": "复制之后，导入会从应用解析，而不是从模板目录解析。每个裸导入都必须指向应用已安装的包，并且每个包路径都必须是公开的。"
        },
        null,
        {
          "type": "list",
          "items": [
            "从 Astryx 组件的公开 Core 路径导入。",
            "仅通过包导出的路径导入集成包拥有的组件、辅助函数、图标或样式（{@link generic:export-template-assets}）。",
            "如果 Astryx 或平台 API 已提供相应行为，请避免添加另一个库。"
          ]
        }
      ]
    },
    {
      "section": "Export one component",
      "title": "导出一个组件",
      "content": [
        {
          "type": "prose",
          "text": "源文件必须默认导出一个 React 组件。文件内的命名辅助函数没有问题。"
        },
        {
          "type": "list",
          "items": [
            "仅当 Hook、事件处理程序、浏览器 API 或作为属性传入的组件（例如 `icon={BellIcon}`）需要客户端边界时，才将 `use client` 作为第一条语句添加。",
            "当静态模板不需要客户端行为时，请保持其与服务器兼容。"
          ]
        }
      ]
    }
  ]
};
