---
title: 'Vibe 测试'
description: '我们如何在 Astryx 中做决策'
date: '2026-07-27'
type: 'engineering'
authors:
  - 'cixzhang'
  - 'ernest'
tags:
  - 'AI'
  - '测试'
  - '设计系统'
coverImage: '/blog/vibe-tests/cover.png'
coverAlt: 'Astryx 吉祥物 Astracat 穿着实验服、戴着圆框眼镜，打扮成科学家的样子，正啜饮着烧瓶里的蓝色液体，两侧写着 vibe 和 test'
relatedDocs:
  - title: 'Astryx 是如何运作的'
    href: '/blog/how-astryx-works'
  - title: 'Vibe 测试 wiki'
    href: 'https://github.com/meta/astryx/wiki/Vibe-Tests'
---

项目刚开始时，AI 领域一片混乱。每隔一段时间就会冒出新方案（新框架、新的提示技巧、新的“agent 原生”模式），很难判断该把精力投到哪里。我们也坚信，一个设计良好、文档完善的系统应当对 AI 和人都同样友好。除了把工作开源、让模型在训练数据中学习之外，我们还可以选择上下文工程，但那样会带来内容过时和维护成本，几乎相当于再维护一套需要同步的代码。

所以我们需要一种方式来_度量_它。在 vibe 测试中，我们试着明确：希望设计系统的产出具备哪些具体特性——那些值得在代码库中维护、编码和度量的东西。

