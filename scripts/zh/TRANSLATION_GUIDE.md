# Astryx 中文本地化规范

## 目标

把 Astryx 面向用户的文档从英文翻译为**简体中文**，读起来像由中文母语的技术文档作者直接撰写，而不是逐词直译。

## 必须遵守

- **只修改 JSON 中的自然语言字段**，结构和键名不动：
  - `title`、`description`
  - `sections[].title`
  - `sections[].blocks[].text`（`prose` / `heading`）
  - `sections[].blocks[].items`（`list`）
  - `sections[].blocks[].headers`、`rows`（`table`）
  - `sections[].blocks[].label`（`code` 代码块标题；`Terminal`、`globals.css` 等可以译则译，文件名保持原样）
- 不要修改 `topic`、`source`、`section`、`i`、`type`、`blockCount`、`name`、`fileName` 等标识字段。
- 保留所有行内代码的反引号内容、代码标识符、组件名、函数名、包名、文件路径、命令、URL、版本号。例如 `@astryxdesign/core`、`astryx theme add neutral`、`isDisabled`、`packages/core` 一律不译。
- 保留文档语法占位符原样：`{@command ...}`、`{@link ...}`、`{@namespace ...}` 等，一个字符都不要改。
- 保留 Markdown 强调符号（`**`、`_`）、列表语义、表格列数和行数。
- 中文使用全角标点；中文与英文/数字之间按中文习惯自然留空格（如「使用 Astryx CLI 安装」）。
- `Terminal` 可译为「终端」；`Overview` → 「概览」；`Getting Started` → 「快速开始」；`Best Practices` → 「最佳实践」。
- `props` → 属性；`component` → 组件；`hook` → Hook（保留英文）；`token` → 令牌；`theme` → 主题；`template` → 模板；`package` → 包；`CLI` 保留。
- 表格表头（`Field`、`Type`、`Description` 等）要翻译；表格中的类型/字段名保留英文，描述翻译为中文。
- 代码块标题如果是文件名/语言名（如 `globals.css`、`package.json`、`tsx`）保持原样；`Terminal` 可译「终端」。
- 如果原文是专有名词（Astryx、Meta、React、StyleX、Figma），保留原名。

## 质量要求

- 所有 `description`、`text`、`title`、`items`、表格描述必须翻译成中文，不能留下整句英文。
- 不要省略内容，不要合并条目。表格每一行都要有对应译文。
- 翻译完成后必须能用 `node -e "JSON.parse(require('fs').readFileSync('<file>','utf8'))"` 解析。
- 用 `write` 工具写回同一个 JSON 文件（UTF-8，2 空格缩进）。
