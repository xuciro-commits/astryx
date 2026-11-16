// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for monorepos.doc.mjs.
export const docsZh = {
  "title": "Monorepo 与嵌套文件夹",
  "description": "Astryx 如何查找文件夹所属的项目，以及在 monorepo、嵌套应用或位于另一个项目内的克隆仓库中由哪个版本响应。",
  "sections": [
    {
      "section": "How a project is found",
      "title": "如何查找项目",
      "content": [
        {
          "type": "prose",
          "text": "Astryx 从当前文件夹向上搜索：在那里或上面几层文件夹中安装的 `@astryxdesign/core` 或 `@astryxdesign/cli`，否则是最近的声明了其中之一的 `package.json`，直到仓库根目录。完全没有的文件夹属于项目外。"
        }
      ]
    },
    {
      "section": "Workspaces",
      "title": "工作区",
      "content": [
        {
          "type": "list",
          "items": [
            "声明了 Astryx 的工作区成员是独立项目，即使包被提升到仓库根目录也是如此。根目录的 CLI 会照常响应它；如果成员有自己的 Core 且任何地方都没有 CLI，则由你启动的 astryx 命令响应。",
            "没有自己的 `package.json` 的文件夹（例如 `src/` 或 `scripts/`）属于其上层项目。",
            "自行构建 CLI 的仓库（CLI 位于 `packages/cli`，Core 位于 `packages/core`）会运行该 CLI。"
          ]
        }
      ]
    },
    {
      "section": "Nested folders",
      "title": "嵌套文件夹",
      "content": [
        {
          "type": "list",
          "items": [
            "位于另一个项目内的文件夹（例如嵌套应用或克隆仓库）会以外层项目的发布版本响应。",
            "文件夹名称按照文件系统的比较方式进行比较：通过链接访问的文件夹，或在 macOS 或 Windows 中以不同大小写输入的文件夹，都会像该文件夹本身一样响应。",
            "在 Yarn Plug'n'Play 项目中，Astryx 看不到项目自己的 CLI，因此由你启动的 astryx 命令响应。通过 Yarn（`yarn astryx`）运行项目的 CLI 即可直接使用它。"
          ]
        }
      ]
    },
    {
      "section": "More on global mode",
      "title": "关于全局模式的更多内容",
      "content": [
        {
          "type": "prose",
          "text": "属于 {@link namespace:global}：什么是全局模式以及各个部分如何工作。"
        }
      ]
    }
  ]
};
