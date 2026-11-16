---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor`：仅浅色或仅深色主题的构建产物会在主题旁导出其唯一模式（`export const colorModes = ["light"];`），其应用副本会重新导出它，因此 `theme add` 会以该模式接入主题。较旧的 CLI 和 Core 会忽略这个额外的导出。

@josephfarina
