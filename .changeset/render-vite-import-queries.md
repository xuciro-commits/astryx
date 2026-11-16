---
'@astryxdesign/cli': patch
---

[fix] `astryx experimental render` 会让带 `?raw` 的相对或别名导入获得文件文本，让以 `?inline` 导入的 `.css` 文件获得其文本（不添加到页面），如同 Vite 自身的做法，无论导入如何命名。过去，`?raw` 会返回 JSON 文件的对象，对 `notes.txt?raw` 之类的文本文件会失败，并将带 `?inline` 的 `.css` 文件当作 CSS Modules 拒绝。带 `?raw` 的包导入，以及带 `?inline` 的 Sass、Less 或包样式表，保持原样。任何其他查询会像以前一样按不带查询的方式加载文件：图片、字体或媒体文件作为其地址（`?url`、`?inline`、`?w=400`），模块作为自身。`--reverse` 会返回渲染所携带的文件；渲染从不携带的类型的 `?raw` 文件（如 `notes.md`）会在 `not-embedded` 警告中列出。

@josephfarina
