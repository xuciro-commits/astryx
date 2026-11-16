---
'@astryxdesign/cli': patch
---

[fix] 四个 Core 页面模板不再列出其页面不会渲染的内容所对应的关键词，因此 `astryx build` 和 `astryx search` 不再针对这些概念推荐它们。AI Chat Conversation 去掉 "citations"、"reasoning" 和 "playground"；Kanban Board 去掉 "swimlane" 和 "backlog"；Page Editor 去掉 "drag and drop"；Theme Showcase 去掉 "tokens"、"palette" 和 "typography"。Page Editor 和 Theme Showcase 的描述现在会说明页面的渲染内容：区块可通过上移和下移重新排序，展示页会在当前主题下显示示例产品界面。

@josephfarina
