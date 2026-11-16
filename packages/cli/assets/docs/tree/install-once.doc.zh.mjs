// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for install-once.doc.mjs.
export const docsZh = {
  "title": "全局安装 Astryx",
  "description": "使用 npm、pnpm、Yarn、Bun 或 Volta 为你的电脑安装一次 Astryx CLI，以及离线时会发生什么。",
  "sections": [
    {
      "section": "Install it",
      "title": "安装",
      "content": [
        {
          "type": "prose",
          "text": "使用包管理器安装 CLI 包。此后一条 astryx 命令即可在每个文件夹中使用。"
        },
        null,
        {
          "type": "prose",
          "text": "也请在每个项目中保留 CLI 安装：这样可以为队友和 CI 固定其版本（{@link generic:project-global-or-both}）。在项目内，无论你输入哪条 astryx 命令，都由项目版本响应。在项目外，全局安装会用自己的版本响应；你指定的版本（例如 `{@pm dlx @astryxdesign/cli@0.7.0}`）则会以该确切版本响应。"
        }
      ]
    },
    {
      "section": "Permission denied (EACCES)",
      "title": "权限被拒绝（EACCES）",
      "content": [
        {
          "type": "prose",
          "text": "如果 `npm i -g` 因 `EACCES` 失败，请不要使用 `sudo`。给 npm 一个你拥有的全局文件夹，然后将其 `bin` 文件夹添加到 PATH，或使用 nvm、fnm 或 Volta 等 Node 版本管理器："
        },
        null,
        {
          "type": "prose",
          "text": "Astryx 的更新提示会在升级命令中指明该文件夹。"
        }
      ]
    },
    {
      "section": "Versions for your projects",
      "title": "项目使用的版本",
      "content": [
        {
          "type": "prose",
          "text": "当项目自己的 CLI 已安装但无法启动时，Astryx 会改为运行与项目 Core 版本相同的 CLI，将其一次性安装到主目录的缓存中并重复使用。该过程使用 npm，因此你的 npm registry、代理和离线设置都会生效。删除缓存是安全的：项目需要时版本会重新下载。缓存位置：{@link generic:reference}。"
        }
      ]
    },
    {
      "section": "Offline",
      "title": "离线",
      "content": [
        {
          "type": "prose",
          "text": "在仅安装 Core 的项目中，你的全局安装可以离线响应；任何安装了自己 CLI 的项目也是如此。在项目外，读取组件的命令（例如 `{@command component Button}`）需要全局版本的 Core：在你联网运行任意命令后，全局安装会在后台将其一次性下载到缓存中，此后即可离线工作（CI 中除外，那里不会自行下载：{@link generic:ci-and-containers}；Windows 上除外，那里第一条组件命令会下载它）。只有自身 CLI 无法启动的项目才需要安装或缓存版本；当既未安装也未缓存且无法获取时，你的全局安装会以一行警告响应，Astryx 会等待 2 分钟后再次尝试下载（连续第二次失败后等待 10 分钟）。{@link generic:problems} 中有确切的提示信息。"
        }
      ]
    },
    {
      "section": "More on global mode",
      "title": "关于全局模式的更多内容",
      "content": [
        {
          "type": "prose",
          "text": "本页是 {@link namespace:global} 的一部分，该部分说明了什么是全局模式以及各个部分如何工作。下一步：{@link generic:who-answers}。"
        }
      ]
    }
  ]
};
