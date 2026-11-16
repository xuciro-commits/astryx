---
title: '在人们已经在构建的地方与他们相遇'
description: '为 shadcn 用户提供一条兼容路径：无需放弃 Astryx 包或 CLI，就能安装 Astryx 组件、示例、区块和页面。'
date: '2026-09-02'
type: 'engineering'
draft: true
authors:
  - 'josephfarina'
tags:
  - 'CLI'
  - '组件'
  - '模板'
relatedDocs:
  - title: '在 shadcn 中使用 Astryx'
    href: '/docs/shadcn-compatibility'
  - title: '迁移指南'
    href: '/docs/migration'
  - title: '组件'
    href: '/components'
---

很多团队已经有一个 shadcn 应用。要求他们在试用一个 Astryx 组件之前先替换整套设置，就像一次糟糕的初次约会。

所以我们尝试了一个更小的想法：如果 Astryx 出现在他们已经在用的工作流里，会怎样？

## registry 是一辆送货卡车

shadcn 有一套 [Registry 协议](https://ui.shadcn.com/docs/registry)。registry 是静态 JSON，用来告诉它的 CLI 要安装哪些包、向应用添加哪些源文件。独立库会使用这套协议，因为它能提供熟悉的安装命令，又不必让自己成为 shadcn 的一部分。

Astryx 也可以做到同样的事。

```bash
npx shadcn@4.19.0 add <registry-origin>/templates/dashboard.json
```

关键在于这条命令执行之后发生了什么。Astryx 不会变成一堆复制过来的组件源码。该命令会安装真正的 `@astryxdesign/core` 包。它复制的 dashboard 代码会从该包导入 `Card`、`Table`、`Button`、`ProgressBar` 以及其他所有内容。

组件行为、无障碍、样式和修复仍然由 Astryx 负责。应用则拥有它所要的 dashboard 组合。

## 复制组合，而非复制设计系统

这会把组件目录拆成两种有用的安装类型：

- **组件**条目会安装包，并写入一个很小的本地再导出文件。
- **示例、区块或页面**条目会复制可编辑的应用代码，这些代码会导入该包。

这个区别很重要。把完整的 Button 实现复制到每个应用，会让升级更困难，也让每个副本逐渐产生偏差。复制一个使用已发布 Button 的 dashboard，则是正常的应用开发。设计系统仍然是依赖项，页面仍然属于你。

复制的组合会在旁边附带一份小型的 Astryx 回执（receipt）。更新 Astryx 包之后，`astryx upgrade --registry` 会对照已安装的版本和对应的 registry 发布版本预览变更。加上 `--apply` 可以更新未改动的文件并合并不重叠的编辑。发生冲突时，你的文件会保持不变，并生成一个单独供审阅的文件。

深度自定义依然存在，但需要通过 `astryx swizzle` 明确进行。普通的 registry 安装不会替你越过这条界线。

## 我们试遍了整个目录

第一个实验从驱动 CLI 和文档站点的同一份组件目录生成 registry 条目。它覆盖了每个已发布的组件和 hook、每个展示区块和示例区块，以及每个现成的页面模板。

然后我们创建了一个干净的 shadcn Vite 应用，通过 shadcn CLI 安装了 Button 条目、Button 展示、Button 示例和一个完整的 analytics dashboard。该 CLI 安装了 Astryx 包和其他依赖，添加了所需的 CSS，把四个文件写入应用，未经改动的应用构建成功。

这个实验的意义在于它很小。registry 是生成的 JSON。文档站点已经拥有组件目录、源码、包版本和页面。我们不是在构建另一个组件系统。

## 这不会取代 Astryx CLI

shadcn CLI 是很好的运输工具。它能把已知条目取来并放到正确的位置。

Astryx CLI 了解这个系统。它能帮你找到符合提示的内容、解释组件契约、用多个片段组装页面、编译主题、验证安装并应用升级。

这两条路径可以并存：

```bash
# I know the exact item and already use shadcn
npx shadcn@4.19.0 add <registry-origin>/examples/button/variants.json

# I need help finding and maintaining the right pieces
astryx build "analytics dashboard with filters"
astryx doctor
astryx upgrade --registry
astryx upgrade --registry --apply
```

## 为什么要这样做？

渐进式采用才是重点。团队可以在当前应用中试用一个 Astryx 区块，在有用时添加一个完整页面，而不必先宣布一个迁移项目或学习新工具才能看到价值。

Astryx 获得了更宽的入口，同时没有放弃包边界或更丰富的 CLI 体验。我们在人们已经在构建的地方与他们相遇，并给他们一个继续深入的理由。
