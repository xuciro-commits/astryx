---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor`：输入内容会按其本意读取并检查。

- 以标志形式输入的旋钮（`set <theme> --corners round`）会按"旋钮应以连字符形式输入"被拒绝，并提示改用旋钮形式（`set <theme> corners round`），绝不会变成空的 token 列表。
- 你的 `<theme>.theme.ts` 提供、但 `set` 拒绝的 token 值（`'--radius-page': 'banana'`）会按相同规则检查：`show`、`set` 和 `compile` 会在构建任何内容之前拒绝它，并指出该 token 及其行号。
- 以模块名（`brandTheme`）输入的主题就是主题 `brand`，绝不会成为第二个主题。
- 部件颜色上的亮色与暗色（`background 'light: #fff; dark: #000' --on card`）会写为该属性的 `light-dark()` 配对。
- 传给 `set` 的 JSON 设置对象会为每个条目生成一行 set 命令。
- 带转义引号的字体栈（`\"Inter\", sans-serif`）会按字体栈读取。
- 部件以 camelCase 列出的状态（toggle-button 的 `isPressed`）可用任意拼写输入，而 `pressed` 会提示它。
- 设置列表中的 `mode` 或 `base` 条目会被 `show` 指出在那里不起作用，并给出将其移除的 `undo`。
- 粘贴的包含两个声明的行（`accent: red; text-size: 18`）会设置第一个，并说明第二个未设置，同时给出其自己的 set 行。

@josephfarina
