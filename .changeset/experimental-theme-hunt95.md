---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme`：当项目中装有 Playwright 时，图片会先尝试 Playwright 自带的浏览器，再尝试系统 Chrome，且建议只列出可能有效的修复（仅当 Playwright 的浏览器缺失时才提到它）；Chrome 查找会跳过无法运行的文件夹或文件，并继续在 PATH 上查找；一次更改会让主题的每个应用内预览保持同步，包括手动重命名或记录丢失的预览，即 `see` 列出的那些预览；在 src/app 项目中执行 `preview add --path app/<x>` 会说明，根 app/ 会导致 src/app/ 中的整个应用无法提供服务；`preview app` 错误表将项目文件夹命名为界限；而在预览命令打印结果之后发生的停止，不再把该 ok 变成退出码 130。

@josephfarina
