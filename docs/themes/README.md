# 主题规范

主题规范是归属于某个已发布主题包的决策的规范所有者：其受众与视觉意图、继承的基础、可移植 token 选择、主题本地角色、色调调色板色族与选定的色调、组件/状态映射、兼容性、产物形态以及测量证据。

主题规范与各自的包同置，位于 `packages/themes/<theme>/<theme>.spec.md`，类似于组件规范。本页是指导与索引，不是规范记录。请从 `docs/templates/knowledge/theme-spec.md` 开始创建记录，并使用 `theme:<package-theme-name>` 形式的 id（例如 `theme:neutral`）。

当前记录：

- [Neutral](../../packages/themes/neutral/neutral.spec.md) —— 当前
- [Stone](../../packages/themes/stone/stone.spec.md) —— 当前
- [Gothic](../../packages/themes/gothic/gothic.spec.md) —— 当前
- [Matcha](../../packages/themes/matcha/matcha.spec.md) —— 当前
- [Butter](../../packages/themes/butter/butter.spec.md) —— 当前
- [Y2K](../../packages/themes/y2k/y2k.spec.md) —— 当前

一条主题记录位于系统主题化架构与消费方/组件记录之间。它使用一个带类型的 `references` 列表来处理架构、设计、系统和其他知识关系，而不是使用单独的关系字段：

- 架构与系统规范拥有跨主题 API、词汇边界、继承规则、验证、编译器行为以及共享产物策略；
- 设计记录拥有跨主题的视觉与无障碍方法论，包括对比度证据的评判方式；
- 架构/工具链拥有共享测量实现；
- 包本地主题规范拥有该方法论的应用：选定的 token/调色板映射、必需的配对/状态、例外、测量回执以及已知差距；
- 组件与家族记录拥有可观察的组件行为；以及
- 消费方文档拥有受支持的语法、示例与使用指导。

只有 `current` 记录才是政策。在决策制定过程中，草案可以链接另一个草案，但 current 记录只能依赖 current 记录。当前主题记录要求其内容（`architecture:knowledge-contracts` DEC-14）获得 `.github/ENGOWNERS` 与 `.github/DESIGNOWNERS` 已提交并集的批准。主题记录不声明 `owners` 字段，记录元数据永远不会授予批准权限。
