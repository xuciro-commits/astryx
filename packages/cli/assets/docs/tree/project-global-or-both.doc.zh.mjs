// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for project-global-or-both.doc.mjs.
export const docsZh = {
  "title": "项目安装、全局安装，还是两者兼有",
  "description": "在每个项目中安装 Astryx，并为你的电脑安装一次：两者兼有是推荐的设置，二者从不冲突。各自能带来什么，以及如何设置。",
  "sections": [
    {
      "section": "Both (recommended)",
      "title": "两者兼有（推荐）",
      "content": [
        {
          "type": "prose",
          "text": "在每个项目中安装 CLI，并为你的电脑安装一次。两者各自能完成对方无法完成的事，而且从不冲突："
        },
        {
          "type": "list",
          "items": [
            "**在项目中**，CLI 版本固定在 `package.json` 和锁文件中，因此队友和 CI 运行的正是该版本，运行时无需获取任何内容。",
            "**全局安装**时，astryx 命令在任何文件夹中都可用，包括项目尚不存在的空文件夹，而且你电脑上的每个编程 Agent 都能通过其 Agent 指南了解 Astryx。",
            "**两者兼有**时，在项目中始终由项目版本响应，即使你输入的是全局 astryx 命令；在项目之外则由你的全局版本响应。全局模式绝不会让项目中的 CLI 变得多余。"
          ]
        }
      ]
    },
    {
      "section": "At a glance",
      "title": "一览",
      "content": [
        {
          "type": "table",
          "headers": [
            "设置",
            "获得什么",
            "代价",
            "适合谁"
          ],
          "rows": [
            [
              "两者兼有",
              "每个项目都有固定版本，外加任意文件夹中的文档、组件和搜索，以及面向每个 Agent 的 Agent 指南",
              "需要维护两次安装",
              "大多数人"
            ],
            [
              "仅项目安装",
              "仓库中固定的版本，团队和 CI 使用同一版本",
              "项目之外没有 astryx 命令；其他位置的 Agent 不了解 Astryx",
              "CI 机器和构建服务器"
            ],
            [
              "仅全局安装",
              "任意文件夹中的文档、组件和搜索；每个 Agent 都了解 Astryx",
              "团队没有固定版本；没有自己的 CLI 的项目会使用你当初安装的版本",
              "Agent、原型和快速查询"
            ]
          ]
        }
      ]
    },
    {
      "section": "How to set up each",
      "title": "如何分别设置",
      "content": [
        {
          "type": "prose",
          "text": "在项目文件夹中（快速开始指南列出了应用需要安装的其他包）："
        },
        null,
        {
          "type": "prose",
          "text": "为你的电脑安装一次："
        },
        null,
        {
          "type": "prose",
          "text": "两者兼有：完成上述两步，顺序不限。"
        }
      ]
    },
    {
      "section": "What happens when you have both",
      "title": "两者兼有时的行为",
      "content": [
        {
          "type": "prose",
          "text": "在项目中，始终由项目版本响应，即使你输入的是全局 astryx 命令；在项目之外，则由你的全局版本响应。{@link generic:who-answers}"
        }
      ]
    },
    {
      "section": "More on global mode",
      "title": "关于全局模式的更多内容",
      "content": [
        {
          "type": "prose",
          "text": "本页属于 {@link namespace:global} 的一部分，该命名空间说明了什么是全局模式以及各个部分如何工作。要启动应用：{@link generic:getting-started}。"
        }
      ]
    }
  ]
};
