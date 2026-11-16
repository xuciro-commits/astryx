// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for uninstall.doc.mjs.
export const docsZh = {
  "title": "卸载与重置",
  "description": "移除全局安装、它保留的智能体指南及其使用的文件夹，或重置它们以重新开始。",
  "sections": [
    {
      "section": "First, remove the agent guide",
      "title": "首先，移除智能体指南",
      "content": [
        {
          "type": "prose",
          "text": "在 CLI 仍处于安装状态时，从你的主目录中移除智能体指南："
        },
        null,
        {
          "type": "prose",
          "text": "或者删除 `~/.agents/skills/astryx` 以及 {@link generic:computer-agent-guide} 中列出的指向它的链接。"
        }
      ]
    },
    {
      "section": "Uninstall",
      "title": "卸载",
      "content": [
        null,
        {
          "type": "prose",
          "text": "项目不受影响：每个项目会保留其安装的 CLI（如果有）。"
        }
      ]
    },
    {
      "section": "Reset",
      "title": "重置",
      "content": [
        {
          "type": "prose",
          "text": "删除任一文件夹即可重置；Astryx 会在下次运行时重新创建所需内容。"
        },
        {
          "type": "table",
          "headers": [
            "文件夹",
            "Linux",
            "macOS",
            "Windows"
          ],
          "rows": [
            [
              "缓存：项目版本、已保存的 discover 答案",
              "`~/.cache/astryx`",
              "`~/Library/Caches/astryx`",
              "`%LOCALAPPDATA%\\astryx\\Cache`"
            ],
            [
              "设置：更新检查、智能体指南设置及其链接",
              "`~/.config/astryx`",
              "`~/Library/Application Support/astryx`",
              "`%APPDATA%\\astryx`"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "在 Linux 上，当 `XDG_CACHE_HOME` 和 `XDG_CONFIG_HOME` 设置为绝对路径时，会移动这些文件夹的位置。"
        }
      ]
    },
    {
      "section": "More on global mode",
      "title": "更多关于全局模式",
      "content": [
        {
          "type": "prose",
          "text": "本页属于 {@link namespace:global} 的一部分，该文档说明全局模式是什么以及各部分的运作方式。"
        }
      ]
    }
  ]
};
