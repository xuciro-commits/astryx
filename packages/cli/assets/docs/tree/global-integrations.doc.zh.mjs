// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for global-integrations.doc.mjs.
export const docsZh = {
  "title": "让你的集成在全局模式下工作",
  "description": "用户可以把你的集成安装在全局 Astryx 安装旁边，这样它就能在项目外的每个文件夹中工作；在项目内，只有项目自己的集成生效。下面是一份检查清单，并附有可用于试用它的确切命令。",
  "sections": [
    {
      "section": "First: your peer ranges must include the global CLI's version",
      "title": "首先：peer 版本范围必须包含全局 CLI 的版本",
      "content": [
        {
          "type": "prose",
          "text": "你的 `@astryxdesign/core`（以及使用时的 `@astryxdesign/cli`）`peerDependencies` 范围必须包含全局安装的 CLI 版本。如果不包含，Astryx 会在项目外跳过你的包，`{@command doctor}` 会发出警告并指出该范围。"
        },
        {
          "type": "prose",
          "text": "在未安装你的包的项目内，一旦你的 peer 范围允许该项目的发布版本，`{@command discover}` 就会提供它，并给出将其添加到该项目的命令。"
        }
      ]
    },
    {
      "section": "Where your integration works",
      "title": "集成在哪些位置生效",
      "content": [
        {
          "type": "list",
          "items": [
            "安装在应用中：无论用户运行哪个 `astryx`，它都会照常在该应用中工作，因为那里由应用版本的 Astryx 响应。",
            "安装在全局安装旁边（`{@pm install @astryxdesign/cli your-package --global}`），或由一起安装它们的工具安装在与 CLI 相同的文件夹中：它会在项目外的每个文件夹中工作。那里的用户和智能体可以看到它的组件、模板、文档、主题、codemod 和发现来源。",
            "仅全局安装，且位于未安装它的应用内：它在那里不会添加任何内容。当它支持应用的版本并成功加载时，`{@command discover}` 会将其列为应用可以添加的一项，并给出应用的安装命令。",
            "两种方式都安装：在该应用中使用应用内的副本。在你自己的包文件夹中，使用你的工作副本。"
          ]
        },
        {
          "type": "prose",
          "text": "Astryx 使用与应用集成相同的加载器和检查来加载全局集成，因此清单中不需要额外内容。"
        }
      ]
    },
    {
      "section": "Checklist",
      "title": "检查清单",
      "content": [
        {
          "type": "list",
          "items": [
            "声明你的包真正支持的 `@astryxdesign/core`（以及使用时的 `@astryxdesign/cli`）`peerDependencies` 范围。在项目外，如果该范围不包含全局版本，Astryx 会跳过你的包，`{@command doctor}` 会说明原因：范围过窄，全局用户在升级后会失去它；范围过宽，它可能会针对无法与其一起构建的 Core 加载。",
            "文档和模板中的导入应仅限于应用会随你的包一起安装的包，因为在项目外没有应用可供对照检查。",
            "如果你设置了 `cliCommand`，请注意在项目外它会作为 Astryx 打印的每条命令的前缀，而两个全局集成指定不同命令时会相互抵消，回退到 `astryx`（{@link generic:cli-command}）。在应用内，只有应用的集成生效。",
            "发布前，使用下面的步骤在全局环境中试用。"
          ]
        }
      ]
    },
    {
      "section": "Try it globally",
      "title": "在全局环境中试用",
      "content": [
        {
          "type": "prose",
          "text": "打包你的包，将其安装在全局 CLI 旁边，然后从空文件夹中查看："
        },
        null,
        {
          "type": "list",
          "items": [
            "`{@command discover}` 会将你的包列为已安装，并显示它添加的内容。",
            "`{@command docs}` 会列出你的主题，`{@command search <one of your component names>}` 能找到它们。",
            "`{@command doctor}` 的 `computer-integrations` 检查会将你的包列为已使用，且没有警告。",
            "在未安装它的应用中，`{@command discover}` 会将其列为应用可以添加的一项，并给出应用的安装命令，但它没有任何组件或文档出现。"
          ]
        },
        {
          "type": "prose",
          "text": "用 `{@pm remove your-package --global}` 再次移除它。"
        }
      ]
    },
    {
      "section": "More on global mode",
      "title": "关于全局模式的更多内容",
      "content": [
        {
          "type": "prose",
          "text": "面向安装你包的用户，全局模式如何工作：{@link namespace:global}。他们在全局集成方面的内容：{@link generic:computer-integrations}。"
        }
      ]
    }
  ]
};
