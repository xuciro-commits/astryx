---
title: '最好的 CLI，是你永远不用运行的 CLI'
description: 'Astryx CLI 是什么、为什么以文档为先，以及所有命令的导览。'
date: '2026-07-10'
type: 'engineering'
authors:
  - 'josephfarina'
tags:
  - 'CLI'
  - 'AI'
  - '文档'
coverImage: '/blog/the-astryx-cli/cover.gif'
coverAlt: '一个正在运行 astryx init 的终端'
relatedDocs:
  - title: 'AI 是个模仿者，所以我们给了它好例子去模仿'
    href: '/blog/astryx-cli-build-command'
  - title: 'Astryx 是如何运作的'
    href: '/blog/how-astryx-works'
  - title: 'CLI'
    href: '/docs/cli'
---

这是 Astryx CLI 系列的第一篇。它是 agent 用来构建 Astryx 应用的工具，或者按我们喜欢的说法，是“机器的界面”。我们为此花了很多心思，力求把它做对。

## CLI 就是文档

Agent 现在就生活在终端里。给它一个好工具，它就能用好。但我们交给 agent 的大多数工具还不够好。于是我们做了一个决定：CLI 就是文档。每一份文档、每一个示例、每一处参考都从这里开始。你正在阅读的文档站是 CLI 的消费者，而不是反过来。CLI 是唯一的事实来源。Agent 读到的永远是我们亲自编写和维护的那份原文。没有第二份副本会不同步，也不会有内容过期。

文档只是其中一部分。CLI 还会提供模板，向 agent 展示如何构建真实页面；它能构建主题；也能在全部内容中搜索。最好的 CLI，是你永远不用运行的 CLI——由 agent 来运行。所有代码都开源，你可以[亲自看看](https://github.com/meta/astryx/blob/main/apps/docsite/scripts/generate-data.mjs)。或者干脆别读这篇文章了，让你的 agent 运行 `astryx blog`，它会替你读。

## 导览

接下来是有意思的部分。你其实并不需要这些，你的 agent 都会知道。不过如果你好奇，我就带你过一遍 CLI 中你可能用到的每个部分。我们从空文件夹一路走到上线应用，只讲大方向。

**初始化。** `astryx init` 安装所需的包，并写入你的 agent 文件。你甚至不需要维护这个文件——我们替你维护。你当然也可以按自己的意愿修改。而 `upgrade` 会让它在系统演进时保持最新。

**学习。** `astryx search` 会同时在组件、hooks、文档和模板中排序结果。`astryx component` 打印某个组件的 props、示例和源码，`astryx hook` 对 hooks 做同样的事。`astryx docs` 涵盖 tokens、颜色、字体、动效以及我们的设计原则等参考主题。

**组合。** `astryx build` 会成为你最好的朋友。告诉它你要做什么，它会为你的 agent 指出最接近的模板、合适的区块，以及用来补齐缺口的组件。`astryx template` 可以把页面模板直接放进你的项目。`astryx layout` 则能根据一段简短描述勾勒出页面结构，供你进一步填充。

**定制。** `astryx theme build` 将主题编译为生产可用的 CSS 和 JS。`astryx swizzle` 会在你想完全掌控某个组件时，把它的完整源码弹出到你的项目中。

**保持更新。** `astryx upgrade` 运行 codemods，在版本之间迁移你的代码，同时刷新 agent 文档。`astryx doctor` 会发现问题并告诉你如何修复。

## 一个界面，多种读者

我们让每条命令都遵循同一套 JSON 接口，也保证错误码稳定。Agent 可以依赖这两者进行程序化操作。如果 agent 需要，一个 manifest 能在一次调用中描述整个工具。大多数命令本身就能说明自己。Agent 可以自行摸索路径。此外还有 dense 模式，可以消耗更少的 token。

## 这一切的意义

用 Astryx 构建应用的 agent 不该靠猜。无论要做什么，都只差一条命令。

阅读第二篇：[AI 是个模仿者，所以我们给了它好例子去模仿](/blog/astryx-cli-build-command)。
