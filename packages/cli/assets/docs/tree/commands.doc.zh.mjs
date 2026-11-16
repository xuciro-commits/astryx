// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for commands.doc.mjs.
export const docsZh = {
  "title": "命令",
  "summary": "所有命令和子命令：用法、选项、示例、退出码，以及在项目之外的行为。",
  "slots": {
    "commands": {
      "title": "命令"
    }
  },
  "blocks": [
    {
      "i": 0,
      "type": "prose",
      "text": "在全局模式下：每个命令都会声明其在项目之外的行为（`outsideProject`）。大多数命令的表现与在新项目中相同；有些命令不写入任何内容，并会说明所需的项目；`doctor`、`init` 和 `upgrade` 的行为有所不同。行为不同的命令会在其 `In global mode:` 说明中描述该行为，CLI 测试会在空文件夹中针对每个命令声明的值运行该命令。在项目内，无论你输入哪个 astryx 命令，都由项目使用的 Astryx 发行版运行所有命令。参见 {@link namespace:global}。"
    }
  ],
  "sections": []
};
