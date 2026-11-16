---
'@astryxdesign/cli': patch
---

[fix] `astryx experimental render` 和 `--reverse` 会把名称以两个点开头的文件夹或文件（`..x`）视为其所在文件夹内的项目，而此前会把它当成上一级文件夹。此类文件夹中的页面会以自身所在文件夹作为其所携带文件的根目录，因此它写入的文件可以反向还原；它上方的文件则留在外部，并在 `not-embedded` 警告中指明。在项目之外渲染的页面顶部说明会按其列出的文件中的路径来命名该页面（`app/x/page.tsx`），而此前只命名文件（`page.tsx`）并将其指向为应编辑的文件。

@josephfarina
