---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor`：按变体设置单模式颜色、围绕保留步长的间距旋钮，以及来自基础主题的内边距量。

- 为每个变体各自拥有颜色的部件设置单模式颜色时，会按该颜色所指的属性写入每个变体（卡片的 `border-color` 仍是边框颜色），并为每个变体保留其自己的另一半：先前为另一模式或为两个模式保存的设置，否则就是该变体未设置时显示的值。对 `background-color` 或 `border-color` 这类颜色长写属性使用 `--mode` 时也按此方式接受。
- 以 `background-color` 设置的悬停效果在之后设置单模式 `background` 后仍保留在每个变体上；而在普通 background 之后设置的单模式 background 会应用到两个模式下的每个变体。
- 你自己的 `<theme>.theme.ts` 在同一状态上设置的整部件状态设置不会重复到各变体上，因此不会在任何地方显示，结果中会说明这一点。
- 间距旋钮会围绕主题保留的精确步长保持间距步长的顺序，读取以 token、`clamp()`、`min()` 或 `max()` 形式书写的保留控件尺寸，并在全主题旋钮下保持部件自身精确控件尺寸的顺序。
- `how` 的内边距量会读取基础主题在部件上的块向与行向内边距（在 butter 上说 "double the button padding" 会得到 `1rem 2rem`）。

@josephfarina
