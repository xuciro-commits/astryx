---
'@astryxdesign/cli': patch
---

[fix] `astryx experimental render` 和 `--reverse` 会从 TypeScript 为页面读取的配置中读取路径别名：即页面所在位置或其上方最近的 `tsconfig.json`（否则为 `jsconfig.json`），包括通过其 `extends`（可带或不带 `.json` 的路径、某个包的配置，或一个列表，后者胜出，支持 `${configDir}`），以及在 solution 风格的 `tsconfig.json`（`"files": []` 且带 `references`，Vite 即如此设置）之后，包含该页面的被引用项目。此前，别名位于 `tsconfig.app.json` 或位于被扩展配置中的页面会失败，并报 `ERR_FILE_NOT_FOUND`；当别名看起来像包名（`@data/rows`）时则报 `ERR_RENDER_MISSING_DEPENDENCY`，尽管 `tsc` 和应用构建都能找到其导入。

@josephfarina
