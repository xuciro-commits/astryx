---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor`：你的 `<theme>.theme.ts` 给出的 token 值会按书写内容逐项检查，`show` 和 `compile` 会以同一条消息拒绝。数字（`'--radius-page': 12`）会被指出不是文本，正如 `show` 已经说明的那样；`--font-family-*` token 会按 `set` 的检查方式检查（完全用引号括起的字族列表，即 Core 返回的形式，会被接受）；`[light, dark]` 对的每一半都会检查；作为文本的计算键（`['--radius-page']`）会像字面量一样读取，而编辑器无法读取的键会被指出未检查。拒绝信息会指出设置该 token 的那一行，绝不会指向提及其的注释。

@josephfarina
