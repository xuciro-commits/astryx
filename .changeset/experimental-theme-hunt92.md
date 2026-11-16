---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor`：命名多个部件的 `--on`（`'button, text-input'`、`button/text-input`、`'button and text-input'` 或空格分隔）会被拒绝，并为每个被命名的部件给出一个命令，绝不会给出一个用列表中的一个词命名的组。标志的标签位于值之后时（`'red mode: dark'`、`'red state: hover'`、`'red variant: primary'`、`'red part: card'`），读取方式与位于其之前相同，并给出 `--mode dark`、`--state hover`、`--when variant:primary` 或 `--on card`。在引号值内键入的标志（`'red --mode dark'`、`'4px --state hover'`、`'pill --on button'`）会被提取到所给出的命令中。

部件属性上的修复不会提供输入中原本没有的重置值（`0`、`none`、`1`、`auto`、`normal`）。背景多一层或为空时，会给出键入的层（`url(a.png), red`），`background` 上的裸数字不再被当作 px 位置提供。`border-radius round` 给出 `9999px`，`opacity half` 给出 `0.5`，`content Hi` 给出带引号的文本，`font-weight heavy` 给出其数字，`text-transform caps` 给出大写；其他词（`padding large`、`box-shadow soft`）指向 `how`，`2 spacing units` 不再被读取为 `2px`。作为字体族给出的数字或尺寸（`--font-family-body 700`）会作为字重或尺寸被拒绝，绝不会被加引号当作字体族。

带否定的词（`not round`、`rounded-none`、`not bold`、`no caps`、`not red`）绝不会被提供其否定的词：圆角会给出 `square`（并读取 `rounded-full` 和 `rounded-[12px]`），其余指向 `how`。

@josephfarina
