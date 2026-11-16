---
schema_version: 1
template_version: 1
kind: design
id: design:agentic-states
authority: draft
archive_reason: null
superseded_by: null
approved_by: null
approved_at: null
owners: [ernestt, cixzhang]
review_triggers: [visual, interaction, accessibility]
verified_by: []
architecture: [architecture:theme-tokens]
components: []
families: []
deciding_specs: []
---

# Agentic states design specification

## User intent

与智能体协作的人应当能够理解它是在取得进展、等待、检查、同步还是呈现结果，而无需学习另一套不相关的状态语言。智能体反馈应传达可操作的系统状态，而不是暴露私有或隐藏的推理。

本种子记录点明了尚未解决的设计领域。它有意不批准各个智能体状态的视觉处理。

## Design principles

- **DR1 — 优先扩展现有状态语言。** 当底层意图相同时，智能体状态应复用 `design:user-states` 和 `design:system-states` 中的表示。

本种子草案未批准其他智能体状态设计需求。下列问题指出了仍需要人工决策的领域。

## Anatomy and hierarchy

该 wiki 未定义智能体状态的结构或关系。这些内容留待未来的提案，而不是由本种子草案推断。

## State representation

本种子草案未批准任何智能体状态的视觉表示。候选处理方案必须首先说明现有的加载、处理、状态、选中或瞬态覆盖层语言为何不足。

## Responsive and input behavior

本种子草案未批准任何智能体状态的响应式或输入要求。候选提案必须作为相关待决问题的一部分，处理重排下的归属、增量输出、中断和减少动效。

## Accessibility intent

无障碍要求仍与视觉处理一同悬而未决。每份提案都应评估非动效和非颜色替代方案、播报频率、焦点稳定性、阅读位置和输入可操作性，而不在本草案中预设答案。

本记录不要求披露隐藏的思维链。任何用户可见的理由说明都属于产品内容，必须遵循其自身的隐私、安全和内容契约。

## Representative examples

尚无规范性的表示。候选示例应比较复用现有系统状态反馈与任何提议的智能体专属处理，并解释新处理服务于什么用户需求。

## Visual references

不包含规范性视觉素材。只有在下列某项待决问题获得提议的处理方案后，才应添加候选证据。

## Component contract links

未声明任何组件契约链接。在各项状态表示得到决定和批准之前，面向智能体的组件不应声称已采用。

## Decision log

尚未批准任何智能体状态的视觉决策。公共 Design Conventions wiki 明确将该领域标记为主要未定义；本草案保留这种不确定性，而不是将标签转化为政策。

## Open questions

- **OQ1 — 思考或处理。** 智能体工作何时需要一种区别于普通系统处理的表示？
- **OQ2 — 用户可见的理由说明。** 如果有的话，何种处理能将有意撰写的说明与普通输出区分开，同时又不暗示可以访问隐藏推理？
- **OQ3 — 流式输出。** 增量文本应如何保持可见的不完整状态，同时又不分散对已可用文本的注意力？
- **OQ4 — 工具执行。** 关于后端工作的哪些信息对用户有用，何时应保持折叠？
- **OQ5 — 等待输入。** 所需的人工响应应如何在保留周围任务上下文的同时，优先于被动的进度？
- **OQ6 — 同步中与已同步。** 待定和已完成的同步应如何区别于普通处理和成功？
- **OQ7 — 检查。** 智能体检查是否需要一种独特状态，还是普通进度加上限定范围的上下文就足够了？
- **OQ8 — 渲染。** 生成的 UI 应如何传达部分挂载和完成，而不暴露实现层面的频繁变动？

## Content boundary

本文件描述尚未解决的、面向人的智能体状态。它不定义智能体协议、隐藏推理披露、工具遥测、进度事件模式、产品文案、实现机制或已批准的视觉处理。
