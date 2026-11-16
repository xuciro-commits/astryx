---
'@astryxdesign/cli': patch
---

[fix] `astryx experimental render` 会携带页面导入的 `.mts`、`.cts` 和 `.cjs` 模块，`--reverse` 会把它们还原并跟随它们的导入。渲染会加载这些模块，却曾将它们遗漏在文件之外，因此页面返回时带有 `exact: false` 且缺少这些模块。携带此类模块的文件会声明渲染格式 2，因此读取渲染格式的旧版 CLI 会指出应使用哪个 CLI，而不是称该文件已损坏；其他所有文件仍保持格式 1。

@josephfarina
