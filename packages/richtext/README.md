# @astryxdesign/richtext

Astryx 富文本——一个基于 Lexical 的富文本编辑器与只读查看器，使用 Astryx 设计令牌进行样式设计。

```tsx
import {RichTextEditor, RichTextView} from '@astryxdesign/richtext';

<RichTextEditor label="Notes" onChange={setState} />;
<RichTextView value={serializedState} />;
```

编辑器刻意保持精简且可扩展：传入 `nodes` 和 `plugins`，即可在不 fork 的情况下叠加更丰富的行为（工具栏、提及、悬停卡片）。`RichTextEditorToolbar` 是用于编辑器 `toolbar` 插槽的可组合格式工具栏，`markdownToEditorStateJSON` / `editorStateJSONToMarkdown` 可在无头模式下在 Markdown 与序列化编辑器状态之间双向转换（无需挂载编辑器）。服务端安全的序列化器也可从 `@astryxdesign/richtext/markdown` 获取。

`RichTextView` 与 core 的 `Markdown` 以相同方式渲染同一文档；未做任何编辑时，导入编辑器的 Markdown 会逐字节原样导出。

## 基于 Lexical

RichText 基于 [Lexical](https://lexical.dev) 构建，并且不隐藏这一点：`nodes` 和 `transformers` 接受 Lexical 类型，`plugins` 接受 Lexical React 插件，`onChange(editorState, editor)` 以及编辑器 ref 的 `getEditorState()` 返回 Lexical 类型，因此你可以直接用 Lexical 扩展编辑器。你存储的值是序列化的 Lexical 编辑器状态；`markdownToEditorStateJSON` 和 `editorStateJSONToMarkdown` 可在它与 Markdown 之间互转。

RichText 一次只支持一个 Lexical minor 版本，由其 `lexical` 和 `@lexical/*` 的 peer 范围指定。这些是**可选** peer 依赖，因此你的包管理器不会自动添加它们：请与 richtext 一同安装该 minor 版本。参见 RFC：[meta/astryx#3899](https://github.com/meta/astryx/issues/3899)。

## 安装

```bash
npm install @astryxdesign/richtext @astryxdesign/core
```

然后安装 richtext 的 `peerDependencies` 中列出的每个 `lexical` 和 `@lexical/*` 包，使用其中显示的范围（`npm view @astryxdesign/richtext peerDependencies` 会打印这些内容）。

`@astryxdesign/richtext` 与 `@astryxdesign/core` 以相同版本一同发布；请安装匹配的版本。`lexical` 和 `@lexical/*` 包是可选 peer 依赖，因此仅使用无头 Markdown 序列化器的项目只需安装这些。

与 `@astryxdesign/core` 一样，RichText 提供预构建的 CSS 和 JS：将其样式表与 Core 及你的主题的样式表一同导入，无需 StyleX 或 Babel 配置。切勿编译 richtext 的源码。

```tsx
import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import '@astryxdesign/theme-neutral/theme.css'; // or your theme's CSS
import '@astryxdesign/richtext/richtext.css';
```

`richtext.css` 会输出到 `@layer astryx-base`，即 `astryx.css` 所开启的层，因此只要 Core 的 `reset.css`（或者，如果你的应用有自己的 reset，则是一行 `@layer reset, astryx-base, astryx-theme;`）先加载，你的主题令牌覆盖（`@layer astryx-theme`）就会胜过它。

## 编辑代码块

在代码块中，Tab 和 Shift+Tab 会按该块已使用的缩进，对选区触及的每一行进行缩进和取消缩进：如果块中某一行以制表符开头，则使用制表符；否则使用任一已缩进行中最少的行首空格数（保持在 2 到 8 之间），若不存在则使用 2 个空格。按 Escape，再按 Tab，可将焦点移出编辑器。

在代码块最开头按 Backspace 会将其转换为由各行组成的段落，而不是将代码并入上方的块。

将富内容粘贴到代码块中时，会插入其纯文本，每个块一行：标题、列表、表格和格式永远不会落入代码中。

## 示例

交互式示例位于 Storybook 的 **RichText/RichTextEditor** 下（`apps/storybook/stories/RichTextEditor.stories.tsx`）。
