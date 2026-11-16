// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for configuration.doc.mjs.
export const docsZh = {
  "title": "配置",
  "summary": "设置集成在应用中的行为：Agent 指南、用户运行的命令、调试与缺口报告，以及随集成扩展而增加的更多内容。",
  "slots": {
    "guides": {
      "title": "配置"
    }
  },
  "blocks": [
    {
      "i": 0,
      "type": "prose",
      "text": "在全局模式下：当你的包为计算机安装、与全局 CLI 并列时，其清单的读取方式与在项目中相同，并在任何项目之外的文件夹中生效；对等版本范围会对照全局 CLI 的发行版进行检查。参见 {@link namespace:global} 和 {@link generic:global-integrations}。"
    },
    {
      "i": 1,
      "type": "prose",
      "text": "除了随包交付的内容之外，集成还可以设置其在应用中的行为：它为在该应用中工作的 AI Agent 提供的指南、其用户运行 CLI 时使用的命令，以及它为每次 CLI 运行保留的记录。打开下方任意一项进行设置。"
    }
  ],
  "sections": []
};
