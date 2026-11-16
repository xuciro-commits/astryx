# 博客文章翻译规范

将 `apps/docsite/src/content/blog/posts/*.md` 的英文内容翻译为简体中文，保留 Markdown 结构与可渲染性。

## 必须翻译

- frontmatter 的 `title`、`description`、`coverAlt`、`tags`、`relatedDocs[].title`
- 正文所有自然语言段落、标题、列表、引用块、图片 alt 文本、表格文字
- 正文中的链接可见文字（URL 保持不变）

## 必须原样保留

- frontmatter 键名：`title`、`description`、`date`、`type`、`draft`、`authors`、`tags`、`coverImage`、`coverAlt`、`relatedDocs`
- `date`、`type`、`draft`、`authors`、`coverImage`、`relatedDocs[].href` 的值
- 所有代码块（```…```）、行内代码、命令、包名、API/组件/prop 名、文件路径、URL、图片路径
- Markdown 标题层级 `#` 数量、列表符号、表格列数、空行结构、图片语法 `![...](...)`
- 产品名 Astryx、React、StyleX、Meta、Figma、npm、CLI 等专有名词
- HTML/MDX 标签名与属性名

## 风格

- 简洁、自然的技术中文，避免翻译腔
- 标题可意译，但保留版本号与产品名（如 `Astryx v0.7.0：...`）
- 不要添加译者注、不要省略段落、不要合并章节
