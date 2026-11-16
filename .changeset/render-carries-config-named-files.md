---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental render` 会携带页面自身的模块和 JSON 数据，即使它们的名称看起来像配置：`config.ts`、`lib/arc.ts`、`data/chart-config.json`、`data/config.json`。此前它们被当作工具配置而排除，因此 `--reverse` 返回的页面会带有 `exact: false` 且不包含它们。以下名称仍会被拒绝：`tsconfig.json` 和 `tsconfig.*.json`、`jsconfig.json`、任何 `*.config.json` 或 `*.config.{js,ts,…}` 模块、清单与锁文件，以及诸如 `.eslintrc.js` 的点文件。包含其中之一的文件会标明渲染格式 2，因此能读取渲染格式的 CLI 会指明哪个 CLI 能读取它；0.7.16 及更早版本会将其视为损坏而拒绝。

@josephfarina
