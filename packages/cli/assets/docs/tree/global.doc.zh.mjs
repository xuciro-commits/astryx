// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for global.doc.mjs.
export const docsZh = {
  "title": "全局模式",
  "summary": "在你的计算机上安装一次 Astryx，即可在任何文件夹中使用。每个项目仍运行自己的 Astryx 版本，因此全局安装绝不会改变项目所获得的内容。",
  "slots": {
    "guides": {
      "title": "全局模式问答"
    }
  },
  "blocks": [
    {
      "i": 0,
      "type": "prose",
      "text": "全局模式是指为你的计算机安装一次 Astryx CLI，让 astryx 命令随处可用：在你的项目中、在空文件夹中，以及对每个编码 Agent 都可用。在项目内，由项目自己的 Astryx 版本做出回答，因此你的全局安装绝不会改变项目所获得的内容。"
    },
    {
      "i": 2,
      "type": "heading",
      "text": "你能获得什么"
    },
    {
      "i": 3,
      "type": "list",
      "items": [
        "在任何文件夹中都能使用文档、组件、模板和搜索，即使还没有项目。",
        "你计算机上的每个编码 Agent 都能了解 Astryx，因为 CLI 会在 Agent 工具查找的位置维护一份简短指南。",
        "每个项目保留自己的版本：在项目中，无论你运行哪个 astryx 命令，都由项目的版本回答。"
      ]
    },
    {
      "i": 4,
      "type": "heading",
      "text": "运行哪个版本"
    },
    {
      "i": 5,
      "type": "table",
      "headers": [
        "运行位置",
        "由哪个版本回答"
      ],
      "rows": [
        [
          "项目内",
          "项目自己的 CLI。在仅安装 `@astryxdesign/core` 的项目中，由你启动的 astryx 命令回答，并每天提示一次添加 CLI。"
        ],
        [
          "任何项目之外",
          "你的全局版本。"
        ],
        [
          "针对计算机的命令，例如 `{@command init --user}`",
          "你的全局版本，在任何文件夹中。"
        ]
      ]
    },
    {
      "i": 6,
      "type": "prose",
      "text": "不确定要项目安装、全局安装还是两者都要：{@link generic:project-global-or-both}。详细信息：{@link generic:who-answers}。"
    },
    {
      "i": 7,
      "type": "heading",
      "text": "更新"
    },
    {
      "i": 8,
      "type": "prose",
      "text": "你的全局安装绝不会自行升级，也不会升级项目。当有新版本发布时，成功执行的命令会在末尾显示两行提示，每天最多一次：{@link generic:updates}。"
    },
    {
      "i": 9,
      "type": "heading",
      "text": "Agent"
    },
    {
      "i": 10,
      "type": "prose",
      "text": "CLI 会在你的主目录中 Agent 工具查找的位置维护一份简短的 Astryx 指南，让在任何地方工作的 Agent 都知道 Astryx 就在那里：{@link generic:computer-agent-guide}。"
    },
    {
      "i": 11,
      "type": "heading",
      "text": "集成"
    },
    {
      "i": 12,
      "type": "prose",
      "text": "与全局安装一起安装的集成可在项目之外工作。在项目内，只有项目自己的集成才会生效：{@link generic:computer-integrations}。构建集成：{@link generic:global-integrations}。"
    },
    {
      "i": 13,
      "type": "heading",
      "text": "更多"
    },
    {
      "i": 14,
      "type": "list",
      "items": [
        "安装与离线工作：{@link generic:install-once}。",
        "Monorepo 和嵌套文件夹：{@link generic:monorepos}。",
        "CI 和容器：{@link generic:ci-and-containers}。",
        "遇到问题：{@link generic:problems}。",
        "卸载与重置：{@link generic:uninstall}。",
        "所有路径、设置、JSON 字段和错误码：{@link generic:reference}。",
        "每个命令在项目之外的行为：{@link namespace:commands}。"
      ]
    }
  ],
  "sections": []
};
