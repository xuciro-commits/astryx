---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor`：对主题自身源提供的 token 值进行统一检查，由 `show`、`set`、`undo` 和 `compile` 运行，各自以相同消息拒绝并且不写入任何内容。`[light, dark]` 对必须恰好包含引号中的两个值（一个、没有或三个都会被拒绝）。来自导入模块或写成表达式的值（`'ban' + 'ana'`、模板）会按构建求值的方式检查，并指出所在行。第二个 `tokens` 键会被拒绝，并指出两行（JavaScript 只保留最后一个）。一对引号中的字体族列表会像 `set` 拒绝它那样在文件中被拒绝（浏览器会把整个名称读作一个字体族）。`typography` 字段会被检查：字体族是一个字体族名称（其余放入 `fallbacks`），比例尺的比率大于 1 且至多 4，其基准为正尺寸。

@josephfarina
