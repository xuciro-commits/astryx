---
'@astryxdesign/cli': patch
---

[fix] 在项目之外，`astryx experimental render` 会携带页面从其自身文件夹上方导入的模块，以及这些模块所导入的文件，只要它们位于当前文件夹内。此前，与其相邻文件一起恢复的页面（`report-restored/app/report/page.tsx` 与 `report-restored/components/` 并列），再用其文件所打印的命令渲染时会遗漏这些模块，导致新文件返回时带有 `exact: false`。渲染读取页面的 `tsconfig.json` 和 `public/` 图片的位置不变。

@josephfarina