我们的[第一版 vibe 测试](https://github.com/meta/astryx/pull/57)搭建了测试工具：人物角色、一组提示词，以及一个评估器，它会对照预期组件清单，对生成代码中的“逃生舱”行为（幻觉组件、组件选择错误、包装 div、冗余 CSS）进行评分。它有效，但过于具体。它主要度量的是_系统遵循度_（agent 是否按我们希望的方式使用 Astryx），这预设了 Astryx 是正确答案，无法公平地与其他方案比较。

我们的[下一版](https://github.com/meta/astryx/pull/243)优先考虑_公平性_。我们把遵循度检查换成了目标中立的评估：同一套确定性分析在所有配置（Astryx、Tailwind、shadcn、原生 HTML）上运行，按照任何好的产出都应具备的特性评分，而不是看它是否像我们的风格。这样我们就能问出真正的问题：Astryx 真的更好，还是我们只是偏好它？

## 我们遵循的原则

在设计 vibe 测试时，我们会牢记这些原则：

- **模拟无先验环境。** 用户提示不应包含引导性语言，测试 agent 也不应继承任何 SOUL.md、MEMORY.md 或先前的上下文。提示应描述_用户体验_，而不是具体组件。例如，用“构建一个 FAQ 页面，用户点开每个问题”，而不是“用可折叠列表创建一个手风琴”。提示还应在各分类间保持合理覆盖，避免过度采样某一领域、只测试顺利路径。
- **让子 agent 保持无上下文。** 因为子 agent 通常会携带主 agent 的上下文，我们遵循[具体说明](https://github.com/meta/astryx/wiki/Vibe-Evaluation#sub-agent-isolation)来确保隔离，防止上下文以扭曲结果的方式泄漏。
- **每个测试缩小到 3 到 5 个候选方案。** 它们可以是小的设计细节（组件抽象层级、API 命名、配置形态），也可以是框架级决策，比如用 StyleX 与 Tailwind、shadcn、原生 HTML 对比测试 Astryx。
- **让独立的 agent 担任裁判。** 子 agent 跑完所有提示词之后，会启动一个裁判 agent 来比较所有结果。重要的是子 agent _不要_自我评判；我们发现自我评判会削弱发现不同结果差异的能力。

裁判们遵循我们在 Astryx wiki 中记录的一套评分标准，其中融入了对 Astryx 重要的方面。例如：

- [Astryx 系统测试](https://github.com/meta/astryx/wiki/Vibe-Evaluation#what-gets-measured)评估：正确性、无障碍、代码质量、效率、可维护性和设计维度。（设计维度通过渲染截图与参考图对比评分，仍在完善中。）
- [Astryx 的 API 测试](https://github.com/meta/astryx/wiki/API-Arbitration#what-to-look-for)评估：可发现性、幻觉、多余 div、冗长代码和未使用特性维度。

## 报告与自愈

因为 vibe 测试可以大规模、高频率地运行，我们_每晚_都通过一个[夜间定时任务](https://github.com/meta/astryx/wiki/Night-Watch-Vibe-Test-Runner)来跑，它会启动一个 AI 编排器：同一组提示词覆盖全部四种配置，按全部六个维度评分。我们称之为[守夜（night watches）](https://github.com/meta/astryx/wiki/Night-Watch-Overview)，它们帮助自动管理系统的各个部分。这给了我们一张滚动记分卡，而不是一次性的快照。

下面是一个表现不错的夜晚（[2026-07-10](https://github.com/meta/astryx/wiki/Vibe-Test-Scores)）。各目标的总览：

| 目标                    | 总分   |
| ----------------------- | ------ |
| **Astryx**              | **98** |
| Astryx + Tailwind       | 97     |
| 基线（shadcn/Tailwind） | 95     |
| 原生 HTML               | 82     |

以及 Astryx 自己在那一轮的维度得分：

| 维度     | 分数           |
| -------- | -------------- |
| 正确性   | 100            |
| 无障碍   | 100            |
| 代码质量 | 100            |
| 效率     | 88             |
| 可维护性 | 100            |
| 设计     | _完善中的维度_ |

并不总是这么好。AI agent 不是确定性的，有些夜晚会跑偏。下面是一个糟糕的夜晚（[2026-06-28](https://github.com/meta/astryx/wiki/Vibe-Test-Scores)）：Astryx 的总分掉到 77，输给了基线。

| 维度     | 分数           |
| -------- | -------------- |
| 正确性   | **2**          |
| 无障碍   | 98             |
| 代码质量 | 99             |
| 效率     | 91             |
| 可维护性 | 96             |
| 设计     | _完善中的维度_ |

除了正确性，其他维度都稳住了，而正确性直接崩了。agent 在少数提示词上幻觉出了导入和 prop 名，一个糟糕的分类拖垮了整个夜晚。纵观我们的完整记录，基线实际上赢下了最多的夜晚；我们并不总是赢，而记分卡之所以公开，正是为了让我们无法掩盖这一点。

每晚运行的好处是我们可以跟进。一轮测试结束后，第二个守夜任务——[vibe 测试调试器](https://github.com/meta/astryx/wiki/Night-Watch-Vibe-Test-Debugger)——会接手。它读取失败的提示词，对每个失败进行分类，并针对我们的文档或 CLI 提交 PR（[比如这个](https://github.com/meta/astryx/pull/3907)）来修复可修复的问题。

我们发现，AI 在解决 vibe 测试问题时会倾向于过度针对单次测试中遇到的具体问题，因此调试器被要求寻找反复出现的模式，并通过复现 vibe 测试问题来提供证据，而不是追逐某个糟糕夜晚的一次性波动。

## 设计你自己的测试

Vibe 测试不只用于我们自己的决策。你可以把它指向社区发布的几乎任何东西，判断是否值得跟进，也可以用作 API 检查或探索工具。Vibe 测试成了我们快速评估新想法、缩小投入方向的指南针。一些真正影响了 Astryx 设计的例子：

- [token 命名结构](https://github.com/meta/astryx/issues/864)
- [选择器 API](https://github.com/meta/astryx/issues/477)
- [CLI vs MCP](https://github.com/meta/astryx/issues/2306)

例如，当 [impeccable 前端技能](https://impeccable.style/)发布时，我们[探索了用 Astryx 组件对它们进行 vibe 测试](https://github.com/meta/astryx/issues/1000)。

只要给 AI agent 提供几个关键要素，你就能设计自己的 vibe 测试。[让你的 agent 按这里的说明操作。](https://github.com/meta/astryx/wiki/Designing-Vibe-Tests) 希望这套方法能帮助大家在疯狂的 AI 世界里找准方向！
