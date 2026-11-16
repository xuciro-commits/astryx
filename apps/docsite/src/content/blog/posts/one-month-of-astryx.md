---
slug: one-month-of-astryx
title: 'Astryx 上线一个月'
description: '上线一个月：Astryx 的现状，以及我们接下来的方向。'
dek: '[2026 年 6 月 18 日上线](/blog/introducing-astryx)。一个月过去：Astryx 的现状，以及我们接下来的方向。'
date: '2026-07-22'
type: 'update'
authors: [liya, ernest]
tags: [Astryx, 设计系统, 开源]
coverImage: '/blog/one-month-of-astryx/header.jpg'
coverAlt: '“Astryx 上线一个月”主题头图，产品截图环绕着“1 month”字样'
relatedDocs:
  - title: '介绍 Astryx'
    href: '/blog/introducing-astryx'
---

一个月前，我们将 **Astryx** 开源：这是一个以代码为先、对 AI 友好的 React + StyleX 设计系统，在 Meta 内部打磨了八年。我们的目标是，为每一位构建者——无论是人还是 agent——提供一个完全可定制、达到生产级标准，并且能被如今编写大部分 UI 的工具所理解的设计系统。一个月过去，早期信号表明这个方向引起了共鸣。

## 首月数据

- **GitHub：** 10.3K 星标 · 758 次 fork · 发布周期间在全部仓库中一度登上 GitHub Trending 第 2 名
- **npm：** @astryxdesign/core 190K · cli 126K · themes 480K，覆盖 7 个主题
- **[astryx.atmeta.com](http://astryx.atmeta.com/):** 224K 访客 · 1.79M 页面浏览量
- **社区贡献：** 87 人提交了 PR · 61 位作者向所有分支推送了 815 次提交

## 用 Astryx 构建的项目

第一个月里就有真实项目基于 Astryx 上线：有的公司在[发布后数小时内就重建了整个网站](https://moonveil.ai/)，也有越来越多社区站点已进入生产环境。

![用 Astryx 构建的网站和产品界面拼贴图](/blog/one-month-of-astryx/community-showcase.png)

## 社区怎么说

讨论最终都指向 Astryx 的独特之处：CLI、MCP server，以及 agent 优先的架构：

- Dominic Nguyen（Chromatic 与 Storybook 创始人）在一篇后来成为 Astryx 全渠道互动量最高的帖子中，将 Astryx 形容为**“为 agent 创造大部分 UI 的世界而生的基础设施”**（[链接](https://www.linkedin.com/posts/domyen_meta-just-open-sourced-a-design-system-theyve-share-7478518968098529280-R3p4/)）。
- Aurora Scharff（React/Vercel 工程师）分析了 Astryx 网站，并通过 Cache Components 迁移让导航**快得几乎瞬间完成，最高提升至 3 倍**（[链接](https://x.com/aurorascharff/status/2078110561640845708)）。
- Yangshun Tay（GreatFrontEnd 联合创始人）称 Astryx 是**“Tokenmaxxing 的正确打开方式”**，盛赞其丰富的组件集（包括 agentic UI）、灵活的 CSS 变量主题能力，以及对 AI 友好的 CLI（[链接](https://www.linkedin.com/posts/yangshun_meta-just-released-a-new-frontend-open-source-ugcPost-7477245799542837248-pcwN/)）。
- 短短几天内，[日本](https://x.com/wataryooou/status/2070445582993244377)、[韩国](https://x.com/ngnicky/status/2074380595078258779)和[中国](https://m.sohu.com/a/1042830838_120333371)开发者社区就自发出现了独立的源码级分析。
- 社区也在反哺：从 Figma 映射工作，到开发者与我们一起钻研 MCP 内部机制；社区主导的主题和翻译也在不断积聚势头。

## 我们的方向

发布只是起点，而不是终点。我们现在的重心是质量与深度，包括加固组件、扩充主题与模板、收紧 AI 编写闭环（vibe tests + design-judge），以及让外部贡献者更容易与我们一起构建。从今往后，社区贡献都是我们最重要的输入之一。

## 感谢

感谢每一位点星、分享、提 issue 和提交 PR 的人。因为有你们，Astryx 才更好，而我们才刚刚开始。

## 展示你的作品

我们正在收集基于 Astryx 的优秀案例。如果你已经上线或正在用 Astryx 构建想要展示的作品，请将网站链接或截图发送至 **astryxdesign@meta.com**。入选项目将登上 [**astryx.atmeta.com**](http://astryx.atmeta.com)，我们还会送上一份小小的谢意——Astryx 周边 🤗。
