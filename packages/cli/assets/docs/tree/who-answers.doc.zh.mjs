// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for who-answers.doc.mjs.
export const docsZh = {
  "title": "哪个版本在回答，以及为什么",
  "description": "在项目内部，无论你启动哪个 astryx 命令，都由项目自己的 CLI 回答；在只安装了 Core 的项目中，则由你启动的 astryx 命令回答。在任何项目之外，由你的全局安装回答。本页说明如何查看是哪一个在回答。",
  "sections": [
    {
      "section": "In a project, the project's version",
      "title": "在项目内，由项目自己的版本回答",
      "content": [
        {
          "type": "list",
          "items": [
            "项目按建议安装了 CLI：无论版本如何，都由该 CLI 回答，一如既往。当你改为输入全局 astryx 命令时，它会把本次运行转交给项目的 CLI，参数、输入、输出和退出状态都相同，因此两个命令给出的答案一致。",
            "项目只安装了 Core，或者尚未安装任何内容（例如全新克隆）：由你启动的 astryx 命令回答，一如既往。当其版本与项目的 Core 不同时，命令之后每天最多会提示一次，给出按 Core 版本添加 CLI 的命令。",
            "项目的 CLI 已安装但无法启动：改为由与项目 Core 版本相同的 CLI 回答（依次取自已安装的 Core、锁定文件，或声明范围允许的最新版本），并一次性安装到缓存中。"
          ]
        },
        {
          "type": "prose",
          "text": "组件来自 `@astryxdesign/core`，模板、文档和智能体指南来自 CLI。在项目中，该 Core 就是项目安装的那个，因此安装好项目依赖后，组件命令可以离线工作。在项目外部，或在尚未安装任何内容的项目（全新克隆）中，它们使用回答版本自己的 Core，来源是 CLI 旁边或缓存；当该 Core 无法下载时，错误会提示安装项目依赖。当项目的 CLI 与 Core 版本不同时，`{@command doctor}` 会发出警告并打印将它们统一到一个版本的命令。"
        }
      ]
    },
    {
      "section": "Outside a project, your global install",
      "title": "在项目外，由全局安装回答",
      "content": [
        {
          "type": "prose",
          "text": "在不属于任何项目的文件夹中，你的全局安装会像使用其版本的全新项目那样回答，因此你和你的智能体可以读取所有组件和文档。它绝不会自行安装更新的版本。"
        },
        {
          "type": "prose",
          "text": "少数命令作用于你的电脑而不是某个文件夹，例如 `{@command init --user}`：这些命令在任何文件夹中都会由你的全局安装回答。"
        }
      ]
    },
    {
      "section": "See which version answered",
      "title": "查看是哪个版本在回答",
      "content": [
        {
          "type": "prose",
          "text": "在只安装了 Core 的项目中，命令之后的提示如下，每个项目每天最多出现一次："
        },
        null,
        {
          "type": "prose",
          "text": "否则，在文本模式下，标准错误上会有一行指出该版本，除非直接由项目自己的 CLI 回答："
        },
        null,
        {
          "type": "prose",
          "text": "使用 `--json` 时不会打印额外内容；每个结果改为携带 `meta.answeredBy`（{@link generic:reference}）："
        },
        null
      ]
    },
    {
      "section": "Commands Astryx prints",
      "title": "Astryx 打印的命令",
      "content": [
        {
          "type": "prose",
          "text": "CLI 为你打印的待运行命令都以一个能到达相同版本的名称开头：在项目中使用项目的运行器（例如 `pnpm exec astryx`），在项目外部且由全局安装回答时使用 `astryx`，否则使用固定到该版本的 CLI，例如 `{@pm dlx @astryxdesign/cli@0.6.8}`。集成可以指定自己的命令：{@link generic:cli-command}。"
        }
      ]
    },
    {
      "section": "More on global mode",
      "title": "更多关于全局模式",
      "content": [
        {
          "type": "prose",
          "text": "本页属于 {@link namespace:global}，它解释了什么是全局模式以及各个部分如何工作。要检查你的电脑，请在任何项目之外运行 `{@command doctor}`（{@link command:doctor}）。Monorepo：{@link generic:monorepos}。"
        }
      ]
    }
  ]
};
