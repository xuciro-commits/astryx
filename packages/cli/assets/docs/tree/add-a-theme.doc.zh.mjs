// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for add-a-theme.doc.mjs.
export const docsZh = {
  "title": "添加主题",
  "description": "在你的包中搭建一个主题——空白主题，或从现有主题派生。",
  "sections": [
    {
      "section": "Add a theme",
      "title": "添加主题",
      "content": [
        {
          "type": "prose",
          "text": "使用小写 kebab-case 的 slug 运行 `integration add theme`。它会把一个空白主题（一个 `defineTheme` 骨架及其描述符）写入以该 slug 命名的文件夹中。"
        },
        null,
        null,
        {
          "type": "prose",
          "text": "`oceanTheme.ts` 导出 `oceanTheme`，即一个 `defineTheme` 源，而 `oceanTheme.doc.mjs` 是 `theme list` 读取的描述符。该命令还会声明 `./themes/ocean` 和 `./themes/ocean.css` 包导出。所有字段都在 {@link schema:theme-doc} 中。"
        },
        {
          "type": "prose",
          "text": "源文件和构建产物会随你的包发布。使用 `theme build` 构建源文件，然后在发布前运行 `integration verify`。应用会运行 `theme add` 来记录并导入构建后的模块和样式表；`theme eject` 会创建独立的源派生。参见 {@link generic:use-a-theme-in-an-app}。"
        }
      ]
    },
    {
      "section": "Start from an existing theme",
      "title": "从现有主题开始",
      "content": [
        {
          "type": "prose",
          "text": "如果要从现有主题开始而不是空白主题，请传入 `--from`。它会复制该主题作为你后续分叉的起点——即一个派生，不会留下回链。"
        },
        null,
        {
          "type": "prose",
          "text": "副本会保留基础主题使用的包，例如用于图标的 `lucide-react`：`--from` 会将它们添加到你的 `dependencies` 中，因此安装你的包的应用也会获得它们。在构建主题之前，请重新安装依赖。"
        },
        {
          "type": "prose",
          "text": "当你想要进行较大改动时，请使用 `--from`。对于应保持与基础主题关联的小改动，请改用 `extends`（{@link generic:define-the-theme}）。"
        }
      ]
    },
    {
      "section": "Ship several themes",
      "title": "发布多个主题",
      "content": [
        {
          "type": "prose",
          "text": "一个包可以发布多个主题。每个 slug 运行一次 `integration add theme`；每个主题都有自己的文件夹和描述符，`theme list` 会显示全部。"
        }
      ]
    },
    {
      "section": "In global mode",
      "title": "全局模式",
      "content": [
        {
          "type": "prose",
          "text": "在全局模式下：当用户为他们的计算机安装你的包（与全局 CLI 并列）时，你的主题会列在任何项目之外的文件夹中，在那里 `theme add` 会列出但不会写入任何内容；在项目内，只有项目安装了你的包时才会列出。参见 {@link namespace:global} 和 {@link generic:global-integrations}。"
        }
      ]
    }
  ]
};
