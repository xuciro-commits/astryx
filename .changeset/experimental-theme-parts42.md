---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor`：单模式颜色、保留尺寸与自有内边距侧。

- 在 `light-only` 或 `dark-only` 主题中，你设置的颜色（token 或部件颜色）只填充该模式的一半；另一半保留基础主题的值，因此 Core 在另一模式下绘制的 lightbox、overlay 或 toast 仍然可读。为主题模式保存的设置在该主题变为单模式时会保留其所属的一半。
- 在单模式主题之后执行 `mode both` 时，会提示移除应用为它传给 `<Theme>` 的 `mode`。
- 间距旋钮会围绕主题保留的精确尺寸保持控件尺寸的顺序（`--size-element-md 34px` 搭配 `spacing tight` 会得到大于 34px 的尺寸）。
- 你自己的 `<theme>.theme.ts` 在部件某些侧设置的内边距在这些侧上优先；编辑器的内边距仍会应用到其他侧、所有部件上，结果中会说明这一点。物理侧保持物理侧，逻辑侧保持逻辑侧，且在每种文字方向上都是如此：如果你自己设置了 `paddingLeft`，编辑器的左侧内边距绝不会写入；如果你自己设置了 `paddingInlineStart`，编辑器的 `padding-left` 只会在从右到左时显示（此时起始侧是右侧）。你自己的源码为某个变体设置的内边距优先于部件普通规则上的编辑器内边距，无论该设置涉及哪些侧。

@josephfarina
