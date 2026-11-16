// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for ci-and-containers.doc.mjs.
export const docsZh = {
  "title": "CI 与容器",
  "description": "Astryx 在 CI 和容器中的行为：不检查更新、不打印通知，始终使用项目自己的版本，以及如何缓存版本或处理只读的主目录。",
  "sections": [
    {
      "section": "In CI",
      "title": "在 CI 中",
      "content": [
        {
          "type": "list",
          "items": [
            "大多数 CI 服务会设置 `CI=true`。当 `CI` 被设置为非空、非 `0`、非 `false` 的任何值时，Astryx 绝不检查更新，也绝不打印通知；`CI=false`、`CI=0` 和空的 `CI` 不算数。`NO_UPDATE_NOTIFIER` 无论设置为任何值，都会在任何环境中产生相同效果。",
            "将 `@astryxdesign/cli` 作为 devDependency 添加到项目，版本与 `@astryxdesign/core` 相同；这样 CI 会运行仓库中锁定的版本，不会拉取任何内容。CI 镜像中的全局安装也可以：在项目中，它会运行项目的版本。",
            "脚本读取的输出请使用 `--json`；它绝不会包含 answered-by 行或通知。"
          ]
        }
      ]
    },
    {
      "section": "Cache project versions",
      "title": "缓存项目版本",
      "content": [
        {
          "type": "prose",
          "text": "当项目安装了自己的 CLI，并且你先安装了项目依赖时，没有任何内容需要缓存。Astryx 只会将以下内容下载到缓存：项目自己的 CLI 无法启动时所需的 CLI 版本；以及在项目外部，全局安装为读取组件的命令所需的 Core。在 CI 中，它不会在后台下载任何内容，因此 CI 镜像中的全局安装会在第一次执行组件命令时拉取该 Core。若要在每次运行时跳过这些下载，请在两次运行之间缓存以下文件夹："
        },
        {
          "type": "table",
          "headers": [
            "Linux",
            "macOS",
            "Windows"
          ],
          "rows": [
            [
              "`~/.cache/astryx`（或 `$XDG_CACHE_HOME/astryx`）",
              "`~/Library/Caches/astryx`",
              "`%LOCALAPPDATA%\\astryx\\Cache`"
            ]
          ]
        }
      ]
    },
    {
      "section": "Read-only home folders",
      "title": "只读主目录",
      "content": [
        {
          "type": "prose",
          "text": "当缓存无法写入时，若项目自己的 CLI 无法启动，则由全局安装回答，并给出指名该文件夹的警告。请将 `XDG_CACHE_HOME` 指向可写的绝对路径，或重新安装项目依赖。全局安装的每日检查和智能体指南在无法写入时会被静默跳过。"
        }
      ]
    },
    {
      "section": "Machines that keep only the home folder",
      "title": "仅保留主目录的机器",
      "content": [
        {
          "type": "prose",
          "text": "有些智能体机器在重启之间会保留主目录，但不保留系统文件夹。那里的全局安装会在重启后消失，而主目录中的智能体指南仍保留，于是智能体被要求运行一个已不存在的全局 astryx 命令；指南会说明，当找不到该命令时，应运行安装 CLI 所用的命令，例如 `{@pm install @astryxdesign/cli --global}`，`astryx doctor` 也会指出相同的步骤。要让 CLI 在重启后仍然可用，请将它安装到主目录中的某个文件夹，并把其 `bin` 文件夹加入 PATH（就像处理权限错误时那样，见 {@link generic:install-once}），或者在机器启动时运行该命令。"
        }
      ]
    },
    {
      "section": "More on global mode",
      "title": "更多关于全局模式",
      "content": [
        {
          "type": "prose",
          "text": "本页属于 {@link namespace:global}，它解释了什么是全局模式以及各个部分如何工作。"
        }
      ]
    }
  ]
};
