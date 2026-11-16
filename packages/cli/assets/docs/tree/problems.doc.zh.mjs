// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for problems.doc.mjs.
export const docsZh = {
  "title": "全局模式故障排除",
  "description": "Astryx 在全局模式下打印的每一行信息、其含义以及应对方法。此外还有包管理器导致的安装问题：权限、PATH、Corepack 和 Windows。",
  "sections": [
    {
      "section": "\"astryx: answered by …\"",
      "title": "回答来源信息",
      "content": [
        null,
        {
          "type": "prose",
          "text": "这是信息提示，不是错误：它说明是哪个版本做出了回答以及原因。它仅在文本模式下打印，绝不会与 `--json` 一起出现。其他形式见 {@link generic:who-answers}。"
        }
      ]
    },
    {
      "section": "\"installing CLI release … into the per-user cache\"",
      "title": "正在安装 CLI 版本到用户缓存",
      "content": [
        null,
        {
          "type": "prose",
          "text": "项目自带的 CLI 无法启动，因此 Astryx 正在将与其 Core 版本相同的 CLI 一次性安装到缓存中。第二行表示另一次运行正在安装它；本次运行会等待，最长 15 分钟。要避免等待，请安装项目依赖。"
        }
      ]
    },
    {
      "section": "\"A new release of Astryx is available\"",
      "title": "Astryx 有新版本可用",
      "content": [
        null,
        {
          "type": "prose",
          "text": "有更新版本发布；请运行所显示的命令。当最新版本需要更新的 Node 时，第二行会先注明所需的版本。要停止通知，请设置 `NO_UPDATE_NOTIFIER`：{@link generic:updates}。"
        }
      ]
    },
    {
      "section": "\"The astryx command on this computer runs CLI …\"",
      "title": "本机 astryx 命令运行的是旧版 CLI",
      "content": [
        null,
        {
          "type": "prose",
          "text": "PATH 上的第一个 astryx 命令是全局模式之前的版本，因此它会忽略你项目的版本。请运行所显示的命令，或移除该安装。`{@command doctor}` 会在其 `cli-on-path` 检查中列出 PATH 上的每个 astryx 命令。"
        }
      ]
    },
    {
      "section": "\"could not get Astryx … to match this project's Core\"",
      "title": "无法获取与项目 Core 匹配的 Astryx 版本",
      "content": [
        null,
        {
          "type": "prose",
          "text": "项目自带的 CLI 无法启动，因此 Astryx 需要与其 Core 版本相同的 CLI，但无法获取，命令仍会运行：由你启动的 astryx 命令做出回答，与全局模式之前一样。在你修复原因之前，它的回答可能与项目的 Core 不匹配。使用 `--json` 时，`meta.answeredBy.copy` 为 `fallback`。Astryx 会等待 2 分钟后再次尝试下载；连续第二次失败后等待 10 分钟；重新安装项目依赖可修复项目自带的 CLI。"
        },
        {
          "type": "list",
          "items": [
            "无法访问注册表：你处于离线状态，或代理阻止了访问。Astryx 使用 npm 安装，因此请在 `.npmrc` 中设置 npm 的 `proxy`、`https-proxy` 或 `registry`，或将 CLI 添加到项目中并安装其依赖。",
            "注册表中没有它：私有注册表未包含 Astryx 包。请将 `@astryxdesign` 的 npm 注册表指向包含这些包的注册表。",
            "无法写入缓存：主目录为只读，例如在某些容器中。请将 `XDG_CACHE_HOME` 指向可写文件夹：{@link generic:ci-and-containers}。"
          ]
        }
      ]
    },
    {
      "section": "A global install that gets no update notice or agent guide",
      "title": "全局安装收不到更新通知或智能体指南",
      "content": [
        {
          "type": "prose",
          "text": "只有当包管理器自身的设置指明了某个副本所在的文件夹时，Astryx 才会将该副本视为已为你的电脑安装：npm 的全局 prefix、Bun 的 `BUN_INSTALL`、Yarn 的 `global-folder`、pnpm 的 `PNPM_HOME` 或它们的默认值。仅通过一次性标志选择的文件夹（例如 `{@pm-only yarn-classic \"uses the Yarn 1 global folder\" global add --global-folder ~/mine}`）不在任何设置中，因此 Astryx 会将该副本视为项目副本：没有每日更新检查，也没有智能体指南。请将该文件夹保存到你的设置中，以便 Astryx 知道这是全局安装："
        },
        null
      ]
    },
    {
      "section": "\"Core … could not be installed\" outside a project",
      "title": "项目外无法安装 Core",
      "content": [
        {
          "type": "prose",
          "text": "在项目外，读取组件的命令（`component`、`search`、`template`、`build` 等）使用全局版本的 Core。只有部分安装方式会随 CLI 附带 Core；否则，你的全局安装会在你联网运行某条命令后，在后台将其一次性下载到缓存中（在 Windows 上，第一条组件命令会下载它）；在此之前离线运行组件命令会失败，并报 `ERR_VERSIONS_UNAVAILABLE`。重新安装 CLI 没有帮助：联网运行任意命令一次，此后组件读取即可离线工作。在 CI 中不会在后台下载任何内容，因此那里的第一条组件命令需要访问注册表。全局模式页面（{@link namespace:global}）无论哪种方式都可离线阅读。"
        },
        {
          "type": "prose",
          "text": "在尚未安装任何内容的项目（例如全新克隆的仓库）中，同样的命令也使用该 Core；离线时错误信息为 `This project has no Core installed, and Core <version> could not be downloaded`：请安装项目依赖（`{@pm install}` 或你的包管理器的安装命令），此后由项目自带的 Core 做出回答。"
        }
      ]
    },
    {
      "section": "ERR_VERSIONS_UNAVAILABLE",
      "title": "ERR_VERSIONS_UNAVAILABLE 错误",
      "content": [
        {
          "type": "prose",
          "text": "只有当没有任何版本能做出回答时，运行才会以 `ERR_VERSIONS_UNAVAILABLE` 失败：在项目外需要 Core 的命令无法安装它，或找不到你指定的确切版本。"
        }
      ]
    },
    {
      "section": "Commands that need a project",
      "title": "需要项目的命令",
      "content": [
        null,
        {
          "type": "prose",
          "text": "更改应用或包的命令（例如 `theme use`、`integration add`、`swizzle` 和 `upgrade`）在项目外不会写入任何内容，并会说明它们需要什么。请在该项目中运行它们。每个命令的文档都说明它在项目外的行为（{@link namespace:commands}）；拒绝执行的新命令会使用 `ERR_PROJECT_REQUIRED`。"
        }
      ]
    },
    {
      "section": "Install problems",
      "title": "安装问题",
      "content": [
        {
          "type": "list",
          "items": [
            "`npm i -g` 因 `EACCES`（权限被拒绝）失败：不要使用 `sudo`。请使用 Node 版本管理器，或给 npm 一个你拥有的全局文件夹：`{@pm-only npm \"moves the npm global folder\" config set prefix ~/.npm-global}`，然后将 `~/.npm-global/bin` 添加到 PATH。",
            "安装后出现 `astryx: command not found`：包管理器的全局 bin 文件夹不在 PATH 上。`{@pm-only npm \"prints the npm global folder\" prefix -g}` 会显示 npm 的全局文件夹（在 macOS 和 Linux 上是其 `bin` 文件夹）；`{@pm-only pnpm \"sets up the pnpm global folder\" setup}` 会添加 pnpm 的全局文件夹。",
            "`pnpm add -g` 会以 `ERR_PNPM_NO_GLOBAL_BIN_DIR` 停止，常见于使用 Corepack 时：运行 `{@pm-only pnpm \"sets up the pnpm global folder\" setup}`，打开新终端后重试。Yarn 2 及更高版本没有 `yarn global`；请改用 `npm i -g`。",
            "Windows：npm 会将 `astryx.cmd` 放到 `%APPDATA%\\npm`，该路径必须在 PATH 上。如果 PowerShell 提示已禁用运行脚本，请运行 `astryx.cmd`，或使用 `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` 为当前用户允许脚本运行。",
            "存在两个安装，却运行了错误的一个：在项目外，`{@command doctor}` 会按 shell 尝试的顺序列出 PATH 上的每个 astryx 命令。"
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
          "text": "本页是 {@link namespace:global} 的一部分，该部分说明了什么是全局模式以及各个部分如何工作。"
        }
      ]
    }
  ]
};
