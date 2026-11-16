---
title: '谁需要 Figma 组件库？'
description: '介绍 Astryx Figma 组件库：它由一个 Night Watch 构建并自行维护，在每次小版本发布时与代码保持同步。'
date: '2026-08-05'
type: 'update'
authors:
  - 'ernest'
tags:
  - 'Figma'
  - 'AI'
  - '发布'
coverImage: '/blog/who-needs-a-figma-library/cover.png'
coverAlt: '一个 Figma 画布，展示 Astryx Button 组件——一个深色圆角按钮，带有 Astryx 标志、Astryx 文字和下拉箭头——组件处于选中状态并显示边界，光标悬停在箭头上'
relatedDocs:
  - title: 'Vibe 测试'
    href: '/blog/vibe-tests'
  - title: 'Astryx 是如何运作的'
    href: '/blog/how-astryx-works'
---

好吧，我们已经为你准备好了一个，[在这里](https://www.figma.com/community/file/1659998707120781098)！

说实话，我们花了很长时间思考到底需不需要 Figma 组件库。在内部，我们每周的组件插入率急剧下降了 95%。而且我们身边的大多数设计师都在通过代码而不是画布做设计。我们不禁怀疑 Figma 在我们设计工作流中还扮演什么角色……

我们之所以还愿意试一试，是因为发现自己某些场景下仍会回到 Figma。它仍然是快速探索和制作视觉素材最快的方式。虽然我们不再把它当作写规格或交接的工具，但它作为草图本依然好用。另外，看到社区这么快就做出了 Figma 组件库，也真的激励了我们。（感谢 [Lee](https://www.figma.com/community/file/1655939158795671259/astryx-for-figma) 和 [Adrian](https://www.figma.com/community/file/1661363854016665156/astryx-design-system-for-figma-v0-1)，也去看看他们的组件库吧！）

我们决定，如果能大致实现组件库构建与维护的自动化，就把它发布出来。于是我们这么做了！我们发布这个 [Astryx Figma 组件库](https://www.figma.com/community/file/1659998707120781098)，作为两个层面的实验：

1. Figma 组件库在设计工作流中是否仍有位置？
2. 我们能否将它自动化，让投入与回报的权衡达到平衡？

## Figma Librarian 守夜任务

这个 Astryx Figma 组件库主要由一个名为 [Figma Librarian](https://github.com/meta/astryx/wiki/Night-Watch-Figma-Librarian) 的守夜任务（Astryx 配置的定时任务）构建，并将由它维护。它连接到 [Figma MCP](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server)，并配备了一组组件构建技能，其中包含我们的构建偏好，例如“始终使用 slot 功能来对应代码中的 React 节点”。这位图书管理员会在每次小版本发布时检查系统中相关的变更，并自行维护组件库，使其保持最新。
