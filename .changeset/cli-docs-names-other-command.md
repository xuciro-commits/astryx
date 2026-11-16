---
'@astryxdesign/cli': patch
---

[feat] `astryx docs <name>` 在名称是组件、Hook 或模板而非文档主题时，会指向正确的命令。读取仍会以 `ERR_UNKNOWN_TOPIC` 失败，但其第一条建议现在是指向读取该条目的命令，例如 `astryx component Button`、`astryx hook useHotkeys` 或 `astryx template ai-chat`。只有精确名称才算数，不区分大小写，带不带空格和连字符均可（`docs text-input` 指向 `astryx component TextInput`）；Hook 也接受不带 `use` 的名称。该建议保持通常的 `{name, reason}` 结构，并占据最后一条建议的位置，因此列表不会变长。当没有任何文档主题与该名称共享一个词时，它会是唯一的建议，而不是整个主题列表。该检查先读取文件名，不为其他名称加载任何文档，因此文档未命中时依然很快。文档路由和文档拼写错误得到的建议与之前相同。`doctor` 的缓存行会列出文档未找到提示的名称摘要。

@josephfarina
