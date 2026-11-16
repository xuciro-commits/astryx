# 组件文档中译指南

目标：把 `scripts/zh/components/*.json` 中所有面向读者的自然语言翻译为简体中文，供 `build-component-docs.mjs` 生成 `docsZh`。

## 必须翻译的字段
- 顶层 `description`（组件简介）。
- `usage.description`；`usage.bestPractices[].description`；`usage.anatomy[].name` 和 `.description`。
- `usage.accessibility[].name`、`.states[]`（状态名，如 Rest/Hover/Focus visible/Disabled）、`.description`。
- `props[].description`；`components[].description`、`components[].usage`、`components[].props[].description`。
- `params[].description`、`returns[].description`。

## 绝对不能改的字段
- 所有 JSON key、`slug`、`file`、`name`、`displayName`、`props[].name`、`params[].name`、`returns[].name`。
- `guidance`、`required` 等布尔值。
- `usage.accessibility[].category`（逻辑依赖英文：`Color contrast`、`Keyboard`、`Semantics`、`Content`、`General`）。
- `usage.accessibility[].requirement` 中的数字与比例，以及 `criterion` 的 WCAG 编号（可保留英文标准名）。
- 代码、组件名、包名、API 名、属性名、CSS 变量、`{@command ...}`、链接、占位符（如 `{name}`）、Markdown 标记。

## 风格
- 简体中文，技术写作口吻，简洁、准确，避免直译腔。
- 代码标识符保留原文并用反引号/原格式包裹。
- “component”译为“组件”，“props”译为“属性”，“hook”译为“Hook”，“token”译为“令牌”。
- 句末中文标点；中英文之间保留一个半角空格。
- 不新增、不删除数组元素或对象字段；只替换字符串内容。

## 验收
- `node -e "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'))" <file>` 通过。
- 所有 `description` 不含整句英文；`props` 名称与原始文件完全一致。
