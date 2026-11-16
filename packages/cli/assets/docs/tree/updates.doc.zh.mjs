// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for updates.doc.mjs.
export const docsZh = {
  "title": "更新与通知",
  "description": "你的全局安装每天检查一次较新版本，并在命令成功后打印两行通知。它绝不会自动升级自身或项目。",
  "sections": [
    {
      "section": "The notice",
      "title": "通知",
      "content": [
        {
          "type": "prose",
          "text": "每天一次（第一天除外），你的全局安装会在后台检查注册表中的 `latest` 版本，不会拖慢命令。当存在较新版本时，成功执行的命令会在标准错误中打印两行内容，每天最多一次："
        },
        null,
        {
          "type": "list",
          "items": [
            "命令取决于当初安装你的全局副本所用的包管理器：`npm i -g`、`pnpm add -g`、`yarn global add`、`bun add -g` 或 `volta install`。通过包管理器自身设置（`BUN_INSTALL`、Yarn 的 `global-folder`、`PNPM_HOME` 或 npm 的 prefix）移动过的全局文件夹，在该设置指向它时也算数；应用自身的副本永远不会运行更新检查。",
            "当最新版本需要比你的计算机所运行的更新的 Node 时，第二行会说明应先安装哪个 Node。",
            "在项目内部，通知针对的是项目的版本，并会给出项目的安装命令和 `upgrade` 命令。安装命令始终会在 Core 旁边一并添加 CLI，因此仅安装了 Core 的项目也会拥有自己的 CLI，正如推荐的那样。"
          ]
        }
      ]
    },
    {
      "section": "In a project",
      "title": "在项目中",
      "content": [
        null
      ]
    },
    {
      "section": "Turn it off",
      "title": "关闭通知",
      "content": [
        {
          "type": "prose",
          "text": "在以下情况下不会打印通知：使用 `--json` 时、命令失败后、设置了 `CI` 环境变量时，或设置了 `NO_UPDATE_NOTIFIER` 时；设置任一变量后，CLI 也不会检查注册表。与某些 CLI 不同，即使标准错误不是终端也会打印通知，因为代理程序运行时没有终端。"
        },
        {
          "type": "prose",
          "text": "`{@command doctor}` 可通过其 `newest-release` 检查随时显示相同信息，并在上次通知未打印时说明原因。上次检查运行的时间以及每次通知打印的时间都保存在设置文件夹中的 `state.json` 里（{@link generic:reference}）。"
        }
      ]
    },
    {
      "section": "More on global mode",
      "title": "关于全局模式的更多内容",
      "content": [
        {
          "type": "prose",
          "text": "本页是 {@link namespace:global} 的一部分，该部分解释了什么是全局模式以及各部分如何工作。升级项目：{@link command:upgrade}。"
        }
      ]
    }
  ]
};
