---
'@astryxdesign/cli': patch
---

[feat] `theme add` 和 `theme use` 会为具有单一色彩模式的主题按该模式接线。当主题的构建模块导出 `colorModes`（`["light"]` 或 `["dark"]`；当主题源码导出它时，`theme build` 会写入它），`theme.app` 回执会为该主题提供一个 `mode` 字段，生成的主题模块会在 `themeModes` 导出中列出它。首次导入的接线会把 `mode={themeModes[defaultThemeSlug] ?? 'system'}` 传给 `Theme`，因此所选主题会显示其自身的模式，而同时具有两个模式的主题会跟随系统。当后续的 `theme add` 或 `theme use` 首次向已接线的应用添加 `themeModes` 时，回执会标记 `change.wireModes` 并打印要使用的接线行。模块一旦导出过 `themeModes`，就会保留该导出（没有主题使用单模式时为空），因此接线在 `theme remove` 之后仍可编译。模式从声明主题的文件中读取，因此重新导出构建模块（整体或按名称）的主题模块会携带它。所有主题都具有两个模式的项目会得到与之前相同的回执、模块与接线。

@josephfarina
