# 添加博客文章

Astryx 文档站博客位于 `/blog`（索引）和 `/blog/<slug>`（文章详情）。
文章由人类撰写。添加一篇文章刻意做到接近“放入一个 Markdown 文件”。

> **原则：** 元数据负责组织博客，正文由人类撰写。没有
> 必需的文章模板——每篇文章的结构以最易读为准。

## 1. 创建文章文件

在以下位置添加一个 Markdown 文件：

```
apps/docsite/src/content/blog/posts/<slug>.md
```

文件名（去掉 `.md`）会成为 URL slug，例如
`introducing-astryx.md` → `/blog/introducing-astryx`。

以 YAML frontmatter 开头，然后用 Markdown 编写正文：

```md
---
title: 'Designing agent-ready components'
description: 'How Astryx structures component APIs and docs so humans and agents can build with confidence.'
date: '2026-06-17'
type: 'guide'
authors:
  - 'your-handle'
tags:
  - 'AI'
  - 'Components'
  - 'Docs'
---

Write the post in human-authored prose here. Use any structure that fits —
headings, code blocks, lists, links. The body is rendered with `Markdown`.
```

## 2. Frontmatter 参考

### 必填

| 字段          | 类型           | 说明                                                                      |
| ------------- | -------------- | ------------------------------------------------------------------------- |
| `title`       | string         | 文章 `h1`、卡片标题、默认页面/社交标题。                                  |
| `description` | string         | 卡片摘要、文章导语、默认 meta 描述。                                      |
| `date`        | `YYYY-MM-DD`   | 发布日期及默认排序键（最新在前）。                                        |
| `type`        | enum           | `update`、`guide`、`design`、`story`、`perspective`、`engineering` 之一。 |
| `authors`     | string[]       | 作者注册表中的一个或多个作者键（见步骤 3）。                              |
| `tags`        | string[] (1–4) | 用于标签芯片和发现的主题标签。                                            |

### 可选

| 字段             | 类型             | 说明                                                                    |
| ---------------- | ---------------- | ----------------------------------------------------------------------- |
| `updatedAt`      | `YYYY-MM-DD`     | 显示“Updated”日期；不会替换 `date`。                                    |
| `dek`            | string           | 仅文章使用的副标题/导语。支持行内 Markdown 链接。                       |
| `draft`          | boolean          | `true` 会将文章保留在仓库中，但不进入生产输出。                         |
| `coverImage`     | string           | 自定义封面图片的路径（例如 `/blog/<slug>/cover.png`）。                 |
| `coverAlt`       | string           | **设置 `coverImage` 时必填。** 封面的替代文本。                         |
| `releasePackage` | string           | 生成的发布封面上的包标签（默认 `@astryxdesign/core`）。仅用于发布文章。 |
| `relatedDocs`    | `{title,href}[]` | 精选的相关文档链接，渲染在文章末尾附近。                                |

必填 frontmatter 会在构建时（`pnpm generate`）和测试中校验。
缺失或格式错误的字段会使构建失败，并给出以 slug 为前缀的清晰错误。

### 文章类型

| 类型          | 用途                                     |
| ------------- | ---------------------------------------- |
| `update`      | 功能改进、版本发布、新能力。             |
| `guide`       | 实用、教学类文章。                       |
| `design`      | 视觉与设计工艺类文章：构图、色彩、动效。 |
| `story`       | 用户故事、社区示例、采用故事。           |
| `perspective` | 设计系统理念、行业观察、观点。           |
| `engineering` | 实现细节、基础设施、技术深入解析。       |

每篇文章恰好有一个 `type`。只有当超过一种类型有已发布内容时，
类型筛选才会出现在索引页上。

## 3. 将自己加入作者注册表（一次）

作者通过键引用，因此个人资料元数据集中存放在一处：

```
apps/docsite/src/content/blog/authors.ts
```

```ts
export const authors = {
  'your-handle': {
    name: 'Your Name',
    github: 'your-handle', // avatar + profile link are derived from GitHub
    role: 'Design', // optional
  },
} as const satisfies Record<string, AuthorProfile>;
```

对于以 GitHub 为依托的作者，头像和资料链接默认使用
`https://github.com/<handle>.png?size=128` 和 `https://github.com/<handle>`——没有
构建时的资料抓取。然后在你的文章中引用该键：

```yaml
authors:
  - 'your-handle'
```

## 4. 封面图片

自定义封面是可选的。如果省略 `coverImage`，网站会根据文章的 `type` 和 `slug`
渲染一张平静、确定性的默认封面——因此每篇文章都有视觉呈现，而无需专门的美术设计。

如需使用自定义封面，请将图片放在 `public/blog/<slug>/` 下，并用替代文本引用：

```yaml
coverImage: '/blog/<slug>/cover.png'
coverAlt: 'Short description of the image'
```

**发布文章**会自动获得封面：当文章标题包含版本号（例如 "Astryx v0.1.3: …"）时，
版本号会渲染在纯色 Astryx 蓝背景上，以 Astryx 标志作为各段之间的分隔，
包名位于其下方。设置 `releasePackage` 可更改包标签
（默认为 `@astryxdesign/core`）；设置显式的 `coverImage` 可退出此行为。

