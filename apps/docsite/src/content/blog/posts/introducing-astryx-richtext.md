---
title: '推出 Astryx RichText：面向表单的富文本字段'
description: '@astryxdesign/richtext 已稳定：一个带标签的富文本字段，基于 Lexical 构建，由你的 Astryx 主题设定样式，可无损读写 Markdown。'
date: '2026-10-20'
type: 'update'
draft: false
authors:
  - 'cixzhang'
  - 'potatowagon'
  - 'ernest'
tags:
  - '发布'
  - '组件'
  - '无障碍'
relatedDocs:
  - title: 'RichTextEditor'
    href: '/components/RichTextEditor'
---

`@astryxdesign/richtext` 现在是 Astryx 的稳定包。它为你的表单提供富文本字段：用户可以写标题、列表、链接、表格和代码，你的应用负责保存他们写下的内容。从 v0.7.1 起，它与 `@astryxdesign/core` 同版本安装，并遵循相同的兼容策略。

![在一个空白的 Launch notes 富文本字段中写作。工具栏的样式菜单把第一行变成 Q4 launch plan 标题；加粗按钮让“rich text”变为粗体；插入链接对话框把“every form”变成链接；然后样式菜单切换到项目符号列表，并输入 Feedback form 和 Release notes 两项。](/blog/introducing-astryx-richtext/richtext-toolbar.gif)

```bash
npm install @astryxdesign/richtext @astryxdesign/core
```

然后安装 0.52 版本的 `lexical` 和 `@lexical/*` 对等依赖（`npm view @astryxdesign/richtext peerDependencies` 会列出它们）。RichText 和 Core 一样提供预构建 CSS：把它的样式表与 Core 及你的主题的样式表一起引入。

```tsx
import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import '@astryxdesign/theme-neutral/theme.css'; // or your theme's CSS
import '@astryxdesign/richtext/richtext.css';
```

```tsx
import {RichTextEditor, RichTextEditorToolbar} from '@astryxdesign/richtext';

<RichTextEditor
  label="Release notes"
  description="Capture formatted context for your team."
  toolbar={<RichTextEditorToolbar />}
  onChange={editorState => save(JSON.stringify(editorState.toJSON()))}
/>;
```

## 首先，它是个表单字段

`RichTextEditor` 是一个带标签的字段，就像 `TextArea` 一样：标签、描述、必填和可选状态、状态消息、只读和禁用状态、字符数限制，以及与表单其他部分一致的边框和焦点环。`RichTextView` 以只读方式显示已保存的内容，排版保持一致。

![一个带有描述和工具栏的 Launch notes 富文本字段，里面有一个 Q4 launch plan 标题、一段包含粗体和链接的段落、一个 This week 标题及其下方的带行内代码的项目符号列表、一张包含 surfaces、owners 和 status 三列的表格，以及一个 tsx 代码块。](/blog/introducing-astryx-richtext/richtext-editor@2x.png)

你存储的值是 Lexical 编辑器状态，序列化为 JSON。把它传给 `RichTextEditor` 的 `defaultValue` 可以继续编辑，或传给 `RichTextView` 的 `value` 来显示。

## Markdown 无损进出

`markdownToEditorStateJSON` 和 `editorStateJSONToMarkdown` 可以在不挂载编辑器的情况下双向转换，在服务端也可以。打开 Markdown，不做任何修改再导出：你会得到完全相同的字节。修改一个段落后，其余内容都会原样返回：列表标记、转义、间距和字符引用。

```ts
import {
  editorStateJSONToMarkdown,
  markdownToEditorStateJSON,
} from '@astryxdesign/richtext/markdown';

const editorState = markdownToEditorStateJSON(markdown); // pass to defaultValue
editorStateJSONToMarkdown(editorState) === markdown; // true until someone edits
```

## 阅读模式与编辑模式下的同一文档

RichText 文档与 Astryx `Markdown` 渲染的同一文档保持一致：相同的字号体系、块间距、行宽、列表标记和代码框，在浅色与深色、从左到右与从右到左模式下都是如此。在 `Markdown` 和 `RichTextEditor` 之间切换页面时，每个块都保持相同顺序和间距；编辑器只增加自己的字段外框。长代码行在两者中都会换行，因此手机读者永远不需要横向滚动代码。

![同一份 Markdown 源码展示两次。上方标注 Markdown，阅读模式：一个 Release notes 标题，一段包含粗体、斜体、删除线和行内代码的段落，一个链接和一个裸 URL，然后是 What changed 标题。下方标注 RichText，编辑模式：相同的内容位于编辑器的字段外框和工具栏中，并在相同的词处换行。](/blog/introducing-astryx-richtext/read-and-edit@2x.png)

## 与你的主题匹配的工具栏

`RichTextEditorToolbar` 由 Astryx 的 `Toolbar`、`Selector`、`ToggleButton` 和 `Dialog` 构建，因此会跟随你的主题：撤销和重做、段落和标题样式、列表和引用、粗体、斜体、下划线、删除线、行内代码和链接。空间紧张时它会滚动，而不是把控件藏进菜单；每个图标都可以通过主题替换。你可以在它的 `endContent` 插槽中添加自己的控件。

## 基于 Lexical 构建

RichText 基于 [Lexical](https://lexical.dev)——可扩展的文本编辑框架。你可以直接添加自己的节点、Markdown 转换器和 Lexical 插件；`onChange` 会提供 Lexical 编辑器状态。RichText 一次支持一个 Lexical 次版本：目前是 0.52，声明为 `^0.52.0` 对等依赖，因此由你的应用安装 Lexical，而不是由 RichText 打包自己的副本。

你用 `createMarkdownPlugin` 为 Astryx `Markdown` 添加语法的 Markdown 插件，在编辑器中同样可用：用 `createRichTextExtension` 采用它，它的节点会按 `Markdown` 的渲染方式呈现，并作为一个整体编辑。转换整个文档的插件会被拒绝，并抛出 `RichTextExtensionError`。

## 无需自己实现的无障碍支持

屏幕阅读器会正确朗读编辑器：读出字段标签，并说明这是一个多行文本框，使用屏幕阅读器的人能知道自己正在往哪里输入。整个工具栏都可以用键盘操作——方向键在按钮之间移动，无需鼠标——Tab 会像在文字处理器中那样缩进，而先按 Escape 再按 Tab 可以把焦点移出编辑器。屏幕阅读器会朗读这一提示，键盘用户不会卡住。任务列表中的复选框可以用键盘勾选，屏幕阅读器会称它们为复选框。按钮提示、链接对话框和编辑器的公告都来自 Astryx 消息目录，因此你可以像翻译 Astryx 其他部分一样翻译它们。

## 开始使用

- 安装该包以及上方列出的 Lexical 对等依赖。
- 阅读 [RichTextEditor 文档](/components/RichTextEditor)，或在已安装该包的项目中运行 `npx @astryxdesign/cli component RichTextEditor`。
- 在 [RichText playground Story](https://astryx.atmeta.com/storybook/?path=/story/richtext-richtexteditor--playground)中体验所有功能。
