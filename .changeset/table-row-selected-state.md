---
'@astryxdesign/core': patch
---

[feat] 被 `useTableSelection` 选中的表格行会带上 `table-row` 目标的 `selected` 主题状态，因此主题可以为选中的行设置样式（`components: {'table-row': {selected: {…}}}`）。选中底色保持不变；主题可在该状态下设置 `--color-accent-muted` 来为其重新着色。

@josephfarina