## 5. 文章正文中的图片

使用普通 Markdown 引用正文中的图片，图片来自 `public/blog/<slug>/`：

```md
![Descriptive alt text](/blog/<slug>/my-screenshot.png)
```

始终编写有意义的替代文本——屏幕阅读器会读取它，图片加载失败时也会显示它。
正文图片会渲染一个细微的边框，让截图在两种背景上都显得有意为之。

### 浅色 / 深色变体

正文图片可以在深色模式下自动切换。在旁边放置一个名为 `<name>.dark.<ext>` 的
第二个文件，网站处于深色模式时就会使用它——无需 frontmatter，无需更改标记。
你仍然只需引用浅色文件：

```
public/blog/<slug>/pipeline.png        ← shown in light mode
public/blog/<slug>/pipeline.dark.png   ← shown in dark mode (optional)
```

```md
![The build pipeline](/blog/<slug>/pipeline.png)
```

工作原理：`scripts/generate-data.mjs` 在构建时扫描 `public/blog/**`，
并将每个 `*.dark.*` 文件记录到 `blogDarkImages` 清单中。博客渲染器会在该清单中
查找每张图片对应的 `<name>.dark.<ext>` 同级文件，因此决策在构建时完成——没有运行时请求，
没有闪烁。如果不存在深色变体（常见情况），则两种模式都使用这一张图片。
切换跟随网站的 theme toggle，而不仅仅是操作系统偏好。

### Retina 截图（`@2x`）

在 2× 显示器上截取的截图，其像素数是组件在屏幕上宽度的两倍，因此默认会以双倍尺寸渲染，
仅受栏宽限制。将文件命名为带 `@2x` 后缀，它就会以像素宽度的一半渲染——即组件的真实尺寸——
同时使用 `height: auto`，并且仍以栏宽为上限：

```
public/blog/<slug>/swipe@2x.webp        ← 780 px wide file → 390 CSS px
public/blog/<slug>/swipe@2x.dark.webp   ← dark variant, same width (optional)
```

```md
![Swiping an item reveals its actions](/blog/<slug>/swipe@2x.webp)
```

工作原理：同样的构建时扫描会将每张 `@2x` 图片的自然尺寸（PNG、JPEG 或 WebP——
包括动画 WebP 的画布）记录到 `blogImageSizes` 清单中，渲染器会将图片的 `width` 设置为它的一半。
深色变体采用浅色图片的宽度，因此切换主题不会导致布局偏移。没有该后缀的图片保持不变。

## 5a. 实时示例

信息字符串为 `tsx live` 的围栏代码块会作为实时示例运行，而不是显示为代码：

````md
```tsx live
import {Button} from '@astryxdesign/core/Button';

export default function Example() {
  return <Button label="Try me" />;
}
```
````

- 该代码块需要一个默认导出的组件。它在 playground 的预览框架中运行：沙箱化、
  拥有独立的 origin，因此编译或运行时错误会显示在框架内部，文章其余部分仍正常渲染。
- 它可以导入已发布的 Astryx 包，以及放在文章旁边的演示素材：将 `.tsx` 模块放入以文章命名的文件夹
  （`posts/<slug>/TarotCard.tsx`，与 `posts/<slug>.md` 相邻），并以 `./TarotCard` 导入。
  它们不是 Astryx 组件，没有任何包导出它们，只有这篇文章的示例可以导入它们。
- 纯文本路由（`/blog/<slug>.txt`）会将该代码块的源码显示为普通的 `tsx` 代码块。
- `src/content/blog/fixtures/` 存放测试文章：canary 会在 `/blog/<slug>` 提供它们，
  但索引、feed 和 sitemap 从不列出它们。

## 6. 本地预览

```bash
cd apps/docsite
pnpm dev            # runs `pnpm generate` first, then starts Next.js
```

访问 `/blog` 和 `/blog/<slug>`。草稿（`draft: true`）会在开发环境渲染，但
不包含在生产构建中。

## 7. 推送前校验

```bash
pnpm generate       # discovers + validates posts into src/generated/blogRegistry.ts
pnpm test           # runs blog discovery/validation tests
pnpm typecheck
```

就是这样——无需编辑索引页，无需手动接线。文章会被自动发现，并按日期排序到位。

## 文章如何评审

博客文章会依据 **[博客评审
准则](https://github.com/meta/astryx/wiki/Blog-Review-Rubric#three-required-scored-criteria)** 进行评审。
该准则会考虑文章类型（变更日志 `update`、`engineering` 深度解析和
`perspective` 随笔按不同的配置评判），以准确性为门槛
（可验证的说法——命令、API、数字——会对照代码库检查，
确认的错误会阻止发布），并检查实质内容、效率、工艺和
语气，**同时不会让你的语气变得千篇一律**。在写作前阅读它，
是获得 A 的最快方式。
