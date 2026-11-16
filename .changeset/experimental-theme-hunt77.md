---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor`：普通 Chrome 拍摄的图片不再被报告为 "--png took no pictures"；`see` 行会为图片指出 `editor show <theme> --png`，绝不会是刚刚运行过的命令（再次运行 undo 会撤销另一项更改）；在浏览器拍摄图片时停止更改会停止浏览器，并说明更改已保存，绝不会报告为浏览器失败；被停止的运行留下的图片部分文件会在下一次更改时清除，绝不会复制到新应用中，同名文件夹会被跳过；无法写入的应用内预览路由、损坏的预览记录，以及位于 Next 不提供服务的文件夹中的预览（根目录 `app/` 下的 `src/app/`、没有 `tsx` 的页面扩展名）都会被说明，且不会给出无法加载的 URL；`preview app` 不会复制主题的任何图片或预览页面；而在子文件夹中，`preview list` 和 `remove` 接受它们打印的文件夹，图片提示与 `previewStale` 会像 `see` 那样命名文件（绝对路径）。

@josephfarina
