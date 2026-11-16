---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor` 和 `preview`：给 `preview remove --path` 传入一个文件时，会被拒绝并给出预览的文件夹（此前报告的是未知错误）。图片先以部件名称存放，再移动到对应位置，因此当浏览器仍在运行时停止的 `--png` 运行不会留下任何下一次运行会当作你自己文件来读取的内容。当项目有多个编辑器主题时，`see` 行会指出 `preview add --theme <name>`；对于移动到 Next 不提供服务的位置的预览，不给出 URL 并说明原因；当有文件夹挡路时，说明无法写入 preview.html；当你的图片挡路时，说明是什么阻止了 `--png`；用从子文件夹也能工作的路径命名文件；并说明应用内预览何时被手动更改，`previewStale` 现在也会说明需要移出什么。`show` 的帮助说明图片不会更改应用中的任何内容，只是 `show` 在手动编辑后会先把应用副本更新到最新。用另一个设置项作为标签的刻度盘值（`accent 'neutral: #64748b'`）会被拒绝并给出该设置项的那一行。输入清理会把角括号读作引号，保留字符串内的转义引号和括号，把成对键入的浅色和深色读为一对（提供 `light-dark()` 或两行 `--mode`，或为刻度盘提供一个颜色），将包含多个设置的 JSON 对象拆成每个一行，读取 JSON 转义的字体堆栈，将 `--mode night` 和 `day` 映射为 dark 和 light，并将 `vibrancy 0.5` 和 `"50"` 读取为 50；带有粘贴杂质或 `!important` 的已保存值会以清理后的形式提供。

@josephfarina
